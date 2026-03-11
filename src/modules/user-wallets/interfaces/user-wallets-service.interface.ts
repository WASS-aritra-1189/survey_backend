/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateUserWalletDto } from '../dto/create-user-wallet.dto';
import type { QueryUserWalletDto } from '../dto/query-user-wallet.dto';
import type { UpdateUserWalletDto } from '../dto/update-user-wallet.dto';
import type { UserWallet } from '../entities/user-wallet.entity';

export abstract class IUserWalletsService {
  abstract create(
    createUserWalletDto: CreateUserWalletDto,
  ): Promise<UserWallet>;
  abstract findAll(
    query: QueryUserWalletDto,
  ): Promise<PaginatedResult<UserWallet>>;
  abstract findOne(id: string): Promise<UserWallet>;
  abstract findByAccount(
    accountId: string,
    query: QueryUserWalletDto,
  ): Promise<PaginatedResult<UserWallet>>;
  abstract getBalance(
    accountId: string,
  ): Promise<{ balance: number; currency: string }>;
  abstract update(
    id: string,
    updateUserWalletDto: UpdateUserWalletDto,
  ): Promise<UserWallet>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<UserWallet>;
}
