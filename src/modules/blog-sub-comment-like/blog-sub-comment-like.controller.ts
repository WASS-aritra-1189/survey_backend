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
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
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
import { Permissions } from '../../core/decorators/permissions.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import type { IUser } from '../../core/interfaces/user.interface';
import { EmptyResponseDto } from '../../shared/dto/base-response.dto';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import {
  BlogSubCommentLikeListResponseDto,
  BlogSubCommentLikeResponseDto,
} from './dto/blog-sub-comment-like-response.dto';
import { CreateBlogSubCommentLikeDto } from './dto/create-blog-sub-comment-like.dto';
import { QueryBlogSubCommentLikeDto } from './dto/query-blog-sub-comment-like.dto';
import { BlogSubCommentLike } from './entities/blog-sub-comment-like.entity';
import type { IBlogSubCommentLikeService } from './interfaces/blog-sub-comment-like-service.interface';

@ApiTags('Blog Sub Comment Likes')
@Controller('blog-sub-comment-like')
export class BlogSubCommentLikeController {
  constructor(
    @Inject('IBlogSubCommentLikeService')
    private readonly blogSubCommentLikeService: IBlogSubCommentLikeService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogSubCommentLikeResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.CREATE, 'blog_sub_comment_like')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog sub-comment like' })
  @ApiResponse({ type: BlogSubCommentLikeResponseDto })
  create(
    @Body() createBlogSubCommentLikeDto: CreateBlogSubCommentLikeDto,
    @CurrentUser() user: IUser,
  ): Promise<BlogSubCommentLike> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogSubCommentLikeDto.settingId = user.settingId;
    // }
    createBlogSubCommentLikeDto.accountId = user.id;
    createBlogSubCommentLikeDto.createdBy = user.id;
    createBlogSubCommentLikeDto.updatedBy = user.id;
    return this.blogSubCommentLikeService.create(createBlogSubCommentLikeDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentLikeListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comment_likes_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all blog sub-comment likes' })
  @ApiResponse({ type: BlogSubCommentLikeListResponseDto })
  findAll(@Query() query: QueryBlogSubCommentLikeDto): Promise<{
    data: BlogSubCommentLike[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSubCommentLikeService.findAll(query);
  }

  @Get('admin')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentLikeListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'blog_sub_comment_like')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comment_likes_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog sub-comment likes (Admin)' })
  @ApiResponse({ type: BlogSubCommentLikeListResponseDto })
  findAllAdmin(
    @Query() query: QueryBlogSubCommentLikeDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BlogSubCommentLike[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.blogSubCommentLikeService.findAll(query);
  }

  @Get('sub-comment/:subCommentId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentLikeListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comment_likes_by_sub_comment')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get likes by sub-comment ID' })
  @ApiResponse({ type: BlogSubCommentLikeListResponseDto })
  findBySubComment(
    @Param('subCommentId') subCommentId: string,
    @Query() query: QueryBlogSubCommentLikeDto,
  ): Promise<{
    data: BlogSubCommentLike[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSubCommentLikeService.findBySubComment(subCommentId, query);
  }

  @Get('account/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentLikeListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.READ, 'blog_sub_comment_like')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comment_likes_by_account')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get likes by account ID' })
  @ApiResponse({ type: BlogSubCommentLikeListResponseDto })
  findByAccount(
    @Param('accountId') accountId: string,
    @Query() query: QueryBlogSubCommentLikeDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BlogSubCommentLike[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.blogSubCommentLikeService.findByAccount(accountId, query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentLikeResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comment_like_by_id')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get blog sub-comment like by ID' })
  @ApiResponse({ type: BlogSubCommentLikeResponseDto })
  findOne(@Param('id') id: string): Promise<BlogSubCommentLike> {
    return this.blogSubCommentLikeService.findOne(id);
  }

  @Delete(':subCommentId')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.DELETE, 'blog_sub_comment_like')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove sub-comment like' })
  @ApiResponse({ type: EmptyResponseDto })
  async remove(
    @Param('subCommentId') subCommentId: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogSubCommentLikeService.remove(subCommentId, user.id);
    return { data: {} };
  }
}
