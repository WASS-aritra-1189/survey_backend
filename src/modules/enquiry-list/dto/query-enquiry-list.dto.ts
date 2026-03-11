/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { ContactStatus } from '../../../shared/enums/contact-status.enum';
import {
  EnquiryPriority,
  EnquirySource,
  EnquiryType,
} from '../../../shared/enums/enquiry.enum';

export class QueryEnquiryListDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: EnquiryType,
    isArray: true,
    description: 'Filter by enquiry type array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EnquiryType, { each: true })
  @Transform(({ value }): EnquiryType[] =>
    Array.isArray(value) ? value : [value],
  )
  enquiryType?: EnquiryType[];

  @ApiPropertyOptional({
    enum: EnquiryPriority,
    isArray: true,
    description: 'Filter by priority array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EnquiryPriority, { each: true })
  @Transform(({ value }): EnquiryPriority[] =>
    Array.isArray(value) ? value : [value],
  )
  priority?: EnquiryPriority[];

  @ApiPropertyOptional({
    enum: EnquirySource,
    isArray: true,
    description: 'Filter by source array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EnquirySource, { each: true })
  @Transform(({ value }): EnquirySource[] =>
    Array.isArray(value) ? value : [value],
  )
  source?: EnquirySource[];

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

  @ApiPropertyOptional({ description: 'Filter by assigned user ID' })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}
