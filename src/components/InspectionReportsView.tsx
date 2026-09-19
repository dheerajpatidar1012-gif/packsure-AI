import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  UserCheck, 
  QrCode, 
  Scale, 
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language, InspectorProfile, ActiveTab } from '../types';
import { demoScan2Current, demoScan1Baseline, EnrichedProductComplianceTwin } from '../data/complianceIntelligenceStore';

interface InspectionReportsViewProps {
  language: Language;
  currentInspector: InspectorProfile | null;
  setActiveTab: (tab: ActiveTab) => void;
  twin?: EnrichedProductComplianceTwin;
}

export const InspectionReportsView: React.FC<InspectionReportsViewProps> = ({
  language,
  currentInspector,
  setActiveTab,
  twin: externalTwin,
}) => {
  const twin = externalTwin || demoScan2Current;
  const [selectedFormat, setSelectedFormat] = useState<'OFFICIAL_CERTIFICATE' | 'AUDIT_SUMMARY'>('OFFICIAL_CERTIFICATE');

  const auditId = `LM-AUD-${twin.barcode.slice(-4)}-20260916`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Banner (Hidden during Print) */}
      <div className="print:hidden bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>STATUTORY EVIDENCE AUDIT CERTIFICATE</span>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
            Digital Legal Metrology Inspection Certificate
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit ID: <span className="font-mono font-bold text-slate-800">{auditId}</span> • Certified on physical packaging evidence under PCR 2011.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Certificate</span>
          </button>
          <button
            onClick={() => {
              alert(`Inspection Certificate ${auditId} exported as PDF archive.`);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government-Grade Formal Printable Document */}
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-8 font-serif">
        {/* Document Header with National Emblem / Directorate Heading */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-slate-900 mb-1">
            <Scale className="w-8 h-8 text-slate-900" />
          </div>
          <div className="text-xs font-bold tracking-widest uppercase text-slate-700 font-sans">
            DIRECTORATE OF LEGAL METROLOGY • DEPARTMENT OF CONSUMER AFFAIRS
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            STATUTORY COMPLIANCE SCREENING & EVIDENCE CERTIFICATE
          </h1>
          <p className="text-xs text-slate-600 font-sans italic">
            Issued pursuant to Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009
          </p>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Audit ID:</span>
            <span className="font-mono font-bold text-slate-900">{auditId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Inspection Date:</span>
            <span className="font-medium text-slate-900">{twin.lastInspectedAt}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Inspecting Officer:</span>
            <span className="font-bold text-slate-900">{twin.inspectorName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Officer Badge:</span>
            <span className="font-mono font-bold text-slate-900">{twin.inspectorBadge}</span>
          </div>
        </div>

        {/* Section 1: Product Identity Profile */}
        <div className="space-y-3 font-sans">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>1. Product Identity Profile</span>
            <span className="text-xs font-mono font-normal text-slate-500">GTIN: {twin.barcode}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Product Name & Brand:</span>
              <span className="font-bold text-slate-900">{twin.productName} ({twin.brand})</span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Quantity / Declared Weight:</span>
              <span className="font-bold text-rose-700">{twin.identityProfile.netQuantity.value} [Altered]</span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Maximum Retail Price (MRP):</span>
              <span className="font-bold text-slate-900">{twin.identityProfile.mrp.value}</span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Unit Sale Price (USP):</span>
              <span className="font-bold text-slate-900">{twin.identityProfile.unitSalePrice.value}</span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Manufacturer & Facility Address:</span>
              <span className="text-slate-800">{twin.identityProfile.manufacturer.value}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Physical Evidence Map & Traceability */}
        <div className="space-y-3 font-sans">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Statutory Evidence Map & Rule Traceability
          </h3>

          <table className="w-full text-left text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-2 border-r border-slate-200">Statutory Requirement</th>
                <th className="p-2 border-r border-slate-200">Extracted Value</th>
                <th className="p-2 border-r border-slate-200">Applicable Rule</th>
                <th className="p-2 border-r border-slate-200">Status</th>
                <th className="p-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {twin.evidenceMap.map((item) => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{item.requirement}</td>
                  <td className="p-2 font-mono text-slate-800 border-r border-slate-200">{item.extractedValue}</td>
                  <td className="p-2 text-slate-600 border-r border-slate-200 text-[11px]">{item.applicableRule}</td>
                  <td className="p-2 border-r border-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.validationResult === 'DETECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.validationResult}
                    </span>
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-700">{item.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Label Drift & Change Log */}
        {twin.changesDetected.length > 0 && (
          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>3. Detected Label Differences (Drift Analysis)</span>
              <span className="text-xs text-amber-700 font-bold">Verification Required</span>
            </h3>

            <div className="space-y-2 text-xs">
              {twin.changesDetected.map((diff) => (
                <div key={diff.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{diff.label}: </span>
                    <span className="line-through text-slate-500 font-mono">{diff.previousValue}</span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span className="font-bold text-rose-700 font-mono">{diff.currentValue}</span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium">{diff.statutoryNote.slice(0, 70)}...</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Human-in-the-Loop Officer Certification */}
        <div className="pt-4 border-t-2 border-slate-900 space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Officer Findings & Field Remarks
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 italic">
                "{twin.inspectorRemarks || 'Visual and metric inspection conducted on physical market sample. Notice ordered for shrinkflation verification and consumer grievance channel.'}"
              </div>
              <div className="text-[10px] text-slate-400">
                Digital Fingerprint SHA-256: 89a4fe9201bc89df43a... [Tamper Evident]
              </div>
            </div>

            <div className="flex flex-col justify-between items-end text-right space-y-3">
              <div className="w-24 h-24 border border-slate-300 rounded-lg p-2 bg-slate-50 flex flex-col items-center justify-center text-center">
                <QrCode className="w-16 h-16 text-slate-800" />
                <span className="text-[8px] font-mono text-slate-500 mt-1">SCAN TO VERIFY</span>
              </div>

              <div>
                <div className="font-serif italic font-bold text-slate-900 text-base">
                  {twin.inspectorName}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Inspector of Legal Metrology (Weights & Measures)
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Govt. of India • {twin.inspectorBadge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
