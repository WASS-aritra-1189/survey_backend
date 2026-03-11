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
import { AccountStatus } from '../../shared/enums/bank.enum';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { QueryBankDetailDto } from './dto/query-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { BankDetail } from './entities/bank-detail.entity';
import { IBankDetailsService } from './interfaces/bank-details-service.interface';

@Injectable()
export class BankDetailsService implements IBankDetailsService {
  private readonly queryConfig: QueryConfig<BankDetail> = {
    alias: 'bankDetail',
    searchFields: ['accountHolderName', 'accountNumber', 'branchName'],
    sortableFields: [
      'accountHolderName',
      'bankName',
      'createdAt',
      'updatedAt',
      'status',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryBankDetailDto) => {
      if (query.status?.length) {
        qb.andWhere('bankDetail.status IN (:...status)', {
          status: query.status,
        });
      }
      if (query.accountId) {
        qb.andWhere('bankDetail.accountId :accountId', {
          accountId: query.accountId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(BankDetail)
    private readonly bankDetailRepository: Repository<BankDetail>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createBankDetailDto: CreateBankDetailDto): Promise<BankDetail> {
    const existingBankDetail = await this.bankDetailRepository.findOne({
      where: {
        accountNumber: createBankDetailDto.accountNumber,
      },
    });
    if (existingBankDetail) {
      throw new CustomException(
        MESSAGE_CODES.CONFLICT,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    if (createBankDetailDto.isDefault) {
      await this.unsetOtherDefaults(createBankDetailDto.accountId);
    }

    const bankDetail = this.bankDetailRepository.create(createBankDetailDto);
    const savedBankDetail = await this.bankDetailRepository.save(bankDetail);
    await this.clearBankDetailCache(savedBankDetail.settingId);
    return savedBankDetail;
  }

  async findAll(
    query: QueryBankDetailDto,
  ): Promise<PaginatedResult<BankDetail>> {
    const cacheKey = `bankDetail:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<BankDetail>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.bankDetailRepository,
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

  async findOne(id: string): Promise<BankDetail> {
    const cacheKey = `bankDetail:${id}`;
    const cachedBankDetail = await this.cacheService.get<BankDetail>(cacheKey);
    if (cachedBankDetail) {
      return cachedBankDetail;
    }

    const bankDetail = await this.bankDetailRepository.findOne({
      where: { id },
    });
    if (!bankDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, bankDetail, 300);
    return bankDetail;
  }

  async update(
    id: string,
    updateBankDetailDto: UpdateBankDetailDto,
  ): Promise<BankDetail> {
    const bankDetail = await this.bankDetailRepository.findOne({
      where: { id },
    });
    if (!bankDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      updateBankDetailDto.accountNumber &&
      updateBankDetailDto.accountNumber !== bankDetail.accountNumber
    ) {
      const existingBankDetail = await this.bankDetailRepository.findOne({
        where: {
          accountNumber: updateBankDetailDto.accountNumber,
        },
      });
      if (existingBankDetail && existingBankDetail.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.CONFLICT,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateBankDetailDto.isDefault) {
      await this.unsetOtherDefaults(bankDetail.accountId, id);
    }

    Object.assign(bankDetail, updateBankDetailDto);
    const updatedBankDetail = await this.bankDetailRepository.save(bankDetail);
    await this.clearBankDetailCache(updatedBankDetail.settingId, id);
    return updatedBankDetail;
  }

  async setDefault(id: string, updatedBy: string): Promise<BankDetail> {
    const bankDetail = await this.bankDetailRepository.findOne({
      where: { id },
    });
    if (!bankDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.unsetOtherDefaults(bankDetail.accountId, id);

    bankDetail.isDefault = true;
    bankDetail.updatedBy = updatedBy;
    const updatedBankDetail = await this.bankDetailRepository.save(bankDetail);
    await this.clearBankDetailCache(updatedBankDetail.settingId, id);
    return updatedBankDetail;
  }

  async status(
    id: string,
    status: AccountStatus,
    updatedBy: string,
  ): Promise<BankDetail> {
    const bankDetail = await this.bankDetailRepository.findOne({
      where: { id },
    });
    if (!bankDetail) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    bankDetail.status = status;
    bankDetail.updatedBy = updatedBy;
    const updatedBankDetail = await this.bankDetailRepository.save(bankDetail);
    await this.clearBankDetailCache(updatedBankDetail.settingId, id);
    return updatedBankDetail;
  }

  private async unsetOtherDefaults(
    accountId: string,
    excludeId?: string,
  ): Promise<void> {
    const updateQuery = this.bankDetailRepository
      .createQueryBuilder()
      .update(BankDetail)
      .set({ isDefault: false })
      .where('accountId = :accountId', { accountId });

    if (excludeId) {
      updateQuery.andWhere('id != :excludeId', { excludeId });
    }

    await updateQuery.execute();
  }

  private async clearBankDetailCache(
    settingId: string,
    bankDetailId?: string,
  ): Promise<void> {
    const patterns: string[] = ['bankDetails:list:*'];

    if (bankDetailId) {
      patterns.push(`bankDetail:${bankDetailId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
