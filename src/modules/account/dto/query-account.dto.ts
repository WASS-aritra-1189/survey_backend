/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { UserRoles } from '../../../shared/enums/accouts.enum';
import { UserStatus } from '../../../shared/enums/status.enum';

export class QueryAccountDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: UserStatus,
    isArray: true,
    description: 'Filter by status array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  @Transform(({ value }): UserStatus[] =>
    Array.isArray(value) ? value : [value],
  )
  status?: UserStatus[];

  @ApiPropertyOptional({
    enum: UserRoles,
    isArray: true,
    description: 'Filter by roles array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  @Transform(({ value }): UserRoles[] =>
    Array.isArray(value) ? value : [value],
  )
  roles?: UserRoles[];
}
