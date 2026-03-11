/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { IPagesService } from './interfaces/pages-service.interface';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [PagesController],
  providers: [
    {
      provide: 'IPagesService',
      useClass: PagesService,
    },
  ],
  exports: ['IPagesService'],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PagesModule {}
