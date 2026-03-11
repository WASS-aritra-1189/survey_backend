/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateCountryDto } from './dto/create-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { ICountryService } from './interfaces/country-service.interface';

@Injectable()
export class CountryService implements ICountryService {
  private readonly queryConfig: QueryConfig<Country> = {
    alias: 'country',
    searchFields: ['name', 'code'],
    sortableFields: ['name', 'code', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'name',
    customFilters: (qb, query: QueryCountryDto) => {
      if (query.status?.length) {
        qb.andWhere('country.status IN (:...status)', { status: query.status });
      }
    },
  };

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const existingName = await this.countryRepository.findOne({
      where: { name: createCountryDto.name },
    });
    if (existingName) {
      throw new CustomException(
        MESSAGE_CODES.COUNTRY_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const existingCode = await this.countryRepository.findOne({
      where: { code: createCountryDto.code },
    });
    if (existingCode) {
      throw new CustomException(
        MESSAGE_CODES.COUNTRY_CODE_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const country = this.countryRepository.create(createCountryDto);
    const savedCountry = await this.countryRepository.save(country);
    await this.clearCountryCache();
    return savedCountry;
  }

  async findAll(query: QueryCountryDto): Promise<PaginatedResult<Country>> {
    const cacheKey = `country:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Country>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.countryRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );
    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string): Promise<Country> {
    const cacheKey = `country:${id}`;
    const cached = await this.cacheService.get<Country>(cacheKey);
    if (cached) {
      return cached;
    }

    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['states', 'cities'],
    });
    if (!country) {
      throw new CustomException(
        MESSAGE_CODES.COUNTRY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, country, 300);
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new CustomException(
        MESSAGE_CODES.COUNTRY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateCountryDto.name && updateCountryDto.name !== country.name) {
      const existing = await this.countryRepository.findOne({
        where: { name: updateCountryDto.name },
      });
      if (existing && existing.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.COUNTRY_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateCountryDto.code && updateCountryDto.code !== country.code) {
      const existing = await this.countryRepository.findOne({
        where: { code: updateCountryDto.code },
      });
      if (existing && existing.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.COUNTRY_CODE_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(country, updateCountryDto);
    const updated = await this.countryRepository.save(country);
    await this.clearCountryCache(id);
    return updated;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new CustomException(
        MESSAGE_CODES.COUNTRY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    country.status = status;
    country.updatedBy = updatedBy;
    const updated = await this.countryRepository.save(country);
    await this.clearCountryCache(id);
    return updated;
  }

  private async clearCountryCache(countryId?: string): Promise<void> {
    const patterns: string[] = ['countries:list:*'];
    if (countryId) {
      patterns.push(`country:${countryId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
