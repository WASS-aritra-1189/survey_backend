/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PaymentHistoryService } from './payment-history.service';

describe('PaymentHistoryService', () => {
  let service: PaymentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentHistoryService],
    }).compile();

    service = module.get<PaymentHistoryService>(PaymentHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
