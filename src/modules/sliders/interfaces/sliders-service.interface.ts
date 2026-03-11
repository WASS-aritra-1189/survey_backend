/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { SliderStatus } from '../../../shared/enums/slider.enum';
import type { BulkUpdateSliderDto } from '../dto/bulk-update-slider.dto';
import type { CreateSliderDto } from '../dto/create-slider.dto';
import type { QuerySliderDto } from '../dto/query-slider.dto';
import type { UpdateSliderDto } from '../dto/update-slider.dto';
import type { Slider } from '../entities/slider.entity';

export abstract class ISlidersService {
  abstract create(createSliderDto: CreateSliderDto): Promise<Slider>;
  abstract findAll(query: QuerySliderDto): Promise<PaginatedResult<Slider>>;
  abstract update(
    id: string,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider>;
  abstract bulkUpdate(
    bulkUpdateSliderDto: BulkUpdateSliderDto,
  ): Promise<Slider[]>;
  abstract status(
    id: string,
    status: SliderStatus,
    updatedBy: string,
  ): Promise<Slider>;
}
