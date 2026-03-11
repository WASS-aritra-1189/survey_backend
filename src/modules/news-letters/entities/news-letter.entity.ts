/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import {
  EmailFrequency,
  NewsletterCategory,
} from '../../../shared/enums/newsletter.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('news_letters')
@Index(['category'])
@Index(['frequency'])
@Index(['status'])
@Index(['accountId'])
@Index(['settingId'])
export class NewsLetter extends BaseEntity {
  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: NewsletterCategory,
  })
  category: NewsletterCategory;

  @Column({
    type: 'enum',
    enum: EmailFrequency,
  })
  frequency: EmailFrequency;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.ACTIVE,
  })
  status: DefaultStatus;

  @Column({ type: 'text', nullable: true })
  template?: string;

  @Column({ type: 'uuid' })
  settingId: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Setting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
