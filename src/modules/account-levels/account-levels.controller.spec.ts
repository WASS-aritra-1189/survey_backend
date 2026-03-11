/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AccountLevelsController } from './account-levels.controller';
import { AccountLevelsService } from './account-levels.service';

describe('AccountLevelsController', () => {
  let controller: AccountLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountLevelsController],
      providers: [AccountLevelsService],
    }).compile();

    controller = module.get<AccountLevelsController>(AccountLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
