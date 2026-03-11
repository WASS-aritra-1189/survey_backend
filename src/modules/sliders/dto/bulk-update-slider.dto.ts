/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { SliderStatus } from '../../../shared/enums/slider.enum';

export class BulkUpdateSliderItemDto {
  @ApiProperty({ description: 'Slider ID' })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ enum: SliderStatus, default: SliderStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SliderStatus)
  status?: SliderStatus = SliderStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Sort order', default: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;
}

export class BulkUpdateSliderDto {
  @ApiProperty({ type: [BulkUpdateSliderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateSliderItemDto)
  sliders: BulkUpdateSliderItemDto[];
}
