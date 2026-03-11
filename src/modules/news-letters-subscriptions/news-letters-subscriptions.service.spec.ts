/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NewsLettersSubscriptionsService } from './news-letters-subscriptions.service';

describe('NewsLettersSubscriptionsService', () => {
  let service: NewsLettersSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsLettersSubscriptionsService],
    }).compile();

    service = module.get<NewsLettersSubscriptionsService>(NewsLettersSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
