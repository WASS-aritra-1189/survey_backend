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
import { SubscriptionStatus } from '../../shared/enums/newsletter.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import {
  NewsLettersSubscriptionListResponseDto,
  NewsLettersSubscriptionResponseDto,
} from './dto/news-letters-subscription-response.dto';
import { QueryNewsLettersSubscriptionDto } from './dto/query-news-letters-subscription.dto';
import { UpdateNewsLettersSubscriptionDto } from './dto/update-news-letters-subscription.dto';
import { NewsLettersSubscription } from './entities/news-letters-subscription.entity';
import type { INewsLettersSubscriptionsService } from './interfaces/news-letters-subscriptions-service.interface';

@ApiTags('Newsletter Subscriptions')
@Controller('news-letters-subscriptions')
export class NewsLettersSubscriptionsController {
  constructor(
    @Inject('INewsLettersSubscriptionsService')
    private readonly subscriptionsService: INewsLettersSubscriptionsService,
  ) {}

  @Post('subscribe')
  @ResponseMessage('DATA_001')
  @Serialize(NewsLettersSubscriptionResponseDto)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, type: NewsLettersSubscriptionResponseDto })
  subscribe(
    @Body() body: { settingId: string; email: string },
    @CurrentUser() user: IUser,
  ) {
    return this.subscriptionsService.subscribe(body.settingId, body.email);
  }

  @Post(':id/unsubscribe')
  @ResponseMessage('DATA_002')
  @Serialize(NewsLettersSubscriptionResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({ status: 200, type: NewsLettersSubscriptionResponseDto })
  unsubscribe(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.subscriptionsService.unsubscribe(id, body.reason);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(NewsLettersSubscriptionListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('newsletter_subscriptions_list')
  @CacheTTL(120)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'newsletter_subscription')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all newsletter subscriptions' })
  @ApiResponse({ status: 200, type: NewsLettersSubscriptionListResponseDto })
  findAll(
    @Query() query: QueryNewsLettersSubscriptionDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: NewsLettersSubscription[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role != UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.subscriptionsService.findAll(query);
  }

  @Get('user/:userId')
  @ResponseMessage('DATA_004')
  @Serialize(NewsLettersSubscriptionListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user_newsletter_subscriptions')
  @CacheTTL(300)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscriptions by user' })
  @ApiResponse({ status: 200, type: NewsLettersSubscriptionListResponseDto })
  findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryNewsLettersSubscriptionDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: NewsLettersSubscription[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role != UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }

    return this.subscriptionsService.findByUser(userId, query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(NewsLettersSubscriptionResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('newsletter_subscription_by_id')
  @CacheTTL(300)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'newsletter_subscription')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get newsletter subscription by ID' })
  @ApiResponse({ status: 200, type: NewsLettersSubscriptionResponseDto })
  findOne(@Param('id') id: string): Promise<NewsLettersSubscription> {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id/status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'newsletter_subscription')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription status' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: SubscriptionStatus },
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.subscriptionsService.updateStatus(id, body.status, user.id);
    return { data: {} };
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'newsletter_subscription')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update newsletter subscription' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNewsLettersSubscriptionDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateDto.updatedBy = user.id;
    await this.subscriptionsService.update(id, updateDto);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_003')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'newsletter_subscription')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete newsletter subscription' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: Record<string, never> }> {
    await this.subscriptionsService.remove(id);
    return { data: {} };
  }
}
