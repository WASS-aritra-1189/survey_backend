/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogLikesService } from './blog-likes.service';

describe('BlogLikesService', () => {
  let service: BlogLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogLikesService],
    }).compile();

    service = module.get<BlogLikesService>(BlogLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
