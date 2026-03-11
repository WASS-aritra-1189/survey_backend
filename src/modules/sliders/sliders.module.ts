/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../../core/core.module';
import { Slider } from './entities/slider.entity';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slider]), CoreModule],
  controllers: [SlidersController],
  providers: [
    {
      provide: 'ISlidersService',
      useClass: SlidersService,
    },
  ],
  exports: ['ISlidersService'],
})
export class SlidersModule {}
