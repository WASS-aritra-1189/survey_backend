/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { UserRoles } from '../../../shared/enums/accouts.enum';
import { UserStatus } from '../../../shared/enums/status.enum';
import { AccountLevel } from '../../account-levels/entities/account-level.entity';
import { BankDetail } from '../../bank-details/entities/bank-detail.entity';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { StaffDetail } from '../../staff-details/entities/staff-detail.entity';
import { UserDetail } from '../../user-details/entities/user-detail.entity';
import { UserWallet } from '../../user-wallets/entities/user-wallet.entity';
import { AccountPermission } from '../../account-perms/entities/account-perms.entity';

@Entity('accounts')
@Index(['loginId'])
@Index(['status'])
@Index(['roles'])
@Index(['accountLevelId'])
@Index(['settingId'])
export class Account extends BaseEntity {
  @Column({ unique: true })
  loginId: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  deviceId: string;

  @Column({ type: 'uuid',nullable:true })
  accountLevelId: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  roles: UserRoles;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @ManyToOne(() => AccountLevel)
  @JoinColumn({ name: 'accountLevelId' })
  accountLevel: AccountLevel;

  @OneToMany(() => BankDetail, bankDetail => bankDetail.account)
  bankDetails: BankDetail[];

  @OneToMany(
    () => AccountPermission,
    acccountPermissions => acccountPermissions.account,
  )
  acccountPermissions: AccountPermission[];

  @OneToOne('UserDetail', 'account')
  userDetail: UserDetail;

  @OneToOne('StaffDetail', 'account')
  staffDetail: StaffDetail;

  @OneToMany(() => UserWallet, userWallet => userWallet.account)
  userWallets: UserWallet[];

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.account)
  paymentHistories: PaymentHistory[];

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.fromAccount)
  sentPayments: PaymentHistory[];

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.toAccount)
  receivedPayments: PaymentHistory[];
}
