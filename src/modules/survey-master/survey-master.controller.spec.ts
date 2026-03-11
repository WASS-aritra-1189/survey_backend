/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SurveyMasterController } from './survey-master.controller';
import { SurveyMasterService } from './survey-master.service';

describe('SurveyMasterController', () => {
  let controller: SurveyMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyMasterController],
      providers: [
        {
          provide: SurveyMasterService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SurveyMasterController>(SurveyMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
