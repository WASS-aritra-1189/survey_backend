/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactStatus } from '../../../shared/enums/contact-status.enum';
import { EnquiryPriority } from '../../../shared/enums/enquiry.enum';

export class UpdateEnquiryListDto {
  @ApiPropertyOptional({ enum: EnquiryPriority })
  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @ApiPropertyOptional({ enum: ContactStatus })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @ApiPropertyOptional({ description: 'Admin notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Admin response' })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiPropertyOptional({ description: 'Assigned user ID' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Follow up date' })
  @IsOptional()
  followUpDate?: Date;

  updatedBy?: string;
}
