import React, { useState } from 'react';
import { 
  Scan, 
  Sparkles, 
  FileCheck, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Layers, 
  ArrowRight,
  Camera,
  Cpu,
  PackageCheck,
  ChevronRight,
  Play,
  Rotate3d,
  Box
} from 'lucide-react';
import { ActiveTab, Language, ProductScanResult } from '../types';
import { getTranslation } from '../utils/translations';
import { Packaging3DViewer } from './Packaging3DViewer';

interface HeroSectionProps {
  onScanClick: () => void;
  onDemoClick: () => void;
  onSelectProduct?: (productName: string, barcode: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScanClick,
  onDemoClick,
  onSelectProduct,
  setActiveTab,
  language,
}) => {
  const t = getTranslation(language);
  const [activeStep, setActiveStep] = useState<number>(2);
  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'pipeline'>('3d');

  const pipelineSteps = [
    {
      id: 0,
      title: t.flowStep1,
      badge: language === 'hi' ? 'चरण 1' : 'Step 1',
      icon: <Layers className="w-5 h-5" />,
      detail:
        language === 'hi'
          ? 'पैक की गई वस्तु का लेबल (कार्टन, पाउच, बोतल या बॉक्स)'
          : 'Packaged commodity label (carton, pouch, bottle, box)',
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 1,
      title: t.flowStep2,
      badge: language === 'hi' ? 'चरण 2' : 'Step 2',
      icon: <Camera className="w-5 h-5" />,
      detail:
        language === 'hi'
          ? 'हाई-डेफिनिशन ऑप्टिकल कैप्चर या बारकोड पहचान'
          : 'High-definition optical capture or barcode identification',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 2,
      title: t.flowStep3,
      badge: language === 'hi' ? 'चरण 3' : 'Step 3',
      icon: <Cpu className="w-5 h-5" />,
      detail:
        language === 'hi'
          ? 'मल्टीमॉडल OCR एवं नियम 6 NLP निष्कर्षण इंजन'
          : 'Multimodal OCR & Rule 6 NLP extraction engine',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 3,
      title: t.flowStep4,
      badge: language === 'hi' ? 'चरण 4' : 'Step 4',
      icon: <PackageCheck className="w-5 h-5" />,
      detail:
        language === 'hi'
          ? 'पास/फेल स्कोर, जुर्माना धारा एवं प्रमाणित रिपोर्ट'
          : 'Pass / Fail score, penalty clause & certified report',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/80 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badges */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="font-bold">PackSure AI</span>
            <span className="text-slate-400">|</span>
            <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Smart Product Compliance <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
              Verification with AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
            {t.heroSubheading}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              id="btn-hero-scan"
              onClick={onScanClick}
              className="flex items-center space-x-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
            >
              <Scan className="w-5 h-5" />
              <span>{t.btnScanProduct}</span>
            </button>

            <button
              id="btn-hero-3d"
              onClick={() => {
                setHeroViewMode('3d');
                const el = document.getElementById('hero-interactive-stage');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold px-5 py-3.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
            >
              <Rotate3d className="w-4 h-4 text-cyan-300" />
              <span>{language === 'hi' ? '3D पैकेजिंग एनिमेशन देखें' : 'Explore 3D Package'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-bold uppercase tracking-wider">
                3D Live
              </span>
            </button>

            <button
              id="btn-hero-demo"
              onClick={onDemoClick}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 shadow-2xs transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>{t.btnViewDemo}</span>
            </button>
          </div>
        </div>

        {/* Central Interactive Stage with 3D Packaging Animation and Workflow Pipeline */}
        <div id="hero-interactive-stage" className="mt-12 lg:mt-16 max-w-5xl mx-auto space-y-4">
          {/* Top Switcher Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setHeroViewMode('3d')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroViewMode === '3d'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Rotate3d className={`w-4 h-4 ${heroViewMode === '3d' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span>{language === 'hi' ? '3D पैकेजिंग सिमुलेटर एवं लेजर स्कैन' : 'Interactive 3D Packaging & Laser Scan'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  WebGL 3D
                </span>
              </button>

              <button
                onClick={() => setHeroViewMode('pipeline')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroViewMode === 'pipeline'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'hi' ? '4-चरणीय सत्यापन कार्यप्रवाह' : '4-Stage Inspection Pipeline'}</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'hi' ? 'नियम 6(1)(क)-(छ) अनुपालक' : 'Rule 6(1)(a)-(g) Compliant Engine'}</span>
            </div>
          </div>

          {/* VIEW 1: 3D ANIMATION VIEWER */}
          {heroViewMode === '3d' && (
            <div className="animate-in fade-in duration-300">
              <Packaging3DViewer
                language={language}
                onScanThisPackage={(name, barcode) => {
                  if (onSelectProduct) {
                    onSelectProduct(name, barcode);
                  } else {
                    onScanClick();
                  }
                }}
              />
            </div>
          )}

          {/* VIEW 2: STATUTORY WORKFLOW PIPELINE DIAGRAM */}
          {heroViewMode === 'pipeline' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80 animate-in fade-in duration-300">
              {/* Diagram Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {language === 'hi' ? 'स्वचालित सत्यापन कार्यप्रवाह' : 'Automated Verification Workflow'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'hi' ? 'शुरुआत से अंत तक वैधानिक सत्यापन पाइपलाइन' : 'End-to-end statutory validation pipeline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{language === 'hi' ? 'नियम 6(1)(क)-(छ) अनुपालक इंजन' : 'Rule 6(1)(a)-(g) Compliant Engine'}</span>
                </div>
              </div>

            {/* Pipeline Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
              {pipelineSteps.map((step, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`relative p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                    }`}
                  >
                    {/* Top connector arrow on desktop */}
                    {idx < pipelineSteps.length - 1 && (
                      <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400 shadow-2xs">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-2xs`}
                      >
                        {step.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {step.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Step Preview Panel */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-blue-300 font-semibold tracking-wide uppercase">
                    {language === 'hi' ? `चरण ${activeStep + 1} सक्रिय निरीक्षण` : `Stage ${activeStep + 1} Active Inspection`}
                  </div>
                  <div className="text-sm font-medium text-slate-100">
                    {activeStep === 0 && (language === 'hi' ? 'लक्षित पैकेजिंग को सामान्य या कम रोशनी में रखा जाता है।' : 'Target packaging is placed under normal or low ambient lighting.')}
                    {activeStep === 1 && (language === 'hi' ? 'हाई-स्पीड कैमरा एमआरपी, शुद्ध मात्रा और निर्माता टेक्स्ट बॉक्स को कैप्चर करता है।' : 'High-speed camera captures MRP, Net Qty and manufacturer text bounding boxes.')}
                    {activeStep === 2 && (language === 'hi' ? 'एनएलपी न्यूरल नेटवर्क नियम 6(1) के तहत अनिवार्य वैधानिक टैग निकालता है।' : 'NLP neural network extracts mandatory statutory tags per Rule 6(1).')}
                    {activeStep === 3 && (language === 'hi' ? 'त्वरित अनुपालन ग्रेडिंग, गायब फील्ड अलर्ट और दंड का आकलन।' : 'Instant compliance grading, missing field alerts, and penalty assessment.')}
                  </div>
                </div>
              </div>
              <button
                onClick={onScanClick}
                className="self-end sm:self-center shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>{language === 'hi' ? 'इस चरण का परीक्षण करें' : 'Test this step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

        {/* 3 Statistics Cards below Hero Section */}
        <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Powered Verification */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              {language === 'hi' ? '99.4% निष्कर्षण सटीकता' : '99.4% Extraction Precision'}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.stat1Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.stat1Desc}
            </p>
          </div>

          {/* Card 2: Fast Label Analysis */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              {language === 'hi' ? '< 2.5s लेटेंसी' : '< 2.5s Latency'}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.stat2Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.stat2Desc}
            </p>
          </div>

          {/* Card 3: Compliance Report */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'वैधानिक ऑडिट ट्रेल' : 'Statutory Audit Trail'}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t.stat3Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.stat3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
