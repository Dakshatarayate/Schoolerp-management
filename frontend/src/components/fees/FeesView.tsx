import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeStructure, PaymentMode } from '../../types';
import {
  CreditCard,
  Plus,
  Receipt,
  Search,
  Filter,
  Eye,
  Edit2,
  AlertTriangle,
  ArrowRight,
  Layers,
  History,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';

interface FeesViewProps {
  initialTab?: 'structure' | 'collection' | 'pending' | 'history';
  onCollectFeeForStudent?: (studentId: string) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  initialTab = 'pending',
  onCollectFeeForStudent
}) => {
  const {
    classes,
    students,
    feeStructures,
    updateFeeStructure,
    addFeeStructure,
    payments,
    recordPayment,
    getStudentFeeInfo,
    setSelectedReceiptForView,
    kpiStats,
    settings
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'structure' | 'collection' | 'pending' | 'history'>(
    initialTab
  );

  // Tab 1: Structure states
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [feeClassId, setFeeClassId] = useState('');
  const [feeAmount, setFeeAmount] = useState(30000);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  // Tab 2: Collection Station states
  const [collectStudentId, setCollectStudentId] = useState<string>(students[0]?.id || '');
  const [collectAmount, setCollectAmount] = useState<number | ''>(20000);
  const [collectDate, setCollectDate] = useState<string>('2026-09-23');
  const [collectMode, setCollectMode] = useState<PaymentMode>('UPI');
  const [collectRemarks, setCollectRemarks] = useState<string>('Term 2 Fee');
  const [collectError, setCollectError] = useState<string>('');

  // Tab 3: Pending Fees states
  const [pendingClassFilter, setPendingClassFilter] = useState('all');
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');

  // Tab 4: History states
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyModeFilter, setHistoryModeFilter] = useState('all');

  // Compute pending students data
  const pendingStudentsList = useMemo(() => {
    return students
      .filter((s) => s.status === 'Active')
      .map((s) => {
        const feeInfo = getStudentFeeInfo(s.id);
        const cls = classes.find((c) => c.id === s.classId);
        return {
          student: s,
          classItem: cls,
          ...feeInfo
        };
      })
      .filter((item) => {
        const matchesClass = pendingClassFilter === 'all' || item.student.classId === pendingClassFilter;
        const nameOrId = `${item.student.firstName} ${item.student.lastName} ${item.student.studentId}`.toLowerCase();
        const matchesSearch = !pendingSearchQuery || nameOrId.includes(pendingSearchQuery.toLowerCase());
        return item.pendingFee > 0 && matchesClass && matchesSearch;
      });
  }, [students, classes, feeStructures, payments, pendingClassFilter, pendingSearchQuery]);

  // Compute filtered payment history
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const student = students.find((s) => s.id === p.studentId);
      const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
      const matchesSearch =
        !historySearchQuery ||
        studentName.includes(historySearchQuery.toLowerCase()) ||
        p.receiptNumber.toLowerCase().includes(historySearchQuery.toLowerCase());
      const matchesMode = historyModeFilter === 'all' || p.paymentMode === historyModeFilter;
      return matchesSearch && matchesMode;
    });
  }, [payments, students, historySearchQuery, historyModeFilter]);

  // Handle Fee Structure Modal Save
  const handleSaveFeeStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFee) {
      updateFeeStructure(editingFee.id, {
        totalAnnualFee: Number(feeAmount)
      });
    } else {
      addFeeStructure({
        classId: feeClassId,
        academicYear: settings.academicYear,
        totalAnnualFee: Number(feeAmount),
        status: 'Active'
      });
    }
    setIsFeeModalOpen(false);
  };

  // Handle Tab 2 In-Page Payment Submission
  const selectedStudentForTab = students.find((s) => s.id === collectStudentId);
  const selectedClassForTab = selectedStudentForTab
    ? classes.find((c) => c.id === selectedStudentForTab.classId)
    : null;
  const currentFeeInfo = selectedStudentForTab ? getStudentFeeInfo(selectedStudentForTab.id) : null;

  const handleInPagePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCollectError('');

    const num = Number(collectAmount);
    if (!collectStudentId) {
      setCollectError('Please select a student.');
      return;
    }
    if (!collectAmount || num <= 0) {
      setCollectError('Please enter a valid positive payment amount.');
      return;
    }

    const createdPayment = recordPayment({
      studentId: collectStudentId,
      amountPaid: num,
      paymentDate: collectDate,
      paymentMode: collectMode,
      remarks: collectRemarks
    });

    // Reset amount
    setCollectAmount('');
    setSelectedReceiptForView(createdPayment);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fees & Collections</h2>
          <p className="text-xs text-slate-500">
            Manage fee structures, record collections, and view receipt ledgers
          </p>
        </div>

        {/* Global Action */}
        <button
          onClick={() => setActiveTab('collection')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.99] self-start sm:self-auto cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          <span>+ Collect Fee</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending Fees ({pendingStudentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'collection'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-blue-600" />
          <span>Fee Collection Station</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-purple-600" />
          <span>Payment History ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'structure'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-600" />
          <span>Fee Structure</span>
        </button>
      </div>

      {/* TAB 1: PENDING FEES (Default) */}
      {activeTab === 'pending' && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Students with Pending Fees
                </span>
                <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
                  {pendingStudentsList.length} Students
                </div>
                <div className="text-xs text-slate-500 mt-1">Active accounts with balance</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Pending Amount
                </span>
                <div className="text-3xl font-bold text-amber-600 font-mono mt-1">
                  ₹{kpiStats.pendingFees.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-1">Outstanding school receivables</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Search & Class Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={pendingSearchQuery}
                onChange={(e) => setPendingSearchQuery(e.target.value)}
                placeholder="Search student with pending balance..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={pendingClassFilter}
                onChange={(e) => setPendingClassFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
              >
                <option value="all">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className} {c.section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {pendingStudentsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No students with pending fees matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4 text-right">Total Annual Fee</th>
                      <th className="py-3 px-4 text-right">Amount Paid</th>
                      <th className="py-3 px-4 text-right">Pending Balance</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingStudentsList.map((item) => (
                      <tr key={item.student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {item.student.firstName} {item.student.lastName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {item.student.studentId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {item.classItem
                            ? `${item.classItem.className} ${item.classItem.section}`
                            : '-'}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                          ₹{item.totalFee.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-medium">
                          ₹{item.paidFee.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600">
                          ₹{item.pendingFee.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              if (onCollectFeeForStudent) {
                                onCollectFeeForStudent(item.student.id);
                              } else {
                                setCollectStudentId(item.student.id);
                                setCollectAmount(item.pendingFee);
                                setActiveTab('collection');
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Collect Fee
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
      )}

      {/* TAB 2: IN-PAGE COLLECTION STATION */}
      {activeTab === 'collection' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg text-slate-900">Tuition Fee Collection Desk</h3>
            <p className="text-xs text-slate-500">
              Select a student to inspect dues and generate verified fee receipts
            </p>
          </div>

          {collectError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{collectError}</span>
            </div>
          )}

          <form onSubmit={handleInPagePayment} className="space-y-4">
            {/* Student Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Student <span className="text-rose-500">*</span>
              </label>
              <select
                value={collectStudentId}
                onChange={(e) => {
                  setCollectStudentId(e.target.value);
                  const s = students.find((item) => item.id === e.target.value);
                  if (s) {
                    const info = getStudentFeeInfo(s.id);
                    setCollectAmount(info.pendingFee > 0 ? info.pendingFee : 0);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 bg-white"
              >
                {students
                  .filter((s) => s.status === 'Active')
                  .map((s) => {
                    const c = classes.find((cls) => cls.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.studentId}) — {c?.className} {c?.section}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Dynamic Status Card */}
            {selectedStudentForTab && currentFeeInfo && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedStudentForTab.firstName} {selectedStudentForTab.lastName}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({selectedClassForTab?.className} - {selectedClassForTab?.section})
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 font-semibold">
                    {selectedStudentForTab.studentId}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                      Total Annual Fee
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-base mt-0.5 block">
                      ₹{currentFeeInfo.totalFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 block">
                      Paid So Far
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-base mt-0.5 block">
                      ₹{currentFeeInfo.paidFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-amber-700 block">
                      Outstanding Dues
                    </span>
                    <span className="font-mono font-bold text-amber-600 text-base mt-0.5 block">
                      ₹{currentFeeInfo.pendingFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Amount & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={collectAmount}
                    onChange={(e) =>
                      setCollectAmount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="e.g. 15000"
                    className="w-full pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={collectDate}
                  onChange={(e) => setCollectDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Mode & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  value={collectMode}
                  onChange={(e) => setCollectMode(e.target.value as PaymentMode)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT / IMPS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Remarks
                </label>
                <input
                  type="text"
                  value={collectRemarks}
                  onChange={(e) => setCollectRemarks(e.target.value)}
                  placeholder="e.g. Term 1 Tuition Fee"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Record Payment & View Receipt →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search payment by receipt number (e.g. REC-2026-0891) or student..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={historyModeFilter}
                onChange={(e) => setHistoryModeFilter(e.target.value)}
                className="w-full md:w-44 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
              >
                <option value="all">All Payment Modes</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No payment receipts found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Receipt No</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4 text-right">Amount Paid</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Remarks</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((p) => {
                      const student = students.find((s) => s.id === p.studentId);
                      const cls = student ? classes.find((c) => c.id === student.classId) : null;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {p.receiptNumber}
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {student ? `${student.firstName} ${student.lastName}` : 'Student'}
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            {cls ? `${cls.className} ${cls.section}` : '-'}
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            ₹{p.amountPaid.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {p.paymentDate}
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                              {p.paymentMode}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-xs">
                            {p.remarks || '—'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedReceiptForView(p)}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FEE STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Annual Fee Schedules by Class</h3>
                <p className="text-xs text-slate-500">
                  Fixed annual tuition benchmark for {settings.academicYear}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Academic Year</th>
                    <th className="py-3 px-4 text-right">Annual Tuition Fee</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeStructures.map((fee) => {
                    const cls = classes.find((c) => c.id === fee.classId);
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {cls ? `${cls.className} - Section ${cls.section}` : 'General Class'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{fee.academicYear}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                          ₹{fee.totalAnnualFee.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {fee.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingFee(fee);
                              setFeeAmount(fee.totalAnnualFee);
                              setIsFeeModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Fee</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fee Structure Modal */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Modify Annual Fee</h3>
              <button
                onClick={() => setIsFeeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeeStructure} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Annual Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
