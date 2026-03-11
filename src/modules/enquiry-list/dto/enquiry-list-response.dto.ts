/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { ContactStatus } from '../../../shared/enums/contact-status.enum';
import {
  EnquiryPriority,
  EnquirySource,
  EnquiryType,
} from '../../../shared/enums/enquiry.enum';

export class EnquiryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phoneNumber?: string;

  @ApiProperty()
  @Expose()
  company?: string;

  @ApiProperty()
  @Expose()
  subject: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ enum: EnquiryType })
  @Expose()
  enquiryType: EnquiryType;

  @ApiProperty({ enum: EnquiryPriority })
  @Expose()
  priority: EnquiryPriority;

  @ApiProperty({ enum: EnquirySource })
  @Expose()
  source: EnquirySource;

  @ApiProperty({ enum: ContactStatus })
  @Expose()
  status: ContactStatus;

  @ApiProperty()
  @Expose()
  notes?: string;

  @ApiProperty()
  @Expose()
  response?: string;

  @ApiProperty()
  @Expose()
  assignedToId?: string;
}

export class EnquiryListResponseDto extends PaginatedResponseDto<EnquiryResponseDto> {
  @ApiProperty({ type: [EnquiryResponseDto] })
  @Expose()
  declare data: EnquiryResponseDto[];
}
