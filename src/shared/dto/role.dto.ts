/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoles } from '../enums/accouts.enum';

export class RoleDto {
  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRoles,
    example: UserRoles.USER,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;
}
