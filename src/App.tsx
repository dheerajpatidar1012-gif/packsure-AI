/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, Language, ProductScanResult, InspectorProfile } from './types';
import { sampleProducts } from './data/sampleProducts';
import { LeftSidebar } from './components/LeftSidebar';
import { ScanProduct } from './components/ScanProduct';
import { ComplianceResult } from './components/ComplianceResult';
import { ProductHistoryView } from './components/ProductHistoryView';
import { AlertsView } from './components/AlertsView';
import { RulesExplorer } from './components/RulesExplorer';
import { AiInsightsView } from './components/AiInsightsView';
import { SettingsView } from './components/SettingsView';
import { ProductComparison } from './components/ProductComparison';
import { DigitalTwinView } from './components/DigitalTwinView';
import { LiveBarcodeScanner } from './components/LiveBarcodeScanner';
import { SolutionSection } from './components/SolutionSection';
import { ProblemSection } from './components/ProblemSection';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { InspectionCertificateModal } from './components/InspectionCertificateModal';
import { InspectorModal } from './components/InspectorModal';
import { LoginPage } from './components/LoginPage';

// New Intelligence Platform Components
import { DashboardView } from './components/DashboardView';
import { EvidenceMapView } from './components/EvidenceMapView';
import { LabelChangeDetectorView } from './components/LabelChangeDetectorView';
import { ProductTwinsView } from './components/ProductTwinsView';
import { InspectionQueueView } from './components/InspectionQueueView';
import { InspectionReportsView } from './components/InspectionReportsView';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';
import { demoScan2Current } from './data/complianceIntelligenceStore';
import { SmartMedicineView } from './components/SmartMedicineView';

import { 
  Shield, 
  Search, 
  Globe, 
  User, 
  Menu, 
  X, 
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  LogOut,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Start with Dashboard to showcase the comprehensive platform
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openMedicineScannerImmediately, setOpenMedicineScannerImmediately] = useState(false);

  // Inspector profile default
  const [inspector, setInspector] = useState<InspectorProfile | null>(() => {
    try {
      const saved = localStorage.getItem('packsure_officer');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'Insp. Dheeraj Patidar',
      badgeId: 'LM-DEL-4092',
      jurisdiction: 'Delhi State Circle 4 (Okhla Industrial Area)',
      department: 'Department of Legal Metrology, Government of NCT of Delhi',
      email: 'dheerajpatidar1012@gmail.com',
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('packsure_auth');
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [certificateProduct, setCertificateProduct] = useState<ProductScanResult | null>(null);

  // Active scan result (null by default so user lands on active Scan interface)
  const [currentResult, setCurrentResult] = useState<ProductScanResult | null>(null);
  const [scannedReportsList, setScannedReportsList] = useState<ProductScanResult[]>([]);

  const handleLogin = (officer: InspectorProfile) => {
    setInspector(officer);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('packsure_auth', JSON.stringify(true));
      localStorage.setItem('packsure_officer', JSON.stringify(officer));
    } catch {
      // ignore
    }
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuestLogin = () => {
    const guestOfficer: InspectorProfile = {
      name: 'Citizen Verifier',
      badgeId: 'PUBLIC-GUEST',
      jurisdiction: 'National Consumer Jurisdiction',
      department: 'National Consumer Helpline & Public Portal',
    };
    setInspector(guestOfficer);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('packsure_auth', JSON.stringify(true));
      localStorage.setItem('packsure_officer', JSON.stringify(guestOfficer));
    } catch {
      // ignore
    }
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('packsure_auth', JSON.stringify(false));
    } catch {
      // ignore
    }
    setActiveTab('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When a scan completes in ScanProduct
  const handleScanComplete = (result: ProductScanResult) => {
    const enrichedResult: ProductScanResult = {
      ...result,
      inspectorName: inspector ? `${inspector.name} (${inspector.badgeId})` : result.inspectorName,
    };
    setCurrentResult(enrichedResult);
    setScannedReportsList((prev) => [enrichedResult, ...prev]);
    setActiveTab('scan');
  };

  const handleScanAnother = () => {
    setCurrentResult(null);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductFromHistory = (product: ProductScanResult) => {
    setCurrentResult(product);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not authenticated or explicitly navigated to login tab
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <LoginPage
        language={language}
        setLanguage={setLanguage}
        onLogin={handleLogin}
        onContinueAsGuest={handleGuestLogin}
      />
    );
  }

  const inspectorInitials = inspector?.name
    ? inspector.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'LM';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Gov-Tech Sub-Header Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white tracking-wide">
              GOV-TECH AI
            </span>
            <span className="text-[11px] text-slate-400">
              National Legal Metrology & FSSAI Packaging Compliance Portal
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="hidden sm:inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Model: Gemini 2.5 Flash Vision Tensor</span>
            </span>
            <span>PCR 2011 Verified</span>
          </div>
        </div>
      </div>

      {/* Main SaaS App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Mobile hamburger toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
                <span>Welcome, {inspector?.name?.split(' ')[1] || 'Inspector'}</span>
                <span className="text-xs font-normal text-slate-500 hidden md:inline">
                  — National Packaging Enforcement
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {inspector?.jurisdiction || 'Circle 4 Enforcement Desk'} • Legal Metrology Act, 2009
              </p>
            </div>
          </div>

          {/* Right Controls: AI status, Language, Officer Profile, Log Out */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Live</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Officer Profile Widget */}
            <button
              onClick={() => setIsOfficerModalOpen(true)}
              className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Officer Profile Credentials"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {inspectorInitials}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {inspector?.name || 'Insp. Dheeraj'}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight font-mono">
                  {inspector?.badgeId || 'LM-DEL-4092'}
                </div>
              </div>
            </button>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
              title={language === 'hi' ? 'लॉग आउट करें' : 'Sign Out / Switch Officer'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'लॉग आउट' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Mobile slide-down drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 p-4 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <LeftSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              language={language}
              onScanClick={handleScanAnother}
              historyCount={scannedReportsList.length + 4}
              currentInspector={inspector}
              onLogout={handleLogout}
              onLaunchDemo={() => {
                setDemoModalOpen(true);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        )}
      </header>

      {/* Main SaaS Shell with Left Sidebar & Content Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Persistent Left Sidebar on Desktop */}
        <div className="hidden lg:block sticky top-24 shrink-0">
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            language={language}
            onScanClick={handleScanAnother}
            historyCount={scannedReportsList.length + 4}
            currentInspector={inspector}
            onLogout={handleLogout}
            onLaunchDemo={() => setDemoModalOpen(true)}
          />
        </div>

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 w-full min-w-0">
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <DashboardView
              language={language}
              setActiveTab={setActiveTab}
              onLaunchDemo={() => setDemoModalOpen(true)}
              currentInspector={inspector}
              inspectedCount={scannedReportsList.length + 142}
              potentialIssuesCount={18}
              needsVerificationCount={7}
              verifiedCount={scannedReportsList.length + 117}
              onOpenMedicineScanner={() => {
                setOpenMedicineScannerImmediately(true);
                setActiveTab('smart-medicine');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* EVIDENCE MAP VIEW */}
          {activeTab === 'evidence-map' && (
            <EvidenceMapView
              language={language}
              activeTwin={demoScan2Current}
            />
          )}

          {/* LABEL CHANGE DETECTOR VIEW */}
          {activeTab === 'change-detection' && (
            <LabelChangeDetectorView
              language={language}
              twin={demoScan2Current}
              onOpenReport={() => setActiveTab('reports')}
            />
          )}

          {/* PRODUCT COMPLIANCE TWINS VIEW */}
          {(activeTab === 'twins' || activeTab === 'digital-twin') && (
            <ProductTwinsView
              language={language}
              setActiveTab={setActiveTab}
            />
          )}

          {/* INSPECTION QUEUE (HUMAN-IN-THE-LOOP) VIEW */}
          {activeTab === 'queue' && (
            <InspectionQueueView
              language={language}
              currentInspector={inspector}
              setActiveTab={setActiveTab}
            />
          )}

          {/* DIGITAL INSPECTION REPORTS VIEW */}
          {activeTab === 'reports' && (
            <InspectionReportsView
              language={language}
              currentInspector={inspector}
              setActiveTab={setActiveTab}
              twin={demoScan2Current}
            />
          )}

          {/* LIVE BARCODE INTELLIGENCE SCANNER VIEW */}
          {activeTab === 'live-barcode' && (
            <div className="space-y-6">
              <LiveBarcodeScanner
                language={language}
                onScanComplete={(result) => {
                  handleScanComplete(result);
                  setActiveTab('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToDigitalTwin={(barcode) => {
                  setActiveTab('digital-twin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToComplaints={(productName) => {
                  setActiveTab('alerts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSwitchToOcrScanner={() => {
                  setCurrentResult(null);
                  setActiveTab('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* SMART MEDICINE SAFETY & CONFLICT SCANNER VIEW */}
          {activeTab === 'smart-medicine' && (
            <SmartMedicineView
              language={language}
              initialOpenScanner={openMedicineScannerImmediately}
              onNavigateToScanner={() => {
                setActiveTab('live-barcode');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 1. SCAN PRODUCT VIEW (Default / Main Entry Point) */}
          {activeTab === 'scan' && (
            <div>
              {currentResult ? (
                <div className="space-y-6">
                  <ComplianceResult
                    result={currentResult}
                    language={language}
                    onScanAnother={handleScanAnother}
                    onOpenCertificate={(prod) => setCertificateProduct(prod)}
                    onViewRule={() => {
                      setActiveTab('gov-data');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onCompareProduct={() => {
                      setActiveTab('compare');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onViewDigitalTwin={() => {
                      setActiveTab('digital-twin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              ) : (
                <ScanProduct
                  language={language}
                  onScanComplete={handleScanComplete}
                  initialSample={sampleProducts[0]}
                  onNavigateToDigitalTwin={() => {
                    setActiveTab('digital-twin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNavigateToBarcodeScanner={() => {
                    setActiveTab('live-barcode');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          )}

          {/* AI COMPLIANCE DIGITAL TWIN VIEW */}
          {activeTab === 'digital-twin' && (
            <DigitalTwinView
              language={language}
              onScanNewProduct={handleScanAnother}
              onOpenCertificate={(prod) => setCertificateProduct(prod)}
              activeScanResult={currentResult}
            />
          )}

          {/* 2. PRODUCT HISTORY VIEW */}
          {activeTab === 'history' && (
            <ProductHistoryView
              language={language}
              onSelectProduct={handleSelectProductFromHistory}
              onOpenCertificate={(prod) => setCertificateProduct(prod)}
              onScanNew={handleScanAnother}
              scannedProducts={scannedReportsList}
              onNavigateToDigitalTwin={() => {
                setActiveTab('digital-twin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 3. ALERTS VIEW */}
          {activeTab === 'alerts' && (
            <AlertsView
              language={language}
              onNavigateToRules={() => {
                setActiveTab('gov-data');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 4. GOVERNMENT DATA VIEW (Statutory PCR 2011 Rules) */}
          {activeTab === 'gov-data' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <RulesExplorer language={language} />
            </div>
          )}

          {/* 5. AI INSIGHTS VIEW */}
          {activeTab === 'ai-insights' && (
            <AiInsightsView
              language={language}
              onScanClick={handleScanAnother}
            />
          )}

          {/* 6. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <SettingsView
              language={language}
              setLanguage={setLanguage}
              currentInspector={inspector}
              onUpdateInspector={setInspector}
              onLogout={handleLogout}
            />
          )}

          {/* SECONDARY HELPER VIEWS (No broken links) */}
          {activeTab === 'compare' && (
            <ProductComparison
              language={language}
              availableProducts={scannedReportsList.length > 0 ? scannedReportsList : sampleProducts}
              onSelectProductForDetails={(product) => {
                setCurrentResult(product);
                setActiveTab('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScanNewProduct={() => {
                setCurrentResult(null);
                setActiveTab('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'how-it-works' && (
            <div className="space-y-6">
              <SolutionSection
                language={language}
                onScanClick={handleScanAnother}
              />
              <ProblemSection language={language} />
            </div>
          )}

          {activeTab === 'about' && (
            <AboutPage
              language={language}
              onScanClick={handleScanAnother}
            />
          )}
        </main>
      </div>

      {/* Clean Footer */}
      <Footer setActiveTab={setActiveTab} language={language} />

      {/* Official Certificate Modal */}
      <InspectionCertificateModal
        product={certificateProduct}
        onClose={() => setCertificateProduct(null)}
        language={language}
      />

      {/* Officer Login Modal */}
      <InspectorModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        currentInspector={inspector}
        onSetInspector={setInspector}
      />

      {/* Interactive Platform Demo Walkthrough Modal */}
      <InteractiveDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        setActiveTab={setActiveTab}
        language={language}
      />
    </div>
  );
}
