/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class CreateCategoryDto extends BaseDto {
  @ApiProperty({ description: 'Category name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Category description' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional({ description: 'Category image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Default status flag', default: false })
  @IsOptional()
  @IsBoolean()
  defaultStatus?: boolean = false;

  @IsEnum(DefaultStatus, { message: 'Status must be a valid enum value' })
  @IsOptional()
  status?: DefaultStatus;
}
