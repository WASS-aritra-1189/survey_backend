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
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { QueryBlogCommentDto } from './dto/query-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { BlogComment } from './entities/blog-comment.entity';
import { IBlogCommentsService } from './interfaces/blog-comments-service.interface';

@Injectable()
export class BlogCommentsService implements IBlogCommentsService {
  private readonly queryConfig: QueryConfig<BlogComment> = {
    alias: 'blogComment',
    searchFields: ['comment'],
    sortableFields: ['createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'blogComment.account', alias: 'account', type: 'left' },
      { relation: 'blogComment.blog', alias: 'blog', type: 'left' },
    ],
    customFilters: (qb, query: QueryBaseDto) => {
      const blogQuery = query as QueryBlogCommentDto;
      if (blogQuery.status?.length) {
        qb.andWhere('blogComment.status IN (:...status)', {
          status: blogQuery.status,
        });
      }
      if (blogQuery.blogId) {
        qb.andWhere('blogComment.blogId = :blogId', {
          blogId: blogQuery.blogId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createBlogCommentDto: CreateBlogCommentDto,
  ): Promise<BlogComment> {
    const blogComment = this.blogCommentRepository.create(createBlogCommentDto);
    const savedBlogComment = await this.blogCommentRepository.save(blogComment);
    await this.clearBlogCommentCache(savedBlogComment.settingId);
    return savedBlogComment;
  }

  async findAll(
    query: QueryBlogCommentDto,
  ): Promise<PaginatedResult<BlogComment>> {
    const cacheKey = `blogComment:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BlogComment>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogCommentRepository,
      query as QueryBaseDto,
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
    query: QueryBlogCommentDto,
  ): Promise<PaginatedResult<BlogComment>> {
    query.blogId = blogId;
    return this.findAll(query);
  }

  async update(
    id: string,
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogComment> {
    const blogComment = await this.blogCommentRepository.findOne({
      where: { id },
    });
    if (!blogComment) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_COMMENT_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    const now = new Date();
    const createdAt = new Date(blogComment.createdAt);
    const timeDiff = now.getTime() - createdAt.getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (timeDiff > tenMinutes) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_COMMENT_UPDATE_TIME_EXPIRED,
        MessageType.ERROR,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    Object.assign(blogComment, updateBlogCommentDto);
    const updatedBlogComment =
      await this.blogCommentRepository.save(blogComment);
    await this.clearBlogCommentCache(updatedBlogComment.settingId, id);
    return updatedBlogComment;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<BlogComment> {
    const blogComment = await this.blogCommentRepository.findOne({
      where: { id },
    });
    if (!blogComment) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_COMMENT_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    blogComment.status = status;
    blogComment.updatedBy = updatedBy;
    const updatedBlogComment =
      await this.blogCommentRepository.save(blogComment);
    await this.clearBlogCommentCache(updatedBlogComment.settingId, id);
    return updatedBlogComment;
  }

  private async clearBlogCommentCache(
    settingId: string,
    blogCommentId?: string,
  ): Promise<void> {
    const patterns: string[] = ['blogComments:list:*'];

    if (blogCommentId) {
      patterns.push(`blogComment:${blogCommentId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
