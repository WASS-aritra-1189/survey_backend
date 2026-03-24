/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { UserRoles } from '../../../shared/enums/accouts.enum';
import type { LoginType } from '../../../shared/enums/auth.enum';
import type { Account } from '../../account/entities/account.entity';
import { RegisterDto } from '../dto/register.dto';

// Interface Segregation Principle
export interface IAuthenticationService {
  authenticate(
    roles: UserRoles,
    loginId: string,
    loginType: LoginType,
    domain: string,
    password?: string,
    otp?: string,
    accessToken?: string,
    name?: string,
    ipAddress?: string,
  ): Promise<AuthResult>;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}

export interface ISessionService {
  createSession(account: Account, tokens: TokenPair): Promise<void>;
  invalidateSession(token: string): Promise<void>;
  refreshSession(refreshToken: string): Promise<Account>;
}

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface ILogoutService {
  execute(token: string): Promise<void>;
}

export interface IRegisterService{
  register(dto:RegisterDto): Promise<Account>;
}

// Data Transfer Objects
export interface TokenPayload {
  sub: string;
  loginId: string;
  roles?: UserRoles;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  account: Account;
  tokens: TokenPair;
}
