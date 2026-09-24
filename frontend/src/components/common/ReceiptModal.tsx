import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, X, CheckCircle2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptForView, setSelectedReceiptForView, students, classes, settings } = useSchool();

  if (!selectedReceiptForView) return null;

  const payment = selectedReceiptForView;
  const student = students.find((s) => s.id === payment.studentId);
  const classItem = student ? classes.find((c) => c.id === student.classId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-base text-slate-900">Fee Payment Receipt</h3>
              <p className="text-xs text-slate-500 font-mono">{payment.receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedReceiptForView(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="my-6 p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-6">
          {/* School Header */}
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="font-bold text-lg text-slate-900">{settings.schoolName}</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-0.5">{settings.address}</p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-1">
              <span>Tel: {settings.phone}</span>
              <span>•</span>
              <span>Email: {settings.email}</span>
            </div>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Receipt No:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{payment.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Date:</span>
              <span className="font-semibold text-slate-900">{payment.paymentDate}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Student Name</span>
              <span className="font-semibold text-slate-900 text-sm">
                {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID / Roll</span>
              <span className="font-mono font-medium text-slate-900">
                {student ? student.studentId : 'N/A'} {student?.rollNumber ? `(#${student.rollNumber})` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Class & Section</span>
              <span className="font-medium text-slate-900">
                {classItem ? `${classItem.className} - Section ${classItem.section}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Year</span>
              <span className="font-medium text-slate-900">{settings.academicYear}</span>
            </div>
          </div>

          {/* Payment Particulars Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Payment Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">Academic Tuition & School Fee</div>
                    <div className="text-slate-500 text-[11px]">{payment.remarks || 'Regular Term Fee'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {payment.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{payment.amountPaid.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-slate-700">Total Amount Paid</td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 text-base">
                    ₹{payment.amountPaid.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 flex justify-between items-end text-xs text-slate-600 border-t border-dashed border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400">Payment Status</div>
              <div className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Recorded
              </div>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-300 pb-1 mb-1"></div>
              <span className="text-slate-500">Authorized Bursar / Admin</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setSelectedReceiptForView(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
