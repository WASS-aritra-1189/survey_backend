/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

interface RazorpayConfig {
  key_id: string;
  key_secret: string;
}

interface RazorpayOrder {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface RazorpayInstance {
  orders: {
    create(order: RazorpayOrder): Promise<unknown>;
  };
  payments: {
    fetch(paymentId: string): Promise<unknown>;
    refund(paymentId: string, data: Record<string, number>): Promise<unknown>;
  };
}

export interface RazorpayOrderOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

@Injectable()
export class RazorpayUtils {
  private readonly razorpay: RazorpayInstance;
  private readonly keySecret: string;

  constructor(private readonly configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID') ?? '';
    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ?? '';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RazorpayClass = require('razorpay') as new (
      config: RazorpayConfig,
    ) => RazorpayInstance;
    this.razorpay = new RazorpayClass({
      key_id: keyId,
      key_secret: this.keySecret,
    });
  }

  createOrder(options: RazorpayOrderOptions): Promise<unknown> {
    return this.razorpay.orders.create({
      amount: options.amount * 100, // Convert to paise
      currency: options.currency ?? 'INR',
      receipt: options.receipt,
      notes: options.notes,
    });
  }

  verifyPaymentSignature(verification: RazorpayPaymentVerification): boolean {
    const body = `${verification.razorpay_order_id}|${verification.razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    return expectedSignature === verification.razorpay_signature;
  }

  fetchPayment(paymentId: string): Promise<unknown> {
    return this.razorpay.payments.fetch(paymentId);
  }

  refundPayment(paymentId: string, amount?: number): Promise<unknown> {
    const refundData: Record<string, number> = {};
    if (amount) {
      refundData.amount = amount * 100;
    }

    return this.razorpay.payments.refund(paymentId, refundData);
  }
}
