/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
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
import { Setting } from '../../settings/entities/setting.entity';

@Entity('notifications')
@Index(['status'])
@Index(['type'])
@Index(['category'])
@Index(['priority'])
@Index(['scheduledAt'])
@Index(['isActive'])
@Index(['settingId'])
export class Notification extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationCategory })
  category: NotificationCategory;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'enum', enum: DeviceType, default: DeviceType.ALL })
  deviceType: DeviceType;

  @Column({ type: 'enum', enum: NotificationTemplate, nullable: true })
  template: NotificationTemplate;

  @Column({
    type: 'enum',
    enum: NotificationAction,
    default: NotificationAction.NONE,
  })
  action: NotificationAction;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  iconUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  actionUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actionText: string;

  @Column({ type: 'json', nullable: true })
  actionData: object;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sound: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  badge: string;

  @Column({ type: 'json', nullable: true })
  customData: object;

  @Column({ type: 'json', nullable: true })
  userIds: string[];

  @Column({ type: 'json', nullable: true })
  deviceTokens: string[];

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: ScheduleType, default: ScheduleType.ONCE })
  scheduleType: ScheduleType;

  @Column({ type: 'timestamp', nullable: true })
  lastSentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextScheduledAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  readByUsers: string[];

  @Column({ type: 'json', nullable: true })
  readTimestamps: { [userId: string]: Date };

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
