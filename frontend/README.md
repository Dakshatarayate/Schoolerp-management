# SchoolERP — Frontend Application

Modern, high-performance School Management System client interface built with **React 18**, **TypeScript**, and **Tailwind CSS**, powered by the **Vite** build engine.

---

## 1. Frontend Architecture

The frontend is structured around a component-driven, single-source-of-truth state architecture. It provides an intuitive, high-speed single-page application (SPA) experience tailored for school administrators, principals, teachers, and accountants.

```
                  ┌──────────────────────────────┐
                  │          index.html          │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │       src/main.tsx / .jsx    │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │            App.tsx           │
                  │     <SchoolProvider>         │
                  └──────────────┬───────────────┘
                                 │
          ┌──────────────────────┴──────────────────────┐
          │                                             │
┌─────────▼─────────┐                         ┌─────────▼─────────┐
│     Layout        │                         │   Modals / Overlays│
│ - Sidebar         │                         │ - StudentForm     │
│ - Header          │                         │ - CollectFee      │
└─────────┬─────────┘                         │ - ReceiptModal    │
          │                                   │ - ToastContainer  │
┌─────────▼─────────────────────────────────┐ └───────────────────┘
│            Active Screen View             │
│ - DashboardView      - FeesView           │
│ - StudentsView       - ReportsView        │
│ - ParentsView        - SettingsView       │
│ - ClassesView        - LoginView          │
│ - AttendanceView     - AttendanceHistory  │
└───────────────────────────────────────────┘
```

---

## 2. Folder Structure & Responsibilities

```
frontend/
├── public/                 # Static public assets served directly by Vite
├── assets/                 # Brand assets, logos, and illustrations
├── src/                    # Primary source code directory
│   ├── assets/             # Component-imported images, SVGs, and brand icons
│   ├── components/         # Feature-oriented and shared UI components
│   │   ├── attendance/     # Daily attendance register, marking, and history views
│   │   ├── auth/           # Login screen, credential validation, session UI
│   │   ├── classes/        # Grade and section management, class teacher assignment
│   │   ├── common/         # Generic modals, toasts, action buttons, receipt previews
│   │   ├── dashboard/      # KPI cards, fee revenue metrics, quick actions, analytics
│   │   ├── fees/           # Fee collection, payment receipts, balance trackers
│   │   ├── layout/         # Responsive sidebar navigation, app header, user menu
│   │   ├── parents/        # Guardian directories, linked student records, contacts
│   │   ├── reports/        # Exportable attendance, academic, and financial reports
│   │   ├── settings/       # School profile, academic sessions, fee structures
│   │   └── students/       # Student enrollment, search, profile modals, directories
│   ├── context/            # React context providers (`SchoolContext.tsx`)
│   ├── data/               # Local mock and fallback data (`initialData.ts`)
│   ├── hooks/              # Custom application hooks for logic reuse
│   ├── layouts/            # Page-level layout templates
│   ├── pages/              # Routed screen view compositions
│   ├── routes/             # Route configurations and navigation mapping
│   ├── services/           # HTTP API client and backend service wrappers
│   ├── types/              # TypeScript domain interfaces and type declarations
│   ├── utils/              # Pure formatting helpers (currency, dates, badges)
│   ├── App.tsx             # Root layout controller and view switcher
│   ├── index.css           # Global stylesheet and Tailwind utility definitions
│   └── main.tsx            # DOM root mounting script
├── .env.example            # Template for environment configuration
├── .gitignore              # Git ignore rules for frontend artifacts
├── package.json            # NPM dependencies and execution scripts
├── tsconfig.json           # TypeScript compiler configuration
├── vite.config.ts          # Vite bundler configuration with `@` alias
└── README.md               # Frontend documentation
```

---

## 3. State Management Strategy

The frontend currently utilizes a centralized **React Context** pattern (`SchoolContext.tsx`) with the custom `useSchool()` hook:

* **Global School Context**:
  * **Auth & User State**: Active logged-in administrator or staff session.
  * **Domain Entities**: In-memory state for `students`, `parents`, `classes`, `attendance`, `feeStructures`, and `payments`.
  * **Navigation State**: `currentScreen` tracking active viewport (`dashboard`, `students`, `fees`, `attendance`, etc.).
  * **Notifications**: Global `toasts` array with auto-expiring status alerts (`success`, `error`, `warning`, `info`).
  * **Modal Coordination**: Active modals for fee collection, student details, and receipt printing.
* **Persistent Storage**: Changes are synchronized to `localStorage` key `'schoolerp_data'` as fallback offline persistence.
* **Future API Synchronization**: The state layer is designed to transition smoothly to React Query / SWR or direct service calls when integrating with the Express backend in Phase 6.

---

## 4. API Service Layer Rules

When connecting to the Express backend:

1. **Isolation**: Never perform raw `fetch()` or `axios()` calls directly inside UI components.
2. **Dedicated Service Modules**: All API calls must reside under `src/services/` (e.g., `studentService.js`, `feeService.js`, `authService.js`).
3. **Base HTTP Client**: Centralize base URL, request headers, JWT bearer token attachment, and 401 interception in `src/services/apiClient.js`.
4. **Normalized Responses**: Service methods must parse backend payloads and return structured `{ data, error }` contracts.
5. **Environment Driven**: API endpoints must resolve dynamically using `import.meta.env.VITE_API_URL`.

---

## 5. Route & Navigation Structure

Navigation is managed seamlessly via the application state:

| Screen Identifier | Component | Description |
| :--- | :--- | :--- |
| `dashboard` | `DashboardView` | School overview, KPI metric tiles, recent activity |
| `students` | `StudentsView` | Student table, filters, search, enrollment modal |
| `parents` | `ParentsView` | Guardian records, emergency contacts, linked children |
| `classes` | `ClassesView` | Class definitions, room numbers, class teachers |
| `attendance` | `AttendanceView` | Daily roll-call register by class & section |
| `attendance_history` | `AttendanceHistoryView` | Historical attendance log with date range filter |
| `fees` | `FeesView` | Fee balance ledger, receipt generation, invoice collection |
| `reports` | `ReportsView` | Tabular summaries for attendance and fee recovery |
| `settings` | `SettingsView` | School name, academic year, grading, fee head configuration |

---

## 6. Environment Variables

Create `.env` or `.env.local` inside the `frontend/` directory using the provided `.env.example`:

```env
# URL for the Express backend API
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Development Commands

Execute all commands from the `frontend/` directory:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run TypeScript check and compile production bundle
npm run build

# Preview production build locally
npm run preview
```
