/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPermission } from '../account-perms/entities/account-perms.entity';
import { Setting } from './entities/setting.entity';
import { ISettingsService } from './interfaces/settings-service.interface';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, AccountPermission])],
  controllers: [SettingsController],
  providers: [
    {
      provide: 'ISettingsService',
      useClass: SettingsService,
    },
  ],
  exports: ['ISettingsService'],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SettingsModule {}
