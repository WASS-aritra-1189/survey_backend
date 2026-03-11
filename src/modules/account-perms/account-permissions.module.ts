/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPermissionsController } from './account-permissions.controller';
import { AccountPermissionsService } from './account-permissions.service';
import { AccountPermission } from './entities/account-perms.entity';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountPermission, Menu, Permission])],
  controllers: [AccountPermissionsController, MenuController],
  providers: [
    {
      provide: 'IAccountPermissionsService',
      useClass: AccountPermissionsService,
    },
    {
      provide: 'IMenuService',
      useClass: MenuService,
    },
  ],
  exports: [
    'IAccountPermissionsService',
    'IMenuService',
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AccountPermissionsModule {}
