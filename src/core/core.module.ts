/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountLevel } from '../modules/account-levels/entities/account-level.entity';
import { AccountPermission } from '../modules/account-perms/entities/account-perms.entity';
import { Menu } from '../modules/account-perms/entities/menu.entity';
import { Permission } from '../modules/account-perms/entities/permission.entity';
import { Account } from '../modules/account/entities/account.entity';
import { Session } from '../modules/auth/entities/session.entity';
import { Country } from '../modules/country/entities/country.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { CacheService } from './services/cache.service';
import { FirebaseService } from './services/firebase.service';
import { QueryBuilderService } from './services/query-builder.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Setting } from '../modules/settings/entities/setting.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Session, AccountPermission, Setting, AccountLevel, Account, Country, Permission, Menu]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheService,
    FirebaseService,
    QueryBuilderService,
    JwtStrategy,
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [
    CacheService,
    FirebaseService,
    QueryBuilderService,
    JwtAuthGuard,
    PermissionsGuard,
    TypeOrmModule,
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CoreModule {}
