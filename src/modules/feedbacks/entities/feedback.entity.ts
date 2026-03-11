/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import {
    FeedbackRating,
    FeedbackType,
} from '../../../shared/enums/feedback.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('feedbacks')
@Index(['type'])
@Index(['rating'])
@Index(['status'])
@Index(['accountId'])
@Index(['settingId'])

export class Feedback extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: FeedbackType })
  type: FeedbackType;

  @Column({ type: 'enum', enum: FeedbackRating })
  rating: FeedbackRating;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  respondedBy: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Setting)
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'respondedBy' })
  responder: Account;
}
