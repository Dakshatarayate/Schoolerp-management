import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Parent } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Eye,
  Phone,
  Mail,
  MapPin,
  X,
  Briefcase
} from 'lucide-react';

export const ParentsView: React.FC = () => {
  const { parents, students, addParent, updateParent } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [viewingParent, setViewingParent] = useState<Parent | null>(null);

  // Form states
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState('');

  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.parentName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        p.parentId.toLowerCase().includes(q)
      );
    });
  }, [parents, searchQuery]);

  const handleOpenAdd = () => {
    setEditingParent(null);
    setParentName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setOccupation('');
    setError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setEditingParent(p);
    setParentName(p.parentName);
    setPhone(p.phone);
    setEmail(p.email || '');
    setAddress(p.address);
    setOccupation(p.occupation || '');
    setError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) {
      setError('Parent name and phone number are required.');
      return;
    }

    if (editingParent) {
      updateParent(editingParent.id, {
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        occupation: occupation.trim()
      });
    } else {
      addParent({
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim() || 'Pune, Maharashtra',
        occupation: occupation.trim()
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Parent Directory</h2>
          <p className="text-xs text-slate-500">
            Registered guardians and emergency contacts ({parents.length})
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Parent</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parent by name, phone (+91), or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredParents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">No parents found</h4>
            <p className="text-xs text-slate-500">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Parent ID</th>
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Linked Students</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParents.map((p) => {
                  const linkedStudents = students.filter((s) => s.parentId === p.id);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setViewingParent(p)}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {p.parentId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.parentName}</div>
                        {p.occupation && (
                          <div className="text-[11px] text-slate-400">{p.occupation}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.phone}</td>

                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">
                        {p.email || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {linkedStudents.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">None linked</span>
                          ) : (
                            linkedStudents.map((ls) => (
                              <span
                                key={ls.id}
                                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px]"
                              >
                                {ls.firstName} ({ls.studentId})
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingParent(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Parent Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="w-4 h-4" />
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

      {/* Add / Edit Parent Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingParent ? 'Edit Parent Profile' : 'Add New Parent'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Sanjay Sharma"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 11982"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Occupation / Work
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Consultant / Architect"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
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
                  Save Parent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parent Details Modal with Linked Students */}
      {viewingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{viewingParent.parentName}</h3>
                <span className="text-xs font-mono text-slate-500">{viewingParent.parentId}</span>
              </div>
              <button
                onClick={() => setViewingParent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{viewingParent.phone}</span>
              </div>
              {viewingParent.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{viewingParent.email}</span>
                </div>
              )}
              {viewingParent.occupation && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>{viewingParent.occupation}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{viewingParent.address}</span>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="font-semibold text-slate-700 block mb-2">
                  Enrolled Wards / Students:
                </span>
                <div className="space-y-2">
                  {students.filter((s) => s.parentId === viewingParent.id).length === 0 ? (
                    <p className="text-slate-500 italic">No students linked to this profile.</p>
                  ) : (
                    students
                      .filter((s) => s.parentId === viewingParent.id)
                      .map((s) => (
                        <div
                          key={s.id}
                          className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">
                              {s.firstName} {s.lastName}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">{s.studentId}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                            {s.status}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setViewingParent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
