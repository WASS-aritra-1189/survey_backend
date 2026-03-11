/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BlogSharedController } from './blog-shared.controller';
import { BlogSharedService } from './blog-shared.service';

describe('BlogSharedController', () => {
  let controller: BlogSharedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogSharedController],
      providers: [BlogSharedService],
    }).compile();

    controller = module.get<BlogSharedController>(BlogSharedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
