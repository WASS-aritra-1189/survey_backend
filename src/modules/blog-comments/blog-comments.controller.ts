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
  BlogCommentListResponseDto,
  BlogCommentResponseDto,
} from './dto/blog-comment-response.dto';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { QueryBlogCommentDto } from './dto/query-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { BlogComment } from './entities/blog-comment.entity';
import { IBlogCommentsService } from './interfaces/blog-comments-service.interface';

@ApiTags('Blog Comments')
@Controller('blog-comments')
export class BlogCommentsController {
  constructor(
    @Inject('IBlogCommentsService')
    private readonly blogCommentsService: IBlogCommentsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogCommentResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog comment' })
  @ApiResponse({ type: BlogCommentResponseDto })
  create(
    @Body() createBlogCommentDto: CreateBlogCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<BlogComment> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogCommentDto.settingId = user.settingId;
    // }
    createBlogCommentDto.accountId = user.id;
    createBlogCommentDto.createdBy = user.id;
    createBlogCommentDto.updatedBy = user.id;
    return this.blogCommentsService.create(createBlogCommentDto);
  }

  @Get(':blogId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogCommentListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_comments_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog comments' })
  @ApiResponse({ type: BlogCommentListResponseDto })
  findAllAdmin(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    if (!query.accountId && UserRoles.USER === user.role) {
      query.accountId = user.id;
    }
    query.blogId = blogId;
    return this.blogCommentsService.findAll(query);
  }

  @Get('blog/:blogId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogCommentListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_comments_by_blog')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get comments by blog ID' })
  @ApiResponse({ type: BlogCommentListResponseDto })
  findByBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogCommentDto,
  ): Promise<{
    data: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [DefaultStatus.ACTIVE];
    return this.blogCommentsService.findByBlog(blogId, query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog comment' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateBlogCommentDto.updatedBy = user.id;
    await this.blogCommentsService.update(id, updateBlogCommentDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'blog_comment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog comment status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogCommentsService.status(id, status, user.id);
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
  @Permissions(PermissionType.DELETE, 'blog_comment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog comment' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogCommentsService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
