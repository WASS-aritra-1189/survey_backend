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
import { CreateDesignationDto } from './dto/create-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';
import { IDesignationsService } from './interfaces/designations-service.interface';

@Injectable()
export class DesignationsService implements IDesignationsService {
  private readonly queryConfig: QueryConfig<Designation> = {
    alias: 'designation',
    searchFields: ['name', 'description'],
    sortableFields: ['name', 'priority', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryDesignationDto) => {
      if (query.status?.length) {
        qb.andWhere('designation.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    const existingDesignation = await this.designationRepository.findOne({
      where: {
        name: createDesignationDto.name,
        // settingId: createDesignationDto.settingId,
      },
    });
    if (existingDesignation) {
      throw new CustomException(
        MESSAGE_CODES.DESIGNATION_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const designation = this.designationRepository.create(createDesignationDto);
    const savedDesignation = await this.designationRepository.save(designation);
    await this.clearDesignationCache(savedDesignation.settingId);
    return savedDesignation;
  }

  async findAll(
    query: QueryDesignationDto,
  ): Promise<PaginatedResult<Designation>> {
    const cacheKey = `designation:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Designation>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.designationRepository,
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

  async findOne(id: string): Promise<Designation> {
    const cacheKey = `designation:${id}`;
    const cachedDesignation =
      await this.cacheService.get<Designation>(cacheKey);
    if (cachedDesignation) {
      return cachedDesignation;
    }

    const designation = await this.designationRepository.findOne({
      where: { id },
    });
    if (!designation) {
      throw new CustomException(
        MESSAGE_CODES.DESIGNATION_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, designation, 300);
    return designation;
  }

  async update(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { id },
    });
    if (!designation) {
      throw new CustomException(
        MESSAGE_CODES.DESIGNATION_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      updateDesignationDto.name &&
      updateDesignationDto.name !== designation.name
    ) {
      const existingDesignation = await this.designationRepository.findOne({
        where: {
          name: updateDesignationDto.name,
          settingId: designation.settingId,
        },
      });
      if (existingDesignation && existingDesignation.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.DESIGNATION_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(designation, updateDesignationDto);
    const updatedDesignation =
      await this.designationRepository.save(designation);
    await this.clearDesignationCache(updatedDesignation.settingId, id);
    return updatedDesignation;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { id },
    });
    if (!designation) {
      throw new CustomException(
        MESSAGE_CODES.DESIGNATION_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    designation.status = status;
    designation.updatedBy = updatedBy;
    const updatedDesignation =
      await this.designationRepository.save(designation);
    await this.clearDesignationCache(updatedDesignation.settingId, id);
    return updatedDesignation;
  }

  private async clearDesignationCache(
    settingId: string,
    designationId?: string,
  ): Promise<void> {
    const patterns: string[] = ['designations:list:*'];

    if (designationId) {
      patterns.push(`designation:${designationId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
