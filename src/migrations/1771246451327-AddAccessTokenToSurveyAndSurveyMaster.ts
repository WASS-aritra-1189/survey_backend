import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccessTokenToSurveyAndSurveyMaster1771246451327 implements MigrationInterface {
    name = 'AddAccessTokenToSurveyAndSurveyMaster1771246451327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if accessToken column exists in surveys table
        const surveysTable = await queryRunner.getTable('surveys');
        const surveysHasAccessToken = surveysTable?.columns.find(col => col.name === 'accessToken');
        
        if (!surveysHasAccessToken) {
            // Add column as nullable first
            await queryRunner.query(`ALTER TABLE "surveys" ADD "accessToken" character varying(4)`);
            
            // Generate unique tokens for existing surveys
            const surveys = await queryRunner.query(`SELECT id FROM "surveys"`);
            for (const survey of surveys) {
                const token = Math.floor(1000 + Math.random() * 9000).toString();
                await queryRunner.query(`UPDATE "surveys" SET "accessToken" = $1 WHERE id = $2`, [token, survey.id]);
            }
            
            // Make column NOT NULL and add unique constraint
            await queryRunner.query(`ALTER TABLE "surveys" ALTER COLUMN "accessToken" SET NOT NULL`);
            await queryRunner.query(`ALTER TABLE "surveys" ADD CONSTRAINT "UQ_28775d73b8d3bf136069840978f" UNIQUE ("accessToken")`);
        }
        
        // Check if accessToken column exists in survey_masters table
        const surveyMastersTable = await queryRunner.getTable('survey_masters');
        const mastersHasAccessToken = surveyMastersTable?.columns.find(col => col.name === 'accessToken');
        
        if (!mastersHasAccessToken) {
            // Same for survey_masters
            await queryRunner.query(`ALTER TABLE "survey_masters" ADD "accessToken" character varying(4)`);
            
            const surveyMasters = await queryRunner.query(`SELECT id FROM "survey_masters"`);
            for (const master of surveyMasters) {
                const token = Math.floor(1000 + Math.random() * 9000).toString();
                await queryRunner.query(`UPDATE "survey_masters" SET "accessToken" = $1 WHERE id = $2`, [token, master.id]);
            }
            
            await queryRunner.query(`ALTER TABLE "survey_masters" ALTER COLUMN "accessToken" SET NOT NULL`);
            await queryRunner.query(`ALTER TABLE "survey_masters" ADD CONSTRAINT "UQ_bf2c6c75b451e335878ae73c2d2" UNIQUE ("accessToken")`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const surveyMastersTable = await queryRunner.getTable('survey_masters');
        const mastersHasAccessToken = surveyMastersTable?.columns.find(col => col.name === 'accessToken');
        
        if (mastersHasAccessToken) {
            await queryRunner.query(`ALTER TABLE "survey_masters" DROP CONSTRAINT IF EXISTS "UQ_bf2c6c75b451e335878ae73c2d2"`);
            await queryRunner.query(`ALTER TABLE "survey_masters" DROP COLUMN "accessToken"`);
        }
        
        const surveysTable = await queryRunner.getTable('surveys');
        const surveysHasAccessToken = surveysTable?.columns.find(col => col.name === 'accessToken');
        
        if (surveysHasAccessToken) {
            await queryRunner.query(`ALTER TABLE "surveys" DROP CONSTRAINT IF EXISTS "UQ_28775d73b8d3bf136069840978f"`);
            await queryRunner.query(`ALTER TABLE "surveys" DROP COLUMN "accessToken"`);
        }
    }

}
