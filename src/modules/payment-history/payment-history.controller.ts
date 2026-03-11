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
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CreatePaymentHistoryDto } from './dto/create-payment-history.dto';
import {
  PaymentHistoryListResponseDto,
  PaymentHistoryResponseDto,
} from './dto/payment-history-response.dto';
import { QueryPaymentHistoryDto } from './dto/query-payment-history.dto';
import { UpdatePaymentHistoryDto } from './dto/update-payment-history.dto';
import { PaymentHistory } from './entities/payment-history.entity';
import { IPaymentHistoryService } from './interfaces/payment-history-service.interface';

@ApiTags('Payment History')
@Controller('payment-history')
export class PaymentHistoryController {
  constructor(
    @Inject('IPaymentHistoryService')
    private readonly paymentHistoryService: IPaymentHistoryService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(PaymentHistoryResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'payment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment history record' })
  @ApiResponse({ type: PaymentHistoryResponseDto })
  create(
    @Body() createPaymentHistoryDto: CreatePaymentHistoryDto,
    @CurrentUser() user: IUser,
  ): Promise<PaymentHistory> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createPaymentHistoryDto.settingId = user.settingId;
    // }
    createPaymentHistoryDto.createdBy = user.id;
    createPaymentHistoryDto.updatedBy = user.id;
    return this.paymentHistoryService.create(createPaymentHistoryDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(PaymentHistoryListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'payment')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('payments_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payment history records' })
  @ApiResponse({ type: PaymentHistoryListResponseDto })
  findAll(@Query() query: QueryPaymentHistoryDto, @CurrentUser() user: IUser) {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.paymentHistoryService.findAll(query);
  }

  @Get('account/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(PaymentHistoryListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('payment_by_account')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history by account' })
  @ApiResponse({ type: PaymentHistoryListResponseDto })
  findByAccount(
    @Param('accountId') accountId: string,
    @Query() query: QueryPaymentHistoryDto,
    @CurrentUser() user: IUser,
  ) {
    if (user.role === UserRoles.USER && accountId !== user.id) {
      accountId = user.id;
    }
    return this.paymentHistoryService.findByAccount(accountId, query);
  }

  @Get('transaction/:transactionId')
  @ResponseMessage('DATA_004')
  @Serialize(PaymentHistoryResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'payment')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('payment_by_transaction')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by transaction ID' })
  @ApiResponse({ type: PaymentHistoryResponseDto })
  findByTransactionId(
    @Param('transactionId') transactionId: string,
  ): Promise<PaymentHistory> {
    return this.paymentHistoryService.findByTransactionId(transactionId);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(PaymentHistoryResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Permissions(PermissionType.READ, 'payment')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('payment_by_id')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history by ID' })
  @ApiResponse({ type: PaymentHistoryResponseDto })
  findOne(@Param('id') id: string): Promise<PaymentHistory> {
    return this.paymentHistoryService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'payment')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment history' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentHistoryDto: UpdatePaymentHistoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updatePaymentHistoryDto.updatedBy = user.id;
    await this.paymentHistoryService.update(id, updatePaymentHistoryDto);
    return { data: {} };
  }

  @Patch(':id/payment-status/:paymentStatus')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'payment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Param('paymentStatus') paymentStatus: PaymentStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.paymentHistoryService.updatePaymentStatus(
      id,
      paymentStatus,
      user.id,
    );
    return { data: {} };
  }

  @Patch(':id/status/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'payment')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update record status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.paymentHistoryService.status(id, status, user.id);
    return { data: {} };
  }
}
