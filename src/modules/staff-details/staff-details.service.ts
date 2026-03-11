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
import { QueryStaffDetailDto } from './dto/query-staff-detail.dto';
import { UpdateStaffDetailDto } from './dto/update-staff-detail.dto';
import { CreateStaffDetailDto } from './dto/create-staff-detail.dto';
import { StaffDetail } from './entities/staff-detail.entity';
import { IStaffDetailsService } from './interfaces/staff-details-service.interface';

@Injectable()
export class StaffDetailsService implements IStaffDetailsService {
  private readonly queryConfig: QueryConfig<StaffDetail> = {
    alias: 'staffDetail',
    searchFields: [
      'firstName',
      'middleName',
      'lastName',
      'email',
      'phone',
      'employeeId',
    ],
    sortableFields: [
      'firstName',
      'lastName',
      'email',
      'employeeId',
      'joiningDate',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryStaffDetailDto) => {
      if (query.gender?.length) {
        qb.andWhere('staffDetail.gender IN (:...gender)', {
          gender: query.gender,
        });
      }
      if (query.designationId?.length) {
        qb.andWhere('staffDetail.designationId IN (:...designationId)', {
          designationId: query.designationId,
        });
      }
      if (query.settingId) {
        qb.andWhere('account.settingId = :settingId', { settingId: query.settingId });
      }
    },
  };

  constructor(
    @InjectRepository(StaffDetail)
    private readonly staffDetailRepository: Repository<StaffDetail>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(
    query: QueryStaffDetailDto,
  ): Promise<PaginatedResult<StaffDetail>> {
    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.staffDetailRepository,
      query,
      this.queryConfig,
    );

    queryBuilder.leftJoinAndSelect('staffDetail.account', 'account')
      .leftJoinAndSelect('staffDetail.designation', 'designation');

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );

    return result;
  }

  async create(createDto: CreateStaffDetailDto): Promise<StaffDetail> {
    const staffDetail = this.staffDetailRepository.create(createDto);
    return await this.staffDetailRepository.save(staffDetail);
  }

  async findOne(id: string): Promise<StaffDetail> {
    const staffDetail = await this.staffDetailRepository.findOne({
      where: [{ id }, { accountId: id }],
      relations: ['account', 'designation'],
    });
    if (!staffDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }
    return staffDetail;
  }

  async update(
    id: string,
    updateStaffDetailDto: UpdateStaffDetailDto,
  ): Promise<StaffDetail> {
    const staffDetail = await this.staffDetailRepository.findOne({
      where: { id },
    });
    if (!staffDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(staffDetail, updateStaffDetailDto);
    const updatedStaffDetail =
      await this.staffDetailRepository.save(staffDetail);
    await this.clearStaffDetailCache(id);
    return updatedStaffDetail;
  }

  private async clearStaffDetailCache(staffDetailId?: string): Promise<void> {
    const patterns: string[] = ['staffDetail:*'];

    if (staffDetailId) {
      patterns.push(`staffDetail:${staffDetailId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
