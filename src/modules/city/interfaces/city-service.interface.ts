/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateCityDto } from '../dto/create-city.dto';
import type { QueryCityDto } from '../dto/query-city.dto';
import type { UpdateCityDto } from '../dto/update-city.dto';
import type { City } from '../entities/city.entity';

export interface ICityService {
  create(createCityDto: CreateCityDto): Promise<City>;
  findAll(query: QueryCityDto): Promise<PaginatedResult<City>>;
  findOne(id: string): Promise<City>;
  update(id: string, updateCityDto: UpdateCityDto): Promise<City>;
  status(id: string, status: DefaultStatus, updatedBy: string): Promise<City>;
}
