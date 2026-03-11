/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogLikesController } from './blog-likes.controller';
import { BlogLikesService } from './blog-likes.service';
import { BlogLike } from './entities/blog-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogLike])],
  controllers: [BlogLikesController],
  providers: [
    {
      provide: 'IBlogLikesService',
      useClass: BlogLikesService,
    },
  ],
  exports: ['IBlogLikesService'],
})
export class BlogLikesModule {}
