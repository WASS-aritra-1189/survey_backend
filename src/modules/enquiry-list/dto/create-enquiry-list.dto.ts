/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import {
  EnquiryPriority,
  EnquirySource,
  EnquiryType,
} from '../../../shared/enums/enquiry.enum';

export class CreateEnquiryListDto extends BaseDto {
  @ApiProperty({ description: 'Enquirer name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Enquirer email', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ description: 'Phone number', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Company name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiProperty({ description: 'Enquiry subject', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ description: 'Enquiry message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ enum: EnquiryType, default: EnquiryType.GENERAL })
  @IsOptional()
  @IsEnum(EnquiryType)
  enquiryType?: EnquiryType;

  @ApiPropertyOptional({
    enum: EnquiryPriority,
    default: EnquiryPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @ApiPropertyOptional({ enum: EnquirySource, default: EnquirySource.WEBSITE })
  @IsOptional()
  @IsEnum(EnquirySource)
  source?: EnquirySource;

  @ApiPropertyOptional({ description: 'Referrer URL', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  referrerUrl?: string;
}
