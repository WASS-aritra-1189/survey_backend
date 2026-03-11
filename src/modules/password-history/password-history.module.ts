/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHistory } from './entities/password-history.entity';
import { PasswordHistoryController } from './password-history.controller';
import { PasswordHistoryService } from './password-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordHistory])],
  controllers: [PasswordHistoryController],
  providers: [
    { provide: 'IPasswordHistoryService', useClass: PasswordHistoryService },
  ],
  exports: ['IPasswordHistoryService'],
})
export class PasswordHistoryModule {}
