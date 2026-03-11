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

export class ContactUsResponseDto extends BaseResponseDto {
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
  subject: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ enum: ContactStatus })
  @Expose()
  status: ContactStatus;
}

export class ContactUsListResponseDto extends PaginatedResponseDto<ContactUsResponseDto> {
  @ApiProperty({ type: [ContactUsResponseDto] })
  @Expose()
  declare data: ContactUsResponseDto[];
}
