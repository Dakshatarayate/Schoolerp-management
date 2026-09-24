# SchoolERP — Backend Application

Production-ready, enterprise-grade RESTful API backend for the **SchoolERP** management platform, built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 1. Backend Architecture

The backend follows a strict **Layered N-Tier Architecture** ensuring separation of concerns, testability, and enterprise maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                       HTTP Request                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Global Middleware                        │
│   (CORS, Helmet, Rate Limiter, Body Parser, Morgan Logger)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Route Layer (/routes)                     │
│  - Path matching & endpoint mapping                         │
│  - Route-level middleware (Auth, Role Guard, Validation)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Controller Layer (/controllers)              │
│  - Extracts HTTP request data (params, query, body)         │
│  - Delegates business orchestration to Services             │
│  - Formats and sends HTTP responses                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Service Layer (/services)                   │
│  - Core business logic, rules, calculations, permissions    │
│  - Transaction management & external integrations           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Repository Layer (/repositories)               │
│  - Data access abstraction                                  │
│  - Direct queries to MongoDB via Mongoose Models            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Models Layer (/models)                     │
│  - Mongoose Schemas, indexes, hooks, and validations        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Folder Responsibilities

| Directory | Responsibility |
| :--- | :--- |
| `src/config/` | Environment variables, database connection (`db.js`), JWT settings, third-party credentials. |
| `src/constants/` | System constants: user roles (`ADMIN`, `PRINCIPAL`, `TEACHER`), HTTP status codes, error codes. |
| `src/controllers/` | Request handlers. Coordinates inputs, calls services, and dispatches JSON responses. |
| `src/docs/` | Swagger / OpenAPI specifications, Postman collection exports, and API documentation. |
| `src/middleware/` | Interceptors for JWT authentication, role authorization, request validation, and rate limiting. |
| `src/models/` | Mongoose schema definitions (e.g., `Student`, `Parent`, `Class`, `Attendance`, `FeePayment`). |
| `src/repositories/` | Dedicated database abstraction queries isolating Mongoose logic from domain services. |
| `src/routes/` | Express route definitions grouped by domain resource (`/auth`, `/students`, `/fees`, etc.). |
| `src/services/` | Business rules, balance calculations, attendance aggregations, and email/SMS triggers. |
| `src/utils/` | Shared pure helper functions: standard API response builder, date parsers, logger. |
| `src/validators/` | Request schema validation rules (Joi / Zod) protecting endpoints from malformed payloads. |
| `src/app.js` | Express app configuration, middleware mounting, health check, 404 & error handlers. |
| `server.js` | Server bootstrap, environment loading, port binding, and graceful shutdown listeners. |

---

## 3. Request Lifecycle

1. **Client Request**: An incoming HTTP request hits `server.js` on port `5000`.
2. **Global Pre-processing**: Passed to `app.js` through `cors`, `helmet`, `express.json()`, and `morgan`.
3. **Route Resolution**: Router parses URI path (e.g., `POST /api/v1/fees/collect`).
4. **Validation Middleware**: Validates `req.body` against schema; returns `400 Bad Request` if invalid.
5. **Auth Middleware**: Inspects `Authorization: Bearer <token>`; verifies signature and attaches `req.user`.
6. **Controller Dispatch**: Controller extracts required parameters and calls the domain Service.
7. **Business Execution**: Service processes business logic, queries via Repository, and executes transactions.
8. **Response Formatting**: Controller packages results using `apiResponse(res, status, data, message)`.
9. **Error Interception**: Any uncaught exception drops into `errorHandler` middleware returning uniform JSON.

---

## 4. Middleware Flow

```
Request ──► [ CORS / Security Headers ]
        ──► [ Body Parser (JSON) ]
        ──► [ Request Logger (Morgan) ]
        ──► [ Rate Limiter ]
        ──► [ authenticateJWT ]
        ──► [ authorizeRoles('ADMIN', 'ACCOUNTANT') ]
        ──► [ validatePayload(schema) ]
        ──► [ Route Controller ]
        ──► [ Centralized Error Handler (on catch) ] ──► Response
```

---

## 5. JWT Authentication Flow

1. **Credentials Submission**: Client sends `POST /api/v1/auth/login` with email and password.
2. **Verification**: Service checks user existence, compares hashed password with `bcrypt.compare()`.
3. **Token Issuance**: Server signs a stateless JWT containing payload:
   ```json
   {
     "sub": "user_id_string",
     "role": "ADMIN",
     "email": "admin@school.com",
     "schoolId": "school_tenant_id"
   }
   ```
4. **Header Attachment**: Frontend stores token in memory/secure storage and sends on subsequent requests:
   `Authorization: Bearer <jwt_access_token>`
5. **Route Guard**: The `verifyToken` middleware parses header, verifies signature using `process.env.JWT_SECRET`, and verifies role access before invoking controller.

---

## 6. Error Handling Strategy

All errors are handled consistently via an `AppError` class and centralized middleware:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

* **Standard Error Response**:
  ```json
  {
    "status": "error",
    "statusCode": 404,
    "message": "Student record with ID 64a8fc32b not found",
    "stack": "Error: ... (development mode only)"
  }
  ```
* **Operational Errors**: Predictable errors (validation, not found, forbidden) return informative messages.
* **Programming Errors**: Unhandled bugs or database crashes return generic `500 Internal Server Error` with details logged server-side.

---

## 7. Environment Variables

Create `.env` inside the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/schoolerp
JWT_SECRET=super_secret_jwt_key_school_erp_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 8. API Conventions

* **RESTful Resource Naming**: Plural nouns for collections (e.g., `/students`, `/parents`, `/classes`, `/fees`).
* **HTTP Verbs**:
  * `GET` — Retrieve resources.
  * `POST` — Create new resource or initiate action.
  * `PUT` / `PATCH` — Update existing resource.
  * `DELETE` — Soft or hard delete resource.
* **Standard Success Response**:
  ```json
  {
    "status": "success",
    "data": { ... },
    "message": "Fee collected and receipt generated successfully."
  }
  ```
* **HTTP Status Code Standards**:
  * `200 OK` — Successful GET / generic operation.
  * `201 Created` — Successful POST resource creation.
  * `400 Bad Request` — Missing or invalid input payload.
  * `401 Unauthorized` — Missing or invalid JWT.
  * `403 Forbidden` — Valid JWT, but role lacks permission.
  * `404 Not Found` — Resource ID does not exist.
  * `500 Internal Server Error` — Unhandled server exception.
