/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';

export class QueryBlogSubCommentLikeDto extends QueryBaseDto {
  @ApiPropertyOptional({ description: 'Filter by blog ID' })
  @IsOptional()
  @IsUUID()
  blogId?: string;

  @ApiPropertyOptional({ description: 'Filter by parent comment ID' })
  @IsOptional()
  @IsUUID()
  blogCommentId?: string;

  @ApiPropertyOptional({ description: 'Filter by sub-comment ID' })
  @IsOptional()
  @IsUUID()
  blogSubCommentId?: string;
}
