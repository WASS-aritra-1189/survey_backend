/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Account } from '../../account/entities/account.entity';

@Entity('sessions')
@Index(['accountId'])
@Index(['token'])
@Index(['refreshToken'])
@Index(['expiresAt'])
@Index(['isActive'])
export class Session extends BaseEntity {
  @Column()
  token: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column()
  refreshExpiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  accountId: string;
}
