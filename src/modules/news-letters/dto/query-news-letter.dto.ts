/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import {
  EmailFrequency,
  NewsletterCategory,
} from '../../../shared/enums/newsletter.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class QueryNewsLetterDto extends QueryBaseDto {
  @ApiPropertyOptional({ enum: NewsletterCategory, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(NewsletterCategory, { each: true })
  category?: NewsletterCategory[];

  @ApiPropertyOptional({ enum: EmailFrequency, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EmailFrequency, { each: true })
  frequency?: EmailFrequency[];

  @ApiPropertyOptional({ enum: DefaultStatus, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DefaultStatus, { each: true })
  status?: DefaultStatus[];
}
