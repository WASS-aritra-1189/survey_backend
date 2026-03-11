/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { IsOptional, IsUUID, IsDateString, IsArray, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';

export class QuerySurveyResponseDto extends QueryBaseDto {
  @IsOptional()
  @IsUUID()
  surveyId?: string;

  @IsOptional()
  @IsUUID()
  surveyMasterId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(id => id.trim());
    }
    return value;
  })
  @IsArray()
  @IsUUID('4', { each: true })
  surveyMasterIds?: string[];

  @IsOptional()
  @IsString()
  respondentName?: string;

  @IsOptional()
  @IsString()
  respondentContact?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
