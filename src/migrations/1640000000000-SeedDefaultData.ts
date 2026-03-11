/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultData1640000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default settings
    await queryRunner.query(`
      INSERT INTO settings (id, title, message, "userSetting", "adminSetting", "mobileSetting",
        "userDomain", "adminDomain", "mobileDomain", "userMaintenanceMode", "adminMaintenanceMode", "mobileMaintenanceMode",
        "userLoginLogo", "adminLoginLogo", "mobileLoginLogo", "userRegisterLogo", "adminRegisterLogo", "mobileRegisterLogo",
        "userLoginBackground", "adminLoginBackground", "mobileLoginBackground", "userRegisterBackground", "adminRegisterBackground", "mobileRegisterBackground",
        "accountLevel", "multiDeviceLogin", currency, "partnerCommissionType", status, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440000', 'Default Settings', 'Welcome to Nirvana360 Platform',
        '{}', '{}', '{}', 'localhost:3000', 'localhost:3001', 'localhost:3002',
        false, false, false, null, null, null, null, null, null, null, null, null, null, null, null,
        1, false, 'INR', 'COMMISSION', 'ACTIVE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM settings WHERE title = 'Default Settings')
    `);

    // Insert default account levels
    await queryRunner.query(`
      INSERT INTO account_levels (id, name, priority, status, "settingId", "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440001', 'Root', 1, 'ACTIVE', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM account_levels WHERE name = 'Root')
    `);

    await queryRunner.query(`
      INSERT INTO account_levels (id, name, priority, status, "settingId", "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440002', 'Root Staff', 2, 'ACTIVE', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM account_levels WHERE name = 'Root Staff')
    `);

    // Insert default admin account
    await queryRunner.query(`
      INSERT INTO accounts (id, "loginId", password, roles, status, "accountLevelId", "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440003', 'admin@webappssoft.com',
        '$2a$12$/0uppzUUo./q9l.0qkrBE.2CQLMB/vygr/xIHxC5pQkD4wBG14YCG',
        'ROOT', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE "loginId" = 'admin@webappssoft.com')
    `);

    // Insert default countries
    await queryRunner.query(`
      INSERT INTO countries (id, name, code, status, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440004', 'India', 'IN', 'ACTIVE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM countries WHERE code = 'IN')
    `);

    await queryRunner.query(`
      INSERT INTO countries (id, name, code, status, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440005', 'United States', 'US', 'ACTIVE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM countries WHERE code = 'US')
    `);

    // Insert permissions
    await queryRunner.query(`
      INSERT INTO permissions (id, name, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440010', 'CREATE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'CREATE')
    `);

    await queryRunner.query(`
      INSERT INTO permissions (id, name, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440011', 'READ', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'READ')
    `);

    await queryRunner.query(`
      INSERT INTO permissions (id, name, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440012', 'UPDATE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'UPDATE')
    `);

    await queryRunner.query(`
      INSERT INTO permissions (id, name, "createdAt", "updatedAt")
      SELECT '550e8400-e29b-41d4-a716-446655440013', 'DELETE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'DELETE')
    `);

    // Insert menus (table names)
    const menus = [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        name: 'accounts',
        title: 'Accounts',
        description: 'Account management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        name: 'account_levels',
        title: 'Account Levels',
        description: 'Account level management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        name: 'sessions',
        title: 'Sessions',
        description: 'Session management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        name: 'blogs',
        title: 'Blogs',
        description: 'Blog management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440024',
        name: 'blog_comments',
        title: 'Blog Comments',
        description: 'Blog comment management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440025',
        name: 'blog_likes',
        title: 'Blog Likes',
        description: 'Blog like management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440026',
        name: 'categories',
        title: 'Categories',
        description: 'Category management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440027',
        name: 'countries',
        title: 'Countries',
        description: 'Country management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440028',
        name: 'states',
        title: 'States',
        description: 'State management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440029',
        name: 'cities',
        title: 'Cities',
        description: 'City management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        name: 'bank_details',
        title: 'Bank Details',
        description: 'Bank detail management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        name: 'settings',
        title: 'Settings',
        description: 'Settings management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440032',
        name: 'sliders',
        title: 'Sliders',
        description: 'Slider management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440033',
        name: 'pages',
        title: 'Pages',
        description: 'Page management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440034',
        name: 'user_wallets',
        title: 'User Wallets',
        description: 'User wallet management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440035',
        name: 'staff_details',
        title: 'Staff Details',
        description: 'Staff detail management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440036',
        name: 'designations',
        title: 'Designations',
        description: 'Designation management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440037',
        name: 'sub_categories',
        title: 'Sub Categories',
        description: 'Sub category management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440038',
        name: 'notifications',
        title: 'Notifications',
        description: 'Notification management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440039',
        name: 'payment_history',
        title: 'Payment History',
        description: 'Payment history management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        name: 'user_details',
        title: 'User Details',
        description: 'User detail management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        name: 'login_history',
        title: 'Login History',
        description: 'Login history management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440042',
        name: 'feedbacks',
        title: 'Feedbacks',
        description: 'Feedback management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440043',
        name: 'news_letters',
        title: 'News Letters',
        description: 'Newsletter management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440044',
        name: 'enquiry_list',
        title: 'Enquiry List',
        description: 'Enquiry management',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440045',
        name: 'contact_us_history',
        title: 'Contact Us History',
        description: 'Contact history management',
      },
    ];

    for (const menu of menus) {
      await queryRunner.query(`
        INSERT INTO menus (id, name, title, description, status, "createdAt", "updatedAt")
        SELECT '${menu.id}', '${menu.name}', '${menu.title}', '${menu.description}', 'ACTIVE', NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM menus WHERE name = '${menu.name}')
      `);
    }

    // Insert account permissions (admin account with all permissions for all tables)
    let accountPermissionId = 100;

    // Get existing admin account
    const adminAccount = await queryRunner.query(
      `SELECT id FROM accounts WHERE "loginId" = 'admin@webappssoft.com'`,
    );

    if (adminAccount.length > 0) {
      // Get existing menu and permission IDs
      const existingMenus = await queryRunner.query(`SELECT id FROM menus`);
      const existingPermissions = await queryRunner.query(
        `SELECT id FROM permissions`,
      );

      for (const menu of existingMenus) {
        for (const permission of existingPermissions) {
          const uuid = `550e8400-e29b-41d4-a716-44665544${accountPermissionId.toString().padStart(4, '0')}`;
          await queryRunner.query(`
            INSERT INTO account_permissions (id, status, "menuId", "permissionId", "accountId", "createdAt", "updatedAt")
            SELECT '${uuid}',
              true, '${menu.id}', '${permission.id}', '${adminAccount[0].id}', NOW(), NOW()
            WHERE NOT EXISTS (
              SELECT 1 FROM account_permissions
              WHERE "accountId" = '${adminAccount[0].id}'
              AND "menuId" = '${menu.id}'
              AND "permissionId" = '${permission.id}'
            )
          `);
          accountPermissionId++;
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM account_permissions WHERE "accountId" = '550e8400-e29b-41d4-a716-446655440003'`,
    );
    await queryRunner.query(`DELETE FROM menus`);
    await queryRunner.query(`DELETE FROM permissions`);
    await queryRunner.query(`DELETE FROM countries`);
    await queryRunner.query(
      `DELETE FROM accounts WHERE "loginId" = 'admin@webappssoft.com'`,
    );
    await queryRunner.query(
      `DELETE FROM account_levels WHERE name IN ('Root', 'Root Staff')`,
    );
    await queryRunner.query(
      `DELETE FROM settings WHERE title = 'Default Settings'`,
    );
  }
}
