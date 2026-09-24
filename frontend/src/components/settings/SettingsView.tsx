import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Settings,
  School,
  Save,
  RotateCcw,
  ShieldCheck,
  User,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, user, logout, resetToDemoData } = useSchool();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [principalName, setPrincipalName] = useState(settings.principalName || 'Dr. Rajesh Sharma');
  const [affiliationNumber, setAffiliationNumber] = useState(
    settings.affiliationNumber || 'CBSE/AFF/1130421'
  );

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName: schoolName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      academicYear: academicYear.trim(),
      principalName: principalName.trim(),
      affiliationNumber: affiliationNumber.trim()
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">School Settings</h2>
        <p className="text-xs text-slate-500">
          Configure institutional identifiers, contact details, and session preferences
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Institution Profile</h3>
            <p className="text-xs text-slate-500">These details appear on official receipts and reports</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* School Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900 font-medium"
            />
          </div>

          {/* Principal & Affiliation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal / Head of Institution
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affiliation / Registration Code
              </label>
              <input
                type="text"
                value={affiliationNumber}
                onChange={(e) => setAffiliationNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Academic Year & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Academic Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026–27"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrative Telephone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Campus Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save School Profile</span>
          </button>
        </div>
      </form>

      {/* Admin Account & Security Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Administrator Account</h3>
            <p className="text-xs text-slate-500">Authenticated master role credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              Active Admin
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{user?.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Access Level
              </span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                Master Administrator (Owner)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Unrestricted system permissions</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset All School Data?"
        message="This will restore all students, classes, attendance records, and payments to the pristine default demo dataset (128 students, 8 classes, ₹3,84,500 collected). Any newly added records will be replaced."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={() => {
          resetToDemoData();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
