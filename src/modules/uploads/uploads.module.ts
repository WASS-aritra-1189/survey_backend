/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { BunnyCdnUtils } from '../../shared/utils/bunnycdn.utils';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [
    BunnyCdnUtils,
    { provide: 'IUploadsService', useClass: UploadsService },
  ],
  exports: ['IUploadsService'],
})
export class UploadsModule {}
