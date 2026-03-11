/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, type TestingModule } from '@nestjs/testing';
import { ContactUsHistoryController } from './contact-us-history.controller';
import { ContactUsHistoryService } from './contact-us-history.service';

describe('ContactUsHistoryController', () => {
  let controller: ContactUsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactUsHistoryController],
      providers: [ContactUsHistoryService],
    }).compile();

    controller = module.get<ContactUsHistoryController>(
      ContactUsHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
