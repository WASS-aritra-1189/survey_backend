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
  HttpStatus,
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
import { NotificationStatus } from '../../shared/enums/notification.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { INotificationsService } from './interfaces/notifications-service.interface';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject('INotificationsService')
    private readonly notificationsService: INotificationsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(NotificationResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'notifications')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ type: NotificationResponseDto })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser() user: IUser,
  ): Promise<Notification> {
    createNotificationDto.createdBy = user.id;
    createNotificationDto.updatedBy = user.id;
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(NotificationListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'notifications')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('notifications_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ type: NotificationListResponseDto })
  findAll(
    @Query() query: QueryNotificationDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role != UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.notificationsService.findAll(query);
  }

  //
  @Get('account/:accountId')
  @ResponseMessage('DATA_004')
  @Serialize(NotificationListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('notifications_by_user')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notifications by user' })
  @ApiResponse({ type: NotificationListResponseDto })
  findByUser(
    @Param('accountId') accountId: string,
    @Query() query: QueryNotificationDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role === UserRoles.USER && accountId !== user.id) {
      accountId = user.id;
    }
    return this.notificationsService.findByUser(accountId, query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(NotificationResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @UseInterceptors(CacheInterceptor)
  @CacheKey('notification_by_id')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ type: NotificationResponseDto })
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'notifications')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateNotificationDto.updatedBy = user.id;
    await this.notificationsService.update(id, updateNotificationDto);
    return { data: {} };
  }

  @Patch(':id/read')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ type: EmptyResponseDto })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.notificationsService.markAsRead(id, user.id);
    return { data: {} };
  }

  @Patch('mark-all-read')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ type: EmptyResponseDto })
  async markAllAsRead(
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.notificationsService.markAllAsRead(user.id);
    return { data: {} };
  }

  @Patch(':id/send')
  @ResponseMessage('DATA_002')
  @Serialize(NotificationResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'notifications')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ type: NotificationResponseDto })
  async sendNotification(
    @Param('id') id: string,
  ): Promise<NotificationResponseDto> {
    return await this.notificationsService.sendNotification(id);
    
  }

  @Patch(':id/status/:status')
  @ResponseMessage('DATA_002')
  @Serialize(NotificationResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'notifications')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update notification status', description: 'Valid statuses: PENDING, SENT, DELIVERED, READ, FAILED, CANCELLED' })
  @ApiResponse({ type: NotificationResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
    @CurrentUser() user: IUser,
  ): Promise<Notification> {
    const validStatuses = Object.values(NotificationStatus);
    if (!validStatuses.includes(status as NotificationStatus)) {
      throw new CustomException(
        {
          code: 'GEN_007',
          message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`
        },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.notificationsService.updateStatus(id, status as NotificationStatus, user.id);
  }

  @Delete(':id')
  @ResponseMessage('DATA_003')
  @Serialize(NotificationResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'notifications')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ type: NotificationResponseDto })
  async remove(
    @Param('id') id: string,
  ): Promise<Notification> {
    return await this.notificationsService.remove(id);
  }
}
