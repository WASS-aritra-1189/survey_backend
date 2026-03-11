/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentsController } from './blog-comments.controller';
import { BlogCommentsService } from './blog-comments.service';

describe('BlogCommentsController', () => {
  let controller: BlogCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCommentsController],
      providers: [BlogCommentsService],
    }).compile();

    controller = module.get<BlogCommentsController>(BlogCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
