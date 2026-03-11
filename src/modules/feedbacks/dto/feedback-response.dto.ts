/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class FeedbackResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  subject: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class FeedbackListResponseDto extends PaginatedResponseDto<FeedbackResponseDto> {
  @ApiProperty({ type: [FeedbackResponseDto] })
  @Expose()
  @Type(() => FeedbackResponseDto)
  declare data: FeedbackResponseDto[];
}
