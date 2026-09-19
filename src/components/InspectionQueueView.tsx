import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Eye, 
  RotateCcw, 
  Check, 
  X, 
  Edit3, 
  FileText, 
  UserCheck, 
  Save, 
  Search,
  ExternalLink,
  Barcode
} from 'lucide-react';
import { Language, RiskPriority, InspectionQueueItem, InspectorProfile, ActiveTab } from '../types';
import { getStoredQueue, saveStoredQueue } from '../data/complianceIntelligenceStore';

interface InspectionQueueViewProps {
  language: Language;
  currentInspector: InspectorProfile | null;
  setActiveTab: (tab: ActiveTab) => void;
  onInspectProduct?: (productId: string) => void;
}

export const InspectionQueueView: React.FC<InspectionQueueViewProps> = ({
  language,
  currentInspector,
  setActiveTab,
  onInspectProduct,
}) => {
  const [queue, setQueue] = useState<InspectionQueueItem[]>(() => getStoredQueue());
  const [filterPriority, setFilterPriority] = useState<RiskPriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Human-in-the-loop active decision modal
  const [selectedItem, setSelectedItem] = useState<InspectionQueueItem | null>(null);
  const [inspectorRemark, setInspectorRemark] = useState<string>('');
  const [activeDecision, setActiveDecision] = useState<'VERIFIED' | 'FLAGGED_INCORRECT' | 'RESCAN_ORDERED'>('VERIFIED');

  const filteredQueue = queue.filter((item) => {
    const matchesPriority = filterPriority === 'ALL' || item.riskPriority === filterPriority;
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.barcode.includes(searchQuery);
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority: RiskPriority) => {
    switch (priority) {
      case 'NORMAL':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">🟢 Normal</span>;
      case 'REVIEW_REQUIRED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">🟡 Review Required</span>;
      case 'HIGH_ATTENTION':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">🟠 High Attention</span>;
      case 'CRITICAL_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">🔴 Critical Review</span>;
    }
  };

  const handleApplyDecision = () => {
    if (!selectedItem) return;
    const updated = queue.map((q) => {
      if (q.id === selectedItem.id) {
        return {
          ...q,
          inspectorDecision: activeDecision,
          inspectorRemarks: inspectorRemark || 'Manual verification completed by field officer.',
          inspectorName: currentInspector?.name || 'Insp. Dheeraj Patidar',
        };
      }
      return q;
    });
    setQueue(updated);
    saveStoredQueue(updated);
    setSelectedItem(null);
    setInspectorRemark('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>HUMAN-IN-THE-LOOP INSPECTION QUEUE</span>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
            Statutory Risk Prioritization & Verification Triage
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            AI provides preliminary screening and surfaces potential anomalies with confidence scores. The statutory officer holds final authority to confirm or reject findings.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {queue.filter((q) => q.inspectorDecision === 'PENDING').length} Pending Officer Sign-off
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, brand, or GTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs text-slate-800 focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              filterPriority === 'ALL' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({queue.length})
          </button>
          <button
            onClick={() => setFilterPriority('CRITICAL_REVIEW')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              filterPriority === 'CRITICAL_REVIEW' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔴 Critical
          </button>
          <button
            onClick={() => setFilterPriority('HIGH_ATTENTION')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              filterPriority === 'HIGH_ATTENTION' ? 'bg-orange-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🟠 High
          </button>
          <button
            onClick={() => setFilterPriority('REVIEW_REQUIRED')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              filterPriority === 'REVIEW_REQUIRED' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🟡 Review
          </button>
          <button
            onClick={() => setFilterPriority('NORMAL')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              filterPriority === 'NORMAL' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🟢 Normal
          </button>
        </div>
      </div>

      {/* Queue Items Table / Cards */}
      <div className="space-y-3">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <img
                src={item.thumbnailUrl}
                alt={item.productName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {item.productName}
                  </h3>
                  {getPriorityBadge(item.riskPriority)}
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    GTIN: {item.barcode}
                  </span>
                </div>

                <div className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  <span className="font-bold text-slate-800">Detected Condition: </span>
                  {item.detectedConditionReason}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                  <span>Scanned: {item.scannedAt}</span>
                  <span>•</span>
                  <span>Compliance Score: <strong className="text-slate-800">{item.complianceScore}%</strong></span>
                  {item.inspectorDecision && item.inspectorDecision !== 'PENDING' && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Officer Decision: {item.inspectorDecision} by {item.inspectorName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 self-end lg:self-center shrink-0">
              <button
                onClick={() => setActiveTab('evidence-map')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Evidence Map</span>
              </button>

              <button
                onClick={() => {
                  setSelectedItem(item);
                  setInspectorRemark(item.inspectorRemarks || '');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verify / Decide</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Human-in-the-loop Decision Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Inspector Verification Sign-Off
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-500 font-medium">Target Commodity:</div>
              <div className="text-sm font-bold text-slate-900">{selectedItem.productName}</div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 leading-relaxed">
                <strong>Preliminary Screening Reason: </strong>
                {selectedItem.detectedConditionReason}
              </div>
            </div>

            {/* Decision Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Statutory Decision:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDecision('VERIFIED')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                    activeDecision === 'VERIFIED'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>[✓ Verified]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDecision('FLAGGED_INCORRECT')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                    activeDecision === 'FLAGGED_INCORRECT'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>[✕ Incorrect]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDecision('RESCAN_ORDERED')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                    activeDecision === 'RESCAN_ORDERED'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>[↻ Re-scan]</span>
                </button>
              </div>
            </div>

            {/* Officer Remarks Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Statutory Remarks / Inspector Notes:</span>
              </label>
              <textarea
                value={inspectorRemark}
                onChange={(e) => setInspectorRemark(e.target.value)}
                placeholder="Enter statutory grounds, field observations, or manufacturer notice reference..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[90px]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDecision}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Record Official Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
