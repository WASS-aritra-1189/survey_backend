/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction, ActivityModule } from './entities/activity-log.entity';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(
    accountId: string,
    module: ActivityModule,
    action: ActivityAction,
    description: string,
    resourceId?: string,
    metadata?: any,
    ipAddress?: string,
  ): Promise<void> {
    const log = this.activityLogRepository.create({
      accountId,
      module,
      action,
      description,
      resourceId,
      metadata,
      ipAddress,
    });
    await this.activityLogRepository.save(log);
  }

  async findByUser(userId: string, query: QueryActivityLogDto) {
    const { page = 1, limit = 20, module, action, search, dateFrom, dateTo } = query;
    const qb = this.activityLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.account', 'account')
      .where('log.accountId = :userId', { userId })
      .orderBy('log.createdAt', 'DESC');

    if (module) qb.andWhere('log.module = :module', { module });
    if (action) qb.andWhere('log.action = :action', { action });
    if (search) qb.andWhere('log.description ILIKE :search', { search: `%${search}%` });
    if (dateFrom) qb.andWhere('log.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('log.createdAt <= :dateTo', { dateTo: to });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findAll(query: QueryActivityLogDto) {
    const { page = 1, limit = 20, module, action, search, dateFrom, dateTo } = query;
    const qb = this.activityLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.account', 'account')
      .orderBy('log.createdAt', 'DESC');

    if (module) qb.andWhere('log.module = :module', { module });
    if (action) qb.andWhere('log.action = :action', { action });
    if (search) qb.andWhere('log.description ILIKE :search', { search: `%${search}%` });
    if (dateFrom) qb.andWhere('log.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('log.createdAt <= :dateTo', { dateTo: to });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
}
