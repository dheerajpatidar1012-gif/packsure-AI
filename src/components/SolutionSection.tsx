import React, { useState } from 'react';
import { 
  Scan, 
  FileSearch, 
  Tag, 
  Scale, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SolutionSectionProps {
  language: Language;
  onScanClick: () => void;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({
  language,
  onScanClick,
}) => {
  const t = getTranslation(language);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const solutionSteps = [
    {
      num: '01',
      title: t.step1Title,
      description: t.step1Desc,
      icon: <Scan className="w-5 h-5 text-blue-600" />,
      detail: 'Supports standard phone camera, webcam, high-resolution flatbed images, and barcode lookups.',
      badge: 'Capture',
    },
    {
      num: '02',
      title: t.step2Title,
      description: t.step2Desc,
      icon: <FileSearch className="w-5 h-5 text-indigo-600" />,
      detail: 'Optical Character Recognition locates text across curved bottles, micro-type, and bilingual Indian scripts.',
      badge: 'Vision OCR',
    },
    {
      num: '03',
      title: t.step3Title,
      description: t.step3Desc,
      icon: <Tag className="w-5 h-5 text-cyan-600" />,
      detail: 'Zero-shot entity categorization extracts MRP, Unit Sale Price, Net Qty, Dates, and Importer details.',
      badge: 'NER AI',
    },
    {
      num: '04',
      title: t.step4Title,
      description: t.step4Desc,
      icon: <Scale className="w-5 h-5 text-purple-600" />,
      detail: 'Rule-engine checks against Rule 6(1)(a)-(g), Rule 11 standard SI units, and Principal Display Panel font heights.',
      badge: 'Rules Matrix',
    },
    {
      num: '05',
      title: t.step5Title,
      description: t.step5Desc,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      detail: 'Provides an instant 0-100% compliance index, infraction list, and official PDF certificate with legal penal sections.',
      badge: 'Verdict',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Intelligent Verification Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.solutionTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.solutionSubtitle}
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {solutionSteps.map((step, idx) => {
            const isCurrent = selectedStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setSelectedStep(idx)}
                className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-white border-blue-400 ring-2 ring-blue-500/20 shadow-md transform -translate-y-1'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                    {step.icon}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 line-clamp-2">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Box */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Step {solutionSteps[selectedStep].num}: {solutionSteps[selectedStep].title}
              </div>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {solutionSteps[selectedStep].detail}
              </p>
            </div>
          </div>
          <button
            onClick={onScanClick}
            className="shrink-0 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <span>Launch Scanner Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
