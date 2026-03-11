/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { SubscriptionStatus } from '../../../shared/enums/newsletter.enum';
import type { CreateNewsLettersSubscriptionDto } from '../dto/create-news-letters-subscription.dto';
import type { QueryNewsLettersSubscriptionDto } from '../dto/query-news-letters-subscription.dto';
import type { UpdateNewsLettersSubscriptionDto } from '../dto/update-news-letters-subscription.dto';
import type { NewsLettersSubscription } from '../entities/news-letters-subscription.entity';

export abstract class INewsLettersSubscriptionsService {
  abstract findAll(query: QueryNewsLettersSubscriptionDto): Promise<PaginatedResult<NewsLettersSubscription>>;
  abstract findOne(id: string): Promise<NewsLettersSubscription>;
  abstract findByUser(userId: string, query: QueryNewsLettersSubscriptionDto): Promise<PaginatedResult<NewsLettersSubscription>>;
  abstract subscribe(settingId: string,email: string): Promise<NewsLettersSubscription>;
  abstract unsubscribe(id: string, reason?: string): Promise<NewsLettersSubscription>;
  abstract updateStatus(id: string, status: SubscriptionStatus, updatedBy: string): Promise<NewsLettersSubscription>;
  abstract update(id: string, updateDto: UpdateNewsLettersSubscriptionDto): Promise<NewsLettersSubscription>;
  abstract remove(id: string): Promise<void>;
}
