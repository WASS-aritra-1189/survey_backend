/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCommentLikesController } from './blog-comment-likes.controller';
import { BlogCommentLike } from './entities/blog-comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCommentLike])],
  controllers: [BlogCommentLikesController],
  // providers: [
  //   {
  //     provide: 'IBlogCommentLikesService',
  //     useClass: BlogCommentLikesService,
  //   },
  // ],
  // exports: ['IBlogCommentLikesService'],
})
export class BlogCommentLikesModule {}
