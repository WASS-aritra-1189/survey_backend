/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { IMenuService } from './interfaces/menu-service.interface';

@Injectable()
export class MenuService implements IMenuService {
  private readonly queryConfig: QueryConfig<Menu> = {
    alias: 'menu',
    searchFields: ['name', 'title', 'description'],
    sortableFields: ['name', 'title', 'status', 'createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryMenuDto) => {
      if (query.status?.length) {
        qb.andWhere('menu.status IN (:...status)', { status: query.status });
      }
    },
  };

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createDto);
    const savedMenu = await this.menuRepository.save(menu);
    await this.clearCache();
    return savedMenu;
  }

  async findAll(query: QueryMenuDto): Promise<PaginatedResult<Menu>> {
    const cacheKey = `menus:all:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get<PaginatedResult<Menu>>(cacheKey);
    if (cached) return cached;

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.menuRepository,
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

  private async findOne(id: string): Promise<Menu> {
    const cacheKey = `menu:${id}`;
    const cached = await this.cacheService.get<Menu>(cacheKey);
    if (cached) return cached;

    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, menu, 300);
    return menu;
  }

  async update(id: string, updateDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateDto);

    const updated = await this.menuRepository.save(menu);
    await this.clearCache();
    return updated;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Menu> {
    const menu = await this.findOne(id);
    menu.status = status;
    menu.updatedBy = updatedBy;

    const updated = await this.menuRepository.save(menu);
    await this.clearCache();
    return updated;
  }

  async bulkStatus(
    ids: string[],
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Menu[]> {
    await this.menuRepository
      .createQueryBuilder()
      .update(Menu)
      .set({ status, updatedBy })
      .where('id IN (:...ids)', { ids })
      .execute();

    const updatedMenus = await this.menuRepository.find({
      where: { id: In(ids) },
    });

    await this.clearCache();
    return updatedMenus;
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheService.getKeys('menu*');
    await Promise.all(keys.map(key => this.cacheService.del(key)));
  }
}
