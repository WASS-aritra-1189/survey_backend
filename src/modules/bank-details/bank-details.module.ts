/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankDetailsController } from './bank-details.controller';
import { BankDetailsService } from './bank-details.service';
import { BankDetail } from './entities/bank-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankDetail])],
  controllers: [BankDetailsController],
  providers: [{ provide: 'IBankDetailsService', useClass: BankDetailsService }],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BankDetailsModule {}
