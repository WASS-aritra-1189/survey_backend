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
import { QueryBaseDto } from '../../shared/dto/query-base.dto';
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateBlogSubCommentDto } from './dto/create-blog-sub-comment.dto';
import { QueryBlogSubCommentDto } from './dto/query-blog-sub-comment.dto';
import { UpdateBlogSubCommentDto } from './dto/update-blog-sub-comment.dto';
import { BlogSubComment } from './entities/blog-sub-comment.entity';
import { IBlogSubCommentService } from './interfaces/blog-sub-comment-service.interface';

@Injectable()
export class BlogSubCommentService implements IBlogSubCommentService {
  private readonly queryConfig: QueryConfig<BlogSubComment> = {
    alias: 'blogSubComment',
    searchFields: ['content'],
    sortableFields: ['createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'blogSubComment.account', alias: 'account', type: 'left' },
      { relation: 'blogSubComment.blog', alias: 'blog', type: 'left' },
      {
        relation: 'blogSubComment.blogComment',
        alias: 'blogComment',
        type: 'left',
      },
    ],
    customFilters: (qb, query: QueryBaseDto) => {
      const subCommentQuery = query as QueryBlogSubCommentDto;
      if (subCommentQuery.status?.length) {
        qb.andWhere('blogSubComment.status IN (:...status)', {
          status: subCommentQuery.status,
        });
      }
      if (subCommentQuery.blogId) {
        qb.andWhere('blogSubComment.blogId = :blogId', {
          blogId: subCommentQuery.blogId,
        });
      }
      if (subCommentQuery.blogCommentId) {
        qb.andWhere('blogSubComment.blogCommentId = :blogCommentId', {
          blogCommentId: subCommentQuery.blogCommentId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(BlogSubComment)
    private readonly blogSubCommentRepository: Repository<BlogSubComment>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createBlogSubCommentDto: CreateBlogSubCommentDto,
  ): Promise<BlogSubComment> {
    const blogSubComment = this.blogSubCommentRepository.create(
      createBlogSubCommentDto,
    );
    const savedBlogSubComment =
      await this.blogSubCommentRepository.save(blogSubComment);
    await this.clearBlogSubCommentCache(savedBlogSubComment.settingId);
    return savedBlogSubComment;
  }

  async findAll(
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>> {
    const cacheKey = `blogSubComment:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BlogSubComment>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogSubCommentRepository,
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
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>> {
    query.blogId = blogId;
    return this.findAll(query);
  }

  async findByComment(
    blogCommentId: string,
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>> {
    query.blogCommentId = blogCommentId;
    return this.findAll(query);
  }

  async update(
    id: string,
    updateBlogSubCommentDto: UpdateBlogSubCommentDto,
  ): Promise<BlogSubComment> {
    const blogSubComment = await this.blogSubCommentRepository.findOne({
      where: { id },
    });
    if (!blogSubComment) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SUB_COMMENT_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    const now = new Date();
    const createdAt = new Date(blogSubComment.createdAt);
    const timeDiff = now.getTime() - createdAt.getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (timeDiff > tenMinutes) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_COMMENT_UPDATE_TIME_EXPIRED,
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(blogSubComment, updateBlogSubCommentDto);
    const updatedBlogSubComment =
      await this.blogSubCommentRepository.save(blogSubComment);
    await this.clearBlogSubCommentCache(updatedBlogSubComment.settingId, id);
    return updatedBlogSubComment;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<BlogSubComment> {
    const blogSubComment = await this.blogSubCommentRepository.findOne({
      where: { id },
    });
    if (!blogSubComment) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SUB_COMMENT_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    blogSubComment.status = status;
    blogSubComment.updatedBy = updatedBy;
    const updatedBlogSubComment =
      await this.blogSubCommentRepository.save(blogSubComment);
    await this.clearBlogSubCommentCache(updatedBlogSubComment.settingId, id);
    return updatedBlogSubComment;
  }

  private async clearBlogSubCommentCache(
    settingId: string,
    blogSubCommentId?: string,
  ): Promise<void> {
    const patterns: string[] = ['blogSubComments:list:*'];

    if (blogSubCommentId) {
      patterns.push(`blogSubComment:${blogSubCommentId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
