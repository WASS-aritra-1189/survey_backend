/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { SubscriptionStatus } from '../../../shared/enums/newsletter.enum';

export class QueryNewsLettersSubscriptionDto extends QueryBaseDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by newsletter ID' })
  @IsOptional()
  @IsUUID()
  newsletterId?: string;

  @ApiPropertyOptional({ enum: SubscriptionStatus, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(SubscriptionStatus, { each: true })
  status?: SubscriptionStatus[];
}