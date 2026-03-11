/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyMaster } from './entities/survey-master.entity';
import { SurveyMasterService } from './survey-master.service';

describe('SurveyMasterService', () => {
  let service: SurveyMasterService;
  let repository: Repository<SurveyMaster>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyMasterService,
        {
          provide: getRepositoryToken(SurveyMaster),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SurveyMasterService>(SurveyMasterService);
    repository = module.get<Repository<SurveyMaster>>(getRepositoryToken(SurveyMaster));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
