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

export class SurveyResponseResponseDto extends BaseResponseDto {
  @Expose()
  surveyId: string;

  @Expose()
  surveyMasterId: string;

  @Expose()
  responses: any[];

  @Expose()
  respondentName: string;

  @Expose()
  respondentContact: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  audioUrl: string;
}

export class SurveyResponseListResponseDto extends PaginatedResponseDto<SurveyResponseResponseDto> {
  @ApiProperty({ type: [SurveyResponseResponseDto] })
  @Expose()
  @Type(() => SurveyResponseResponseDto)
  declare data: SurveyResponseResponseDto[];
}
