/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentLikesController } from './blog-comment-likes.controller';
import { BlogCommentLikesService } from './blog-comment-likes.service';

describe('BlogCommentLikesController', () => {
  let controller: BlogCommentLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCommentLikesController],
      providers: [BlogCommentLikesService],
    }).compile();

    controller = module.get<BlogCommentLikesController>(BlogCommentLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
