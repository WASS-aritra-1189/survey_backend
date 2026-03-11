/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { StaffDetail } from '../staff-details/entities/staff-detail.entity';
import { Designation } from '../designations/entities/designation.entity';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { AuthController } from './auth.controller';
import { Session } from './entities/session.entity';
import { AuthenticationService } from './services/authentication.service';
import { LogoutService } from './services/logout.service';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';
import { RegisterService } from './services/register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Session, StaffDetail, Designation]),
    ActivityLogsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'IAuthenticationService', useClass: AuthenticationService },
    { provide: 'ITokenService', useClass: TokenService },
    { provide: 'ISessionService', useClass: SessionService },
    { provide: 'IPasswordService', useClass: PasswordService },
    { provide: 'ILogoutService', useClass: LogoutService },
    {provide: 'IRegisterService', useClass: RegisterService }
  ],
  exports: [JwtModule],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthModule {}
