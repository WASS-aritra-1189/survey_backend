/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffDetail } from './entities/staff-detail.entity';
import { StaffDetailsController } from './staff-details.controller';
import { StaffDetailsService } from './staff-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffDetail])],
  controllers: [StaffDetailsController],
  providers: [
    {
      provide: 'IStaffDetailsService',
      useClass: StaffDetailsService,
    },
  ],
  exports: ['IStaffDetailsService'],
})
export class StaffDetailsModule {}
