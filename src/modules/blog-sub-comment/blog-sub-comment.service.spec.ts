/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSubCommentService } from './blog-sub-comment.service';

describe('BlogSubCommentService', () => {
  let service: BlogSubCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogSubCommentService],
    }).compile();

    service = module.get<BlogSubCommentService>(BlogSubCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
