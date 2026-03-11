# Survey Response Filtering

## Overview
The Survey Response API supports comprehensive filtering based on survey masters and other criteria.

## Available Filters

### 1. Filter by Single Survey Master
Filter responses submitted by a specific survey master:

```bash
GET /survey-responses?surveyMasterId=uuid-here
```

### 2. Filter by Multiple Survey Masters
Filter responses submitted by multiple survey masters (comma-separated):

```bash
GET /survey-responses?surveyMasterIds=uuid1,uuid2,uuid3
```

### 3. Filter by Survey
Get all responses for a specific survey:

```bash
GET /survey-responses?surveyId=uuid-here
```

### 4. Filter by Respondent Name
Search responses by respondent name (partial match, case-insensitive):

```bash
GET /survey-responses?respondentName=John
```

### 5. Filter by Respondent Contact
Search responses by contact information (partial match, case-insensitive):

```bash
GET /survey-responses?respondentContact=555-1234
```

### 6. Filter by Date Range
Get responses within a specific date range:

```bash
# Responses from a start date
GET /survey-responses?startDate=2025-01-01

# Responses until an end date
GET /survey-responses?endDate=2025-12-31

# Responses within a date range
GET /survey-responses?startDate=2025-01-01&endDate=2025-12-31
```

## Combined Filters

You can combine multiple filters:

```bash
# Responses by specific survey master for a specific survey in date range
GET /survey-responses?surveyMasterId=uuid&surveyId=uuid&startDate=2025-01-01&endDate=2025-12-31

# Responses by multiple survey masters with respondent name search
GET /survey-responses?surveyMasterIds=uuid1,uuid2&respondentName=John

# All filters combined
GET /survey-responses?surveyId=uuid&surveyMasterIds=uuid1,uuid2&respondentName=John&startDate=2025-01-01&endDate=2025-12-31
```

## Pagination

All queries support pagination:

```bash
GET /survey-responses?page=1&limit=20&surveyMasterId=uuid
```

## Sorting

Sort responses by creation or update date:

```bash
# Sort by creation date (newest first)
GET /survey-responses?sortBy=createdAt&sortOrder=DESC

# Sort by update date (oldest first)
GET /survey-responses?sortBy=updatedAt&sortOrder=ASC
```

## Search

Search across respondent name and contact:

```bash
GET /survey-responses?search=John
```

## Role-Based Filtering

### Survey Master Role
- Automatically filters to show only responses for surveys assigned to them
- Can use additional filters within their assigned surveys

### Admin Role
- Can see all responses
- Can filter by any survey master or survey

## Example Use Cases

### 1. Get all responses by a specific survey master
```bash
GET /survey-responses?surveyMasterId=abc-123
```

### 2. Get responses from multiple survey masters for reporting
```bash
GET /survey-responses?surveyMasterIds=abc-123,def-456,ghi-789
```

### 3. Get responses for a survey within a date range
```bash
GET /survey-responses?surveyId=survey-uuid&startDate=2025-01-01&endDate=2025-01-31
```

### 4. Search for responses by respondent
```bash
GET /survey-responses?respondentName=John&respondentContact=555
```

### 5. Get recent responses by multiple masters
```bash
GET /survey-responses?surveyMasterIds=uuid1,uuid2&startDate=2025-02-01&sortBy=createdAt&sortOrder=DESC&limit=50
```

## Response Format

```json
{
  "data": [
    {
      "id": "response-uuid",
      "surveyId": "survey-uuid",
      "surveyMasterId": "master-uuid",
      "responses": [...],
      "respondentName": "John Doe",
      "respondentContact": "555-1234",
      "createdAt": "2025-02-28T10:00:00Z",
      "updatedAt": "2025-02-28T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## Notes

- All UUID filters must be valid UUIDs
- Date filters accept ISO 8601 format (YYYY-MM-DD)
- Text searches are case-insensitive and support partial matching
- Multiple survey master IDs can be provided as comma-separated values
- Caching is enabled for 2 minutes to improve performance
