import React, { useState, useEffect } from 'react';
import { BarcodeScanRecord, ComplianceStatus, ProductScanResult } from '../types';
import {
  History,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  RotateCcw,
  Trash2,
  ExternalLink,
  Search,
} from 'lucide-react';

interface ScanHistoryViewProps {
  onSelectRecord: (record: BarcodeScanRecord) => void;
  onScanNew: () => void;
  onGenerateReport?: (result: ProductScanResult) => void;
}

const STORAGE_KEY = 'packsure_scan_history_v1';

export function getStoredScanHistory(): BarcodeScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveScanToHistory(record: BarcodeScanRecord) {
  try {
    const current = getStoredScanHistory();
    // Avoid duplicate at top
    const filtered = current.filter((r) => r.barcode !== record.barcode || r.id !== record.id);
    const updated = [record, ...filtered].slice(0, 30); // keep last 30
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to persist scan history:', e);
  }
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  onSelectRecord,
  onScanNew,
  onGenerateReport,
}) => {
  const [history, setHistory] = useState<BarcodeScanRecord[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'OVERCHARGED' | 'FAIR' | 'MEDICINE'>('ALL');

  useEffect(() => {
    // Load from local storage, seed defaults if empty
    const records = getStoredScanHistory();
    if (records.length === 0) {
      const defaultRecords: BarcodeScanRecord[] = [
        {
          id: 'hist-1',
          barcode: '8904063200155',
          format: 'EAN-13',
          productName: "Haldiram's Bhujia Sev 200g",
          brand: "Haldiram's",
          date: '12/09/2026, 04:15 PM',
          complianceScore: 68,
          status: 'NON-COMPLIANT',
          hasDatabaseInfo: true,
          hasPackageScan: true,
          mrp: '₹55.00',
          sellingPrice: '₹65.00',
          priceDifference: 10,
          safetyStatus: 'OVERCHARGED',
          category: 'Snacks & Savouries',
        },
        {
          id: 'hist-2',
          barcode: '8901030010103',
          format: 'EAN-13',
          productName: 'Britannia Good Day Butter Cookies',
          brand: 'Britannia',
          date: '12/09/2026, 02:40 PM',
          complianceScore: 94,
          status: 'COMPLIANT',
          hasDatabaseInfo: true,
          hasPackageScan: true,
          mrp: '₹35.00',
          sellingPrice: '₹35.00',
          priceDifference: 0,
          safetyStatus: 'FAIR_PRICE',
          category: 'Biscuits & Bakery',
        },
        {
          id: 'hist-3',
          barcode: '8901719101018',
          format: 'EAN-13',
          productName: 'Parle-G Gold Biscuits',
          brand: 'Parle',
          date: '11/09/2026, 11:20 AM',
          complianceScore: 88,
          status: 'PARTIALLY COMPLIANT',
          hasDatabaseInfo: true,
          hasPackageScan: true,
          mrp: '₹10.00',
          sellingPrice: '₹10.00',
          priceDifference: 0,
          safetyStatus: 'FAIR_PRICE',
          category: 'Biscuits & Bakery',
        },
        {
          id: 'hist-4',
          barcode: '8901058852331',
          format: 'EAN-13',
          productName: 'Nestlé Maggi 2-Minute Masala Noodles',
          brand: 'Maggi',
          date: '10/09/2026, 06:10 PM',
          complianceScore: 90,
          status: 'COMPLIANT',
          hasDatabaseInfo: true,
          hasPackageScan: true,
          mrp: '₹14.00',
          sellingPrice: '₹12.00',
          priceDifference: -2,
          safetyStatus: 'DISCOUNTED',
          category: 'Instant Foods',
        },
        {
          id: 'hist-5',
          barcode: '8901117012015',
          format: 'EAN-13',
          productName: 'Dolo-650 Paracetamol IP',
          brand: 'Micro Labs',
          date: '09/09/2026, 10:30 AM',
          complianceScore: 98,
          status: 'COMPLIANT',
          hasDatabaseInfo: true,
          hasPackageScan: true,
          mrp: '₹30.91',
          sellingPrice: '₹30.91',
          priceDifference: 0,
          safetyStatus: 'FAIR_PRICE',
          category: 'Pharmaceutical / Medicine',
        },
      ];
      setHistory(defaultRecords);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecords));
    } else {
      setHistory(records);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Clear all stored scan history?')) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    }
  };

  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      h.barcode.includes(searchFilter) ||
      (h.brand && h.brand.toLowerCase().includes(searchFilter.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategoryFilter === 'OVERCHARGED') {
      return h.safetyStatus === 'OVERCHARGED' || (h.priceDifference !== undefined && h.priceDifference > 0);
    }
    if (activeCategoryFilter === 'FAIR') {
      return h.safetyStatus === 'FAIR_PRICE' || h.safetyStatus === 'DISCOUNTED' || (h.priceDifference !== undefined && h.priceDifference <= 0);
    }
    if (activeCategoryFilter === 'MEDICINE') {
      return (h.category && (h.category.includes('Medicine') || h.category.includes('Pharmaceutical'))) || h.productName.toLowerCase().includes('dolo') || h.productName.toLowerCase().includes('crocin');
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Scan & Verification History</h2>
            <p className="text-xs text-slate-500">
              Audit trails of decoded barcodes, database cross-checks, MRP verification & statutory compliance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onScanNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
            <span>New Barcode Scan</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by product name, brand, or barcode number..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Records ({history.length})
          </button>
          <button
            onClick={() => setActiveCategoryFilter('OVERCHARGED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'OVERCHARGED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overcharging Detected ({history.filter(h => h.safetyStatus === 'OVERCHARGED' || (h.priceDifference && h.priceDifference > 0)).length})</span>
          </button>
          <button
            onClick={() => setActiveCategoryFilter('FAIR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'FAIR'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fair / Below MRP ({history.filter(h => h.safetyStatus === 'FAIR_PRICE' || h.safetyStatus === 'DISCOUNTED').length})</span>
          </button>
          <button
            onClick={() => setActiveCategoryFilter('MEDICINE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'MEDICINE'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white hover:bg-teal-50 text-teal-700 border border-teal-200'
            }`}
          >
            <span>💊 Medicines ({history.filter(h => (h.category && (h.category.includes('Medicine') || h.category.includes('Pharmaceutical'))) || h.productName.toLowerCase().includes('dolo')).length})</span>
          </button>
        </div>
      </div>

      {/* History Items */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {item.barcode}
                  </span>
                  {item.format && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.format}
                    </span>
                  )}
                  {item.category && (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.category}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">• {item.date}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.productName}</h3>

                {/* Pricing & Compliance Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {item.brand && <span>Brand: <strong className="text-slate-700">{item.brand}</strong></span>}
                  
                  {item.mrp && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      Printed MRP: <strong className="text-emerald-700">{item.mrp}</strong>
                    </span>
                  )}

                  {item.sellingPrice && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      Sold At: <strong className="text-slate-900">{item.sellingPrice}</strong>
                    </span>
                  )}

                  {item.safetyStatus === 'OVERCHARGED' || (item.priceDifference !== undefined && item.priceDifference > 0) ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>🚨 +₹{item.priceDifference || 10} Overcharged</span>
                    </span>
                  ) : item.safetyStatus === 'DISCOUNTED' || (item.priceDifference !== undefined && item.priceDifference < 0) ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      🟢 Discount Applied
                    </span>
                  ) : item.mrp ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      ✅ Matches MRP
                    </span>
                  ) : null}

                  <span>Compliance: <strong className="text-slate-800">{item.complianceScore}/100</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                    item.status === 'COMPLIANT'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : item.status === 'PARTIALLY COMPLIANT'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  {item.status === 'COMPLIANT' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : item.status === 'PARTIALLY COMPLIANT' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{item.status}</span>
                </span>

                <button
                  onClick={() => onSelectRecord(item)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No scan records found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the Barcode Camera or Image Upload to start scanning packaged products.
          </p>
          <button
            onClick={onScanNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Scan Product Now
          </button>
        </div>
      )}
    </div>
  );
};
