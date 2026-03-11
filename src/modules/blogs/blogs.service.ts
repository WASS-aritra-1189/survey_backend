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
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { IBlogsService } from './interfaces/blogs-service.interface';

@Injectable()
export class BlogsService implements IBlogsService {
  private readonly queryConfig: QueryConfig<Blog> = {
    alias: 'blog',
    searchFields: [
      'title',
      'excerpt',
      'content',
      'metaTitle',
      'metaDescription',
    ],
    sortableFields: [
      'title',
      'publishedAt',
      'viewCount',
      'createdAt',
      'updatedAt',
      'status',
    ],
    defaultSortField: 'createdAt',
    joins: [
      {
        relation: 'blog_likes',
        alias: 'likes',
        type: 'left',
        condition: 'likes.blogId = blog.id',
      },
      {
        relation: 'blog_comments',
        alias: 'comments',
        type: 'left',
        condition: 'comments.blogId = blog.id',
      },
      {
        relation: 'blog_sub_comments',
        alias: 'subComments',
        type: 'left',
        condition: 'subComments.blogId = blog.id',
      },
      {
        relation: 'blog_shared',
        alias: 'shared',
        type: 'left',
        condition: 'shared.blogId = blog.id',
      },
    ],
    aggregates: [
      { field: 'likes.id', function: 'COUNT', alias: 'likesCount' },
      { field: 'comments.id', function: 'COUNT', alias: 'commentsCount' },
      { field: 'subComments.id', function: 'COUNT', alias: 'subCommentsCount' },
      { field: 'shared.id', function: 'COUNT', alias: 'sharedCount' },
    ],
    groupBy: ['blog.id'],
    customFilters: (qb, query: QueryBlogDto) => {
      if (query.status?.length) {
        qb.andWhere('blog.status IN (:...status)', { status: query.status });
      }
      if (query.tags?.length) {
        qb.andWhere('JSON_OVERLAPS(blog.tags, :tags)', {
          tags: JSON.stringify(query.tags),
        });
      }
      if (query.slug) {
        qb.andWhere('blog.slug = :slug', { slug: query.slug });
      }
      if (query.accountId) {
        qb.andWhere('blog.accountId = :accountId', {
          accountId: query.accountId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const existingBlog = await this.blogRepository.findOne({
      // where: { slug: createBlogDto.slug, settingId: createBlogDto.settingId },
    });
    if (existingBlog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_SLUG_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const blog = this.blogRepository.create(createBlogDto);
    const savedBlog = await this.blogRepository.save(blog);
    await this.clearBlogCache(savedBlog.settingId);
    return savedBlog;
  }

  async findAll(query: QueryBlogDto): Promise<PaginatedResult<Blog>> {
    const cacheKey = `blog:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get<PaginatedResult<Blog>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.blogRepository,
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

  async findOne(id: string): Promise<Blog> {
    const cacheKey = `blog:${id}`;
    const cachedBlog = await this.cacheService.get<Blog>(cacheKey);
    if (cachedBlog) {
      return cachedBlog;
    }

    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, blog, 300);
    return blog;
  }

  async findBySlug(slug: string): Promise<Blog> {
    const cacheKey = `blog:slug:${slug}`;
    const cachedBlog = await this.cacheService.get<Blog>(cacheKey);
    if (cachedBlog) {
      return cachedBlog;
    }

    const blog = await this.blogRepository.findOne({ where: { slug } });
    if (!blog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, blog, 300);
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
      const existingBlog = await this.blogRepository.findOne({
        where: { slug: updateBlogDto.slug, settingId: blog.settingId },
      });
      if (existingBlog && existingBlog.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.BLOG_SLUG_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(blog, updateBlogDto);
    const updatedBlog = await this.blogRepository.save(blog);
    await this.clearBlogCache(updatedBlog.settingId, id);
    return updatedBlog;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    blog.status = status;
    blog.updatedBy = updatedBy;
    const updatedBlog = await this.blogRepository.save(blog);
    await this.clearBlogCache(updatedBlog.settingId, id);
    return updatedBlog;
  }

  async incrementViewCount(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new CustomException(
        MESSAGE_CODES.BLOG_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    blog.viewCount += 1;
    const updatedBlog = await this.blogRepository.save(blog);
    await this.clearBlogCache(updatedBlog.settingId, id);
    return updatedBlog;
  }

  private async clearBlogCache(
    settingId: string,
    blogId?: string,
  ): Promise<void> {
    const patterns: string[] = ['blogs:list:*'];

    if (blogId) {
      patterns.push(`blog:${blogId}`, `blog:slug:*`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
