import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  CopyCheck, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  History, 
  Clock, 
  Calendar, 
  Camera, 
  Search, 
  Filter, 
  RefreshCw, 
  FileText, 
  Download, 
  Printer, 
  Maximize2, 
  ChevronRight, 
  HelpCircle, 
  Tag, 
  Scale, 
  Barcode, 
  Building2, 
  Sliders, 
  Check, 
  ExternalLink,
  Eye,
  Zap,
  Info,
  ChevronDown
} from 'lucide-react';
import { 
  ComplianceDigitalTwin, 
  VisualDifferenceRegion, 
  FieldDifferenceItem, 
  Language, 
  ProductScanResult 
} from '../types';
import { 
  mockComplianceDigitalTwins, 
  digitalTwinOverviewStats, 
  createDigitalTwinFromScan 
} from '../data/digitalTwinData';

interface DigitalTwinViewProps {
  language: Language;
  onScanNewProduct: () => void;
  onOpenCertificate?: (product: ProductScanResult) => void;
  activeScanResult?: ProductScanResult | null;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  language,
  onScanNewProduct,
  onOpenCertificate,
  activeScanResult,
}) => {
  // Available digital twins pool (including active scan if converted)
  const [twinsList, setTwinsList] = useState<ComplianceDigitalTwin[]>(() => {
    const list = [...mockComplianceDigitalTwins];
    if (activeScanResult) {
      const activeTwin = createDigitalTwinFromScan(activeScanResult);
      if (!list.some((t) => t.id === activeTwin.id || t.barcode === activeTwin.barcode)) {
        list.unshift(activeTwin);
      }
    }
    return list;
  });

  const [selectedTwinId, setSelectedTwinId] = useState<string>(
    twinsList[0]?.id || 'dt-bhujia-sev-001'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'CHANGES' | 'COMPLIANT' | 'INSPECTION'>('ALL');

  // Visual View Mode: 'difference_overlay' | 'side_by_side' | 'previous' | 'current'
  const [viewMode, setViewMode] = useState<'difference_overlay' | 'side_by_side' | 'previous' | 'current'>('difference_overlay');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  // Comparison pipeline simulation state
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonStep, setComparisonStep] = useState(0);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Create Twin modal state
  const [showCreateTwinModal, setShowCreateTwinModal] = useState(false);
  const [newTwinBarcode, setNewTwinBarcode] = useState('');
  const [isCreatingTwin, setIsCreatingTwin] = useState(false);

  // Time Machine manual verification toggle
  const [showHistoricalRuleDetails, setShowHistoricalRuleDetails] = useState(false);

  // Active Twin object
  const currentTwin = twinsList.find((t) => t.id === selectedTwinId) || twinsList[0];

  // If active scan result changed, ensure it's in list
  useEffect(() => {
    if (activeScanResult) {
      const activeTwin = createDigitalTwinFromScan(activeScanResult);
      setTwinsList((prev) => {
        if (!prev.some((t) => t.id === activeTwin.id || t.barcode === activeTwin.barcode)) {
          return [activeTwin, ...prev];
        }
        return prev;
      });
    }
  }, [activeScanResult]);

  // Filtered twins for selector
  const filteredTwins = twinsList.filter((t) => {
    const matchesSearch = 
      t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.barcode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterCategory === 'CHANGES') return t.changesDetectedCount > 0;
    if (filterCategory === 'COMPLIANT') return t.complianceStatus === 'COMPLIANT';
    if (filterCategory === 'INSPECTION') return t.requiresInspection;
    return true;
  });

  // Execute 7-step comparison simulation
  const handleRunComparison = () => {
    setIsComparing(true);
    setShowComparisonModal(true);
    setComparisonStep(1);

    const steps = [
      { step: 1, delay: 600 },  // 1. Retrieve previous product record using barcode
      { step: 2, delay: 1300 }, // 2. Compare OCR fields
      { step: 3, delay: 2000 }, // 3. Compare visual regions
      { step: 4, delay: 2700 }, // 4. Detect changed values
      { step: 5, delay: 3400 }, // 5. Highlight changed areas
      { step: 6, delay: 4100 }, // 6. Re-run compliance checks
      { step: 7, delay: 4800 }, // 7. Display clear explanation
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setComparisonStep(step);
        if (step === 7) {
          setIsComparing(false);
        }
      }, delay);
    });
  };

  const handleCreateNewTwin = () => {
    if (!newTwinBarcode.trim()) return;
    setIsCreatingTwin(true);
    setTimeout(() => {
      const newTwin: ComplianceDigitalTwin = {
        ...mockComplianceDigitalTwins[2],
        id: `dt-custom-${Date.now()}`,
        productName: `Registered Packaging Lot (Barcode: ${newTwinBarcode})`,
        barcode: newTwinBarcode,
        fingerprintHash: `SHA256:${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`,
        totalScansCount: 1,
        changesDetectedCount: 0,
        requiresInspection: false,
        complianceStatus: 'COMPLIANT',
        complianceScore: 98,
        inspectionTimeline: [
          {
            id: `tl-custom-1`,
            stepNumber: 1,
            date: 'Today, Just Now',
            title: 'First Scan Conducted',
            description: `Baseline carton registered for barcode ${newTwinBarcode}.`,
            badge: 'First Scan',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            inspector: 'Insp. Dheeraj Patidar',
            status: 'completed',
          },
          {
            id: `tl-custom-2`,
            stepNumber: 2,
            date: 'Today, Just Now',
            title: 'Compliance Digital Twin Created',
            description: 'SHA-256 fingerprint established for future market surveillance.',
            badge: 'Digital Twin Created',
            badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
            inspector: 'PackSure AI Continuous Compliance Engine',
            status: 'completed',
          },
        ],
      };
      setTwinsList((prev) => [newTwin, ...prev]);
      setSelectedTwinId(newTwin.id);
      setIsCreatingTwin(false);
      setShowCreateTwinModal(false);
      setNewTwinBarcode('');
    }, 1200);
  };

  const selectedRegion = currentTwin?.visualRegions?.find((r) => r.id === selectedRegionId);

  return (
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen text-slate-800 space-y-8">
      {/* 1. TOP HEADER & SYSTEM PHILOSOPHY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Title and Tagline Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>PREMIUM CONTINUOUS COMPLIANCE MODULE</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-mono">Rule 6 & Section 36 Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-3">
              <span>AI Compliance Digital Twin</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 font-bold uppercase tracking-normal">
                Continuous Surveillance
              </span>
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1 italic">
              “Don’t just detect non-compliance — detect when compliance changes.”
            </p>
          </div>

          {/* Quick Global Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowCreateTwinModal(true)}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer"
              title="Create a new Digital Twin Baseline"
            >
              <CopyCheck className="w-4 h-4" />
              <span>Create Digital Twin</span>
            </button>

            <button
              onClick={handleRunComparison}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer"
              title="Run 7-Step Comparative Differencing Engine"
            >
              <RefreshCw className={`w-4 h-4 ${isComparing ? 'animate-spin' : ''}`} />
              <span>Compare With Previous Scan</span>
            </button>

            <button
              onClick={onScanNewProduct}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Scan New Package</span>
            </button>
          </div>
        </div>

        {/* 2. DASHBOARD CARD: "Packaging Changes Detected" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Products Monitored</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {digitalTwinOverviewStats.totalProductsMonitored}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Continuous Registry Active</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-xs flex items-center justify-between ring-1 ring-rose-200">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Packaging Changes Detected</p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600">
                {digitalTwinOverviewStats.changesDetectedCount}
              </h3>
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Price & Weight Modifications</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Require Physical Inspection</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-700">
                {digitalTwinOverviewStats.requiresInspectionCount}
              </h3>
              <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                <Scale className="w-3 h-3" />
                <span>Section 36 Notice Triggered</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Historical Rule Mismatches</p>
              <h3 className="text-2xl sm:text-3xl font-black text-indigo-700">
                {digitalTwinOverviewStats.historicalRuleMismatchCount}
              </h3>
              <p className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Time Machine Retro-audit</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3. PRODUCT SELECTOR & SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monitored packaging by product name, brand, or barcode (e.g. 8904063200155)..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setFilterCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Twins ({twinsList.length})
              </button>
              <button
                onClick={() => setFilterCategory('CHANGES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'CHANGES'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                Changes Detected (3)
              </button>
              <button
                onClick={() => setFilterCategory('INSPECTION')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'INSPECTION'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Inspection Needed (2)
              </button>
              <button
                onClick={() => setFilterCategory('COMPLIANT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'COMPLIANT'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Stable Compliant
              </button>
            </div>
          </div>

          {/* Quick Select Horizontal Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wide">
              Select Monitored Twin:
            </span>
            {filteredTwins.map((twin) => {
              const isSelected = twin.id === currentTwin.id;
              const hasViolations = twin.changesDetectedCount > 0 && twin.requiresInspection;
              return (
                <button
                  key={twin.id}
                  onClick={() => {
                    setSelectedTwinId(twin.id);
                    setSelectedRegionId(null);
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    hasViolations ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`} />
                  <span className="font-bold">{twin.productName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({twin.barcode})</span>
                  {twin.changesDetectedCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                      {twin.changesDetectedCount} changes
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CURRENT ACTIVE DIGITAL TWIN HERO CARD */}
        {currentTwin ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                  <img
                    src={currentTwin.currentSnapshot.imageUrl}
                    alt={currentTwin.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                    Live Pack
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                      {currentTwin.brandName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {currentTwin.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentTwin.productName}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center space-x-1 font-mono font-semibold">
                      <Barcode className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentTwin.barcode}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>First Scanned: {currentTwin.firstScanDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last Scanned: {currentTwin.lastScanDate}</span>
                    </span>
                  </div>

                  {/* Fingerprint SHA-256 */}
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md font-mono flex items-center space-x-1">
                      <CopyCheck className="w-3 h-3 text-purple-600" />
                      <span>FINGERPRINT: {currentTwin.fingerprintHash}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      • {currentTwin.totalScansCount} Audits Logged
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Score Badges */}
              <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${
                    currentTwin.complianceStatus === 'COMPLIANT'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : currentTwin.complianceStatus === 'PARTIALLY COMPLIANT'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {currentTwin.complianceStatus === 'COMPLIANT' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{currentTwin.complianceStatus}</span>
                  </div>

                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    currentTwin.riskLevel === 'HIGH' || currentTwin.riskLevel === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : currentTwin.riskLevel === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    Risk: {currentTwin.riskLevel}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-500">Compliance Score:</span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-xl font-black ${
                      currentTwin.complianceScore >= 85
                        ? 'text-emerald-600'
                        : currentTwin.complianceScore >= 60
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {currentTwin.complianceScore}%
                    </span>
                    <span className="text-slate-400">/ 100</span>
                  </div>
                </div>

                {currentTwin.requiresInspection && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg animate-pulse">
                    ⚠️ Physical Inspection Required (Section 36)
                  </span>
                )}
              </div>
            </div>

            {/* 5. PREVIOUS SCAN vs CURRENT SCAN DEDICATED COMPARISON SCREEN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>Side-by-Side Packaging Scan Comparison</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparing Baseline Fingerprint against latest retail surveillance scan
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400">Legend:</span>
                  <span className="flex items-center space-x-1 text-slate-600">
                    <span>🔴 Changed / Violation</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600">
                    <span>🟡 Batch Shift</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600">
                    <span>🟢 Unchanged Baseline</span>
                  </span>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-4 w-1/4">FIELD / STATUTORY CLAUSE</th>
                      <th className="py-3 px-4 w-1/4 bg-blue-50/50 text-blue-900 border-x border-slate-200">
                        PREVIOUS SCAN (BASELINE)
                        <span className="block text-[10px] font-normal text-slate-500">
                          {currentTwin.baselineSnapshot.timestamp}
                        </span>
                      </th>
                      <th className="py-3 px-4 w-1/4 bg-purple-50/50 text-purple-900 border-r border-slate-200">
                        CURRENT SCAN (LATEST)
                        <span className="block text-[10px] font-normal text-slate-500">
                          {currentTwin.currentSnapshot.timestamp}
                        </span>
                      </th>
                      <th className="py-3 px-4 w-1/4">AI COMPARISON STATUS & EXPLANATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentTwin.fieldDifferences.map((item) => {
                      const isViolation = item.status === 'CHANGED_VIOLATION';
                      const isWarning = item.status === 'CHANGED_WARNING';
                      const isInfo = item.status === 'CHANGED_INFO';
                      const isSame = item.status === 'UNCHANGED';

                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isViolation ? 'bg-rose-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div className="flex items-center space-x-1.5">
                              <span>{item.badge}</span>
                              <span className="font-bold">{item.label}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {item.statutoryClause}
                            </span>
                          </td>

                          {/* Previous Value */}
                          <td className="py-3 px-4 font-mono font-medium text-slate-700 bg-blue-50/20 border-x border-slate-200">
                            {item.previousValue}
                          </td>

                          {/* Current Value */}
                          <td className={`py-3 px-4 font-mono font-bold border-r border-slate-200 ${
                            isViolation
                              ? 'text-rose-700 bg-rose-50/60'
                              : isInfo || isWarning
                              ? 'text-amber-800 bg-amber-50/40'
                              : 'text-emerald-700 bg-emerald-50/30'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>{item.currentValue}</span>
                              <span>{item.badge}</span>
                            </div>
                          </td>

                          {/* AI Explanation */}
                          <td className="py-3 px-4 text-slate-600">
                            <p className="text-xs leading-relaxed font-medium">
                              {item.changeDescription}
                            </p>
                            {item.requiresInspection && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                Requires Physical Weighing / Audit
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. VISUAL CHANGE DETECTION & DIFFERENCE MAP */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span>Visual Difference Map (Computer Vision Bounding Boxes)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct visual comparison detecting altered MRP stamps, altered net quantity text, and redacted consumer care blocks
                  </p>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode('difference_overlay')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'difference_overlay'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Overlay Diff Heatmap
                  </button>
                  <button
                    onClick={() => setViewMode('side_by_side')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'side_by_side'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setViewMode('previous')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'previous'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Previous Only
                  </button>
                  <button
                    onClick={() => setViewMode('current')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'current'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Current Only
                  </button>
                </div>
              </div>

              {/* Visual Display Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Image Box with Interactive Bounding Boxes */}
                <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-lg relative overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Mode: OVERLAY DIFF or CURRENT */}
                  {(viewMode === 'difference_overlay' || viewMode === 'current') && (
                    <div className="relative w-full max-w-lg aspect-4/3 rounded-xl overflow-hidden shadow-2xl bg-black">
                      <img
                        src={currentTwin.currentSnapshot.imageUrl}
                        alt="Current Packaging"
                        className="w-full h-full object-cover select-none"
                      />

                      {/* Computer Vision Bounding Boxes */}
                      {viewMode === 'difference_overlay' && currentTwin.visualRegions.map((region) => {
                        const isSelected = selectedRegionId === region.id;
                        const isViolation = region.status === 'changed_violation' || region.status === 'removed';
                        const isWarning = region.status === 'changed_warning';
                        const isUnchanged = region.status === 'unchanged';

                        const borderColor = isViolation
                          ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                          : isWarning
                          ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                          : 'border-emerald-400 bg-emerald-400/10 text-emerald-200';

                        return (
                          <div
                            key={region.id}
                            onClick={() => setSelectedRegionId(region.id)}
                            style={{
                              left: `${region.box.x}%`,
                              top: `${region.box.y}%`,
                              width: `${region.box.width}%`,
                              height: `${region.box.height}%`,
                            }}
                            className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 group ${borderColor} ${
                              isSelected ? 'ring-4 ring-blue-400 z-30 scale-102' : 'hover:scale-101'
                            }`}
                          >
                            <span className="absolute -top-5 left-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-black/90 text-white uppercase tracking-wider backdrop-blur-xs shadow-xs border border-white/20">
                              {region.label}
                            </span>
                            {isViolation && (
                              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                            )}
                          </div>
                        );
                      })}

                      {/* Mode Badge Indicator */}
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-300 border border-amber-400/40">
                        DIFF MAP: CURRENT LOT ({currentTwin.currentSnapshot.batchNumber})
                      </div>
                    </div>
                  )}

                  {/* Mode: SIDE BY SIDE */}
                  {viewMode === 'side_by_side' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-blue-300 text-center flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>PREVIOUS SCAN (Baseline)</span>
                        </div>
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-blue-500/40 bg-black">
                          <img
                            src={currentTwin.baselineSnapshot.imageUrl}
                            alt="Baseline Packaging"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                            Batch: {currentTwin.baselineSnapshot.batchNumber} • ₹ {currentTwin.baselineSnapshot.mrp}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-bold text-rose-300 text-center flex items-center justify-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>CURRENT SCAN (Modified Lot)</span>
                        </div>
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-rose-500/60 bg-black">
                          <img
                            src={currentTwin.currentSnapshot.imageUrl}
                            alt="Current Packaging"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-rose-300">
                            Batch: {currentTwin.currentSnapshot.batchNumber} • ₹ {currentTwin.currentSnapshot.mrp}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: PREVIOUS ONLY */}
                  {viewMode === 'previous' && (
                    <div className="relative w-full max-w-lg aspect-4/3 rounded-xl overflow-hidden shadow-2xl bg-black">
                      <img
                        src={currentTwin.baselineSnapshot.imageUrl}
                        alt="Baseline Packaging"
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-emerald-300 border border-emerald-400/40">
                        BASELINE SCAN: {currentTwin.baselineSnapshot.scanId}
                      </div>
                    </div>
                  )}

                  {/* Visual Map Footer Helper */}
                  <div className="mt-3 text-xs text-slate-400 flex flex-wrap items-center justify-between w-full gap-2 px-1">
                    <span className="flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>Click on any colored bounding box to view detailed statutory clause reasoning.</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      OCR Geometry Engine v3.2
                    </span>
                  </div>
                </div>

                {/* Selected Region Inspector Panel */}
                <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bounding Box Inspector</span>
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">
                      {currentTwin.visualRegions.length} Regions Mapped
                    </span>
                  </div>

                  {selectedRegion ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          selectedRegion.status === 'changed_violation' || selectedRegion.status === 'removed'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : selectedRegion.status === 'changed_warning'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {selectedRegion.changeType}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {selectedRegion.ruleRef}
                        </span>
                      </div>

                      <div>
                        <h5 className="text-sm font-black text-slate-900">{selectedRegion.label}</h5>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {selectedRegion.explanation}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Baseline Value:</span>
                          <span className="font-mono font-bold text-slate-800">{selectedRegion.previousValue}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-500">Current Value:</span>
                          <span className="font-mono font-bold text-rose-700">{selectedRegion.currentValue}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRegionId(null)}
                        className="w-full py-1.5 text-center text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Reset Selection / View All
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Select a detected region from the list below or tap directly on the packaging image bounding boxes:
                      </p>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {currentTwin.visualRegions.map((region) => {
                          const isViolation = region.status === 'changed_violation' || region.status === 'removed';
                          return (
                            <button
                              key={region.id}
                              onClick={() => setSelectedRegionId(region.id)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                                isViolation
                                  ? 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-200 text-rose-900'
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-bold truncate">{region.label}</p>
                                <p className="text-[10px] text-slate-500 truncate">{region.changeType}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7. REGULATION TIME MACHINE */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                          REGULATION TIME MACHINE
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                          Statutory Rule Retro-Verification on Manufacturing Date
                        </h3>
                      </div>
                    </div>

                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${
                      currentTwin.regulationTimeMachine.status === 'COMPLIANT_ON_MFG_DATE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : currentTwin.regulationTimeMachine.status === 'RETROACTIVE_NON_COMPLIANT'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {currentTwin.regulationTimeMachine.status === 'RETROACTIVE_NON_COMPLIANT'
                        ? 'Retroactive Violation'
                        : currentTwin.regulationTimeMachine.status === 'COMPLIANT_ON_MFG_DATE'
                        ? 'Compliant on Mfg Date'
                        : 'Manual Verification Required'}
                    </span>
                  </div>

                  {/* Core Time Machine Question & Answer Box */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-blue-200 font-semibold">
                      <HelpCircle className="w-4 h-4 text-blue-300 shrink-0" />
                      <span>Was this package compliant according to the regulation applicable on the manufacturing date?</span>
                    </div>

                    <p className="text-sm font-bold text-white leading-relaxed">
                      {currentTwin.regulationTimeMachine.verdictText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        <span className="text-slate-400 text-[10px] block">Manufacturing Date:</span>
                        <span className="font-bold text-white font-mono">
                          {currentTwin.regulationTimeMachine.mfgDate}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        <span className="text-slate-400 text-[10px] block">Statutory Act Applicable:</span>
                        <span className="font-bold text-blue-200">
                          {currentTwin.regulationTimeMachine.applicableRegulation}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        <span className="text-slate-400 text-[10px] block">Gazette Amendment in Force:</span>
                        <span className="font-bold text-purple-200">
                          {currentTwin.regulationTimeMachine.applicableVersion}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Historical Rule Availability Safeguard Note */}
                  {!currentTwin.regulationTimeMachine.historicalRulesAvailable ? (
                    <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Historical regulation data unavailable – manual verification required.</span>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowHistoricalRuleDetails(!showHistoricalRuleDetails)}
                        className="text-xs text-blue-300 hover:text-white font-semibold underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>
                          {showHistoricalRuleDetails
                            ? 'Hide Gazette Notification Amendments'
                            : 'View Gazette Notification Amendments Applicable to this Batch'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistoricalRuleDetails ? 'rotate-180' : ''}`} />
                      </button>

                      {showHistoricalRuleDetails && (
                        <div className="mt-3 space-y-2 animate-in fade-in duration-150">
                          {currentTwin.regulationTimeMachine.amendmentHistory.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs flex items-start space-x-3"
                            >
                              <span className="font-mono text-blue-300 font-bold shrink-0">{item.date}</span>
                              <div>
                                <span className="font-bold text-white block">{item.title} ({item.clause})</span>
                                <span className="text-slate-300 text-[11px] block mt-0.5">{item.summary}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 8. RISK ANALYSIS BREAKDOWN */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Change-Risk Summary & Legal Explanation</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explicit root-cause analysis of packaging modifications rather than generic AI confidence scores
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-200">
                    Risk Areas: {currentTwin.riskAnalysis.totalRiskAreas}
                  </span>
                </div>
              </div>

              {/* AI Root-Cause Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI Continuous Monitoring Dossier</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentTwin.riskAnalysis.aiSummary}
                </p>
              </div>

              {/* Detailed Risk Areas Cards */}
              {currentTwin.riskAnalysis.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentTwin.riskAnalysis.items.map((risk) => (
                    <div
                      key={risk.id}
                      className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                            {risk.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {risk.statutoryRef}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{risk.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {risk.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-rose-700 bg-rose-50/50 p-2 rounded-xl">
                        Action Required: {risk.actionRequired}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold">Zero Risk Drift Detected</h5>
                    <p className="text-emerald-800 mt-0.5">
                      All verified baseline declarations remain stable and compliant across ongoing retail lots.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 9. INSPECTION TIMELINE UI */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>Product Inspection & Digital Twin Timeline</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sequential lifecycle: First Scan → Digital Twin Created → Second Scan → Changes Detected → Compliance Re-check → Inspection Record Updated
                  </p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentTwin.inspectionTimeline.map((step) => {
                  const isFlagged = step.status === 'flagged';
                  const isCurrent = step.status === 'current';
                  const isCompleted = step.status === 'completed';

                  return (
                    <div key={step.id} className="relative group">
                      {/* Timeline Node Bullet */}
                      <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-[10px] transition-transform ${
                        isFlagged
                          ? 'bg-rose-500 border-white text-white shadow-md shadow-rose-500/30'
                          : isCurrent
                          ? 'bg-amber-500 border-white text-white shadow-md shadow-amber-500/30'
                          : 'bg-blue-600 border-white text-white'
                      }`}>
                        {step.stepNumber}
                      </div>

                      {/* Timeline Card */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isFlagged
                          ? 'bg-rose-50/60 border-rose-200 shadow-2xs'
                          : isCurrent
                          ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                          : 'bg-white border-slate-200 shadow-2xs'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900">{step.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                              {step.badge}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500">{step.date}</span>
                        </div>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {step.description}
                        </p>

                        <div className="mt-2 text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                          <span>Officer / Engine:</span>
                          <span className="text-slate-600">{step.inspector}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 10. BOTTOM ACTION BAR */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                PackSure AI Continuous Compliance Engine • Registered under Ministry of Consumer Affairs, GOI
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {onOpenCertificate && (
                  <button
                    onClick={() => {
                      const tempResult: ProductScanResult = {
                        id: currentTwin.id,
                        productName: currentTwin.productName,
                        brandName: currentTwin.brandName,
                        category: currentTwin.category,
                        barcode: currentTwin.barcode,
                        imageUrl: currentTwin.currentSnapshot.imageUrl,
                        scannedAt: currentTwin.lastScanDate,
                        manufacturer: currentTwin.currentSnapshot.manufacturer,
                        address: currentTwin.currentSnapshot.address,
                        netQuantity: currentTwin.currentSnapshot.netQuantity,
                        mrp: currentTwin.currentSnapshot.mrp,
                        unitSalePrice: currentTwin.currentSnapshot.unitSalePrice,
                        manufacturingDate: currentTwin.currentSnapshot.manufacturingDate,
                        consumerCareDetails: currentTwin.currentSnapshot.consumerCareDetails,
                        countryOfOrigin: currentTwin.currentSnapshot.countryOfOrigin,
                        complianceScore: currentTwin.complianceScore,
                        status: currentTwin.complianceStatus,
                        riskLevel: currentTwin.riskLevel,
                        rules: [],
                        violations: currentTwin.riskAnalysis.items.map((i) => i.title),
                        penaltiesNotice: 'Section 36(1) Notice for packaging alterations.',
                      };
                      onOpenCertificate(tempResult);
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Generate Twin Audit Certificate</span>
                  </button>
                )}

                <button
                  onClick={handleRunComparison}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-run Differential Engine</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Digital Twin Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No continuous compliance twin matched your search filter. You can create a new Digital Twin baseline using any barcode.
            </p>
            <button
              onClick={() => setShowCreateTwinModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Create Digital Twin
            </button>
          </div>
        )}
      </div>

      {/* 11. 7-STEP COMPARATIVE DIFFERENCING PROGRESS MODAL */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    AI Comparative Differencing Engine
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Executing 7-step Legal Metrology PCR 2011 verification
                  </p>
                </div>
              </div>
            </div>

            {/* 7-Step Visual List */}
            <div className="space-y-3">
              {[
                { step: 1, title: 'Retrieve previous product record using barcode identity' },
                { step: 2, title: 'Compare OCR text and statutory fields' },
                { step: 3, title: 'Compare visual packaging regions and layout' },
                { step: 4, title: 'Detect changed values (MRP, Net Qty, Declarations)' },
                { step: 5, title: 'Highlight changed areas on packaging plate' },
                { step: 6, title: 'Re-run statutory compliance checks against PCR 2011' },
                { step: 7, title: 'Generate comparative explanation and enforcement dossier' },
              ].map((item) => {
                const isPassed = comparisonStep > item.step;
                const isCurrent = comparisonStep === item.step;

                return (
                  <div
                    key={item.step}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs transition-all ${
                      isPassed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center font-mono">
                          {item.step}
                        </span>
                      )}
                    </div>
                    <span className="flex-1">{item.title}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={isComparing}
                onClick={() => setShowComparisonModal(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isComparing
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isComparing ? 'Comparing Packaging...' : 'View Comparison Results'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. CREATE DIGITAL TWIN MODAL */}
      {showCreateTwinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <CopyCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Create New Compliance Digital Twin
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Register product baseline into continuous monitoring registry
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Product Barcode / GTIN (13 digits):
              </label>
              <input
                type="text"
                value={newTwinBarcode}
                onChange={(e) => setNewTwinBarcode(e.target.value)}
                placeholder="e.g. 8901030383451"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tip: You can also scan any product label directly in the Scanner and tap "Register as Digital Twin".
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateTwinModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newTwinBarcode.trim() || isCreatingTwin}
                onClick={handleCreateNewTwin}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                {isCreatingTwin ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Establishing SHA-256 Twin...</span>
                  </>
                ) : (
                  <span>Establish Digital Twin</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
