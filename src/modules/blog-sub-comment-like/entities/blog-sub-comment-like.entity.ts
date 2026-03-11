/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Account } from '../../account/entities/account.entity';
import { BlogComment } from '../../blog-comments/entities/blog-comment.entity';
import { BlogSubComment } from '../../blog-sub-comment/entities/blog-sub-comment.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('blog_sub_comment_likes')
@Unique(['blogSubCommentId', 'accountId'])
@Index(['accountId'])
@Index(['blogId'])
@Index(['blogCommentId'])
@Index(['blogSubCommentId'])
export class BlogSubCommentLike extends BaseEntity {
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

  @Column({ type: 'uuid' })
  blogSubCommentId: string;

  @ManyToOne(() => BlogSubComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogSubCommentId' })
  blogSubComment: BlogSubComment;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, { nullable: true })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
