/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserWalletsService } from './user-wallets.service';

describe('UserWalletsService', () => {
  let service: UserWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWalletsService],
    }).compile();

    service = module.get<UserWalletsService>(UserWalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
