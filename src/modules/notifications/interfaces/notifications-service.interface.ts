/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { NotificationStatus } from '../../../shared/enums/notification.enum';
import type { CreateNotificationDto } from '../dto/create-notification.dto';
import type { QueryNotificationDto } from '../dto/query-notification.dto';
import type { UpdateNotificationDto } from '../dto/update-notification.dto';
import type { Notification } from '../entities/notification.entity';

export abstract class INotificationsService {
  abstract create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
  abstract findAll(query: QueryNotificationDto): Promise<PaginatedResult<Notification>>;
  abstract findOne(id: string): Promise<Notification>;
  abstract findByUser(userId: string, query: QueryNotificationDto): Promise<PaginatedResult<Notification>>;
  abstract markAsRead(id: string, userId: string): Promise<Notification>;
  abstract markAllAsRead(userId: string): Promise<Notification[]>;
  abstract sendNotification(id: string): Promise<Notification>;
  abstract updateStatus(id: string, status: NotificationStatus, updatedBy: string): Promise<Notification>;
  abstract update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
  abstract remove(id: string): Promise<Notification>;
  abstract processScheduledNotifications(): Promise<void>;
}