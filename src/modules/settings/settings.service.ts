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
import { CustomException } from '../../shared/exceptions/custom.exception';
import type { CreateSettingDto } from './dto/create-setting.dto';
import type { QuerySettingDto } from './dto/query-setting.dto';
import type { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import type { ISettingsService } from './interfaces/settings-service.interface';

@Injectable()
export class SettingsService implements ISettingsService {
  private readonly queryConfig: QueryConfig<Setting> = {
    alias: 'setting',
    searchFields: [
      'title',
      'message',
      'userDomain',
      'adminDomain',
      'mobileDomain',
    ],
    sortableFields: ['title', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QuerySettingDto) => {
      if (query.status?.length) {
        qb.andWhere('setting.status IN (:...status)', { status: query.status });
      }
    },
  };

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingRepository.create(createSettingDto);
    const savedSetting = await this.settingRepository.save(setting);
    await this.clearCache();
    return savedSetting;
  }

  async findAll(query: QuerySettingDto): Promise<PaginatedResult<Setting>> {
    const cacheKey = `settings:all:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Setting>>(cacheKey);
    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.settingRepository,
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

  async findOne(id: string): Promise<Setting> {
    const cacheKey = `setting:${id}`;
    const cached = await this.cacheService.get<Setting>(cacheKey);
    if (cached) return cached;

    const setting = await this.settingRepository.findOne({
      where: { id, status: DefaultStatus.ACTIVE },
    });

    if (!setting) {
      throw new CustomException(
        MESSAGE_CODES.SETTING_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, setting, 300);
    return setting;
  }

  async findOneByDomain(domain: string): Promise<Setting> {
    const cacheKey = `setting:domain:${domain}`;
    const cached = await this.cacheService.get<Setting>(cacheKey);
    if (cached) return cached;

    const setting = await this.settingRepository
      .createQueryBuilder('setting')
      .where(
        '(setting.userDomain = :domain OR setting.adminDomain = :domain OR ' +
          'setting.mobileDomain = :domain)',
        { domain },
      )
      .andWhere('setting.status = :status', { status: DefaultStatus.ACTIVE })
      .getOne();

    if (!setting) {
      throw new CustomException(
        MESSAGE_CODES.SETTING_DOMAIN_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, setting, 300);
    return setting;
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const existingSetting = await this.settingRepository.findOne({
      where: { id },
    });
    if (!existingSetting) {
      throw new CustomException(
        MESSAGE_CODES.SETTING_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(existingSetting, updateSettingDto);
    const updatedSetting = await this.settingRepository.save(existingSetting);
    await this.clearCache();
    return updatedSetting;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { id } });

    if (!setting) {
      throw new CustomException(
        MESSAGE_CODES.SETTING_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    setting.status = status;
    setting.updatedBy = updatedBy;

    const updatedSetting = await this.settingRepository.save(setting);
    await this.clearCache();
    return updatedSetting;
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheService.getKeys('setting*');
    await Promise.all(keys.map(key => this.cacheService.del(key)));
  }
}
