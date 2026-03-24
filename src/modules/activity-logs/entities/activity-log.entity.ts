/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Account } from '../../account/entities/account.entity';

export enum ActivityAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
}

export enum ActivityModule {
  SURVEY = 'SURVEY',
  SURVEY_MASTER = 'SURVEY_MASTER',
  DEVICE = 'DEVICE',
  MENU = 'MENU',
  PERMISSION = 'PERMISSION',
  ACCOUNT = 'ACCOUNT',
  SURVEY_RESPONSE = 'SURVEY_RESPONSE',
  AUTH = 'AUTH',
}

@Entity('activity_logs')
@Index(['accountId'])
@Index(['module'])
@Index(['action'])
export class ActivityLog extends BaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'enum', enum: ActivityModule })
  module: ActivityModule;

  @Column({ type: 'enum', enum: ActivityAction })
  action: ActivityAction;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  resourceId: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
