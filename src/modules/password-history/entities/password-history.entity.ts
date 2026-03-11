/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('password_history')
@Index(['accountId'])
@Index(['changedAt'])
@Index(['status'])
@Index(['ipAddress'])
export class PasswordHistory extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  oldPassword: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  newPassword: string;

  @Column({ type: 'timestamp' })
  changedAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  changeReason: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, { nullable: true })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
