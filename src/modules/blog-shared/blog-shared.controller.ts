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
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import {
  BlogSharedListResponseDto,
  BlogSharedResponseDto,
} from './dto/blog-shared-response.dto';
import { CreateBlogSharedDto } from './dto/create-blog-shared.dto';
import { QueryBlogSharedDto } from './dto/query-blog-shared.dto';
import { BlogShared } from './entities/blog-shared.entity';
import type { IBlogSharedService } from './interfaces/blog-shared-service.interface';

@ApiTags('Blog Shared')
@Controller('blog-shared')
export class BlogSharedController {
  constructor(
    @Inject('IBlogSharedService')
    private readonly blogSharedService: IBlogSharedService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BlogSharedResponseDto)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Record blog share' })
  @ApiResponse({ type: BlogSharedResponseDto })
  create(
    @Body() createBlogSharedDto: CreateBlogSharedDto,
    @CurrentUser() user: IUser,
  ): Promise<BlogShared> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBlogSharedDto.settingId = user.settingId;
    // }
    createBlogSharedDto.accountId = user.id;
    createBlogSharedDto.createdBy = user.id;
    createBlogSharedDto.updatedBy = user.id;
    return this.blogSharedService.create(createBlogSharedDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(BlogSharedListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'blog_shared')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_shared_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog shares' })
  @ApiResponse({ type: BlogSharedListResponseDto })
  findAllAdmin(
    @Query() query: QueryBlogSharedDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BlogShared[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.blogSharedService.findAll(query);
  }

  @Get('blog/:blogId')
  @ResponseMessage('DATA_004')
  @Serialize(BlogSharedListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('blog_shared_by_blog')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get shares by blog ID' })
  @ApiResponse({ type: BlogSharedListResponseDto })
  findByBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogSharedDto,
  ): Promise<{
    data: BlogShared[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.blogSharedService.findByBlog(blogId, query);
  }
}
