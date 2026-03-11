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
import { CreatePasswordHistoryDto } from './dto/create-password-history.dto';
import { QueryPasswordHistoryDto } from './dto/query-password-history.dto';
import { PasswordHistory } from './entities/password-history.entity';
import { IPasswordHistoryService } from './interfaces/password-history-service.interface';

@Injectable()
export class PasswordHistoryService implements IPasswordHistoryService {
  private readonly queryConfig: QueryConfig<PasswordHistory> = {
    alias: 'passwordHistory',
    searchFields: ['changeReason', 'ipAddress'],
    sortableFields: ['changedAt', 'createdAt', 'updatedAt'],
    defaultSortField: 'changedAt',
    joins: [
      { relation: 'passwordHistory.account', alias: 'account' },
      { relation: 'passwordHistory.setting', alias: 'setting' },
    ],
    customFilters: (qb, query: QueryPasswordHistoryDto) => {
      if (query.accountId) {
        qb.andWhere('passwordHistory.accountId = :accountId', {
          accountId: query.accountId,
        });
      }
      if (query.changeReason) {
        qb.andWhere('passwordHistory.changeReason = :changeReason', {
          changeReason: query.changeReason,
        });
      }
      if (query.isExpired !== undefined) {
        qb.andWhere('passwordHistory.isExpired = :isExpired', {
          isExpired: query.isExpired,
        });
      }
      if (query.hashAlgorithm) {
        qb.andWhere('passwordHistory.hashAlgorithm = :hashAlgorithm', {
          hashAlgorithm: query.hashAlgorithm,
        });
      }
    },
  };

  constructor(
    @InjectRepository(PasswordHistory)
    private readonly passwordHistoryRepository: Repository<PasswordHistory>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createPasswordHistoryDto: CreatePasswordHistoryDto,
  ): Promise<PasswordHistory> {
    const passwordHistory = this.passwordHistoryRepository.create(
      createPasswordHistoryDto,
    );
    const savedHistory =
      await this.passwordHistoryRepository.save(passwordHistory);
    await this.clearPasswordCache(savedHistory.accountId);
    return savedHistory;
  }

  async findAll(
    query: QueryPasswordHistoryDto,
  ): Promise<PaginatedResult<PasswordHistory>> {
    const cacheKey = `passwordHistory:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<PasswordHistory>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.passwordHistoryRepository,
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

  async findOne(id: string): Promise<PasswordHistory> {
    const cacheKey = `passwordHistory:${id}`;
    const cached = await this.cacheService.get<PasswordHistory>(cacheKey);
    if (cached) {
      return cached;
    }

    const history = await this.passwordHistoryRepository.findOne({
      where: { id },
      relations: ['account', 'setting'],
    });
    if (!history) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, history, 300);
    return history;
  }

  async findByAccount(
    accountId: string,
    query: QueryPasswordHistoryDto,
  ): Promise<PaginatedResult<PasswordHistory>> {
    query.accountId = accountId;
    return this.findAll(query);
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<PasswordHistory> {
    const history = await this.passwordHistoryRepository.findOne({
      where: { id },
    });
    if (!history) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    history.status = status;
    history.updatedBy = updatedBy;
    const updatedHistory = await this.passwordHistoryRepository.save(history);
    await this.clearPasswordCache(updatedHistory.accountId, id);
    return updatedHistory;
  }

  private async clearPasswordCache(
    accountId: string,
    historyId?: string,
  ): Promise<void> {
    const patterns: string[] = [
      'passwordHistory:list:*',
      `passwordHistory:account:${accountId}:*`,
    ];

    if (historyId) {
      patterns.push(`passwordHistory:${historyId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
