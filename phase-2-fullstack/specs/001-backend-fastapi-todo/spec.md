# Feature Specification: Backend for Todo Application with FastAPI

**Feature Branch**: `001-backend-fastapi-todo`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "/sp.specify

Role: You are a senior backend engineer implementing the backend for a hackathon-grade full-stack Todo application.

The frontend is COMPLETE and MUST NOT be modified.

Your responsibility is to implement a secure, production-ready FastAPI backend that integrates seamlessly with the existing Next.js frontend and Better Auth–issued JWT tokens.

---

## Scope
Backend implementation only (`/backend` directory)

---

## Technology
- FastAPI
- SQLModel
- Neon Serverless PostgreSQL
- JWT verification (Better Auth compatible)

---

## Core Principles
- Stateless authentication using JWT
- Strong user isolation
- RESTful API design
- Frontend-first compatibility
- No duplicated auth logic

---

## Authentication & Security
- Do NOT implement signup, login, or session creation
- Assume JWT tokens are issued by the frontend (Better Auth)
- Every request MUST:
  - Read `Authorization: Bearer <JWT>`
  - Verify signature using `BETTER_AUTH_SECRET`
  - Decode `user_id`, `email`, and `exp`
- Reject unauthenticated or expired tokens with HTTP 401
- Reject cross-user access with HTTP 403
- Never trust user_id from request body

---

## Database
- Use SQLModel ORM
- Connection via `DATABASE_URL`
- Models:

### Task
- id (int, PK)
- user_id (string, indexed)
- title (string, required)
- description (text, optional)
- completed (boolean, default false)
- position (integer, for ordering)
- created_at (timestamp)
- updated_at (timestamp)

---

## API Contract
All routes:
- Require valid JWT
- Use `user_id` from decoded token
- Enforce ownership on every query

### Endpoints
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

---

## Frontend Integration (Critical)
- Backend responses must match frontend expectations exactly
- JSON response format only
- Proper HTTP status codes
- CORS enabled for frontend origin
- Backend must work without requiring any frontend changes
- JWT is the single source of truth for user identity

---

## Behavior Rules
- Each user can only access their own tasks
- Tasks are ordered using `position`
- Completion toggle must be atomic
- All list queries must be filtered by authenticated user

---

## Error Handling
- 401: Missing or invalid JWT
- 403: Accessing another user's data
- 404: Resource not found
- 422: Validation errors

---

## Project Structure
backend/
├── main.py          # App entry point
├── db.py            # Database connection
├── models.py        # SQLModel models
├── auth.py          # JWT verification utilities
├── routes/
│   └── tasks.py     # Task CRUD routes
├── requirements.txt
└── CLAUDE.md

---

## Constraints
- No frontend edits
- No session storage
- No shared auth database
- JWT verification only
- Follow REST best practices strictly

---

## Output Expectation
- Fully functional FastAPI backend
- Secure JWT-protected API
- Clean separation of concerns
- Ready to run with:
  uvicorn main:app --reload --port 8000"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Management (Priority: P1)

As an authenticated user with a valid JWT token, I want to manage my tasks through a secure API so that I can create, read, update, delete, and mark tasks as complete. The system must verify my identity through the JWT token and ensure I can only access my own tasks.

**Why this priority**: This is the core functionality that enables the frontend to interact with the backend for task management, which is the primary purpose of the application.

**Independent Test**: A user with a valid JWT token can perform all CRUD operations on their own tasks, with the system correctly rejecting attempts to access other users' data.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with a valid JWT token, **When** I make API requests to the task endpoints, **Then** I can only access, modify, or delete tasks belonging to my user_id
2. **Given** I have a valid JWT token, **When** I try to access another user's tasks, **Then** the system returns HTTP 403 Forbidden
3. **Given** I have an expired or invalid JWT token, **When** I make API requests, **Then** the system returns HTTP 401 Unauthorized

---

### User Story 2 - JWT Authentication Validation (Priority: P1)

As a system, I need to validate incoming JWT tokens from Better Auth so that only authenticated users can access the API endpoints and data remains secure.

**Why this priority**: Without proper JWT validation, the entire security model of the application is compromised, making all other functionality insecure.

**Independent Test**: The system correctly validates JWT tokens issued by Better Auth, rejecting invalid, expired, or malformed tokens.

**Acceptance Scenarios**:

1. **Given** a valid JWT token from Better Auth, **When** a request is made to any protected endpoint, **Then** the request is processed successfully
2. **Given** an expired JWT token, **When** a request is made to any protected endpoint, **Then** the system returns HTTP 401 Unauthorized
3. **Given** a malformed or invalid JWT token, **When** a request is made to any protected endpoint, **Then** the system returns HTTP 401 Unauthorized

---

### User Story 3 - Task Ordering and State Management (Priority: P2)

As a user, I want to be able to order my tasks by position and toggle their completion state atomically so that I can organize my tasks effectively and track my progress.

**Why this priority**: This provides the advanced functionality that enhances the user experience beyond basic CRUD operations, allowing for better task organization and management.

**Independent Test**: Users can reorder tasks by position and toggle completion status with atomic operations that maintain data consistency.

**Acceptance Scenarios**:

1. **Given** I have multiple tasks, **When** I update their positions, **Then** the tasks are returned in the correct order
2. **Given** I have an incomplete task, **When** I toggle its completion status, **Then** the task is marked as completed and the change is persisted
3. **Given** I have a completed task, **When** I toggle its completion status, **Then** the task is marked as incomplete and the change is persisted

---

### Edge Cases

- What happens when a user tries to access tasks with an invalid user_id in the URL that doesn't match their JWT token?
- How does the system handle database connection failures during API requests?
- What happens when a JWT token has expired during a long-running request?
- How does the system handle requests with missing Authorization headers?
- What occurs when a user attempts to modify another user's task ID but with their own user_id in the URL?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify JWT tokens in Authorization header using BETTER_AUTH_SECRET
- **FR-002**: System MUST reject requests without valid Authorization: Bearer <JWT> header with HTTP 401
- **FR-003**: System MUST decode user_id from JWT token and use it for all operations instead of user_id from request
- **FR-004**: System MUST ensure users can only access/modify/delete tasks belonging to their user_id from JWT
- **FR-005**: System MUST return HTTP 403 when a user tries to access another user's data
- **FR-006**: System MUST return HTTP 404 when requested resources don't exist
- **FR-007**: Users MUST be able to create tasks via POST /api/{user_id}/tasks with title and optional description
- **FR-008**: Users MUST be able to retrieve all their tasks via GET /api/{user_id}/tasks
- **FR-009**: Users MUST be able to retrieve a specific task via GET /api/{user_id}/tasks/{id}
- **FR-010**: Users MUST be able to update tasks via PUT /api/{user_id}/tasks/{id}
- **FR-011**: Users MUST be able to delete tasks via DELETE /api/{user_id}/tasks/{id}
- **FR-012**: Users MUST be able to toggle task completion via PATCH /api/{user_id}/tasks/{id}/complete
- **FR-013**: System MUST maintain task ordering using the position field in ascending order
- **FR-014**: System MUST validate task data (title required, proper length limits) with HTTP 422 for invalid data
- **FR-015**: System MUST use SQLModel ORM for database operations with Neon Serverless PostgreSQL
- **FR-016**: System MUST return appropriate JSON responses that match frontend expectations
- **FR-017**: System MUST support CORS for the frontend origin
- **FR-018**: System MUST generate proper timestamps for created_at and updated_at fields

### Key Entities

- **Task**: Represents a user's todo item with id, user_id (string), title, description, completed status, position for ordering, and timestamps for creation/update. The user_id links the task to the authenticated user, and all access is validated against the JWT token's user_id.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API responds to authenticated requests within 500ms under normal load conditions
- **SC-002**: 100% of cross-user access attempts are correctly rejected with HTTP 403
- **SC-003**: 100% of invalid/expired JWT tokens are correctly rejected with HTTP 401
- **SC-004**: All task CRUD operations maintain data integrity and user isolation without exceptions
- **SC-005**: Backend API endpoints match frontend integration requirements with 100% compatibility
- **SC-006**: Database operations achieve 99% uptime during testing period
- **SC-007**: Task ordering and completion toggles execute atomically without race conditions
- **SC-008**: System handles 100 concurrent users performing task operations without errors
