/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSharedService } from './blog-shared.service';

describe('BlogSharedService', () => {
  let service: BlogSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogSharedService],
    }).compile();

    service = module.get<BlogSharedService>(BlogSharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
