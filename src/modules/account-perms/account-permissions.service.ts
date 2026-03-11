/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  QueryConfig,
} from '../../core/services/query-builder.service';
import { MenuPermissionsDto } from './dto/menu-permissions-response.dto';
import { QueryAccountPermissionDto } from './dto/query-account-permission.dto';
import { UpdateAccountPermissionDto } from './dto/update-account-permission.dto';
import { AccountPermission } from './entities/account-perms.entity';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { IAccountPermissionsService } from './interfaces/account-permissions-service.interface';

@Injectable()
export class AccountPermissionsService implements IAccountPermissionsService {
  private readonly queryConfig: QueryConfig<Menu> = {
    alias: 'menu',
    searchFields: ['name'],
    sortableFields: ['name', 'createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    joins: [
      {
        relation: 'menu.accountPermissions',
        alias: 'accountPermissions',
        type: 'left',
      },
      {
        relation: 'accountPermissions.permission',
        alias: 'permission',
        type: 'left',
      },
    ],
    customFilters: (qb, query: QueryAccountPermissionDto) => {
      if (query.status?.length) {
        qb.andWhere('menu.status IN (:...status)', {
          status: query.status,
        });
      }
    },
  };

  constructor(
    @InjectRepository(AccountPermission)
    private readonly accountPermissionRepository: Repository<AccountPermission>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async findAll(
    query: QueryAccountPermissionDto,
  ): Promise<PaginatedResult<MenuPermissionsDto>> {
    const cacheKey = `menu_permissions:${JSON.stringify(query)}`;
    const cached =
      await this.cacheService.get<PaginatedResult<MenuPermissionsDto>>(
        cacheKey,
      );

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.menuRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(
      queryBuilder,
      page,
      limit,
    );

    const permissionsCacheKey = 'all_permissions';
    let allPermissions =
      await this.cacheService.get<Permission[]>(permissionsCacheKey);
    if (!allPermissions) {
      allPermissions = await this.permissionRepository.find();
      await this.cacheService.set(permissionsCacheKey, allPermissions, 3600);
    }

    const menuPermissions: MenuPermissionsDto[] = result.data.map(menu => {
      const existingPermissions = menu.accountPermissions || [];

      const permissions = allPermissions.map(permission => {
        const existing = existingPermissions.find(
          ap => ap.permissionId === permission.id,
        );
        return {
          id: permission.id,
          name: permission.name,
          status: existing ? existing.status : false,
        };
      });

      return {
        id: menu.id,
        name: menu.name,
        status: menu.status,
        permissions,
      };
    });

    const response = {
      ...result,
      data: menuPermissions,
    };

    await this.cacheService.set(cacheKey, response, 300);
    return response;
  }

  async update(
    updateDto: UpdateAccountPermissionDto[],
  ): Promise<UpdateAccountPermissionDto[]> {
    // Validate all foreign keys before saving
    for (const dto of updateDto) {
      // Check if menu exists
      const menu = await this.menuRepository.findOne({ where: { id: dto.menuId } });
      if (!menu) {
        throw new Error(`Menu with ID ${dto.menuId} not found`);
      }

      // Check if permission exists
      const permission = await this.permissionRepository.findOne({ where: { id: dto.permissionId } });
      if (!permission) {
        throw new Error(`Permission with ID ${dto.permissionId} not found`);
      }
    }

    await this.accountPermissionRepository.save(updateDto);
    await this.clearCache();
    return updateDto;
  }

  async findByAccountId(accountId: string): Promise<AccountPermission[]> {
    return this.accountPermissionRepository.find({
      where: { accountId },
      relations: ['menu', 'permission'],
    });
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheService.getKeys('menu_permissions*');
    await Promise.all(keys.map(key => this.cacheService.del(key)));
  }
}
