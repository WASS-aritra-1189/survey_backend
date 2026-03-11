/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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
  PasswordHistoryListResponseDto,
  PasswordHistoryResponseDto,
} from './dto/password-history-response.dto';
import { QueryPasswordHistoryDto } from './dto/query-password-history.dto';
import { PasswordHistory } from './entities/password-history.entity';
import { IPasswordHistoryService } from './interfaces/password-history-service.interface';

@ApiTags('Password History')
@Controller('password-history')
export class PasswordHistoryController {
  constructor(
    @Inject('IPasswordHistoryService')
    private readonly passwordHistoryService: IPasswordHistoryService,
  ) {}

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(PasswordHistoryListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'password')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('password_history_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all password history records' })
  @ApiResponse({ type: PasswordHistoryListResponseDto })
  findAll(@Query() query: QueryPasswordHistoryDto, @CurrentUser() user: IUser) {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.passwordHistoryService.findAll(query);
  }

  // For user send null in accountId
  @Get('account/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(PasswordHistoryListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('password_history_by_account')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get password history by account' })
  @ApiResponse({ type: PasswordHistoryListResponseDto })
  findByAccount(
    @Param('accountId') accountId: string,
    @Query() query: QueryPasswordHistoryDto,
    @CurrentUser() user: IUser,
  ) {
    if (user.role === UserRoles.USER && accountId !== user.id) {
      accountId = user.id;
    }
    return this.passwordHistoryService.findByAccount(accountId, query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(PasswordHistoryResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'password')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('password_history_by_id')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get password history by ID' })
  @ApiResponse({ type: PasswordHistoryResponseDto })
  findOne(@Param('id') id: string): Promise<PasswordHistory> {
    return this.passwordHistoryService.findOne(id);
  }

  @Patch(':id/status/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'password')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update record status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.passwordHistoryService.status(id, status, user.id);
    return { data: {} };
  }
}
