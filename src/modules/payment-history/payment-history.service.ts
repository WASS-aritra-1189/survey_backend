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
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreatePaymentHistoryDto } from './dto/create-payment-history.dto';
import { QueryPaymentHistoryDto } from './dto/query-payment-history.dto';
import { UpdatePaymentHistoryDto } from './dto/update-payment-history.dto';
import { PaymentHistory } from './entities/payment-history.entity';
import { IPaymentHistoryService } from './interfaces/payment-history-service.interface';

@Injectable()
export class PaymentHistoryService implements IPaymentHistoryService {
  private readonly queryConfig: QueryConfig<PaymentHistory> = {
    alias: 'paymentHistory',
    searchFields: [
      'transactionId',
      'gatewayTransactionId',
      'referenceNumber',
      'description',
    ],
    sortableFields: [
      'amount',
      'paymentType',
      'paymentStatus',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    joins: [
      { relation: 'paymentHistory.account', alias: 'account' },
      { relation: 'paymentHistory.fromAccount', alias: 'fromAccount' },
      { relation: 'paymentHistory.toAccount', alias: 'toAccount' },
      { relation: 'paymentHistory.bankDetail', alias: 'bankDetail' },
      { relation: 'paymentHistory.setting', alias: 'setting' },
    ],
    customFilters: (qb, query: QueryPaymentHistoryDto) => {
      if (query.accountId) {
        qb.andWhere('paymentHistory.accountId = :accountId', {
          accountId: query.accountId,
        });
      }
      if (query.paymentType) {
        qb.andWhere('paymentHistory.paymentType = :paymentType', {
          paymentType: query.paymentType,
        });
      }
      if (query.paymentMethod) {
        qb.andWhere('paymentHistory.paymentMethod = :paymentMethod', {
          paymentMethod: query.paymentMethod,
        });
      }
      if (query.paymentMode) {
        qb.andWhere('paymentHistory.paymentMode = :paymentMode', {
          paymentMode: query.paymentMode,
        });
      }
      if (query.paymentStatus) {
        qb.andWhere('paymentHistory.paymentStatus = :paymentStatus', {
          paymentStatus: query.paymentStatus,
        });
      }
      if (query.currency) {
        qb.andWhere('paymentHistory.currency = :currency', {
          currency: query.currency,
        });
      }
      if (query.gatewayName) {
        qb.andWhere('paymentHistory.gatewayName = :gatewayName', {
          gatewayName: query.gatewayName,
        });
      }
      if (query.fromAccountId) {
        qb.andWhere('paymentHistory.fromAccountId = :fromAccountId', {
          fromAccountId: query.fromAccountId,
        });
      }
      if (query.toAccountId) {
        qb.andWhere('paymentHistory.toAccountId = :toAccountId', {
          toAccountId: query.toAccountId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepository: Repository<PaymentHistory>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createPaymentHistoryDto: CreatePaymentHistoryDto,
  ): Promise<PaymentHistory> {
    const paymentHistory = this.paymentHistoryRepository.create(
      createPaymentHistoryDto,
    );
    const savedPayment =
      await this.paymentHistoryRepository.save(paymentHistory);
    await this.clearPaymentCache(savedPayment.accountId);
    return savedPayment;
  }

  async findAll(
    query: QueryPaymentHistoryDto,
  ): Promise<PaginatedResult<PaymentHistory>> {
    const cacheKey = `paymentHistory:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<PaymentHistory>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.paymentHistoryRepository,
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

  async findOne(id: string): Promise<PaymentHistory> {
    const cacheKey = `paymentHistory:${id}`;
    const cached = await this.cacheService.get<PaymentHistory>(cacheKey);
    if (cached) {
      return cached;
    }

    const payment = await this.paymentHistoryRepository.findOne({
      where: { id },
      relations: [
        'account',
        'fromAccount',
        'toAccount',
        'bankDetail',
        'setting',
      ],
    });
    if (!payment) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, payment, 300);
    return payment;
  }

  async findByAccount(
    accountId: string,
    query: QueryPaymentHistoryDto,
  ): Promise<PaginatedResult<PaymentHistory>> {
    query.accountId = accountId;
    return this.findAll(query);
  }

  async findByTransactionId(transactionId: string): Promise<PaymentHistory> {
    const cacheKey = `paymentHistory:txn:${transactionId}`;
    const cached = await this.cacheService.get<PaymentHistory>(cacheKey);
    if (cached) {
      return cached;
    }

    const payment = await this.paymentHistoryRepository.findOne({
      where: { transactionId },
      relations: [
        'account',
        'fromAccount',
        'toAccount',
        'bankDetail',
        'setting',
      ],
    });
    if (!payment) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, payment, 300);
    return payment;
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    updatedBy: string,
  ): Promise<PaymentHistory> {
    const payment = await this.paymentHistoryRepository.findOne({
      where: { id },
    });
    if (!payment) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    payment.paymentStatus = paymentStatus;
    payment.updatedBy = updatedBy;
    if (paymentStatus === PaymentStatus.SUCCESS) {
      payment.processedAt = new Date();
    }
    const updatedPayment = await this.paymentHistoryRepository.save(payment);
    await this.clearPaymentCache(updatedPayment.accountId, id);
    return updatedPayment;
  }

  async update(
    id: string,
    updatePaymentHistoryDto: UpdatePaymentHistoryDto,
  ): Promise<PaymentHistory> {
    const payment = await this.paymentHistoryRepository.findOne({
      where: { id },
    });
    if (!payment) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(payment, updatePaymentHistoryDto);
    const updatedPayment = await this.paymentHistoryRepository.save(payment);
    await this.clearPaymentCache(updatedPayment.accountId, id);
    return updatedPayment;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<PaymentHistory> {
    const payment = await this.paymentHistoryRepository.findOne({
      where: { id },
    });
    if (!payment) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    payment.status = status;
    payment.updatedBy = updatedBy;
    const updatedPayment = await this.paymentHistoryRepository.save(payment);
    await this.clearPaymentCache(updatedPayment.accountId, id);
    return updatedPayment;
  }

  private async clearPaymentCache(
    accountId: string,
    paymentId?: string,
  ): Promise<void> {
    const patterns: string[] = [
      'paymentHistory:list:*',
      `paymentHistory:account:${accountId}:*`,
    ];

    if (paymentId) {
      patterns.push(`paymentHistory:${paymentId}`, `paymentHistory:txn:*`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
