---
id: "0001"
title: "Backend API Specification"
stage: spec
date: 2026-02-05
surface: feature-development
model: claude-sonnet-4-5-20250929
feature: 001-backend-fastapi-todo
branch: 001-backend-fastapi-todo
user: user
command: /sp.specify
labels: [backend, fastapi, todo, specification, authentication, api]
links:
  spec: ../../specs/001-backend-fastapi-todo/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/001-backend-fastapi-todo/spec.md
    action: created
    description: Complete backend API specification with user stories, requirements, and success criteria
  - path: specs/001-backend-fastapi-todo/checklists/requirements.md
    action: created
    description: Quality checklist for specification validation
tests:
  - type: validation
    description: Specification quality checklist validation
    result: passed
---

## Prompt

 /sp.specify

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
  uvicorn main:app --reload --port 8000

## Response snapshot

Successfully created a comprehensive specification for the backend Todo application API. The specification includes:

1. **User Stories**: Three prioritized user stories covering core functionality (secure task management, JWT validation, and task ordering/state management)
2. **Functional Requirements**: 18 specific requirements detailing JWT validation, user isolation, API endpoints, data validation, and security measures
3. **Key Entities**: Task entity with attributes and relationships defined
4. **Success Criteria**: 8 measurable outcomes for performance, security, compatibility, and reliability
5. **Edge Cases**: 5 potential edge cases for security and error handling

The specification follows all requirements with no implementation details leaking into the specification and all acceptance criteria clearly defined.

## Outcome

- ✅ Impact: Complete backend API specification ready for development
- 🧪 Tests: Specification quality checklist validation passed
- 📁 Files: 2 files created (spec.md, requirements.md)
- 🔁 Next prompts: Ready for /sp.plan to begin technical planning
- 🧠 Reflection: Specification provides clear guidance for secure JWT-based API implementation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Specification quality validation - PASS
- Prompt variant (if applicable): Standard /sp.specify workflow
- Next experiment (smallest change to try): Proceed to planning phase with /sp.plan
