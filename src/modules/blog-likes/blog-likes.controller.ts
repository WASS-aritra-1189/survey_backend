/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import type { IUser } from '../../core/interfaces/user.interface';
import { UserRoles } from '../../shared/enums/accouts.enum';
import {
  BlogLikeListResponseDto,
  BlogLikeResponseDto,
} from './dto/blog-like-response.dto';
import { CreateBlogLikeDto } from './dto/create-blog-like.dto';
import { QueryBlogLikeDto } from './dto/query-blog-like.dto';
import { BlogLike } from './entities/blog-like.entity';
import { IBlogLikesService } from './interfaces/blog-likes-service.interface';

@ApiTags('Blog Likes')
@Controller('blog-likes')
export class BlogLikesController {
  constructor(
    @Inject('IBlogLikesService')
    private readonly blogLikesService: IBlogLikesService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogLikeResponseDto)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog like/dislike' })
  @ApiResponse({ type: BlogLikeResponseDto })
  create(
    @Body() createBlogLikeDto: CreateBlogLikeDto,
    @CurrentUser() user: IUser,
  ): Promise<BlogLike> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogLikeDto.settingId = user.settingId;
    // }
    createBlogLikeDto.accountId = user.id;
    createBlogLikeDto.createdBy = user.id;
    createBlogLikeDto.updatedBy = user.id;
    return this.blogLikesService.likeDislike(createBlogLikeDto);
  }

  @Get(':blogId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogLikeListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_likes_by_blog')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get likes by blog ID' })
  @ApiResponse({ type: BlogLikeListResponseDto })
  findByBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogLikeDto,
  ): Promise<{
    data: BlogLike[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogLikesService.findByBlog(blogId, query);
  }
}
