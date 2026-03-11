/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnquiryListController } from './enquiry-list.controller';
import { EnquiryListService } from './enquiry-list.service';
import { EnquiryList } from './entities/enquiry-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnquiryList])],
  controllers: [EnquiryListController],
  providers: [
    {
      provide: 'IEnquiryListService',
      useClass: EnquiryListService,
    },
  ],
  exports: ['IEnquiryListService'],
})
export class EnquiryListModule {}
