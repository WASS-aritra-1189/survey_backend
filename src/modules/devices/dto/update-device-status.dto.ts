/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class UpdateDeviceStatusDto {
  @ApiProperty({ enum: DefaultStatus })
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
