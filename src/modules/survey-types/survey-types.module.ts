import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyTypesController } from './survey-types.controller';
import { SurveyTypesService } from './survey-types.service';
import { SurveyType } from './entities/survey-type.entity';
import { Survey } from '../surveys/entities/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyType, Survey])],
  controllers: [SurveyTypesController],
  providers: [SurveyTypesService],
  exports: [SurveyTypesService],
})
export class SurveyTypesModule {}
