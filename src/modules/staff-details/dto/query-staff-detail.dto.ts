/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { Gender } from '../../../shared/enums/gender.enum';

export class QueryStaffDetailDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: Gender,
    isArray: true,
    description: 'Filter by gender array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Gender, { each: true })
  @Transform(({ value }): Gender[] => (Array.isArray(value) ? value : [value]))
  gender?: Gender[];

  @ApiPropertyOptional({
    isArray: true,
    description: 'Filter by designation ID array',
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }): string[] => (Array.isArray(value) ? value : [value]))
  designationId?: string[];
}
