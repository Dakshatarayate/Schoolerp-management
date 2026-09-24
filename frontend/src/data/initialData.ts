import {
  ClassItem,
  FeeStructure,
  Parent,
  Payment,
  SchoolSettings,
  Student,
  User,
  AttendanceRecord
} from '../types';

export const initialUser: User = {
  id: 'usr-admin-01',
  name: 'Dr. Rajesh Sharma',
  email: 'admin@greenwoodschool.edu',
  role: 'admin',
  schoolName: 'Greenwood Valley Public School',
  avatar: 'RS'
};

export const initialSettings: SchoolSettings = {
  schoolName: 'Greenwood Valley Public School',
  address: 'Plot 42, Education Corridor, Baner Road, Pune, Maharashtra 411045',
  phone: '+91 20 2589 1234',
  email: 'admin@greenwoodschool.edu',
  academicYear: '2026–27',
  affiliationNumber: 'CBSE/AFF/1130421',
  principalName: 'Dr. Rajesh Sharma'
};

export const initialClasses: ClassItem[] = [
  { id: 'cls-1', className: 'Nursery', section: 'A', academicYear: '2026–27', classTeacherName: 'Sunita Deshmukh', roomNumber: 'Room 101', capacity: 25, status: 'Active' },
  { id: 'cls-2', className: 'Junior KG', section: 'A', academicYear: '2026–27', classTeacherName: 'Aarti Patil', roomNumber: 'Room 102', capacity: 25, status: 'Active' },
  { id: 'cls-3', className: 'Senior KG', section: 'A', academicYear: '2026–27', classTeacherName: 'Neha Kulkarni', roomNumber: 'Room 103', capacity: 25, status: 'Active' },
  { id: 'cls-4', className: 'Class 1', section: 'A', academicYear: '2026–27', classTeacherName: 'Meenakshi Iyer', roomNumber: 'Room 201', capacity: 25, status: 'Active' },
  { id: 'cls-5', className: 'Class 2', section: 'A', academicYear: '2026–27', classTeacherName: 'Priya Nair', roomNumber: 'Room 202', capacity: 25, status: 'Active' },
  { id: 'cls-6', className: 'Class 3', section: 'A', academicYear: '2026–27', classTeacherName: 'Rajesh Verma', roomNumber: 'Room 203', capacity: 25, status: 'Active' },
  { id: 'cls-7', className: 'Class 4', section: 'A', academicYear: '2026–27', classTeacherName: 'Anita Joshi', roomNumber: 'Room 301', capacity: 25, status: 'Active' },
  { id: 'cls-8', className: 'Class 5', section: 'A', academicYear: '2026–27', classTeacherName: 'Vikram Shinde', roomNumber: 'Room 302', capacity: 25, status: 'Active' }
];

export const initialFeeStructures: FeeStructure[] = [
  { id: 'fee-1', classId: 'cls-1', academicYear: '2026–27', totalAnnualFee: 28000, status: 'Active' },
  { id: 'fee-2', classId: 'cls-2', academicYear: '2026–27', totalAnnualFee: 30000, status: 'Active' },
  { id: 'fee-3', classId: 'cls-3', academicYear: '2026–27', totalAnnualFee: 32000, status: 'Active' },
  { id: 'fee-4', classId: 'cls-4', academicYear: '2026–27', totalAnnualFee: 36000, status: 'Active' },
  { id: 'fee-5', classId: 'cls-5', academicYear: '2026–27', totalAnnualFee: 38000, status: 'Active' },
  { id: 'fee-6', classId: 'cls-6', academicYear: '2026–27', totalAnnualFee: 40000, status: 'Active' },
  { id: 'fee-7', classId: 'cls-7', academicYear: '2026–27', totalAnnualFee: 42000, status: 'Active' },
  { id: 'fee-8', classId: 'cls-8', academicYear: '2026–27', totalAnnualFee: 45000, status: 'Active' }
];

export const initialParents: Parent[] = [
  { id: 'par-1', parentId: 'PAR-101', parentName: 'Sanjay Sharma', phone: '+91 98220 11982', email: 'sanjay.sharma@example.com', address: 'Flat 402, Mayur Residency, Baner, Pune', occupation: 'Civil Engineer' },
  { id: 'par-2', parentId: 'PAR-102', parentName: 'Girish Patil', phone: '+91 98901 33421', email: 'girish.patil@example.com', address: 'B-12, Green Acres Society, Aundh, Pune', occupation: 'Architect' },
  { id: 'par-3', parentId: 'PAR-103', parentName: 'Mahesh Kulkarni', phone: '+91 97632 99014', email: 'mahesh.k@example.com', address: '78 Prabhat Road, Lane 4, Erandwane, Pune', occupation: 'Chartered Accountant' },
  { id: 'par-4', parentId: 'PAR-104', parentName: 'Prashant Joshi', phone: '+91 98233 44556', email: 'p.joshi@example.com', address: 'Plot 19, Anand Park, Aundh, Pune', occupation: 'Software Consultant' },
  { id: 'par-5', parentId: 'PAR-105', parentName: 'Anil Deshmukh', phone: '+91 94220 88123', email: 'anil.deshmukh@example.com', address: 'Row House 3, Shivalik Hills, Kothrud, Pune', occupation: 'Bank Branch Manager' },
  { id: 'par-6', parentId: 'PAR-106', parentName: 'Kavita Nair', phone: '+91 99701 55672', email: 'kavita.nair@example.com', address: '104 Sunrise Heights, Wakad, Pune', occupation: 'Professor' },
  { id: 'par-7', parentId: 'PAR-107', parentName: 'Dinesh Verma', phone: '+91 98811 77234', email: 'dinesh.verma@example.com', address: 'B-601, Celestial Palms, Hinjawadi, Pune', occupation: 'IT Manager' },
  { id: 'par-8', parentId: 'PAR-108', parentName: 'Rohan Mehta', phone: '+91 98224 66100', email: 'rohan.mehta@example.com', address: '22 Hermes Paras, Kalyani Nagar, Pune', occupation: 'Entrepreneur' },
  { id: 'par-9', parentId: 'PAR-109', parentName: 'Suresh Shinde', phone: '+91 97640 12890', email: 'suresh.shinde@example.com', address: 'Flat 304, Rohan Mithila, Viman Nagar, Pune', occupation: 'Defense Officer' },
  { id: 'par-10', parentId: 'PAR-110', parentName: 'Meera Pillai', phone: '+91 98600 45112', email: 'meera.pillai@example.com', address: 'C-23, Ivy Glen, Pashan, Pune', occupation: 'Biotechnologist' }
];

export const initialStudents: Student[] = [
  {
    id: 'stu-1',
    studentId: 'STU-2026-001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    dateOfBirth: '2021-04-12',
    gender: 'Male',
    classId: 'cls-2', // Junior KG A (₹30,000)
    parentId: 'par-1',
    phone: '+91 98220 11982',
    address: 'Flat 402, Mayur Residency, Baner, Pune',
    admissionDate: '2024-06-05',
    status: 'Active',
    rollNumber: '01'
  },
  {
    id: 'stu-2',
    studentId: 'STU-2026-002',
    firstName: 'Anaya',
    lastName: 'Patil',
    dateOfBirth: '2020-09-18',
    gender: 'Female',
    classId: 'cls-3', // Senior KG A (₹32,000)
    parentId: 'par-2',
    phone: '+91 98901 33421',
    address: 'B-12, Green Acres Society, Aundh, Pune',
    admissionDate: '2023-06-12',
    status: 'Active',
    rollNumber: '02'
  },
  {
    id: 'stu-3',
    studentId: 'STU-2026-003',
    firstName: 'Vivaan',
    lastName: 'Kulkarni',
    dateOfBirth: '2022-01-25',
    gender: 'Male',
    classId: 'cls-1', // Nursery A (₹28,000)
    parentId: 'par-3',
    phone: '+91 97632 99014',
    address: '78 Prabhat Road, Lane 4, Erandwane, Pune',
    admissionDate: '2025-06-10',
    status: 'Active',
    rollNumber: '03'
  },
  {
    id: 'stu-4',
    studentId: 'STU-2026-004',
    firstName: 'Myra',
    lastName: 'Joshi',
    dateOfBirth: '2021-07-30',
    gender: 'Female',
    classId: 'cls-2', // Junior KG A (₹30,000)
    parentId: 'par-4',
    phone: '+91 98233 44556',
    address: 'Plot 19, Anand Park, Aundh, Pune',
    admissionDate: '2024-06-08',
    status: 'Active',
    rollNumber: '04'
  },
  {
    id: 'stu-5',
    studentId: 'STU-2026-005',
    firstName: 'Kabir',
    lastName: 'Deshmukh',
    dateOfBirth: '2019-11-14',
    gender: 'Male',
    classId: 'cls-4', // Class 1 A (₹36,000)
    parentId: 'par-5',
    phone: '+91 94220 88123',
    address: 'Row House 3, Shivalik Hills, Kothrud, Pune',
    admissionDate: '2022-06-15',
    status: 'Active',
    rollNumber: '05'
  },
  {
    id: 'stu-6',
    studentId: 'STU-2026-006',
    firstName: 'Advait',
    lastName: 'Nair',
    dateOfBirth: '2018-05-19',
    gender: 'Male',
    classId: 'cls-5', // Class 2 A (₹38,000)
    parentId: 'par-6',
    phone: '+91 99701 55672',
    address: '104 Sunrise Heights, Wakad, Pune',
    admissionDate: '2021-06-14',
    status: 'Active',
    rollNumber: '06'
  },
  {
    id: 'stu-7',
    studentId: 'STU-2026-007',
    firstName: 'Diya',
    lastName: 'Verma',
    dateOfBirth: '2017-08-04',
    gender: 'Female',
    classId: 'cls-6', // Class 3 A (₹40,000)
    parentId: 'par-7',
    phone: '+91 98811 77234',
    address: 'B-601, Celestial Palms, Hinjawadi, Pune',
    admissionDate: '2020-06-20',
    status: 'Active',
    rollNumber: '07'
  },
  {
    id: 'stu-8',
    studentId: 'STU-2026-008',
    firstName: 'Ishaan',
    lastName: 'Mehta',
    dateOfBirth: '2016-03-22',
    gender: 'Male',
    classId: 'cls-7', // Class 4 A (₹42,000)
    parentId: 'par-8',
    phone: '+91 98224 66100',
    address: '22 Hermes Paras, Kalyani Nagar, Pune',
    admissionDate: '2019-06-18',
    status: 'Active',
    rollNumber: '08'
  },
  {
    id: 'stu-9',
    studentId: 'STU-2026-009',
    firstName: 'Reyansh',
    lastName: 'Shinde',
    dateOfBirth: '2015-10-09',
    gender: 'Male',
    classId: 'cls-8', // Class 5 A (₹45,000)
    parentId: 'par-9',
    phone: '+91 97640 12890',
    address: 'Flat 304, Rohan Mithila, Viman Nagar, Pune',
    admissionDate: '2018-06-15',
    status: 'Active',
    rollNumber: '09'
  },
  {
    id: 'stu-10',
    studentId: 'STU-2026-010',
    firstName: 'Saanvi',
    lastName: 'Pillai',
    dateOfBirth: '2022-03-11',
    gender: 'Female',
    classId: 'cls-1', // Nursery A (₹28,000)
    parentId: 'par-10',
    phone: '+91 98600 45112',
    address: 'C-23, Ivy Glen, Pashan, Pune',
    admissionDate: '2025-06-12',
    status: 'Active',
    rollNumber: '10'
  },
  {
    id: 'stu-11',
    studentId: 'STU-2026-011',
    firstName: 'Vihaan',
    lastName: 'Sharma',
    dateOfBirth: '2019-12-03',
    gender: 'Male',
    classId: 'cls-4', // Class 1 A (₹36,000)
    parentId: 'par-1',
    phone: '+91 98220 11982',
    address: 'Flat 402, Mayur Residency, Baner, Pune',
    admissionDate: '2022-06-15',
    status: 'Active',
    rollNumber: '11'
  },
  {
    id: 'stu-12',
    studentId: 'STU-2026-012',
    firstName: 'Tanvi',
    lastName: 'Patil',
    dateOfBirth: '2017-06-14',
    gender: 'Female',
    classId: 'cls-6', // Class 3 A (₹40,000)
    parentId: 'par-2',
    phone: '+91 98901 33421',
    address: 'B-12, Green Acres Society, Aundh, Pune',
    admissionDate: '2020-06-20',
    status: 'Active',
    rollNumber: '12'
  },
  {
    id: 'stu-13',
    studentId: 'STU-2026-013',
    firstName: 'Atharva',
    lastName: 'Joshi',
    dateOfBirth: '2018-02-18',
    gender: 'Male',
    classId: 'cls-5', // Class 2 A (₹38,000)
    parentId: 'par-4',
    phone: '+91 98233 44556',
    address: 'Plot 19, Anand Park, Aundh, Pune',
    admissionDate: '2021-06-14',
    status: 'Active',
    rollNumber: '13'
  },
  {
    id: 'stu-14',
    studentId: 'STU-2026-014',
    firstName: 'Avani',
    lastName: 'Kulkarni',
    dateOfBirth: '2016-09-05',
    gender: 'Female',
    classId: 'cls-7', // Class 4 A (₹42,000)
    parentId: 'par-3',
    phone: '+91 97632 99014',
    address: '78 Prabhat Road, Lane 4, Erandwane, Pune',
    admissionDate: '2019-06-18',
    status: 'Active',
    rollNumber: '14'
  },
  {
    id: 'stu-15',
    studentId: 'STU-2026-015',
    firstName: 'Karan',
    lastName: 'Deshmukh',
    dateOfBirth: '2015-04-17',
    gender: 'Male',
    classId: 'cls-8', // Class 5 A (₹45,000)
    parentId: 'par-5',
    phone: '+91 94220 88123',
    address: 'Row House 3, Shivalik Hills, Kothrud, Pune',
    admissionDate: '2018-06-15',
    status: 'Deactivated',
    rollNumber: '15'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-2026-0891',
    studentId: 'stu-1', // Aarav Sharma (Total ₹30,000)
    amountPaid: 20000,
    paymentDate: '2026-09-22',
    paymentMode: 'UPI',
    remarks: 'Term 1 & Term 2 Installment'
  },
  {
    id: 'pay-2',
    receiptNumber: 'REC-2026-0890',
    studentId: 'stu-2', // Anaya Patil (Total ₹32,000)
    amountPaid: 32000,
    paymentDate: '2026-09-21',
    paymentMode: 'Bank Transfer',
    remarks: 'Full Annual Fee Payment'
  },
  {
    id: 'pay-3',
    receiptNumber: 'REC-2026-0889',
    studentId: 'stu-3', // Vivaan Kulkarni (Total ₹28,000)
    amountPaid: 28000,
    paymentDate: '2026-09-20',
    paymentMode: 'UPI',
    remarks: 'Full Annual Fee Payment'
  },
  {
    id: 'pay-4',
    receiptNumber: 'REC-2026-0888',
    studentId: 'stu-4', // Myra Joshi (Total ₹30,000)
    amountPaid: 25000,
    paymentDate: '2026-09-19',
    paymentMode: 'Cash',
    remarks: 'Advance Term Fee'
  },
  {
    id: 'pay-5',
    receiptNumber: 'REC-2026-0887',
    studentId: 'stu-5', // Kabir Deshmukh (Total ₹36,000)
    amountPaid: 26000,
    paymentDate: '2026-09-18',
    paymentMode: 'Bank Transfer',
    remarks: 'Term 1 & 2 Paid'
  },
  {
    id: 'pay-6',
    receiptNumber: 'REC-2026-0886',
    studentId: 'stu-6', // Advait Nair (Total ₹38,000)
    amountPaid: 38000,
    paymentDate: '2026-09-17',
    paymentMode: 'UPI',
    remarks: 'Annual Tuition & Lab Fee'
  },
  {
    id: 'pay-7',
    receiptNumber: 'REC-2026-0885',
    studentId: 'stu-7', // Diya Verma (Total ₹40,000)
    amountPaid: 35000,
    paymentDate: '2026-09-15',
    paymentMode: 'Cash',
    remarks: 'Part Payment'
  },
  {
    id: 'pay-8',
    receiptNumber: 'REC-2026-0884',
    studentId: 'stu-8', // Ishaan Mehta (Total ₹42,000)
    amountPaid: 30000,
    paymentDate: '2026-09-12',
    paymentMode: 'Bank Transfer',
    remarks: 'NEFT Ref #992014'
  },
  {
    id: 'pay-9',
    receiptNumber: 'REC-2026-0883',
    studentId: 'stu-9', // Reyansh Shinde (Total ₹45,000)
    amountPaid: 35000,
    paymentDate: '2026-09-10',
    paymentMode: 'UPI',
    remarks: 'UPI Ref #8899201'
  },
  {
    id: 'pay-10',
    receiptNumber: 'REC-2026-0882',
    studentId: 'stu-10', // Saanvi Pillai (Total ₹28,000)
    amountPaid: 28000,
    paymentDate: '2026-09-08',
    paymentMode: 'Cash',
    remarks: 'Full Payment Receipt'
  },
  {
    id: 'pay-11',
    receiptNumber: 'REC-2026-0881',
    studentId: 'stu-11', // Vihaan Sharma (Total ₹36,000)
    amountPaid: 28000,
    paymentDate: '2026-09-05',
    paymentMode: 'Bank Transfer',
    remarks: 'RTGS transfer'
  },
  {
    id: 'pay-12',
    receiptNumber: 'REC-2026-0880',
    studentId: 'stu-12', // Tanvi Patil (Total ₹40,000)
    amountPaid: 40000,
    paymentDate: '2026-09-01',
    paymentMode: 'UPI',
    remarks: 'Full settlement'
  },
  {
    id: 'pay-13',
    receiptNumber: 'REC-2026-0879',
    studentId: 'stu-13', // Atharva Joshi (Total ₹38,000)
    amountPaid: 25000,
    paymentDate: '2026-08-28',
    paymentMode: 'Cash',
    remarks: 'First installment'
  },
  {
    id: 'pay-14',
    receiptNumber: 'REC-2026-0878',
    studentId: 'stu-14', // Avani Kulkarni (Total ₹42,000)
    amountPaid: 34500,
    paymentDate: '2026-08-25',
    paymentMode: 'UPI',
    remarks: 'Term 1 & Term 2'
  }
];

// Baseline attendance for Today (2026-09-23)
export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'stu-1', date: '2026-09-23', status: 'Present' },
  { id: 'att-2', studentId: 'stu-2', date: '2026-09-23', status: 'Present' },
  { id: 'att-3', studentId: 'stu-3', date: '2026-09-23', status: 'Absent', remarks: 'Parent notified: Fever' },
  { id: 'att-4', studentId: 'stu-4', date: '2026-09-23', status: 'Present' },
  { id: 'att-5', studentId: 'stu-5', date: '2026-09-23', status: 'Present' },
  { id: 'att-6', studentId: 'stu-6', date: '2026-09-23', status: 'Present' },
  { id: 'att-7', studentId: 'stu-7', date: '2026-09-23', status: 'Absent', remarks: 'Out of station' },
  { id: 'att-8', studentId: 'stu-8', date: '2026-09-23', status: 'Present' },
  { id: 'att-9', studentId: 'stu-9', date: '2026-09-23', status: 'Present' },
  { id: 'att-10', studentId: 'stu-10', date: '2026-09-23', status: 'Present' },
  { id: 'att-11', studentId: 'stu-11', date: '2026-09-23', status: 'Present' },
  { id: 'att-12', studentId: 'stu-12', date: '2026-09-23', status: 'Present' },
  { id: 'att-13', studentId: 'stu-13', date: '2026-09-23', status: 'Present' },
  { id: 'att-14', studentId: 'stu-14', date: '2026-09-23', status: 'Present' },
  // Previous day sample logs
  { id: 'att-15', studentId: 'stu-1', date: '2026-09-22', status: 'Present' },
  { id: 'att-16', studentId: 'stu-2', date: '2026-09-22', status: 'Present' },
  { id: 'att-17', studentId: 'stu-3', date: '2026-09-22', status: 'Present' },
  { id: 'att-18', studentId: 'stu-4', date: '2026-09-22', status: 'Present' },
  { id: 'att-19', studentId: 'stu-5', date: '2026-09-22', status: 'Present' },
  { id: 'att-20', studentId: 'stu-7', date: '2026-09-22', status: 'Absent' }
];
