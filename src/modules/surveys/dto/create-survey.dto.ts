/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceType } from 'src/shared/enums/device-type';
import { CreateQuestionDto } from './create-question.dto';

export class CreateSurveyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  target?: number;

  @ApiPropertyOptional({ 
    enum: DeviceType, 
    isArray: true 
  })
  @IsOptional()
  @IsArray()
  deviceType?: DeviceType[];

  @ApiPropertyOptional()
  @IsOptional()
  requiresLocationValidation?: boolean;

  @ApiPropertyOptional({ description: 'Allow anonymous submission without JWT authentication' })
  @IsOptional()
  allowAnonymousSubmission?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surveyTypeId?: string;
}
