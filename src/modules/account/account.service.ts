/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { UserStatus } from '../../shared/enums/status.enum';
import type { QueryAccountDto } from './dto/query-account.dto';
import type { UpdatePasswordDto } from './dto/update-password.dto';
import { Account } from './entities/account.entity';
import type { IAccountsService } from './interfaces/accounts-service.interface';

@Injectable()
export class AccountService implements IAccountsService {
  private readonly queryConfig: QueryConfig<Account> = {
    alias: 'account',
    searchFields: ['loginId'],
    sortableFields: ['loginId', 'createdAt', 'updatedAt', 'status', 'roles'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QueryAccountDto) => {
      if (query.status?.length) {
        qb.andWhere('account.status IN (:...status)', { status: query.status });
      }
      if (query.roles?.length) {
        qb.andWhere('account.roles IN (:...roles)', { roles: query.roles });
      }
    },
  };

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(query: QueryAccountDto): Promise<PaginatedResult<Account>> {
    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.accountRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );

    return result;
  }

  async resetPassword(
    id: string,
    body: UpdatePasswordDto,
    updatedBy: string,
  ): Promise<Account> {
    const cacheKey = `account:${id}`;
    let account = await this.cacheService.get<Account>(cacheKey);

    if (!account) {
      account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
    }

    const isOldPasswordValid = await bcrypt.compare(
      body.oldPassword,
      account.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Invalid old password');
    }

    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    account.password = hashedPassword;
    account.updatedBy = updatedBy;

    const updatedAccount = await this.accountRepository.save(account);
    await this.cacheService.set(cacheKey, updatedAccount, 600);
    await this.cacheService.del('accounts:*');

    return updatedAccount;
  }

  async status(
    id: string,
    status: UserStatus,
    updatedBy: string,
  ): Promise<Account> {
    const cacheKey = `account:${id}`;
    let account = await this.cacheService.get<Account>(cacheKey);

    if (!account) {
      account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
    }

    account.status = status;
    account.updatedBy = updatedBy;

    const updatedAccount = await this.accountRepository.save(account);
    await this.cacheService.set(cacheKey, updatedAccount, 600);
    await this.cacheService.del('accounts:*');

    return updatedAccount;
  }

  async update(
    id: string,
    loginId: string,
    updatedBy: string,
  ): Promise<Account> {
    const cacheKey = `account:${id}`;
    let account = await this.cacheService.get<Account>(cacheKey);

    if (!account) {
      account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
    }

    account.loginId = loginId;
    account.updatedBy = updatedBy;

    const updatedAccount = await this.accountRepository.save(account);
    await this.cacheService.set(cacheKey, updatedAccount, 600);
    await this.cacheService.del('accounts:*');

    return updatedAccount;
  }
}
