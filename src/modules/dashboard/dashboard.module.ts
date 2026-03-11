import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Survey } from '../surveys/entities/survey.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyResponse } from '../survey-responses/entities/survey-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, SurveyMaster, SurveyResponse])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
