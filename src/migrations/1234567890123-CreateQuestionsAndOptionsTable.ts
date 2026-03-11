/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateQuestionsAndOptionsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const questionsTableExists = await queryRunner.hasTable('questions');
    const optionsTableExists = await queryRunner.hasTable('question_options');

    // Create questions table if it doesn't exist
    if (!questionsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'questions',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'questionText',
              type: 'varchar',
              length: '500',
            },
            {
              name: 'type',
              type: 'enum',
              enum: ['text', 'textarea', 'single_choice', 'multiple_choice', 'rating', 'date', 'number', 'file'],
            },
            {
              name: 'order',
              type: 'integer',
            },
            {
              name: 'isRequired',
              type: 'boolean',
              default: true,
            },
            {
              name: 'surveyId',
              type: 'uuid',
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
          ],
        }),
        true,
      );

      // Add foreign key for questions
      await queryRunner.createForeignKey(
        'questions',
        new TableForeignKey({
          columnNames: ['surveyId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'surveys',
          onDelete: 'CASCADE',
        }),
      );

      // Create indexes for questions
      await queryRunner.query(`CREATE INDEX "IDX_questions_surveyId" ON "questions" ("surveyId")`);
      await queryRunner.query(`CREATE INDEX "IDX_questions_order" ON "questions" ("order")`);
    }

    // Create question_options table if it doesn't exist
    if (!optionsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'question_options',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'optionText',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'order',
              type: 'integer',
            },
            {
              name: 'questionId',
              type: 'uuid',
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
          ],
        }),
        true,
      );

      // Add foreign key for question_options
      await queryRunner.createForeignKey(
        'question_options',
        new TableForeignKey({
          columnNames: ['questionId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'questions',
          onDelete: 'CASCADE',
        }),
      );

      // Create indexes for question_options
      await queryRunner.query(`CREATE INDEX "IDX_question_options_questionId" ON "question_options" ("questionId")`);
      await queryRunner.query(`CREATE INDEX "IDX_question_options_order" ON "question_options" ("order")`);
    }

    // Check if surveys table has questions column
    const surveysTable = await queryRunner.getTable('surveys');
    const hasQuestionsColumn = surveysTable?.columns.find(col => col.name === 'questions');

    if (hasQuestionsColumn) {
      // Migrate existing JSON data to new tables
      const surveys = await queryRunner.query(`SELECT id, questions FROM surveys WHERE questions IS NOT NULL`);

      for (const survey of surveys) {
        if (survey.questions && Array.isArray(survey.questions)) {
          for (let i = 0; i < survey.questions.length; i++) {
            const q = survey.questions[i];
            
            // Insert question
            const questionResult = await queryRunner.query(
              `INSERT INTO questions ("questionText", "type", "order", "isRequired", "surveyId") 
               VALUES ($1, $2, $3, $4, $5) RETURNING id`,
              [
                q.question || q.questionText,
                q.questionType || q.type || 'text',
                q.orderIndex || q.order || i,
                q.isRequired !== undefined ? q.isRequired : true,
                survey.id,
              ],
            );

            const questionId = questionResult[0].id;

            // Insert options if they exist
            if (q.options && Array.isArray(q.options)) {
              for (let j = 0; j < q.options.length; j++) {
                const option = q.options[j];
                await queryRunner.query(
                  `INSERT INTO question_options ("optionText", "order", "questionId") 
                   VALUES ($1, $2, $3)`,
                  [typeof option === 'string' ? option : option.optionText, j, questionId],
                );
              }
            }
          }
        }
      }

      // Remove questions column from surveys table
      await queryRunner.query(`ALTER TABLE surveys DROP COLUMN questions`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add questions column back
    await queryRunner.query(`ALTER TABLE surveys ADD COLUMN questions jsonb`);

    // Migrate data back to JSON
    const surveys = await queryRunner.query(`SELECT id FROM surveys`);

    for (const survey of surveys) {
      const questions = await queryRunner.query(
        `SELECT * FROM questions WHERE "surveyId" = $1 ORDER BY "order"`,
        [survey.id],
      );

      const questionsWithOptions: any[] = [];

      for (const question of questions) {
        const options = await queryRunner.query(
          `SELECT * FROM question_options WHERE "questionId" = $1 ORDER BY "order"`,
          [question.id],
        );

        questionsWithOptions.push({
          question: question.questionText,
          questionType: question.type,
          orderIndex: question.order,
          isRequired: question.isRequired,
          options: options.map((o: any) => o.optionText),
        });
      }

      await queryRunner.query(`UPDATE surveys SET questions = $1 WHERE id = $2`, [
        JSON.stringify(questionsWithOptions),
        survey.id,
      ]);
    }

    // Drop tables
    await queryRunner.dropTable('question_options');
    await queryRunner.dropTable('questions');
  }
}
