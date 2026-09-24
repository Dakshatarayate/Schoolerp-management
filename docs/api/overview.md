# SchoolERP — API Specification Overview

This document outlines the API guidelines, conventions, authentication mechanisms, and endpoint specifications for the **SchoolERP RESTful API**.

---

## 1. Base URL & Versioning

All API routes are prefixed by their API version:

```
http://localhost:5000/api/v1
```

In production:

```
https://api.schoolerp.yourdomain.com/api/v1
```

---

## 2. Authentication

Requests to protected endpoints must include a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. Standard Response Envelope

All API endpoints return JSON conforming to the following structure:

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed: 'email' must be a valid email address",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 4. Planned Endpoint Modules (Phases 3 - 5)

* **Authentication & Users (`/api/v1/auth`)**:
  * `POST /login` — User authentication & JWT generation.
  * `POST /refresh` — Refresh access token.
  * `GET /me` — Current authenticated session profile.
* **Students (`/api/v1/students`)**:
  * `GET /` — Filterable student directory with pagination.
  * `POST /` — Enroll new student.
  * `GET /:id` — Detailed student profile with fee and attendance history.
  * `PUT /:id` — Update student record.
  * `DELETE /:id` — Mark student inactive / archive.
* **Parents & Guardians (`/api/v1/parents`)**:
  * `GET /` — List parent directory.
  * `POST /` — Create parent/guardian record.
  * `GET /:id` — Parent profile with linked wards.
* **Classes & Sections (`/api/v1/classes`)**:
  * `GET /` — List classes, sections, and room assignments.
  * `POST /` — Create class section.
  * `PUT /:id` — Update class teacher and capacity.
* **Attendance (`/api/v1/attendance`)**:
  * `GET /date/:date/class/:classId` — Retrieve daily attendance register.
  * `POST /mark` — Bulk record attendance for a class.
  * `GET /student/:studentId/summary` — Student attendance statistics.
* **Fees & Invoicing (`/api/v1/fees`)**:
  * `GET /summary` — Aggregate fee collection metrics.
  * `POST /collect` — Record fee installment payment.
  * `GET /receipts/:receiptNumber` — Retrieve receipt details.
* **Reports (`/api/v1/reports`)**:
  * `GET /fees` — Defaulters list & collection ledger.
  * `GET /attendance` — Monthly attendance report.
