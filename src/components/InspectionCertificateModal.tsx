import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  Award,
  Stamp
} from 'lucide-react';
import { ProductScanResult, Language } from '../types';

interface InspectionCertificateModalProps {
  product: ProductScanResult | null;
  onClose: () => void;
  language: Language;
}

export const InspectionCertificateModal: React.FC<InspectionCertificateModalProps> = ({
  product,
  onClose,
  language,
}) => {
  if (!product) return null;

  const isCompliant = product.status === 'COMPLIANT';
  const isPartial = product.status === 'PARTIALLY COMPLIANT';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Action Header (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold tracking-wide">
              Official Legal Metrology Audit Certificate
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL CERTIFICATE BODY */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Certificate Top Seal */}
          <div className="text-center border-b-2 border-slate-900 pb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-black mb-2 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
              Government of India • Ministry of Consumer Affairs
            </h2>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              DEPARTMENT OF LEGAL METROLOGY
            </h1>
            <p className="text-xs font-serif italic text-slate-600 mt-1">
              Certificate of Commodity Declarations Compliance Audit
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 border border-slate-800 text-[10px] font-mono font-bold tracking-wider uppercase">
              Under Section 18 / 36, Legal Metrology Act, 2009 (Rule 6, PCR 2011)
            </div>
          </div>

          {/* Certificate Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Certificate ID</span>
              <span className="font-mono font-bold text-slate-900">{product.id.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Audit Date</span>
              <span className="font-bold text-slate-900">{product.scannedAt}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Compliance Index</span>
              <span className="font-black text-blue-700 font-mono text-sm">{product.complianceScore}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Final Verdict</span>
              <span className={`font-black text-[11px] ${isCompliant ? 'text-emerald-700' : isPartial ? 'text-amber-700' : 'text-rose-700'}`}>
                {product.status}
              </span>
            </div>
          </div>

          {/* Product Specifications Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Target Packaged Commodity Specifics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Commodity Name:</span>
                <span className="font-bold text-slate-900">{product.productName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Declared Net Quantity:</span>
                <span className="font-bold text-slate-900 font-mono">{product.netQuantity}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Maximum Retail Price:</span>
                <span className="font-bold text-slate-900 font-mono">{product.mrp}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Unit Sale Price (USP):</span>
                <span className="font-bold text-slate-900 font-mono">{product.unitSalePrice || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mfg / Packing Date:</span>
                <span className="font-bold text-slate-900 font-mono">{product.manufacturingDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Country of Origin:</span>
                <span className="font-bold text-slate-900">{product.countryOfOrigin}</span>
              </div>
            </div>
            <div className="text-xs text-slate-700 pt-1">
              <span className="text-slate-500">Manufacturer/Packer:</span>{' '}
              <span className="font-medium">{product.manufacturer}, {product.address}</span>
            </div>
          </div>

          {/* Statutory Verification Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Rule 6(1) Statutory Provisions Evaluation
            </h3>
            <div className="space-y-1.5">
              {product.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100"
                >
                  <div className="flex items-center space-x-2">
                    {rule.status === 'PASS' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span className="font-medium text-slate-800">{rule.ruleName}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-600">
                    {rule.status === 'PASS' ? 'COMPLIANT' : 'INFRACTION'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Warning & Stamp */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* QR Verification */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white border border-slate-300 p-1 flex items-center justify-center rounded">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-800 block">Digitally Signed & Timestamped</span>
                <span>Scan QR code to verify certificate authenticity on the central Legal Metrology registry.</span>
              </div>
            </div>

            {/* Officer Signature & Official Stamp */}
            <div className="text-center sm:text-right">
              <div className="inline-block border-2 border-emerald-700 rounded-lg px-3 py-1 text-emerald-800 font-serif font-black text-xs uppercase tracking-widest -rotate-2 opacity-80 mb-2">
                VERIFIED & REGISTERED
              </div>
              <div className="text-xs font-bold text-slate-900">
                {product.inspectorName || 'Officer R. Sharma'}
              </div>
              <div className="text-[10px] text-slate-500">
                Inspector, Legal Metrology (Circle 4)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
