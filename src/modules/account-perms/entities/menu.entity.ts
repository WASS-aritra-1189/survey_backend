/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { AccountPermission } from './account-perms.entity';

@Entity('menus')
@Index(['name'])
@Index(['status'])
export class Menu extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @OneToMany(
    () => AccountPermission,
    accountPermissions => accountPermissions.menu,
  )
  accountPermissions: AccountPermission[];
}
