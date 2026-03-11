/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentLikesService } from './blog-comment-likes.service';

describe('BlogCommentLikesService', () => {
  let service: BlogCommentLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogCommentLikesService],
    }).compile();

    service = module.get<BlogCommentLikesService>(BlogCommentLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
