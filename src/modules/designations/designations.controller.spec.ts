/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DesignationsController } from './designations.controller';
import { DesignationsService } from './designations.service';

describe('DesignationsController', () => {
  let controller: DesignationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignationsController],
      providers: [DesignationsService],
    }).compile();

    controller = module.get<DesignationsController>(DesignationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
