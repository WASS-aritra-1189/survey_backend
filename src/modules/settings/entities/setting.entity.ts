/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { PartnerCommissionType } from '../../../shared/enums/partner-commission-type.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { AccountLevel } from '../../account-levels/entities/account-level.entity';
import { BankDetail } from '../../bank-details/entities/bank-detail.entity';
import { Category } from '../../category/entities/category.entity';
import { Designation } from '../../designations/entities/designation.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Page } from '../../pages/entities/page.entity';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';
import { Slider } from '../../sliders/entities/slider.entity';
import { SubCategory } from '../../sub-category/entities/sub-category.entity';
import { UserWallet } from '../../user-wallets/entities/user-wallet.entity';

@Entity('settings')
@Index(['status'])
@Index(['title'])
export class Setting extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column('text')
  message: string;

  @Column('json')
  userSetting: object;

  @Column('json')
  adminSetting: object;

  @Column('json')
  mobileSetting: object;

  @Column()
  userDomain: string;

  @Column()
  adminDomain: string;

  @Column()
  mobileDomain: string;

  @Column({ default: false })
  userMaintenanceMode: boolean;

  @Column({ default: false })
  adminMaintenanceMode: boolean;

  @Column({ default: false })
  mobileMaintenanceMode: boolean;

  @Column({ nullable: true })
  userLoginLogo: string;

  @Column({ nullable: true })
  adminLoginLogo: string;

  @Column({ nullable: true })
  mobileLoginLogo: string;

  @Column({ nullable: true })
  userRegisterLogo: string;

  @Column({ nullable: true })
  adminRegisterLogo: string;

  @Column({ nullable: true })
  mobileRegisterLogo: string;

  @Column({ nullable: true })
  userLoginBackground: string;

  @Column({ nullable: true })
  adminLoginBackground: string;

  @Column({ nullable: true })
  mobileLoginBackground: string;

  @Column({ nullable: true })
  userRegisterBackground: string;

  @Column({ nullable: true })
  adminRegisterBackground: string;

  @Column({ nullable: true })
  mobileRegisterBackground: string;

  @Column({ default: 1 })
  accountLevel: number;

  @Column({ default: false })
  multiDeviceLogin: boolean;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'enum', enum: PartnerCommissionType })
  partnerCommissionType: PartnerCommissionType;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @OneToMany(() => Slider, slider => slider.setting)
  sliders: Slider[];

  @OneToMany(() => Page, page => page.setting)
  pages: Page[];

  @OneToMany(() => Notification, notification => notification.setting)
  notifications: Notification[];

  @OneToMany(() => Designation, designation => designation.setting)
  designations: Designation[];

  @OneToMany(() => BankDetail, bankDetail => bankDetail.setting)
  bankDetails: BankDetail[];

  @OneToMany(() => AccountLevel, accountLevel => accountLevel.setting)
  accountLevels: AccountLevel[];

  @OneToMany(() => Category, category => category.setting)
  categories: Category[];

  @OneToMany(() => SubCategory, subCategory => subCategory.setting)
  subCategories: SubCategory[];

  @OneToMany(() => UserWallet, userWallet => userWallet.setting)
  userWallets: UserWallet[];

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.setting)
  paymentHistories: PaymentHistory[];
}
