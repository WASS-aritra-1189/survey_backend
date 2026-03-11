/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateNewsLetterDto } from '../dto/create-news-letter.dto';
import type { QueryNewsLetterDto } from '../dto/query-news-letter.dto';
import type { UpdateNewsLetterDto } from '../dto/update-news-letter.dto';
import type { NewsLetter } from '../entities/news-letter.entity';

export abstract class INewsLettersService {
  abstract create(createDto: CreateNewsLetterDto): Promise<NewsLetter>;
  abstract findAll(
    query: QueryNewsLetterDto,
  ): Promise<PaginatedResult<NewsLetter>>;
  abstract findOne(id: string): Promise<NewsLetter>;
  abstract update(
    id: string,
    updateDto: UpdateNewsLetterDto,
  ): Promise<NewsLetter>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<NewsLetter>;
  abstract remove(id: string): Promise<void>;
}
