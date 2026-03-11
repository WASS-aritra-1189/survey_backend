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
import {
  MenuPermissionsDto,
  MenuPermissionsResponseDto,
} from './dto/menu-permissions-response.dto';
import { QueryAccountPermissionDto } from './dto/query-account-permission.dto';
import { UpdateAccountPermissionDto } from './dto/update-account-permission.dto';
import { IAccountPermissionsService } from './interfaces/account-permissions-service.interface';

@ApiTags('Account Permissions')
@Controller('account-permissions')
export class AccountPermissionsController {
  constructor(
    @Inject('IAccountPermissionsService')
    private readonly accountPermissionsService: IAccountPermissionsService,
  ) {}

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(MenuPermissionsResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('menu_permissions')
  @CacheTTL(300)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'accounts')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get menu permissions for account' })
  @ApiResponse({ status: 200, type: MenuPermissionsResponseDto })
  async getMenuPermissions(
    @Param('accountId') accountId: string,
    @Query() query: QueryAccountPermissionDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: MenuPermissionsDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (!query.accountId) {
      query.accountId = user.id;
    }
    return this.accountPermissionsService.findAll(query);
  }

  @Get(':accountId')
  @ResponseMessage('DATA_004')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'accounts')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all permissions by account ID' })
  async getPermissionsByAccountId(@Param('accountId') accountId: string) {
    return this.accountPermissionsService.findByAccountId(accountId);
  }

  @Patch()
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update account permission' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async update(
    @Body() updateDto: UpdateAccountPermissionDto[],
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
   
    updateDto.forEach(item => {
      item.updatedBy = user.id;
      item.createdBy = user.id;
    });
    await this.accountPermissionsService.update(updateDto);
    return { data: {} };
  }
}
