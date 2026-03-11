/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

describe('SubCategoryController', () => {
  let controller: SubCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [SubCategoryService],
    }).compile();

    controller = module.get<SubCategoryController>(SubCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
