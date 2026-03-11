/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMasterSurveyResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  surveyId: string;

  @ApiProperty({ description: 'Survey Master 4-digit access token' })
  @IsNotEmpty()
  @IsString()
  masterToken: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Object)
  responses: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  respondentName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  respondentContact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  longitude?: number;
}
