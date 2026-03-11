/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserDetailsController } from './user-details.controller';
import { UserDetailsService } from './user-details.service';

describe('UserDetailsController', () => {
  let controller: UserDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDetailsController],
      providers: [UserDetailsService],
    }).compile();

    controller = module.get<UserDetailsController>(UserDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
