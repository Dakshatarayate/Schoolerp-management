import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BarChart3,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { classes, students, feeStructures, payments, getStudentFeeInfo, attendanceSummaryForDate, settings } = useSchool();

  const [activeReport, setActiveReport] = useState<'overview' | 'students' | 'attendance' | 'fees'>('overview');
  const [selectedReportDate, setSelectedReportDate] = useState('2026-09-23');

  // Compute student class breakdown
  const studentReportData = classes.map((cls) => {
    const classStudents = students.filter((s) => s.classId === cls.id);
    const active = classStudents.filter((s) => s.status === 'Active').length;
    const boys = classStudents.filter((s) => s.gender === 'Male').length;
    const girls = classStudents.filter((s) => s.gender === 'Female').length;
    return {
      classItem: cls,
      total: classStudents.length,
      active,
      boys,
      girls,
      capacity: cls.capacity || 25
    };
  });

  // Compute fee class breakdown
  const feeReportData = classes.map((cls) => {
    const classStudents = students.filter((s) => s.classId === cls.id && s.status === 'Active');
    const feeConfig = feeStructures.find((f) => f.classId === cls.id);
    const annualRate = feeConfig ? feeConfig.totalAnnualFee : 30000;
    const totalExpected = classStudents.length * annualRate;

    let collected = 0;
    classStudents.forEach((s) => {
      const info = getStudentFeeInfo(s.id);
      collected += info.paidFee;
    });

    const pending = Math.max(0, totalExpected - collected);
    const collectionRate = totalExpected > 0 ? Math.round((collected / totalExpected) * 100) : 0;

    return {
      classItem: cls,
      studentCount: classStudents.length,
      annualRate,
      totalExpected,
      collected,
      pending,
      collectionRate
    };
  });

  const overallExpected = feeReportData.reduce((acc, curr) => acc + curr.totalExpected, 0);
  const overallCollected = feeReportData.reduce((acc, curr) => acc + curr.collected, 0);
  const overallPending = feeReportData.reduce((acc, curr) => acc + curr.pending, 0);

  const attendanceSummary = attendanceSummaryForDate(selectedReportDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Reports</h2>
          <p className="text-xs text-slate-500">
            Operational summaries and performance analytics for {settings.schoolName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeReport !== 'overview' && (
            <button
              onClick={() => setActiveReport('overview')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              ← Back to Reports Menu
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW SCREEN: 3 PRIMARY REPORT CARDS */}
      {activeReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report 1: Student Enrollment Report */}
            <div
              onClick={() => setActiveReport('students')}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Student Enrollment Report</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Total student headcounts, gender distributions, and occupancy breakdown across all 8 classes.
                </p>

                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Registered</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {students.length} Students
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View Class Distribution</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Report 2: Attendance Summary Report */}
            <div
              onClick={() => setActiveReport('attendance')}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Daily Attendance Report</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Daily presence and absence tallies with overall attendance percentage.
                </p>

                <div className="mt-5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-800 font-medium">Today's Attendance</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">
                    {attendanceSummary.rate}%
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Inspect Daily Log</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Report 3: Fee Reconciliation Report */}
            <div
              onClick={() => setActiveReport('fees')}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Fee Reconciliation Report</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Full annual ledger comparison: expected billing, actual collection, and pending dues by class.
                </p>

                <div className="mt-5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                  <span className="text-xs text-amber-800 font-medium">Pending Dues</span>
                  <span className="text-xl font-bold font-mono text-amber-600">
                    ₹{overallPending.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                <span>View Full Reconciliation</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 1 DETAIL: STUDENTS REPORT */}
      {activeReport === 'students' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900">Student Enrollment by Class</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demographic distribution and section capacity audit
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Class Teacher</th>
                    <th className="py-3 px-4 text-center">Active Enrolled</th>
                    <th className="py-3 px-4 text-center">Boys</th>
                    <th className="py-3 px-4 text-center">Girls</th>
                    <th className="py-3 px-4 text-right">Capacity / Occupancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentReportData.map((row) => (
                    <tr key={row.classItem.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {row.classItem.className} {row.classItem.section}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {row.classItem.classTeacherName || 'Assigned Staff'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                        {row.active}
                      </td>
                      <td className="py-3 px-4 text-center text-blue-700 font-medium">
                        {row.boys}
                      </td>
                      <td className="py-3 px-4 text-center text-purple-700 font-medium">
                        {row.girls}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {row.active} / {row.capacity} ({Math.round((row.active / row.capacity) * 100)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="py-3 px-4 text-slate-900">Total School Roster</td>
                    <td className="py-3 px-4 text-center font-mono text-blue-700 text-sm">
                      {students.length}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-blue-700">
                      {students.filter((s) => s.gender === 'Male').length}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-purple-700">
                      {students.filter((s) => s.gender === 'Female').length}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      {students.length} / 200 (64%)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2 DETAIL: ATTENDANCE REPORT */}
      {activeReport === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Attendance Register Summary</h3>
                <p className="text-xs text-slate-500">Roll call log for selected date</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Select Date:</span>
                <input
                  type="date"
                  value={selectedReportDate}
                  onChange={(e) => setSelectedReportDate(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-slate-50 font-mono font-medium"
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Total Enrolled
                </span>
                <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                  {attendanceSummary.total}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-semibold text-emerald-800 block">
                  Present
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                  {attendanceSummary.present}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] uppercase font-semibold text-rose-800 block">
                  Absent
                </span>
                <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">
                  {attendanceSummary.absent}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] uppercase font-semibold text-blue-800 block">
                  Overall Rate
                </span>
                <span className="text-2xl font-bold font-mono text-blue-700 mt-1 block">
                  {attendanceSummary.rate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3 DETAIL: FEE REPORT */}
      {activeReport === 'fees' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900">Fee Reconciliation by Class</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Annual tuition billings vs received payments for {settings.academicYear}
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Enrolled</th>
                    <th className="py-3 px-4 text-right">Fee Per Student</th>
                    <th className="py-3 px-4 text-right">Expected Revenue</th>
                    <th className="py-3 px-4 text-right">Collected (₹)</th>
                    <th className="py-3 px-4 text-right">Pending Balance (₹)</th>
                    <th className="py-3 px-4 text-center">Collection %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeReportData.map((row) => (
                    <tr key={row.classItem.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {row.classItem.className} {row.classItem.section}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{row.studentCount}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ₹{row.annualRate.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                        ₹{row.totalExpected.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        ₹{row.collected.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        ₹{row.pending.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {row.collectionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-slate-900">School Aggregate</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900 text-sm">
                      ₹{overallExpected.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 text-sm">
                      ₹{overallCollected.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 text-sm">
                      ₹{overallPending.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-blue-700">
                      {Math.round((overallCollected / overallExpected) * 100)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
