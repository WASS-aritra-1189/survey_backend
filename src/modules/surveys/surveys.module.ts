/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { ZonesModule } from '../zones/zones.module';
import { SurveyController } from './surveys.controller';
import { SurveyService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyAssignmentLocation } from './entities/survey-assignment-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, QuestionOption, SurveyMaster, SurveyAssignmentLocation]), ActivityLogsModule, ZonesModule],
  controllers: [SurveyController],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
