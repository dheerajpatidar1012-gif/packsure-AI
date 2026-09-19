import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  User, 
  Building2, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  FileBadge, 
  AlertCircle,
  Globe,
  KeyRound,
  QrCode,
  LogIn
} from 'lucide-react';
import { InspectorProfile, Language } from '../types';

interface LoginPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onLogin: (officer: InspectorProfile) => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  setLanguage,
  onLogin,
  onContinueAsGuest,
}) => {
  const [role, setRole] = useState<'OFFICER' | 'BRAND' | 'CITIZEN'>('OFFICER');
  const [identifier, setIdentifier] = useState('LM-DEL-4092');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [jurisdiction, setJurisdiction] = useState('Delhi State Circle 4 (Okhla Industrial Area)');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const quickOfficers: { profile: InspectorProfile; roleTag: string }[] = [
    {
      profile: {
        name: 'Insp. Dheeraj Patidar',
        badgeId: 'LM-DEL-4092',
        jurisdiction: 'Delhi State Circle 4 (Okhla Industrial Area)',
        department: 'Department of Legal Metrology, Government of NCT of Delhi',
        email: 'dheerajpatidar1012@gmail.com',
      },
      roleTag: 'Legal Metrology Officer',
    },
    {
      profile: {
        name: 'Insp. Rajesh Sharma',
        badgeId: 'LM-DEL-2041',
        jurisdiction: 'Delhi State Circle 2 (Naraina & Kirti Nagar)',
        department: 'Department of Legal Metrology, Government of NCT of Delhi',
        email: 'r.sharma.lm@delhi.gov.in',
      },
      roleTag: 'Senior Inspector',
    },
    {
      profile: {
        name: 'Insp. Priya Verma',
        badgeId: 'LM-MH-8109',
        jurisdiction: 'Mumbai Flying Squad & Retail Surveillance',
        department: 'Food, Civil Supplies & Consumer Protection, Maharashtra',
        email: 'priya.verma@maharashtra.gov.in',
      },
      roleTag: 'Surveillance Officer',
    },
    {
      profile: {
        name: 'Dr. Arun Mehra',
        badgeId: 'FSSAI-AUD-991',
        jurisdiction: 'FSSAI Northern Regional Enforcement Lab',
        department: 'Food Safety and Standards Authority of India',
        email: 'arun.mehra@fssai.gov.in',
      },
      roleTag: 'FSSAI Quality Auditor',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना बैच आईडी या ईमेल दर्ज करें' : 'Please enter your Badge ID or Email');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Find matching quick officer or generate profile from entered credentials
      const found = quickOfficers.find(
        (o) => o.profile.badgeId.toLowerCase() === identifier.toLowerCase() ||
               o.profile.email?.toLowerCase() === identifier.toLowerCase()
      );

      if (found) {
        onLogin({
          ...found.profile,
          jurisdiction: jurisdiction || found.profile.jurisdiction,
        });
      } else {
        onLogin({
          name: role === 'BRAND' ? 'FBO Compliance Manager' : 'Insp. ' + identifier,
          badgeId: identifier.toUpperCase(),
          jurisdiction: jurisdiction,
          department: role === 'BRAND' 
            ? 'Registered Food Business Operator (FSSAI Licensee)'
            : 'Department of Legal Metrology & Consumer Affairs',
          email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@nic.in`,
        });
      }
    }, 600);
  };

  const handleQuickLogin = (officer: InspectorProfile) => {
    setIdentifier(officer.badgeId);
    setJurisdiction(officer.jurisdiction);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(officer);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-600/15 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Top Gov Header */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center text-white shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black tracking-tight text-white">PackSure</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-black bg-blue-600 text-white tracking-wide">AI</span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• Official Enforcement Portal</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Department of Consumer Affairs & Legal Metrology
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Form Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl shadow-blue-950/40 backdrop-blur-xl overflow-hidden">
            {/* Indian Flag Tricolor Bar */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-[#FF9933]"></div>
              <div className="w-1/3 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#000080]"></div>
              </div>
              <div className="w-1/3 bg-[#128807]"></div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Heading */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {language === 'hi'
                      ? 'वैधानिक खाद्य एवं विधिक माप विज्ञान पोर्टल'
                      : 'Statutory Metrology & Food Safety Portal'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'hi' ? 'अधिकारी लॉगिन' : 'Officer Sign In'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'विधिक माप विज्ञान अधिनियम, 2009 एवं पीसीआर नियमों के अंतर्गत अधिकृत निरीक्षण टर्मिनल'
                    : 'Authorized inspection terminal under Legal Metrology Act, 2009 & Packaged Commodities Rules'}
                </p>
              </div>

              {/* Role Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setRole('OFFICER');
                    setIdentifier('LM-DEL-4092');
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    role === 'OFFICER'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span className="truncate">{language === 'hi' ? 'निरीक्षक' : 'Inspector'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('BRAND');
                    setIdentifier('FSSAI-LIC-10014021000032');
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    role === 'BRAND'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{language === 'hi' ? 'ब्रांड / निर्माता' : 'FBO / Brand'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('CITIZEN');
                    setIdentifier('CITIZEN-VERIFIER');
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    role === 'CITIZEN'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{language === 'hi' ? 'नागरिक' : 'Citizen'}</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {role === 'OFFICER'
                      ? language === 'hi' ? 'अधिकारी बैच आईडी अथवा सरकारी ईमेल' : 'Warrant / Badge ID or NIC Email'
                      : role === 'BRAND'
                      ? language === 'hi' ? '14-अंकीय FSSAI लाइसेंस नंबर / GSTIN' : '14-Digit FSSAI License or GSTIN'
                      : language === 'hi' ? 'मोबाइल नंबर अथवा नाम' : 'Mobile Number or Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      {role === 'OFFICER' ? <FileBadge className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={role === 'OFFICER' ? 'e.g. LM-DEL-4092' : 'e.g. 10014021000032'}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'hi' ? 'पासवर्ड / सुरक्षा पिन' : 'Security Passcode / Token PIN'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {role === 'OFFICER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'hi' ? 'निरीक्षण क्षेत्र / सर्किल' : 'Deployment Circle & Jurisdiction'}
                    </label>
                    <select
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="Delhi State Circle 4 (Okhla Industrial Area)">
                        Delhi State Circle 4 (Okhla Industrial Area)
                      </option>
                      <option value="Delhi State Circle 2 (Naraina & Kirti Nagar)">
                        Delhi State Circle 2 (Naraina & Kirti Nagar)
                      </option>
                      <option value="Mumbai Flying Squad & Retail Surveillance">
                        Mumbai Flying Squad & Retail Surveillance
                      </option>
                      <option value="Bengaluru E-Commerce & Packaged Commodities Cell">
                        Bengaluru E-Commerce & Packaged Commodities Cell
                      </option>
                      <option value="FSSAI Northern Regional Central Enforcement">
                        FSSAI Northern Regional Central Enforcement
                      </option>
                      <option value="Uttar Pradesh State Consumer Protection Wing">
                        Uttar Pradesh State Consumer Protection Wing
                      </option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-950"
                    />
                    <span>{language === 'hi' ? 'इस टर्मिनल पर याद रखें' : 'Keep logged in on this terminal'}</span>
                  </label>
                  <span className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer">
                    {language === 'hi' ? 'पिन रीसेट' : 'Forgot PIN?'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating Credentials...'}</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>
                        {language === 'hi' ? 'सुरक्षित पोर्टल में प्रवेश करें' : 'Sign In to Enforcement Portal'}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Quick Demo Login Section */}
              <div className="pt-5 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'त्वरित 1-क्लिक अधिकारी प्रोफाइल' : 'Fast 1-Click Officer Profiles'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Ready</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickOfficers.map((item) => (
                    <button
                      key={item.profile.badgeId}
                      type="button"
                      onClick={() => handleQuickLogin(item.profile)}
                      className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.profile.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {item.profile.badgeId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.roleTag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Consumer Access */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1"
                >
                  <span>
                    {language === 'hi'
                      ? 'अथवा नागरिक अतिथि के रूप में सीधे स्कैन करें'
                      : 'Or explore instantly as Guest Citizen Inspector'}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Card Footer: Statutory compliance note */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="truncate">NIC SSL 256-bit Encrypted Session</span>
              <span className="text-slate-400 font-medium shrink-0">Legal Metrology Act, 2009</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-4 text-center border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <p>
          PackSure AI Legal Metrology Portal • Department of Consumer Affairs, Government of India
        </p>
      </footer>
    </div>
  );
};
