/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class QueryPerformanceAnalyticsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surveyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  masterId?: string;
}
