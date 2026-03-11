/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { NotificationsService } from '../../modules/notifications/notifications.service';

export interface NotificationJobData {
  notificationId: string;
  type: 'send' | 'schedule';
}

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Process('send-notification')
  async handleSendNotification(job: Job<NotificationJobData>): Promise<void> {
    this.logger.log(`Processing notification job: ${job.data.notificationId}`);

    try {
      await this.notificationsService.sendNotification(job.data.notificationId);
      this.logger.log(`Successfully sent notification: ${job.data.notificationId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification ${job.data.notificationId}:`, error);
      throw error;
    }
  }

  @Process('process-scheduled')
  async handleScheduledNotifications(job: Job): Promise<void> {
    this.logger.log('Processing scheduled notifications');

    try {
      await this.notificationsService.processScheduledNotifications();
      this.logger.log('Successfully processed scheduled notifications');
    } catch (error) {
      this.logger.error('Failed to process scheduled notifications:', error);
      throw error;
    }
  }
}
