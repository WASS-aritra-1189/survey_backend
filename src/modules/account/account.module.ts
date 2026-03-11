/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPermission } from '../account-perms/entities/account-perms.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { IAccountsService } from './interfaces/accounts-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountPermission])],
  controllers: [AccountController],
  providers: [
    {
      provide: 'IAccountsService',
      useClass: AccountService,
    },
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AccountModule {}
