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
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';
import { QueryNewsLetterDto } from './dto/query-news-letter.dto';
import { UpdateNewsLetterDto } from './dto/update-news-letter.dto';
import { NewsLetter } from './entities/news-letter.entity';
import { INewsLettersService } from './interfaces/news-letters-service.interface';

@Injectable()
export class NewsLettersService implements INewsLettersService {
  private readonly queryConfig: QueryConfig<NewsLetter> = {
    alias: 'newsletter',
    searchFields: ['title', 'description'],
    sortableFields: [
      'title',
      'category',
      'frequency',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryNewsLetterDto) => {
      if (query.category?.length) {
        qb.andWhere('newsletter.category IN (:...category)', {
          category: query.category,
        });
      }
      if (query.frequency?.length) {
        qb.andWhere('newsletter.frequency IN (:...frequency)', {
          frequency: query.frequency,
        });
      }
      if (query.status?.length) {
        qb.andWhere('newsletter.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(NewsLetter)
    private readonly newsletterRepository: Repository<NewsLetter>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createDto: CreateNewsLetterDto): Promise<NewsLetter> {
    const newsletter = this.newsletterRepository.create(createDto);
    const savedNewsletter = await this.newsletterRepository.save(newsletter);
    await this.clearCache();
    return savedNewsletter;
  }

  async findAll(
    query: QueryNewsLetterDto,
  ): Promise<PaginatedResult<NewsLetter>> {
    const cacheKey = `newsletters:all:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<NewsLetter>>(cacheKey);
    if (cached) return cached;

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.newsletterRepository,
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

  async findOne(id: string): Promise<NewsLetter> {
    const cacheKey = `newsletter:${id}`;
    const cached = await this.cacheService.get<NewsLetter>(cacheKey);
    if (cached) return cached;

    const newsletter = await this.newsletterRepository.findOne({
      where: { id },
    });
    if (!newsletter) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, newsletter, 300);
    return newsletter;
  }

  async update(
    id: string,
    updateDto: UpdateNewsLetterDto,
  ): Promise<NewsLetter> {
    const newsletter = await this.findOne(id);
    Object.assign(newsletter, updateDto);

    const updated = await this.newsletterRepository.save(newsletter);
    await this.clearCache();
    return updated;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<NewsLetter> {
    const newsletter = await this.findOne(id);
    newsletter.status = status;
    newsletter.updatedBy = updatedBy;

    const updated = await this.newsletterRepository.save(newsletter);
    await this.clearCache();
    return updated;
  }

  async remove(id: string): Promise<void> {
    const newsletter = await this.findOne(id);
    await this.newsletterRepository.remove(newsletter);
    await this.clearCache();
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheService.getKeys('newsletter*');
    await Promise.all(keys.map(key => this.cacheService.del(key)));
  }
}
