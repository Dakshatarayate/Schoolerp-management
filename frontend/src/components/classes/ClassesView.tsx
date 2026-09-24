import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ClassItem } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Users,
  X,
  User,
  GraduationCap
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const ClassesView: React.FC = () => {
  const { classes, students, addClass, updateClass, deactivateClass, settings } = useSchool();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classToDeactivate, setClassToDeactivate] = useState<ClassItem | null>(null);

  // Form states
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('A');
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [classTeacherName, setClassTeacherName] = useState('');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [capacity, setCapacity] = useState(25);
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('');
    setSection('A');
    setAcademicYear(settings.academicYear);
    setClassTeacherName('');
    setRoomNumber('Room 101');
    setCapacity(25);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setClassName(cls.className);
    setSection(cls.section);
    setAcademicYear(cls.academicYear);
    setClassTeacherName(cls.classTeacherName || '');
    setRoomNumber(cls.roomNumber || '');
    setCapacity(cls.capacity || 25);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !section.trim()) {
      setFormError('Class name and section are required.');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, {
        className: className.trim(),
        section: section.trim().toUpperCase(),
        academicYear,
        classTeacherName: classTeacherName.trim(),
        roomNumber: roomNumber.trim(),
        capacity: Number(capacity) || 25
      });
    } else {
      addClass({
        className: className.trim(),
        section: section.trim().toUpperCase(),
        academicYear,
        classTeacherName: classTeacherName.trim(),
        roomNumber: roomNumber.trim(),
        capacity: Number(capacity) || 25,
        status: 'Active'
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Sections</h2>
          <p className="text-xs text-slate-500">
            {classes.length} active classroom sections registered for {settings.academicYear}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Class</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {classes.map((cls) => {
          // Count active enrolled students in this class
          const enrolledStudents = students.filter((s) => s.classId === cls.id);
          const enrolledCount = enrolledStudents.length;
          const maxCapacity = cls.capacity || 25;
          const fillRate = Math.min(100, Math.round((enrolledCount / maxCapacity) * 100));

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between ${
                cls.status === 'Active' ? 'border-slate-200' : 'border-slate-200 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {cls.className} - {cls.section}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {cls.academicYear}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      cls.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>

                {/* Details list */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">Teacher:</span>
                    <span className="font-medium text-slate-900 truncate">
                      {cls.classTeacherName || 'Not Assigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">Room:</span>
                    <span className="font-medium text-slate-900">{cls.roomNumber || 'Room 101'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Enrolled Roster:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {enrolledCount} / {maxCapacity}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        fillRate >= 90
                          ? 'bg-amber-500'
                          : fillRate > 0
                          ? 'bg-blue-600'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${fillRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                {cls.status === 'Active' && (
                  <button
                    onClick={() => setClassToDeactivate(cls)}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingClass ? 'Edit Class Details' : 'Create New Class'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 6 / UKG"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="A"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Teacher Name
                </label>
                <input
                  type="text"
                  value={classTeacherName}
                  onChange={(e) => setClassTeacherName(e.target.value)}
                  placeholder="e.g. Sunita Deshmukh"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="Room 104"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate confirmation */}
      <ConfirmationModal
        isOpen={!!classToDeactivate}
        title="Deactivate Classroom Section?"
        message={`Are you sure you want to deactivate ${classToDeactivate?.className} - ${classToDeactivate?.section}? Students will remain enrolled but the class will not be offered for new admissions.`}
        confirmLabel="Deactivate"
        isDestructive={true}
        onConfirm={() => {
          if (classToDeactivate) deactivateClass(classToDeactivate.id);
          setClassToDeactivate(null);
        }}
        onCancel={() => setClassToDeactivate(null)}
      />
    </div>
  );
};
