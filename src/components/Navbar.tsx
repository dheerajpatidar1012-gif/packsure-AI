import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Info, 
  Globe, 
  UserCheck, 
  Menu, 
  X,
  HelpCircle,
  ArrowLeftRight,
  Sparkles
} from 'lucide-react';
import { ActiveTab, Language, InspectorProfile } from '../types';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenOfficerModal: () => void;
  inspector: InspectorProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenOfficerModal,
  inspector,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(language);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'scan', label: t.navScan, icon: <Scan className="w-4 h-4" /> },
    { id: 'history', label: language === 'hi' ? 'उत्पाद इतिहास' : 'Product History', icon: <FileText className="w-4 h-4" /> },
    { id: 'alerts', label: language === 'hi' ? 'अलर्ट' : 'Alerts', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'gov-data', label: t.navRules, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'ai-insights', label: 'AI Insights', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'compare', label: language === 'hi' ? 'तुलना करें' : 'Compare', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'about', label: t.navAbout, icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Gov-Tech Sub-Header Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white tracking-wide">
              GOV-TECH AI
            </span>
            <span className="hidden sm:inline text-slate-300">
              {language === 'hi' ? 'विधिक मापविज्ञान एवं खाद्य सुरक्षा अनुपालन' : 'Legal Metrology & FSSAI Compliance Inspectorate'}
            </span>
            <span className="sm:hidden text-slate-300">
              {language === 'hi' ? 'विधिक मापविज्ञान अनुपालन' : 'Legal Metrology Compliance'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden md:inline">
                {language === 'hi' ? 'सक्रिय विधिक नियम इंजन: पीसीआर २०११' : 'Active Legal Rules Engine: PCR 2011 & FSSAI'}
              </span>
              <span className="md:hidden">Active</span>
            </div>
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-blue-400 ml-1.5 mr-1" />
              <button
                id="btn-lang-en"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English"
                className={`px-2.5 py-0.5 text-xs font-bold rounded transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="btn-lang-hi"
                onClick={() => setLanguage('hi')}
                aria-label="Switch to Hindi"
                className={`px-2.5 py-0.5 text-xs font-bold rounded transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Pack<span className="text-blue-600">Sure</span>
                </span>
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-sm uppercase tracking-wider border border-blue-200 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-tight -mt-0.5 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              id="btn-officer-portal"
              onClick={onOpenOfficerModal}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                inspector
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${inspector ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{inspector ? `${inspector.name} (${inspector.badgeId})` : t.officerLogin}</span>
            </button>

            <button
              id="btn-nav-scan-cta"
              onClick={() => handleNavClick('scan')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-150 active:scale-98 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{t.getStarted}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              id="btn-mobile-scan-quick"
              onClick={() => handleNavClick('scan')}
              className="sm:hidden p-2 text-white bg-blue-600 rounded-lg"
            >
              <Scan className="w-4 h-4" />
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 shadow-xl space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100/80 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'hi' ? 'भाषा (Language)' : 'Language (भाषा)'}:</span>
              </span>
              <div className="flex items-center bg-white rounded-md p-0.5 border border-slate-300">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenOfficerModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 bg-slate-50"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>{inspector ? `${inspector.name}` : t.officerLogin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
