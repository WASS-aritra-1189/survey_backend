/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryBuilderService } from '../../core/services/query-builder.service';
import { BlogSubCommentController } from './blog-sub-comment.controller';
import { BlogSubCommentService } from './blog-sub-comment.service';
import { BlogSubComment } from './entities/blog-sub-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogSubComment])],
  controllers: [BlogSubCommentController],
  providers: [
    {
      provide: 'IBlogSubCommentService',
      useClass: BlogSubCommentService,
    },
    QueryBuilderService,
  ],
  exports: ['IBlogSubCommentService'],
})
export class BlogSubCommentModule {}
