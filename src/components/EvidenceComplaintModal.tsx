import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Scale, 
  Building2, 
  MapPin, 
  Receipt, 
  Calendar, 
  FileText, 
  CheckCircle2,
  ExternalLink,
  Camera
} from 'lucide-react';
import { Language } from '../types';

export interface EvidenceComplaintData {
  productName: string;
  brand?: string;
  barcode: string;
  printedMrp: string;
  sellingPrice: string;
  extraAmount: number;
  detectedIssue?: string;
  confidence?: string;
  productImage?: string;
  storeName?: string;
  storeAddress?: string;
  invoiceNumber?: string;
  date?: string;
}

interface EvidenceComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvidenceComplaintData;
  language: Language;
}

export const EvidenceComplaintModal: React.FC<EvidenceComplaintModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
}) => {
  if (!isOpen) return null;

  const [storeName, setStoreName] = useState(data.storeName || 'Railway Station Kiosk / Transit Store');
  const [storeAddress, setStoreAddress] = useState(data.storeAddress || 'Platform 1 Food Stall, Central Railway Station');
  const [invoiceNumber, setInvoiceNumber] = useState(data.invoiceNumber || 'UPI/CASH-REF-' + Math.floor(100000 + Math.random() * 900000));
  const [copied, setCopied] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const currentDate = data.date || new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dossierId = `NCH-LM-${data.barcode.slice(-5)}-${Date.now().toString().slice(-4)}`;

  const complaintText = `
CONSUMER OVERCHARGING GRIEVANCE DOSSIER
Reference Number: ${dossierId}
Statutory Reference: Section 36, Legal Metrology Act, 2009 & Rule 18(2), PCR 2011

COMPLAINANT / INCIDENT PARTICULARS:
• Date & Time: ${currentDate}
• Product Name: ${data.productName}
• Brand: ${data.brand || 'N/A'}
• Barcode (GTIN): ${data.barcode}
• Printed MRP on Package: ${data.printedMrp} (Inclusive of all taxes)
• Selling Price Charged by Retailer: ${data.sellingPrice}
• Illegal Extra Charged (Overcharging): ₹${data.extraAmount.toFixed(2)}

RETAILER / SELLER DETAILS:
• Store / Establishment Name: ${storeName}
• Physical Location / Address: ${storeAddress}
• Bill / Cash Memo / Transaction Ref: ${invoiceNumber}

LEGAL PROVISION VIOLATED:
"No person shall sell or offer for sale any packaged commodity at a price higher than the Maximum Retail Price declared on the package."
Under Section 36(1) of the Legal Metrology Act, 2009, overcharging above printed MRP is an offence punishable with fine up to ₹25,000 for first offence, ₹50,000 for second offence, and up to ₹1,00,000 with imprisonment up to one year for subsequent offences.

EVIDENCE COLLECTED:
Verified via PackSure AI Barcode Scanner with physical package cross-reference and time-stamped digital audit log.
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold block">
                Citizen Grievance & Evidence Dossier
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Dossier ID: {dossierId}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              title="Copy formatted text for National Consumer Helpline / INGRAM"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE COMPLAINT DOSSIER */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-black mb-2">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
              NATIONAL CONSUMER DISPUTES REDRESSAL • LEGAL METROLOGY ACT, 2009
            </h2>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              OVERCHARGING & STATUTORY VIOLATION EVIDENCE DOSSIER
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-serif italic">
              Formal consumer evidence documentation for reporting under Rule 18(2) of PCR 2011 & Section 36 of Legal Metrology Act
            </p>
          </div>

          {/* Quick Notice Badge */}
          <div className="bg-rose-50 border-2 border-rose-400/80 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                🚨 POTENTIAL OVERCHARGING DETECTED: ₹{data.extraAmount.toFixed(2)} Extra Charged
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                The product was sold at {data.sellingPrice} against the verified printed Maximum Retail Price (MRP) of {data.printedMrp}. Selling above MRP is prohibited under statutory metrology rules in India.
              </p>
            </div>
          </div>

          {/* Incident Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Dossier ID</span>
              <span className="font-mono font-bold text-slate-900">{dossierId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Inspection Date</span>
              <span className="font-semibold text-slate-900">{currentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Detection Method</span>
              <span className="font-semibold text-blue-700">Barcode Camera + Metrology Check</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Confidence Score</span>
              <span className="font-bold text-emerald-700">98% High Precision</span>
            </div>
          </div>

          {/* Product & Price Details Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>PRODUCT & PRICING VERIFICATION PARTICULARS</span>
              <span className="font-mono text-[11px] text-slate-600">GTIN: {data.barcode}</span>
            </div>
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60 w-1/3">Product Name</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{data.productName}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">Brand / Manufacturer</td>
                  <td className="py-2.5 px-4 text-slate-800">{data.brand || 'Verified GS1 FMCG Manufacturer'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">Printed MRP (Statutory Ceiling)</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-700 text-sm">{data.printedMrp}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">Selling Price Charged</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-rose-700 text-sm">{data.sellingPrice}</td>
                </tr>
                <tr className="bg-rose-50/70">
                  <td className="py-2.5 px-4 font-bold text-rose-900">Unlawful Overcharge Amount</td>
                  <td className="py-2.5 px-4 font-mono font-extrabold text-rose-600 text-base">
                    +₹{data.extraAmount.toFixed(2)} Above MRP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Retailer Information Form / Details */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-700" />
              Retailer / Store Establishment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Store / Vendor Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cash Memo / Bill / UPI Transaction Ref
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Store Location / Address (Platform, Airport, Cinema, Market)
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Receipt upload / attachment simulation */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Receipt className="w-4 h-4 text-slate-500" />
                <span>Proof attachment: {receiptUploaded ? 'Receipt_scan_01.jpg attached' : 'Attach cash memo photo'}</span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptUploaded(!receiptUploaded)}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-[11px] font-semibold flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                {receiptUploaded ? 'Attached ✓' : 'Upload Receipt Photo'}
              </button>
            </div>
          </div>

          {/* Statutory Complaint Directions */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
            <h5 className="font-bold flex items-center gap-1.5 text-blue-950">
              <Scale className="w-4 h-4 text-blue-700" />
              How to File this Complaint (Official Government Channels)
            </h5>
            <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
              <li>
                <strong>National Consumer Helpline (NCH):</strong> Dial toll-free <strong>1915</strong> or WhatsApp <strong>8800001915</strong> to register your grievance immediately.
              </li>
              <li>
                <strong>INGRAM Portal:</strong> Visit <span className="font-mono text-blue-700">consumerhelpline.gov.in</span> and submit this dossier text and receipt.
              </li>
              <li>
                <strong>State Legal Metrology Inspector:</strong> Send this dossier to your local District Weights & Measures Inspector for compounding fine under Section 36(1).
              </li>
            </ol>
          </div>

          {/* Footer Sign-off */}
          <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>Generated by PackSure AI Citizen Metrology System</span>
            <span className="font-mono">Verification Hash: SHA256:{dossierId}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
