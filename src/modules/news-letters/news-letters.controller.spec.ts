/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NewsLettersController } from './news-letters.controller';
import { NewsLettersService } from './news-letters.service';

describe('NewsLettersController', () => {
  let controller: NewsLettersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsLettersController],
      providers: [NewsLettersService],
    }).compile();

    controller = module.get<NewsLettersController>(NewsLettersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
