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
import { QueryBaseDto } from '../../shared/dto/query-base.dto';
import { BlogLikeType } from '../../shared/enums/blog.enum';
import { CreateBlogLikeDto } from './dto/create-blog-like.dto';
import { QueryBlogLikeDto } from './dto/query-blog-like.dto';
import { BlogLike } from './entities/blog-like.entity';
import { IBlogLikesService } from './interfaces/blog-likes-service.interface';

@Injectable()
export class BlogLikesService implements IBlogLikesService {
  private readonly queryConfig: QueryConfig<BlogLike> = {
    alias: 'blogLike',
    searchFields: [],
    sortableFields: ['createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'blogLike.account', alias: 'account', type: 'left' },
      { relation: 'blogLike.blog', alias: 'blog', type: 'left' },
    ],
    customFilters: (qb, query: QueryBaseDto) => {
      const blogQuery = query as QueryBlogLikeDto;
      if (blogQuery.blogId) {
        qb.andWhere('blogLike.blogId = :blogId', { blogId: blogQuery.blogId });
      }
    },
  };

  constructor(
    @InjectRepository(BlogLike)
    private readonly blogLikeRepository: Repository<BlogLike>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async likeDislike(createBlogLikeDto: CreateBlogLikeDto): Promise<BlogLike> {
    const existingLike = await this.blogLikeRepository.findOne({
      where: {
        blogId: createBlogLikeDto.blogId,
        accountId: createBlogLikeDto.accountId,
      },
    });

    if (existingLike) {
      existingLike.type =
        existingLike.type === BlogLikeType.LIKE
          ? BlogLikeType.DISLIKE
          : BlogLikeType.LIKE;
      const updatedBlogLike = await this.blogLikeRepository.save(existingLike);
      await this.clearBlogLikeCache(updatedBlogLike.settingId);
      return updatedBlogLike;
    }

    const blogLike = this.blogLikeRepository.create(createBlogLikeDto);
    const savedBlogLike = await this.blogLikeRepository.save(blogLike);
    await this.clearBlogLikeCache(savedBlogLike.settingId);
    return savedBlogLike;
  }

  async findAll(query: QueryBlogLikeDto): Promise<PaginatedResult<BlogLike>> {
    const cacheKey = `blogLike:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BlogLike>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogLikeRepository,
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
    query: QueryBlogLikeDto,
  ): Promise<PaginatedResult<BlogLike>> {
    query.blogId = blogId;
    return this.findAll(query);
  }

  private async clearBlogLikeCache(
    settingId: string,
    blogLikeId?: string,
  ): Promise<void> {
    const patterns: string[] = ['blogLikes:list:*', 'blogLikeStats:*'];

    if (blogLikeId) {
      patterns.push(`blogLike:${blogLikeId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
