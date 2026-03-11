/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Inject, Injectable } from '@nestjs/common';
import type {
  ILogoutService,
  ISessionService,
} from '../interfaces/auth.interface';

@Injectable()
export class LogoutService implements ILogoutService {
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
  ) {}

  async execute(token: string): Promise<void> {
    await this.sessionService.invalidateSession(token);
  }
}
