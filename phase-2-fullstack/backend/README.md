# Todo Backend API

This is a secure, JWT-protected FastAPI backend for the Todo application that integrates with the completed Next.js frontend and Better Auth.

## Features

- JWT authentication and authorization using Better Auth tokens
- Secure user isolation - each user can only access their own tasks
- Full CRUD operations for tasks
- Task ordering and completion status management
- RESTful API design with proper error handling

## Prerequisites

- Python 3.11+
- Poetry or pip for dependency management
- PostgreSQL (or Neon Serverless PostgreSQL)

## Setup

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   pip install --upgrade pip
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
   BETTER_AUTH_SECRET=your-secret-key-for-jwt-verification
   FRONTEND_URL=http://localhost:3000  # Origin for CORS
   DEBUG=true  # Set to false for production
   ```

3. Start the development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

## API Endpoints

All API endpoints are protected and require a valid JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Base URL
All API endpoints are prefixed with `/api/{user_id}/` where `user_id` comes from the authenticated JWT.

### Available Endpoints

- `GET /api/{user_id}/tasks` - List all user tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

## Error Handling

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

## Development

For development, run with auto-reload:
```bash
uvicorn main:app --reload
```

The API documentation is available at `/docs` and `/redoc` endpoints when running in debug mode.