/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { DefaultStatus } from '../../../shared/enums/status.enum';

@Exclude()
export class SurveyMasterResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  loginId: string;

  @Expose()
  @ApiProperty()
  surveyLimit: number;

  @Expose()
  @ApiProperty({ enum: DefaultStatus })
  status: DefaultStatus;

  @Expose()
  @ApiProperty()
  accountId: string;

  @Expose()
  @ApiProperty()
  settingId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  createdBy: string;

  @Expose()
  @ApiProperty()
  updatedBy: string;
}
