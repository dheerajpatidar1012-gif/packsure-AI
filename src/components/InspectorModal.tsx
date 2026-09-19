import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, KeyRound, Building, CheckCircle } from 'lucide-react';
import { InspectorProfile } from '../types';

interface InspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInspector: InspectorProfile | null;
  onSetInspector: (inspector: InspectorProfile | null) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  isOpen,
  onClose,
  currentInspector,
  onSetInspector,
}) => {
  if (!isOpen) return null;

  const demoOfficers: InspectorProfile[] = [
    {
      name: 'Insp. dheeraj patidar',
      badgeId: 'LM-DEL-2041',
      jurisdiction: 'Delhi State Circle 4 (Okhla Industrial Zone)',
      department: 'Department of Legal Metrology, Government of NCT of Delhi',
    },
    {
      name: 'Insp.  dheeraj patidar',
      badgeId: 'LM-MH-8109',
      jurisdiction: 'Mumbai Flying Squad & Retail Surveillance',
      department: 'Food, Civil Supplies & Consumer Protection, Maharashtra',
    },
    {
      name: 'Insp. Anant Kulkarni',
      badgeId: 'LM-KA-4412',
      jurisdiction: 'Bengaluru E-Commerce & Packaged Commodities Cell',
      department: 'Legal Metrology Directorate, Karnataka',
    },
  ];

  const handleSelectOfficer = (officer: InspectorProfile) => {
    onSetInspector(officer);
    onClose();
  };

  const handleLogout = () => {
    onSetInspector(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold">
                Enforcement Officer Authentication
              </h3>
              <p className="text-[10px] text-slate-400">
                Department of Legal Metrology • Authorized Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {currentInspector ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Currently Authenticated
                </span>
                <span className="text-[11px] font-mono bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  {currentInspector.badgeId}
                </span>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {currentInspector.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentInspector.jurisdiction}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {currentInspector.department}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-200/80 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-rose-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                >
                  Log Out Session
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Select an authorized Inspector identity below to sign digital certificates and register inspections into the government surveillance log:
              </p>

              <div className="space-y-3">
                {demoOfficers.map((officer) => (
                  <button
                    key={officer.badgeId}
                    onClick={() => handleSelectOfficer(officer)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {officer.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {officer.badgeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {officer.jurisdiction}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {officer.department}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-bold shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform">
                      Sign In →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
