/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { AccountStatus } from '../../../shared/enums/bank.enum';
import type { CreateBankDetailDto } from '../dto/create-bank-detail.dto';
import type { QueryBankDetailDto } from '../dto/query-bank-detail.dto';
import type { UpdateBankDetailDto } from '../dto/update-bank-detail.dto';
import type { BankDetail } from '../entities/bank-detail.entity';

export abstract class IBankDetailsService {
  abstract create(createBankDetailDto: CreateBankDetailDto): Promise<BankDetail>;
  abstract findAll(query: QueryBankDetailDto): Promise<PaginatedResult<BankDetail>>;
  abstract findOne(id: string): Promise<BankDetail>;
  abstract setDefault(id: string, updatedBy: string): Promise<BankDetail>;
  abstract update(
    id: string,
    updateBankDetailDto: UpdateBankDetailDto,
  ): Promise<BankDetail>;
  abstract status(
    id: string,
    status: AccountStatus,
    updatedBy: string,
  ): Promise<BankDetail>;
}
