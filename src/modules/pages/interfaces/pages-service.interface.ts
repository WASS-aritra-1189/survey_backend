/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { PageType } from '../../../shared/enums/page.enum';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreatePageDto } from '../dto/create-page.dto';
import type { QueryPageDto } from '../dto/query-page.dto';
import type { UpdatePageDto } from '../dto/update-page.dto';
import type { Page } from '../entities/page.entity';

export abstract class IPagesService {
  abstract create(createPageDto: CreatePageDto): Promise<Page>;
  abstract findAll(query: QueryPageDto): Promise<PaginatedResult<Page>>;
  abstract findOne(id: string): Promise<Page>;
  abstract findPublicPageByType(pageType: PageType, settingId: string): Promise<Page>;
  abstract update(id: string, updatePageDto: UpdatePageDto): Promise<Page>;
  abstract status(id: string, status: DefaultStatus, updatedBy: string): Promise<Page>;
}
