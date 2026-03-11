/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';

export class QueryPasswordHistoryDto extends QueryBaseDto {
  @ApiPropertyOptional({ description: 'Filter by change reason' })
  @IsOptional()
  @IsString()
  changeReason?: string;

  @ApiPropertyOptional({ description: 'Filter by expired status' })
  @IsOptional()
  @IsBoolean()
  isExpired?: boolean;

  @ApiPropertyOptional({ description: 'Filter by hash algorithm' })
  @IsOptional()
  @IsString()
  hashAlgorithm?: string;
}
