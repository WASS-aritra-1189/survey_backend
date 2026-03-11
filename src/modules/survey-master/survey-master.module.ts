/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { SurveyMaster } from './entities/survey-master.entity';
import { SurveyMasterController } from './survey-master.controller';
import { SurveyMasterService } from './survey-master.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyMaster]), ActivityLogsModule],
  controllers: [SurveyMasterController],
  providers: [SurveyMasterService],
  exports: [SurveyMasterService],
})
export class SurveyMasterModule {}
