import React from 'react';
import { 
  Shield, 
  LayoutDashboard,
  Scan, 
  Layers, 
  Eye, 
  GitCompare, 
  History, 
  UserCheck, 
  Building2, 
  Brain, 
  FileText, 
  Settings, 
  Sparkles, 
  LogOut,
  Scale,
  Pill,
  Barcode
} from 'lucide-react';
import { ActiveTab, Language, InspectorProfile } from '../types';

interface LeftSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onScanClick?: () => void;
  historyCount?: number;
  queueCount?: number;
  currentInspector?: InspectorProfile | null;
  onLogout?: () => void;
  onLaunchDemo?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  onScanClick,
  historyCount = 24,
  queueCount = 7,
  currentInspector,
  onLogout,
  onLaunchDemo,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | null;
    badgeColor?: string;
    isPrimary?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'scan',
      label: language === 'hi' ? 'उत्पाद स्कैन (OCR)' : 'Scan Product (OCR)',
      icon: <Scan className="w-4 h-4" />,
      badge: 'VISION',
      badgeColor: 'bg-cyan-600 text-white',
    },
    {
      id: 'live-barcode',
      label: language === 'hi' ? 'बारकोड / MRP स्कैनर' : 'Barcode & MRP Scanner',
      icon: <Barcode className="w-4 h-4" />,
      badge: 'LIVE',
      badgeColor: 'bg-blue-600 text-white',
      isPrimary: true,
    },
    {
      id: 'smart-medicine',
      label: language === 'hi' ? 'स्मार्ट मेडिसिन' : 'Smart Medicine',
      icon: <Pill className="w-4 h-4" />,
      badge: 'SAFETY',
      badgeColor: 'bg-teal-600 text-white',
    },
    {
      id: 'twins',
      label: language === 'hi' ? 'उत्पाद ट्विन्स' : 'Product Twins',
      icon: <Layers className="w-4 h-4" />,
      badge: 'TWIN',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'evidence-map',
      label: language === 'hi' ? 'एविडेंस मैप' : 'Evidence Map',
      icon: <Eye className="w-4 h-4" />,
      badge: 'CORE',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'change-detection',
      label: language === 'hi' ? 'लेबल बदलाव जांच' : 'Change Detection',
      icon: <GitCompare className="w-4 h-4" />,
      badge: 'DIFF',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'history',
      label: language === 'hi' ? 'अनुपालन इतिहास' : 'Compliance History',
      icon: <History className="w-4 h-4" />,
      badge: historyCount ? String(historyCount) : null,
    },
    {
      id: 'queue',
      label: language === 'hi' ? 'निरीक्षण कतार' : 'Inspection Queue',
      icon: <UserCheck className="w-4 h-4" />,
      badge: queueCount ? String(queueCount) : '7',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'gov-data',
      label: language === 'hi' ? 'सरकारी नियम' : 'Government Data',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'PCR 2011',
    },
    {
      id: 'ai-insights',
      label: language === 'hi' ? 'एआई इनसाइट्स' : 'AI Insights',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: language === 'hi' ? 'निरीक्षण रिपोर्ट्स' : 'Reports',
      icon: <FileText className="w-4 h-4" />,
      badge: 'PDF',
      badgeColor: 'bg-slate-700 text-white',
    },
    {
      id: 'settings',
      label: language === 'hi' ? 'सेटिंग्स' : 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleItemClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (id === 'scan' && onScanClick) {
      onScanClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between shrink-0">
      <div>
        {/* Top Logo & Branding */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-100">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center text-white shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">PackSure</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-black bg-blue-600 text-white tracking-wide">AI</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              Legal Metrology Intelligence
            </p>
          </div>
        </div>

        {/* Demo Mode Quick Launcher Pill */}
        {onLaunchDemo && (
          <button
            onClick={onLaunchDemo}
            className="w-full mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-200 text-blue-800 text-xs font-bold flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span>Interactive Demo</span>
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
              START
            </span>
          </button>
        )}

        {/* Navigation Items (Exact 11 requested items) */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id || 
              (item.id === 'twins' && activeTab === 'digital-twin') ||
              (item.id === 'scan' && activeTab === 'live-barcode');

            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                      : 'bg-blue-50/70 text-blue-800 hover:bg-blue-100/80 border border-blue-200/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isSelected ? 'text-white' : 'text-blue-600'}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isSelected ? 'text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Officer Profile & Sign-out */}
      <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">
              {currentInspector?.name || 'Insp. Dheeraj Patidar'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {currentInspector?.badgeNumber || 'LM-DEL-4092'} • Online
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0"></div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
