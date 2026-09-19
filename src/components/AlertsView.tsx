import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Filter, 
  Search, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Check
} from 'lucide-react';
import { Language } from '../types';

interface AlertsViewProps {
  language: Language;
  onNavigateToRules?: () => void;
}

interface RegulatoryNotice {
  id: string;
  title: string;
  source: string;
  category: 'URGENT' | 'COMPLIANCE_ADVISORY' | 'RULE_UPDATE';
  date: string;
  summary: string;
  legalClause: string;
  penaltyClause: string;
  actionRequired: string;
  isRead: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ language, onNavigateToRules }) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'advisory'>('all');
  const [search, setSearch] = useState('');
  const [readNotices, setReadNotices] = useState<Set<string>>(new Set(['alt-3']));

  const notices: RegulatoryNotice[] = [
    {
      id: 'alt-1',
      title: 'Mandatory Unit Sale Price (USP) Display on Packages Exceeding 100g/ml',
      source: 'Ministry of Consumer Affairs, Legal Metrology Division',
      category: 'URGENT',
      date: '12 Sep 2026',
      summary: 'Strict enforcement drive initiated across northern retail zones regarding omission of per-gram or per-milliliter unit pricing on packaged pulses, edible oils, and packaged snacks.',
      legalClause: 'Rule 6(11) of Legal Metrology (Packaged Commodities) Rules, 2011',
      penaltyClause: 'Compounding penalty up to ₹25,000 for first offence under Section 36(1)',
      actionRequired: 'Verify that USP is declared rounded to two decimal places on all qualifying commodity packs.',
      isRead: false,
    },
    {
      id: 'alt-2',
      title: 'FSSAI Traceability Mandate on Secondary Transport Packaging',
      source: 'Food Safety and Standards Authority of India (FSSAI)',
      category: 'URGENT',
      date: '10 Sep 2026',
      summary: 'Dairy products, infant formula, and edible oil secondary shippers must carry active 14-digit FSSAI licenses alongside primary packaging declarations.',
      legalClause: 'FSS (Packaging and Labelling) Regulations & Advisory No. FSSAI/QA/2026',
      penaltyClause: 'Product seizure and show-cause notice under Section 58 of FSS Act',
      actionRequired: 'Inspect outer transit cartons for indelible FSSAI license numbers and batch traceability QR codes.',
      isRead: false,
    },
    {
      id: 'alt-3',
      title: 'Standard Metric Symbol Enforcement: Prohibition of "gm." / "gms."',
      source: 'Directorate of Legal Metrology Enforcement Circular #48/2026',
      category: 'RULE_UPDATE',
      date: '08 Sep 2026',
      summary: 'Use of non-standard symbols like "gm.", "gms.", or "ltr." violates the standards of Weights and Measures. The only legal metric symbols are "g", "kg", "ml", "L".',
      legalClause: 'Rule 11 & Schedule II of Legal Metrology Rules, 2011',
      penaltyClause: 'Violation of statutory weight notation under Section 29',
      actionRequired: 'Flag any packages utilizing trailing periods or colloquial weight abbreviations.',
      isRead: true,
    },
    {
      id: 'alt-4',
      title: 'Minimum Font Height Thresholds for Principal Display Panels (PDP)',
      source: 'Standardization Bureau of Legal Metrology',
      category: 'COMPLIANCE_ADVISORY',
      date: '02 Sep 2026',
      summary: 'Imported commodities over-stickered with importer declarations must maintain minimum 2.0 mm font height for packages up to 200g, and 4.0 mm for packages exceeding 500g.',
      legalClause: 'Rule 7, Table I (Minimum Height of Numerals and Letters)',
      penaltyClause: 'Deceptive packaging violation notice under Rule 27',
      actionRequired: 'Utilize PackSure AI optical calipers to verify numeral heights on import labels.',
      isRead: true,
    },
  ];

  const toggleRead = (id: string) => {
    setReadNotices((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.legalClause.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'urgent') return n.category === 'URGENT';
    if (filter === 'advisory') return n.category === 'COMPLIANCE_ADVISORY' || n.category === 'RULE_UPDATE';
    return true;
  });

  const unreadCount = notices.filter((n) => !readNotices.has(n.id)).length;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 mb-1.5">
            <Bell className="w-3.5 h-3.5 text-rose-600" />
            <span>Inspectorate Advisory Bulletins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compliance & Enforcement Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live statutory enforcement directives issued by the Ministry of Consumer Affairs and FSSAI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>{unreadCount} Active Bulletins</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Notices ({notices.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              filter === 'urgent'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Urgent Directives
          </button>
          <button
            onClick={() => setFilter('advisory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              filter === 'advisory'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Advisories & Circulars
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search directives or clauses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isRead = readNotices.has(notice.id);
          const isUrgent = notice.category === 'URGENT';

          return (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUrgent
                  ? 'bg-gradient-to-r from-rose-50/40 via-white to-white border-rose-200 shadow-sm'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {notice.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isUrgent
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {notice.category.replace('_', ' ')}
                      </span>
                      {!isRead && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                      <span className="font-medium text-slate-700">{notice.source}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{notice.date}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                      {notice.summary}
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-700 block">Statutory Reference</span>
                        <span className="text-blue-700 font-medium">{notice.legalClause}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-700 block">Penalty Exposure</span>
                        <span className="text-rose-700 font-medium">{notice.penaltyClause}</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Required Inspector Action: </span>
                        <span>{notice.actionRequired}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => toggleRead(notice.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                      isRead
                        ? 'text-slate-400 hover:text-slate-700 bg-slate-50'
                        : 'text-blue-600 hover:text-blue-800 bg-blue-50 font-bold'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{isRead ? 'Mark Unread' : 'Acknowledge'}</span>
                  </button>

                  {onNavigateToRules && (
                    <button
                      onClick={onNavigateToRules}
                      className="text-xs text-slate-500 hover:text-blue-600 font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Explore Rule</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
