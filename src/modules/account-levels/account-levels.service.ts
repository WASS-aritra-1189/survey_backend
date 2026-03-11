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
import { CreateAccountLevelDto } from './dto/create-account-level.dto';
import { QueryAccountLevelDto } from './dto/query-account-level.dto';
import { UpdateAccountLevelDto } from './dto/update-account-level.dto';
import { AccountLevel } from './entities/account-level.entity';
import { IAccountLevelsService } from './interfaces/account-levels-service.interface';

@Injectable()
export class AccountLevelsService implements IAccountLevelsService {
  private readonly queryConfig: QueryConfig<AccountLevel> = {
    alias: 'accountLevel',
    searchFields: ['name'],
    sortableFields: ['name', 'priority', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'priority',
    customFilters: (qb, query: QueryAccountLevelDto) => {
      if (query.status?.length) {
        qb.andWhere('accountLevel.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(AccountLevel)
    private readonly accountLevelRepository: Repository<AccountLevel>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createAccountLevelDto: CreateAccountLevelDto,
  ): Promise<AccountLevel> {
    const existingAccountLevel = await this.accountLevelRepository.findOne({
      where: {
        name: createAccountLevelDto.name,
        settingId: createAccountLevelDto.settingId,
      },
    });
    if (existingAccountLevel) {
      throw new CustomException(
        MESSAGE_CODES.CONFLICT,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const accountLevel = this.accountLevelRepository.create(
      createAccountLevelDto,
    );
    const savedAccountLevel =
      await this.accountLevelRepository.save(accountLevel);
    await this.clearAccountLevelCache(savedAccountLevel.settingId);
    return savedAccountLevel;
  }

  async findAll(
    query: QueryAccountLevelDto,
  ): Promise<PaginatedResult<AccountLevel>> {
    const cacheKey = `accountLevel:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<AccountLevel>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.accountLevelRepository,
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

  async findOne(id: string): Promise<AccountLevel> {
    const cacheKey = `accountLevel:${id}`;
    const cachedAccountLevel =
      await this.cacheService.get<AccountLevel>(cacheKey);
    if (cachedAccountLevel) {
      return cachedAccountLevel;
    }

    const accountLevel = await this.accountLevelRepository.findOne({
      where: { id },
    });
    if (!accountLevel) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, accountLevel, 300);
    return accountLevel;
  }

  async update(
    id: string,
    updateAccountLevelDto: UpdateAccountLevelDto,
  ): Promise<AccountLevel> {
    const accountLevel = await this.accountLevelRepository.findOne({
      where: { id },
    });
    if (!accountLevel) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      updateAccountLevelDto.name &&
      updateAccountLevelDto.name !== accountLevel.name
    ) {
      const existingAccountLevel = await this.accountLevelRepository.findOne({
        where: {
          name: updateAccountLevelDto.name,
          settingId: accountLevel.settingId,
        },
      });
      if (existingAccountLevel && existingAccountLevel.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.CONFLICT,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(accountLevel, updateAccountLevelDto);
    const updatedAccountLevel =
      await this.accountLevelRepository.save(accountLevel);
    await this.clearAccountLevelCache(updatedAccountLevel.settingId, id);
    return updatedAccountLevel;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<AccountLevel> {
    const accountLevel = await this.accountLevelRepository.findOne({
      where: { id },
    });
    if (!accountLevel) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    accountLevel.status = status;
    accountLevel.updatedBy = updatedBy;
    const updatedAccountLevel =
      await this.accountLevelRepository.save(accountLevel);
    await this.clearAccountLevelCache(updatedAccountLevel.settingId, id);
    return updatedAccountLevel;
  }

  private async clearAccountLevelCache(
    settingId: string,
    accountLevelId?: string,
  ): Promise<void> {
    const patterns: string[] = ['accountLevels:list:*'];

    if (accountLevelId) {
      patterns.push(`accountLevel:${accountLevelId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
