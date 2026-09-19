import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Maximize2, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  Tag, 
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Edit3
} from 'lucide-react';
import { EvidenceMapItem, Language, EvidenceSource } from '../types';
import { demoScan2Current, demoScan1Baseline, EnrichedProductComplianceTwin } from '../data/complianceIntelligenceStore';

interface EvidenceMapViewProps {
  language: Language;
  activeTwin?: EnrichedProductComplianceTwin | null;
  onVerifyItem?: (itemId: string, decision: 'VERIFIED' | 'INCORRECT' | 'RESCAN', remark?: string) => void;
}

export const EvidenceMapView: React.FC<EvidenceMapViewProps> = ({
  language,
  activeTwin: externalTwin,
  onVerifyItem,
}) => {
  const [selectedTwinMode, setSelectedTwinMode] = useState<'current_scan' | 'baseline_scan'>('current_scan');
  const twin = externalTwin || (selectedTwinMode === 'current_scan' ? demoScan2Current : demoScan1Baseline);

  const [selectedItemId, setSelectedItemId] = useState<string>(twin.evidenceMap[0]?.id || 'ev-qty');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'POTENTIAL_ISSUE' | 'DETECTED'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [inspectorRemark, setInspectorRemark] = useState<string>('');
  const [activeRemarkModalId, setActiveRemarkModalId] = useState<string | null>(null);

  const activeItem = twin.evidenceMap.find((item) => item.id === selectedItemId) || twin.evidenceMap[0];

  const filteredItems = twin.evidenceMap.filter((item) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'POTENTIAL_ISSUE') return item.validationResult === 'POTENTIAL_ISSUE' || item.validationResult === 'NOT_DETECTED';
    if (statusFilter === 'DETECTED') return item.validationResult === 'DETECTED';
    return true;
  });

  const getSourceBadgeColor = (source: EvidenceSource) => {
    switch (source) {
      case 'Label Image': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'OCR': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Barcode': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Database': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'DETECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Detected</span>
          </span>
        );
      case 'POTENTIAL_ISSUE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>⚠ Potential Issue</span>
          </span>
        );
      case 'NOT_DETECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
            <X className="w-3.5 h-3.5 text-rose-600" />
            <span>Not Detected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Needs Verification</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher & Core Concept Notice */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>KEY DIFFERENTIATOR</span>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
            Evidence Map & Physical Label Grounding
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Every compliance assertion is tied to bounding box coordinates on the physical label image. AI extraction is clearly distinguished from deterministic statutory validation.
          </p>
        </div>

        {/* Product selector buttons */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setSelectedTwinMode('current_scan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTwinMode === 'current_scan'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Scan (Re-scan with Changes)
          </button>
          <button
            onClick={() => setSelectedTwinMode('baseline_scan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTwinMode === 'baseline_scan'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baseline Scan (Initial Compliant)
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left List + Right Interactive Image Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Requirements & Evidence Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span>Statutory Requirements ({filteredItems.length})</span>
            </h3>
            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('POTENTIAL_ISSUE')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  statusFilter === 'POTENTIAL_ISSUE' ? 'bg-amber-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Issues
              </button>
              <button
                onClick={() => setStatusFilter('DETECTED')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  statusFilter === 'DETECTED' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Detected
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedItemId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>{item.requirement}</span>
                      </div>
                      <div className="mt-1 text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                        <span>{item.extractedValue}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${getSourceBadgeColor(item.source)}`}>
                          [{item.source}]
                        </span>
                      </div>
                    </div>
                    <div>{getResultBadge(item.validationResult)}</div>
                  </div>

                  {/* Evidence Coordinates & Applicable Rule */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-slate-600 truncate max-w-[190px]">
                      {item.applicableRule}
                    </span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      Confidence: {item.confidence}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Physical Evidence Canvas + Explainable Deep Dive (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive Bounding Box Package Image Viewer */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Physical Label Evidence Frame
                </span>
                <span className="text-[11px] text-slate-500">
                  ({twin.productName})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Image Canvas with Overlay Bounding Boxes */}
            <div className="relative overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center min-h-[380px] max-h-[460px] border border-slate-800">
              <div
                className="relative transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={twin.imageUrl}
                  alt={twin.productName}
                  className="w-full max-h-[440px] object-contain rounded-lg select-none"
                  referrerPolicy="no-referrer"
                />

                {/* SVG Overlay for Bounding Boxes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                  {twin.evidenceMap.map((item) => {
                    const isSelected = item.id === activeItem.id;
                    const isIssue = item.validationResult === 'POTENTIAL_ISSUE' || item.validationResult === 'NOT_DETECTED';
                    const box = item.boundingBox;

                    return (
                      <g
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className="cursor-pointer transition-all"
                      >
                        <rect
                          x={`${box.x}%`}
                          y={`${box.y}%`}
                          width={`${box.width}%`}
                          height={`${box.height}%`}
                          fill={
                            isSelected
                              ? isIssue
                                ? 'rgba(245, 158, 11, 0.25)'
                                : 'rgba(59, 130, 246, 0.25)'
                              : 'transparent'
                          }
                          stroke={
                            isSelected
                              ? isIssue
                                ? '#f59e0b'
                                : '#3b82f6'
                              : isIssue
                              ? '#f97316'
                              : '#10b981'
                          }
                          strokeWidth={isSelected ? '3' : '1.5'}
                          strokeDasharray={isSelected ? 'none' : '4,2'}
                          rx="4"
                        />
                        {/* Label tag above box */}
                        <g transform={`translate(${box.x}, ${Math.max(box.y - 4, 2)})`}>
                          <rect
                            x={`${box.x}%`}
                            y={`${Math.max(box.y - 5, 2)}%`}
                            width="110"
                            height="18"
                            fill={isSelected ? (isIssue ? '#b45309' : '#1d4ed8') : '#0f172a'}
                            rx="3"
                          />
                          <text
                            x={`${box.x + 1}%`}
                            y={`${Math.max(box.y - 1.5, 5)}%`}
                            fill="#ffffff"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {item.requirement.slice(0, 16)}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Coordinates Badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 text-slate-300 font-mono text-[10px] px-2 py-1 rounded backdrop-blur-md border border-slate-700">
                Box: [X: {activeItem.boundingBox.x}%, Y: {activeItem.boundingBox.y}%, W: {activeItem.boundingBox.width}%, H: {activeItem.boundingBox.height}%]
              </div>
            </div>
          </div>

          {/* Explainable AI Deep Dive Card for Selected Item */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Explainable Rule Traceability
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  {activeItem.requirement}
                </h4>
              </div>
              <div>{getResultBadge(activeItem.validationResult)}</div>
            </div>

            {/* Traceability Grid: Why it applies -> What was found -> What is expected */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-700">Why It Applies:</div>
                <p className="text-slate-600 leading-relaxed">{activeItem.whyItApplies}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-700">What Was Found:</div>
                <p className="text-slate-800 font-semibold leading-relaxed">{activeItem.whatWasFound}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-700">Statutory Expectation:</div>
                <p className="text-slate-600 leading-relaxed">{activeItem.whatIsExpected}</p>
              </div>
            </div>

            {/* Action Required & Human-In-The-Loop Sign-off */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-blue-950">Recommended Inspector Action:</div>
                <div className="text-blue-900">{activeItem.actionRequired}</div>
              </div>

              {/* Inspector Verification Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onVerifyItem?.(activeItem.id, 'VERIFIED', 'Verified on physical pack')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </button>
                <button
                  onClick={() => onVerifyItem?.(activeItem.id, 'INCORRECT', 'Statutory violation confirmed')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Flag Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
