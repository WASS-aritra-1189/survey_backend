/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import type { CreatePaymentHistoryDto } from '../dto/create-payment-history.dto';
import type { QueryPaymentHistoryDto } from '../dto/query-payment-history.dto';
import type { UpdatePaymentHistoryDto } from '../dto/update-payment-history.dto';
import type { PaymentHistory } from '../entities/payment-history.entity';

export abstract class IPaymentHistoryService {
  abstract create(createPaymentHistoryDto: CreatePaymentHistoryDto): Promise<PaymentHistory>;
  abstract findAll(query: QueryPaymentHistoryDto): Promise<PaginatedResult<PaymentHistory>>;
  abstract findOne(id: string): Promise<PaymentHistory>;
  abstract findByAccount(accountId: string, query: QueryPaymentHistoryDto): Promise<PaginatedResult<PaymentHistory>>;
  abstract findByTransactionId(transactionId: string): Promise<PaymentHistory>;
  abstract updatePaymentStatus(id: string, paymentStatus: PaymentStatus, updatedBy: string): Promise<PaymentHistory>;
  abstract update(id: string, updatePaymentHistoryDto: UpdatePaymentHistoryDto): Promise<PaymentHistory>;
  abstract status(id: string, status: DefaultStatus, updatedBy: string): Promise<PaymentHistory>;
}