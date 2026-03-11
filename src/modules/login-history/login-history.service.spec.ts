/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LoginHistoryService } from './login-history.service';

describe('LoginHistoryService', () => {
  let service: LoginHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginHistoryService],
    }).compile();

    service = module.get<LoginHistoryService>(LoginHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
