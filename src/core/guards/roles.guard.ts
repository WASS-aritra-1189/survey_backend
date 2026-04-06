/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUser {
  user?: { roles?: string };
}

/**
 * Roles Guard - Strategy Pattern with Command Pattern
 * Implements role-based access control (RBAC)
 * Uses Chain of Responsibility for authorization checks
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Strategy pattern implementation for role-based authorization
   * Template method pattern for consistent authorization flow
   */
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || !requiredRoles.length) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    console.log('Roles Guard activated with user roles:', user);
    if (!user?.roles) {
      return false; // No user authenticated or no roles
    }

    // ROOT bypasses all role restrictions
    if (user.roles === UserRoles.ROOT) {
      return true; 
    }

    // Convert string role to UserRoles enum
    const userRole = user.roles as UserRoles;
    
    // Command pattern - execute role validation command
    return this.validateUserRoles([userRole], requiredRoles);
  }

  /**
   * Command pattern implementation for role validation
   * Encapsulates the role checking logic
   */
  private validateUserRoles(
    userRoles: UserRoles[],
    requiredRoles: UserRoles[],
  ): boolean {
    return requiredRoles.some((role: UserRoles) => userRoles.includes(role));
  }
}
