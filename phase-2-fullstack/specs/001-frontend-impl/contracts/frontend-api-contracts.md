# Frontend API Contracts: Todo Application

## Overview
This document defines the API contracts between the frontend and backend for the Todo application. The frontend communicates with the backend using JWT-authenticated requests.

## Authentication Endpoints
All authentication-related endpoints are accessible without JWT tokens.

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 1800
}
```

### POST /api/auth/signin
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "lastLoginAt": "2023-01-01T00:00:00Z"
  },
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 1800
}
```

### POST /api/auth/signout
Logout the current user.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true
}
```

### POST /api/auth/forgot-password
Initiate password reset process.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

## Task Management Endpoints
All task endpoints require JWT authentication.

### GET /api/users/{userId}/tasks
Retrieve all tasks for the authenticated user with optional filtering.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `completed`: boolean - Filter by completion status (true/false)
- `orderBy`: string - Order by field (position, createdAt, updatedAt)
- `orderDirection`: string - Sort direction (asc, desc)
- `limit`: number - Limit number of results
- `page`: number - Page number for pagination

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "title": "Complete project",
      "description": "Finish the frontend implementation",
      "completed": false,
      "position": 1,
      "userId": "user-uuid",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "totalCount": 1,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

### POST /api/users/{userId}/tasks
Create a new task for the authenticated user.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description (optional)",
  "position": 1
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid-string",
    "title": "New task",
    "description": "Task description (optional)",
    "completed": false,
    "position": 1,
    "userId": "user-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### PUT /api/users/{userId}/tasks/{taskId}
Update an existing task.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "position": 2
}
```

**Response:**
```json
{
  "data": {
    "id": "task-uuid",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "position": 2,
    "userId": "user-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T01:00:00Z",
    "completedAt": "2023-01-01T01:00:00Z"
  }
}
```

### DELETE /api/users/{userId}/tasks/{taskId}
Delete a task.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true
}
```

### PATCH /api/users/{userId}/tasks/{taskId}/toggle-complete
Toggle the completion status of a task.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": {
    "id": "task-uuid",
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "position": 1,
    "userId": "user-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T01:00:00Z",
    "completedAt": "2023-01-01T01:00:00Z"
  }
}
```

## Error Responses
All endpoints may return error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED`: Invalid or missing JWT token
- `FORBIDDEN`: Attempting to access another user's data
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Requested resource does not exist
- `INTERNAL_ERROR`: Unexpected server error

## Headers
All authenticated requests must include:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Client Implementation Notes
- The frontend client in `/lib/api.ts` should automatically include the Authorization header
- 401 Unauthorized responses should trigger a redirect to `/login`
- API errors should be handled gracefully with user-friendly messages
- Loading states should be shown during API requests
- Optimistic UI updates should be implemented for better UX