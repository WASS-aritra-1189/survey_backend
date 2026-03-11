/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class CreateDesignationDto extends BaseDto {
  @ApiProperty({ description: 'Designation name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Designation description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Priority order',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number = 0;

  @IsEnum(DefaultStatus, { message: 'Status must be a valid enum value' })
  @IsOptional()
  status?: DefaultStatus;

  @ApiProperty()
  @IsUUID()
  settingId: string;
}
