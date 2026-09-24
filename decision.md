# SchoolERP — Architecture Decision Records (ADR)

This file tracks the significant architectural, design, and structural decisions made for the **SchoolERP** platform.

---

## Index of Decisions

* [ADR-001: MERN Monorepo Project Restructuring (Decoupled Frontend & Backend)](#adr-001-mern-monorepo-project-restructuring-decoupled-frontend--backend)
* [ADR-002: Express.js Layered Architecture (Controller-Service-Repository Pattern)](#adr-002-expressjs-layered-architecture-controller-service-repository-pattern)
* [ADR-003: MongoDB & Mongoose for Data Persistence](#adr-003-mongodb--mongoose-for-data-persistence)
* [ADR-004: Stateless JWT Authentication with Role-Based Access Control](#adr-004-stateless-jwt-authentication-with-role-based-access-control)
* [ADR-005: Preserving React Context with Future Service Layer Integration](#adr-005-preserving-react-context-with-future-service-layer-integration)
* [ADR-006: Environment Variable Segregation & Configuration Management](#adr-006-environment-variable-segregation--configuration-management)

---

### ADR-001: MERN Monorepo Project Restructuring (Decoupled Frontend & Backend)
* **Status**: Accepted
* **Context**: The project began as a single-folder React application with mixed root configurations. As the project expands to include a full Express backend, keeping both applications in the root causes package collisions, build interference, and tight coupling.
* **Decision**: Restructure the project into an isolated monorepo:
  * `/frontend`: Houses the complete React 18, Vite, and Tailwind client application.
  * `/backend`: Houses the Express.js Node server and API architecture.
  * `/docs`: Houses centralized API specs, database schemas, and architectural diagrams.
* **Consequences**:
  * Positive: Independent build processes, separate `node_modules`, simpler CI/CD deployment to disparate cloud providers (e.g., Vercel for frontend, Render/AWS for backend).
  * Consideration: Running both locally requires two terminal processes or a root runner script.

---

### ADR-002: Express.js Layered Architecture (Controller-Service-Repository Pattern)
* **Status**: Accepted
* **Context**: Express allows arbitrary routing and middleware chaining, which frequently leads to "fat controllers" containing database queries, business rules, and response handling in one file.
* **Decision**: Enforce a strict 3-tier backend division:
  1. `controllers`: Parse incoming request, invoke services, send HTTP status and JSON response.
  2. `services`: Execute business logic, calculations (e.g., pending fees), and authorization rules.
  3. `repositories`: Encapsulate database queries and Mongoose model interactions.
* **Consequences**:
  * Positive: High unit testability without mocking HTTP requests, cleaner code reuse, isolation from database changes.

---

### ADR-003: MongoDB & Mongoose for Data Persistence
* **Status**: Accepted
* **Context**: School management entities (students with polymorphic guardian relationships, variable fee structures, and attendance records) require flexible document schemas while enforcing schema consistency.
* **Decision**: Use MongoDB with Mongoose ODM.
* **Consequences**:
  * Positive: Rapid schema iteration, native JSON alignment with frontend TypeScript types, built-in validation and lifecycle hooks.

---

### ADR-004: Stateless JWT Authentication with Role-Based Access Control
* **Status**: Accepted
* **Context**: The ERP requires authentication for multiple roles (`ADMIN`, `PRINCIPAL`, `TEACHER`, `ACCOUNTANT`) with distinct administrative permissions.
* **Decision**: Implement stateless JSON Web Token (JWT) authentication passed via HTTP `Authorization: Bearer <token>` headers.
* **Consequences**:
  * Positive: Zero server-side session memory overhead, horizontal backend scalability, clean mobile app readiness.
  * Consideration: Token revocation requires short expiration windows or token blacklisting.

---

### ADR-005: Preserving React Context with Future Service Layer Integration
* **Status**: Accepted
* **Context**: The existing React frontend has a working `SchoolContext.tsx` managing in-memory state and `localStorage` persistence.
* **Decision**: Keep the frontend state management intact during restructuring. In Phase 6, introduce an API service layer under `frontend/src/services/` that seamlessly updates the existing context state rather than undertaking an invasive frontend refactor.
* **Consequences**:
  * Positive: Guarantees zero regression on the existing UI and interactions.

---

### ADR-006: Environment Variable Segregation & Configuration Management
* **Status**: Accepted
* **Context**: Vite uses `VITE_` prefixed variables exposed to client bundles, whereas Node.js backend uses private environment variables (database credentials, JWT secrets).
* **Decision**: Separate environment files into `frontend/.env.example` and `backend/.env.example`.
* **Consequences**:
  * Positive: Eliminates the risk of leaking backend credentials into public client-side JavaScript bundles.
