/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSubCommentLikeService } from './blog-sub-comment-like.service';

describe('BlogSubCommentLikeService', () => {
  let service: BlogSubCommentLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogSubCommentLikeService],
    }).compile();

    service = module.get<BlogSubCommentLikeService>(BlogSubCommentLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
