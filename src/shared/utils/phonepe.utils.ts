/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

export interface PhonePePaymentRequest {
  merchantTransactionId: string;
  amount: number;
  merchantUserId: string;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: string;
    targetApp?: string;
  };
}

@Injectable()
export class PhonePeUtils {
  private readonly merchantId: string;
  private readonly saltKey: string;
  private readonly saltIndex: number;
  private readonly baseUrl: string;

  constructor(
    merchantId: string,
    saltKey: string,
    saltIndex: number,
    isProduction = false,
  ) {
    this.merchantId = merchantId;
    this.saltKey = saltKey;
    this.saltIndex = saltIndex;
    this.baseUrl = isProduction
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  generateChecksum(payload: string): string {
    const string = `${payload}/pg/v1/pay${this.saltKey}`;
    const hash = createHash('sha256').update(string).digest('hex');
    return `${hash}###${this.saltIndex.toString()}`;
  }

  createPaymentRequest(request: PhonePePaymentRequest): {
    request: string;
    checksum: string;
    url: string;
  } {
    const payload = {
      merchantId: this.merchantId,
      merchantTransactionId: request.merchantTransactionId,
      merchantUserId: request.merchantUserId,
      amount: request.amount * 100, // Convert to paise
      redirectUrl: request.redirectUrl,
      redirectMode: request.redirectMode,
      callbackUrl: request.callbackUrl,
      mobileNumber: request.mobileNumber,
      paymentInstrument: request.paymentInstrument,
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      'base64',
    );
    const checksum = this.generateChecksum(base64Payload);

    return {
      request: base64Payload,
      checksum,
      url: `${this.baseUrl}/pg/v1/pay`,
    };
  }

  async checkPaymentStatus(merchantTransactionId: string): Promise<unknown> {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}${this.saltKey}`;
    const hash = createHash('sha256').update(string).digest('hex');
    const checksum = `${hash}###${this.saltIndex.toString()}`;

    const response = await fetch(
      `${this.baseUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': this.merchantId,
        },
      },
    );

    return response.json() as unknown;
  }

  verifyCallback(response: string, checksum: string): boolean {
    const hash = createHash('sha256')
      .update(response + this.saltKey)
      .digest('hex');
    const expectedChecksum = `${hash}###${this.saltIndex.toString()}`;

    return expectedChecksum === checksum;
  }
}
