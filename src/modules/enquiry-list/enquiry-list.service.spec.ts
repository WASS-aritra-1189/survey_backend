/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EnquiryListService } from './enquiry-list.service';

describe('EnquiryListService', () => {
  let service: EnquiryListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnquiryListService],
    }).compile();

    service = module.get<EnquiryListService>(EnquiryListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
