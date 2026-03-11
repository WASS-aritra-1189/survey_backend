/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SlidersService } from './sliders.service';

describe('SlidersService', () => {
  let service: SlidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlidersService],
    }).compile();

    service = module.get<SlidersService>(SlidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
