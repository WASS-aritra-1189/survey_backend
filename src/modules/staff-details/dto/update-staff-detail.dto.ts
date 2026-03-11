/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { PartialType } from '@nestjs/swagger';
import { CreateStaffDetailDto } from './create-staff-detail.dto';

export class UpdateStaffDetailDto extends PartialType(CreateStaffDetailDto) {}
