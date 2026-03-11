/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsHistoryController } from './contact-us-history.controller';
import { ContactUsHistoryService } from './contact-us-history.service';
import { ContactUsHistory } from './entities/contact-us-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUsHistory])],
  controllers: [ContactUsHistoryController],
  providers: [
    {
      provide: 'IContactUsHistoryService',
      useClass: ContactUsHistoryService,
    },
  ],
  exports: ['IContactUsHistoryService'],
})
export class ContactUsHistoryModule {}
