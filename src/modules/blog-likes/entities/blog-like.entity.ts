/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { BlogLikeType } from '../../../shared/enums/blog.enum';
import { Account } from '../../account/entities/account.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('blog_likes')
@Unique(['blogId', 'accountId'])
@Index(['blogId'])
@Index(['accountId'])
@Index(['type'])
export class BlogLike extends BaseEntity {
  @Column({ type: 'enum', enum: BlogLikeType, default: BlogLikeType.LIKE })
  type: BlogLikeType;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, { nullable: true })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
