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
  Patch,
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
import { DefaultStatus } from '../../shared/enums/status.enum';
import {
  BlogSubCommentListResponseDto,
  BlogSubCommentResponseDto,
} from './dto/blog-sub-comment-response.dto';
import { CreateBlogSubCommentDto } from './dto/create-blog-sub-comment.dto';
import { QueryBlogSubCommentDto } from './dto/query-blog-sub-comment.dto';
import { UpdateBlogSubCommentDto } from './dto/update-blog-sub-comment.dto';
import { BlogSubComment } from './entities/blog-sub-comment.entity';
import type { IBlogSubCommentService } from './interfaces/blog-sub-comment-service.interface';

@ApiTags('Blog Sub Comments')
@Controller('blog-sub-comment')
export class BlogSubCommentController {
  constructor(
    @Inject('IBlogSubCommentService')
    private readonly blogSubCommentService: IBlogSubCommentService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogSubCommentResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.CREATE, 'blog_sub_comment')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog sub-comment' })
  @ApiResponse({ type: BlogSubCommentResponseDto })
  create(
    @Body() createBlogSubCommentDto: CreateBlogSubCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<BlogSubComment> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogSubCommentDto.settingId = user.settingId;
    // }
    createBlogSubCommentDto.accountId = user.id;
    createBlogSubCommentDto.createdBy = user.id;
    createBlogSubCommentDto.updatedBy = user.id;
    return this.blogSubCommentService.create(createBlogSubCommentDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comments_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all blog sub-comments' })
  @ApiResponse({ type: BlogSubCommentListResponseDto })
  findAll(@Query() query: QueryBlogSubCommentDto): Promise<{
    data: BlogSubComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSubCommentService.findAll(query);
  }

  @Get('admin')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'blog_sub_comment')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comments_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog sub-comments (Admin)' })
  @ApiResponse({ type: BlogSubCommentListResponseDto })
  findAllAdmin(
    @Query() query: QueryBlogSubCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BlogSubComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.blogSubCommentService.findAll(query);
  }

  @Get('blog/:blogId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comments_by_blog')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get sub-comments by blog ID' })
  @ApiResponse({ type: BlogSubCommentListResponseDto })
  findByBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogSubCommentDto,
  ): Promise<{
    data: BlogSubComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSubCommentService.findByBlog(blogId, query);
  }

  @Get('comment/:commentId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSubCommentListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_sub_comments_by_comment')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get sub-comments by parent comment ID' })
  @ApiResponse({ type: BlogSubCommentListResponseDto })
  findByComment(
    @Param('commentId') commentId: string,
    @Query() query: QueryBlogSubCommentDto,
  ): Promise<{
    data: BlogSubComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSubCommentService.findByComment(commentId, query);
  }

  @Patch(':id')
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
  @Permissions(PermissionType.UPDATE, 'blog_sub_comment')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog sub-comment' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBlogSubCommentDto: UpdateBlogSubCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateBlogSubCommentDto.updatedBy = user.id;
    await this.blogSubCommentService.update(id, updateBlogSubCommentDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'blog_sub_comment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog sub-comment status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogSubCommentService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
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
  @Permissions(PermissionType.DELETE, 'blog_sub_comment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog sub-comment' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogSubCommentService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
