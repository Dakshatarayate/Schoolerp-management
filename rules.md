# SchoolERP — Engineering Rules & Architectural Guidelines

This document governs the coding standards, design principles, and boundaries for all engineers and AI pair-programmers contributing to the **SchoolERP** codebase.

---

## 1. General Architectural Rules

1. **Decoupled Monorepo Structure**:
   * The root directory `SchoolERP/` contains two distinct application sub-projects: `/frontend` and `/backend`.
   * Never introduce cross-project relative file imports (e.g., importing from `../../backend` inside `frontend/` or vice-versa).
   * All shared contracts, API schemas, and documentation belong in `/docs`.
2. **Independent Dependency Manifests**:
   * Frontend dependencies must be managed solely inside `/frontend/package.json`.
   * Backend dependencies must be managed solely inside `/backend/package.json`.
   * Never install frontend libraries into the backend or server libraries into the frontend.

---

## 2. Frontend Engineering Rules

1. **Preserve Completed Functionality**:
   * The frontend is already completed and functional. **Do not redesign, rewrite, or alter visual components or routing behavior.**
   * Any change must be strictly additive or structural.
2. **Component Purity & Separation of Concerns**:
   * UI components should remain visual and presentational.
   * State and API logic must be accessed via hooks (`useSchool()`) or dedicated services in `frontend/src/services/`.
   * Never execute direct HTTP fetches or database calls inside presentation components.
3. **Styling Standards**:
   * Use Tailwind CSS utility classes adhering to the existing theme colors:
     * Background: `#F8FAFC` (Slate 50)
     * Primary Text: `#0F172A` (Slate 900)
     * Primary Brand: Blue / Indigo accents
     * Borders: `#E2E8F0` (Slate 200)
   * Do not mix arbitrary inline style blocks when Tailwind classes are available.
4. **Modals & Overlays**:
   * All global modals (e.g., `StudentFormModal`, `CollectFeeModal`, `ReceiptModal`) must be triggered via centralized state flags to prevent z-index collision and scroll-locking bugs.

---

## 3. Backend Engineering Rules

1. **Layered N-Tier Pattern**:
   * **Controllers (`/controllers`)**: Only handle HTTP concerns (status codes, headers, cookie extraction). Never write business rules or direct DB queries in controllers.
   * **Services (`/services`)**: Contain all business logic, authorization decisions, fee computations, and cross-model workflows.
   * **Repositories (`/repositories`)**: Encapsulate Mongoose queries and database aggregations.
   * **Models (`/models`)**: Strictly schema definitions, validations, virtuals, and hooks.
2. **Centralized Error Handling**:
   * Never let unhandled promise rejections crash the server.
   * Always pass caught exceptions to `next(err)` or throw custom `AppError(message, statusCode)` instances.
   * Controller methods must be wrapped in an `asyncHandler` utility.
3. **Request Validation**:
   * Every incoming HTTP payload (`req.body`, `req.params`, `req.query`) must be validated by a schema validator (Joi/Zod) before reaching controller execution.
4. **Clean API Responses**:
   * Always return responses formatted with the standard envelope:
     ```json
     {
       "status": "success",
       "data": { ... },
       "message": "Descriptive message"
     }
     ```

---

## 4. Security & Environment Standards

1. **Environment Secrets**:
   * Never commit `.env` or `.env.local` files containing secrets or real keys to source control.
   * Always provide sanitized template values in `.env.example`.
2. **Authentication & Authorization**:
   * All administrative endpoints must be guarded with `authenticateJWT` and `authorizeRoles(...)`.
   * Passwords must always be hashed with `bcryptjs` (minimum 10 salt rounds) before persistence.
   * Passwords must never be returned in query projections (`select: false`).
3. **CORS Configuration**:
   * Backend CORS must only allow the designated frontend domain specified in `CLIENT_URL`.

---

## 5. Git & Commit Guidelines

* Follow Conventional Commits:
  * `feat: add student admission API endpoint`
  * `fix: correct attendance percentage calculation on dashboard`
  * `refactor: extract fee calculation logic into feeService`
  * `docs: update API endpoints specification`
