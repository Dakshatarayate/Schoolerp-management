# SchoolERP — Database Schema & Data Models

Database schema design for MongoDB using Mongoose ODM, matching the entities of the SchoolERP platform.

---

## 1. Domain Entities & Collections

| Collection | Model Name | Description |
| :--- | :--- | :--- |
| `users` | `User` | School administrators, principals, teachers, accountants |
| `students` | `Student` | Enrolled pupils, roll numbers, class assignment, fees |
| `parents` | `Parent` | Guardians, phone numbers, email, physical addresses |
| `classes` | `Class` | Grades, sections, allocated capacity, class teachers |
| `attendances` | `Attendance` | Daily student attendance records (Present, Absent, Late, Excused) |
| `fee_structures` | `FeeStructure` | Academic term fee heads, amounts, due dates |
| `fee_payments` | `FeePayment` | Payment transactions, receipt numbers, payment modes, remarks |

---

## 2. Core Schema Outlines (Planned for Phase 2)

### Student Schema
* `admissionNumber` (String, unique, indexed)
* `firstName` (String, required)
* `lastName` (String, required)
* `gender` (Enum: `male`, `female`, `other`)
* `dateOfBirth` (Date)
* `classId` (ObjectId, ref: `'Class'`, indexed)
* `parentId` (ObjectId, ref: `'Parent'`, indexed)
* `rollNumber` (String)
* `status` (Enum: `active`, `inactive`, `graduated`, `suspended`)
* `totalFee` (Number, default: 0)
* `paidFee` (Number, default: 0)
* `pendingFee` (Number, calculated/stored)

### Attendance Schema
* `date` (Date, indexed)
* `classId` (ObjectId, ref: `'Class'`, indexed)
* `records`: Array of:
  * `studentId` (ObjectId, ref: `'Student'`)
  * `status` (Enum: `'present'`, `'absent'`, `'late'`, `'excused'`)
  * `remark` (String)
* Unique compound index on `(date, classId)`.

### Fee Payment Schema
* `receiptNumber` (String, unique, indexed)
* `studentId` (ObjectId, ref: `'Student'`, indexed)
* `amount` (Number, required)
* `paymentMode` (Enum: `'cash'`, `'bank_transfer'`, `'cheque'`, `'upi'`, `'card'`)
* `paymentDate` (Date, default: Date.now)
* `collectedBy` (ObjectId, ref: `'User'`)
* `notes` (String)
