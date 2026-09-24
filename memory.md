# SchoolERP — Architecture & Context Memory Bank

This file functions as the persistent knowledge repository and context memory for the **SchoolERP** project. Any developer or AI agent working on this codebase must consult this document to understand the established domain conventions, existing systems, and architectural invariants.

---

## 1. Project Purpose & Domain

**SchoolERP** is a specialized management system engineered for small-to-mid-sized schools, nurseries, and training centers. It solves fundamental day-to-day administrative problems without the bloat of oversized enterprise software:
* Rapid student enrollment and profile maintenance.
* Guardian and emergency contact tracking.
* Class and section capacity management.
* Quick daily attendance recording and historical attendance reporting.
* Transparent fee collection, installment recording, invoice tracking, and receipt printing.

---

## 2. Completed Frontend Architecture

The frontend is fully functional and was developed using:
* **React 18** with **TypeScript** and **Tailwind CSS**.
* **Vite** bundler with path alias `@` mapping to `src`.
* **Lucide React** icon library.
* **Google Fonts**: *Inter* for body typography and *Plus Jakarta Sans* for headers and display elements.

### Existing Component Directory (`frontend/src/components/`)
* **`attendance/`**:
  * `AttendanceView.tsx`: Daily class roll-call interface with one-click toggles (Present, Absent, Late, Excused).
  * `AttendanceHistoryView.tsx`: Date range filterable historical attendance logs.
* **`auth/`**:
  * `LoginView.tsx`: Secure administrative authentication screen.
* **`classes/`**:
  * `ClassesView.tsx`: Grade, section, and classroom capacity dashboard.
* **`common/`**:
  * `ConfirmationModal.tsx`: Reusable destructive action confirmation modal.
  * `ReceiptModal.tsx`: Printable fee payment receipt modal with print dialog trigger.
  * `ToastContainer.tsx`: Global notification toast system.
* **`dashboard/`**:
  * `DashboardView.tsx`: High-level metrics (Total Students, Attendance Rate, Revenue Collected, Pending Dues).
* **`fees/`**:
  * `FeesView.tsx`: Fee ledger, outstanding debt tracker, and payment history.
  * `CollectFeeModal.tsx`: Payment collection form supporting multiple payment modes (Cash, Bank Transfer, UPI, Cheque).
* **`layout/`**:
  * `Header.tsx`: Top bar with school brand, notifications, user avatar, and mobile toggle.
  * `Sidebar.tsx`: Persistent navigation drawer with route links and active screen highlights.
* **`parents/`**:
  * `ParentsView.tsx`: Guardian directory with linked student listings and contact options.
* **`reports/`**:
  * `ReportsView.tsx`: Tabular reporting tools for financial and attendance audits.
* **`settings/`**:
  * `SettingsView.tsx`: School profile settings, academic term definitions, and fee head pricing.
* **`students/`**:
  * `StudentsView.tsx`: Student directory with search, class filtering, and action buttons.
  * `StudentFormModal.tsx`: Comprehensive student admission and enrollment form.
  * `StudentDetailsModal.tsx`: Detailed student profile modal.

### State & Data Architecture (`frontend/src/context/` & `frontend/src/data/`)
* `SchoolContext.tsx`: Provides the `SchoolProvider` and `useSchool()` hook managing:
  * `user`: Current logged-in user profile.
  * `currentScreen`: Screen state (`dashboard`, `students`, `parents`, `classes`, `attendance`, `attendance_history`, `fees`, `reports`, `settings`).
  * `students`, `parents`, `classes`, `attendance`, `feeStructures`, `payments`: Domain entity collections.
  * `toasts`: Alert notification queue.
  * `receiptModalData`: Currently rendered payment receipt.
  * In-memory state syncs to `localStorage` under key `'schoolerp_data'`.
* `initialData.ts`: Realistic seed data providing mock records for all entities.

---

## 3. Backend Architecture Design (Phase 1 Baseline)

* **Runtime**: Node.js (ES Modules, `"type": "module"`).
* **Framework**: Express.js 4.
* **Database**: MongoDB with Mongoose 8 ODM.
* **Security & Utility Stack**:
  * `helmet`: Secure HTTP response headers.
  * `cors`: Restricted cross-origin access with credentials.
  * `morgan`: Request traffic logging.
  * `express-rate-limit`: Brute-force & DOS throttling (1000 requests/15m).
  * `cookie-parser`: Secure cookie extraction.
  * `express-validator`: Centralized request schema validation.
* **Layering Pattern**:
  * **Controllers**: Extract request parameters, validate, invoke services, return JSON. No direct database queries.
  * **Services**: Encapsulate pure business logic, calculations, and orchestration.
  * **Repositories**: Abstract database CRUD and aggregations.
  * **Middleware**: Authentication, role authorization, validation, error handling.
  * **Validators**: Centralized request payload rules (`express-validator`).

### Standard API Response Contract
* **Success**:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
  }
  ```
* **Failure / Error**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": []
  }
  ```

---

## 4. Key Invariants & Non-Negotiable Rules

1. **Frontend Functionality Preservation**:
   * Under no circumstances should frontend components or styling be refactored or rewritten during backend creation.
   * Path imports must remain valid.
2. **Complete Decoupling**:
   * Frontend and Backend operate with independent `package.json` files and separate dependencies.
   * No backend code or database dependencies in `/frontend`.
   * No React code in `/backend`.
3. **Repository-Service Separation**:
   * Controllers NEVER query Mongoose models directly. All database access must pass through `/repositories`.
4. **Validation Integrity**:
   * Every POST/PUT payload must be guarded by an `express-validator` middleware array.
