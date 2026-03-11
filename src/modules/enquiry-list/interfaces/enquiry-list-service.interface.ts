/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { ContactStatus } from '../../../shared/enums/contact-status.enum';
import type { CreateEnquiryListDto } from '../dto/create-enquiry-list.dto';
import type { QueryEnquiryListDto } from '../dto/query-enquiry-list.dto';
import type { UpdateEnquiryListDto } from '../dto/update-enquiry-list.dto';
import type { EnquiryList } from '../entities/enquiry-list.entity';

export abstract class IEnquiryListService {
  abstract create(
    createEnquiryListDto: CreateEnquiryListDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<EnquiryList>;
  abstract findAll(query: QueryEnquiryListDto): Promise<{
    data: EnquiryList[];
    total: number;
    page: number;
    limit: number;
  }>;
  abstract findOne(id: string): Promise<EnquiryList>;
  abstract update(
    id: string,
    updateEnquiryListDto: UpdateEnquiryListDto,
  ): Promise<EnquiryList>;
  abstract updateStatus(
    id: string,
    status: ContactStatus,
    updatedBy: string,
  ): Promise<EnquiryList>;
  abstract assignTo(
    id: string,
    assignedToId: string,
    updatedBy: string,
  ): Promise<EnquiryList>;
  abstract addResponse(
    id: string,
    response: string,
    updatedBy: string,
  ): Promise<EnquiryList>;
}
