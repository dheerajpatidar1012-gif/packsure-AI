import React, { useState } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  MinusCircle, 
  Scale, 
  Clock, 
  Calendar, 
  Building2, 
  IndianRupee, 
  ShieldAlert, 
  ArrowRight,
  Eye,
  Sliders,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import { Language, LabelDiffItem, LabelDiffStatus } from '../types';
import { demoScan1Baseline, demoScan2Current, EnrichedProductComplianceTwin } from '../data/complianceIntelligenceStore';

interface LabelChangeDetectorViewProps {
  language: Language;
  twin?: EnrichedProductComplianceTwin;
  onOpenReport?: () => void;
  onVerifyDiff?: (diffId: string, verified: boolean) => void;
}

export const LabelChangeDetectorView: React.FC<LabelChangeDetectorViewProps> = ({
  language,
  twin: externalTwin,
  onOpenReport,
  onVerifyDiff,
}) => {
  const twin = externalTwin || demoScan2Current;
  const oldSnapshot = demoScan1Baseline;
  const newSnapshot = twin;

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CHANGED' | 'NEW_INFO' | 'REMOVED_INFO'>('ALL');
  const [activeDiffId, setActiveDiffId] = useState<string>(twin.changesDetected[0]?.id || 'ch-qty');

  const filteredDiffs = twin.changesDetected.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    return item.status === selectedFilter;
  });

  const activeDiff = twin.changesDetected.find((d) => d.id === activeDiffId) || twin.changesDetected[0];

  const getStatusBadge = (status: LabelDiffStatus) => {
    switch (status) {
      case 'UNCHANGED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>UNCHANGED ✓</span>
          </span>
        );
      case 'CHANGED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>CHANGED ⚠</span>
          </span>
        );
      case 'NEW_INFO':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>NEW INFORMATION +</span>
          </span>
        );
      case 'REMOVED_INFO':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
            <MinusCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>REMOVED INFORMATION -</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Notification Banner: Change detected — verification required */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>CHANGE DETECTED — VERIFICATION REQUIRED</span>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
            Label Change Detector: Old Label vs New Label
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Automated visual and semantic delta engine. Compares consecutive packaging runs to flag shrinkflation, price inflation, altered manufacturing units, or missing declarations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            Twin: {twin.productName}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 font-bold">
            {twin.changesDetected.length} Changes Flagged
          </span>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: OLD LABEL (Baseline Scan) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                BASELINE SCAN (SCAN 01)
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {oldSnapshot.productName}
              </h3>
            </div>
            <div className="text-right text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Verified Compliant
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">{oldSnapshot.lastInspectedAt}</div>
            </div>
          </div>

          {/* Old Image Box with Highlighted Diff Area */}
          <div className="relative overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center min-h-[300px] border border-slate-800">
            <img
              src={oldSnapshot.imageUrl}
              alt="Baseline Label"
              className="max-h-[300px] object-contain opacity-90 select-none"
              referrerPolicy="no-referrer"
            />
            {/* SVG overlay for old box */}
            {activeDiff?.previousBox && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect
                  x={`${activeDiff.previousBox.x}%`}
                  y={`${activeDiff.previousBox.y}%`}
                  width={`${activeDiff.previousBox.width}%`}
                  height={`${activeDiff.previousBox.height}%`}
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  rx="4"
                />
              </svg>
            )}
            <div className="absolute top-3 left-3 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
              ORIGINAL: {activeDiff?.previousValue}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-700">
            <div className="flex justify-between">
              <span>MRP:</span>
              <span className="font-bold text-slate-900">{oldSnapshot.identityProfile.mrp.value}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Quantity:</span>
              <span className="font-bold text-slate-900">{oldSnapshot.identityProfile.netQuantity.value}</span>
            </div>
            <div className="flex justify-between">
              <span>Batch Number:</span>
              <span>{oldSnapshot.identityProfile.batchLot.value}</span>
            </div>
          </div>
        </div>

        {/* Right: NEW LABEL (Current Re-scan) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div>
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                CURRENT RE-SCAN (SCAN 02)
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {newSnapshot.productName}
              </h3>
            </div>
            <div className="text-right text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                Changes Flagged
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">{newSnapshot.lastInspectedAt}</div>
            </div>
          </div>

          {/* New Image Box with Highlighted Diff Area */}
          <div className="relative overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center min-h-[300px] border border-amber-900/40">
            <img
              src={newSnapshot.imageUrl}
              alt="Current Re-scan Label"
              className="max-h-[300px] object-contain select-none"
              referrerPolicy="no-referrer"
            />
            {/* SVG overlay for new altered box */}
            {activeDiff?.currentBox && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect
                  x={`${activeDiff.currentBox.x}%`}
                  y={`${activeDiff.currentBox.y}%`}
                  width={`${activeDiff.currentBox.width}%`}
                  height={`${activeDiff.currentBox.height}%`}
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  rx="4"
                />
              </svg>
            )}
            <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-200 font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs border border-amber-500/30">
              CURRENT: {activeDiff?.currentValue}
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl text-xs space-y-1 font-mono text-slate-700 border border-amber-100">
            <div className="flex justify-between">
              <span>MRP:</span>
              <span className="font-bold text-amber-700">{newSnapshot.identityProfile.mrp.value}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Quantity:</span>
              <span className="font-bold text-rose-600">{newSnapshot.identityProfile.netQuantity.value} (Shrinkflation)</span>
            </div>
            <div className="flex justify-between">
              <span>Batch Number:</span>
              <span>{newSnapshot.identityProfile.batchLot.value}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Breakdown List & Traceability Deep Dive */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Detected Differences & Statutory Evaluation
            </h3>
            <p className="text-xs text-slate-500">
              Click any difference to focus visual comparison boxes above.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                selectedFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Diffs ({twin.changesDetected.length})
            </button>
            <button
              onClick={() => setSelectedFilter('CHANGED')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                selectedFilter === 'CHANGED' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Changed
            </button>
            <button
              onClick={() => setSelectedFilter('REMOVED_INFO')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                selectedFilter === 'REMOVED_INFO' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Removed
            </button>
            <button
              onClick={() => setSelectedFilter('NEW_INFO')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                selectedFilter === 'NEW_INFO' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              New
            </button>
          </div>
        </div>

        {/* Diff Cards */}
        <div className="space-y-3">
          {filteredDiffs.map((diff) => {
            const isSelected = diff.id === activeDiffId;
            return (
              <div
                key={diff.id}
                onClick={() => setActiveDiffId(diff.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{diff.label}</span>
                      {getStatusBadge(diff.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-slate-500 line-through bg-slate-100 px-2 py-0.5 rounded">
                        Old: {diff.previousValue}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-900 font-bold bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded">
                        New: {diff.currentValue}
                      </span>
                    </div>
                  </div>

                  {diff.verificationRequired && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                      Inspector Verification Required
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Statutory Analysis: </span>
                  {diff.statutoryNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
