import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AddLocationValidation1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add requiresLocationValidation column to surveys table if it doesn't exist
    const surveysTable = await queryRunner.getTable('surveys');
    const hasColumn = surveysTable?.columns.find(col => col.name === 'requiresLocationValidation');
    
    if (!hasColumn) {
      await queryRunner.addColumn(
        'surveys',
        new TableColumn({
          name: 'requiresLocationValidation',
          type: 'boolean',
          default: false,
        }),
      );
    }

    // Create survey_assignment_locations table if it doesn't exist
    const tableExists = await queryRunner.hasTable('survey_assignment_locations');
    
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'survey_assignment_locations',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'surveyId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'surveyMasterId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'latitude',
              type: 'decimal',
              precision: 10,
              scale: 8,
              isNullable: false,
            },
            {
              name: 'longitude',
              type: 'decimal',
              precision: 11,
              scale: 8,
              isNullable: false,
            },
            {
              name: 'radiusInMeters',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'createdBy',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'updatedBy',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'deletedAt',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );

      // Create unique constraint on surveyId and surveyMasterId
      await queryRunner.createIndex(
        'survey_assignment_locations',
        new TableIndex({
          name: 'UQ_survey_assignment_locations_survey_master',
          columnNames: ['surveyId', 'surveyMasterId'],
          isUnique: true,
        }),
      );

      // Create index on surveyId
      await queryRunner.createIndex(
        'survey_assignment_locations',
        new TableIndex({
          name: 'IDX_survey_assignment_locations_survey',
          columnNames: ['surveyId'],
        }),
      );

      // Create index on surveyMasterId
      await queryRunner.createIndex(
        'survey_assignment_locations',
        new TableIndex({
          name: 'IDX_survey_assignment_locations_master',
          columnNames: ['surveyMasterId'],
        }),
      );

      // Add foreign key for surveyId
      await queryRunner.createForeignKey(
        'survey_assignment_locations',
        new TableForeignKey({
          columnNames: ['surveyId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'surveys',
          onDelete: 'CASCADE',
        }),
      );

      // Add foreign key for surveyMasterId
      await queryRunner.createForeignKey(
        'survey_assignment_locations',
        new TableForeignKey({
          columnNames: ['surveyMasterId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'survey_masters',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable('survey_assignment_locations');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('survey_assignment_locations', foreignKey);
      }
    }

    // Drop table
    await queryRunner.dropTable('survey_assignment_locations', true);

    // Drop column from surveys table if it exists
    const surveysTable = await queryRunner.getTable('surveys');
    const hasColumn = surveysTable?.columns.find(col => col.name === 'requiresLocationValidation');
    
    if (hasColumn) {
      await queryRunner.dropColumn('surveys', 'requiresLocationValidation');
    }
  }
}
