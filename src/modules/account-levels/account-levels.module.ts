/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountLevelsController } from './account-levels.controller';
import { AccountLevelsService } from './account-levels.service';
import { AccountLevel } from './entities/account-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountLevel])],
  controllers: [AccountLevelsController],
  providers: [
    {
      provide: 'IAccountLevelsService',
      useClass: AccountLevelsService,
    },
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AccountLevelsModule {}
