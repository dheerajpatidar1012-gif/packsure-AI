import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  HeartPulse, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Printer, 
  AlertOctagon, 
  Clock, 
  FileText, 
  Activity, 
  User, 
  RotateCcw,
  Barcode,
  Camera,
  Layers,
  Utensils,
  Stethoscope,
  HelpCircle,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Language, MedicineInfo, UserHealthProfile } from '../types';
import { VERIFIED_MEDICINE_DATABASE, analyzeMedicineSafety } from '../data/medicineDatabase';
import { MedicineBarcodeScannerModal } from './MedicineBarcodeScannerModal';

interface SmartMedicineViewProps {
  language: Language;
  onNavigateToScanner?: () => void;
  initialOpenScanner?: boolean;
}

// Preset food items commonly scanned in PackSure AI
const PRESET_FOOD_PRODUCTS = [
  {
    name: "Haldiram's Bhujia Sev 200g",
    ingredients: "Moth pulse flour, Gram flour, Groundnut oil, Salt, Red chilli powder, Black pepper, Clove powder, Cardamom",
    concernHint: "Spicy savoury snack (high chilli & fat) — potential gastric irritation",
  },
  {
    name: "Britannia Good Day Butter Cookies 120g",
    ingredients: "Refined wheat flour (Maida), Sugar, Edible vegetable oil (Palm), Butter (2%), Milk solids, Artificial flavouring (Vanilla)",
    concernHint: "Contains wheat gluten & dairy milk solids — potential allergen triggers",
  },
  {
    name: "Nestlé Maggi 2-Minute Masala Noodles 70g",
    ingredients: "Wheat flour, Palm oil, Iodised salt, Tastemaker spices, Hydrolysed groundnut protein, Onion powder, Garlic",
    concernHint: "High sodium seasoning mix & wheat — consider foodborne factors if fever present",
  },
  {
    name: "Amul Pasteurised Salted Butter 100g",
    ingredients: "Milk fat 80%, Moisture 16%, Salt 3%, Curd 1%",
    concernHint: "Pure dairy solids — lactose sensitivity consideration",
  },
  {
    name: "Parle-G Gold Glucose Biscuits 100g",
    ingredients: "Wheat flour, Sugar, Invert sugar syrup, Edible vegetable oil, Milk solids, Leavening agents",
    concernHint: "Wheat flour and dairy traces",
  },
];

export const SmartMedicineView: React.FC<SmartMedicineViewProps> = ({
  language,
  onNavigateToScanner,
  initialOpenScanner = false,
}) => {
  // Selected medicine state
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInfo>(VERIFIED_MEDICINE_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // User Health Profile State
  const [healthProfile, setHealthProfile] = useState<UserHealthProfile>({
    ageGroup: 'adult',
    symptoms: ['Fever', 'Headache'],
    customSymptom: '',
    symptomOnsetTime: '1-3 hours ago',
    recentFoodEaten: "Haldiram's Bhujia Sev 200g",
    recentFoodIngredients: "Moth pulse flour, Gram flour, Groundnut oil, Salt, Red chilli powder, Black pepper, Clove powder, Cardamom",
    existingConditions: [],
    allergies: [],
    currentMedicines: [],
    isPregnantOrNursing: false,
  });

  // Camera Barcode Scanning State
  const [isBarcodeScanOpen, setIsBarcodeScanOpen] = useState(initialOpenScanner);

  useEffect(() => {
    if (initialOpenScanner) {
      setIsBarcodeScanOpen(true);
    }
  }, [initialOpenScanner]);

  // Interactive Question State
  const [showTabletDecisionModal, setShowTabletDecisionModal] = useState(false);

  // Quick Option Sets
  const AVAILABLE_SYMPTOMS = [
    'Fever',
    'Stomach pain',
    'Vomiting',
    'Diarrhea',
    'Headache',
    'Itching',
    'Skin rash',
    'Nausea',
    'Swelling',
    'Severe chest pain',
    'Difficulty breathing',
  ];

  const ONSET_TIMELINES = [
    'Just now (<1 hr)',
    '1-3 hours ago',
    '4-12 hours ago',
    'Today (~24 hours)',
    'More than 2 days ago',
  ];

  const AVAILABLE_CONDITIONS = [
    'Liver Disease',
    'Kidney Disease',
    'Hypertension (High BP)',
    'Peptic Ulcers',
    'Type-2 Diabetes',
    'Asthma',
  ];

  const AVAILABLE_ALLERGIES = [
    'Paracetamol',
    'NSAIDs / Aspirin',
    'Penicillin',
    'Sulfa Drugs',
  ];

  const AVAILABLE_MEDICINES = [
    'Warfarin (Blood Thinner)',
    'Metformin',
    'Cold Syrup with Paracetamol',
    'Aspirin 75mg',
  ];

  // Toggle helper
  const toggleItem = (list: string[], item: string): string[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  // Run Real-Time Safety Analysis
  const safetyAnalysis = useMemo(() => {
    return analyzeMedicineSafety(selectedMedicine, healthProfile);
  }, [selectedMedicine, healthProfile]);

  // Filter medicines by search term
  const filteredMedicines = VERIFIED_MEDICINE_DATABASE.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.barcode.includes(searchTerm)
  );

  // Camera Scanner trigger
  const startCameraScanner = () => {
    setIsBarcodeScanOpen(true);
  };

  const handleFoodSelect = (food: (typeof PRESET_FOOD_PRODUCTS)[0]) => {
    setHealthProfile((prev) => ({
      ...prev,
      recentFoodEaten: food.name,
      recentFoodIngredients: food.ingredients,
    }));
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Statutory Sample Data Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-xl shadow-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <span className="font-extrabold uppercase tracking-wide bg-amber-200/80 px-2 py-0.5 rounded text-[11px] mr-2">
            SAMPLE DATA — NOT FOR REAL MEDICAL DECISION-MAKING
          </span>
          This tool is for educational & safety verification demonstration only. PackSure AI does not prescribe medicine or provide clinical medical diagnoses. Always consult a licensed healthcare professional (MBBS/MD) or pharmacist.
        </div>
      </div>

      {/* Emergency Red-Flag Warning Banner if active */}
      {safetyAnalysis.emergencyWarning && (
        <div className="bg-rose-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg border-2 border-rose-700 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <span>🚨 URGENT MEDICAL ATTENTION REQUIRED</span>
              </h3>
              <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
                {safetyAnalysis.emergencyWarning.actionRequired}
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl shadow-md shrink-0 transition"
          >
            Emergency Call (112)
          </a>
        </div>
      )}

      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <Pill className="w-3.5 h-3.5" />
            <span>SMART MEDICINE SAFETY SCANNER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Medicine Uses, Risks & Food-Symptom Safety Checks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            "Scan a medicine to understand its uses, risks and safety information." Cross-examine active ingredients against recent food intake, reported symptoms, known allergies, and contraindicated conditions.
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={startCameraScanner}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Medicine Strip / QR</span>
            </button>
            <button
              onClick={() => setShowTabletDecisionModal(!showTabletDecisionModal)}
              className="px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-300" />
              <span>"Tablet Leni Chahiye Ya Nahi?"</span>
            </button>
            <button
              onClick={handlePrintDossier}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Medicine Safety Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive "TABLET LENI CHAHIYE YA NAHI?" Query Section */}
      {showTabletDecisionModal && (
        <div className="p-5 rounded-2xl bg-white border-2 border-teal-500 shadow-md space-y-3 transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤔</span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Consumer Query: "Tablet Leni Chahiye Ya Nahi?"
                </h3>
                <p className="text-xs text-slate-500">
                  Automated statutory clinical guidance for {selectedMedicine.name} ({selectedMedicine.activeIngredient})
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTabletDecisionModal(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg"
            >
              Dismiss
            </button>
          </div>

          <div className={`p-4 rounded-xl border ${
            safetyAnalysis.tabletDecisionAdvice.status === 'RED'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : safetyAnalysis.tabletDecisionAdvice.status === 'YELLOW'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : safetyAnalysis.tabletDecisionAdvice.status === 'UNCERTAIN'
              ? 'bg-slate-50 border-slate-300 text-slate-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm mb-1">
              <span>{safetyAnalysis.tabletDecisionAdvice.headline}</span>
            </div>
            <p className="text-xs font-bold leading-relaxed mb-1">
              {safetyAnalysis.tabletDecisionAdvice.statement}
            </p>
            <p className="text-xs opacity-90 leading-relaxed">
              {safetyAnalysis.tabletDecisionAdvice.guidance}
            </p>
            <div className="mt-3 pt-2 border-t border-black/10 text-[11px] font-medium text-slate-600">
              * Note: The AI must NEVER prescribe medicine or tell the user to take a medicine automatically.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Medicine Details, Right = Symptom & Health Profile & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Medicine Selector & Comprehensive Identity Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Medicine Search & Barcode Quick Switch */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-600" />
                Select / Search Medicine
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {VERIFIED_MEDICINE_DATABASE.length} in Registry
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Dolo-650, Crocin, Pantocid, Augmentin..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Quick Medicine Pill Selection */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {filteredMedicines.map((med) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMedicine(med)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedMedicine.id === med.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {med.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Medicine Identity & Statutory Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {selectedMedicine.schedule}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Barcode className="w-3.5 h-3.5" />
                  {selectedMedicine.barcode}
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{selectedMedicine.name}</h3>
              <p className="text-xs text-teal-300 font-medium mt-0.5">
                Active Ingredient: {selectedMedicine.activeIngredient} • Strength: {selectedMedicine.strength}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Manufacturer: {selectedMedicine.manufacturer} • Form: {selectedMedicine.dosageForm}
              </p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Category & MRP */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Pharmacological Class</span>
                  <span className="font-semibold text-slate-900">{selectedMedicine.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Government Regulated MRP</span>
                  <span className="font-bold text-emerald-700 font-mono">{selectedMedicine.mrp}</span>
                </div>
              </div>

              {/* 🎯 GENERAL USE */}
              <div className="p-3.5 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-2">
                <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>GENERAL USE & POTENTIAL BENEFITS</span>
                </h4>
                <p className="text-[11px] text-teal-900 leading-relaxed">
                  <strong>General Use:</strong> {selectedMedicine.generalUses.join(' • ')}.
                </p>
                <p className="text-[11px] text-teal-800 leading-relaxed border-t border-teal-200/60 pt-1.5">
                  <strong>Potential Benefit:</strong> May help provide symptomatic relief for {selectedMedicine.generalUses[0].toLowerCase()}. <em>(Note: Does not replace professional prescription).</em>
                </p>
              </div>

              {/* ⚠️ POSSIBLE RISKS */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-amber-950">
                <h4 className="font-bold flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>POSSIBLE RISKS & WARNINGS</span>
                </h4>
                <ul className="space-y-1 text-[11px] list-disc pl-4 text-amber-900">
                  {selectedMedicine.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
                <div className="pt-1 text-[11px] text-amber-800">
                  <strong>Dosage Ceiling:</strong> {selectedMedicine.maxDailyDose}
                </div>
              </div>

              {/* Contraindications */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-rose-950">
                <h4 className="font-bold flex items-center gap-1.5 text-rose-900">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Important Contraindications (When NOT to take)</span>
                </h4>
                <ul className="space-y-1 text-[11px] list-disc pl-4 text-rose-900">
                  {selectedMedicine.contraindications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Side Effects (Common vs Serious) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Common Side Effects</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                    {selectedMedicine.commonSideEffects.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1">Serious Side Effects</span>
                  <ul className="list-disc pl-4 text-[11px] text-rose-800 space-y-0.5">
                    {selectedMedicine.seriousSideEffects.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Known Drug Interactions */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Known Drug Interactions
                </h4>
                <div className="space-y-1.5">
                  {selectedMedicine.drugInteractions.map((di, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{di.interactingDrug}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          di.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {di.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{di.effect}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Symptoms, Food Correlation, Safety Status & Decision (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Symptom Input & Recent Food Product */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Symptom & Food Intake Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tell PackSure AI what problem you are experiencing and what food you recently ate
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setHealthProfile({
                    ageGroup: 'adult',
                    symptoms: [],
                    customSymptom: '',
                    symptomOnsetTime: '1-3 hours ago',
                    recentFoodEaten: '',
                    recentFoodIngredients: '',
                    existingConditions: [],
                    allergies: [],
                    currentMedicines: [],
                    isPregnantOrNursing: false,
                  })
                }
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* "What problem are you experiencing?" */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <span>🤒</span>
                <span>What problem are you experiencing?</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {AVAILABLE_SYMPTOMS.map((sym) => {
                  const active = healthProfile.symptoms.includes(sym);
                  const isRedFlag = sym.includes('breathing') || sym.includes('chest') || sym.includes('Swelling');
                  return (
                    <button
                      key={sym}
                      onClick={() => setHealthProfile({ ...healthProfile, symptoms: toggleItem(healthProfile.symptoms, sym) })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? isRedFlag
                            ? 'bg-rose-600 text-white border-rose-600 font-bold'
                            : 'bg-teal-600 text-white border-teal-600 font-bold'
                          : isRedFlag
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      <span>{sym}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Symptom Input */}
              <input
                type="text"
                value={healthProfile.customSymptom || ''}
                onChange={(e) => setHealthProfile({ ...healthProfile, customSymptom: e.target.value })}
                placeholder="Other specific symptom (e.g. cramp, dizziness, burning throat)..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* "When did the problem start?" */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>When did the problem start?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                {ONSET_TIMELINES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setHealthProfile({ ...healthProfile, symptomOnsetTime: time })}
                    className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition cursor-pointer text-center ${
                      healthProfile.symptomOnsetTime === time
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* "What food did you recently eat?" */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>What food did you recently eat?</span>
                </label>
                <span className="text-[11px] text-slate-400">PackSure AI Product Linkage</span>
              </div>

              {/* Food Quick Selectors */}
              <div className="space-y-1.5 mb-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Select from previously scanned PackSure AI food products:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_FOOD_PRODUCTS.map((f, i) => {
                    const isSelected = healthProfile.recentFoodEaten === f.name;
                    return (
                      <button
                        key={i}
                        onClick={() => handleFoodSelect(f)}
                        className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-xs">{f.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{f.concernHint}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or manual food input */}
              <input
                type="text"
                value={healthProfile.recentFoodEaten || ''}
                onChange={(e) => setHealthProfile({ ...healthProfile, recentFoodEaten: e.target.value })}
                placeholder="Or enter food name manually (e.g. Street Pani Puri, Fried Fish, Milkshake)..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* User Safety Information: Age, Conditions, Allergies, Medicines, Pregnancy */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Relevant Safety Information
                </h4>
              </div>

              {/* Age Group */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Age Group</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['child', 'adult', 'senior'] as const).map((age) => (
                    <button
                      key={age}
                      onClick={() => setHealthProfile({ ...healthProfile, ageGroup: age })}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer capitalize ${
                        healthProfile.ageGroup === age
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {age === 'child' ? 'Pediatric (<12)' : age === 'adult' ? 'Adult (12-64)' : 'Senior (65+)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Known Allergies */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Known Drug Allergies</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_ALLERGIES.map((al) => {
                    const active = healthProfile.allergies.includes(al);
                    return (
                      <button
                        key={al}
                        onClick={() => setHealthProfile({ ...healthProfile, allergies: toggleItem(healthProfile.allergies, al) })}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {active && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{al}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Existing Conditions */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Existing Medical Conditions</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_CONDITIONS.map((cond) => {
                    const active = healthProfile.existingConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        onClick={() => setHealthProfile({ ...healthProfile, existingConditions: toggleItem(healthProfile.existingConditions, cond) })}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {active && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Medicines */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current Regular Medications</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_MEDICINES.map((med) => {
                    const active = healthProfile.currentMedicines.includes(med);
                    return (
                      <button
                        key={med}
                        onClick={() => setHealthProfile({ ...healthProfile, currentMedicines: toggleItem(healthProfile.currentMedicines, med) })}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {active && <CheckCircle2 className="w-3 h-3 text-purple-600" />}
                        <span>{med}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pregnancy / Nursing */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Pregnant or Breastfeeding?</span>
                  <span className="text-[11px] text-slate-500">Evaluates fetal and neonatal risk profiles</span>
                </div>
                <button
                  onClick={() => setHealthProfile({ ...healthProfile, isPregnantOrNursing: !healthProfile.isPregnantOrNursing })}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    healthProfile.isPregnantOrNursing
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {healthProfile.isPregnantOrNursing ? 'Yes (Active)' : 'No'}
                </button>
              </div>

            </div>
          </div>

          {/* STEP 2: FOOD + SYMPTOM CORRELATION CARD */}
          {safetyAnalysis.foodCorrelation && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍱</span>
                  <h4 className="text-sm font-bold text-slate-900">
                    RECENT FOOD PRODUCT CORRELATION
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  safetyAnalysis.foodCorrelation.potentialConcernDetected
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {safetyAnalysis.foodCorrelation.potentialConcernDetected ? '🟡 POTENTIAL FOOD CONCERN' : '🟢 NO CLEAR LINK'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">
                  Product: {safetyAnalysis.foodCorrelation.foodProductName}
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Ingredients:</strong> {safetyAnalysis.foodCorrelation.foodIngredients}
                </div>
              </div>

              {safetyAnalysis.foodCorrelation.potentialConcernDetected ? (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1.5 text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <span>🟡 POTENTIAL FOOD-RELATED CONCERN:</span>
                    <span>{safetyAnalysis.foodCorrelation.concernTitle}</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed text-[11px]">
                    {safetyAnalysis.foodCorrelation.concernExplanation}
                  </p>
                  <p className="text-[10px] text-amber-800 italic pt-1 border-t border-amber-200">
                    {safetyAnalysis.foodCorrelation.disclaimer}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  {safetyAnalysis.foodCorrelation.concernExplanation}
                </p>
              )}
            </div>
          )}

          {/* STEP 3: REAL-TIME SAFETY CHECK & CONFLICT RESULTS */}
          <div className="space-y-4">
            
            {/* Master Safety Status Card */}
            <div className={`p-6 rounded-2xl border shadow-lg transition-all ${
              safetyAnalysis.riskLevel === 'RED'
                ? 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 text-white border-rose-500/80'
                : safetyAnalysis.riskLevel === 'YELLOW'
                ? 'bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 text-white border-amber-500/80'
                : 'bg-gradient-to-br from-teal-950/90 via-slate-900 to-slate-950 text-white border-teal-500/80'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${
                    safetyAnalysis.riskLevel === 'RED'
                      ? 'bg-rose-500 text-white'
                      : safetyAnalysis.riskLevel === 'YELLOW'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-teal-500 text-slate-950'
                  }`}>
                    {safetyAnalysis.riskLevel === 'RED' ? (
                      <ShieldAlert className="w-7 h-7" />
                    ) : safetyAnalysis.riskLevel === 'YELLOW' ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <ShieldCheck className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80 block">
                      SAFETY STATUS
                    </span>
                    <h3 className="text-lg font-black">{safetyAnalysis.riskTitle}</h3>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
                  safetyAnalysis.riskLevel === 'RED'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : safetyAnalysis.riskLevel === 'YELLOW'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                }`}>
                  {safetyAnalysis.statusLabel}
                </span>
              </div>

              {/* Conflicts List with Clear Explanations of WHY */}
              {safetyAnalysis.conflicts.length > 0 ? (
                <div className="space-y-3 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Identified Safety Conflicts ({safetyAnalysis.conflicts.length})
                  </h4>
                  {safetyAnalysis.conflicts.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        item.severity === 'RED'
                          ? 'bg-rose-900/40 border-rose-600/60 text-rose-100'
                          : 'bg-amber-900/40 border-amber-600/60 text-amber-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 font-semibold">
                          {item.type}
                        </span>
                      </div>
                      <p className="opacity-95 leading-relaxed">{item.description}</p>
                      <div className="pt-1 text-[11px] font-semibold text-white/90 border-t border-white/10 flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Action: {item.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-teal-900/30 border border-teal-700/50 rounded-xl text-xs text-teal-200 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">🟢 NO KNOWN CONFLICT DETECTED</span>
                    No direct contraindication or collision identified between {selectedMedicine.name} and your current inputs. (Always follow official printed packaging instructions).
                  </div>
                </div>
              )}

              {/* Benefit & Risk Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-teal-300 block mb-1">Expected Benefit & General Use</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{safetyAnalysis.benefitSummary}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-amber-300 block mb-1">Dosage & Possible Risks</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{safetyAnalysis.riskSummary}</p>
                </div>
              </div>
            </div>

            {/* STEP 4: 🔎 POSSIBLE CAUSES (Strictly Non-Diagnostic) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔎</span>
                <h4 className="text-sm font-bold text-slate-900">
                  POSSIBLE CAUSES (Strictly Non-Diagnostic)
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Symptoms can have multiple potential causes. PackSure AI provides educational context on possible categories, but the exact cause cannot be confirmed by this application.
              </p>

              <div className="space-y-3 pt-1">
                {safetyAnalysis.possibleCauses.map((pc, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                    <span className="font-bold text-slate-900 block">{pc.category}</span>
                    <p className="text-slate-600 text-[11px]">{pc.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pc.examples.map((ex, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-slate-800 text-[11px] border border-slate-200 font-medium">
                          • {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 5: 🩺 SAFE NEXT STEP */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-lg">🩺</span>
                <span>SAFE NEXT STEP & GUIDANCE</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Self Care Guidance */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <span className="font-bold text-emerald-950 block">Recommended Safe Next Steps</span>
                  <ul className="space-y-1.5 text-emerald-900 pl-4 list-disc text-[11px]">
                    {safetyAnalysis.safeNextSteps.selfCare.map((sc, idx) => (
                      <li key={idx}>{sc}</li>
                    ))}
                  </ul>
                </div>

                {/* Red Flags for Urgent Care */}
                <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2">
                  <span className="font-bold text-rose-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    When to Seek Urgent Medical Care
                  </span>
                  <ul className="space-y-1.5 text-rose-900 pl-4 list-disc text-[11px]">
                    {safetyAnalysis.safeNextSteps.redFlags.map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pharmacist / Doctor Consultation Advice */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900">
                <strong>Professional Consultation: </strong> {safetyAnalysis.safeNextSteps.consultationAdvice}
              </div>
            </div>

            {/* STEP 6: 💊 FINAL MEDICINE SAFETY REPORT (Printable Dossier Card) */}
            <div className="bg-white rounded-2xl p-5 border-2 border-slate-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <h4 className="text-sm font-black text-slate-900 tracking-wide uppercase">
                    💊 MEDICINE SAFETY REPORT
                  </h4>
                </div>
                <button
                  onClick={handlePrintDossier}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Medicine</span>
                    <span className="font-bold text-slate-950">{selectedMedicine.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Ingredient</span>
                    <span className="font-bold text-teal-700">{selectedMedicine.activeIngredient} ({selectedMedicine.strength})</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🤒 Reported Problem:</span>
                    <span className="text-slate-700 font-normal">
                      {healthProfile.symptoms.length > 0 ? healthProfile.symptoms.join(', ') : 'None specified'} 
                      {healthProfile.customSymptom ? ` (${healthProfile.customSymptom})` : ''} 
                      {healthProfile.symptomOnsetTime ? ` • Started ${healthProfile.symptomOnsetTime}` : ''}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🍱 Recent Food:</span>
                    <span className="text-slate-700 font-normal">
                      {healthProfile.recentFoodEaten || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div><strong>🎯 General Use:</strong> {selectedMedicine.generalUses.slice(0, 2).join('; ')}</div>
                  <div><strong>✅ Potential Benefits:</strong> Symptomatic relief of elevated temperature and pain.</div>
                  <div><strong>⚠️ Possible Risks:</strong> {selectedMedicine.warnings[0]}</div>
                  <div><strong>🔎 Possible Causes:</strong> Viral or bacterial infection, dietary irritation, or foodborne pathogen.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <strong>🛡️ Safety Status:</strong>
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      safetyAnalysis.riskLevel === 'RED'
                        ? 'bg-rose-100 text-rose-800'
                        : safetyAnalysis.riskLevel === 'YELLOW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {safetyAnalysis.statusLabel}
                    </span>
                  </div>
                  <div><strong>🩺 Safe Next Step:</strong> Follow leaflet directions, hydrate, monitor symptoms, and consult doctor if worsening.</div>
                  {safetyAnalysis.emergencyWarning && (
                    <div className="text-rose-700 font-bold">
                      <strong>🚨 Emergency Warning:</strong> {safetyAnalysis.emergencyWarning.actionRequired}
                    </div>
                  )}
                </div>

                {/* 📚 SOURCES */}
                <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">📚 Medical Sources & Formularies:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {safetyAnalysis.sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* REAL CAMERA BARCODE SCANNER MODAL WITH DUAL ENGINE ZXING & NATIVE HARDWARE BARCODE DETECTOR */}
      <MedicineBarcodeScannerModal
        isOpen={isBarcodeScanOpen}
        onClose={() => setIsBarcodeScanOpen(false)}
        onMedicineSelected={(med) => setSelectedMedicine(med)}
        language={language}
      />

    </div>
  );
};
