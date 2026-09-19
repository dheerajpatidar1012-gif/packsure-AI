import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Scale, 
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { LegalMetrologyRule, Language } from '../types';
import { legalMetrologyRules } from '../data/rulesData';
import { getTranslation } from '../utils/translations';

interface RulesExplorerProps {
  language: Language;
}

export const RulesExplorer: React.FC<RulesExplorerProps> = ({ language }) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRule, setExpandedRule] = useState<string | null>(legalMetrologyRules[0].id);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'pricing', label: 'MRP & Unit Price' },
    { id: 'quantity', label: 'Net Quantity' },
    { id: 'identity', label: 'Manufacturer & Packer' },
    { id: 'consumer_care', label: 'Consumer Care' },
    { id: 'dates', label: 'Manufacture Dates' },
    { id: 'origin', label: 'Country of Origin' },
  ];

  const filteredRules = legalMetrologyRules.filter((rule) => {
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rule.ruleNumber.toLowerCase().includes(query) ||
      rule.titleEn.toLowerCase().includes(query) ||
      rule.titleHi.toLowerCase().includes(query) ||
      rule.requirementEn.toLowerCase().includes(query) ||
      rule.simpleExplanationEn.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory Reference Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.rulesHeading}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.rulesSubheading}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-rules-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchRulesPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rules Cards List */}
        <div className="space-y-4">
          {filteredRules.map((rule) => {
            const isExpanded = expandedRule === rule.id;
            return (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all overflow-hidden"
              >
                {/* Rule Card Header */}
                <div
                  onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5 sm:mt-0 font-mono text-xs font-bold">
                      <Scale className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {rule.ruleNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          MANDATORY STATUTE
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {language === 'hi' ? rule.titleHi : rule.titleEn}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 shrink-0">
                    <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'View Details'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Rule Content (Requirement, Status, Simple Explanation, Penalty, Examples) */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 border-t border-slate-100 pt-5 space-y-5 animate-in fade-in duration-150">
                    {/* Requirement Section */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Statutory Requirement (कानूनी आवश्यकता)</span>
                      </h4>
                      <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        {language === 'hi' ? rule.requirementHi : rule.requirementEn}
                      </p>
                    </div>

                    {/* Simple Explanation Section */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Simple Explanation (सरल व्याख्या)</span>
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                        {language === 'hi' ? rule.simpleExplanationHi : rule.simpleExplanationEn}
                      </p>
                    </div>

                    {/* Legal Clause & Penalty Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                          Legal Metrology Act Clause
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          {rule.legalActClause}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                        <div className="text-xs font-bold text-rose-700 uppercase mb-1">
                          Penalty for Non-Compliance
                        </div>
                        <div className="text-xs font-medium text-rose-900 leading-relaxed">
                          {language === 'hi' ? rule.penaltyDetailHi : rule.penaltyDetailEn}
                        </div>
                      </div>
                    </div>

                    {/* Compliant vs Non-Compliant Examples */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Compliant Format Example:</span>
                        </div>
                        <div className="text-xs font-mono text-emerald-950 bg-white/80 p-2 rounded border border-emerald-200">
                          {rule.compliantExampleEn}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
                        <div className="flex items-center space-x-1.5 text-rose-800 text-xs font-bold mb-1">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>Non-Compliant Infraction Example:</span>
                        </div>
                        <div className="text-xs font-mono text-rose-950 bg-white/80 p-2 rounded border border-rose-200">
                          {rule.nonCompliantExampleEn}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
