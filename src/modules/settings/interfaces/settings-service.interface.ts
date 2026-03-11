/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateSettingDto } from '../dto/create-setting.dto';
import type { QuerySettingDto } from '../dto/query-setting.dto';
import type { UpdateSettingDto } from '../dto/update-setting.dto';
import type { Setting } from '../entities/setting.entity';

export abstract class ISettingsService {
  abstract create(createSettingDto: CreateSettingDto): Promise<Setting>;
  abstract findAll(
    query: QuerySettingDto,
  ): Promise<{ data: Setting[]; total: number; page: number; limit: number }>;
  abstract findOne(id: string): Promise<Setting>;
  abstract findOneByDomain(domain: string): Promise<Setting>;
  abstract update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Setting>;
}
