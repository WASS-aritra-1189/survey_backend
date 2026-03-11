/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BankDetailsService } from './bank-details.service';

describe('BankDetailsService', () => {
  let service: BankDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDetailsService],
    }).compile();

    service = module.get<BankDetailsService>(BankDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
