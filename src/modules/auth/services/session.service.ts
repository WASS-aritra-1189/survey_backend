/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Session } from '../entities/session.entity';
import { ISessionService, TokenPair } from '../interfaces/auth.interface';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(account: Account, tokens: TokenPair): Promise<void> {
    const session = this.sessionRepository.create({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accountId: account.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.sessionRepository.save(session);
  }

  async invalidateSession(token: string): Promise<void> {
    await this.sessionRepository.update({ token }, { isActive: false });
  }

  async refreshSession(refreshToken: string): Promise<Account> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
      relations: ['account'],
    });

    if (!session || session.refreshExpiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return session.account;
  }
}
