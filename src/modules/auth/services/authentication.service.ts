/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MESSAGE_CODES } from '../../../shared/constants/message-codes';
import { UserRoles } from '../../../shared/enums/accouts.enum';
import { LoginType } from '../../../shared/enums/auth.enum';
import { MessageType } from '../../../shared/enums/message-type.enum';
import { UserStatus } from '../../../shared/enums/status.enum';
import { CustomException } from '../../../shared/exceptions/custom.exception';
import { Account } from '../../account/entities/account.entity';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service';
import { ActivityModule, ActivityAction } from '../../activity-logs/entities/activity-log.entity';
import type {
  AuthResult,
  IAuthenticationService,
  IPasswordService,
  ISessionService,
  ITokenService,
  TokenPair,
  TokenPayload,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async authenticate(
    roles: UserRoles,
    loginId: string,
    loginType: LoginType,
    domain: string,
    password?: string,
    otp?: string,
    accessToken?: string,
    name?: string,
  ): Promise<AuthResult> {
    const account = await this.getAccount(loginId, roles);
    this.validateAccount(account, domain);

    if (password) {
      await this.verifyPassword(password, account.password);
    }
    if(!otp && loginType === LoginType.OTP){
      // OTP verification logic to be implemented
    }
    if(!otp && accessToken && name){
      // Social login logic to be implemented
    }
    if(otp && loginType === LoginType.OTP){
      // OTP verification logic to be implemented
    }
    const tokens = this.generateTokens(account);
    await this.sessionService.createSession(account, tokens);

    // Log activity only for non-survey-master roles
    if (account.roles !== UserRoles.SURVEY_MASTER) {
      await this.activityLogsService.log(
        account.id,
        ActivityModule.AUTH,
        ActivityAction.LOGIN,
        `User logged in via ${loginType}`,
        account.id,
        { loginType, domain },
      );
    }

    return { account, tokens };
  }

  private async getAccount(loginId: string, roles: UserRoles): Promise<Account> {
    const account = await this.accountRepository.findOne({
      select: {
        id: true,
        loginId: true,
        password: true,
        roles: true,
        status: true,
      },
      where: { loginId, roles },
    });

    if (!account) {
      throw new CustomException(
        MESSAGE_CODES.AUTH_INVALID_CREDENTIALS,
        MessageType.ERROR,
      );
    }
    return account;
  }

  private validateAccount(account: Account, domain: string): void {
    if (account.status !== UserStatus.ACTIVE) {
      throw new CustomException(
        MESSAGE_CODES.AUTH_ACCOUNT_INACTIVE,
        MessageType.ERROR,
      );
    }
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isValid = await this.passwordService.compare(
      password,
      hashedPassword,
    );
    if (!isValid) {
      throw new CustomException(
        MESSAGE_CODES.AUTH_INVALID_CREDENTIALS,
        MessageType.ERROR,
      );
    }
  }

  private generateTokens(account: Account): TokenPair {
    const payload: TokenPayload = {
      sub: account.id,
      loginId: account.loginId,
      roles: account.roles,
    };

    return {
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
    };
  }
}
