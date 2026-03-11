/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHistoryController } from './password-history.controller';
import { PasswordHistoryService } from './password-history.service';

describe('PasswordHistoryController', () => {
  let controller: PasswordHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordHistoryController],
      providers: [PasswordHistoryService],
    }).compile();

    controller = module.get<PasswordHistoryController>(PasswordHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
