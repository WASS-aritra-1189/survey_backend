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
import { DefaultStatus } from '../../shared/enums/status.enum';
import { QueryUserWalletDto } from './dto/query-user-wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user-wallet.dto';
import {
  BalanceResponseDto,
  UserWalletListResponseDto,
} from './dto/user-wallet-response.dto';
import { IUserWalletsService } from './interfaces/user-wallets-service.interface';

@ApiTags('User Wallets')
@Controller('user-wallets')
export class UserWalletsController {
  constructor(
    @Inject('IUserWalletsService')
    private readonly userWalletsService: IUserWalletsService,
  ) {}

  // @Post()
  // @ResponseMessage('DATA_001')
  // @Serialize(UserWalletResponseDto)
  // @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  // @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  // @Permissions(PermissionType.CREATE, 'wallet')
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Create wallet transaction' })
  // @ApiResponse({ type: UserWalletResponseDto })
  // create(
  //   @Body() createUserWalletDto: CreateUserWalletDto,
  //   @CurrentUser() user: IUser,
  // ): Promise<UserWallet> {
  //   if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
  //     createUserWalletDto.settingId = user.settingId;
  //   }
  //   createUserWalletDto.createdBy = user.id;
  //   createUserWalletDto.updatedBy = user.id;
  //   return this.userWalletsService.create(createUserWalletDto);
  // }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(UserWalletListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'wallet')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_wallets_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all wallet transactions' })
  @ApiResponse({ type: UserWalletListResponseDto })
  findAll(@Query() query: QueryUserWalletDto, @CurrentUser() user: IUser) {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.userWalletsService.findAll(query);
  }

  // For user pass null acoountId
  @Get('account/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(UserWalletListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_wallet_by_account')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet transactions by account' })
  @ApiResponse({ type: UserWalletListResponseDto })
  findByAccount(
    @Param('accountId') accountId: string,
    @Query() query: QueryUserWalletDto,
    @CurrentUser() user: IUser,
  ) {
    if (user.role === UserRoles.USER && accountId !== user.id) {
      accountId = user.id;
    }
    return this.userWalletsService.findByAccount(accountId, query);
  }

  // For user pass null acoountId
  @Get('balance/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(BalanceResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_wallet_balance')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({ type: BalanceResponseDto })
  getBalance(
    @Param('accountId') accountId: string,
    @CurrentUser() user: IUser,
  ) {
    if (user.role === UserRoles.USER && accountId !== user.id) {
      accountId = user.id;
    }
    return this.userWalletsService.getBalance(accountId);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'wallet')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update wallet transaction' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserWalletDto: UpdateUserWalletDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateUserWalletDto.updatedBy = user.id;
    await this.userWalletsService.update(id, updateUserWalletDto);
    return { data: {} };
  }

  @Patch(':id/status/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'wallet')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.userWalletsService.status(id, status, user.id);
    return { data: {} };
  }
}
