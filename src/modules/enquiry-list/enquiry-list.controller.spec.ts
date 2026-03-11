/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EnquiryListController } from './enquiry-list.controller';
import { EnquiryListService } from './enquiry-list.service';

describe('EnquiryListController', () => {
  let controller: EnquiryListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnquiryListController],
      providers: [EnquiryListService],
    }).compile();

    controller = module.get<EnquiryListController>(EnquiryListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
