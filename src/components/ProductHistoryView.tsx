import React, { useState } from 'react';
import { 
  History, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Filter, 
  Scan, 
  Trash2,
  Calendar,
  Building2,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Layers,
  Sparkles,
  Clock,
  ArrowDown
} from 'lucide-react';
import { ProductScanResult, Language } from '../types';
import { sampleProducts } from '../data/sampleProducts';

interface ProductHistoryViewProps {
  language: Language;
  onSelectProduct: (product: ProductScanResult) => void;
  onOpenCertificate: (product: ProductScanResult) => void;
  onScanNew: () => void;
  scannedProducts?: ProductScanResult[];
  onNavigateToDigitalTwin?: () => void;
}

export const ProductHistoryView: React.FC<ProductHistoryViewProps> = ({
  language,
  onSelectProduct,
  onOpenCertificate,
  onScanNew,
  scannedProducts = [],
  onNavigateToDigitalTwin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);

  // Combined product history: scannedProducts first, followed by default sample verified food products
  const defaultHistory: ProductScanResult[] = [
    {
      ...sampleProducts[0],
      id: 'hist-amul-milk',
      productName: 'Amul Fresh Milk',
      brandName: 'Amul',
      category: 'Dairy • Pasteurized Toned Milk',
      barcode: '8901262010058',
      scannedAt: 'Today, 10:42 AM',
      complianceScore: 100,
      status: 'COMPLIANT',
      riskLevel: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
      otherDeclarations: 'FSSAI Lic. No. 10014021000032, 100% Vegetarian, Pure Milk',
      netQuantity: '500 mL',
      mrp: '₹ 27.00 (Incl. of all taxes)',
      unitSalePrice: '₹ 0.054 per mL',
    },
    {
      ...sampleProducts[0],
      id: 'hist-tata-salt',
      productName: 'Tata Salt',
      brandName: 'Tata',
      category: 'Essential Groceries • Vacuum Evaporated Iodized Salt',
      barcode: '8901030383451',
      scannedAt: 'Today, 09:15 AM',
      complianceScore: 100,
      status: 'COMPLIANT',
      riskLevel: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=300&q=80',
      otherDeclarations: 'FSSAI Lic. No. 10012022000085, Iodine content > 15 ppm',
      netQuantity: '1 kg',
      mrp: '₹ 28.00 (Incl. of all taxes)',
      unitSalePrice: '₹ 0.028 per g',
    },
    {
      ...sampleProducts[0],
      id: 'hist-maggi-noodles',
      productName: 'Maggi 2-Minute Noodles',
      brandName: 'Nestle',
      category: 'Instant Foods • Special Masala Noodles',
      barcode: '8901058852892',
      scannedAt: 'Yesterday, 04:30 PM',
      complianceScore: 98,
      status: 'COMPLIANT',
      riskLevel: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=300&q=80',
      otherDeclarations: 'FSSAI Lic. No. 10012011000168, Contains Wheat & Soy',
      netQuantity: '70 g',
      mrp: '₹ 14.00 (Incl. of all taxes)',
      unitSalePrice: '₹ 0.20 per g',
    },
    {
      ...sampleProducts[0],
      id: 'hist-fortune-oil',
      productName: 'Fortune Sunlite Refined Oil',
      brandName: 'Fortune',
      category: 'Edible Oils • Sunflower Oil Pouch',
      barcode: '8906007280145',
      scannedAt: '2 days ago, 11:20 AM',
      complianceScore: 100,
      status: 'COMPLIANT',
      riskLevel: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
      otherDeclarations: 'FSSAI Lic. No. 10013021000812, Fortified with Vitamin A & D',
      netQuantity: '1 L',
      mrp: '₹ 145.00 (Incl. of all taxes)',
      unitSalePrice: '₹ 0.145 per mL',
    },
    ...sampleProducts,
  ];

  // Merge session scanned products and default history, removing duplicates by ID or barcode
  const allHistory = [...scannedProducts, ...defaultHistory].filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  const filteredItems = allHistory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            SAFE • COMPLIANT
          </span>
        );
      case 'PARTIALLY COMPLIANT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            PARTIAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            NON-COMPLIANT
          </span>
        );
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 mb-1.5">
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>Tamper-Proof Audit Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product History & Verified Scans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Complete audit trail of scanned packaged commodities, legal metrology assessments, and certificates.
          </p>
        </div>

        <button
          onClick={onScanNew}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Scan className="w-4 h-4" />
          <span>Scan New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          {['ALL', 'COMPLIANT', 'PARTIALLY COMPLIANT', 'NON-COMPLIANT'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'All Items' : status === 'COMPLIANT' ? 'Compliant' : status === 'PARTIALLY COMPLIANT' ? 'Partial' : 'Non-Compliant'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product, brand, EAN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Top Digital Twin Monitoring Announcement Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/40 text-purple-200 border border-purple-300/30">
                Continuous Compliance System
              </span>
              <span className="text-xs text-purple-200 font-semibold">• 3 Packaging Changes Detected</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              AI Compliance Digital Twin & Change Detection Active
            </h3>
          </div>
        </div>

        {onNavigateToDigitalTwin && (
          <button
            onClick={onNavigateToDigitalTwin}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Open Digital Twin Hub</span>
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No scanned products matched</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          filteredItems.map((prod) => {
            const isTimelineOpen = expandedTimelineId === prod.id;
            const hasInfraction = prod.status !== 'COMPLIANT';

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={prod.imageUrl}
                        alt={prod.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {prod.productName}
                        </h3>
                        {getStatusBadge(prod.status)}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Score: {prod.complianceScore}%
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center space-x-1">
                          <Layers className="w-3 h-3 text-purple-600" />
                          <span>Twin Mapped</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {prod.category} • Net: {prod.netQuantity} • MRP: {prod.mrp}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                        <span className="font-mono">Barcode: {prod.barcode}</span>
                        <span>•</span>
                        <span>{prod.scannedAt || 'Recent Scan'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setExpandedTimelineId(isTimelineOpen ? null : prod.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center space-x-1.5 cursor-pointer ${
                        isTimelineOpen
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                      }`}
                      title="View Continuous Timeline"
                    >
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Timeline</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isTimelineOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => onOpenCertificate(prod)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
                      title="View Certificate"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Certificate</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Inspect Audit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* UPGRADED PRODUCT HISTORY TIMELINE UI */}
                {isTimelineOpen && (
                  <div className="px-5 pb-5 pt-3 bg-slate-50/70 border-t border-slate-100 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Continuous Packaging Lifecycle Timeline
                        </span>
                      </div>

                      {onNavigateToDigitalTwin && (
                        <button
                          onClick={onNavigateToDigitalTwin}
                          className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Open Full Digital Twin Comparison</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Timeline Sequence: First Scan ↓ Digital Twin Created ↓ Second Scan ↓ Changes Detected ↓ Compliance Re-check ↓ Inspection Record Updated */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-mono">1</span>
                          <span>First Scan</span>
                        </div>
                        <p className="text-[11px] text-slate-600">Baseline captured at intake.</p>
                        <span className="text-[10px] text-slate-400 font-mono block">Intake Completed</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-purple-700 font-bold">
                          <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] flex items-center justify-center font-mono">2</span>
                          <span>Digital Twin Created</span>
                        </div>
                        <p className="text-[11px] text-slate-600">SHA-256 fingerprint registered.</p>
                        <span className="text-[10px] text-purple-600 font-mono block font-semibold">Active Baseline</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 text-[10px] flex items-center justify-center font-mono">3</span>
                          <span>Second Scan</span>
                        </div>
                        <p className="text-[11px] text-slate-600">Market surveillance sample.</p>
                        <span className="text-[10px] text-slate-400 font-mono block">Retail Audit</span>
                      </div>

                      <div className={`p-3 bg-white rounded-xl border text-xs space-y-1 ${
                        hasInfraction ? 'border-rose-300 bg-rose-50/30' : 'border-emerald-200'
                      }`}>
                        <div className={`flex items-center space-x-1.5 font-bold ${
                          hasInfraction ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                            hasInfraction ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>4</span>
                          <span>Changes Detected</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {hasInfraction ? 'Visual diff: Price/Weight shift.' : 'Zero layout drift detected.'}
                        </p>
                        <span className={`text-[10px] font-bold block ${
                          hasInfraction ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {hasInfraction ? 'Infraction Flagged' : 'Identical Layout'}
                        </span>
                      </div>

                      <div className={`p-3 bg-white rounded-xl border text-xs space-y-1 ${
                        hasInfraction ? 'border-rose-300' : 'border-emerald-200'
                      }`}>
                        <div className={`flex items-center space-x-1.5 font-bold ${
                          hasInfraction ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                            hasInfraction ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>5</span>
                          <span>Compliance Re-check</span>
                        </div>
                        <p className="text-[11px] text-slate-600">Rule 6 & PCR 2011 evaluated.</p>
                        <span className="text-[10px] font-bold block text-slate-700">
                          Score: {prod.complianceScore}%
                        </span>
                      </div>

                      <div className={`p-3 bg-white rounded-xl border text-xs space-y-1 ${
                        hasInfraction ? 'border-amber-300 bg-amber-50/30' : 'border-emerald-200'
                      }`}>
                        <div className={`flex items-center space-x-1.5 font-bold ${
                          hasInfraction ? 'text-amber-800' : 'text-emerald-700'
                        }`}>
                          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                            hasInfraction ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>6</span>
                          <span>Record Updated</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {hasInfraction ? 'Notice draft prepared.' : 'Passed & synchronized.'}
                        </p>
                        <span className="text-[10px] font-mono font-bold block text-blue-700">
                          Registry Synced
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
