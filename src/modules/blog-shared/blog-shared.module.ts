/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryBuilderService } from '../../core/services/query-builder.service';
import { BlogSharedController } from './blog-shared.controller';
import { BlogSharedService } from './blog-shared.service';
import { BlogShared } from './entities/blog-shared.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogShared])],
  controllers: [BlogSharedController],
  providers: [
    {
      provide: 'IBlogSharedService',
      useClass: BlogSharedService,
    },
    QueryBuilderService,
  ],
  exports: ['IBlogSharedService'],
})
export class BlogSharedModule {}
