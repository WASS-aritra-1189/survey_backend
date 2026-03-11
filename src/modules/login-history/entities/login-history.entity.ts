/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DeviceType, LogType } from '../../../shared/enums/login.enum';
import { Account } from '../../account/entities/account.entity';

@Entity('login_history')
@Index(['accountId', 'createdAt'])
@Index(['ipAddress'])
export class LoginHistory extends BaseEntity {
  @Column({
    type: 'enum',
    enum: LogType,
    default: LogType.LOGIN,
  })
  logType: LogType;

  @Column({ length: 45 })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.UNKNOWN,
  })
  deviceType: DeviceType;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;
}
