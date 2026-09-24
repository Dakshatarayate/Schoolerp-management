# SchoolERP — Architectural Changelog & Migration Log

This document records the chronological history of changes, structural migrations, and development milestones in the **SchoolERP** repository.

---

## Migration Log

### Entry 001 — Full Project Restructuring (Frontend & Backend Separation)
* **Date**: 2026-09-24
* **Author**: Senior MERN Stack Architect
* **Status**: Completed

#### Summary of Actions
1. **Frontend Isolation**:
   * Moved all existing React 18 / Vite source code, components, context, initial data, and styles from root into dedicated `/frontend` workspace.
   * Moved `src/`, `index.html`, `tsconfig.json`, `vite.config.ts`, `.env.local`, `metadata.json`, `package-lock.json`, and `node_modules` into `/frontend/`.
   * Preserved all 11 component directories (`attendance`, `auth`, `classes`, `common`, `dashboard`, `fees`, `layout`, `parents`, `reports`, `settings`, `students`) without functional alteration.
   * Created standard entry points `frontend/src/main.tsx` and `frontend/src/main.jsx` with root mounting to guarantee smooth Vite startup.
   * Created root re-export proxies `frontend/App.jsx` and `frontend/main.jsx`.
   * Created placeholder directories with `.gitkeep` for `public`, `assets`, `pages`, `layouts`, `context`, `hooks`, `services`, `utils`, `routes`.
   * Created `frontend/vite.config.js` and updated `frontend/vite.config.ts` with path aliases.
   * Created `frontend/package.json`, `frontend/.env.example`, `frontend/.gitignore`, and `frontend/README.md`.

2. **Backend Project Initialization**:
   * Initialized isolated Express.js backend project in `/backend`.
   * Created layered directory architecture.
   * Added `.gitkeep` to all backend architecture subdirectories.
   * Created baseline files.

3. **System Documentation & Architecture Specifications**:
   * Created root `README.md`, `phases.md`, `memory.md`, `rules.md`, `decision.md`, `.gitignore`, and `docs/`.

---

### Entry 002 — Phase 1: Project Setup & Foundation
* **Date**: 2026-09-24
* **Author**: Senior MERN Stack Architect & Technical Lead
* **Phase**: Phase 1 (Project Setup)
* **Status**: Completed

#### Summary of Actions
1. **Dependency Installation**:
   * Added and installed production dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `express-validator`, `dotenv`, `cors`, `helmet`, `morgan`, `cookie-parser`, `express-rate-limit`, `multer`, `nodemon`.
2. **Server & Express Foundation**:
   * Implemented `backend/src/constants/httpStatus.js` with complete immutable HTTP status mappings.
   * Implemented `backend/src/utils/logger.js` with formatted timestamped logs (`info`, `warn`, `error`, `debug`).
   * Implemented `backend/src/config/db.js` with Mongoose connection manager, retry handling, and connection event listeners.
   * Implemented `backend/src/middleware/notFound.js` with standardized 404 response handler.
   * Implemented `backend/src/middleware/errorMiddleware.js` handling Mongoose CastError, ValidationError, duplicate key (11000), JWT errors, and JSON syntax errors.
   * Implemented `backend/src/middleware/authMiddleware.js` clean placeholder.
   * Implemented `backend/src/routes/index.js` route aggregator with `GET /api/health`.
   * Implemented `backend/src/app.js` with full security headers (`helmet`), CORS, Morgan logging, rate limiting (1000/15min), body parsers, cookie parser, and middleware pipeline.
   * Implemented `backend/server.js` with environment loading, port binding, and graceful shutdown handlers (`SIGTERM`, `SIGINT`, `unhandledRejection`, `uncaughtException`).
   * Implemented `backend/src/index.js` exporting core modules.
3. **Verification & Testing**:
   * Executed test server and validated operational logging.
   * Tested `GET /api/health`: Received `200 OK` with JSON `{ success: true, message: "...", data: { status: "UP", ... } }`.
   * Tested `GET /api/unknown-endpoint`: Received `404 Not Found` with JSON `{ success: false, message: "Resource not found: GET /api/unknown-endpoint", errors: [] }`.
   * Confirmed security headers (CSP, HSTS, X-Frame-Options) and rate limit headers on live responses.
   * Created Postman collection in `backend/src/docs/postman_phase1.json`.

#### APIs Created
* `GET /api/health` — Checks server operational status, uptime, and environment.

#### Pending Tasks
* **Phase 2**: Authentication Module (Admin Login, JWT token generation, password hashing with bcrypt, protected routes, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`).
