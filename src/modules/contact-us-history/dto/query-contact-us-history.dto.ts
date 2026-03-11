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
import { ContactStatus } from '../../../shared/enums/contact-status.enum';

export class QueryContactUsHistoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: ContactStatus,
    isArray: true,
    description: 'Filter by status array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ContactStatus, { each: true })
  @Transform(({ value }): ContactStatus[] =>
    Array.isArray(value) ? value : [value],
  )
  status?: ContactStatus[];
}
