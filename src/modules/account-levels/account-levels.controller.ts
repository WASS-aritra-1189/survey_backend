/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  BadRequestException,
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
  AccountLevelListResponseDto,
  AccountLevelResponseDto,
} from './dto/account-level-response.dto';
import { CreateAccountLevelDto } from './dto/create-account-level.dto';
import { QueryAccountLevelDto } from './dto/query-account-level.dto';
import { UpdateAccountLevelDto } from './dto/update-account-level.dto';
import { AccountLevel } from './entities/account-level.entity';
import { IAccountLevelsService } from './interfaces/account-levels-service.interface';

@ApiTags('Account Levels')
@Controller('account-levels')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AccountLevelsController {
  constructor(
    @Inject('IAccountLevelsService')
    private readonly accountLevelsService: IAccountLevelsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(AccountLevelResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'account_levels')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new account level (Admin only)' })
  @ApiResponse({ type: AccountLevelResponseDto })
  create(
    @Body() createAccountLevelDto: CreateAccountLevelDto,
    @CurrentUser() user: IUser,
  ): Promise<AccountLevel> {
    // console.log('User:', user);
    // console.log('DTO:', createAccountLevelDto);
    
    // Keep the settingId from request body - don't override it
    createAccountLevelDto.createdBy = user.id;
    createAccountLevelDto.updatedBy = user.id;
    return this.accountLevelsService.create(createAccountLevelDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(AccountLevelListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'account_levels')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('accountLevels_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all account levels (Admin)' })
  @ApiResponse({ type: AccountLevelListResponseDto })
  findAll(
    @Query() query: QueryAccountLevelDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: AccountLevel[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.accountLevelsService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(AccountLevelResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'account_levels')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update account level (Admin only)' })
  @ApiResponse({ type: AccountLevelResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateAccountLevelDto: UpdateAccountLevelDto,
    @CurrentUser() user: IUser,
  ): Promise<AccountLevel> {
    updateAccountLevelDto.updatedBy = user.id;
    return this.accountLevelsService.update(id, updateAccountLevelDto);
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(AccountLevelResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'account_levels')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update account level status' })
  @ApiResponse({ type: AccountLevelResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<AccountLevel> {
    return this.accountLevelsService.status(id, status, user.id);
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(AccountLevelResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'account_levels')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete account level' })
  @ApiResponse({ type: AccountLevelResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<AccountLevel> {
    return await this.accountLevelsService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
