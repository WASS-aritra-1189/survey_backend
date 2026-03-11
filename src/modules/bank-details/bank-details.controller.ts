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
import { AccountStatus } from '../../shared/enums/bank.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import {
  BankDetailListResponseDto,
  BankDetailResponseDto,
} from './dto/bank-detail-response.dto';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { QueryBankDetailDto } from './dto/query-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { BankDetail } from './entities/bank-detail.entity';
import { IBankDetailsService } from './interfaces/bank-details-service.interface';

@ApiTags('Bank Details')
@Controller('bank-details')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BankDetailsController {
  constructor(
    @Inject('IBankDetailsService')
    private readonly bankDetailsService: IBankDetailsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(BankDetailResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new bank details' })
  @ApiResponse({ type: BankDetailResponseDto })
  create(
    @Body() createBankDetailDto: CreateBankDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<BankDetail> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createBankDetailDto.settingId = user.settingId;
    // }
    createBankDetailDto.createdBy = user.id;
    createBankDetailDto.updatedBy = user.id;
    return this.bankDetailsService.create(createBankDetailDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(BankDetailListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('bankDetails_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bank details' })
  @ApiResponse({ type: BankDetailListResponseDto })
  findAll(
    @Query() query: QueryBankDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: BankDetail[];
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
    return this.bankDetailsService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(BankDetailResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bank detail by ID' })
  @ApiResponse({ type: BankDetailResponseDto })
  findOne(@Param('id') id: string): Promise<BankDetail> {
    return this.bankDetailsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update bank details' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBankDetailDto: UpdateBankDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateBankDetailDto.updatedBy = user.id;
    updateBankDetailDto.status = AccountStatus.PENDING_VERIFICATION;
    await this.bankDetailsService.update(id, updateBankDetailDto);
    return { data: {} };
  }

  @Patch(':id/default')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make default bank detail status' })
  @ApiResponse({ type: EmptyResponseDto })
  async setDefault(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.bankDetailsService.setDefault(id, user.id);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'bank_detail')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update bank detail status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: AccountStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.bankDetailsService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete bank detail' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.bankDetailsService.status(id, AccountStatus.INACTIVE, user.id);
    return { data: {} };
  }
}
