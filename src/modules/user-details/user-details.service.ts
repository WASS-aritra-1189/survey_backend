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
import { CustomException } from '../../shared/exceptions/custom.exception';
import { QueryUserDetailDto } from './dto/query-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetail } from './entities/user-detail.entity';
import { IUserDetailsService } from './interfaces/user-details-service.interface';

@Injectable()
export class UserDetailsService implements IUserDetailsService {
  private readonly queryConfig: QueryConfig<UserDetail> = {
    alias: 'userDetail',
    searchFields: ['firstName', 'middleName', 'lastName', 'email', 'phone'],
    sortableFields: [
      'firstName',
      'lastName',
      'email',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryUserDetailDto) => {
      if (query.gender?.length) {
        qb.andWhere('userDetail.gender IN (:...gender)', {
          gender: query.gender,
        });
      }
      if (query.isActive !== undefined) {
        qb.andWhere('userDetail.isActive = :isActive', {
          isActive: query.isActive,
        });
      }
      if (query.isVerified !== undefined) {
        qb.andWhere('userDetail.isVerified = :isVerified', {
          isVerified: query.isVerified,
        });
      }
    },
  };

  constructor(
    @InjectRepository(UserDetail)
    private readonly userDetailRepository: Repository<UserDetail>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(
    query: QueryUserDetailDto,
  ): Promise<PaginatedResult<UserDetail>> {
    const cacheKey = `userDetail:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<UserDetail>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.userDetailRepository,
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

  async findOne(id: string): Promise<UserDetail> {
    const userDetail = await this.userDetailRepository.findOne({
      where: [{ accountId: id }, { id }],
    });
    if (!userDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }
    return userDetail;
  }

  async update(
    id: string,
    updateUserDetailDto: UpdateUserDetailDto,
  ): Promise<UserDetail> {
    const userDetail = await this.userDetailRepository.findOne({
      where: { id },
    });
    if (!userDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(userDetail, updateUserDetailDto);
    const updatedUserDetail = await this.userDetailRepository.save(userDetail);
    await this.clearUserDetailCache(id);
    return updatedUserDetail;
  }

  private async clearUserDetailCache(userDetailId?: string): Promise<void> {
    const patterns: string[] = ['userDetail:*'];

    if (userDetailId) {
      patterns.push(`userDetail:${userDetailId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
