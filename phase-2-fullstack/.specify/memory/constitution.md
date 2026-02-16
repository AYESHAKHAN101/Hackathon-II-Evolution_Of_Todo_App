<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.0 (no semantic changes, just populating template)
- Modified principles: All template principles replaced with actual Hackathon Todo Platform principles
- Added sections: Purpose & Scope, Technology Constraints, Repository Governance, Specification Rules, Agent Constitution, API & Data Contracts, Authentication Rules, Quality & Review Gates, Prohibited Actions, Final Authority
- Removed sections: None (replaced template content)
- Templates requiring updates: ✅ updated / ⚠ pending: None required
- Follow-up TODOs: None
-->
# Hackathon Todo Platform Constitution

## Core Principles

### I. Specs First
No implementation may begin without an approved specification. Specifications are the single source of truth.

### II. Single Responsibility
Each agent owns one clearly defined domain. Agents must not overlap responsibilities.

### III. Minimal but Complete
No over-engineering. No premature optimization. Every feature must be demo-ready.

### IV. Deterministic Output
Identical specs must always produce identical results. No randomness in architecture or APIs.

### V. Hackathon Readiness
The system must be easy to explain, deploy, and demonstrate.

## Technology Constraints
All work must comply with these mandatory technology requirements:

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth |
| Spec System | Spec-Kit Plus |
| AI Tooling | Claude Code |

No alternative technologies may be introduced without updating specs and this constitution.

## Repository Governance

### Monorepo Structure
- The repository structure defined in the project root is authoritative.
- No files or folders may be added outside the approved structure.

### Folder Ownership

| Folder | Responsible Agent |
|------|------------------|
| `specs/` | Spec Agent |
| `agents/` | Spec Agent |
| `backend/` | Backend Agent |
| `frontend/` | Frontend Agent |
| `auth/` | Auth Agent |
| Integration logic | Integration Agent |
| Testing & validation | QA Agent |

## Specification Rules

1. All specifications must:
   - Be written in Markdown
   - Use clear section headings
   - Describe behavior, not implementation

2. Specifications must exist for:
   - Features
   - APIs
   - Database schema
   - UI pages and components
   - Authentication flows

3. Once implementation begins, specs may not change without explicit revision.

## Agent Constitution

### Spec Agent
- Owns all files under `specs/`
- Ensures completeness and consistency
- Resolves conflicts between specifications

### Backend Agent
- Implements FastAPI backend strictly from specs
- No frontend assumptions
- No UI or presentation logic

### Frontend Agent
- Implements UI strictly from UI specs
- No backend logic assumptions
- Uses typed API contracts

### Auth Agent
- Owns authentication flows
- Integrates Better Auth
- Ensures secure session handling

### Integration Agent
- Connects frontend, backend, and auth
- Ensures contract consistency
- Manages environment configuration

### QA Agent
- Verifies implementation against specs
- Tests critical user flows
- Flags missing or conflicting specifications

## API & Data Contracts

- APIs must be RESTful
- All endpoints must be defined in `specs/api/rest-endpoints.md`
- Database schema must be finalized before ORM models
- No implicit or undocumented behavior is allowed

## Authentication Rules

- Authentication is required for all task operations
- Anonymous access is prohibited except for auth endpoints
- Authentication logic must remain isolated from business logic

## Quality & Review Gates

Before any phase is considered complete:

- Specifications are reviewed and approved
- Implementation matches specs exactly
- No unused files or dead code
- Project builds without errors
- End-to-end demo flow works

## Prohibited Actions

- Implementing without specifications
- Modifying repository structure arbitrarily
- Mixing frontend and backend responsibilities
- Adding features outside approved scope
- Skipping authentication requirements

Any violation invalidates the implementation.

## Final Authority

In case of conflict:

- Code vs Specs → **Specs win**
- Agent vs Constitution → **Constitution wins**
- Speed vs Clarity → **Clarity wins**

This document is the **final authority** for the project.

**Version**: 1.0.0 | **Ratified**: 2026-02-05 | **Last Amended**: 2026-02-05
