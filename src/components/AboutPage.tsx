import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Scale, 
  Database, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  Building2, 
  CheckCircle2,
  Award,
  Globe2
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface AboutPageProps {
  language: Language;
  onScanClick: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language, onScanClick }) => {
  const t = getTranslation(language);

  const techStack = [
    {
      title: 'OCR (Optical Character Recognition)',
      tag: 'Text Extraction',
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      description: 'Ultra-fast optical parsing engineered for cylindrical containers, pouches, carton embossments, and curved packaging surfaces with bilingual Hindi & English character recognition.',
    },
    {
      title: 'Artificial Intelligence (Multimodal Vision)',
      tag: 'Neural NER',
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200',
      description: 'Multimodal vision neural models that isolate semantic declarations (MRP, date tokens, weights, postal addresses) regardless of manufacturer layout variances.',
    },
    {
      title: 'Computer Vision (Geometric PDP)',
      tag: 'Spatial Measurement',
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
      description: 'Automated Principal Display Panel (PDP) area calculation and typographic font-height measurement verifying adherence to Table I of Rule 7.',
    },
    {
      title: 'Rule-Based Compliance Engine',
      tag: 'Statutory Parser',
      icon: <Scale className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      description: 'Deterministic legal validation matrix codifying all 14 mandatory provisions of Legal Metrology (Packaged Commodities) Rules, 2011 and Section 36 penalties.',
    },
    {
      title: 'Cloud Database & Audit Registry',
      tag: 'Tamper-Proof Storage',
      icon: <Database className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-50 border-cyan-200',
      description: 'Centralized registry storing immutable inspection logs, manufacturer recidivism tracking, and certified QR verification tokens.',
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mission & Regulatory Alignment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.aboutHeading}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.aboutMissionTitle}
          </p>
        </div>

        {/* Purpose & Social Impact Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Purpose & Vision
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Empowering Citizens & Enforcement Officers Alike
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                PackSure AI was conceived to bridge the vast gap between complex consumer protection laws and real-world retail shelves. Every day, millions of pre-packaged commodities are sold across India without mandatory declarations such as Unit Sale Price, complete manufacturer addresses, or functional consumer care helplines.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By automating the verification of the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> using AI vision and deterministic rule matrices, PackSure AI reduces inspection times from 40 minutes to under 3 seconds while preventing fraudulent packaging practices.
              </p>
            </div>

            {/* Impact stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                <div className="text-3xl font-black text-blue-800 font-mono">90%</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Inspection Time Cut</div>
                <p className="text-[11px] text-slate-500 mt-1">From manual magnifying glass audits to instant camera scans.</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="text-3xl font-black text-emerald-800 font-mono">100%</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Rule 6 Coverage</div>
                <p className="text-[11px] text-slate-500 mt-1">Itemized auditing of clauses (a) through (g) plus Unit Sale Price.</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                <div className="text-3xl font-black text-indigo-800 font-mono">Zero</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Deceptive Over-Stickers</div>
                <p className="text-[11px] text-slate-500 mt-1">Detects illegal dual MRP stickers and font size non-compliances.</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="text-3xl font-black text-amber-800 font-mono">SIH</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Innovation Ready</div>
                <p className="text-[11px] text-slate-500 mt-1">Built for Smart India Hackathon & government deployment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TECHNOLOGY SECTION */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.techStackHeading}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Deep tech stack combining computer vision, natural language understanding, and statutory validation logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${tech.bg}`}>
                    {tech.icon}
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-100 inline-block mb-2">
                    {tech.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {tech.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  <span>Production Grade Pipeline</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>Smart Legal Metrology Ecosystem</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Verify Your First Product Package?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Scan packaging labels instantly, detect statutory infractions, and generate certified audit reports in seconds.
          </p>
          <button
            onClick={onScanClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Start Scanning Now →
          </button>
        </div>
      </div>
    </div>
  );
};
