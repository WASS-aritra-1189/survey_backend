/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bull';
import { NotificationJobData } from '../queues/notification.queue';

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {
    this.setupRecurringJobs();
  }

  async addNotificationJob(
    notificationId: string,
    delay?: number,
  ): Promise<void> {
    const jobData: NotificationJobData = {
      notificationId,
      type: 'send',
    };

    await this.notificationQueue.add('send-notification', jobData, {
      delay: delay || 0,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.log(`Added notification job for ID: ${notificationId}`);
  }

  async scheduleNotification(
    notificationId: string,
    scheduledTime: Date,
  ): Promise<void> {
    const delay = scheduledTime.getTime() - Date.now();

    if (delay > 0) {
      await this.addNotificationJob(notificationId, delay);
      this.logger.log(
        `Scheduled notification ${notificationId} for ${scheduledTime}`,
      );
    } else {
      await this.addNotificationJob(notificationId);
      this.logger.log(`Immediate notification ${notificationId}`);
    }
  }

  private async setupRecurringJobs(): Promise<void> {
    // Add recurring job to process scheduled notifications every minute
    await this.notificationQueue.add(
      'process-scheduled',
      {},
      {
        repeat: { cron: '* * * * *' }, // Every minute
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    );

    this.logger.log('Setup recurring notification processing job');
  }

  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.notificationQueue.getWaiting(),
      this.notificationQueue.getActive(),
      this.notificationQueue.getCompleted(),
      this.notificationQueue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}
