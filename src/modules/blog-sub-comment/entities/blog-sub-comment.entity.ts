/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { BlogComment } from '../../blog-comments/entities/blog-comment.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('blog_sub_comments')
@Index(['accountId'])
@Index(['blogId'])
@Index(['blogCommentId'])
@Index(['status'])

export class BlogSubComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

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

  @Column({ type: 'uuid' })
  blogCommentId: string;

  @ManyToOne(() => BlogComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogCommentId' })
  blogComment: BlogComment;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, { nullable: true })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
