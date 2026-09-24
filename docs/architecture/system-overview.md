# SchoolERP — System Architecture Overview

High-level architecture documentation of the **SchoolERP** Full-Stack MERN (MongoDB, Express, React, Node.js) system.

---

## 1. System Context

SchoolERP is a lightweight, responsive ERP engineered specifically for small to mid-sized educational institutions, nurseries, primary, and secondary schools. It automates administrative tasks across student enrollment, parent communication, attendance tracking, and fee recovery.

```
       ┌────────────────────────┐
       │   Browser / Client     │
       │   (React 18 + Vite)    │
       └───────────┬────────────┘
                   │
                   │ HTTPS / JSON API
                   ▼
       ┌────────────────────────┐
       │     Node.js Server     │
       │  Express.js API Engine │
       └───────────┬────────────┘
                   │
                   │ Mongoose ODM
                   ▼
       ┌────────────────────────┐
       │        MongoDB         │
       │   Document Database    │
       └────────────────────────┘
```

---

## 2. Key Architecture Pillars

1. **Decoupled Monorepo Structure**:
   * Frontend and Backend reside in isolated subfolders (`/frontend` and `/backend`).
   * Independent dependency graphs (`package.json`), build pipelines, and environment variables.
   * Eliminates tight coupling, enabling zero-downtime frontend static hosting and backend microservice migration.

2. **Security & Data Privacy**:
   * Cross-Origin Resource Sharing (CORS) restricted to trusted client origin.
   * Cryptographic password hashing using `bcryptjs` with salt rounds.
   * Stateless JWT authentication with short-lived tokens.
   * Role-based access control protecting administrative endpoints.

3. **Data Integrity & Consistency**:
   * Strict Mongoose schema validations at the persistence layer.
   * ACID transactional guarantees on critical multi-document operations (e.g., fee collection updating student balance and generating payment receipts).
