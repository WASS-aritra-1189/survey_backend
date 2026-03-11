/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class BulkStatusMenuDto {
  @ApiProperty({ description: 'Array of menu IDs' })
  @IsArray()
  @IsUUID(4, { each: true })
  ids: string[];

  @ApiProperty({ enum: DefaultStatus, description: 'Status to update' })
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}