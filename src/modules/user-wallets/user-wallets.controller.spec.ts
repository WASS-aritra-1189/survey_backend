/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserWalletsController } from './user-wallets.controller';
import { UserWalletsService } from './user-wallets.service';

describe('UserWalletsController', () => {
  let controller: UserWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWalletsController],
      providers: [UserWalletsService],
    }).compile();

    controller = module.get<UserWalletsController>(UserWalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
