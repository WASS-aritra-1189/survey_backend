/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSubCommentController } from './blog-sub-comment.controller';
import { BlogSubCommentService } from './blog-sub-comment.service';

describe('BlogSubCommentController', () => {
  let controller: BlogSubCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogSubCommentController],
      providers: [BlogSubCommentService],
    }).compile();

    controller = module.get<BlogSubCommentController>(BlogSubCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
