"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPrinter, FiArrowLeft, FiCheckCircle, FiDownload } from "react-icons/fi";
import financeService from "@/services/finance.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function TransactionSlip() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await financeService.getTransactionById(id);
        setData(res.data);
      } catch (err) {
        toast.error("Could not load slip details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePrint = () => {
    window.print(); // Browser ka default print dialog open karega
  };

  if (loading) return <div className="p-20 text-center font-bold">Generating Slip...</div>;
  if (!data) return <div className="p-20 text-center">Transaction not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      {/* --- Action Buttons (Hidden on Print) --- */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all"
        >
          <FiArrowLeft /> Back to Ledger
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 shadow-lg transition-all"
        >
          <FiPrinter /> Print Receipt
        </button>
      </div>

      {/* --- Main Slip UI --- */}
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none print:m-0">

        {/* Header Section */}
        <div className={`p-10 text-white flex justify-between items-start ${data.transactionType === 'income' ? 'bg-emerald-600' : 'bg-slate-900'}`}>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">NEXUS</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.3em]">Asset Management System</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-widest">Official Receipt</h2>
            <p className="text-sm opacity-80">ID: {data._id.toUpperCase()}</p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Status & Amount Area */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-dashed border-slate-200">
            <div className={`mb-4 p-4 rounded-full ${data.transactionType === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <FiCheckCircle size={48} />
            </div>
            <h3 className="text-4xl font-black text-slate-900">
              {formatCurrency(data.amount)}
            </h3>
            <p className={`font-black uppercase tracking-widest text-[11px] mt-2 ${data.transactionType === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
              Transaction {data.transactionType === 'income' ? 'Received' : 'Paid Out'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
              <p className="font-bold text-slate-800">{format(new Date(data.transactionDate), "PPPP")}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
              <p className="font-bold text-slate-800 capitalize">{data.transactionType}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
              <p className="font-bold text-slate-800">{data.description}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Link</p>
              <p className="font-bold text-indigo-600">{data.project?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Associated Person</p>
              <p className="font-bold text-slate-800">{data.client?.name || data.employee?.name || "General"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="font-bold text-emerald-600 uppercase tracking-tighter text-sm">✓ Confirmed</p>
            </div>
          </div>

          {/* Remarks Section */}
          {data.remarks && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-sm">
              <p className="font-bold text-slate-400 not-italic uppercase text-[9px] mb-2 tracking-widest">Office Remarks:</p>
              "{data.remarks}"
            </div>
          )}

          {/* Footer Footer */}
          <div className="pt-10 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-100 rounded-xl mb-4 flex items-center justify-center border-2 border-slate-50">
              {/* Yahan aap QR Code library use kar sakte hain */}
              <span className="text-[10px] text-slate-300 font-bold uppercase">Digital Stamp</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">This is a computer-generated document. No signature required.</p>
          </div>
        </div>
      </div>

      {/* --- Global Print CSS --- */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\:hidden { display: none !important; }
          .print\:shadow-none { shadow: none !important; box-shadow: none !important; }
          .print\:border-none { border: none !important; }
          .print\:m-0 { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}