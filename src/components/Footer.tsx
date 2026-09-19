import React from 'react';
import { ShieldCheck, Mail, Phone, ExternalLink, Sparkles } from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, language }) => {
  const t = getTranslation(language);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  Pack<span className="text-blue-400">Sure</span>
                </span>
                <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-sm border border-blue-400/30">
                  AI
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-md italic">
              “Making product compliance faster, smarter and more transparent.”
            </p>

            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              An AI-powered regulatory platform built to accelerate compliance inspections under the Legal Metrology (Packaged Commodities) Rules, 2011 and Section 18 / 36 of the Legal Metrology Act, 2009.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('scan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Scan Product Label
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gov-data');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Compliance Rules 2011
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Product History
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('ai-insights');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Insights & Telemetry
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-300 transition-colors cursor-pointer text-blue-400 font-semibold"
                >
                  Officer Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Statutory Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About PackSure AI
                </button>
              </li>
              <li className="hover:text-white cursor-pointer">
                Legal Metrology Act, 2009
              </li>
              <li className="hover:text-white cursor-pointer">
                Packaged Commodities Rules, 2011
              </li>
              <li className="hover:text-white cursor-pointer">
                Department of Consumer Affairs
              </li>
              <li className="hover:text-white cursor-pointer">
                National Consumer Helpline (1915)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PackSure AI. {t.footerCopyright}
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
