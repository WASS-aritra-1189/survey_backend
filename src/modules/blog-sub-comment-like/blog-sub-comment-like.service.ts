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
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateBlogSubCommentLikeDto } from './dto/create-blog-sub-comment-like.dto';
import { QueryBlogSubCommentLikeDto } from './dto/query-blog-sub-comment-like.dto';
import { BlogSubCommentLike } from './entities/blog-sub-comment-like.entity';
import { IBlogSubCommentLikeService } from './interfaces/blog-sub-comment-like-service.interface';

@Injectable()
export class BlogSubCommentLikeService implements IBlogSubCommentLikeService {
  private readonly queryConfig: QueryConfig<BlogSubCommentLike> = {
    alias: 'blogSubCommentLike',
    searchFields: [],
    sortableFields: ['createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'blogSubCommentLike.account', alias: 'account' },
      {
        relation: 'blogSubCommentLike.blogSubComment',
        alias: 'blogSubComment',
      },
    ],
    customFilters: (qb, query: QueryBlogSubCommentLikeDto) => {
      if (query.blogId) {
        qb.andWhere('blogSubCommentLike.blogId = :blogId', {
          blogId: query.blogId,
        });
      }
      if (query.blogCommentId) {
        qb.andWhere('blogSubCommentLike.blogCommentId = :blogCommentId', {
          blogCommentId: query.blogCommentId,
        });
      }
      if (query.blogSubCommentId) {
        qb.andWhere('blogSubCommentLike.blogSubCommentId = :blogSubCommentId', {
          blogSubCommentId: query.blogSubCommentId,
        });
      }
      if (query.accountId) {
        qb.andWhere('blogSubCommentLike.accountId = :accountId', {
          accountId: query.accountId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(BlogSubCommentLike)
    private readonly blogSubCommentLikeRepository: Repository<BlogSubCommentLike>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createBlogSubCommentLikeDto: CreateBlogSubCommentLikeDto,
  ): Promise<BlogSubCommentLike> {
    const existingLike = await this.blogSubCommentLikeRepository.findOne({
      where: {
        blogSubCommentId: createBlogSubCommentLikeDto.blogSubCommentId,
        accountId: createBlogSubCommentLikeDto.accountId,
      },
    });

    if (existingLike) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SUB_COMMENT_LIKE_ALREADY_EXISTS,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const blogSubCommentLike = this.blogSubCommentLikeRepository.create(
      createBlogSubCommentLikeDto,
    );
    const savedBlogSubCommentLike =
      await this.blogSubCommentLikeRepository.save(blogSubCommentLike);
    await this.clearBlogSubCommentLikeCache(savedBlogSubCommentLike.settingId);
    return savedBlogSubCommentLike;
  }

  async findAll(
    query: QueryBlogSubCommentLikeDto,
  ): Promise<PaginatedResult<BlogSubCommentLike>> {
    const cacheKey = `blogSubCommentLike:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BlogSubCommentLike>>(
        cacheKey,
      );

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogSubCommentLikeRepository,
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

  async findOne(id: string): Promise<BlogSubCommentLike> {
    const cacheKey = `blogSubCommentLike:${id}`;
    const cachedBlogSubCommentLike =
      await this.cacheService.get<BlogSubCommentLike>(cacheKey);
    if (cachedBlogSubCommentLike) {
      return cachedBlogSubCommentLike;
    }

    const blogSubCommentLike = await this.blogSubCommentLikeRepository.findOne({
      where: { id },
      relations: ['account', 'blogSubComment'],
    });
    if (!blogSubCommentLike) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SUB_COMMENT_LIKE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, blogSubCommentLike, 300);
    return blogSubCommentLike;
  }

  async findBySubComment(
    blogSubCommentId: string,
    query: QueryBlogSubCommentLikeDto,
  ): Promise<PaginatedResult<BlogSubCommentLike>> {
    query.blogSubCommentId = blogSubCommentId;
    return this.findAll(query);
  }

  async findByAccount(
    accountId: string,
    query: QueryBlogSubCommentLikeDto,
  ): Promise<PaginatedResult<BlogSubCommentLike>> {
    query.accountId = accountId;
    return this.findAll(query);
  }

  async toggle(
    blogSubCommentId: string,
    accountId: string,
  ): Promise<{ liked: boolean; totalLikes: number }> {
    const existingLike = await this.blogSubCommentLikeRepository.findOne({
      where: { blogSubCommentId, accountId },
    });

    if (existingLike) {
      await this.blogSubCommentLikeRepository.remove(existingLike);
      await this.clearBlogSubCommentLikeCache(existingLike.settingId);
      const totalLikes = await this.blogSubCommentLikeRepository.count({
        where: { blogSubCommentId },
      });
      return { liked: false, totalLikes };
    } else {
      const blogSubCommentLike = this.blogSubCommentLikeRepository.create({
        blogSubCommentId,
        accountId,
      });
      const savedLike =
        await this.blogSubCommentLikeRepository.save(blogSubCommentLike);
      await this.clearBlogSubCommentLikeCache(savedLike.settingId);
      const totalLikes = await this.blogSubCommentLikeRepository.count({
        where: { blogSubCommentId },
      });
      return { liked: true, totalLikes };
    }
  }

  async getLikeStats(
    blogSubCommentId: string,
    accountId?: string,
  ): Promise<{ totalLikes: number; isLikedByUser: boolean }> {
    const cacheKey = `blogSubCommentLikeStats:${blogSubCommentId}:${accountId || 'anonymous'}`;
    const cached = await this.cacheService.get<{
      totalLikes: number;
      isLikedByUser: boolean;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const totalLikes = await this.blogSubCommentLikeRepository.count({
      where: { blogSubCommentId },
    });
    let isLikedByUser = false;

    if (accountId) {
      const userLike = await this.blogSubCommentLikeRepository.findOne({
        where: { blogSubCommentId, accountId },
      });
      isLikedByUser = !!userLike;
    }

    const result = { totalLikes, isLikedByUser };
    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  async remove(blogSubCommentId: string, accountId: string): Promise<void> {
    const blogSubCommentLike = await this.blogSubCommentLikeRepository.findOne({
      where: { blogSubCommentId, accountId },
    });

    if (!blogSubCommentLike) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SUB_COMMENT_LIKE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.blogSubCommentLikeRepository.remove(blogSubCommentLike);
    await this.clearBlogSubCommentLikeCache(blogSubCommentLike.settingId);
  }

  private async clearBlogSubCommentLikeCache(
    settingId: string,
    blogSubCommentLikeId?: string,
  ): Promise<void> {
    const patterns: string[] = [
      'blogSubCommentLikes:list:*',
      'blogSubCommentLikeStats:*',
    ];

    if (blogSubCommentLikeId) {
      patterns.push(`blogSubCommentLike:${blogSubCommentLikeId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
