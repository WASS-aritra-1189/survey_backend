/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateStateDto } from '../dto/create-state.dto';
import type { QueryStateDto } from '../dto/query-state.dto';
import type { UpdateStateDto } from '../dto/update-state.dto';
import type { State } from '../entities/state.entity';

export interface IStateService {
  create(createStateDto: CreateStateDto): Promise<State>;
  findAll(query: QueryStateDto): Promise<PaginatedResult<State>>;
  findOne(id: string): Promise<State>;
  update(id: string, updateStateDto: UpdateStateDto): Promise<State>;
  status(id: string, status: DefaultStatus, updatedBy: string): Promise<State>;
}
