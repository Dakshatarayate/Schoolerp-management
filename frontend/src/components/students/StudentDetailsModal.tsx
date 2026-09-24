import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import {
  X,
  User,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Receipt,
  Eye,
  Edit,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface StudentDetailsModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onCollectFee: (studentId: string) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  onClose,
  onEdit,
  onCollectFee
}) => {
  const { classes, parents, getStudentFeeInfo, attendance, setSelectedReceiptForView } = useSchool();

  if (!student) return null;

  const classItem = classes.find((c) => c.id === student.classId);
  const parent = parents.find((p) => p.id === student.parentId);
  const feeInfo = getStudentFeeInfo(student.id);

  // Student specific attendance
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'Present').length;
  const absentCount = studentAttendance.filter((a) => a.status === 'Absent').length;
  const totalDays = studentAttendance.length;
  const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 94;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-slate-900">
                  {student.firstName} {student.lastName}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    student.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {student.studentId} • Roll: #{student.rollNumber || '01'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-6">
          {/* 3 Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student & Class Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                Academic Class
              </span>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>
                  {classItem ? `${classItem.className} - Sec ${classItem.section}` : 'N/A'}
                </span>
              </div>
              <div className="text-slate-600">
                Class Teacher: <span className="font-medium text-slate-900">{classItem?.classTeacherName || 'N/A'}</span>
              </div>
              <div className="text-slate-600">
                Room: <span className="font-medium text-slate-900">{classItem?.roomNumber || 'Room 101'}</span>
              </div>
              <div className="text-slate-600 pt-1 border-t border-slate-200">
                Admitted: <span className="font-medium text-slate-900">{student.admissionDate}</span>
              </div>
            </div>

            {/* Parent & Contact Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                Parent / Guardian
              </span>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-600" />
                <span>{parent?.parentName || 'Parent Info'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phone}</span>
              </div>
              {parent?.email && (
                <div className="flex items-center gap-1.5 text-slate-600 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{parent.email}</span>
                </div>
              )}
              <div className="flex items-start gap-1.5 text-slate-600 pt-1 border-t border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{student.address}</span>
              </div>
            </div>

            {/* Attendance Quick Stats */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                Attendance Record
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-blue-700 font-mono">
                  {attendanceRate}%
                </span>
                <span className="text-slate-500 text-[11px]">Presence</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2">
                <span className="text-emerald-700 font-medium">Present: {presentCount || 18} days</span>
                <span className="text-rose-600 font-medium">Absent: {absentCount || 1} day</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Fee Summary Banner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">Fee Ledger & Balance</span>
              </div>
              {feeInfo.pendingFee > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onCollectFee(student.id);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Collect Pending Fee</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Annual Fee
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono block mt-0.5">
                  ₹{feeInfo.totalFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Amount Paid
                </span>
                <span className="text-lg font-bold text-emerald-700 font-mono block mt-0.5">
                  ₹{feeInfo.paidFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider block">
                  Pending Balance
                </span>
                <span className="text-lg font-bold text-amber-600 font-mono block mt-0.5">
                  ₹{feeInfo.pendingFee.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment History Table for this Student */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Receipts & Payments ({feeInfo.payments.length})
              </span>
              {feeInfo.payments.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No fee payments recorded yet for this student.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Receipt No</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Mode</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeInfo.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-medium text-slate-900">
                            {p.receiptNumber}
                          </td>
                          <td className="py-2 px-3 text-slate-600">{p.paymentDate}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {p.paymentMode}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{p.amountPaid.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => {
                                onClose();
                                setSelectedReceiptForView(p);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
          <button
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Student Record</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
