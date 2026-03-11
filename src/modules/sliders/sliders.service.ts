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
import { SliderStatus } from '../../shared/enums/slider.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { BulkUpdateSliderDto } from './dto/bulk-update-slider.dto';
import { CreateSliderDto } from './dto/create-slider.dto';
import { QuerySliderDto } from './dto/query-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';
import { ISlidersService } from './interfaces/sliders-service.interface';

@Injectable()
export class SlidersService implements ISlidersService {
  private readonly queryConfig: QueryConfig<Slider> = {
    alias: 'slider',
    searchFields: ['title', 'description'],
    sortableFields: ['title', 'sortOrder', 'createdAt', 'updatedAt', 'status'],
    defaultSortField: 'sortOrder',
    customFilters: (qb, query: QuerySliderDto) => {
      if (query.status?.length) {
        qb.andWhere('slider.status IN (:...status)', {
          status: query.status,
        });
      }
      if (query.type?.length) {
        qb.andWhere('slider.type IN (:...type)', {
          type: query.type,
        });
      }
      if (query.position?.length) {
        qb.andWhere('slider.position IN (:...position)', {
          position: query.position,
        });
      }
      if (query.pageType?.length) {
        qb.andWhere('slider.page IN (:...page)', {
          page: query.page,
        });
      }
    },
  };

  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createSliderDto: CreateSliderDto): Promise<Slider> {
    const slider = this.sliderRepository.create(createSliderDto);
    const savedSlider = await this.sliderRepository.save(slider);
    await this.clearSliderCache(savedSlider.settingId);
    return savedSlider;
  }

  async findAll(query: QuerySliderDto): Promise<PaginatedResult<Slider>> {
    const cacheKey = `slider:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<Slider>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.sliderRepository,
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

  async update(id: string, updateSliderDto: UpdateSliderDto): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(slider, updateSliderDto);
    const updatedSlider = await this.sliderRepository.save(slider);
    await this.clearSliderCache(updatedSlider.settingId, id);
    return updatedSlider;
  }

  bulkUpdate(bulkUpdateSliderDto: BulkUpdateSliderDto): Promise<Slider[]> {
    return this.sliderRepository.save(bulkUpdateSliderDto.sliders);
  }

  async status(
    id: string,
    status: SliderStatus,
    updatedBy: string,
  ): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    slider.status = status;
    slider.updatedBy = updatedBy;
    const updatedSlider = await this.sliderRepository.save(slider);
    await this.clearSliderCache(updatedSlider.settingId, id);
    return updatedSlider;
  }

  private async clearSliderCache(
    settingId: string,
    sliderId?: string,
  ): Promise<void> {
    const patterns: string[] = ['sliders:list:*'];

    if (sliderId) {
      patterns.push(`slider:${sliderId}`);
    }

    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }
}
