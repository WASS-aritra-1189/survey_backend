/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BankDetailsController } from './bank-details.controller';
import { BankDetailsService } from './bank-details.service';

describe('BankDetailsController', () => {
  let controller: BankDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDetailsController],
      providers: [BankDetailsService],
    }).compile();

    controller = module.get<BankDetailsController>(BankDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
