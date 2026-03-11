/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHistoryService } from './password-history.service';

describe('PasswordHistoryService', () => {
  let service: PasswordHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHistoryService],
    }).compile();

    service = module.get<PasswordHistoryService>(PasswordHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
