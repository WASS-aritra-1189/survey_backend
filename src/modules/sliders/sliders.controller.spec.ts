/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';

describe('SlidersController', () => {
  let controller: SlidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlidersController],
      providers: [SlidersService],
    }).compile();

    controller = module.get<SlidersController>(SlidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
