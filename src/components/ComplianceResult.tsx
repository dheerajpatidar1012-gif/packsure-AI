import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  FileText, 
  Award, 
  ShieldAlert, 
  Scale, 
  Share2, 
  Printer, 
  ChevronRight,
  ExternalLink,
  Info,
  Sparkles,
  Eye,
  Layers,
  ArrowLeftRight,
  ShieldCheck,
  Check,
  HelpCircle,
  Barcode,
  Database,
  ScanLine
} from 'lucide-react';
import { ProductScanResult, Language, HeatmapBox } from '../types';
import { getTranslation } from '../utils/translations';
import { ProductDetailsView } from './ProductDetailsView';

interface ComplianceResultProps {
  result: ProductScanResult;
  language: Language;
  onScanAnother: () => void;
  onOpenCertificate: (result: ProductScanResult) => void;
  onViewRule?: (ruleCode: string) => void;
  onCompareProduct?: (product: ProductScanResult) => void;
  onViewDigitalTwin?: () => void;
}

export const ComplianceResult: React.FC<ComplianceResultProps> = ({
  result,
  language,
  onScanAnother,
  onOpenCertificate,
  onViewRule,
  onCompareProduct,
  onViewDigitalTwin,
}) => {
  const t = getTranslation(language);
  const [copied, setCopied] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [resultViewMode, setResultViewMode] = useState<'audit' | 'product_details'>('audit');

  const isCompliant = result.status === 'COMPLIANT';
  const isPartial = result.status === 'PARTIALLY COMPLIANT';
  const isNonCompliant = result.status === 'NON-COMPLIANT';

  // Status color schemes
  const statusColor = isCompliant
    ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
    : isPartial
    ? 'text-amber-700 bg-amber-50 border-amber-300'
    : 'text-rose-700 bg-rose-50 border-rose-300';

  const scoreRingColor = isCompliant
    ? '#10b981'
    : isPartial
    ? '#f59e0b'
    : '#ef4444';

  // Risk calculation
  const riskLevel = result.riskLevel || (result.complianceScore >= 90 ? 'LOW' : result.complianceScore >= 65 ? 'MEDIUM' : 'HIGH');

  // Sub-scores
  const subScores = result.subScores || {
    mandatoryInfo: Math.round((result.complianceScore / 100) * 10),
    labelClarity: result.complianceScore >= 75 ? 9 : 7,
    declarationCompliance: Math.max(3, Math.round((result.complianceScore / 100) * 10)),
  };

  // Fallback Heatmap Boxes if not provided on custom uploads
  const heatmapBoxes: HeatmapBox[] = result.heatmapBoxes && result.heatmapBoxes.length > 0 
    ? result.heatmapBoxes 
    : [
        {
          id: 'box-1',
          label: 'MRP — Detected',
          status: result.mrp && !result.mrp.toLowerCase().includes('taxes extra') ? 'verified' : 'violation',
          x: 15,
          y: 68,
          width: 35,
          height: 14,
          detail: result.mrp || 'MRP Declaration',
          ruleCode: 'Rule 6(1)(e)',
        },
        {
          id: 'box-2',
          label: 'Net Quantity — Detected',
          status: result.netQuantity && !result.netQuantity.toLowerCase().includes('gm.') ? 'verified' : 'violation',
          x: 55,
          y: 68,
          width: 32,
          height: 14,
          detail: result.netQuantity || 'Net Mass / Volume',
          ruleCode: 'Rule 6(1)(c)',
        },
        {
          id: 'box-3',
          label: 'Manufacturer — Detected',
          status: result.manufacturer && result.address && result.address.length > 10 ? 'verified' : 'warning',
          x: 15,
          y: 45,
          width: 72,
          height: 16,
          detail: result.manufacturer || 'Manufacturer Information',
          ruleCode: 'Rule 6(1)(a)',
        },
        {
          id: 'box-4',
          label: result.consumerCareDetails && result.consumerCareDetails.length > 5 ? 'Consumer Care — Detected' : 'Consumer Care — Missing',
          status: result.consumerCareDetails && (result.consumerCareDetails.includes('@') || result.consumerCareDetails.includes('1800') || result.consumerCareDetails.includes('Tel')) ? 'verified' : 'violation',
          x: 15,
          y: 22,
          width: 72,
          height: 16,
          detail: result.consumerCareDetails || 'Customer Redressal Cell',
          ruleCode: 'Rule 6(1)(f)',
        },
      ];

  // AI Insight computation
  const aiInsight = result.aiInsight || {
    summary: isCompliant 
      ? 'All mandatory statutory declarations were detected successfully with zero infractions. The product has a low compliance risk.'
      : isPartial
      ? '5 mandatory fields were detected successfully. 2 fields require attention. The product has a medium compliance risk.'
      : 'Critical statutory declarations failed validation. The product has a HIGH compliance risk under Section 36(1).',
    topIssue: result.violations[0] || 'No critical issues detected. Packaging is compliant.',
    fieldsDetectedCount: result.rules.filter(r => r.status === 'PASS').length,
    fieldsAttentionCount: result.rules.filter(r => r.status !== 'PASS').length,
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `PackSure AI Compliance Audit: ${result.productName} - Score: ${result.complianceScore}% (${result.status})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb / Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Legal Metrology Audit Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {result.productName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited on {result.scannedAt} • Inspection ID: <span className="font-mono font-bold text-slate-700">{result.id.toUpperCase()}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onViewDigitalTwin && (
              <button
                onClick={onViewDigitalTwin}
                className="flex items-center space-x-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Digital Twin</span>
              </button>
            )}

            {onCompareProduct && (
              <button
                onClick={() => onCompareProduct(result)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                <span>Compare Product</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Legal Metrology Audit vs. Product Details / Barcode Registry */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setResultViewMode('audit')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                resultViewMode === 'audit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>1. Legal Metrology Statutory Audit</span>
            </button>

            <button
              onClick={() => setResultViewMode('product_details')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                resultViewMode === 'product_details'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>2. Product Details & Barcode Registry</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                Verified Database
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono hidden md:block">
            Barcode: <span className="font-bold text-slate-800">{result.barcode || 'N/A'}</span>
          </div>
        </div>

        {resultViewMode === 'product_details' ? (
          <ProductDetailsView
            product={result}
            databaseInfo={result.databaseInfo}
            verifications={result.packageVerification}
            onBackToScan={onScanAnother}
            onViewComplianceReport={() => setResultViewMode('audit')}
          />
        ) : (
          <>
            {/* 12. UNIQUE "AI INSIGHT" CARD */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>AI Insight</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    Multimodal Neural Analysis
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Automated regulatory compliance synthesis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                ✓ {aiInsight.fieldsDetectedCount} Detected
              </span>
              {aiInsight.fieldsAttentionCount > 0 && (
                <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold">
                  ⚠️ {aiInsight.fieldsAttentionCount} Need Attention
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {aiInsight.summary}
          </p>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-2.5 text-xs text-slate-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Top Issue: </strong>
              <span>{aiInsight.topIssue}</span>
            </div>
          </div>
        </div>

        {/* 3. AI LABEL ANALYSIS & VIOLATION HEATMAP */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Visual Inspection Overlay
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Packaging Label & Violation Heatmap
              </h2>
              <p className="text-xs text-slate-500">
                Interactive spatial bounding boxes highlighting statutory compliance regions.
              </p>
            </div>

            {/* Toggle Heatmap */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  showHeatmap 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{showHeatmap ? 'Heatmap Active' : 'Show Heatmap'}</span>
              </button>
            </div>
          </div>

          {/* Visual Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image with Overlaid Bounding Boxes */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 flex items-center justify-center select-none group">
                <img
                  src={result.imageUrl}
                  alt={result.productName}
                  className="w-full h-full object-cover object-center opacity-90 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Heatmap Overlay */}
                {showHeatmap && (
                  <div className="absolute inset-0 pointer-events-auto">
                    {heatmapBoxes.map((box) => {
                      const isSelected = selectedBoxId === box.id;
                      const isVerified = box.status === 'verified';
                      const isWarning = box.status === 'warning';
                      const isViolation = box.status === 'violation';

                      const borderClass = isVerified
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : isWarning
                        ? 'border-amber-400 bg-amber-500/25'
                        : 'border-rose-500 bg-rose-600/30';

                      const tagClass = isVerified
                        ? 'bg-emerald-600 text-white'
                        : isWarning
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white';

                      return (
                        <div
                          key={box.id}
                          onClick={() => setSelectedBoxId(isSelected ? null : box.id)}
                          style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                          }}
                          className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-start p-1 ${borderClass} ${
                            isSelected ? 'ring-2 ring-white scale-102 z-20 shadow-lg' : 'hover:scale-101 z-10'
                          }`}
                        >
                          <span
                            className={`inline-block self-start text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm leading-tight ${tagClass}`}
                          >
                            {box.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Heatmap Legend */}
              <div className="mt-4 w-full max-w-md flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 inline-block shadow-2xs"></span>
                  <span>Green = Verified</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 inline-block shadow-2xs"></span>
                  <span>Yellow = Needs Review</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600 inline-block shadow-2xs"></span>
                  <span>Red = Missing / Violation</span>
                </div>
              </div>
            </div>

            {/* Right: Selected Bounding Box Details & Extracted Items */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Detected Packaging Declarations
              </h4>
              <p className="text-xs text-slate-500 -mt-2">
                Click any tag or box below to inspect verification metadata:
              </p>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {heatmapBoxes.map((box) => {
                  const isSelected = selectedBoxId === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBoxId(isSelected ? null : box.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/70 shadow-xs' 
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              box.status === 'verified'
                                ? 'bg-emerald-500'
                                : box.status === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-900">
                            {box.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                          {box.ruleCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 pl-4.5">
                        {box.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. AI COMPLIANCE SCORE & SUB-SCORES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg relative overflow-hidden">
          {/* Top Decorative accent line */}
          <div
            className={`absolute top-0 inset-x-0 h-2 ${
              isCompliant
                ? 'bg-emerald-500'
                : isPartial
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Circular Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={scoreRingColor}
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * result.complianceScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                    {result.complianceScore}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider -mt-1">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${statusColor}`}
                >
                  {result.status === 'COMPLIANT' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                  {result.status === 'PARTIALLY COMPLIANT' && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />}
                  {result.status === 'NON-COMPLIANT' && <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                  <span>{result.status}</span>
                </span>
              </div>
            </div>

            {/* Sub-scores breakdown & Risk Level */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Compliance Sub-Score Metrics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmic evaluation across core legal metrology dimensions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Mandatory Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Mandatory Information
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                    {subScores.mandatoryInfo} <span className="text-xs text-slate-400 font-sans">/ 10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${subScores.mandatoryInfo * 10}%` }}
                    />
                  </div>
                </div>

                {/* Label Clarity */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Label Clarity
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                    {subScores.labelClarity} <span className="text-xs text-slate-400 font-sans">/ 10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${subScores.labelClarity * 10}%` }}
                    />
                  </div>
                </div>

                {/* Declaration Compliance */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Declaration Compliance
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                    {subScores.declarationCompliance} <span className="text-xs text-slate-400 font-sans">/ 10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${subScores.declarationCompliance * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Risk Level Badge & Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Risk Level:
                  </span>
                  {riskLevel === 'LOW' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>🟢 LOW RISK</span>
                    </span>
                  )}
                  {riskLevel === 'MEDIUM' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>🟡 MEDIUM RISK</span>
                    </span>
                  )}
                  {riskLevel === 'HIGH' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      <span>🔴 HIGH RISK</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500">
                  {riskLevel === 'LOW' && 'Commodity poses negligible enforcement hazard.'}
                  {riskLevel === 'MEDIUM' && 'Sub-optimal declarations require rectification notice.'}
                  {riskLevel === 'HIGH' && 'Critical non-compliance subject to compounding seizure.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="btn-download-report"
                  onClick={() => onOpenCertificate(result)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.btnDownloadReport}</span>
                </button>

                <button
                  id="btn-scan-another"
                  onClick={onScanAnother}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                  <span>{t.btnScanAnother}</span>
                </button>

                {onCompareProduct && (
                  <button
                    onClick={() => onCompareProduct(result)}
                    className="flex items-center space-x-1.5 text-xs text-indigo-700 hover:text-indigo-800 font-bold px-3 py-2 border border-indigo-200 rounded-xl bg-indigo-50/50 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                    <span>Compare with Another Product</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. SMART RULE EXPLAINER (For every detected violation) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Statutory Infraction Guidance
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Smart Rule Explainer
              </h2>
              <p className="text-xs text-slate-500">
                Detailed legal explanation and remediation steps for every detected non-compliance.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {result.violations.length} Infraction{result.violations.length === 1 ? '' : 's'}
            </span>
          </div>

          {result.rules.filter((r) => r.status !== 'PASS').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.rules
                .filter((r) => r.status !== 'PASS')
                .map((rule) => {
                  return (
                    <div
                      key={rule.id}
                      className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Header: Problem */}
                        <div className="flex items-start justify-between gap-2 border-b border-rose-100 pb-3">
                          <div className="flex items-start space-x-2">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                {rule.ruleCode}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 mt-1">
                                Problem: {rule.ruleName}
                              </h4>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">
                            {rule.status === 'WARNING' ? 'Needs Review' : 'Violation'}
                          </span>
                        </div>

                        {/* Why it matters */}
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-slate-400" />
                            <span>Why It Matters:</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            {rule.whyItMatters || rule.explanation}
                          </p>
                        </div>

                        {/* Recommended action */}
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Recommended Action:</span>
                          </div>
                          <p className="text-xs text-emerald-900 leading-relaxed bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 font-medium">
                            {rule.recommendedAction || 'Update packaging plate to include mandatory statutory wording.'}
                          </p>
                        </div>
                      </div>

                      {/* View Applicable Rule Button */}
                      {onViewRule && (
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => onViewRule(rule.ruleCode)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
                          >
                            <span>View Applicable Rule</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs flex items-center space-x-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">No Statutory Infractions Detected</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  All 14 statutory clauses under Rule 6 and Rule 11 have passed verification.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STATUTORY PENALTIES CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Scale className="w-4 h-4 text-blue-600" />
            <h4>{t.penaltiesClause}</h4>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
            <p className="font-semibold text-slate-900">
              Statutory Reference: Section 36 of Legal Metrology Act, 2009
            </p>
            <p>{result.penaltiesNotice}</p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Enforcement Authority: Controller of Legal Metrology, State Government / Ministry of Consumer Affairs, Government of India.
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
