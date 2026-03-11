/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { IsOptional, IsString } from 'class-validator';
export class BaseDto {
  @IsString()
  @IsOptional()
  createdBy: string;
    @IsString()
  @IsOptional()
  updatedBy: string;

  // @IsString()
  // @IsOptional()
  // settingId: string;
}
