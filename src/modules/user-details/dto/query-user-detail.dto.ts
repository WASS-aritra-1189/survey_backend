/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { Gender } from '../../../shared/enums/gender.enum';

export class QueryUserDetailDto extends QueryBaseDto {
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

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by verified status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isVerified?: boolean;
}
