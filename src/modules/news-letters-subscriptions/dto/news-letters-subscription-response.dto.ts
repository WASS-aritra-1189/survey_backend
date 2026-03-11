/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import { SubscriptionStatus } from '../../../shared/enums/newsletter.enum';

export class NewsLettersSubscriptionResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  newsletterId: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ enum: SubscriptionStatus })
  @Expose()
  status: SubscriptionStatus;

  @ApiProperty({ required: false })
  @Expose()
  subscribedAt?: Date;

  @ApiProperty({ required: false })
  @Expose()
  unsubscribedAt?: Date;

  @ApiProperty({ required: false })
  @Expose()
  confirmedAt?: Date;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class NewsLettersSubscriptionDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  newsletterId: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ enum: SubscriptionStatus })
  @Expose()
  status: SubscriptionStatus;

  @ApiProperty({ required: false })
  @Expose()
  subscribedAt?: Date;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class NewsLettersSubscriptionListResponseDto extends PaginatedResponseDto<NewsLettersSubscriptionDto> {
  @ApiProperty({ type: [NewsLettersSubscriptionDto] })
  @Expose()
  @Type(() => NewsLettersSubscriptionDto)
  declare data: NewsLettersSubscriptionDto[];
}
