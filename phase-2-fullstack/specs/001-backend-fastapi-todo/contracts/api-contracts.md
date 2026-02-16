# API Contracts: Backend for Todo Application

## Overview
This document defines the REST API contracts for the Todo application backend. The backend provides JWT-protected endpoints that ensure user isolation, allowing each user to access only their own tasks.

## Authentication
All endpoints (except health check) require JWT authentication in the format:
```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token is issued by Better Auth and must contain:
- `user_id`: The user's unique identifier
- `email`: The user's email address
- `exp`: Token expiration timestamp

## Error Response Format
All error responses follow the same format:
```json
{
  "detail": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: 401 - Invalid or expired JWT token
- `FORBIDDEN`: 403 - Attempting to access another user's data
- `NOT_FOUND`: 404 - Requested resource does not exist
- `VALIDATION_ERROR`: 422 - Request validation failed

## Endpoints

### Health Check
#### GET /health
Health check endpoint for monitoring.

**Response: 200 OK**
```json
{
  "status": "healthy"
}
```

### Task Operations

#### GET /api/{user_id}/tasks
Retrieve all tasks for the authenticated user with optional filtering.

**Path Parameters:**
- `user_id`: The user ID from the JWT token (for route matching)

**Query Parameters:**
- `completed`: boolean - Filter by completion status (true/false)
- `limit`: integer - Limit number of results (default: 100, max: 1000)
- `offset`: integer - Offset for pagination
- `orderBy`: string - Field to order by (position, createdAt, updatedAt)
- `orderDirection`: string - Direction of ordering (asc, desc)

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": "user-uuid-string",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "position": 1,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 100,
    "offset": 0,
    "has_more": false
  }
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden (user_id mismatch)

#### POST /api/{user_id}/tasks
Create a new task for the authenticated user.

**Path Parameters:**
- `user_id`: The user ID from the JWT token

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description (optional)",
  "position": 1
}
```

**Validation:**
- `title` is required (1-255 chars)
- `description` is optional (0-1000 chars)
- `position` is optional (defaults to next available position)

**Response: 201 Created**
```json
{
  "id": 1,
  "user_id": "user-uuid-string",
  "title": "New task",
  "description": "Task description (optional)",
  "completed": false,
  "position": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 422: Validation Error

#### GET /api/{user_id}/tasks/{id}
Retrieve a specific task for the authenticated user.

**Path Parameters:**
- `user_id`: The user ID from the JWT token
- `id`: Task ID

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response: 200 OK**
```json
{
  "id": 1,
  "user_id": "user-uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "position": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

#### PUT /api/{user_id}/tasks/{id}
Update an existing task for the authenticated user.

**Path Parameters:**
- `user_id`: The user ID from the JWT token
- `id`: Task ID

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description (optional)",
  "completed": true,
  "position": 2
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "user_id": "user-uuid-string",
  "title": "Updated task title",
  "description": "Updated description (optional)",
  "completed": true,
  "position": 2,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T01:00:00Z"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error

#### DELETE /api/{user_id}/tasks/{id}
Delete a specific task for the authenticated user.

**Path Parameters:**
- `user_id`: The user ID from the JWT token
- `id`: Task ID

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response: 204 No Content**

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

#### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a task.

**Path Parameters:**
- `user_id`: The user ID from the JWT token
- `id`: Task ID

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response: 200 OK**
```json
{
  "id": 1,
  "user_id": "user-uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "position": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T01:00:00Z"
}
```

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

## Security Considerations
- All endpoints require valid JWT tokens
- User ID in the URL must match the user ID in the JWT token
- Users can only access their own tasks
- Request bodies are validated to prevent injection attacks
- All database queries are parameterized to prevent SQL injection

## Performance Guidelines
- Implement proper indexing on user_id and position fields
- Use pagination for list endpoints
- Implement efficient database queries to minimize response times
- Cache frequently accessed data where appropriate