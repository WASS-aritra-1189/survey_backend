/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreateSurveyMasterDto extends BaseDto {
  @ApiProperty({ description: 'Login ID', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  loginId: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Survey limit', default: 0 })
  @IsInt()
  @Min(0)
  surveyLimit: number;

  @ApiPropertyOptional({ description: 'Setting ID (optional for ROOT/ROOT_STAFF)' })
  @IsOptional()
  @IsUUID()
  settingId?: string;
}
