# Backend Development Guidelines

This document provides guidelines for developing and maintaining the Todo Backend API.

## Architecture

The backend follows a service-oriented architecture with the following layers:

- **API Layer** (`routes/`): Handles HTTP requests/responses and authentication
- **Service Layer** (`services/`): Contains business logic and orchestrates data operations
- **Data Layer** (`models.py`, `db.py`): Manages data persistence and relationships
- **Configuration** (`settings.py`, `auth.py`): Handles settings and authentication logic

## Code Style

- Follow PEP 8 style guide
- Use type hints for all function parameters and return values
- Write descriptive function and variable names
- Keep functions small and focused on a single responsibility

## Error Handling

- Use HTTPException with appropriate status codes
- Return consistent error responses following the format:
  ```json
  {
    "detail": {
      "code": "ERROR_CODE",
      "message": "Human-readable error message",
      "details": {}
    }
  }
  ```

## Security Best Practices

- All endpoints must validate JWT tokens
- Implement user isolation - users can only access their own data
- Validate all input parameters
- Use parameterized queries to prevent SQL injection

## Testing

- Write unit tests for service layer functions
- Write integration tests for API endpoints
- Use pytest for testing framework

## API Documentation

- Document all endpoints with FastAPI's built-in documentation
- Include request/response schemas
- Specify error responses for each endpoint

## Dependency Management

- Use `requirements.txt` for Python dependencies
- Pin dependency versions for reproducible builds
- Update dependencies regularly and test for compatibility

## Logging

- Use Python's standard logging module
- Log important events and errors
- Include relevant context information in logs
- Respect privacy and don't log sensitive data