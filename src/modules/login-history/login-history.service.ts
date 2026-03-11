/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { CreateLoginHistoryDto } from './dto/create-login-history.dto';
import { LoginHistoryResponseDto } from './dto/login-history-response.dto';
import { QueryLoginHistoryDto } from './dto/query-login-history.dto';
import { LoginHistory } from './entities/login-history.entity';
import { ILoginHistoryService } from './interfaces/login-history-service.interface';

@Injectable()
export class LoginHistoryService implements ILoginHistoryService {
  private readonly queryConfig: QueryConfig<LoginHistory> = {
    alias: 'login_history',
    searchFields: ['ipAddress', 'userAgent', 'address'],
    sortableFields: [
      'ipAddress',
      'userAgent',
      'deviceType',
      'logType',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryLoginHistoryDto) => {
      if (query.deviceType?.length) {
        qb.andWhere('login_history.deviceType IN (:...deviceType)', {
          deviceType: query.deviceType,
        });
      }
      if (query.logType?.length) {
        qb.andWhere('login_history.logType IN (:...logType)', {
          logType: query.logType,
        });
      }
    },
  };

  constructor(
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async createLog(
    createLoginHistoryDto: CreateLoginHistoryDto,
  ): Promise<LoginHistoryResponseDto> {
    const loginHistory = this.loginHistoryRepository.create({
      logType: createLoginHistoryDto.logType,
      ipAddress: createLoginHistoryDto.ipAddress,
      userAgent: createLoginHistoryDto.userAgent,
      address: createLoginHistoryDto.address,
      deviceType: createLoginHistoryDto.deviceType,
      accountId: createLoginHistoryDto.accountId,
    });

    const savedHistory = await this.loginHistoryRepository.save(loginHistory);
    return plainToInstance(LoginHistoryResponseDto, savedHistory);
  }

  async findAll(
    query: QueryLoginHistoryDto,
  ): Promise<PaginatedResult<LoginHistory>> {
    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.loginHistoryRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );

    return result;
  }
}
