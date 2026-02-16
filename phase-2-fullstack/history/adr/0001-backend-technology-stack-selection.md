# ADR-0001: Backend Technology Stack Selection

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Backend Stack" not separate ADRs for framework, ORM, authentication).

- **Status:** Accepted
- **Date:** 2026-02-05
- **Feature:** 001-backend-fastapi-todo
- **Context:** Need to establish a robust, secure, and performant backend architecture that integrates with the existing Next.js frontend and Better Auth for a Todo application. The backend must provide JWT-protected endpoints with strict user isolation and support full task CRUD operations with position-based ordering.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

Selected integrated backend technology stack:

- Framework: FastAPI 0.104+ (Python 3.11+)
- ORM: SQLModel 0.0.16+ with async support
- Database: Neon Serverless PostgreSQL
- Authentication: JWT verification using python-jose
- Configuration: python-dotenv for environment management
- Server: uvicorn for ASGI
- Security: CORS middleware with specific frontend origin
- Error Handling: Standardized error response format

## Consequences

### Positive

- FastAPI provides excellent performance, automatic API documentation (Swagger/OpenAPI), and built-in validation with Pydantic
- SQLModel combines SQLAlchemy power with Pydantic validation, offering type safety and compatibility with SQLAlchemy ecosystem
- Async support enables high concurrency and better performance under load
- JWT tokens issued by Better Auth can be securely verified server-side
- Automatic API documentation generation reduces maintenance overhead
- Strong type safety with Python 3.11+ and Pydantic models
- Neon Serverless PostgreSQL provides auto-scaling and serverless benefits

### Negative

- Learning curve for team members unfamiliar with FastAPI or async Python
- Potential vendor lock-in with Neon PostgreSQL specific features
- Additional complexity of managing JWT lifecycle and security concerns
- Dependency on multiple libraries increasing attack surface
- Possible performance overhead from ORM compared to raw SQL

## Alternatives Considered

Alternative Stack A: Flask + SQLAlchemy + traditional authentication
- Rejected: Would lack FastAPI's automatic documentation and async performance benefits

Alternative Stack B: Django + DRF + Session authentication
- Rejected: Would not integrate as well with existing JWT infrastructure from Better Auth

Alternative Stack C: Pure SQLAlchemy + manual validation
- Rejected: Would lose the benefits of Pydantic validation and FastAPI integration

Alternative Stack D: Tortoise ORM + FastAPI
- Rejected: SQLModel was preferred for its closer alignment with SQLAlchemy ecosystem and Pydantic validation

## References

- Feature Spec: /specs/001-backend-fastapi-todo/spec.md
- Implementation Plan: /specs/001-backend-fastapi-todo/plan.md
- Related ADRs: None
- Evaluator Evidence: /specs/001-backend-fastapi-todo/research.md
