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
import { CreateStateDto } from './dto/create-state.dto';
import { QueryStateDto } from './dto/query-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './entities/state.entity';
import { IStateService } from './interfaces/state-service.interface';

@Injectable()
export class StateService implements IStateService {
  private readonly queryConfig: QueryConfig<State> = {
    alias: 'state',
    searchFields: ['name', 'code'],
    sortableFields: ['name', 'code', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'name',
    customFilters: (qb, query: QueryStateDto) => {
      if (query.status?.length) {
        qb.andWhere('state.status IN (:...status)', { status: query.status });
      }
      if (query.countryId?.length) {
        qb.andWhere('state.countryId IN (:...countryId)', {
          countryId: query.countryId,
        });
      }
    },
  };

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createStateDto: CreateStateDto): Promise<State> {
    const existing = await this.stateRepository.findOne({
      where: { name: createStateDto.name, countryId: createStateDto.countryId },
    });
    if (existing) {
      throw new CustomException(
        MESSAGE_CODES.STATE_NAME_DUPLICATE,
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }

    const state = this.stateRepository.create(createStateDto);
    const saved = await this.stateRepository.save(state);
    await this.clearStateCache();
    return saved;
  }

  async findAll(query: QueryStateDto): Promise<PaginatedResult<State>> {
    const cacheKey = `state:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<State>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.stateRepository,
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

  async findOne(id: string): Promise<State> {
    const cacheKey = `state:${id}`;
    const cached = await this.cacheService.get<State>(cacheKey);
    if (cached) {
      return cached;
    }

    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['country', 'cities'],
    });
    if (!state) {
      throw new CustomException(
        MESSAGE_CODES.STATE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, state, 300);
    return state;
  }

  async update(id: string, updateStateDto: UpdateStateDto): Promise<State> {
    const state = await this.stateRepository.findOne({ where: { id } });
    if (!state) {
      throw new CustomException(
        MESSAGE_CODES.STATE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateStateDto.name && updateStateDto.name !== state.name) {
      const existing = await this.stateRepository.findOne({
        where: { name: updateStateDto.name, countryId: state.countryId },
      });
      if (existing && existing.id !== id) {
        throw new CustomException(
          MESSAGE_CODES.STATE_NAME_DUPLICATE,
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(state, updateStateDto);
    const updated = await this.stateRepository.save(state);
    await this.clearStateCache(id);
    return updated;
  }

  async status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<State> {
    const state = await this.stateRepository.findOne({ where: { id } });
    if (!state) {
      throw new CustomException(
        MESSAGE_CODES.STATE_NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    state.status = status;
    state.updatedBy = updatedBy;
    const updated = await this.stateRepository.save(state);
    await this.clearStateCache(id);
    return updated;
  }

  private async clearStateCache(stateId?: string): Promise<void> {
    const patterns: string[] = ['states:list:*'];
    if (stateId) {
      patterns.push(`state:${stateId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
