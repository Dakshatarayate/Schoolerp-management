export type UserRole = 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolName: string;
}

export interface ClassItem {
  id: string;
  className: string;
  section: string;
  academicYear: string;
  classTeacherName?: string;
  roomNumber?: string;
  capacity?: number;
  status: 'Active' | 'Inactive';
}

export interface Parent {
  id: string;
  parentId: string; // e.g. PAR-101
  parentName: string;
  phone: string;
  email?: string;
  address: string;
  occupation?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2026-001
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  parentId: string;
  phone: string;
  address: string;
  admissionDate: string;
  status: 'Active' | 'Deactivated';
  rollNumber?: string;
}

export interface FeeStructure {
  id: string;
  classId: string;
  academicYear: string;
  totalAnnualFee: number;
  status: 'Active' | 'Inactive';
}

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. REC-2026-0891
  studentId: string;
  feeId?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  remarks?: string;
  collectedBy?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface SchoolSettings {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  affiliationNumber?: string;
  principalName?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type ActiveScreen =
  | 'dashboard'
  | 'students'
  | 'parents'
  | 'classes'
  | 'attendance'
  | 'attendance_history'
  | 'fees'
  | 'reports'
  | 'settings';
