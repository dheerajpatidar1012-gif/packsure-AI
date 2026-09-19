import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Scan, 
  Layers, 
  GitCompare, 
  Eye, 
  Scale, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Barcode
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { demoScan1Baseline, demoScan2Current } from '../data/complianceIntelligenceStore';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  language,
}) => {
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleFinish = (targetTab: ActiveTab) => {
    setActiveTab(targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                PackSure AI • Interactive Inspection Walkthrough
              </h3>
              <p className="text-[11px] text-cyan-300">
                Step {step} of {totalSteps}: {
                  step === 1 ? 'First Scan & Twin Inception' :
                  step === 2 ? 'Product Compliance Twin Created' :
                  step === 3 ? 'Second Scan: Label Change Detection' :
                  step === 4 ? 'Physical Evidence Map & Coordinates' :
                  step === 5 ? 'Explainable Rule Traceability' :
                  'Human Verification & Timeline Update'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 1: First Scan of Packaging Sample
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    An inspector scans <strong>Britannia Good Day Butter Cookies</strong> (Batch Jan 2026). The barcode is used solely for initial identity lookup, while compliance is verified directly from physical packaging photographs.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Physical Packaging Data:</span>
                  <div className="text-slate-800 font-bold">100 g Declared Net Qty</div>
                  <div className="text-slate-800">MRP ₹20.00 (Incl. of taxes)</div>
                  <div className="text-slate-600">B.No. GDB-250109-A (Kolkata Plant)</div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Vision OCR Screening:</span>
                  <div className="text-emerald-700 font-bold">All 7 Mandatory Declarations ✓</div>
                  <div className="text-slate-600">OCR Confidence: 97.4%</div>
                  <div className="text-blue-700">SI Metric Formats: Valid ("g")</div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 2: Product Compliance Twin Established
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    The platform generates a permanent Digital Compliance Twin for GTIN <code>8901030010103</code>. All future packaging updates will be audited against this baseline.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 text-xs font-mono space-y-2">
                <div className="font-bold text-purple-900 font-sans">Digital Twin Record: TWIN-8901030010103</div>
                <div className="text-slate-700">├── Baseline Hash: sha256:4a8b79f...</div>
                <div className="text-slate-700">├── Statutory Status: COMPLIANT (Score: 98/100)</div>
                <div className="text-slate-700">├── Inspection Timeline: Scan 01 recorded</div>
                <div className="text-slate-700">└── Evidence Repository: 7 Bounding Box snapshots stored</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 3: Second Scan Triggers Change Detection!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Eight months later, the inspector scans a new batch in retail (Batch Aug 2026). The <strong>Label Change Detector</strong> immediately discovers 3 significant package modifications:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">MRP Inflation: </span>
                    <span className="line-through text-slate-500">₹20.00</span>
                    <span className="mx-1">→</span>
                    <span className="font-bold text-amber-700">₹25.00 (+25%)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                    CHANGED ⚠
                  </span>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Shrinkflation Detected: </span>
                    <span className="line-through text-slate-500">100 g</span>
                    <span className="mx-1">→</span>
                    <span className="font-bold text-rose-700">90 g (-10% reduction)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                    CHANGED ⚠
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Consumer Care Email Omitted: </span>
                    <span className="text-slate-600">Helpline printed, but electronic email absent</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                    REMOVED INFO -
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 4: Evidence Map with Bounding Box Pinpointing
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Rather than an opaque AI verdict, every altered field is pinpointed directly on the packaging image with exact pixel coordinates and OCR confidence.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl text-slate-200 text-xs font-mono space-y-2">
                <div className="text-cyan-400 font-bold">Evidence Map Extraction:</div>
                <div className="text-slate-300">• Net Quantity: "90 g" [Box: 54, 72, 36, 14] • Confidence: 96%</div>
                <div className="text-slate-300">• MRP: "₹25.00 (Incl. taxes)" [Box: 12, 72, 38, 14] • Confidence: 98%</div>
                <div className="text-slate-300">• Consumer Care: Phone detected; email missing • Confidence: 79%</div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 5: Explainable Rule Traceability Engine
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Deterministic legal metrology rule matrix maps the findings to statutory clauses:
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Rule 6(1)(c) & Rule 11: </span>
                  <span className="text-slate-600">Net quantity change from 100g to 90g triggers verification of package volume fill ratios under Rule 5.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Rule 6(11): </span>
                  <span className="text-slate-600">Unit Sale Price must be declared as ₹0.278/g. Verified mathematically.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Rule 6(1)(f): </span>
                  <span className="text-slate-600">Electronic email address is mandatory for consumer grievance redressal.</span>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Step 6: Human-in-the-Loop Decision & Timeline
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    The inspecting officer reviews the evidence map, signs off on findings with their badge number, orders manufacturer clarification, and exports the certified audit report.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-950 font-sans">Official Audit Sign-Off:</div>
                <div className="text-emerald-900 font-mono">
                  Officer: Insp. Dheeraj Patidar (LM-DEL-4092)
                </div>
                <div className="text-emerald-900">
                  Decision: <strong>Flagged for Statutory Verification (Notice Issued)</strong>
                </div>
                <div className="text-emerald-800 text-[11px]">
                  Compliance Timeline updated: SCAN 01 (Compliant) → SCAN 02 (Potential Issue Flagged).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 ${
              step === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => Math.min(s + 1, totalSteps))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFinish('change-detection')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Open Change Detector</span>
                </button>
                <button
                  onClick={() => handleFinish('evidence-map')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Evidence Map</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
