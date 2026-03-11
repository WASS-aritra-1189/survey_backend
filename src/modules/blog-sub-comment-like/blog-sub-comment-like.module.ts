/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogSubCommentLikeController } from './blog-sub-comment-like.controller';
import { BlogSubCommentLikeService } from './blog-sub-comment-like.service';
import { BlogSubCommentLike } from './entities/blog-sub-comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogSubCommentLike])],
  controllers: [BlogSubCommentLikeController],
  providers: [
    {
      provide: 'IBlogSubCommentLikeService',
      useClass: BlogSubCommentLikeService,
    },
  ],
  exports: ['IBlogSubCommentLikeService'],
})
export class BlogSubCommentLikeModule {}
