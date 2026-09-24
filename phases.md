# SchoolERP — Backend Execution Phases & Roadmap (PRD Aligned)

This document tracks the phased implementation of the **SchoolERP Backend API** according to the Product Requirements Document (PRD) and established project memory.

---

## Roadmap Overview

```
[ Phase 1 ]  Project Setup & Foundation (COMPLETED)
     │
     ▼
[ Phase 2 ]  Authentication Module (JWT, Admin Login, Protected Routes)
     │
     ▼
[ Phase 3 ]  Class Management (CRUD, Capacity, Teachers, Sections)
     │
     ▼
[ Phase 4 ]  Parent Management (CRUD, Phone/Email Validation, Linked Wards)
     │
     ▼
[ Phase 5 ]  Student Management (CRUD, Admission, Class/Parent Link, Search, Filters)
     │
     ▼
[ Phase 6 ]  Attendance Module (Daily Register, Duplicate Prevention, History)
     │
     ▼
[ Phase 7 ]  Fee Structure Module (Annual Fees, Academic Year, Class Linkage)
     │
     ▼
[ Phase 8 ]  Payment Module (Receipt Numbering, Balance Calculation, Overpayment Prevention)
     │
     ▼
[ Phase 9 ]  Dashboard Module (KPIs, Aggregate Metrics, Optimized Queries)
     │
     ▼
[ Phase 10 ] Reports Module (Student, Attendance, and Fee Summary Aggregations)
     │
     ▼
[ Phase 11 ] Settings Module (School Information, Single Document Store)
     │
     ▼
[ Phase 12 ] Audit Logging (Automated Security and Data Audit Trail)
```

---

## Detailed Phase Status

### Phase 1: Project Setup (Status: COMPLETED)
- [x] Configure Express application in `src/app.js` with ES Modules.
- [x] Configure HTTP server lifecycle and signal listeners in `server.js`.
- [x] Implement MongoDB connection manager with retry logic and event handlers in `src/config/db.js`.
- [x] Implement centralized application logger in `src/utils/logger.js`.
- [x] Implement standard HTTP status code constants in `src/constants/httpStatus.js`.
- [x] Implement global catch-all 404 handler in `src/middleware/notFound.js`.
- [x] Implement centralized global error handling middleware in `src/middleware/errorMiddleware.js`.
- [x] Implement authentication middleware placeholder in `src/middleware/authMiddleware.js`.
- [x] Implement route aggregator and health check endpoint (`GET /api/health`) in `src/routes/index.js`.
- [x] Mount global security and utility middleware (`helmet`, `cors`, `morgan`, `express-rate-limit`, `cookie-parser`, `express.json`).
- [x] Verify server startup, health API response, rate limiting, and 404 error formatting.
- [x] Create Postman test collection in `src/docs/postman_phase1.json`.

---

### Phase 2: Authentication Module (Status: Pending)
- [ ] User Mongoose model (`name`, `email`, `password`, `role`, `avatar`, `schoolName`).
- [ ] Password hashing pre-save hook with `bcryptjs`.
- [ ] JWT utilities (`generateToken`, `verifyToken`).
- [ ] Authentication middleware (`authenticate`, `authorize`).
- [ ] Rate limiter for authentication endpoints (`express-rate-limit`).
- [ ] Login validator (`express-validator`).
- [ ] Endpoints:
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`

---

### Phase 3: Class Management (Status: Pending)
- [ ] Class Mongoose model (`className`, `section`, `academicYear`, `classTeacherName`, `roomNumber`, `capacity`, `status`, `isDeleted`).
- [ ] Class Repository (`classRepository.js`) & Service (`classService.js`).
- [ ] Class Validators (`express-validator`).
- [ ] Endpoints: `GET /api/classes`, `GET /api/classes/:id`, `POST /api/classes`, `PUT /api/classes/:id`, `DELETE /api/classes/:id`.

---

### Phase 4: Parent Management (Status: Pending)
- [ ] Parent Mongoose model (`parentId`, `parentName`, `phone`, `email`, `address`, `occupation`, `isDeleted`).
- [ ] Parent Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/parents`, `GET /api/parents/:id`, `POST /api/parents`, `PUT /api/parents/:id`, `DELETE /api/parents/:id`.

---

### Phase 5: Student Management (Status: Pending)
- [ ] Student Mongoose model (`studentId`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `classId`, `parentId`, `phone`, `address`, `admissionDate`, `status`, `rollNumber`, `isDeleted`).
- [ ] Student Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/students`, `GET /api/students/:id`, `POST /api/students`, `PUT /api/students/:id`, `DELETE /api/students/:id`.

---

### Phase 6: Attendance Module (Status: Pending)
- [ ] Attendance Mongoose model (`studentId`, `classId`, `date`, `status`, `remarks`).
- [ ] Unique compound constraint `(studentId, date)`.
- [ ] Attendance Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/attendance`, `POST /api/attendance`, `PUT /api/attendance/:id`, `GET /api/attendance/history`.

---

### Phase 7: Fee Structure (Status: Pending)
- [ ] Fee Mongoose model (`classId`, `academicYear`, `totalAnnualFee`, `status`, `isDeleted`).
- [ ] Compound uniqueness constraint on `(classId, academicYear)`.
- [ ] Fee Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/fees`, `GET /api/fees/:id`, `POST /api/fees`, `PUT /api/fees/:id`, `DELETE /api/fees/:id`.

---

### Phase 8: Payment Module (Status: Pending)
- [ ] Payment Mongoose model (`receiptNumber`, `studentId`, `feeId`, `amountPaid`, `paymentDate`, `paymentMode`, `remarks`, `collectedBy`, `isDeleted`).
- [ ] Receipt number generator (`REC-YYYY-XXXX`).
- [ ] Pending balance calculations and overpayment prevention business rules.
- [ ] Payment Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/payments`, `POST /api/payments`, `GET /api/payments/:id`.

---

### Phase 9: Dashboard Module (Status: Pending)
- [ ] Dashboard Service with optimized aggregation pipelines.
- [ ] Endpoint: `GET /api/dashboard` (KPIs, attendance rate, total collected, pending dues, recent activity).

---

### Phase 10: Reports Module (Status: Pending)
- [ ] Reports Service with MongoDB aggregation.
- [ ] Endpoints: `GET /api/reports/students`, `GET /api/reports/attendance`, `GET /api/reports/fees`.

---

### Phase 11: Settings Module (Status: Pending)
- [ ] SchoolSettings Mongoose model (singleton document pattern).
- [ ] Settings Repository, Service, and Validators.
- [ ] Endpoints: `GET /api/settings`, `PUT /api/settings`.

---

### Phase 12: Audit Logging (Status: Pending)
- [ ] AuditLog Mongoose model (`user`, `module`, `action`, `recordId`, `details`, `timestamp`).
- [ ] Audit logger service & middleware interceptor.
- [ ] Endpoint: `GET /api/audit-logs`.
