/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageType } from '../enums/message-type.enum';

export class CustomException extends HttpException {
  constructor(
    public readonly messageCode: { code: string; message: string },
    public readonly messageType: MessageType = MessageType.ERROR,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(messageCode.message, statusCode);
    this.messageId = messageCode.code;
  }

  public readonly messageId: string;
}
