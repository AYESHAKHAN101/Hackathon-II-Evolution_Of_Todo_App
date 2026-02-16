---
id: "0003"
title: "Frontend Implementation Plan"
stage: plan
date: 2026-02-05
surface: feature-development
model: claude-sonnet-4-5-20250929
feature: 001-frontend-impl
branch: 001-frontend-impl
user: user
command: /sp.plan
labels: [frontend, authentication, tasks, planning, architecture]
links:
  spec: ../../specs/001-frontend-impl/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/001-frontend-impl/plan.md
    action: created
    description: Implementation plan with technical context, architecture decisions
  - path: specs/001-frontend-impl/research.md
    action: created
    description: Research findings for technology decisions
  - path: specs/001-frontend-impl/data-model.md
    action: created
    description: Data model definitions for frontend entities
  - path: specs/001-frontend-impl/contracts/frontend-api-contracts.md
    action: created
    description: API contract definitions for frontend-backend communication
  - path: specs/001-frontend-impl/quickstart.md
    action: created
    description: Quickstart guide for setting up the frontend
tests:
  - type: constitution-check
    description: Compliance with project constitution
    result: passed
---

## Prompt

# /sp.plan — Frontend (Phase II)

## Objective
Implement the **frontend** for the Todo Full-Stack Web Application using **Next.js 16 (App Router)** with **JWT-based authentication via Better Auth**, following the approved `/sp.specify`.

---

## Phase Breakdown

### Phase 1 — Project Initialization
- Initialize Next.js App Router project
- Configure TypeScript and Tailwind CSS
- Create base folder structure:
  - `app/`
  - `components/`
  - `lib/`
- Add `frontend/CLAUDE.md` with frontend rules

---

### Phase 2 — Authentication Setup
- Integrate **Better Auth** on frontend
- Enable **JWT token issuance**
- Store JWT securely (browser storage)
- Implement:
  - Signup page
  - Login page
  - Logout flow
- Redirect unauthenticated users to `/login`

---

### Phase 3 — Auth State & Route Protection
- Create auth utilities in `/lib/auth.ts`
- Implement global route protection using:
  - `middleware.ts`
- Enforce:
  - Protected routes require valid JWT
  - Public routes accessible without auth

---

### Phase 4 — API Client Integration
- Implement centralized API client in `/lib/api.ts`
- Attach JWT to all requests:

Authorization: Bearer <token>
- Handle global errors:
- 401 → redirect to login
- Network/API failures → UI feedback

---

### Phase 5 — Task Management UI
- Implement task pages:
- Task list view
- Create task form
- Edit task page
- Support:
- Create
- Read
- Update
- Delete
- Toggle completion
- Use optimistic UI updates

---

### Phase 6 — UI & UX Refinement
- Apply professional UI patterns:
- Card-based layouts
- Clear CTAs
- Consistent spacing and typography
- Ensure responsiveness (mobile → desktop)
- Add loading, empty, and error states

---

### Phase 7 — Validation & Hardening
- Ensure JWT is attached to **every** API call
- Confirm users only see their own tasks
- Remove hardcoded values and secrets
- Verify no console or runtime errors

---

## Constraints
- Frontend only (no backend edits)
- No manual coding
- Follow Next.js App Router best practices
- Use Tailwind CSS exclusively
- Server Components by default

---

## Completion Criteria
- Auth flow works end-to-end
- All task CRUD operations functional
- JWT-secured API communication
- Protected routes enforced
- UI is clean, responsive, and demo-ready

---

## Claude Code Instructions
- Follow `/sp.specify` strictly
- Read `CLAUDE.md` and `frontend/CLAUDE.md`
- Do not invent APIs or behavior
- Implement only what is specified

---

## Response snapshot

Successfully completed the implementation planning for the frontend Todo application. The plan includes:

1. **Technical Context**: Defined TypeScript 5.0+, Next.js 16+, Better Auth, Tailwind CSS, and JWT-based authentication
2. **Constitution Check**: Verified compliance with project requirements and technology stack
3. **Project Structure**: Detailed the Next.js App Router structure with proper routing and component organization
4. **Research Findings**: Documented decisions on authentication patterns, API clients, route protection, and UI components
5. **Data Model**: Created entity definitions for User, Task, and Session with validation rules
6. **API Contracts**: Defined complete API contracts for authentication and task management
7. **Quickstart Guide**: Provided setup instructions and development workflow

The plan adheres to all constitutional requirements and is ready for the next phase of implementation.

## Outcome

- ✅ Impact: Complete frontend architecture plan ready for implementation
- 🧪 Tests: Constitution compliance check passed
- 📁 Files: 5 files created (plan.md, research.md, data-model.md, contracts/, quickstart.md)
- 🔁 Next prompts: Ready for /sp.tasks to break down implementation into tasks
- 🧠 Reflection: Plan covers all frontend requirements from spec with proper architecture

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution compliance - PASS
- Prompt variant (if applicable): Standard /sp.plan workflow
- Next experiment (smallest change to try): Proceed to task breakdown with /sp.tasks
