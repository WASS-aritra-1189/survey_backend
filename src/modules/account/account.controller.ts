/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
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
import { UserStatus } from '../../shared/enums/status.enum';
import {
  AccountListResponseDto,
  AccountResponseDto,
} from './dto/account-response.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccountsService } from './interfaces/accounts-service.interface';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class AccountController {
  constructor(
    @Inject('IAccountsService')
    private readonly accountService: IAccountsService,
  ) {}

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(AccountListResponseDto)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'accounts')
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ type: AccountListResponseDto })
  findAll(
    @Query() query: QueryAccountDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: AccountResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.accountService.findAll(query);
  }

  @Patch(':id/reset-password')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.UPDATE, 'accounts')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ type: EmptyResponseDto })
  async resetPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.accountService.resetPassword(id, body, user.id);
    return { data: {} };
  }

  @Patch(':id/status/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @ApiOperation({ summary: 'Update account status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: UserStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.accountService.status(id, status, user.id);
    return { data: {} };
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAccountDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.accountService.update(id, body.loginId, user.id);
    return { data: {} };
  }
}
