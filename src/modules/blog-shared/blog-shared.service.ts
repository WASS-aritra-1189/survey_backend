/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { CreateBlogSharedDto } from './dto/create-blog-shared.dto';
import { QueryBlogSharedDto } from './dto/query-blog-shared.dto';
import { BlogShared } from './entities/blog-shared.entity';
import { IBlogSharedService } from './interfaces/blog-shared-service.interface';

@Injectable()
export class BlogSharedService implements IBlogSharedService {
  private readonly queryConfig: QueryConfig<BlogShared> = {
    alias: 'blogShared',
    sortableFields: ['createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'blogLike.account', alias: 'account', type: 'left' },
      { relation: 'blogLike.blog', alias: 'blog', type: 'left' },
    ],
    customFilters: (qb, query: QueryBlogSharedDto) => {
      if (query.blogId) {
        qb.andWhere('blogShared.blogId = :blogId', { blogId: query.blogId });
      }
    },
  };

  constructor(
    @InjectRepository(BlogShared)
    private readonly blogSharedRepository: Repository<BlogShared>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createBlogSharedDto: CreateBlogSharedDto): Promise<BlogShared> {
    const blogShared = this.blogSharedRepository.create(createBlogSharedDto);
    const savedBlogShared = await this.blogSharedRepository.save(blogShared);
    await this.clearBlogSharedCache(savedBlogShared.settingId);
    return savedBlogShared;
  }

  async findAll(
    query: QueryBlogSharedDto,
  ): Promise<PaginatedResult<BlogShared>> {
    const cacheKey = `blogShared:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BlogShared>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogSharedRepository,
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

  async findByBlog(
    blogId: string,
    query: QueryBlogSharedDto,
  ): Promise<PaginatedResult<BlogShared>> {
    query.blogId = blogId;
    return this.findAll(query);
  }

  private async clearBlogSharedCache(
    settingId: string,
    blogSharedId?: string,
  ): Promise<void> {
    const patterns: string[] = ['blogShared:list:*', 'blogShareStats:*'];

    if (blogSharedId) {
      patterns.push(`blogShared:${blogSharedId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
