import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDownloadHistoryTable1771600000000 implements MigrationInterface {
  name = 'CreateDownloadHistoryTable1771600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "download_history_format_enum" AS ENUM ('CSV', 'PDF', 'EXCEL', 'JSON')
    `);
    await queryRunner.query(`
      CREATE TABLE "download_history" (
        "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        "createdBy"   uuid,
        "updatedBy"   uuid,
        "deletedAt"   TIMESTAMP,
        "accountId"   uuid              NOT NULL,
        "fileName"    character varying(255) NOT NULL,
        "format"      "download_history_format_enum" NOT NULL,
        "source"      character varying(255) NOT NULL,
        "recordCount" integer           NOT NULL DEFAULT 0,
        "ipAddress"   character varying(45),
        CONSTRAINT "PK_download_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_download_history_account" FOREIGN KEY ("accountId")
          REFERENCES "accounts"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_download_history_accountId" ON "download_history" ("accountId")`);
    await queryRunner.query(`CREATE INDEX "IDX_download_history_format"    ON "download_history" ("format")`);
    await queryRunner.query(`CREATE INDEX "IDX_download_history_createdAt" ON "download_history" ("createdAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "download_history"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "download_history_format_enum"`);
  }
}
