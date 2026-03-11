/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { SubscriptionStatus } from '../../../shared/enums/newsletter.enum';
import { Account } from '../../account/entities/account.entity';
import { NewsLetter } from '../../news-letters/entities/news-letter.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('news_letters_subscriptions')
@Index(['email'])
@Index(['status'])
@Index(['accountId'])
@Index(['settingId'])
export class NewsLettersSubscription extends BaseEntity {
  @Column({ type: 'uuid' })
  settingId: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING_CONFIRMATION,
  })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', nullable: true })
  subscribedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt?: Date;

  @Column({ type: 'text', nullable: true })
  unsubscribeReason?: string;

  @ManyToOne(() => Setting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
