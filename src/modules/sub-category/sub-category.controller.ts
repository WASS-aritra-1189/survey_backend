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
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import {
  SubCategoryListResponseDto,
  SubCategoryResponseDto,
} from './dto/sub-category-response.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { type ISubCategoryService } from './interfaces/sub-category-service.interface';

@ApiTags('Sub-Categories')
@Controller('sub-categories')
export class SubCategoryController {
  constructor(
    @Inject('ISubCategoryService')
    private readonly subCategoryService: ISubCategoryService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(SubCategoryResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'sub_categories')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new sub-category' })
  @ApiResponse({ type: SubCategoryResponseDto })
  create(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
    @CurrentUser() user: IUser,
  ): Promise<SubCategory> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createSubCategoryDto.settingId = user.settingId;
    // }
    createSubCategoryDto.createdBy = user.id;
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(SubCategoryListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'sub_categories')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_sub_categories')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sub-categories' })
  @ApiResponse({ type: SubCategoryListResponseDto })
  findList(
    @Query() query: QuerySubCategoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: SubCategory[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.subCategoryService.findAll(query);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(SubCategoryListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('public_sub_categories')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all sub-categories' })
  @ApiResponse({ type: SubCategoryListResponseDto })
  findAll(
    @Query() query: QuerySubCategoryDto,
  ): Promise<{
    data: SubCategory[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [DefaultStatus.ACTIVE];
    return this.subCategoryService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'sub_categories')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update sub-category' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateSubCategoryDto.updatedBy = user.id;
    await this.subCategoryService.update(id, updateSubCategoryDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'sub_categories')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update sub-category status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.subCategoryService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'sub_categories')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete sub-category' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.subCategoryService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
