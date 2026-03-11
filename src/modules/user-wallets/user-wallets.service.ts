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
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateUserWalletDto } from './dto/create-user-wallet.dto';
import { QueryUserWalletDto } from './dto/query-user-wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user-wallet.dto';
import { UserWallet } from './entities/user-wallet.entity';
import { IUserWalletsService } from './interfaces/user-wallets-service.interface';

@Injectable()
export class UserWalletsService implements IUserWalletsService {
  private readonly queryConfig: QueryConfig<UserWallet> = {
    alias: 'userWallet',
    searchFields: ['description', 'referenceId'],
    sortableFields: ['amount', 'transactionType', 'createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'userWallet.account', alias: 'account' },
      { relation: 'userWallet.setting', alias: 'setting' },
    ],
    customFilters: (qb, query: QueryUserWalletDto) => {
      if (query.accountId) {
        qb.andWhere('userWallet.accountId = :accountId', {
          accountId: query.accountId,
        });
      }
      if (query.transactionType) {
        qb.andWhere('userWallet.transactionType = :transactionType', {
          transactionType: query.transactionType,
        });
      }
      if (query.currency) {
        qb.andWhere('userWallet.currency = :currency', {
          currency: query.currency,
        });
      }
    },
  };

  constructor(
    @InjectRepository(UserWallet)
    private readonly userWalletRepository: Repository<UserWallet>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createUserWalletDto: CreateUserWalletDto): Promise<UserWallet> {
    const userWallet = this.userWalletRepository.create(createUserWalletDto);
    const savedWallet = await this.userWalletRepository.save(userWallet);
    await this.clearWalletCache(savedWallet.accountId);
    return savedWallet;
  }

  async findAll(
    query: QueryUserWalletDto,
  ): Promise<PaginatedResult<UserWallet>> {
    const cacheKey = `userWallet:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<UserWallet>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.userWalletRepository,
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

  async findOne(id: string): Promise<UserWallet> {
    const cacheKey = `userWallet:${id}`;
    const cached = await this.cacheService.get<UserWallet>(cacheKey);
    if (cached) {
      return cached;
    }

    const wallet = await this.userWalletRepository.findOne({
      where: { id },
      relations: ['account', 'setting'],
    });
    if (!wallet) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, wallet, 300);
    return wallet;
  }

  async findByAccount(
    accountId: string,
    query: QueryUserWalletDto,
  ): Promise<PaginatedResult<UserWallet>> {
    query.accountId = accountId;
    return this.findAll(query);
  }

  async getBalance(
    accountId: string,
  ): Promise<{ balance: number; currency: string }> {
    const cacheKey = `userWallet:balance:${accountId}`;
    const cached = await this.cacheService.get<{
      balance: number;
      currency: string;
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const deposits = await this.userWalletRepository
      .createQueryBuilder('wallet')
      .select('SUM(wallet.amount)', 'total')
      .where('wallet.accountId = :accountId', { accountId })
      .andWhere('wallet.transactionType IN (:...types)', {
        types: [
          TransactionType.DEPOSIT,
          TransactionType.BONUS,
          TransactionType.REFUND,
          TransactionType.CASHBACK,
        ],
      })
      .getRawOne();

    const withdrawals = await this.userWalletRepository
      .createQueryBuilder('wallet')
      .select('SUM(wallet.amount)', 'total')
      .where('wallet.accountId = :accountId', { accountId })
      .andWhere('wallet.transactionType IN (:...types)', {
        types: [TransactionType.WITHDRAW, TransactionType.PENALTY],
      })
      .getRawOne();

    const balance = (deposits?.total || 0) - (withdrawals?.total || 0);
    const result = { balance, currency: 'INR' };

    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  async update(
    id: string,
    updateUserWalletDto: UpdateUserWalletDto,
  ): Promise<UserWallet> {
    const wallet = await this.userWalletRepository.findOne({ where: { id } });
    if (!wallet) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(wallet, updateUserWalletDto);
    const updatedWallet = await this.userWalletRepository.save(wallet);
    await this.clearWalletCache(updatedWallet.accountId, id);
    return updatedWallet;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<UserWallet> {
    const wallet = await this.userWalletRepository.findOne({ where: { id } });
    if (!wallet) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    wallet.status = status;
    wallet.updatedBy = updatedBy;
    const updatedWallet = await this.userWalletRepository.save(wallet);
    await this.clearWalletCache(updatedWallet.accountId, id);
    return updatedWallet;
  }

  private async clearWalletCache(
    accountId: string,
    walletId?: string,
  ): Promise<void> {
    const patterns: string[] = [
      'userWallet:list:*',
      `userWallet:balance:${accountId}`,
    ];

    if (walletId) {
      patterns.push(`userWallet:${walletId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
