/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetter } from './entities/news-letter.entity';
import { NewsLettersController } from './news-letters.controller';
import { NewsLettersService } from './news-letters.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetter])],
  controllers: [NewsLettersController],
  providers: [
    {
      provide: 'INewsLettersService',
      useClass: NewsLettersService,
    },
  ],
  exports: ['INewsLettersService'],
})
export class NewsLettersModule {}
