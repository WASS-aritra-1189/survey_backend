/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSubCommentLikeController } from './blog-sub-comment-like.controller';
import { BlogSubCommentLikeService } from './blog-sub-comment-like.service';

describe('BlogSubCommentLikeController', () => {
  let controller: BlogSubCommentLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogSubCommentLikeController],
      providers: [BlogSubCommentLikeService],
    }).compile();

    controller = module.get<BlogSubCommentLikeController>(BlogSubCommentLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
