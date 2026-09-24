import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, PaymentMode } from '../../types';
import { X, Receipt, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudentId?: string | null;
}

export const CollectFeeModal: React.FC<CollectFeeModalProps> = ({
  isOpen,
  onClose,
  preSelectedStudentId
}) => {
  const {
    students,
    classes,
    getStudentFeeInfo,
    recordPayment,
    setSelectedReceiptForView,
    settings
  } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [paymentDate, setPaymentDate] = useState<string>('2026-09-23');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [remarks, setRemarks] = useState<string>('Term Fee Payment');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (preSelectedStudentId) {
      setSelectedStudentId(preSelectedStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [preSelectedStudentId, students, isOpen]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedClass = selectedStudent
    ? classes.find((c) => c.id === selectedStudent.classId)
    : null;
  const feeInfo = selectedStudent ? getStudentFeeInfo(selectedStudent.id) : null;

  // Auto-fill amount with pending fee by default
  useEffect(() => {
    if (feeInfo && feeInfo.pendingFee > 0) {
      setAmountPaid(feeInfo.pendingFee);
    } else if (feeInfo && feeInfo.pendingFee === 0) {
      setAmountPaid(0);
    }
  }, [selectedStudentId]);

  if (!isOpen) return null;

  const numAmount = Number(amountPaid) || 0;
  const isOverpaying = feeInfo && numAmount > feeInfo.pendingFee && feeInfo.pendingFee > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedStudentId) {
      setError('Please select a student.');
      return;
    }
    if (!amountPaid || numAmount <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    const createdPayment = recordPayment({
      studentId: selectedStudentId,
      amountPaid: numAmount,
      paymentDate,
      paymentMode,
      remarks: remarks.trim()
    });

    onClose();
    // Open receipt modal right after recording payment
    setSelectedReceiptForView(createdPayment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Record Fee Collection</h3>
              <p className="text-xs text-slate-500">
                Log tuition payment & generate official receipt
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

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 bg-white"
            >
              {students
                .filter((s) => s.status === 'Active')
                .map((s) => {
                  const cls = classes.find((c) => c.id === s.classId);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.studentId}) — {cls?.className} {cls?.section}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Student Live Fee Card */}
          {selectedStudent && feeInfo && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </span>
                  <span className="text-slate-500 ml-2">
                    Class: {selectedClass?.className} {selectedClass?.section}
                  </span>
                </div>
                <span className="font-mono text-slate-500">{selectedStudent.studentId}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Total Fee</span>
                  <span className="font-bold text-slate-800 font-mono">
                    ₹{feeInfo.totalFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase block">Paid So Far</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    ₹{feeInfo.paidFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-700 uppercase block">Outstanding</span>
                  <span className="font-bold text-amber-600 font-mono">
                    ₹{feeInfo.pendingFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Overpayment warning */}
          {isOverpaying && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Entered amount (₹{numAmount.toLocaleString('en-IN')}) exceeds remaining balance of ₹
                {feeInfo?.pendingFee.toLocaleString('en-IN')}. The surplus will be credited as an advance.
              </span>
            </div>
          )}

          {/* Row 2: Amount Paid & Date */}
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
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 10000"
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
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Row 3: Mode & Auto Receipt No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer / NEFT / IMPS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt Number (Auto Generated)
              </label>
              <input
                type="text"
                disabled
                value="Auto-generated on submit"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-100 text-slate-500 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Remarks / Notes
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Term 2 Tuition Fee installment / Ref #88910"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Payment & Print Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
