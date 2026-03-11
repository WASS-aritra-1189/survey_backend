/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailUtils {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') ?? '',
      port: this.configService.get<number>('SMTP_PORT') ?? 587,
      secure: this.configService.get<boolean>('SMTP_SECURE') ?? false,
      auth: {
        user: this.configService.get<string>('SMTP_USER') ?? '',
        pass: this.configService.get<string>('SMTP_PASS') ?? '',
      },
    }) as Transporter;
  }

  sendEmail(options: EmailOptions): Promise<SentMessageInfo> {
    const mailOptions: SendMailOptions = {
      from: this.configService.get<string>('SMTP_USER') ?? '',
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.transporter.sendMail(mailOptions);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
