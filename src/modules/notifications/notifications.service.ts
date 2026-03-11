/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { NotificationQueueService } from '../../core/services/notification-queue.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { NotificationStatus } from '../../shared/enums/notification.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { INotificationsService } from './interfaces/notifications-service.interface';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly queryConfig: QueryConfig<Notification> = {
    alias: 'notification',
    searchFields: ['title', 'message', 'body'],
    sortableFields: [
      'title',
      'type',
      'priority',
      'status',
      'scheduledAt',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryNotificationDto) => {
      if (query.type) {
        qb.andWhere('notification.type = :type', { type: query.type });
      }
      if (query.category) {
        qb.andWhere('notification.category = :category', {
          category: query.category,
        });
      }
      if (query.priority) {
        qb.andWhere('notification.priority = :priority', {
          priority: query.priority,
        });
      }
      if (query.status) {
        qb.andWhere('notification.status = :status', { status: query.status });
      }
      if (query.deviceType) {
        qb.andWhere('notification.deviceType = :deviceType', {
          deviceType: query.deviceType,
        });
      }
      if (query.isRead !== undefined && query.userId) {
        if (query.isRead) {
          qb.andWhere('JSON_CONTAINS(notification.readByUsers, :userId)', {
            userId: JSON.stringify([query.userId]),
          });
        } else {
          qb.andWhere(
            'NOT JSON_CONTAINS(notification.readByUsers, :userId) OR notification.readByUsers IS NULL',
            { userId: JSON.stringify([query.userId]) },
          );
        }
      }
      if (query.userId) {
        qb.andWhere('JSON_CONTAINS(notification.userIds, :userId)', {
          userId: JSON.stringify([query.userId]),
        });
      }
    },
  };

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly firebaseService: FirebaseService,
    private readonly notificationQueueService: NotificationQueueService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );

    // Set next scheduled time for recurring notifications
    if (notification.scheduleType !== 'ONCE' && notification.scheduledAt) {
      notification.nextScheduledAt = new Date(notification.scheduledAt);
    }

    const savedNotification =
      await this.notificationRepository.save(notification);

    // Queue notification for processing
    if (savedNotification.scheduledAt) {
      await this.notificationQueueService.scheduleNotification(
        savedNotification.id,
        savedNotification.scheduledAt,
      );
    } else {
      await this.notificationQueueService.addNotificationJob(
        savedNotification.id,
      );
    }

    await this.clearNotificationCache();
    return savedNotification;
  }

  async findAll(
    query: QueryNotificationDto,
  ): Promise<PaginatedResult<Notification>> {
    const cacheKey = `notification:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Notification>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.notificationRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );
    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string): Promise<Notification> {
    const cacheKey = `notification:${id}`;
    const cached = await this.cacheService.get<Notification>(cacheKey);
    if (cached) {
      return cached;
    }

    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['setting'],
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, notification, 300);
    return notification;
  }

  async findByUser(
    userId: string,
    query: QueryNotificationDto,
  ): Promise<PaginatedResult<Notification>> {
    query.userId = userId;
    return this.findAll(query);
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if user is in the notification's user list
    if (notification.userIds && !notification.userIds.includes(userId)) {
      throw new CustomException(
        MESSAGE_CODES.FORBIDDEN,
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    // Initialize arrays if null
    if (!notification.readByUsers) {
      notification.readByUsers = [];
    }
    if (!notification.readTimestamps) {
      notification.readTimestamps = {};
    }

    // Add user to read list if not already read
    if (!notification.readByUsers.includes(userId)) {
      notification.readByUsers.push(userId);
      notification.readTimestamps[userId] = new Date();
    }

    const updatedNotification =
      await this.notificationRepository.save(notification);
    await this.clearNotificationCache(id);
    return updatedNotification;
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification."userIds"::jsonb @> :userId::jsonb', {
        userId: JSON.stringify([userId]),
      })
      .andWhere(
        '(NOT notification."readByUsers"::jsonb @> :userId::jsonb OR notification."readByUsers" IS NULL)',
        { userId: JSON.stringify([userId]) },
      )
      .getMany();

    for (const notification of notifications) {
      if (!notification.readByUsers) {
        notification.readByUsers = [];
      }
      if (!notification.readTimestamps) {
        notification.readTimestamps = {};
      }

      if (!notification.readByUsers.includes(userId)) {
        notification.readByUsers.push(userId);
        notification.readTimestamps[userId] = new Date();
      }
    }

    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }

    await this.clearNotificationCache();
    return notifications;
  }

  async sendNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    // Send Firebase notification if enabled
    if (this.firebaseService.isFirebaseEnabled()) {
      await this.sendFirebaseNotification(notification);
    }

    notification.status = NotificationStatus.SENT;
    const updatedNotification =
      await this.notificationRepository.save(notification);
    await this.clearNotificationCache(id);
    return updatedNotification;
  }

  async updateStatus(
    id: string,
    status: NotificationStatus,
    updatedBy: string,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    notification.status = status;
    notification.updatedBy = updatedBy;
    const updatedNotification =
      await this.notificationRepository.save(notification);
    await this.clearNotificationCache(id);
    return updatedNotification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(notification, updateNotificationDto);
    const updatedNotification =
      await this.notificationRepository.save(notification);
    await this.clearNotificationCache(id);
    return updatedNotification;
  }

  async remove(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.notificationRepository.remove(notification);
    await this.clearNotificationCache(id);
    return notification;
  }

  private async sendFirebaseNotification(
    notification: Notification,
  ): Promise<void> {
    try {
      if (
        !notification.deviceTokens ||
        notification.deviceTokens.length === 0
      ) {
        this.logger.warn(
          `No device tokens found for notification ${notification.id}`,
        );
        return;
      }

      const customData: Record<string, string> = {};
      if (notification.customData) {
        Object.keys(notification.customData).forEach(key => {
          customData[key] = String(notification.customData[key]);
        });
      }

      // Add notification metadata
      customData.notificationId = notification.id;
      customData.type = notification.type;
      customData.category = notification.category;

      if (notification.actionData) {
        customData.actionData = JSON.stringify(notification.actionData);
      }

      const result = await this.firebaseService.sendNotification(
        notification.deviceTokens,
        notification.title,
        notification.message || notification.body,
        customData,
        notification.imageUrl,
        notification.actionUrl,
        notification.scheduledAt,
      );

      this.logger.log(
        `Firebase notification sent for ${notification.id}: ${result.success} success, ${result.failure} failure`,
      );

      // Update notification status based on Firebase result
      if (result.success > 0) {
        notification.status = NotificationStatus.DELIVERED;
      } else if (result.failure > 0) {
        notification.status = NotificationStatus.FAILED;
      }

      await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `Failed to send Firebase notification for ${notification.id}:`,
        error,
      );
      notification.status = NotificationStatus.FAILED;
      await this.notificationRepository.save(notification);
    }
  }

  async processScheduledNotifications(): Promise<void> {
    const now = new Date();

    // Process one-time scheduled notifications
    const oneTimeNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.scheduledAt <= :now', { now })
      .andWhere('notification.scheduleType = :type', { type: 'ONCE' })
      .andWhere('notification.status = :status', {
        status: NotificationStatus.PENDING,
      })
      .getMany();

    // Process recurring notifications
    const recurringNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.nextScheduledAt <= :now', { now })
      .andWhere('notification.scheduleType != :type', { type: 'ONCE' })
      .andWhere('notification.isActive = :active', { active: true })
      .getMany();

    // Send one-time notifications
    for (const notification of oneTimeNotifications) {
      await this.sendFirebaseNotification(notification);
      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);
    }

    // Send recurring notifications and calculate next schedule
    for (const notification of recurringNotifications) {
      await this.sendFirebaseNotification(notification);
      notification.lastSentAt = now;
      const nextSchedule = this.calculateNextSchedule(
        notification.scheduleType,
        now,
      );
      if (nextSchedule) {
        notification.nextScheduledAt = nextSchedule;
      }
      await this.notificationRepository.save(notification);
    }

    const totalProcessed =
      oneTimeNotifications.length + recurringNotifications.length;
    if (totalProcessed > 0) {
      this.logger.log(`Processed ${totalProcessed} scheduled notifications`);
      await this.clearNotificationCache();
    }
  }

  private calculateNextSchedule(
    scheduleType: string,
    currentTime: Date,
  ): Date | null {
    const next = new Date(currentTime);

    switch (scheduleType) {
      case 'HOURLY':
        next.setHours(next.getHours() + 1);
        break;
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        return null;
    }

    return next;
  }

  private async clearNotificationCache(notificationId?: string): Promise<void> {
    const patterns: string[] = ['notification:list:*'];

    if (notificationId) {
      patterns.push(`notification:${notificationId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
