# Survey Database Restructuring

## Overview
Migrated from storing questions as JSON in the surveys table to a proper normalized relational database structure.

## New Database Structure

```
surveys
  ├── id (uuid)
  ├── title
  ├── description
  ├── status
  ├── target
  ├── deviceType
  ├── accessToken
  └── surveyMasterIds

questions
  ├── id (uuid)
  ├── questionText
  ├── type (enum: text, textarea, single_choice, multiple_choice, rating, date, number)
  ├── order
  ├── isRequired
  └── surveyId (FK -> surveys.id)

question_options
  ├── id (uuid)
  ├── optionText
  ├── order
  └── questionId (FK -> questions.id)
```

## Relationships

- **Survey → Questions**: One-to-Many (One survey has many questions)
- **Question → QuestionOptions**: One-to-Many (One question has many options)
- **Cascade Delete**: Deleting a survey deletes all its questions and options

## Benefits

### 1. Data Integrity
- Foreign key constraints ensure referential integrity
- Database-level validation
- No orphaned data

### 2. Query Performance
- Indexed relationships for fast lookups
- Can query questions independently
- Better for large datasets

### 3. Flexibility
- Easy to add/modify questions without touching survey data
- Can add new question types easily
- Can reuse questions across surveys (future enhancement)

### 4. Maintainability
- Clear schema structure
- Type-safe with TypeORM entities
- Easy to understand relationships

### 5. Scalability
- Better performance with proper indexing
- Can handle millions of questions efficiently
- Optimized for complex queries

## Migration Steps

### 1. Run Migration
```bash
npm run migration:run
```

This will:
- Create `questions` table
- Create `question_options` table
- Migrate existing JSON data to new tables
- Remove `questions` column from `surveys` table

### 2. Update Service Layer
Update `surveys.service.ts` to handle the new structure:

```typescript
async create(createSurveyDto: CreateSurveyDto) {
  const survey = this.surveyRepository.create({
    title: createSurveyDto.title,
    description: createSurveyDto.description,
    target: createSurveyDto.target,
    deviceType: createSurveyDto.deviceType,
    questions: createSurveyDto.questions.map(q => ({
      questionText: q.questionText,
      type: q.type,
      order: q.order,
      isRequired: q.isRequired,
      options: q.options?.map(o => ({
        optionText: o.optionText,
        order: o.order,
      })),
    })),
  });
  
  return await this.surveyRepository.save(survey);
}
```

### 3. Fetch with Relations
```typescript
async findOne(id: string) {
  return await this.surveyRepository.findOne({
    where: { id },
    relations: ['questions', 'questions.options'],
    order: {
      questions: {
        order: 'ASC',
        options: {
          order: 'ASC',
        },
      },
    },
  });
}
```

## API Request Example

### Before (JSON structure)
```json
{
  "title": "Customer Satisfaction Survey",
  "questions": [
    {
      "question": "How satisfied are you?",
      "questionType": "single_choice",
      "options": ["Very Satisfied", "Satisfied", "Neutral"],
      "isRequired": true,
      "orderIndex": 0
    }
  ]
}
```

### After (Normalized structure)
```json
{
  "title": "Customer Satisfaction Survey",
  "questions": [
    {
      "questionText": "How satisfied are you?",
      "type": "single_choice",
      "order": 0,
      "isRequired": true,
      "options": [
        { "optionText": "Very Satisfied", "order": 0 },
        { "optionText": "Satisfied", "order": 1 },
        { "optionText": "Neutral", "order": 2 }
      ]
    }
  ]
}
```

## Question Types

- `text` - Short text input
- `textarea` - Long text input
- `single_choice` - Radio buttons (requires options)
- `multiple_choice` - Checkboxes (requires options)
- `rating` - Star/number rating
- `date` - Date picker
- `number` - Numeric input

## Rollback

If needed, the migration includes a `down()` method to revert back to JSON structure:

```bash
npm run migration:revert
```

## Next Steps

1. Update `surveys.service.ts` to use new structure
2. Update response DTOs to include nested questions
3. Test all CRUD operations
4. Update frontend to match new API structure
5. Consider adding question templates for reusability
