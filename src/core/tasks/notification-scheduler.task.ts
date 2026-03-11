/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, Logger } from '@nestjs/common';
import { NotificationQueueService } from '../services/notification-queue.service';

@Injectable()
export class NotificationSchedulerTask {
  private readonly logger = new Logger(NotificationSchedulerTask.name);

  constructor(
    private readonly notificationQueueService: NotificationQueueService,
  ) {}

  async scheduleNotification(
    notificationId: string,
    scheduledTime?: Date,
  ): Promise<void> {
    try {
      if (scheduledTime) {
        await this.notificationQueueService.scheduleNotification(
          notificationId,
          scheduledTime,
        );
      } else {
        await this.notificationQueueService.addNotificationJob(notificationId);
      }
    } catch (error) {
      this.logger.error('Failed to schedule notification:', error);
    }
  }

  async getQueueStats() {
    return this.notificationQueueService.getQueueStats();
  }
}