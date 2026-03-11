/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { Question } from '../surveys/entities/question.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyAssignmentLocation } from '../surveys/entities/survey-assignment-location.entity';
import { SurveyResponsesController } from './survey-responses.controller';
import { SurveyResponseService } from './survey-responses.service';
import { SurveyResponse } from './entities/survey-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyResponse, Survey, Question, SurveyMaster, SurveyAssignmentLocation])],
  controllers: [SurveyResponsesController],
  providers: [
    { provide: 'ISurveyResponseService', useClass: SurveyResponseService },
  ],
  exports: ['ISurveyResponseService'],
})
export class SurveyResponsesModule {}
