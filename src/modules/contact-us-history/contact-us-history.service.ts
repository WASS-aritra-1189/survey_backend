/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { ContactStatus } from '../../shared/enums/contact-status.enum';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateContactUsHistoryDto } from './dto/create-contact-us-history.dto';
import { QueryContactUsHistoryDto } from './dto/query-contact-us-history.dto';
import { UpdateContactUsHistoryDto } from './dto/update-contact-us-history.dto';
import { ContactUsHistory } from './entities/contact-us-history.entity';
import { IContactUsHistoryService } from './interfaces/contact-us-history-service.interface';

@Injectable()
export class ContactUsHistoryService implements IContactUsHistoryService {
  private readonly queryConfig: QueryConfig<ContactUsHistory> = {
    alias: 'contact',
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
    customFilters: (qb, query: QueryContactUsHistoryDto) => {
      if (query.status?.length) {
        qb.andWhere('contact.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(ContactUsHistory)
    private readonly contactUsHistoryRepository: Repository<ContactUsHistory>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createContactUsHistoryDto: CreateContactUsHistoryDto,
  ): Promise<ContactUsHistory> {
    const contact = this.contactUsHistoryRepository.create(
      createContactUsHistoryDto,
    );
    const savedContact = await this.contactUsHistoryRepository.save(contact);
    await this.clearContactCache(savedContact.settingId);
    return savedContact;
  }

  async findAll(
    query: QueryContactUsHistoryDto,
  ): Promise<PaginatedResult<ContactUsHistory>> {
    const cacheKey = `contact:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<ContactUsHistory>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.contactUsHistoryRepository,
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

  async findOne(id: string): Promise<ContactUsHistory> {
    const cacheKey = `contact:${id}`;
    const cachedContact =
      await this.cacheService.get<ContactUsHistory>(cacheKey);
    if (cachedContact) {
      return cachedContact;
    }

    const contact = await this.contactUsHistoryRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, contact, 300);
    return contact;
  }

  async update(
    id: string,
    updateContactUsHistoryDto: UpdateContactUsHistoryDto,
  ): Promise<ContactUsHistory> {
    const contact = await this.contactUsHistoryRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(contact, updateContactUsHistoryDto);
    const updatedContact = await this.contactUsHistoryRepository.save(contact);
    await this.clearContactCache(updatedContact.settingId, id);
    return updatedContact;
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
    updatedBy: string,
  ): Promise<ContactUsHistory> {
    const contact = await this.contactUsHistoryRepository.findOne({
      where: { id },
    });
    if (!contact) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    contact.status = status;
    contact.updatedBy = updatedBy;
    const updatedContact = await this.contactUsHistoryRepository.save(contact);
    await this.clearContactCache(updatedContact.settingId, id);
    return updatedContact;
  }

  private async clearContactCache(
    settingId: string,
    contactId?: string,
  ): Promise<void> {
    const patterns: string[] = ['contacts:list:*'];

    if (contactId) {
      patterns.push(`contact:${contactId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
