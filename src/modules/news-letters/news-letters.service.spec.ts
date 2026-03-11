/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NewsLettersService } from './news-letters.service';

describe('NewsLettersService', () => {
  let service: NewsLettersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsLettersService],
    }).compile();

    service = module.get<NewsLettersService>(NewsLettersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
