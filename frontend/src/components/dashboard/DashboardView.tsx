import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  BookOpen,
  Wallet,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Calendar,
  ArrowRight,
  Plus,
  Receipt,
  Eye
} from 'lucide-react';

interface DashboardViewProps {
  onAddStudentClick: () => void;
  onRecordFeeClick: (studentId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onAddStudentClick,
  onRecordFeeClick
}) => {
  const {
    kpiStats,
    students,
    classes,
    payments,
    getStudentFeeInfo,
    setCurrentScreen,
    setSelectedReceiptForView,
    attendanceSummaryForDate,
    settings
  } = useSchool();

  // Compute pending students list for compact table
  const studentsWithPending = students
    .map((s) => {
      const feeInfo = getStudentFeeInfo(s.id);
      const classItem = classes.find((c) => c.id === s.classId);
      return {
        student: s,
        classItem,
        ...feeInfo
      };
    })
    .filter((s) => s.pendingFee > 0 && s.student.status === 'Active')
    .slice(0, 5);

  const recentPayments = payments.slice(0, 5);
  const todayAttendance = attendanceSummaryForDate('2026-09-23');

  return (
    <div className="space-y-6">
      {/* Welcome & Primary Actions Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Good Morning, Admin
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Term 1 Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Academic Year {settings.academicYear} • {settings.schoolName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRecordFeeClick()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-blue-600" />
            <span>Record Fee</span>
          </button>
          <button
            onClick={onAddStudentClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY KPI CARDS (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
              {kpiStats.totalStudents}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +6
              </span>
              <span className="text-slate-500">this month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Classes
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
              {kpiStats.totalClasses}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                Active Sections
              </span>
              <span className="text-slate-500">100% staffed</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Fees Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fees Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-bold text-slate-900 font-mono tracking-tight">
              ₹{kpiStats.feesCollected.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                84% of target
              </span>
              <span className="text-slate-500">Term 1+2</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending Fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Fees
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-bold text-amber-600 font-mono tracking-tight">
              ₹{kpiStats.pendingFees.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                42 overdue accounts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Attendance</h3>
            <p className="text-xs text-slate-500">
              Recorded morning roll call for 23 September 2026
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('attendance')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 items-center">
          {/* Main Visual Percentage */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall Rate
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-blue-700 font-mono">
                {todayAttendance.rate}%
              </span>
              <span className="text-xs font-semibold text-slate-600">Present</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${todayAttendance.rate}%` }}
              ></div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Present
              </span>
              <span className="text-3xl font-bold text-emerald-700 font-mono mt-1 block">
                {todayAttendance.present}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">Students in class</span>
            </div>

            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">
                Absent
              </span>
              <span className="text-3xl font-bold text-rose-600 font-mono mt-1 block">
                {todayAttendance.absent}
              </span>
              <span className="text-[11px] text-rose-600 mt-1 block">Unexcused / Leave</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Total Enrolled
              </span>
              <span className="text-3xl font-bold text-slate-800 font-mono mt-1 block">
                {todayAttendance.total}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">All 8 classes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Payments & Pending Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Payments</h3>
                <p className="text-xs text-slate-500">Real-time tuition fee receipts</p>
              </div>
              <button
                onClick={() => setCurrentScreen('fees')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All Payments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Mode</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments.map((p) => {
                    const student = students.find((s) => s.id === p.studentId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {student ? `${student.firstName} ${student.lastName}` : 'Student'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {student ? student.studentId : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{p.amountPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {p.paymentDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {p.paymentMode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedReceiptForView(p)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
            <button
              onClick={() => setCurrentScreen('fees')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View complete payment ledger →
            </button>
          </div>
        </div>

        {/* Pending Fees Compact Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pending Fees</h3>
                <p className="text-xs text-slate-500">Students with outstanding balances</p>
              </div>
              <button
                onClick={() => setCurrentScreen('fees')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All Pending Fees</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Class</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-right">Paid</th>
                    <th className="py-2.5 px-4 text-right">Pending</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsWithPending.map((item) => (
                    <tr key={item.student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.student.firstName} {item.student.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.student.studentId}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.classItem
                          ? `${item.classItem.className} ${item.classItem.section}`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ₹{item.totalFee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-medium">
                        ₹{item.paidFee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        ₹{item.pendingFee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onRecordFeeClick(item.student.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Collect Fee
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
            <button
              onClick={() => setCurrentScreen('fees')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all 42 pending fee accounts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
