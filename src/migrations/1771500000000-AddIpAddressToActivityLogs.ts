import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIpAddressToActivityLogs1771500000000 implements MigrationInterface {
  name = 'AddIpAddressToActivityLogs1771500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activity_logs');
    const hasColumn = table?.columns.find((col) => col.name === 'ipAddress');
    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "activity_logs" ADD "ipAddress" character varying(45)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activity_logs');
    const hasColumn = table?.columns.find((col) => col.name === 'ipAddress');
    if (hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "activity_logs" DROP COLUMN "ipAddress"`,
      );
    }
  }
}
