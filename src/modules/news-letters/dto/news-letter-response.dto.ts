/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import { EmailFrequency, NewsletterCategory } from '../../../shared/enums/newsletter.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class NewsLetterResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ enum: NewsletterCategory })
  @Expose()
  category: NewsletterCategory;

  @ApiProperty({ enum: EmailFrequency })
  @Expose()
  frequency: EmailFrequency;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty({ required: false })
  @Expose()
  template?: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class NewsLetterDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ enum: NewsletterCategory })
  @Expose()
  category: NewsletterCategory;

  @ApiProperty({ enum: EmailFrequency })
  @Expose()
  frequency: EmailFrequency;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class NewsLetterListResponseDto extends PaginatedResponseDto<NewsLetterDto> {
  @ApiProperty({ type: [NewsLetterDto] })
  @Expose()
  @Type(() => NewsLetterDto)
  declare data: NewsLetterDto[];
}