/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWallet } from './entities/user-wallet.entity';
import { UserWalletsController } from './user-wallets.controller';
import { UserWalletsService } from './user-wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWallet])],
  controllers: [UserWalletsController],
  providers: [{ provide: 'IUserWalletsService', useClass: UserWalletsService }],
  exports: ['IUserWalletsService'],
})
export class UserWalletsModule {}
