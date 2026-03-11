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
import { CreateCityDto } from './dto/create-city.dto';
import { QueryCityDto } from './dto/query-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { ICityService } from './interfaces/city-service.interface';

@Injectable()
export class CityService implements ICityService {
  private readonly queryConfig: QueryConfig<City> = {
    alias: 'city',
    searchFields: ['name', 'code'],
    sortableFields: ['name', 'code', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'name',
    customFilters: (qb, query: QueryCityDto) => {
      if (query.status?.length) {
        qb.andWhere('city.status IN (:...status)', { status: query.status });
      }
      if (query.countryId?.length) {
        qb.andWhere('city.countryId IN (:...countryId)', {
          countryId: query.countryId,
        });
      }
      if (query.stateId?.length) {
        qb.andWhere('city.stateId IN (:...stateId)', { stateId: query.stateId });
      }
    },
  };

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const existing = await this.cityRepository.findOne({
      where: { name: createCityDto.name, stateId: createCityDto.stateId },
    });
    if (existing) {
      throw new CustomException(
        MESSAGE_CODES.CITY_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const city = this.cityRepository.create(createCityDto);
    const saved = await this.cityRepository.save(city);
    await this.clearCityCache();
    return saved;
  }

  async findAll(query: QueryCityDto): Promise<PaginatedResult<City>> {
    const cacheKey = `city:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get<PaginatedResult<City>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.cityRepository,
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

  async findOne(id: string): Promise<City> {
    const cacheKey = `city:${id}`;
    const cached = await this.cacheService.get<City>(cacheKey);
    if (cached) {
      return cached;
    }

    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['country', 'state'],
    });
    if (!city) {
      throw new CustomException(
        MESSAGE_CODES.CITY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, city, 300);
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new CustomException(
        MESSAGE_CODES.CITY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateCityDto.name && updateCityDto.name !== city.name) {
      const existing = await this.cityRepository.findOne({
        where: { name: updateCityDto.name, stateId: city.stateId },
      });
      if (existing && existing.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.CITY_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(city, updateCityDto);
    const updated = await this.cityRepository.save(city);
    await this.clearCityCache(id);
    return updated;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new CustomException(
        MESSAGE_CODES.CITY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    city.status = status;
    city.updatedBy = updatedBy;
    const updated = await this.cityRepository.save(city);
    await this.clearCityCache(id);
    return updated;
  }

  private async clearCityCache(cityId?: string): Promise<void> {
    const patterns: string[] = ['cities:list:*'];
    if (cityId) {
      patterns.push(`city:${cityId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
