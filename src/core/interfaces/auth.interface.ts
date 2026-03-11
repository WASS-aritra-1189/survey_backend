/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

export interface JwtPayload {
  sub: string;
  loginId: string;
  roles: string;
}

export interface ValidatedUser {
  sub: string;
  loginId: string;
  roles: string;
}

export interface RequestWithUser {
  user: ValidatedUser;
}

export interface RequestWithHeaders {
  headers: {
    authorization?: string;
  };
}

export interface PermissionEntity {
  [key: string]: boolean;
}