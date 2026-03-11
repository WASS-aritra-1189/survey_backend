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
import { PageType } from '../../shared/enums/page.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreatePageDto } from './dto/create-page.dto';
import { QueryPageDto } from './dto/query-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { IPagesService } from './interfaces/pages-service.interface';

@Injectable()
export class PagesService implements IPagesService {
  private readonly queryConfig: QueryConfig<Page> = {
    alias: 'page',
    searchFields: ['title', 'description', 'content', 'metaTitle'],
    sortableFields: ['title', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryPageDto) => {
      if (query.status?.length) {
        qb.andWhere('page.status IN (:...status)', { status: query.status });
      }
    },
  };

  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const slug = this.generateSlug(createPageDto.title);
    const existingPage = await this.pageRepository.findOne({ where: { slug } });
    if (existingPage) {
      throw new CustomException(
        MESSAGE_CODES.PAGE_TITLE_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const page = this.pageRepository.create(createPageDto);
    page.slug = slug;
    const savedPage = await this.pageRepository.save(page);

    await this.clearPageCache(savedPage.settingId);
    return savedPage;
  }

  async findAll(query: QueryPageDto): Promise<PaginatedResult<Page>> {
    const cacheKey = `pages:list:${JSON.stringify(query)}`;
    const cachedResult =
      await this.cacheService.get<PaginatedResult<Page>>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.pageRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );

    await this.cacheService.set(cacheKey, result, 180);
    return result;
  }

  async findOne(id: string): Promise<Page> {
    const cacheKey = `page:${id}`;
    const cachedPage = await this.cacheService.get<Page>(cacheKey);
    if (cachedPage) {
      return cachedPage;
    }

    const page = await this.pageRepository.findOne({ where: { id } });
    if (!page) {
      throw new CustomException(
        MESSAGE_CODES.PAGE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, page, 300);
    return page;
  }

  async findPublicPageByType(
    pageType: PageType,
    settingId: string,
  ): Promise<Page> {
    const cacheKey = `page:public:${settingId}:${pageType}`;
    const cachedPage = await this.cacheService.get<Page>(cacheKey);
    if (cachedPage) {
      return cachedPage;
    }

    const page = await this.pageRepository.findOne({
      where: { pageType, settingId, status: DefaultStatus.ACTIVE },
    });
    if (!page) {
      throw new CustomException(
        MESSAGE_CODES.PAGE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, page, 600);
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { id } });
    if (!page) {
      throw new CustomException(
        MESSAGE_CODES.PAGE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updatePageDto.title && updatePageDto.title !== page.title) {
      const slug = this.generateSlug(updatePageDto.title);
      const existingPage = await this.pageRepository.findOne({
        where: { slug },
      });
      if (existingPage && existingPage.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.PAGE_TITLE_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
      Object.assign(page, updatePageDto);
      page.slug = slug;
    } else {
      Object.assign(page, updatePageDto);
    }

    const updatedPage = await this.pageRepository.save(page);
    await this.clearPageCache(updatedPage.settingId, id);
    return updatedPage;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { id } });
    if (!page) {
      throw new CustomException(
        MESSAGE_CODES.PAGE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    page.status = status;
    page.updatedBy = updatedBy;
    const updatedPage = await this.pageRepository.save(page);
    await this.clearPageCache(updatedPage.settingId, id);
    return updatedPage;
  }

  private async clearPageCache(
    settingId: string,
    pageId?: string,
  ): Promise<void> {
    const patterns: string[] = [`page:public:${settingId}:*`, 'pages:list:*'];

    if (pageId) {
      patterns.push(`page:${pageId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
