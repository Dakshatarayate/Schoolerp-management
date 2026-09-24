import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  UserX,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { StudentFormModal } from './StudentFormModal';
import { StudentDetailsModal } from './StudentDetailsModal';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface StudentsViewProps {
  onCollectFee: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onCollectFee }) => {
  const { students, classes, parents, deactivateStudent, activateStudent } = useSchool();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Deactivation confirmation modal
  const [studentToToggle, setStudentToToggle] = useState<Student | null>(null);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery);

      const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, searchQuery, selectedClassId, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleToggleStatusConfirm = () => {
    if (!studentToToggle) return;
    if (studentToToggle.status === 'Active') {
      deactivateStudent(studentToToggle.id);
    } else {
      activateStudent(studentToToggle.id);
    }
    setStudentToToggle(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-xs text-slate-500">
            Showing {filteredStudents.length} of {students.length} enrolled students
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID (e.g. STU-2026-001) or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
          >
            <option value="all">All Classes (8)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.className} {c.section}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-36">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">No students found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or class filters, or register a new student.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClassId('all');
                setSelectedStatus('all');
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class & Sec</th>
                  <th className="py-3 px-4">Parent / Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => {
                  const classItem = classes.find((c) => c.id === s.classId);
                  const parent = parents.find((p) => p.id === s.parentId);

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingStudent(s)}
                    >
                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {s.studentId}
                      </td>

                      {/* Student Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {s.firstName[0]}
                            {s.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {s.firstName} {s.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Roll #{s.rollNumber || '01'} • {s.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {classItem
                            ? `${classItem.className} ${classItem.section}`
                            : 'Unassigned'}
                        </span>
                      </td>

                      {/* Parent & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {parent?.parentName || 'Parent Guardian'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{s.phone}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Student Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStudentToToggle(s)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              s.status === 'Active'
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={s.status === 'Active' ? 'Deactivate Student' : 'Reactivate'}
                          >
                            {s.status === 'Active' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Form Modal (Add / Edit) */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingStudent={editingStudent}
      />

      {/* Student Details Slide-Over / Modal */}
      <StudentDetailsModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => {
          setViewingStudent(null);
          handleOpenEdit(student);
        }}
        onCollectFee={(studentId) => {
          setViewingStudent(null);
          onCollectFee(studentId);
        }}
      />

      {/* Deactivation Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!studentToToggle}
        title={
          studentToToggle?.status === 'Active'
            ? 'Deactivate Student Record?'
            : 'Reactivate Student Record?'
        }
        message={
          studentToToggle?.status === 'Active'
            ? `Are you sure you want to deactivate ${studentToToggle?.firstName} ${studentToToggle?.lastName}? They will be marked inactive and excluded from new fee billings.`
            : `Are you sure you want to reactivate ${studentToToggle?.firstName} ${studentToToggle?.lastName}?`
        }
        confirmLabel={studentToToggle?.status === 'Active' ? 'Deactivate' : 'Reactivate'}
        isDestructive={studentToToggle?.status === 'Active'}
        onConfirm={handleToggleStatusConfirm}
        onCancel={() => setStudentToToggle(null)}
      />
    </div>
  );
};
