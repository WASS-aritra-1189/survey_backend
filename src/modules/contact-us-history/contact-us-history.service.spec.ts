/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactUsHistoryService } from './contact-us-history.service';

describe('ContactUsHistoryService', () => {
  let service: ContactUsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactUsHistoryService],
    }).compile();

    service = module.get<ContactUsHistoryService>(ContactUsHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
