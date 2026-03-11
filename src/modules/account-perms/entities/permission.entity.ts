/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { PermissionType } from '../../../shared/enums/permissions.enum';
import { AccountPermission } from './account-perms.entity';

@Entity('permissions')
@Index(['name'])
export class Permission extends BaseEntity {
  @Column({ type: 'enum', enum: PermissionType, default: PermissionType.ALL })
  name: PermissionType;

  @OneToMany(
    () => AccountPermission,
    acccountPermissions => acccountPermissions.permission,
  )
  acccountPermissions: AccountPermission[];
}
