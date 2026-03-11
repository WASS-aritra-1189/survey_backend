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
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class QueryBlogSubCommentDto extends QueryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: DefaultStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DefaultStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: DefaultStatus[];

  @ApiPropertyOptional({ description: 'Filter by blog ID' })
  @IsOptional()
  @IsUUID()
  blogId?: string;

  @ApiPropertyOptional({ description: 'Filter by parent comment ID' })
  @IsOptional()
  @IsUUID()
  blogCommentId?: string;
}
