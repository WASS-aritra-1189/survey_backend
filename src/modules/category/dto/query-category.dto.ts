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
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class QueryCategoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: DefaultStatus,
    isArray: true,
    description: 'Filter by status array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DefaultStatus, { each: true })
  @Transform(({ value }): DefaultStatus[] =>
    Array.isArray(value) ? value : [value],
  )
  status?: DefaultStatus[];
}
