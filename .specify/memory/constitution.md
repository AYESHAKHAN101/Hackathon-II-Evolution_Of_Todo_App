<!-- Sync Impact Report:
Version change: N/A -> 1.0.0
Added sections: Core Principles, Tech Stack Constraints, Feature Progression Constraints, Security and Compliance Non-Negotiables, Development Workflow Non-Negotiables, Performance Expectations, Allowed Patterns
Modified principles: None (new constitution)
Templates requiring updates: N/A (new file)
Follow-up TODOs: None
-->

# Hackathon II - The Evolution of Todo Constitution

## Core Principles

### AI-Native and Spec-Driven Development
The project emphasizes shifting from manual syntax writing to system architecture. All code must be generated via Claude Code based on refined specs. No manual coding is allowed—refine specs until outputs are correct. Use the Agentic Dev Stack: AGENTS.md + Spec-Kit Plus + Claude Code.

### Iterative Evolution
Each phase builds on the previous, simulating real-world software growth from CLI to cloud-native AI systems. Reuse intelligence (e.g., subagents, skills) where possible to promote efficiency.

### Reusable Intelligence
Incorporate agent skills and subagents for modularity. Aim for bonus points by creating reusable components like Cloud-Native Blueprints.

### User-Centric Design
Focus on practical, polished features. The app must handle user errors gracefully, provide clear feedback, and support natural interactions (e.g., conversational AI in later phases).

### Clean Code and Best Practices
Follow PEP 8 for Python, ESLint/Prettier for JS/TS, single responsibility principle, and modular design. Include comments linking code to specs/tasks.

### Security First
Enforce authentication, data isolation, and secure practices (e.g., JWT for auth, secrets management in deployments).

### Performance and Scalability
Prioritize efficient in-memory operations in early phases, transitioning to persistent, distributed systems. Use event-driven architecture where applicable.

### Open-Source Mindset
All code in public GitHub repos with clear documentation (README.md, CLAUDE.md).

## Tech Stack Constraints

### Overall:
- Spec-Driven Tools: Claude Code, Spec-Kit Plus (for specs, plans, tasks).
- Package Manager: UV for Python environments.
- Python: 3.13+ (pure Python where possible; minimal deps).

### Phase I: In-Memory Python Console App
- Storage: In-memory (e.g., lists/dicts); no persistence.
- Features: Basic CRUD (Add, Delete, Update, View, Mark Complete) with title, description, and status.
- Constraints: No external deps; CLI via input()/print().

### Phase II: Full-Stack Web Application
- Frontend: Next.js 16+ (App Router), responsive UI.
- Backend: FastAPI (RESTful APIs).
- ORM/Database: SQLModel + Neon Serverless PostgreSQL (persistent storage).
- Auth: Better Auth (JWT tokens for user isolation; shared secret via env var).
- Features: Basic CRUD as web app; multi-user with auth.
- Constraints: Monorepo structure; filter data by user_id.

### Phase III: AI-Powered Todo Chatbot
- AI: OpenAI ChatKit (UI), OpenAI Agents SDK, Official MCP SDK (conversational interface).
- Features: Natural language task management (e.g., "Reschedule meetings"); integrate with Phase II backend.
- Constraints: Handle Intermediate features (priorities/tags, search/filter, sort) if time allows; support bonuses like Urdu/multi-lang.

### Phase IV: Local Kubernetes Deployment
- Containerization: Docker.
- Orchestration: Minikube, Helm Charts.
- AIOps: kubectl-ai, kagent.
- Features: Deploy chatbot; add Advanced features (recurring tasks, due dates/reminders).
- Constraints: Local-only; use Cloud-Native Blueprints for spec-driven deployment.

### Phase V: Advanced Cloud Deployment
- Cloud: DigitalOcean Kubernetes (DOKS).
- Event-Driven: Kafka, Dapr (pub/sub, state, secrets, jobs).
- Features: Full integration with bonuses (e.g., voice commands).
- Constraints: Multi-cloud portability via Dapr; secure credentials (Kubernetes Secrets or Dapr API).

## Feature Progression Constraints

### Basic Level (All Phases):
Mandatory CRUD operations with validation (e.g., title 1-200 chars, desc optional).

### Intermediate Level (Phases III+):
Priorities (high/medium/low), tags (e.g., work/home), search/filter/sort.

### Advanced Level (Phases IV+):
Recurring tasks, due dates with reminders (browser notifications or scheduled jobs).

### Bonuses:
Prioritize Reusable Intelligence (+200), Cloud-Native Blueprints (+200), Urdu support (+100), Voice Commands (+200). Integrate if they align with phases without violating constraints.

## Security and Compliance Non-Negotiables

- User data isolation: Always filter by authenticated user (e.g., user_id in URLs, JWT verification).
- Token Management: JWT expiry (e.g., 7 days), shared secrets via env vars (never hardcode).
- Secrets: Use Kubernetes/Dapr secrets for API keys (e.g., OpenAI).
- Error Handling: Graceful failures (e.g., 401 Unauthorized, validation messages).
- Compliance: No child exploitation, violence, or illegal activities.

## Development Workflow Non-Negotiables

- SDD Loop: Specify (WHAT) → Plan (HOW) → Tasks (BREAKDOWN) → Implement (CODE). No code without Task ID.
- Specs History: Store all iterations in /specs folder (e.g., v1.md, v2.md).
- Folder Structure: Monorepo with /specs, /src (Phase I), /frontend, /backend (Phase II+), CLAUDE.md at root and subfolders.
- Testing: Include acceptance criteria in specs; generate unit tests via Claude if possible.
- Documentation: README.md with setup/run instructions; demo videos <90s showing workflow.
- Hierarchy: If conflicts, Constitution > Specify > Plan > Tasks.

## Performance Expectations

- Response Times: <1s for console/web operations; <5s for AI/chatbot.
- Scalability: Design for growth (e.g., event-driven in Phase V).
- Resource Usage: Efficient memory/CPU; no unnecessary deps.

## Allowed Patterns

- Modular: Use classes/functions for separation (e.g., Task model).
- Async: Prefer async/await in FastAPI/OpenAI calls.
- Event-Driven: Kafka/Dapr for reminders/notifications in later phases.
- Reusability: Subagents/skills for common logic (e.g., task parsing).

## Governance

This constitution is the single source of truth. All specifications, plans, tasks, and implementations must adhere to this document. Agents (e.g., Claude Code) must reference and check against it before proposing or generating any output. Updates require justification and must be proposed via spec refinements. Agents must halt if violations are detected.

**Version**: 1.0.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11