/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import {
  SliderPage,
  SliderPosition,
  SliderStatus,
  SliderType,
} from '../../../shared/enums/slider.enum';

export class QuerySliderDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: SliderStatus,
    isArray: true,
    description: 'Filter by status array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SliderStatus, { each: true })
  @Transform(({ value }): SliderStatus[] =>
    Array.isArray(value) ? value : [value],
  )
  status?: SliderStatus[];

  @ApiPropertyOptional({
    enum: SliderType,
    isArray: true,
    description: 'Filter by type array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SliderType, { each: true })
  @Transform(({ value }): SliderType[] =>
    Array.isArray(value) ? value : [value],
  )
  type?: SliderType[];

  @ApiPropertyOptional({
    enum: SliderPosition,
    isArray: true,
    description: 'Filter by position array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SliderPosition, { each: true })
  @Transform(({ value }): SliderPosition[] =>
    Array.isArray(value) ? value : [value],
  )
  position?: SliderPosition[];

  @ApiPropertyOptional({
    enum: SliderPage,
    isArray: true,
    description: 'Filter by page array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SliderPage, { each: true })
  @Transform(({ value }): SliderPage[] =>
    Array.isArray(value) ? value : [value],
  )
  pageType?: SliderPage[];
}
