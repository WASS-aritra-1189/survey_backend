# Survey Master API Documentation

## Overview
The Survey Master module provides APIs for managing surveys with role-based access control. Only users with roles: ROOT, ADMIN, ROOT_STAFF, and STAFF can access these endpoints.

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Survey Master
**POST** `/api/v1/survey-master`

**Roles Required:** ROOT, ADMIN, ROOT_STAFF, STAFF

**Request Body:**
```json
{
  "title": "Customer Satisfaction Survey",
  "description": "Annual customer satisfaction survey",
  "surveyLimit": 100,
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Customer Satisfaction Survey",
  "description": "Annual customer satisfaction survey",
  "surveyLimit": 100,
  "status": "ACTIVE",
  "accountId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "createdBy": "uuid",
  "updatedBy": "uuid"
}
```

### 2. Get All Survey Masters
**GET** `/api/v1/survey-master`

**Roles Required:** ROOT, ADMIN, ROOT_STAFF, STAFF

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `title` (optional): Filter by title (partial match)
- `status` (optional): Filter by status (ACTIVE, INACTIVE, DELETED)
- `accountId` (optional): Filter by account ID

**Example:**
```
GET /api/v1/survey-master?page=1&limit=10&status=ACTIVE
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Customer Satisfaction Survey",
      "description": "Annual customer satisfaction survey",
      "surveyLimit": 100,
      "status": "ACTIVE",
      "accountId": "uuid",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 3. Get Survey Master by ID
**GET** `/api/v1/survey-master/:id`

**Roles Required:** ROOT, ADMIN, ROOT_STAFF, STAFF

**Response:**
```json
{
  "id": "uuid",
  "title": "Customer Satisfaction Survey",
  "description": "Annual customer satisfaction survey",
  "surveyLimit": 100,
  "status": "ACTIVE",
  "accountId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 4. Update Survey Master
**PATCH** `/api/v1/survey-master/:id`

**Roles Required:** ROOT, ADMIN, ROOT_STAFF, STAFF

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Survey Title",
  "description": "Updated description",
  "surveyLimit": 150,
  "status": "INACTIVE"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Survey Title",
  "description": "Updated description",
  "surveyLimit": 150,
  "status": "INACTIVE",
  "accountId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 5. Delete Survey Master
**DELETE** `/api/v1/survey-master/:id`

**Roles Required:** ROOT, ADMIN, ROOT_STAFF, STAFF

**Response:**
```json
{
  "message": "Survey master deleted successfully"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Survey title (max 255 characters) |
| description | string | No | Detailed survey description |
| surveyLimit | number | Yes | Maximum number of survey responses (min: 0) |
| status | enum | No | Survey status: ACTIVE, INACTIVE, DELETED (default: ACTIVE) |
| accountId | uuid | Auto | ID of the account that created the survey |

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Notes
- All timestamps are in ISO 8601 format
- UUIDs are version 4
- Survey limit must be a non-negative integer
- The accountId is automatically set from the authenticated user
