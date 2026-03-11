/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreateContactUsHistoryDto extends BaseDto {
  @ApiProperty({ description: 'Contact name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Contact email', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ description: 'Phone number', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiProperty({ description: 'Subject', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;
}
