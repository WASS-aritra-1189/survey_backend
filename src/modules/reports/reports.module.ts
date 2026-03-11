/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { SurveyResponse } from '../survey-responses/entities/survey-response.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, SurveyResponse, SurveyMaster])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
