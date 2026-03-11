/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Account } from '../../account/entities/account.entity';
import { Menu } from './menu.entity';
import { Permission } from './permission.entity';

@Entity('account_permissions')
@Index(['accountId'])
@Index(['menuId'])
@Index(['permissionId'])
@Index(['status'])
@Index(['accountId', 'menuId', 'permissionId'])
export class AccountPermission extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'uuid' })
  menuId: string;

  @Column({ type: 'uuid' })
  permissionId: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
