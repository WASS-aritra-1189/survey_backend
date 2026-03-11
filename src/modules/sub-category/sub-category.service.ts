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
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { ISubCategoryService } from './interfaces/sub-category-service.interface';

@Injectable()
export class SubCategoryService implements ISubCategoryService {
  private readonly queryConfig: QueryConfig<SubCategory> = {
    alias: 'subCategory',
    searchFields: ['name', 'desc'],
    sortableFields: ['name', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QuerySubCategoryDto) => {
      if (query.status?.length) {
        qb.andWhere('subCategory.status IN (:...status)', {
          status: query.status,
        });
      }
      if (query.settingId) {
        qb.andWhere('subCategory.settingId = :settingId', {
          settingId: query.settingId,
        });
      }
      if (query.categoryId?.length) {
        qb.andWhere('subCategory.categoryId IN (:...categoryId)', {
          categoryId: query.categoryId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const existingSubCategory = await this.subCategoryRepository.findOne({
      where: {
        name: createSubCategoryDto.name,
        categoryId: createSubCategoryDto.categoryId,
      },
    });
    if (existingSubCategory) {
      throw new CustomException(
        MESSAGE_CODES.SUB_CATEGORY_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);
    const savedSubCategory = await this.subCategoryRepository.save(subCategory);
    await this.clearSubCategoryCache(savedSubCategory.settingId);
    return savedSubCategory;
  }

  async findAll(
    query: QuerySubCategoryDto,
  ): Promise<PaginatedResult<SubCategory>> {
    const cacheKey = `subCategory:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<SubCategory>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.subCategoryRepository,
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

  async findOne(id: string): Promise<SubCategory> {
    const cacheKey = `subCategory:${id}`;
    const cachedSubCategory =
      await this.cacheService.get<SubCategory>(cacheKey);
    if (cachedSubCategory) {
      return cachedSubCategory;
    }

    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category', 'setting'],
    });
    if (!subCategory) {
      throw new CustomException(
        MESSAGE_CODES.SUB_CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, subCategory, 300);
    return subCategory;
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory) {
      throw new CustomException(
        MESSAGE_CODES.SUB_CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      updateSubCategoryDto.name &&
      updateSubCategoryDto.name !== subCategory.name
    ) {
      const existingSubCategory = await this.subCategoryRepository.findOne({
        where: {
          name: updateSubCategoryDto.name,
          categoryId: subCategory.categoryId,
        },
      });
      if (existingSubCategory && existingSubCategory.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.SUB_CATEGORY_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(subCategory, updateSubCategoryDto);
    const updatedSubCategory =
      await this.subCategoryRepository.save(subCategory);
    await this.clearSubCategoryCache(updatedSubCategory.settingId, id);
    return updatedSubCategory;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory) {
      throw new CustomException(
        MESSAGE_CODES.SUB_CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    subCategory.status = status;
    subCategory.updatedBy = updatedBy;
    const updatedSubCategory =
      await this.subCategoryRepository.save(subCategory);
    await this.clearSubCategoryCache(updatedSubCategory.settingId, id);
    return updatedSubCategory;
  }

  private async clearSubCategoryCache(
    settingId: string,
    subCategoryId?: string,
  ): Promise<void> {
    const patterns: string[] = ['subCategories:list:*'];

    if (subCategoryId) {
      patterns.push(`subCategory:${subCategoryId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
