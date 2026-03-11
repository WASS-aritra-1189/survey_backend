/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginHistory } from './entities/login-history.entity';
import { LoginHistoryController } from './login-history.controller';
import { LoginHistoryService } from './login-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory])],
  controllers: [LoginHistoryController],
  providers: [
    {
      provide: 'ILoginHistoryService',
      useClass: LoginHistoryService,
    },
  ],
  exports: ['ILoginHistoryService'],
})
export class LoginHistoryModule {}
