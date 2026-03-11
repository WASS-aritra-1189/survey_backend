/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAudioResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  surveyId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  responseId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
