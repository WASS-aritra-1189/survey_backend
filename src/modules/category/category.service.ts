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
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ICategoryService } from './interfaces/category-service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly queryConfig: QueryConfig<Category> = {
    alias: 'category',
    searchFields: ['name', 'desc'],
    sortableFields: ['name', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryCategoryDto) => {
      if (query.status?.length) {
        qb.andWhere('category.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
        // settingId: createCategoryDto.settingId,
      },
    });
    if (existingCategory) {
      throw new CustomException(
        MESSAGE_CODES.CATEGORY_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    await this.clearCategoryCache(savedCategory.settingId);
    return savedCategory;
  }

  async findAll(query: QueryCategoryDto): Promise<PaginatedResult<Category>> {
    const cacheKey = `category:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Category>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.categoryRepository,
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

  async findOne(id: string): Promise<Category> {
    const cacheKey = `category:${id}`;
    const cachedCategory = await this.cacheService.get<Category>(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new CustomException(
        MESSAGE_CODES.CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, category, 300);
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new CustomException(
        MESSAGE_CODES.CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          settingId: category.settingId,
        },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.CATEGORY_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);
    await this.clearCategoryCache(updatedCategory.settingId, id);
    return updatedCategory;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new CustomException(
        MESSAGE_CODES.CATEGORY_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    category.status = status;
    category.updatedBy = updatedBy;
    const updatedCategory = await this.categoryRepository.save(category);
    await this.clearCategoryCache(updatedCategory.settingId, id);
    return updatedCategory;
  }

  private async clearCategoryCache(
    settingId: string,
    categoryId?: string,
  ): Promise<void> {
    const patterns: string[] = ['categories:list:*'];

    if (categoryId) {
      patterns.push(`category:${categoryId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
