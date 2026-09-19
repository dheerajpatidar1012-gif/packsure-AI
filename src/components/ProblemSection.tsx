import React from 'react';
import { Eye, Clock, AlertTriangle, Scale, AlertOctagon } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ProblemSectionProps {
  language: Language;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ language }) => {
  const t = getTranslation(language);

  const problemCards = [
    {
      id: 'p1',
      icon: <Eye className="w-6 h-6 text-amber-600" />,
      badge: '01. Visual Strain',
      title: t.problem1Title,
      description: t.problem1Desc,
      bgIcon: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'p2',
      icon: <Clock className="w-6 h-6 text-rose-600" />,
      badge: '02. Bottleneck',
      title: t.problem2Title,
      description: t.problem2Desc,
      bgIcon: 'bg-rose-50 border-rose-200',
    },
    {
      id: 'p3',
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      badge: '03. Inaccuracy',
      title: t.problem3Title,
      description: t.problem3Desc,
      bgIcon: 'bg-orange-50 border-orange-200',
    },
    {
      id: 'p4',
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      badge: '04. Regulatory Complexity',
      title: t.problem4Title,
      description: t.problem4Desc,
      bgIcon: 'bg-blue-50 border-blue-200',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            <span>Inspection Challenges</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.problemTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.problemSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemCards.map((card) => (
            <div
              key={card.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${card.bgIcon}`}>
                  {card.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {card.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2" />
                <span>Impacts compliance speed & accuracy</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
