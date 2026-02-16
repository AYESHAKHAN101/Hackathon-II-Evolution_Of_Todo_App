---
description: "Task list for backend FastAPI Todo application implementation"
---

# Tasks: Backend for Todo Application with FastAPI

**Input**: Design documents from `/specs/001-backend-fastapi-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend project**: `backend/` directory structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure per implementation plan
- [X] T002 Initialize Python project with FastAPI dependencies in backend/
- [X] T003 [P] Create requirements.txt with FastAPI, SQLModel, psycopg, python-jose, python-dotenv, uvicorn

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup database connection and session management in backend/db.py
- [X] T005 [P] Implement JWT verification utilities in backend/auth.py
- [X] T006 [P] Setup settings and environment configuration in backend/settings.py
- [X] T007 Create Task model in backend/models.py
- [X] T008 Create Pydantic schemas for request/response in backend/schemas.py
- [X] T009 Setup main FastAPI application with CORS in backend/main.py
- [X] T010 Create authentication middleware in backend/middleware/auth_middleware.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Task Management (Priority: P1) 🎯 MVP

**Goal**: Implement core task CRUD operations with JWT authentication and user isolation so users can manage their tasks securely

**Independent Test**: A user with a valid JWT token can perform all CRUD operations on their own tasks, with the system correctly rejecting attempts to access other users' data.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create Task CRUD service in backend/services/task_service.py
- [X] T012 [US1] Implement GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [X] T013 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [X] T014 [US1] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [X] T015 [US1] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [X] T016 [US1] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - JWT Authentication Validation (Priority: P1)

**Goal**: Implement robust JWT token validation to ensure only authenticated users can access API endpoints and data remains secure

**Independent Test**: The system correctly validates JWT tokens issued by Better Auth, rejecting invalid, expired, or malformed tokens.

### Implementation for User Story 2

- [X] T017 [P] [US2] Enhance JWT verification to validate token expiration in backend/auth.py
- [X] T018 [US2] Implement user isolation validation to ensure user_id from JWT matches request in backend/middleware/auth_middleware.py
- [X] T019 [US2] Add comprehensive error handling for authentication failures in backend/auth.py
- [X] T020 [US2] Implement 401 Unauthorized responses for invalid/expired tokens
- [X] T021 [US2] Implement 403 Forbidden responses for cross-user access attempts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Task Ordering and State Management (Priority: P2)

**Goal**: Enable task ordering by position and atomic completion state toggling to enhance user experience with better task organization

**Independent Test**: Users can reorder tasks by position and toggle completion status with atomic operations that maintain data consistency.

### Implementation for User Story 3

- [X] T022 [P] [US3] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/routes/tasks.py
- [X] T023 [US3] Enhance Task service with completion toggle functionality in backend/services/task_service.py
- [X] T024 [US3] Add support for position-based ordering in task listing in backend/services/task_service.py
- [X] T025 [US3] Implement validation for position field in backend/schemas.py
- [X] T026 [US3] Update database models with proper indexing for position field in backend/models.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 [P] Add proper error response format per API contracts in backend/utils/error_handlers.py
- [X] T028 Create README.md with setup instructions for backend/
- [X] T029 Add CLAUDE.md with development guidelines for backend/
- [X] T030 [P] Add proper logging throughout the application
- [X] T031 Add health check endpoint in backend/main.py
- [X] T032 Add input validation and sanitization across all endpoints
- [ ] T033 Run quickstart validation to ensure everything works as expected

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence