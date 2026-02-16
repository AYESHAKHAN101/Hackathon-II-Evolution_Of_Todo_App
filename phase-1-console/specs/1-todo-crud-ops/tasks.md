---
description: "Task list for Phase 1 In-Memory Python Console Todo App"
---

# Tasks: Basic Task CRUD Operations

**Input**: Design documents from `/specs/1-todo-crud-ops/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in src/
- [x] T002 Create src/models/ directory for data models
- [x] T003 Create src/services/ directory for business logic
- [x] T004 Create src/cli/ directory for user interface

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create Task data model in src/models/task.py
- [x] T006 Create in-memory task storage in src/models/task.py
- [x] T007 Create task validation functions in src/models/task.py
- [x] T008 Create task utility functions (get_next_id, find_by_id) in src/models/task.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks with a required title and optional description through a console interface

**Independent Test**: User can successfully add a new task with a valid title and optional description, seeing immediate confirmation with the assigned task ID

### Implementation for User Story 1

- [x] T009 [P] [US1] Create add_task function in src/services/task_operations.py
- [x] T010 [US1] Create get_task_input function in src/services/task_operations.py
- [x] T011 [US1] Implement input validation for task creation in src/services/task_operations.py
- [x] T012 [US1] Create add_task_menu function in src/cli/main.py
- [x] T013 [US1] Test adding tasks with various inputs (valid title, with/without description)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Allow users to see all their existing tasks with their current status in a clear, organized format

**Independent Test**: User can view all existing tasks in a formatted display showing ID, title, completion status, and description

### Implementation for User Story 2

- [x] T014 [P] [US2] Create get_all_tasks function in src/services/task_operations.py
- [x] T015 [US2] Create format_tasks_display function in src/services/task_operations.py
- [x] T016 [US2] Create view_tasks_menu function in src/cli/main.py
- [x] T017 [US2] Implement empty tasks message handling in src/cli/main.py
- [x] T018 [US2] Test viewing tasks with various scenarios (no tasks, multiple tasks)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Allow users to update the completion status of a task to mark it as done or undone

**Independent Test**: User can toggle the completion status of any existing task by providing its ID, seeing immediate feedback of the updated status

### Implementation for User Story 3

- [x] T019 [P] [US3] Create toggle_task_completion function in src/services/task_operations.py
- [x] T020 [US3] Create get_task_by_id function in src/services/task_operations.py
- [x] T021 [US3] Create toggle_completion_menu function in src/cli/main.py
- [x] T022 [US3] Implement ID validation and error handling in src/cli/main.py
- [x] T023 [US3] Test toggling completion status with various scenarios

**Checkpoint**: User Stories 1, 2, and 3 should all work independently

---

## Phase 6: User Story 4 - Update Task Details (Priority: P2)

**Goal**: Allow users to modify the title or description of an existing task

**Independent Test**: User can update the title and/or description of an existing task by providing its ID and new information, seeing before/after preview

### Implementation for User Story 4

- [x] T024 [P] [US4] Create update_task function in src/services/task_operations.py
- [x] T025 [US4] Create get_update_input function in src/services/task_operations.py
- [x] T026 [US4] Create update_task_menu function in src/cli/main.py
- [x] T027 [US4] Implement validation for updated task data in src/services/task_operations.py
- [x] T028 [US4] Test updating tasks with various scenarios

**Checkpoint**: User Stories 1, 2, 3, and 4 should all work independently

---

## Phase 7: User Story 5 - Delete Task (Priority: P3)

**Goal**: Allow users to remove a task from their todo list permanently

**Independent Test**: User can delete an existing task by providing its ID, with optional confirmation, demonstrating that the deletion functionality works independently

### Implementation for User Story 5

- [x] T029 [P] [US5] Create delete_task function in src/services/task_operations.py
- [x] T030 [US5] Create delete_task_menu function in src/cli/main.py
- [x] T031 [US5] Implement confirmation prompt for deletion in src/cli/main.py
- [x] T032 [US5] Test deleting tasks with various scenarios
- [x] T033 [US5] Handle error cases for non-existent tasks

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T034 [P] Create main menu loop in src/cli/main.py
- [x] T035 [P] Implement error handling throughout the application
- [x] T036 Add input validation for all user inputs across all functions
- [x] T037 Create graceful exit functionality in src/cli/main.py
- [x] T038 Add comments referencing task IDs and spec sections throughout code
- [x] T039 Run quickstart validation to ensure all features work together

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- All user stories should be independently testable

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create add_task function in src/services/task_operations.py"
Task: "Create get_task_input function in src/services/task_operations.py"
Task: "Create add_task_menu function in src/cli/main.py"
```

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
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence