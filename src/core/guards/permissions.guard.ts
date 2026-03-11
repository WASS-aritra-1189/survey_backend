/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPermission } from '../../modules/account-perms/entities/account-perms.entity';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { RequestWithUser } from '../interfaces/auth.interface';
import { CacheService } from '../services/cache.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(AccountPermission)
    private readonly accountPermissionRepository: Repository<AccountPermission>,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<
      Array<{ menuName: string; action: PermissionType }>
    >('permissions', context.getHandler());

    if (!requiredPermissions || !requiredPermissions.length) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    for (const { menuName, action } of requiredPermissions) {
      const cacheKey = `permission:${user.sub}:${menuName}`;
      let permissions: AccountPermission[] =
        (await this.cacheService.get(cacheKey)) ?? [];

      if (!permissions.length) {
        permissions = await this.accountPermissionRepository
          .createQueryBuilder('ap')
          .select(['ap.id', 'permission.name'])
          .leftJoin('ap.permission', 'permission')
          .leftJoin('ap.menu', 'menu')
          .where('ap.accountId = :accountId', { accountId: user.sub })
          .andWhere('menu.name = :menuName', { menuName })
          .andWhere('menu.status = :menuStatus', {
            menuStatus: DefaultStatus.ACTIVE,
          })
          .andWhere('ap.status = :apStatus', {
            apStatus: true,
          })
          .getMany();

        if (permissions.length) {
          await this.cacheService.set(cacheKey, permissions, 300);
        }
      }

      const hasPermission = permissions.some(
        (perm: AccountPermission) => perm.permission.name === action,
      );

      if (!hasPermission) {
        throw new ForbiddenException('Permissions denied!');
      }
    }

    return true;
  }
}
