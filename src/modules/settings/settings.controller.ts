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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
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
import { CreateSettingDto } from './dto/create-setting.dto';
import { QuerySettingDto } from './dto/query-setting.dto';
import {
  SettingIdResponseDto,
  SettingPaginationResponseDto,
  SettingResponseDto,
} from './dto/setting-response.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import type { ISettingsService } from './interfaces/settings-service.interface';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class SettingsController {
  constructor(
    @Inject('ISettingsService')
    private readonly settingsService: ISettingsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(SettingIdResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'settings')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiResponse({ type: SettingIdResponseDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new setting (Admin only)' })
  create(
    @Body() createSettingDto: CreateSettingDto,
    @CurrentUser() user: IUser,
  ): Promise<Setting> {
    createSettingDto.createdBy = user.id;
    createSettingDto.updatedBy = user.id;
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(SettingPaginationResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ROOT_STAFF,UserRoles.ADMIN)
  @Permissions(PermissionType.READ, 'settings')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({ type: SettingPaginationResponseDto })
  @CacheKey('settings_all')
  @CacheTTL(300)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings (Admin)' })
  findAll(
    @Query() query: QuerySettingDto,
  ): Promise<{ data: Setting[]; total: number; page: number; limit: number }> {
    return this.settingsService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(SettingResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'settings')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @ApiResponse({ type: SettingResponseDto })
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get setting by ID (Admin)' })
  findOne(@Param('id') id: string): Promise<Setting> {
    return this.settingsService.findOne(id);
  }

  @Get('domain')
  @ResponseMessage('DATA_004')
  @Serialize(SettingResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiResponse({ type: SettingResponseDto })
  @ApiOperation({ summary: 'Get setting by domain' })
  async findOneByDomain(@Req() req: Request): Promise<Setting> {
    const domain = req.headers.host as string;
    return this.settingsService.findOneByDomain(domain);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'settings')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiResponse({ type: EmptyResponseDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update setting (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateSettingDto.updatedBy = user.id;
    await this.settingsService.update(id, updateSettingDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_003')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'settings')
  @ApiResponse({ type: EmptyResponseDto })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Status setting' })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.settingsService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(SettingIdResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'settings')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiResponse({ type: EmptyResponseDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete settngs' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.settingsService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
