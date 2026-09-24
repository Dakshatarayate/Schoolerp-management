import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  RotateCcw,
  CheckCheck,
  History,
  GraduationCap
} from 'lucide-react';
import { AttendanceHistoryView } from './AttendanceHistoryView';

export const AttendanceView: React.FC = () => {
  const { classes, students, attendance, saveAttendanceBatch, attendanceSummaryForDate } = useSchool();

  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-09-23');
  const [selectedClassId, setSelectedClassId] = useState(classes[1]?.id || classes[0]?.id || '');

  // Local state for the register before saving
  const [rosterStatus, setRosterStatus] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  // Active students in selected class
  const classStudents = students.filter((s) => s.classId === selectedClassId && s.status === 'Active');

  // Load existing records or default
  useEffect(() => {
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    classStudents.forEach((student) => {
      const existing = attendance.find(
        (a) => a.studentId === student.id && a.date === selectedDate
      );
      if (existing) {
        initialMap[student.id] = {
          status: existing.status,
          remarks: existing.remarks || ''
        };
      } else {
        // Default to Present
        initialMap[student.id] = {
          status: 'Present',
          remarks: ''
        };
      }
    });

    setRosterStatus(initialMap);
  }, [selectedDate, selectedClassId, students, attendance]);

  if (isViewingHistory) {
    return <AttendanceHistoryView onBackToRegister={() => setIsViewingHistory(false)} />;
  }

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleMarkAllPresent = () => {
    setRosterStatus((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = {
          ...next[s.id],
          status: 'Present'
        };
      });
      return next;
    });
  };

  const handleClearAll = () => {
    setRosterStatus((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = {
          ...next[s.id],
          status: 'Absent'
        };
      });
      return next;
    });
  };

  const handleSave = () => {
    const payload = classStudents.map((s) => ({
      studentId: s.id,
      date: selectedDate,
      status: rosterStatus[s.id]?.status || 'Present',
      remarks: rosterStatus[s.id]?.remarks || ''
    }));

    saveAttendanceBatch(payload);
  };

  const summary = attendanceSummaryForDate(selectedDate);
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-500">
            Mark morning roll call for {selectedClass?.className} - {selectedClass?.section}
          </p>
        </div>

        <button
          onClick={() => setIsViewingHistory(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <History className="w-4 h-4 text-blue-600" />
          <span>Attendance History</span>
        </button>
      </div>

      {/* Control & Date/Class Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Date:</span>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-3 pr-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono font-medium focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-hidden focus:border-blue-600"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} - Section {cls.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Bulk Batch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Today's Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Class Roster
          </span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
            {classStudents.length} Students
          </span>
          <span className="text-[11px] text-slate-500">Enrolled in section</span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Present in Section
          </span>
          <span className="text-2xl font-bold text-emerald-700 font-mono mt-1 block">
            {Object.values(rosterStatus).filter((v) => v.status === 'Present').length}
          </span>
          <span className="text-[11px] text-emerald-600">Marked present</span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block">
            Absent in Section
          </span>
          <span className="text-2xl font-bold text-rose-600 font-mono mt-1 block">
            {Object.values(rosterStatus).filter((v) => v.status === 'Absent').length}
          </span>
          <span className="text-[11px] text-rose-600">Marked absent</span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            School Total (All 8 Classes)
          </span>
          <span className="text-2xl font-bold text-blue-700 font-mono mt-1 block">
            {summary.present} / {summary.total}
          </span>
          <span className="text-[11px] text-blue-600">{summary.rate}% overall attendance</span>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {classStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">No students in this class</h4>
            <p className="text-xs text-slate-500">
              Please register or assign students to {selectedClass?.className} {selectedClass?.section}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Note / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((s) => {
                  const current = rosterStatus[s.id] || { status: 'Present', remarks: '' };

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        #{s.rollNumber || '01'}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">{s.studentId}</td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500">{s.gender}</div>
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Present')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                              current.status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Absent')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                              current.status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Late')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                              current.status === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>
                        </div>
                      </td>

                      {/* Remarks Input */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={current.remarks}
                          onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                          placeholder="Optional reason for absence or note..."
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:bg-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with Save CTA */}
        {classStudents.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Always save attendance before navigating away to ensure accurate reporting.
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Commit Roll Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
