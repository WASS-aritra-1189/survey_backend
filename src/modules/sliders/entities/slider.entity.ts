/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import {
  RedirectType,
  SliderPage,
  SliderPosition,
  SliderStatus,
  SliderType,
} from '../../../shared/enums/slider.enum';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('sliders')
@Index(['status'])
@Index(['type'])
@Index(['position'])
@Index(['page'])
@Index(['sortOrder'])
@Index(['settingId'])
export class Slider extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500 })
  redirectUrl: string;

  @Column({ type: 'enum', enum: SliderType, default: SliderType.BANNER })
  type: SliderType;

  @Column({ type: 'enum', enum: RedirectType, default: RedirectType.INTERNAL })
  redirectType: RedirectType;

  @Column({ type: 'enum', enum: SliderPosition, default: SliderPosition.TOP })
  position: SliderPosition;

  @Column({ type: 'enum', enum: SliderPage, default: SliderPage.HOME })
  page: SliderPage;

  @Column({ type: 'enum', enum: SliderStatus, default: SliderStatus.ACTIVE })
  status: SliderStatus;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'boolean', default: false })
  openInNewTab: boolean;

  @Column({ type: 'boolean', default: true })
  showOnMobile: boolean;

  @Column({ type: 'boolean', default: true })
  showOnDesktop: boolean;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
