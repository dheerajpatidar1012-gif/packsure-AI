import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  GitCompare, 
  Eye, 
  FileText, 
  ChevronRight, 
  Search, 
  Filter, 
  ExternalLink, 
  Share2, 
  Printer, 
  Download,
  Building2,
  Calendar,
  IndianRupee,
  Barcode,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, RiskPriority, ActiveTab } from '../types';
import { 
  demoScan1Baseline, 
  demoScan2Current, 
  EnrichedProductComplianceTwin 
} from '../data/complianceIntelligenceStore';

interface ProductTwinsViewProps {
  language: Language;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectTwin?: (twin: EnrichedProductComplianceTwin) => void;
  onOpenReport?: (twin: EnrichedProductComplianceTwin) => void;
}

export const ProductTwinsView: React.FC<ProductTwinsViewProps> = ({
  language,
  setActiveTab,
  onSelectTwin,
  onOpenReport,
}) => {
  const [selectedTwinId, setSelectedTwinId] = useState<string>(demoScan2Current.id);
  const [activeSection, setActiveSection] = useState<'tree' | 'identity' | 'evidence' | 'timeline' | 'changes'>('tree');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const twinList: EnrichedProductComplianceTwin[] = [demoScan2Current];
  const activeTwin = twinList.find((t) => t.id === selectedTwinId) || demoScan2Current;

  const getPriorityBadge = (priority: RiskPriority) => {
    switch (priority) {
      case 'NORMAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Normal</span>;
      case 'REVIEW_REQUIRED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">🟡 Review Required</span>;
      case 'HIGH_ATTENTION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">🟠 High Attention</span>;
      case 'CRITICAL_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">🔴 Critical Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>CORE ARCHITECTURE</span>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
            Product Compliance Twin Repository
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            A permanent digital profile for every packaged product. Preserves ground-truth label imagery, extracted identity, statutory history, and drift alerts across manufacturing batches.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('change-detection')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 flex items-center space-x-1.5 cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Label Change Detector</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence-map')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Evidence Map</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Twin Profile Card + Interactive Tree & Tab Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-slate-100 aspect-4/3 border border-slate-200 flex items-center justify-center">
              <img
                src={activeTwin.imageUrl}
                alt={activeTwin.productName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5">
                {getPriorityBadge(activeTwin.riskPriority)}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                {activeTwin.brand} • {activeTwin.category}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {activeTwin.productName}
              </h3>
              <div className="mt-1 flex items-center space-x-1 text-xs font-mono text-slate-500">
                <Barcode className="w-3.5 h-3.5" />
                <span>GTIN / Barcode: {activeTwin.barcode}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between text-slate-700">
                <span>Total Scans Recorded:</span>
                <span className="font-bold">{activeTwin.timeline.length} Scans</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Changes Detected:</span>
                <span className="font-bold text-amber-600">{activeTwin.changesDetected.length} Diffs Flagged</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Last Inspection:</span>
                <span className="font-medium text-slate-500">{activeTwin.lastInspectedAt}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Inspecting Officer:</span>
                <span className="font-medium text-slate-800">{activeTwin.inspectorName} ({activeTwin.inspectorBadge})</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('reports')}
                className="w-full py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Digital Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Twin Architecture Tree & Deep Dive (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Sub-tab Switcher */}
          <div className="bg-white rounded-xl p-1.5 border border-slate-200 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveSection('tree')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeSection === 'tree' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setActiveSection('identity')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeSection === 'identity' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Product Identity Profile
            </button>
            <button
              onClick={() => setActiveSection('changes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeSection === 'changes' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Detected Changes ({activeTwin.changesDetected.length})
            </button>
            <button
              onClick={() => setActiveSection('timeline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeSection === 'timeline' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Compliance Timeline ({activeTwin.timeline.length})
            </button>
          </div>

          {/* Section 1: Tree View Layout */}
          {activeSection === 'tree' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 font-mono">
              <div className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-2">
                PRODUCT COMPLIANCE TWIN SCHEMA TREE
              </div>

              <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs leading-relaxed overflow-x-auto space-y-1">
                <div className="text-emerald-400 font-bold">PRODUCT: {activeTwin.productName}</div>
                <div className="text-blue-400 font-bold">└── COMPLIANCE TWIN (ID: {activeTwin.id})</div>
                <div className="pl-4 text-slate-300">├── 📄 Product Identity</div>
                <div className="pl-8 text-slate-400">├── [Barcode] GTIN: {activeTwin.barcode} (Confidence: 100%)</div>
                <div className="pl-8 text-slate-400">├── [Label Image] Brand: {activeTwin.identityProfile.brand.value}</div>
                <div className="pl-8 text-slate-400">├── [Label Image] MRP: {activeTwin.identityProfile.mrp.value}</div>
                <div className="pl-8 text-slate-400">└── [Label Image] Net Qty: {activeTwin.identityProfile.netQuantity.value}</div>
                <div className="pl-4 text-slate-300">├── 🔍 Label Evidence</div>
                <div className="pl-8 text-slate-400">├── Front Panel ({activeTwin.evidenceMap.length} Bounding Boxes)</div>
                <div className="pl-8 text-slate-400">└── Back Statutory Panel (OCR Extracted)</div>
                <div className="pl-4 text-slate-300">├── ⚖️ Compliance Status & Risk</div>
                <div className="pl-8 text-amber-400 font-semibold">└── Status: {activeTwin.status} ({activeTwin.riskPriority})</div>
                <div className="pl-4 text-slate-300">├── 📜 Applicable Statutory Requirements</div>
                <div className="pl-8 text-slate-400">└── Legal Metrology (Packaged Commodities) Rules, 2011</div>
                <div className="pl-4 text-slate-300">├── 🕒 Previous Scans & Timeline</div>
                <div className="pl-8 text-slate-400">├── Scan 1 (15 Jan 2026): 100g, ₹20 [Compliant]</div>
                <div className="pl-8 text-slate-400">└── Scan 2 (16 Sep 2026): 90g, ₹25 [Change Flagged]</div>
                <div className="pl-4 text-slate-300">├── ⚠ Detected Changes</div>
                <div className="pl-8 text-rose-400 font-semibold">└── Shrinkflation (-10g), MRP (+₹5), Email Omitted</div>
                <div className="pl-4 text-slate-300">├── ✍️ Inspection History & Sign-off</div>
                <div className="pl-8 text-slate-400">└── Officer: {activeTwin.inspectorName} ({activeTwin.inspectorBadge})</div>
                <div className="pl-4 text-slate-300">└── 📑 Reports</div>
                <div className="pl-8 text-cyan-400">└── Ready for PDF / Print Export</div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setActiveSection('identity')}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>View Structured Attributes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Product Identity Profile */}
          {activeSection === 'identity' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900">
                  Product Identity Profile & Source Attribution
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  GTIN: {activeTwin.barcode}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {Object.entries(activeTwin.identityProfile).map(([key, field]) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                        [{field.source}] {field.confidence}%
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Changes Detected */}
          {activeSection === 'changes' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-base font-extrabold text-slate-900">
                Altered Packaging Declarations
              </h4>
              <div className="space-y-3 text-xs">
                {activeTwin.changesDetected.map((change) => (
                  <div key={change.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{change.label}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                        {change.status}
                      </span>
                    </div>
                    <div className="font-mono text-slate-700">
                      <span className="line-through text-slate-500">{change.previousValue}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <span className="font-bold text-rose-700">{change.currentValue}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pt-1 border-t border-amber-200/60">
                      {change.statutoryNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Compliance Timeline */}
          {activeSection === 'timeline' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-base font-extrabold text-slate-900">
                Inspection & Drift History
              </h4>
              <div className="space-y-4">
                {activeTwin.timeline.map((event, index) => (
                  <div key={event.id} className="relative pl-6 border-l-2 border-purple-200 space-y-1">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white"></div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        SCAN 0{event.scanNumber}: {event.date}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        event.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{event.summary}</p>
                    <div className="text-[11px] font-mono text-slate-500">
                      MRP: {event.mrp} • Net Qty: {event.netQuantity} • Officer: {event.inspector}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
