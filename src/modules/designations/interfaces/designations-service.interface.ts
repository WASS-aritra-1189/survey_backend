/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateDesignationDto } from '../dto/create-designation.dto';
import type { QueryDesignationDto } from '../dto/query-designation.dto';
import type { UpdateDesignationDto } from '../dto/update-designation.dto';
import type { Designation } from '../entities/designation.entity';

export abstract class IDesignationsService {
  abstract create(createDesignationDto: CreateDesignationDto): Promise<Designation>;
  abstract findAll(query: QueryDesignationDto): Promise<PaginatedResult<Designation>>;
  abstract update(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Designation>;
}
