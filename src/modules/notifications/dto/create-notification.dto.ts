/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import {
  DeviceType,
  NotificationAction,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  NotificationTemplate,
  NotificationType,
} from '../../../shared/enums/notification.enum';
import { ScheduleType } from '../../../shared/enums/schedule-type.enum';

export class CreateNotificationDto extends BaseDto {
  @ApiProperty({ description: 'Notification title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Notification body' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Notification category', enum: NotificationCategory })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiPropertyOptional({ description: 'Notification priority', enum: NotificationPriority, default: NotificationPriority.NORMAL })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({ description: 'Notification status', enum: NotificationStatus, default: NotificationStatus.PENDING })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({ description: 'Device type', enum: DeviceType, default: DeviceType.ALL })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({ description: 'Notification template', enum: NotificationTemplate })
  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;

  @ApiPropertyOptional({ description: 'Notification action', enum: NotificationAction, default: NotificationAction.NONE })
  @IsOptional()
  @IsEnum(NotificationAction)
  action?: NotificationAction;

  @ApiPropertyOptional({ description: 'Image URL', maxLength: 500 })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Icon URL', maxLength: 500 })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  iconUrl?: string;

  @ApiPropertyOptional({ description: 'Action URL', maxLength: 500 })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  actionUrl?: string;

  @ApiPropertyOptional({ description: 'Action text', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  actionText?: string;

  @ApiPropertyOptional({ description: 'User IDs array', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  userIds?: string[];

  @ApiPropertyOptional({ description: 'Device tokens array', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deviceTokens?: string[];

  @ApiPropertyOptional({ description: 'Scheduled date', example: '2025-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: 'Schedule type', enum: ScheduleType, default: ScheduleType.ONCE })
  @IsOptional()
  @IsEnum(ScheduleType)
  scheduleType?: ScheduleType;

  @ApiPropertyOptional({ description: 'Is active for recurring', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsUUID()
  settingId: string;
}
