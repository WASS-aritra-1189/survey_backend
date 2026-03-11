/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsUtils {
  generateOtp(length: number = 4): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  formatPhoneNumber(phone: string, countryCode: string = '+91'): string {
    const cleaned = phone.replace(/\D/g, '');
    return countryCode + cleaned;
  }
}
