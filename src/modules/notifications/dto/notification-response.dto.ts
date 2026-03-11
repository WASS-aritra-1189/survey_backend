/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import {
  DeviceType,
  NotificationAction,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '../../../shared/enums/notification.enum';

export class NotificationResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty({ enum: NotificationType })
  @Expose()
  type: NotificationType;

  @ApiProperty({ enum: NotificationCategory })
  @Expose()
  category: NotificationCategory;

  @ApiProperty({ enum: NotificationPriority })
  @Expose()
  priority: NotificationPriority;

  @ApiProperty({ enum: NotificationStatus })
  @Expose()
  status: NotificationStatus;

  @ApiProperty({ enum: DeviceType })
  @Expose()
  deviceType: DeviceType;

  @ApiProperty({ enum: NotificationAction })
  @Expose()
  action: NotificationAction;

  @ApiProperty()
  @Expose()
  imageUrl: string;

  @ApiProperty()
  @Expose()
  iconUrl: string;

  @ApiProperty()
  @Expose()
  actionUrl: string;

  @ApiProperty()
  @Expose()
  actionText: string;

  @ApiProperty()
  @Expose()
  scheduledAt: Date;

  @ApiProperty({ type: [String] })
  @Expose()
  readByUsers: string[];

  @ApiProperty()
  @Expose()
  readTimestamps: { [userId: string]: Date };

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class NotificationListResponseDto extends PaginatedResponseDto<NotificationResponseDto> {
  @ApiProperty({ type: [NotificationResponseDto] })
  @Expose()
  @Type(() => NotificationResponseDto)
  declare data: NotificationResponseDto[];
}