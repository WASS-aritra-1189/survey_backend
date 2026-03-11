/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AccountPermissionsController } from './account-permissions.controller';
import { AccountPermissionsService } from './account-permissions.service';

describe('AccountPermissionsController', () => {
  let controller: AccountPermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountPermissionsController],
      providers: [AccountPermissionsService],
    }).compile();

    controller = module.get<AccountPermissionsController>(
      AccountPermissionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
