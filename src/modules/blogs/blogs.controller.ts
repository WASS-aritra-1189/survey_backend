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
import { BlogListResponseDto, BlogResponseDto } from './dto/blog-response.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import type { IBlogsService } from './interfaces/blogs-service.interface';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject('IBlogsService')
    private readonly blogsService: IBlogsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'blog')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog' })
  @ApiResponse({ type: BlogResponseDto })
  create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: IUser,
  ): Promise<Blog> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogDto.settingId = user.settingId;
    // }
    createBlogDto.createdBy = user.id;
    createBlogDto.updatedBy = user.id;
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(BlogListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blogs_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({ type: BlogListResponseDto })
  findAll(@Query() query: QueryBlogDto): Promise<{
    data: Blog[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [DefaultStatus.ACTIVE];
    return this.blogsService.findAll(query);
  }

  @Get('all')
  @ResponseMessage('DATA_004')
  @Serialize(BlogListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blogs_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({ type: BlogListResponseDto })
  findAllAdmin(
    @Query() query: QueryBlogDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Blog[];
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
    return this.blogsService.findAll(query);
  }

  @Get('slug/:slug')
  @ResponseMessage('DATA_004')
  @Serialize(BlogResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_by_slug')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get blog by slug' })
  @ApiResponse({ type: BlogResponseDto })
  findBySlug(@Param('slug') slug: string): Promise<Blog> {
    return this.blogsService.findBySlug(slug);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(BlogResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_by_id')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({ type: BlogResponseDto })
  findOne(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'blog')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateBlogDto.updatedBy = user.id;
    await this.blogsService.update(id, updateBlogDto);
    return { data: {} };
  }

  @Patch(':id/view')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Increment blog view count' })
  @ApiResponse({ type: EmptyResponseDto })
  async incrementView(
    @Param('id') id: string,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogsService.incrementViewCount(id);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'blog')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogsService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'blog')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.blogsService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
