/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { ContactStatus } from '../../shared/enums/contact-status.enum';
import { CreateEnquiryListDto } from './dto/create-enquiry-list.dto';
import { QueryEnquiryListDto } from './dto/query-enquiry-list.dto';
import { UpdateEnquiryListDto } from './dto/update-enquiry-list.dto';
import { EnquiryList } from './entities/enquiry-list.entity';
import { IEnquiryListService } from './interfaces/enquiry-list-service.interface';

@Injectable()
export class EnquiryListService implements IEnquiryListService {
  private readonly queryConfig: QueryConfig<EnquiryList> = {
    alias: 'enquiry',
    searchFields: ['name', 'email', 'subject', 'message'],
    sortableFields: [
      'name',
      'email',
      'subject',
      'status',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryEnquiryListDto) => {
      if (query.enquiryType?.length) {
        qb.andWhere('enquiry.enquiryType IN (:...enquiryType)', {
          enquiryType: query.enquiryType,
        });
      }
      if (query.priority?.length) {
        qb.andWhere('enquiry.priority IN (:...priority)', {
          priority: query.priority,
        });
      }
      if (query.source?.length) {
        qb.andWhere('enquiry.source IN (:...source)', { source: query.source });
      }
      if (query.status?.length) {
        qb.andWhere('enquiry.status IN (:...status)', { status: query.status });
      }
      if (query.assignedToId) {
        qb.andWhere('enquiry.assignedToId = :assignedToId', {
          assignedToId: query.assignedToId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(EnquiryList)
    private readonly enquiryListRepository: Repository<EnquiryList>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createEnquiryListDto: CreateEnquiryListDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<EnquiryList> {
    const enquiry = this.enquiryListRepository.create(createEnquiryListDto);
    if (ipAddress) enquiry.ipAddress = ipAddress;
    if (userAgent) enquiry.userAgent = userAgent;
    const result = await this.enquiryListRepository.save(enquiry);
    await this.clearCache(result.settingId);
    return result;
  }

  async findAll(
    query: QueryEnquiryListDto,
  ): Promise<PaginatedResult<EnquiryList>> {
    const cacheKey = `enquiry:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<EnquiryList>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.enquiryListRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );
    await this.cacheService.set(cacheKey, result, 300);

    return result;
  }

  async findOne(id: string): Promise<EnquiryList> {
    const enquiry = await this.enquiryListRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return enquiry;
  }

  async update(
    id: string,
    updateEnquiryListDto: UpdateEnquiryListDto,
  ): Promise<EnquiryList> {
    const enquiry = await this.findOne(id);
    Object.assign(enquiry, updateEnquiryListDto);
    const result = await this.enquiryListRepository.save(enquiry);
    await this.clearCache(result.settingId, id);
    return result;
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
    updatedBy: string,
  ): Promise<EnquiryList> {
    const enquiry = await this.findOne(id);
    enquiry.status = status;
    enquiry.updatedBy = updatedBy;
    if (status === ContactStatus.RESOLVED) {
      enquiry.respondedAt = new Date();
    }
    const result = await this.enquiryListRepository.save(enquiry);
    await this.clearCache(result.settingId, id);
    return result;
  }

  async assignTo(
    id: string,
    assignedToId: string,
    updatedBy: string,
  ): Promise<EnquiryList> {
    const enquiry = await this.findOne(id);
    enquiry.assignedToId = assignedToId;
    enquiry.assignedAt = new Date();
    enquiry.updatedBy = updatedBy;
    const result = await this.enquiryListRepository.save(enquiry);
    await this.clearCache(result.settingId, id);
    return result;
  }

  async addResponse(
    id: string,
    response: string,
    updatedBy: string,
  ): Promise<EnquiryList> {
    const enquiry = await this.findOne(id);
    enquiry.response = response;
    enquiry.respondedAt = new Date();
    enquiry.updatedBy = updatedBy;
    const result = await this.enquiryListRepository.save(enquiry);
    await this.clearCache(result.settingId, id);
    return result;
  }

  private async clearCache(
    settingId: string,
    enquiryId?: string,
  ): Promise<void> {
    const patterns: string[] = ['enquiry:list:*'];

    if (enquiryId) {
      patterns.push(`enquiry:${enquiryId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
