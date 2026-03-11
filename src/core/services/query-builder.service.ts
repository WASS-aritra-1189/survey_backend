/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { QueryBaseDto } from '../../shared/dto/query-base.dto';
import { SortOrder } from '../../shared/enums/sort.enum';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

export interface JoinConfig {
  relation: string;
  alias: string;
  type?: 'inner' | 'left';
  condition?: string;
}

export interface AggregateConfig {
  field: string;
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  alias?: string;
}

export interface QueryConfig<T extends ObjectLiteral> {
  alias: string;
  searchFields?: Array<keyof T>;
  sortableFields?: Array<keyof T>;
  defaultSortField?: keyof T;
  selectFields?: string[];
  aggregates?: AggregateConfig[];
  joins?: JoinConfig[];
  groupBy?: string[];
  having?: string;
  customFilters?: (qb: SelectQueryBuilder<T>, query: QueryBaseDto) => void;
}

@Injectable()
export class QueryBuilderService {
  buildQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    query: QueryBaseDto,
    config: QueryConfig<T>,
  ): SelectQueryBuilder<T> {
    const queryBuilder = repository.createQueryBuilder(config.alias);

    this.applySelectFields(queryBuilder, config);
    this.applyJoins(queryBuilder, config);
    this.applySearchFilter(queryBuilder, query, config);
    this.applyDateFilters(queryBuilder, query, config.alias);
    this.applySettingFilter(queryBuilder, query, config.alias);
    this.applyGroupBy(queryBuilder, config);
    this.applySorting(queryBuilder, query, config);
    config.customFilters?.(queryBuilder, query);

    return queryBuilder;
  }

  private applySelectFields<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    config: QueryConfig<T>,
  ): void {
    const selectFields = [...(config.selectFields ?? [])];

    if (config.aggregates?.length) {
      const aggregateFields = config.aggregates.map(agg => {
        const fieldName = agg.field.split('.').pop() ?? 'field';
        const defaultAlias = `${agg.function.toLowerCase()}_${fieldName}`;
        return `${agg.function}(${agg.field}) as ${agg.alias ?? defaultAlias}`;
      });
      selectFields.push(...aggregateFields);
    }

    if (selectFields.length) {
      queryBuilder.select(selectFields);
    }
  }

  private applyJoins<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    config: QueryConfig<T>,
  ): void {
    config.joins?.forEach(join => {
      if (join.type === 'inner') {
        if (join.condition) {
          queryBuilder.innerJoinAndSelect(
            join.relation,
            join.alias,
            join.condition,
          );
        } else {
          queryBuilder.innerJoinAndSelect(join.relation, join.alias);
        }
      } else {
        if (join.condition) {
          queryBuilder.leftJoinAndSelect(
            join.relation,
            join.alias,
            join.condition,
          );
        } else {
          queryBuilder.leftJoinAndSelect(join.relation, join.alias);
        }
      }
    });
  }

  private applySearchFilter<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryBaseDto,
    config: QueryConfig<T>,
  ): void {
    if (query.search && config.searchFields?.length) {
      const searchConditions = config.searchFields
        .map(field => `${config.alias}.${String(field)} ILIKE :search`)
        .join(' OR ');
      queryBuilder.andWhere(`(${searchConditions})`, {
        search: `%${query.search}%`,
      });
    }
  }

  private applyDateFilters<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryBaseDto,
    alias: string,
  ): void {
    if (query.fromDate) {
      queryBuilder.andWhere(`${alias}.createdAt >= :fromDate`, {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere(`${alias}.createdAt <= :toDate`, {
        toDate: query.toDate,
      });
    }
  }

  private applySettingFilter<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryBaseDto,
    alias: string,
  ): void {
    if (query.settingId) {
      queryBuilder.andWhere(`${alias}.settingId = :settingId`, {
        settingId: query.settingId,
      });
    }
  }

  private applyGroupBy<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    config: QueryConfig<T>,
  ): void {
    if (config.groupBy?.length) {
      queryBuilder.groupBy(config.groupBy.join(', '));
    }

    if (config.having) {
      queryBuilder.having(config.having);
    }
  }

  private applySorting<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryBaseDto,
    config: QueryConfig<T>,
  ): void {
    const sortField = config.sortableFields?.includes(query.sortKey as keyof T)
      ? query.sortKey
      : (config.defaultSortField ?? 'createdAt');

    if (
      query.sortValue === SortOrder.ASC ||
      query.sortValue === SortOrder.DESC
    ) {
      queryBuilder.orderBy(
        `${config.alias}.${String(sortField)}`,
        query.sortValue,
      );
    }
  }

  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<T>> {
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }
}
