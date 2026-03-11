/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreateCountryDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  code: string;

  @IsOptional()
  @IsString()
  flag?: string;
}
