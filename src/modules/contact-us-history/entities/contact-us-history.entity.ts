/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { ContactStatus } from '../../../shared/enums/contact-status.enum';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('contact_us_history')
@Index(['email'])
@Index(['status'])
@Index(['settingId'])

export class ContactUsHistory extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
