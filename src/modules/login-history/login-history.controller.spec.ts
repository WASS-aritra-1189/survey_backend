/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LoginHistoryController } from './login-history.controller';
import { LoginHistoryService } from './login-history.service';

describe('LoginHistoryController', () => {
  let controller: LoginHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginHistoryController],
      providers: [LoginHistoryService],
    }).compile();

    controller = module.get<LoginHistoryController>(LoginHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
