/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class QuerySubCategoryDto extends QueryBaseDto {
  @IsOptional()
  @IsArray()
  status?: DefaultStatus[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryId?: string[];
}
