/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { ContactStatus } from '../../../shared/enums/contact-status.enum';
import type { CreateContactUsHistoryDto } from '../dto/create-contact-us-history.dto';
import type { QueryContactUsHistoryDto } from '../dto/query-contact-us-history.dto';
import type { UpdateContactUsHistoryDto } from '../dto/update-contact-us-history.dto';
import type { ContactUsHistory } from '../entities/contact-us-history.entity';

export abstract class IContactUsHistoryService {
  abstract create(
    createContactUsHistoryDto: CreateContactUsHistoryDto,
  ): Promise<ContactUsHistory>;
  abstract findAll(
    query: QueryContactUsHistoryDto,
  ): Promise<PaginatedResult<ContactUsHistory>>;
  abstract findOne(id: string): Promise<ContactUsHistory>;
  abstract update(
    id: string,
    updateContactUsHistoryDto: UpdateContactUsHistoryDto,
  ): Promise<ContactUsHistory>;
  abstract updateStatus(
    id: string,
    status: ContactStatus,
    updatedBy: string,
  ): Promise<ContactUsHistory>;
}
