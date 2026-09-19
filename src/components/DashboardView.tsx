import React from 'react';
import { 
  Shield, 
  Scan, 
  Layers, 
  GitCompare, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  Scale, 
  FileText, 
  TrendingUp, 
  Eye, 
  ArrowRight,
  Zap,
  Activity,
  ChevronRight,
  Flame,
  Radio,
  ExternalLink,
  ShieldAlert,
  Pill,
  Camera,
  Stethoscope
} from 'lucide-react';
import { ActiveTab, Language, InspectorProfile } from '../types';

interface DashboardViewProps {
  language: Language;
  setActiveTab: (tab: ActiveTab) => void;
  onLaunchDemo: () => void;
  currentInspector: InspectorProfile | null;
  inspectedCount?: number;
  potentialIssuesCount?: number;
  needsVerificationCount?: number;
  verifiedCount?: number;
  onOpenMedicineScanner?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  setActiveTab,
  onLaunchDemo,
  currentInspector,
  inspectedCount = 142,
  potentialIssuesCount = 18,
  needsVerificationCount = 7,
  verifiedCount = 117,
  onOpenMedicineScanner,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Tagline & Positioning Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border border-blue-800/40 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEGAL METROLOGY COMPLIANCE INTELLIGENCE</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              PackSure AI
            </h1>
            <p className="mt-1.5 text-base sm:text-xl font-medium text-cyan-300">
              "Scan the Label. Trace the Rule. Prove the Evidence."
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            An evidence-driven AI compliance screening and inspection-assistance platform.
            Combines multimodal vision, digital compliance twins, and deterministic legal metrology rule traceability for packaged commodities.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchDemo}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Scan className="w-4 h-4 text-cyan-300" />
              <span>Inspect New Product</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm border border-white/10 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Inspection Queue ({needsVerificationCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Core Dashboard Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Products Inspected</span>
            <Scan className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">
            {inspectedCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Potential Issues</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 tracking-tight">
            {potentialIssuesCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Evidence-tagged
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Needs Verification</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-600 tracking-tight">
            {needsVerificationCount}
          </div>
          <div className="mt-1 text-[11px] text-blue-600 font-medium">
            Human-in-the-loop
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified Records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 tracking-tight">
            {verifiedCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Officer sign-off
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Recent Changes</span>
            <GitCompare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 tracking-tight">
            24
          </div>
          <div className="mt-1 text-[11px] text-purple-600 font-medium">
            Label drift alerts
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Critical Review</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 tracking-tight">
            3
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-medium">
            Triage priority
          </div>
        </div>
      </div>

      {/* Core Innovation Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Evidence Map */}
        <div 
          onClick={() => setActiveTab('evidence-map')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Key Differentiator</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Evidence Map
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Requirement → Extracted Value → Physical Evidence Coordinates → Applicable Statutory Rule → Confidence.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono">
              <div className="text-slate-700 flex justify-between">
                <span>Net Quantity</span>
                <span className="font-bold text-emerald-600">100 g [97%]</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Rule 6(1)(c) • Box [54, 72, 36, 14]
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
            <span>Explore Evidence Map</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 2: Product Compliance Twin */}
        <div 
          onClick={() => setActiveTab('twins')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600">Core Architecture</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Product Compliance Twin
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Permanent digital twin holding full product identity, label evidence snapshots, inspection history, and change logs.
              </p>
            </div>
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1 font-mono text-slate-700">
              <div className="text-purple-900 font-semibold">Britannia Good Day Cookies</div>
              <div className="text-[11px] text-slate-500">Twin ID: TWIN-8901030010103</div>
              <div className="text-[11px] text-purple-700">2 Scans Recorded • 5 Diffs Detected</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
            <span>View Digital Twins</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 3: Label Change Detector */}
        <div 
          onClick={() => setActiveTab('change-detection')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-600">Major Innovation</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                Label Change Detector
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Side-by-side Old vs New label comparison: MRP inflation, net quantity shrinkflation, and missing declarations.
              </p>
            </div>
            <div className="p-3 bg-cyan-50/40 rounded-xl border border-cyan-100 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Quantity Diff</span>
                <span>100g → 90g ⚠</span>
              </div>
              <div className="flex justify-between text-amber-600 font-semibold">
                <span>MRP Diff</span>
                <span>₹20 → ₹25 ⚠</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
            <span>Compare Re-scans</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 💊 Medicine Safety Scanner Dashboard Card */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 rounded-2xl p-6 text-white border border-teal-700/50 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
              <Pill className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'नई स्वास्थ्य एवं सुरक्षा सुविधा' : 'PATIENT & CONSUMER SAFETY'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>💊 Medicine Safety Scanner</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "Scan a medicine to understand its uses, risks and safety information."
            </p>
            <p className="text-xs text-teal-200/80">
              Cross-examine tablet barcodes against recent foods, symptoms, allergies, and existing medications with statutory contraindication screening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (onOpenMedicineScanner) {
                  onOpenMedicineScanner();
                } else {
                  setActiveTab('smart-medicine');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-teal-500/25 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Medicine</span>
            </button>
            <button
              onClick={() => setActiveTab('smart-medicine')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>Enter Symptoms</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>View Safety History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Detected Issues & Recent Triage Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Detected Issues Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900">Top Detected Issues (Last 30 Days)</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">PCR 2011 Rules</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Unit Sale Price (USP) Omission</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rule 6(11) — Price per g/ml missing on commodities exceeding 100g/100ml.
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold shrink-0">
                42 cases
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Shrinkflation without Font/Format Notice</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rule 6(1)(c) — Net quantity reduced by 5%–15% while packaging outer silhouette is unchanged.
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold shrink-0">
                28 cases
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Incomplete Consumer Care Redressal</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rule 6(1)(f) — Toll-free number declared but electronic email / portal address omitted.
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold shrink-0">
                19 cases
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>Non-standard SI Metric Abbreviations</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rule 11 — Illegal usage of "gms" or "gm." instead of mandatory international symbol "g".
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-slate-200 text-slate-800 text-xs font-bold shrink-0">
                14 cases
              </span>
            </div>
          </div>
        </div>

        {/* Explainable AI & Human-in-the-Loop Triage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Explainable Screening Principle</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                NON-PUNITIVE AI
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              PackSure AI does not make unilateral legal conclusions. It screens physical label evidence against statutory rule definitions and surfaces
              <span className="font-semibold text-amber-700"> "⚠ POTENTIAL ISSUE" </span>
              with explicit image bounding boxes, expected requirements, and measured confidence.
            </p>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
              <div className="font-bold text-blue-900">Statutory Triage Framework:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>🟢 Normal: Verified</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>🟡 Review Required</span>
                </div>
                <div className="flex items-center space-x-1.5 text-orange-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>🟠 High Attention</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>🔴 Critical Review</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('queue')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>Open Inspector Verification Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspection Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
