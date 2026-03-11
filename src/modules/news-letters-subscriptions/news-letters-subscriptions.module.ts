/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLettersSubscription } from './entities/news-letters-subscription.entity';
import { NewsLettersSubscriptionsController } from './news-letters-subscriptions.controller';
import { NewsLettersSubscriptionsService } from './news-letters-subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLettersSubscription])],
  controllers: [NewsLettersSubscriptionsController],
  providers: [
    {
      provide: 'INewsLettersSubscriptionsService',
      useClass: NewsLettersSubscriptionsService,
    },
  ],
  exports: ['INewsLettersSubscriptionsService'],
})
export class NewsLettersSubscriptionsModule {}
