/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentsService } from './blog-comments.service';

describe('BlogCommentsService', () => {
  let service: BlogCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogCommentsService],
    }).compile();

    service = module.get<BlogCommentsService>(BlogCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
