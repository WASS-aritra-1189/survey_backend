/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateCountryDto } from '../dto/create-country.dto';
import type { QueryCountryDto } from '../dto/query-country.dto';
import type { UpdateCountryDto } from '../dto/update-country.dto';
import type { Country } from '../entities/country.entity';

export interface ICountryService {
  create(createCountryDto: CreateCountryDto): Promise<Country>;
  findAll(query: QueryCountryDto): Promise<PaginatedResult<Country>>;
  findOne(id: string): Promise<Country>;
  update(id: string, updateCountryDto: UpdateCountryDto): Promise<Country>;
  status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Country>;
}
