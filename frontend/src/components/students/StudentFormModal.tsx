import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStudent?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  editingStudent
}) => {
  const { classes, parents, addParent, addStudent, updateStudent, students } = useSchool();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [studentId, setStudentId] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [classId, setClassId] = useState('');
  const [parentId, setParentId] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [formError, setFormError] = useState('');

  // Quick-add parent modal inline toggle
  const [isQuickAddingParent, setIsQuickAddingParent] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');

  // Pre-fill or generate default
  useEffect(() => {
    if (editingStudent) {
      setFirstName(editingStudent.firstName);
      setLastName(editingStudent.lastName);
      setDateOfBirth(editingStudent.dateOfBirth);
      setGender(editingStudent.gender);
      setStudentId(editingStudent.studentId);
      setAdmissionDate(editingStudent.admissionDate);
      setClassId(editingStudent.classId);
      setParentId(editingStudent.parentId);
      setPhone(editingStudent.phone);
      setAddress(editingStudent.address);
      setRollNumber(editingStudent.rollNumber || '');
    } else {
      setFirstName('');
      setLastName('');
      setDateOfBirth('2021-06-15');
      setGender('Male');
      const nextNum = (students.length + 1).toString().padStart(3, '0');
      setStudentId(`STU-2026-${nextNum}`);
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setClassId(classes[0]?.id || '');
      setParentId(parents[0]?.id || '');
      setPhone(parents[0]?.phone || '+91 98220 00000');
      setAddress(parents[0]?.address || 'Baner, Pune');
      setRollNumber((students.length + 1).toString().padStart(2, '0'));
    }
    setFormError('');
    setIsQuickAddingParent(false);
  }, [editingStudent, isOpen, classes, parents, students.length]);

  if (!isOpen) return null;

  const handleParentSelect = (pid: string) => {
    setParentId(pid);
    const p = parents.find((item) => item.id === pid);
    if (p) {
      if (!phone || phone === '+91 98220 00000') setPhone(p.phone);
      if (!address || address === 'Baner, Pune') setAddress(p.address);
    }
  };

  const handleQuickAddParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName.trim() || !newParentPhone.trim()) {
      alert('Parent name and phone are required.');
      return;
    }
    const createdParent = addParent({
      parentName: newParentName.trim(),
      phone: newParentPhone.trim(),
      email: newParentEmail.trim(),
      address: address || 'Pune, Maharashtra'
    });
    setParentId(createdParent.id);
    setPhone(createdParent.phone);
    setIsQuickAddingParent(false);
    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Student First Name and Last Name are required.');
      return;
    }
    if (!studentId.trim()) {
      setFormError('Student ID is required.');
      return;
    }
    if (!classId) {
      setFormError('Please select a class.');
      return;
    }
    if (!parentId) {
      setFormError('Please select or add a parent.');
      return;
    }

    if (editingStudent) {
      const res = updateStudent(editingStudent.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        gender,
        studentId: studentId.trim(),
        admissionDate,
        classId,
        parentId,
        phone: phone.trim(),
        address: address.trim(),
        rollNumber: rollNumber.trim()
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update student.');
        return;
      }
    } else {
      const res = addStudent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        gender,
        studentId: studentId.trim(),
        admissionDate,
        classId,
        parentId,
        phone: phone.trim(),
        address: address.trim(),
        rollNumber: rollNumber.trim(),
        status: 'Active'
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to add student.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'Add New Student'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingStudent
                  ? `Updating record for ${editingStudent.studentId}`
                  : 'Enter primary academic and parent details'}
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

        {formError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Sharma"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
          </div>

          {/* Row 2: Student ID & Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="STU-2026-001"
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 01"
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
          </div>

          {/* Row 3: DOB & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 4: Class & Admission Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class & Section <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 bg-white"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className} - Section {cls.section} ({cls.academicYear})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
          </div>

          {/* Row 5: Parent Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Select Parent / Guardian <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsQuickAddingParent(!isQuickAddingParent)}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                {isQuickAddingParent ? 'Cancel New Parent' : '+ Quick Add Parent'}
              </button>
            </div>

            {isQuickAddingParent ? (
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-blue-900">
                  New Parent Quick Registration
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Parent Full Name"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Phone (+91 98...)"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleQuickAddParent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Create & Link Parent
                </button>
              </div>
            ) : (
              <select
                required
                value={parentId}
                onChange={(e) => handleParentSelect(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 bg-white"
              >
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.parentName} ({p.phone}) - {p.parentId}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Row 6: Phone & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98220 11982"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House, Area, City"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all active:scale-[0.99]"
            >
              {editingStudent ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
