/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { PageType } from '../../../shared/enums/page.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('pages')
@Index(['slug'])
@Index(['pageType'])
@Index(['status'])
@Index(['settingId'])
export class Page extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'enum', enum: PageType })
  pageType: PageType;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ogImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ogTitle: string;

  @Column({ type: 'text', nullable: true })
  ogDescription: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  canonicalUrl: string;

  @Column({ type: 'json', nullable: true })
  structuredData: object;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne(() => Setting)
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
