/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsNumber, ValidateNested, Min, Max, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationConstraintDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(100)
  radiusInMeters?: number;
}

export class AssignSurveyMasterWithLocationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  surveyMasterId: string;

  @ApiPropertyOptional({ type: LocationConstraintDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationConstraintDto)
  locationConstraint?: LocationConstraintDto;
}
