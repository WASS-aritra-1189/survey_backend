/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { CreateLoginHistoryDto } from '../dto/create-login-history.dto';
import type { LoginHistoryResponseDto } from '../dto/login-history-response.dto';
import type { QueryLoginHistoryDto } from '../dto/query-login-history.dto';
import type { LoginHistory } from '../entities/login-history.entity';

export abstract class ILoginHistoryService {
  abstract createLog(
    createLoginHistoryDto: CreateLoginHistoryDto,
  ): Promise<LoginHistoryResponseDto>;
  abstract findAll(query: QueryLoginHistoryDto): Promise<{
    data: LoginHistory[];
    total: number;
    page: number;
    limit: number;
  }>;
}
