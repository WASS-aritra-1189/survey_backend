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
import { Public } from '../../core/decorators/public.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import type { IUser } from '../../core/interfaces/user.interface';
import { EmptyResponseDto } from '../../shared/dto/base-response.dto';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PageType } from '../../shared/enums/page.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CreatePageDto } from './dto/create-page.dto';
import {
  PageListResponseDto,
  PageResponseDto,
  PublicPageResponseDto,
} from './dto/page-response.dto';
import { QueryPageDto } from './dto/query-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { IPagesService } from './interfaces/pages-service.interface';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(
    @Inject('IPagesService') private readonly pagesService: IPagesService,
  ) {}

  // ADMIN ENDPOINTS
  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(PageResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'pages')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new page (Admin only)' })
  @ApiResponse({ type: PageResponseDto })
  create(
    @Body() createPageDto: CreatePageDto,
    @CurrentUser() user: IUser,
  ): Promise<Page> {
    // Only set settingId if not provided and user has one
    if (!createPageDto.settingId && user.settingId) {
      createPageDto.settingId = user.settingId;
    }
    createPageDto.createdBy = user.id;
    createPageDto.updatedBy = user.id;
    return this.pagesService.create(createPageDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(PageListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'pages')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_pages')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pages (Admin)' })
  @ApiResponse({ type: PageListResponseDto })
  findAll(
    @Query() query: QueryPageDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Page[]; total: number; page: number; limit: number }> {
    if (user.role !== UserRoles.ROOT && user.role != UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.pagesService.findAll(query);
  }

  // PUBLIC ENDPOINT
  @Public()
  @Get('public/:type/:settingId')
  @ResponseMessage('')
  @Serialize(PublicPageResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get public page by type' })
  @ApiResponse({ type: PublicPageResponseDto })
  async findPublicPageByType(
    @Param('type') type: PageType,
    @Param('settingId') settingId: string,
  ): Promise<Page> {
    console.log('PageType:', type, 'SettingId:', settingId);
    return this.pagesService.findPublicPageByType(type, settingId);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(PageResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'pages')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get page by ID (Admin)' })
  @ApiResponse({ type: PageResponseDto })
  findOne(@Param('id') id: string): Promise<Page> {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(PageResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'pages')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update page (Admin only)' })
  @ApiResponse({ type: PageResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @CurrentUser() user: IUser,
  ): Promise<PageResponseDto> {
    updatePageDto.updatedBy = user.id;
    return await this.pagesService.update(id, updatePageDto);
    
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(PageResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'pages')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Status page' })
  @ApiResponse({ type: PageResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<PageResponseDto> {
     return await this.pagesService.status(id, status, user.id);
    
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(PageResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'pages')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete page' })
  @ApiResponse({ type: PageResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<PageResponseDto> {
    return await this.pagesService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
