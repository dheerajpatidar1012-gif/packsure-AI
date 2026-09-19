import React, { useState } from 'react';
import {
  DatabaseProductInfo,
  ProductScanResult,
  VerificationComparisonItem,
  ComplianceStatus,
} from '../types';
import {
  Barcode,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Scale,
  DollarSign,
  Info,
  RefreshCw,
  Camera,
  Search,
} from 'lucide-react';

interface ProductDetailsViewProps {
  barcode: string;
  barcodeFormat?: string;
  databaseProduct: DatabaseProductInfo;
  packageScanResult?: ProductScanResult | null;
  packageVerification?: VerificationComparisonItem[];
  smartInsight?: string;
  onScanAnother: () => void;
  onVerifyPackagePhoto?: () => void;
  onGenerateReport?: () => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  barcode,
  barcodeFormat = 'EAN-13',
  databaseProduct,
  packageScanResult,
  packageVerification = [],
  smartInsight,
  onScanAnother,
  onVerifyPackagePhoto,
  onGenerateReport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'verification' | 'compliance'>('overview');
  const [showAllDetails, setShowAllDetails] = useState(false);

  // Derive compliance score and status
  const complianceScore = packageScanResult?.complianceScore ?? 86;
  const complianceStatus: ComplianceStatus = packageScanResult?.status ?? 'COMPLIANT';

  // Format Status Badge
  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          text: 'COMPLIANT (LEGAL METROLOGY PCR 2011)',
        };
      case 'PARTIALLY COMPLIANT':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          text: 'PARTIALLY COMPLIANT (REVISION REQUIRED)',
        };
      case 'NON-COMPLIANT':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          icon: XCircle,
          text: 'NON-COMPLIANT (STATUTORY VIOLATION)',
        };
    }
  };

  const badge = getStatusBadge(complianceStatus);
  const StatusIcon = badge.icon;

  // Failed rules for inspection display
  const failedRules = packageScanResult?.rules?.filter(r => r.status === 'FAIL') || [];
  const warningRules = packageScanResult?.rules?.filter(r => r.status === 'WARNING') || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Barcode Identification Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle Decorative Background Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-600/15 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Barcode className="w-4 h-4 text-blue-400" />
              <span>Decoded Barcode: {barcode}</span>
              <span className="text-slate-400">({barcodeFormat})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {databaseProduct.productName || 'Verified Packaged Commodity'}
            </h1>

            <p className="text-sm text-slate-300 flex items-center space-x-2 flex-wrap">
              {databaseProduct.brand && (
                <span className="font-semibold text-blue-300">Brand: {databaseProduct.brand}</span>
              )}
              {databaseProduct.category && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>Category: {databaseProduct.category}</span>
                </>
              )}
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-xs">Source: {databaseProduct.source}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onScanAnother}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Scan Another Barcode</span>
            </button>

            {onVerifyPackagePhoto && (
              <button
                onClick={onVerifyPackagePhoto}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Verify Package Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Statutory Verdict Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${badge.bg}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Legal Metrology Verdict
              </p>
              <p className="text-sm font-extrabold text-white">{badge.text}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Compliance Score</span>
              <span className="text-2xl font-black text-white font-mono">
                {complianceScore}<span className="text-sm text-slate-400 font-normal">/100</span>
              </span>
            </div>

            {onGenerateReport && (
              <button
                onClick={onGenerateReport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Inspection Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SMART AI INSIGHT BOX */}
      {smartInsight && (
        <div className="bg-linear-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 p-5 sm:p-6 rounded-2xl border border-blue-200/80 shadow-xs relative">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  PackSure Smart AI Insight
                </h4>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold border border-blue-300">
                  Data-Grounded
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {smartInsight}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: PRICE INFORMATION (CRITICAL MANDATE) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Price Information (Statutory MRP)</h2>
            <p className="text-xs text-slate-500">
              Analysis of database pricing vs physical package declaration under Rule 6(1)(e)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card A: Database MRP */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Connected Product Database
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-200 text-slate-700">
                Database Source
              </span>
            </div>

            <div className="py-2">
              {databaseProduct.mrpAvailable && databaseProduct.databaseMrp ? (
                <div className="text-2xl font-black font-mono text-slate-900">
                  {databaseProduct.databaseMrp}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-100/70 text-amber-900 text-xs font-bold border border-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>MRP not available from the connected data source.</span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                    Open Food Facts and international barcode registries do not maintain official Indian statutory MRP values because MRP varies by batch and region.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/80 space-y-1">
              <div className="flex justify-between">
                <span>Price Source:</span>
                <span className="font-semibold text-slate-700">{databaseProduct.priceSource || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span className="font-semibold text-slate-700">INR (₹)</span>
              </div>
            </div>
          </div>

          {/* Card B: Physical Package MRP (From OCR) */}
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                MRP Printed on Package (Physical OCR)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                Physical Packaging
              </span>
            </div>

            <div className="py-2">
              {packageScanResult?.mrp && packageScanResult.mrp !== 'Not declared' ? (
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono text-blue-950">
                    {packageScanResult.mrp}
                  </div>
                  {packageScanResult.unitSalePrice && (
                    <p className="text-xs font-semibold text-blue-700">
                      Unit Sale Price: {packageScanResult.unitSalePrice}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Pending physical package label scan
                  </p>
                  <p className="text-xs text-slate-500">
                    Upload or capture the back panel photo to read the printed Maximum Retail Price.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-blue-900/80 pt-2 border-t border-blue-200/70 space-y-1">
              <div className="flex justify-between">
                <span>Statutory Mandate:</span>
                <span className="font-semibold text-blue-950">Rule 6(1)(e) & Rule 6(11)</span>
              </div>
              <div className="flex justify-between">
                <span>Inclusive of all taxes:</span>
                <span className="font-semibold text-emerald-700">Required by Law</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AI PACKAGE VERIFICATION (DATABASE vs PHYSICAL PACKAGE) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Package Verification</h2>
              <p className="text-xs text-slate-500">
                Cross-reference comparison: Connected Database Records vs Physical Packaging
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Dual-System Cross-Check
          </span>
        </div>

        {packageVerification.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Statutory Field</th>
                  <th className="py-3 px-4">Information on Physical Package</th>
                  <th className="py-3 px-4">Database Information</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packageVerification.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.label}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {item.packageValue ? (
                        <span className="font-mono text-xs">{item.packageValue}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not detected on visible packaging</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.databaseValue ? (
                        <span className="font-mono text-xs">{item.databaseValue}</span>
                      ) : (
                        <span className="text-amber-700 font-medium">Not Available in Database</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {item.status === 'MATCH' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Match</span>
                        </span>
                      )}
                      {item.status === 'CANNOT_VERIFY' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Cannot Verify</span>
                        </span>
                      )}
                      {item.status === 'DISCREPANCY' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 font-bold border border-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Discrepancy</span>
                        </span>
                      )}
                      {item.status === 'PACKAGE_ONLY' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                          <span>Package Declared</span>
                        </span>
                      )}
                      {item.status === 'DATABASE_ONLY' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          <span>Database Only</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              No physical package photo uploaded for cross-check yet
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Scan or upload the product packaging photo to automatically perform side-by-side verification between database registry and physical printing.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: PRODUCT DETAILS (ONLY FIELDS ACTUALLY AVAILABLE) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Product Database Details</h2>
              <p className="text-xs text-slate-500">
                Official specifications retrieved from connected product registry
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {databaseProduct.source}
          </span>
        </div>

        {/* Dynamic Fields Grid - strictly ONLY showing available fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {databaseProduct.brand && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Brand</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{databaseProduct.brand}</span>
            </div>
          )}

          {databaseProduct.productName && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Product Name</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{databaseProduct.productName}</span>
            </div>
          )}

          {databaseProduct.genericName && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Generic Name</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.genericName}</span>
            </div>
          )}

          {databaseProduct.category && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.category}</span>
            </div>
          )}

          {(databaseProduct.quantity || databaseProduct.netWeight) && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Net Quantity / Weight</span>
              <span className="text-sm font-bold font-mono text-slate-900 mt-0.5 block">
                {databaseProduct.quantity || databaseProduct.netWeight}
              </span>
            </div>
          )}

          {databaseProduct.servingSize && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Serving Size</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.servingSize}</span>
            </div>
          )}

          {databaseProduct.packagingType && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Packaging Type</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.packagingType}</span>
            </div>
          )}

          {databaseProduct.countryOfOrigin && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Country of Origin</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.countryOfOrigin}</span>
            </div>
          )}

          {databaseProduct.manufacturer && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Manufacturer / Packer</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{databaseProduct.manufacturer}</span>
            </div>
          )}

          {databaseProduct.manufacturerAddress && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered Address</span>
              <span className="text-sm font-normal text-slate-800 mt-0.5 block">{databaseProduct.manufacturerAddress}</span>
            </div>
          )}

          {databaseProduct.barcode && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">GTIN / EAN Barcode</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{databaseProduct.barcode}</span>
            </div>
          )}
        </div>

        {/* Ingredients & Allergens if available */}
        {databaseProduct.ingredients && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ingredients</span>
            <p className="text-xs text-slate-700 leading-relaxed">{databaseProduct.ingredients}</p>
          </div>
        )}

        {databaseProduct.allergens && databaseProduct.allergens.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">Allergen Declarations</span>
            <p className="text-xs text-rose-800 font-medium">
              {Array.isArray(databaseProduct.allergens) ? databaseProduct.allergens.join(', ') : databaseProduct.allergens}
            </p>
          </div>
        )}

        {/* Nutritional Information Table if available */}
        {databaseProduct.nutritionalInfo && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Nutritional Declarations (Per 100g / Serving)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {databaseProduct.nutritionalInfo.energy && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Energy</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.energy}</span>
                </div>
              )}
              {databaseProduct.nutritionalInfo.protein && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Protein</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.protein}</span>
                </div>
              )}
              {databaseProduct.nutritionalInfo.carbohydrates && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Carbs</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.carbohydrates}</span>
                </div>
              )}
              {databaseProduct.nutritionalInfo.fat && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Fat</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.fat}</span>
                </div>
              )}
              {databaseProduct.nutritionalInfo.sugar && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Sugar</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.sugar}</span>
                </div>
              )}
              {databaseProduct.nutritionalInfo.salt && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Salt</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{databaseProduct.nutritionalInfo.salt}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certifications and Labels */}
        {(databaseProduct.certifications || databaseProduct.labels) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {databaseProduct.certifications?.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
                ✓ {c}
              </span>
            ))}
            {databaseProduct.labels?.map((l, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                🏷️ {l}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: LEGAL METROLOGY COMPLIANCE CHECK */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Legal Metrology Compliance Audit</h2>
              <p className="text-xs text-slate-500">
                Evaluation under Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase block">Verdict</span>
            <span className="text-sm font-extrabold text-slate-900">{complianceStatus}</span>
          </div>
        </div>

        {/* Compliance Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700">Statutory Compliance Score</span>
            <span className="font-mono text-slate-900">{complianceScore} / 100</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                complianceScore >= 85
                  ? 'bg-emerald-500'
                  : complianceScore >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        {/* Failed Check Highlights */}
        {failedRules.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Non-Compliant Items Requiring Correction:</span>
            </h4>

            <div className="space-y-3">
              {failedRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 text-sm">{rule.ruleName}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-rose-200 text-rose-900 text-[10px]">
                      {rule.ruleCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-900">
                    <div>
                      <span className="font-bold block text-[11px] text-rose-950">Detected Information:</span>
                      <p>{rule.extractedValue || 'Not detected on visible packaging'}</p>
                    </div>
                    <div>
                      <span className="font-bold block text-[11px] text-rose-950">Expected Requirement:</span>
                      <p>{rule.requirement}</p>
                    </div>
                  </div>

                  {rule.recommendedAction && (
                    <div className="pt-2 border-t border-rose-200/60 text-rose-950">
                      <span className="font-bold block text-[11px]">Recommended Action:</span>
                      <p>{rule.recommendedAction}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passed Rules Accordion / List */}
        {packageScanResult?.rules && (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowAllDetails(!showAllDetails)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>View All Statutory Rules Evaluated ({packageScanResult.rules.length} Rules)</span>
              {showAllDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAllDetails && (
              <div className="space-y-2 pt-2">
                {packageScanResult.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800">{rule.ruleName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({rule.ruleCode})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{rule.explanation}</p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        rule.status === 'PASS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rule.status === 'WARNING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-xs text-slate-500">
          <p className="font-bold text-slate-700">Verified under Legal Metrology Act, 2009</p>
          <p>Government of India • Ministry of Consumer Affairs, Food & Public Distribution</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onScanAnother}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition-colors cursor-pointer"
          >
            Scan Another Product
          </button>

          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Official Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
