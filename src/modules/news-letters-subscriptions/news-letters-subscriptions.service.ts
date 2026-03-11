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
import { SubscriptionStatus } from '../../shared/enums/newsletter.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { CreateNewsLettersSubscriptionDto } from './dto/create-news-letters-subscription.dto';
import { QueryNewsLettersSubscriptionDto } from './dto/query-news-letters-subscription.dto';
import { UpdateNewsLettersSubscriptionDto } from './dto/update-news-letters-subscription.dto';
import { NewsLettersSubscription } from './entities/news-letters-subscription.entity';
import { INewsLettersSubscriptionsService } from './interfaces/news-letters-subscriptions-service.interface';

@Injectable()
export class NewsLettersSubscriptionsService
  implements INewsLettersSubscriptionsService
{
  private readonly queryConfig: QueryConfig<NewsLettersSubscription> = {
    alias: 'subscription',
    searchFields: ['email'],
    sortableFields: [
      'email',
      'status',
      'subscribedAt',
      'createdAt',
      'updatedAt',
    ],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: any) => {
      if (query.userId) {
        qb.andWhere('subscription.userId = :userId', { userId: query.userId });
      }
      if (query.newsletterId) {
        qb.andWhere('subscription.newsletterId = :newsletterId', {
          newsletterId: query.newsletterId,
        });
      }
      if (query.status?.length) {
        qb.andWhere('subscription.status IN (:...status)', { status: query.status });
      }
    },
  };

  constructor(
    @InjectRepository(NewsLettersSubscription)
    private readonly subscriptionRepository: Repository<NewsLettersSubscription>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(
    createDto: CreateNewsLettersSubscriptionDto,
  ): Promise<NewsLettersSubscription> {
    const subscription = this.subscriptionRepository.create(createDto);
    const savedSubscription =
      await this.subscriptionRepository.save(subscription);
    await this.clearCache();
    return savedSubscription;
  }

  async findAll(
    query: QueryNewsLettersSubscriptionDto,
  ): Promise<PaginatedResult<NewsLettersSubscription>> {
    const cacheKey = `subscriptions:all:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<NewsLettersSubscription>>(
        cacheKey,
      );
    if (cached) return cached;

    const { page = 1, limit = 10 } = query as any;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.subscriptionRepository,
      query as any,
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

  async findOne(id: string): Promise<NewsLettersSubscription> {
    const cacheKey = `subscription:${id}`;
    const cached =
      await this.cacheService.get<NewsLettersSubscription>(cacheKey);
    if (cached) return cached;

    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['newsletter'],
    });

    if (!subscription) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, subscription, 300);
    return subscription;
  }

  async findByUser(
    userId: string,
    query: QueryNewsLettersSubscriptionDto,
  ): Promise<PaginatedResult<NewsLettersSubscription>> {
    query.userId = userId;
    return this.findAll(query);
  }

  async subscribe(
    settingId: string,
    email: string,
  ): Promise<NewsLettersSubscription> {
    const existing = await this.subscriptionRepository.findOne({
      where: { settingId, email },
    });

    if (existing) {
      if (existing.status === SubscriptionStatus.ACTIVE) {
        throw new CustomException(
          MESSAGE_CODES.CONFLICT,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
      existing.status = SubscriptionStatus.PENDING_CONFIRMATION;
      existing.email = email;
      return this.subscriptionRepository.save(existing);
    }

    const subscription = this.subscriptionRepository.create({
      email,
      status: SubscriptionStatus.PENDING_CONFIRMATION,
      settingId: settingId,
    });

    const saved = await this.subscriptionRepository.save(subscription);
    await this.clearCache();
    return saved;
  }

  async unsubscribe(
    id: string,
    reason?: string,
  ): Promise<NewsLettersSubscription> {
    const subscription = await this.findOne(id);
    subscription.status = SubscriptionStatus.UNSUBSCRIBED;
    subscription.unsubscribedAt = new Date();
    subscription.unsubscribeReason = reason;

    const updated = await this.subscriptionRepository.save(subscription);
    await this.clearCache();
    return updated;
  }

  async updateStatus(
    id: string,
    status: SubscriptionStatus,
    updatedBy: string,
  ): Promise<NewsLettersSubscription> {
    const subscription = await this.findOne(id);
    subscription.status = status;
    subscription.updatedBy = updatedBy;

    const updated = await this.subscriptionRepository.save(subscription);
    await this.clearCache();
    return updated;
  }

  async update(
    id: string,
    updateDto: UpdateNewsLettersSubscriptionDto,
  ): Promise<NewsLettersSubscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateDto);

    const updated = await this.subscriptionRepository.save(subscription);
    await this.clearCache();
    return updated;
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
    await this.clearCache();
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheService.getKeys('subscription*');
    await Promise.all(keys.map(key => this.cacheService.del(key)));
  }
}
