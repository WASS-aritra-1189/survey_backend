/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { ContactStatus } from '../../../shared/enums/contact-status.enum';
import {
    EnquiryPriority,
    EnquirySource,
    EnquiryType,
} from '../../../shared/enums/enquiry.enum';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('enquiry_list')
@Index(['email'])
@Index(['status'])
@Index(['enquiryType'])
@Index(['priority'])
@Index(['source'])
@Index(['assignedToId'])
@Index(['settingId'])

export class EnquiryList extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ length: 100, nullable: true })
  company?: string;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: EnquiryType,
    default: EnquiryType.GENERAL,
  })
  enquiryType: EnquiryType;

  @Column({
    type: 'enum',
    enum: EnquiryPriority,
    default: EnquiryPriority.MEDIUM,
  })
  priority: EnquiryPriority;

  @Column({
    type: 'enum',
    enum: EnquirySource,
    default: EnquirySource.WEBSITE,
  })
  source: EnquirySource;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  response?: string;

  @Column({ type: 'uuid', nullable: true })
  assignedToId?: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  followUpDate?: Date;

  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ length: 255, nullable: true })
  referrerUrl?: string;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn()
  assignedTo?: Account;
}
