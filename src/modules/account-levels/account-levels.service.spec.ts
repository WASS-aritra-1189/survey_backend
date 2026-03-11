/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AccountLevelsService } from './account-levels.service';

describe('AccountLevelsService', () => {
  let service: AccountLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountLevelsService],
    }).compile();

    service = module.get<AccountLevelsService>(AccountLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
