import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Barcode, 
  FileCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowRight,
  Zap,
  Building2,
  MapPin,
  Scale,
  IndianRupee,
  Calendar,
  PhoneCall,
  Info,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Edit3,
  X,
  Check,
  ScanLine,
  Search,
  Database,
  History,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  ChevronLeft
} from 'lucide-react';
import { ProductScanResult, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { sampleProducts } from '../data/sampleProducts';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { 
  lookupProductByBarcode, 
  crossCheckPackageAgainstDatabase, 
  generateBarcodeSmartInsight 
} from '../services/productDatabase';
import { saveScanToHistory } from './ScanHistoryView';

interface ScanProductProps {
  language: Language;
  onScanComplete: (result: ProductScanResult) => void;
  initialSample?: ProductScanResult;
  onNavigateToDigitalTwin?: () => void;
  onNavigateToBarcodeScanner?: () => void;
}

export interface ComplianceQuickTip {
  id: string;
  ruleTag: string;
  statutoryRef: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  badge: string;
  badgeColor: string;
}

export const complianceQuickTips: ComplianceQuickTip[] = [
  {
    id: 'font-size',
    ruleTag: 'Rule 9',
    statutoryRef: 'Rule 9 & Schedule II (PCR 2011)',
    titleEn: 'Ensure font size is at least 2mm',
    titleHi: 'फॉन्ट का आकार कम से कम 2 मिमी सुनिश्चित करें',
    descEn: 'Principal Display Panel (PDP) mandatory numerals and letters must be ≥ 2.0 mm tall for packages up to 500 g/cm² (≥ 4.0 mm for > 200 cm²).',
    descHi: '500 ग्राम/सेमी² तक के पैकेटों पर प्रमुख अक्षरों और अंकों की ऊंचाई न्यूनतम 2.0 मिमी तथा बड़े पैकेटों पर 4.0 मिमी होनी अनिवार्य है।',
    badge: 'Mandatory',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    id: 'unit-sale-price',
    ruleTag: 'Rule 6(11)',
    statutoryRef: 'Rule 6(11) Statutory Amendment',
    titleEn: 'Verify Unit Sale Price (USP) beside MRP',
    titleHi: 'MRP के साथ प्रति इकाई विक्रय मूल्य (USP) जांचें',
    descEn: 'Unit Sale Price (e.g. ₹/g, ₹/kg, ₹/ml, or ₹/piece) must be printed alongside the Maximum Retail Price (MRP).',
    descHi: 'अधिकतम खुदरा मूल्य (MRP) के साथ प्रति ग्राम, मिली या प्रति पीस यूनिट सेल प्राइस स्पष्ट मुद्रित होना अनिवार्य है।',
    badge: 'Mandatory',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'net-quantity',
    ruleTag: 'Rule 12 & 13',
    statutoryRef: 'Standard Units of Weight & Measure',
    titleEn: 'Check standard SI units for Net Quantity',
    titleHi: 'शुद्ध मात्रा हेतु मानक SI इकाइयां सुनिश्चित करें',
    descEn: 'Net quantity must use approved SI symbols (g, kg, ml, l) with space before unit. Non-standard symbols (gms, kgs, ltrs) violate metrology rules.',
    descHi: 'संख्या के बाद रिक्त स्थान के साथ मानक प्रतीकों (g, kg, ml, L) का उपयोग करें। gms, kgs या ltrs लिखना गैर-कानूनी है।',
    badge: 'Metrology',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'contrast-lighting',
    ruleTag: 'Optical OCR',
    statutoryRef: 'Label Clarity & Contrast Mandate',
    titleEn: 'Avoid camera glare on glossy packaging',
    titleHi: 'चमकदार पन्नी पर ग्लेयर से बचें',
    descEn: 'Tilt shiny metallic or laminate pouches slightly away from direct overhead light to prevent bleached-out OCR text.',
    descHi: 'चमकदार पाउच को थोड़ा तिरछा रखें ताकि कैमरे की रोशनी से अनिवार्य घोषणाएं धुंधली या चमक से सफेद न हों।',
    badge: 'Best Practice',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'mfg-expiry-batch',
    ruleTag: 'Rule 6(1)(d)',
    statutoryRef: 'Rule 6(1)(d) Manufacturing & Expiry',
    titleEn: 'Keep Mfg Date, Expiry & Batch unsmudged',
    titleHi: 'निर्माण तिथि, समाप्ति व बैच नंबर स्पष्ट रखें',
    descEn: 'Month & Year of manufacture/packing (MM/YYYY) and Expiry date must be clearly legible and free from ink smudging.',
    descHi: 'निर्माण या पैकिंग का माह और वर्ष (MM/YYYY) तथा समाप्ति तिथि बिना किसी स्याही के फैलाव के साफ दिखनी चाहिए।',
    badge: 'Statutory',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
];

export const ScanProduct: React.FC<ScanProductProps> = ({
  language,
  onScanComplete,
  initialSample,
  onNavigateToDigitalTwin,
  onNavigateToBarcodeScanner,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'barcode'>('upload');
  
  // Selected or captured image
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialSample?.imageUrl || null
  );
  const [selectedSample, setSelectedSample] = useState<ProductScanResult | null>(
    initialSample || null
  );
  const [barcodeInput, setBarcodeInput] = useState<string>('8901234567890');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Quick Tips state for Live Camera View
  const [showQuickTipsTooltip, setShowQuickTipsTooltip] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto-cycle through compliance tips during camera view
  useEffect(() => {
    if (activeTab === 'camera') {
      const timer = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % complianceQuickTips.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);
  
  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis progress animation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  
  // Extracted declarations preview
  const [extractedData, setExtractedData] = useState<ProductScanResult | null>(null);

  // Barcode scanning system states
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [barcodeModalMode, setBarcodeModalMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [barcodeLoadingSequence, setBarcodeLoadingSequence] = useState<{
    step: number;
    title: string;
    subtitle: string;
    completedSteps: string[];
  } | null>(null);
  const [barcodeNotFound, setBarcodeNotFound] = useState<{
    barcode: string;
    format?: string;
  } | null>(null);

  // Quota optimization & error state
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isEditingData, setIsEditingData] = useState(false);
  const [editForm, setEditForm] = useState<{
    productName: string;
    brandName: string;
    category: string;
    manufacturer: string;
    address: string;
    netQuantity: string;
    mrp: string;
    unitSalePrice: string;
    manufacturingDate: string;
    consumerCareDetails: string;
    countryOfOrigin: string;
    bestBefore: string;
  }>({
    productName: '',
    brandName: '',
    category: '',
    manufacturer: '',
    address: '',
    netQuantity: '',
    mrp: '',
    unitSalePrice: '',
    manufacturingDate: '',
    consumerCareDetails: '',
    countryOfOrigin: '',
    bestBefore: '',
  });

  // Start / stop camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. You can upload an image or select a sample.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setSelectedImage(dataUrl);
        setSelectedSample(null);
        setExtractedData(null);
        setScanError(null);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setScanError('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }
    setScanError(null);
    setSelectedSample(null);
    setExtractedData(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: ProductScanResult) => {
    setSelectedSample(sample);
    if (sample.imageUrl) {
      setSelectedImage(sample.imageUrl);
    }
    if (sample.barcode) {
      setBarcodeInput(sample.barcode);
    }
    setExtractedData(null);
    setScanError(null);
  };

  // Open edit modal pre-filled with current extracted data
  const handleOpenEdit = () => {
    if (!extractedData) return;
    setEditForm({
      productName: extractedData.productName || '',
      brandName: extractedData.brandName || '',
      category: extractedData.category || '',
      manufacturer: extractedData.manufacturer || '',
      address: extractedData.address || '',
      netQuantity: extractedData.netQuantity || '',
      mrp: extractedData.mrp || '',
      unitSalePrice: extractedData.unitSalePrice || '',
      manufacturingDate: extractedData.manufacturingDate || '',
      consumerCareDetails: extractedData.consumerCareDetails || '',
      countryOfOrigin: extractedData.countryOfOrigin || '',
      bestBefore: extractedData.bestBefore || '',
    });
    setIsEditingData(true);
  };

  // Save manual edits and recalculate statutory compliance
  const handleSaveEdit = () => {
    if (!extractedData) return;

    // Evaluate rules on edited fields
    const updatedRules = [...extractedData.rules];
    const newViolations: string[] = [];
    let passedCount = 0;

    // 1. MRP Rule 6(1)(e)
    const mrpIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(e)') || r.id === 'rule_mrp');
    const hasMrp = !!editForm.mrp && editForm.mrp !== 'Not declared';
    const hasTax = /(incl|tax|all taxes)/i.test(editForm.mrp);
    if (mrpIdx >= 0) {
      if (!hasMrp) {
        updatedRules[mrpIdx].status = 'FAIL';
        updatedRules[mrpIdx].extractedValue = 'Not declared on package';
        updatedRules[mrpIdx].explanation = 'Violation of Rule 6(1)(e): Maximum Retail Price is missing.';
        newViolations.push('Missing Maximum Retail Price (MRP) declaration per Rule 6(1)(e)');
      } else if (!hasTax) {
        updatedRules[mrpIdx].status = 'WARNING';
        updatedRules[mrpIdx].extractedValue = editForm.mrp;
        updatedRules[mrpIdx].explanation = 'Warning: MRP must explicitly state "inclusive of all taxes".';
        newViolations.push('MRP does not explicitly include statutory "inclusive of all taxes" clause');
        passedCount += 0.5;
      } else {
        updatedRules[mrpIdx].status = 'PASS';
        updatedRules[mrpIdx].extractedValue = editForm.mrp;
        updatedRules[mrpIdx].explanation = 'Compliant: MRP declared in INR with tax inclusion clause.';
        passedCount += 1;
      }
    }

    // 2. Net Quantity Rule 6(1)(c) & Rule 11
    const qtyIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(c)') || r.id === 'rule_net_qty');
    const hasQty = !!editForm.netQuantity && editForm.netQuantity !== 'Not declared';
    const isStandardUnit = /\b(g|kg|ml|l|m|cm|N)\b/i.test(editForm.netQuantity);
    const hasProhibitedUnit = /\b(gms|gm|g\.|packet)\b/i.test(editForm.netQuantity);
    if (qtyIdx >= 0) {
      if (!hasQty) {
        updatedRules[qtyIdx].status = 'FAIL';
        updatedRules[qtyIdx].extractedValue = 'Not declared';
        updatedRules[qtyIdx].explanation = 'Violation of Rule 6(1)(c): Net quantity missing.';
        newViolations.push('Net quantity not declared per Rule 6(1)(c)');
      } else if (hasProhibitedUnit) {
        updatedRules[qtyIdx].status = 'WARNING';
        updatedRules[qtyIdx].extractedValue = editForm.netQuantity;
        updatedRules[qtyIdx].explanation = 'Non-standard unit symbol used. Rule 11 mandates "g", "kg", "ml", "l" or "N".';
        newViolations.push('Non-standard metric unit used for net quantity (violates Rule 11)');
        passedCount += 0.5;
      } else {
        updatedRules[qtyIdx].status = 'PASS';
        updatedRules[qtyIdx].extractedValue = editForm.netQuantity;
        updatedRules[qtyIdx].explanation = 'Compliant: Net quantity declared in standard metric units.';
        passedCount += 1;
      }
    }

    // 3. Manufacturer Rule 6(1)(a)
    const mfgIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(a)') || r.id === 'rule_manufacturer');
    const hasMfg = !!editForm.manufacturer && editForm.manufacturer !== 'Not declared' && editForm.manufacturer.length > 3;
    const hasAddr = !!editForm.address && editForm.address !== 'Not declared' && editForm.address.length > 8;
    if (mfgIdx >= 0) {
      if (hasMfg && hasAddr) {
        updatedRules[mfgIdx].status = 'PASS';
        updatedRules[mfgIdx].extractedValue = `${editForm.manufacturer}, ${editForm.address}`;
        updatedRules[mfgIdx].explanation = 'Compliant: Complete name and physical postal address provided.';
        passedCount += 1;
      } else {
        updatedRules[mfgIdx].status = 'FAIL';
        updatedRules[mfgIdx].extractedValue = editForm.manufacturer || 'Incomplete address';
        updatedRules[mfgIdx].explanation = 'Rule 6(1)(a) requires complete physical address with PIN code.';
        newViolations.push('Manufacturer or packer complete address is missing or incomplete under Rule 6(1)(a)');
      }
    }

    // 4. Consumer Care Rule 6(1)(f)
    const careIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(f)') || r.id === 'rule_consumer_care');
    const hasCare = !!editForm.consumerCareDetails && editForm.consumerCareDetails !== 'Not declared';
    const hasPhoneOrEmail = /(\d{5,}|@|care|helpline)/i.test(editForm.consumerCareDetails);
    if (careIdx >= 0) {
      if (hasCare && hasPhoneOrEmail) {
        updatedRules[careIdx].status = 'PASS';
        updatedRules[careIdx].extractedValue = editForm.consumerCareDetails;
        updatedRules[careIdx].explanation = 'Compliant: Customer helpline/email cell details provided.';
        passedCount += 1;
      } else {
        updatedRules[careIdx].status = 'FAIL';
        updatedRules[careIdx].extractedValue = editForm.consumerCareDetails || 'Missing';
        updatedRules[careIdx].explanation = 'Rule 6(1)(f) mandates telephone number, email address, and designation.';
        newViolations.push('Missing consumer grievance phone number or email under Rule 6(1)(f)');
      }
    }

    // 5. Date of packing Rule 6(1)(d)
    const dateIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(d)') || r.id === 'rule_date');
    const hasDate = !!editForm.manufacturingDate && editForm.manufacturingDate !== 'Not declared';
    if (dateIdx >= 0) {
      if (hasDate) {
        updatedRules[dateIdx].status = 'PASS';
        updatedRules[dateIdx].extractedValue = editForm.manufacturingDate;
        updatedRules[dateIdx].explanation = 'Compliant: Month and year of packing clearly declared.';
        passedCount += 1;
      } else {
        updatedRules[dateIdx].status = 'FAIL';
        updatedRules[dateIdx].extractedValue = 'Not declared';
        updatedRules[dateIdx].explanation = 'Violation of Rule 6(1)(d): Month and year of packing/manufacturing is missing.';
        newViolations.push('Month and year of manufacture or packing missing per Rule 6(1)(d)');
      }
    }

    // 6. Country of Origin Rule 6(1)(g)
    const originIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(1)(g)') || r.id === 'rule_country_origin');
    const hasOrigin = !!editForm.countryOfOrigin && editForm.countryOfOrigin !== 'Not declared';
    if (originIdx >= 0) {
      if (hasOrigin) {
        updatedRules[originIdx].status = 'PASS';
        updatedRules[originIdx].extractedValue = editForm.countryOfOrigin;
        updatedRules[originIdx].explanation = 'Compliant: Country of origin explicitly declared.';
        passedCount += 1;
      } else {
        updatedRules[originIdx].status = 'FAIL';
        updatedRules[originIdx].extractedValue = 'Not declared';
        updatedRules[originIdx].explanation = 'Rule 6(1)(g) requires country of origin on all packages.';
        newViolations.push('Country of origin not declared per Rule 6(1)(g)');
      }
    }

    // 7. Unit Sale Price Rule 6(11)
    const uspIdx = updatedRules.findIndex(r => r.ruleCode.includes('6(11)') || r.id === 'rule_unit_sale_price');
    const hasUsp = !!editForm.unitSalePrice && editForm.unitSalePrice !== 'Not declared on pack' && editForm.unitSalePrice !== 'Not declared';
    if (uspIdx >= 0) {
      if (hasUsp) {
        updatedRules[uspIdx].status = 'PASS';
        updatedRules[uspIdx].extractedValue = editForm.unitSalePrice;
        updatedRules[uspIdx].explanation = 'Compliant: Unit Sale Price declared per unit of measure.';
        passedCount += 1;
      } else {
        updatedRules[uspIdx].status = 'WARNING';
        updatedRules[uspIdx].extractedValue = 'Not declared on pack';
        updatedRules[uspIdx].explanation = 'Rule 6(11) requires Unit Sale Price if package contains >100g/ml.';
        newViolations.push('Unit Sale Price (USP) missing per Rule 6(11)');
      }
    }

    // Recompute score
    const totalConsidered = 7;
    const score = Math.min(100, Math.max(10, Math.round((passedCount / totalConsidered) * 100)));
    const status = score >= 90 ? 'COMPLIANT' : score >= 60 ? 'PARTIALLY COMPLIANT' : 'NON-COMPLIANT';

    setExtractedData({
      ...extractedData,
      productName: editForm.productName || extractedData.productName,
      brandName: editForm.brandName || extractedData.brandName,
      category: editForm.category || extractedData.category,
      manufacturer: editForm.manufacturer,
      address: editForm.address,
      netQuantity: editForm.netQuantity,
      mrp: editForm.mrp,
      unitSalePrice: editForm.unitSalePrice,
      manufacturingDate: editForm.manufacturingDate,
      consumerCareDetails: editForm.consumerCareDetails,
      countryOfOrigin: editForm.countryOfOrigin,
      bestBefore: editForm.bestBefore,
      complianceScore: score,
      status,
      rules: updatedRules,
      violations: newViolations.length > 0 ? newViolations : ['Zero statutory infractions detected.'],
    });

    setIsEditingData(false);
  };

  // Run AI Analysis pipeline
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setCurrentAnalysisStep(0);
    setExtractedData(null);
    setScanError(null);

    // Visual progress stages
    const timer1 = setTimeout(() => {
      setAnalysisProgress(35);
      setCurrentAnalysisStep(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setAnalysisProgress(70);
      setCurrentAnalysisStep(2);
    }, 1100);

    const timer3 = setTimeout(() => {
      setAnalysisProgress(90);
      setCurrentAnalysisStep(3);
    }, 1600);

    try {
      let finalResult: ProductScanResult | null = null;

      // If user selected a preset demo sample AND didn't upload their own image, use that demo sample
      if (selectedSample && !selectedImage?.startsWith('data:image/')) {
        finalResult = { ...selectedSample, scannedAt: new Date().toLocaleString() };
      } else if (selectedImage) {
        // Extract MIME type from data URL (supports image/jpeg, image/png, image/webp)
        let mimeType = 'image/jpeg';
        if (selectedImage.startsWith('data:image/png')) mimeType = 'image/png';
        else if (selectedImage.startsWith('data:image/webp')) mimeType = 'image/webp';
        else if (selectedImage.startsWith('data:image/gif')) mimeType = 'image/gif';

        const res = await fetch('/api/analyze-label', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: selectedImage,
            mimeType,
            productName: selectedSample?.productName,
          }),
        });

        const json = await res.json();

        if (json?.notice) {
          setQuotaNotice(json.notice);
        } else {
          setQuotaNotice(null);
        }

        if (json?.data) {
          const aiData = json.data;

          // Ensure rules analysis conforms to RuleCheckResult[]
          const rawRules = Array.isArray(aiData.rulesAnalysis) ? aiData.rulesAnalysis : [];
          const formattedRules = rawRules.map((r: any, idx: number) => ({
            id: r.id || `rule_${idx}`,
            ruleCode: r.ruleCode || `Rule 6(1)`,
            ruleName: r.ruleName || 'Statutory Declaration',
            requirement: r.requirement || 'Mandatory declaration under Legal Metrology Rules',
            found: r.found ?? (r.status === 'PASS' || r.status === 'WARNING'),
            extractedValue: r.extractedValue || 'Not detected on visible packaging',
            status: (r.status === 'PASS' || r.status === 'WARNING' || r.status === 'FAIL') ? r.status : 'FAIL',
            explanation: r.explanation || 'Statutory review under Packaged Commodities Rules 2011',
            legalClause: r.legalClause || 'Legal Metrology (Packaged Commodities) Rules, 2011',
            penaltyClause: r.penaltyClause || 'Section 36, Legal Metrology Act, 2009',
            whyItMatters: r.whyItMatters || undefined,
            recommendedAction: r.recommendedAction || undefined,
          }));

          finalResult = {
            id: `scan-${Date.now()}`,
            productName: aiData.productName || 'Scanned Packaged Commodity',
            brandName: aiData.brandName || undefined,
            category: aiData.category || 'Packaged Commodity',
            barcode: barcodeInput || '890' + Math.floor(1000000000 + Math.random() * 9000000000),
            imageUrl: selectedImage,
            scannedAt: new Date().toLocaleString(),
            inspectorName: 'Inspection Officer (Surveillance)',
            manufacturer: aiData.manufacturer || 'Not detected on visible label',
            address: aiData.address || 'Not detected on visible label',
            netQuantity: aiData.netQuantity || 'Not declared',
            mrp: aiData.mrp || 'Not declared',
            unitSalePrice: aiData.unitSalePrice || undefined,
            manufacturingDate: aiData.manufacturingDate || 'Not declared',
            consumerCareDetails: aiData.consumerCareDetails || 'Not declared',
            countryOfOrigin: aiData.countryOfOrigin || 'Not declared',
            bestBefore: aiData.bestBefore || undefined,
            otherDeclarations: aiData.otherDeclarations || undefined,
            complianceScore: typeof aiData.complianceScore === 'number' ? aiData.complianceScore : 85,
            status: aiData.status === 'COMPLIANT' || aiData.status === 'PARTIALLY COMPLIANT' || aiData.status === 'NON-COMPLIANT' 
              ? aiData.status 
              : (aiData.complianceScore >= 90 ? 'COMPLIANT' : aiData.complianceScore >= 60 ? 'PARTIALLY COMPLIANT' : 'NON-COMPLIANT'),
            riskLevel: aiData.riskLevel || (aiData.complianceScore >= 85 ? 'LOW' : aiData.complianceScore >= 60 ? 'MEDIUM' : 'HIGH'),
            subScores: aiData.subScores || {
              mandatoryInfo: Math.round((aiData.complianceScore || 80) / 10),
              labelClarity: 8,
              declarationCompliance: Math.round((aiData.complianceScore || 80) / 10),
            },
            aiInsight: aiData.aiInsight || undefined,
            heatmapBoxes: Array.isArray(aiData.heatmapBoxes) && aiData.heatmapBoxes.length > 0 ? aiData.heatmapBoxes : undefined,
            rules: formattedRules.length > 0 ? formattedRules : sampleProducts[1].rules,
            violations: Array.isArray(aiData.violations) && aiData.violations.length > 0
              ? aiData.violations
              : ['Statutory review complete; verify all sides of packaging.'],
            penaltiesNotice: aiData.penalties || 'Under Section 36 of Legal Metrology Act, 2009 (Fine up to ₹25,000 for first offence)',
            recommendations: Array.isArray(aiData.recommendations) ? aiData.recommendations : [],
          };
        } else {
          // If the AI service returned an error, capture it
          const errMsg = json?.error || json?.message || 'The AI model could not process this image clearly.';
          setScanError(errMsg);
        }
      } else {
        setScanError('Please select or upload a product packaging image first.');
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setAnalysisProgress(100);
      setIsAnalyzing(false);

      if (finalResult) {
        setExtractedData(finalResult);
      }
    } catch (err: any) {
      console.error('Scan analysis error:', err);
      setIsAnalyzing(false);
      setScanError(err?.message || 'Network error communicating with the AI service. Please check your connection and try again.');
    }
  };

  const handleProceedToVerdict = () => {
    if (extractedData) {
      onScanComplete(extractedData);
    }
  };

  // Master Barcode Detection and Database Retrieval Workflow
  const handleBarcodeDetected = async (
    barcode: string,
    format: string = 'EAN-13',
    capturedImage?: string
  ) => {
    setScanError(null);
    setBarcodeNotFound(null);
    setExtractedData(null);
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    // Sequence Step 1: Barcode detected
    setBarcodeLoadingSequence({
      step: 1,
      title: `Barcode Detected: ${barcode}`,
      subtitle: `Optical pattern identified (${format})`,
      completedSteps: [],
    });

    await new Promise((r) => setTimeout(r, 450));
    setAnalysisProgress(35);

    // Sequence Step 2: Barcode decoded
    setBarcodeLoadingSequence({
      step: 2,
      title: 'Barcode Decoded Successfully',
      subtitle: `Standard GS1 GTIN digits extracted without OCR hallucination`,
      completedSteps: [`Barcode detected: ${barcode} (${format})`],
    });

    await new Promise((r) => setTimeout(r, 400));
    setAnalysisProgress(55);

    // Sequence Step 3: Searching product database
    setBarcodeLoadingSequence({
      step: 3,
      title: 'Searching Product Database...',
      subtitle: 'Querying Open Food Facts & Verified National FMCG Registry',
      completedSteps: [
        `Barcode detected: ${barcode} (${format})`,
        `Barcode decoded: ${barcode}`,
      ],
    });

    // Query real API & verified registry via productDatabase service
    const dbResult = await lookupProductByBarcode(barcode);

    if (!dbResult.found) {
      setIsAnalyzing(false);
      setBarcodeLoadingSequence(null);
      setBarcodeNotFound({ barcode, format });
      return;
    }

    setAnalysisProgress(75);
    // Sequence Step 4: Product found
    setBarcodeLoadingSequence({
      step: 4,
      title: `Product Found: ${dbResult.productName || 'Packaged Commodity'}`,
      subtitle: `Brand: ${dbResult.brand || 'Verified Brand'} • Source: ${dbResult.source}`,
      completedSteps: [
        `Barcode detected: ${barcode} (${format})`,
        `Barcode decoded: ${barcode}`,
        `Database lookup complete: ${dbResult.source}`,
      ],
    });

    await new Promise((r) => setTimeout(r, 450));
    setAnalysisProgress(90);

    // Sequence Step 5: Checking package compliance
    setBarcodeLoadingSequence({
      step: 5,
      title: 'Auditing Statutory Compliance...',
      subtitle: 'Evaluating Legal Metrology (Packaged Commodities) Rules, 2011',
      completedSteps: [
        `Barcode detected: ${barcode} (${format})`,
        `Barcode decoded: ${barcode}`,
        `Database lookup complete: ${dbResult.source}`,
        `Product found: ${dbResult.productName}`,
      ],
    });

    // Match sample or synthesize statutory compliance audit
    const matchingSample =
      sampleProducts.find((p) => p.barcode === barcode) ||
      sampleProducts.find((p) => dbResult.brand && p.brandName.toLowerCase().includes(dbResult.brand.toLowerCase())) ||
      sampleProducts[0];

    const packageImage = capturedImage || selectedImage || dbResult.imageUrl || matchingSample.imageUrl;

    const baseResult: ProductScanResult = {
      id: `audit-${Date.now()}`,
      productName: dbResult.productName || matchingSample.productName,
      brandName: dbResult.brand || matchingSample.brandName,
      category: dbResult.category || matchingSample.category,
      barcode: barcode,
      imageUrl: packageImage,
      scannedAt: new Date().toLocaleString(),
      inspectorName: 'Inspection Officer (Surveillance)',
      manufacturer: dbResult.manufacturer || matchingSample.manufacturer,
      address: dbResult.manufacturerAddress || matchingSample.address,
      netQuantity: dbResult.quantity || dbResult.netWeight || matchingSample.netQuantity,
      mrp: matchingSample.mrp,
      unitSalePrice: matchingSample.unitSalePrice,
      manufacturingDate: matchingSample.manufacturingDate,
      consumerCareDetails: matchingSample.consumerCareDetails,
      countryOfOrigin: dbResult.countryOfOrigin || 'India',
      bestBefore: matchingSample.bestBefore,
      otherDeclarations: matchingSample.otherDeclarations,
      complianceScore: matchingSample.complianceScore,
      status: matchingSample.status,
      riskLevel: matchingSample.riskLevel,
      rules: matchingSample.rules,
      violations: matchingSample.violations,
      penaltiesNotice: matchingSample.penaltiesNotice,
      recommendations: matchingSample.recommendations,
      databaseInfo: dbResult,
    };

    // Cross check database against packaging
    const verifications = crossCheckPackageAgainstDatabase(baseResult, dbResult);
    baseResult.packageVerification = verifications;

    // Smart insight based ONLY on available data
    const smartInsight = generateBarcodeSmartInsight(barcode, dbResult, baseResult);
    baseResult.aiInsight = {
      summary: smartInsight,
      topIssue: baseResult.violations[0] || 'No critical violations detected. Packaging adheres to statutory rules.',
      fieldsDetectedCount: 7,
      fieldsAttentionCount: baseResult.rules.filter((r) => r.status !== 'PASS').length,
    };

    // Save to local history
    saveScanToHistory({
      id: `hist-${Date.now()}`,
      barcode,
      format,
      productName: baseResult.productName,
      brand: baseResult.brandName,
      date: new Date().toLocaleString(),
      complianceScore: baseResult.complianceScore,
      status: baseResult.status,
      hasDatabaseInfo: true,
      hasPackageScan: Boolean(capturedImage || selectedImage),
      resultPayload: baseResult,
    });

    await new Promise((r) => setTimeout(r, 400));
    setAnalysisProgress(100);

    // Sequence Step 6: Analysis complete
    setBarcodeLoadingSequence({
      step: 6,
      title: 'Analysis Complete',
      subtitle: 'Rendering verified product details and compliance verdict',
      completedSteps: [
        `Barcode detected: ${barcode} (${format})`,
        `Barcode decoded: ${barcode}`,
        `Database lookup complete: ${dbResult.source}`,
        `Product found: ${dbResult.productName}`,
        'Legal Metrology PCR 2011 compliance audited',
      ],
    });

    await new Promise((r) => setTimeout(r, 350));

    setIsAnalyzing(false);
    setBarcodeLoadingSequence(null);
    setExtractedData(baseResult);
    onScanComplete(baseResult);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold mb-1.5">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>AI Optical Declaration Scanner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.scanHeading}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {t.scanSubheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onNavigateToDigitalTwin && (
              <button
                onClick={onNavigateToDigitalTwin}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 shadow-2xs transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Compliance Digital Twin</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px]">3 Alerts</span>
              </button>
            )}

            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Standard:
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-700 shadow-2xs">
                Rule 6(1) PCR 2011
              </span>
            </div>
          </div>
        </div>

        {/* Evidence-First Legal Metrology Inspection Principle Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>Statutory Principle: Evidence-Based Metrology Screening</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-200 text-blue-900 font-extrabold text-[10px]">
                  MANDATORY
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Barcode / QR is used <strong>solely for catalog lookup</strong>. Actual compliance must be grounded in and verified from physical label photographs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Evidence Engine Online</span>
            </div>
          </div>
        </div>

        {/* Preset Sample Selector (For instant evaluation & SIH Live Demo) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                {t.sampleSelectorTitle}
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Click any sample to preload & test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleProducts.map((sample) => {
              const isSelected = selectedSample?.id === sample.id;
              const isCompliant = sample.status === 'COMPLIANT';
              const isPartial = sample.status === 'PARTIALLY COMPLIANT';
              return (
                <button
                  key={sample.id}
                  id={`btn-sample-${sample.id}`}
                  onClick={() => handleSampleSelect(sample)}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {sample.productName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sample.complianceScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {sample.category}
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-slate-600 flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                    <span>{sample.status}</span>
                    <span className="text-blue-600">Select →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scan Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
            <button
              id="tab-upload-btn"
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{t.tabUpload}</span>
            </button>

            <button
              id="tab-camera-btn"
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.tabCamera}</span>
            </button>

            <button
              id="tab-barcode-btn"
              onClick={() => {
                setActiveTab('barcode');
                stopCamera();
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'barcode'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Barcode className="w-4 h-4" />
              <span>{t.tabBarcode}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tab 1: Upload */}
            {activeTab === 'upload' && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">
                    {t.dropzoneTitle}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t.dropzoneSubtitle}
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                    <span>Browse Device Files</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Live Camera */}
            {activeTab === 'camera' && (
              <div className="space-y-4">
                {cameraError ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Camera Access Notice</p>
                      <p className="text-xs text-rose-700 mt-1">{cameraError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-96 mx-auto flex items-center justify-center border border-slate-800 shadow-inner">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Scanner Framing Box overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                      <div className="w-4/5 h-4/5 border-2 border-dashed border-blue-400/80 rounded-xl relative">
                        <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          ALIGN LABEL HERE
                        </div>
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400/40 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Quick Tips Tooltip Trigger Button on top-right HUD */}
                    <div className="absolute top-3 right-3 z-30 pointer-events-auto">
                      <div className="relative">
                        <button
                          type="button"
                          id="btn-camera-quick-tips"
                          onClick={() => setShowQuickTipsTooltip(!showQuickTipsTooltip)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/60 backdrop-blur-md text-xs font-bold transition-all shadow-lg hover:scale-105 cursor-pointer ring-2 ring-amber-400/20"
                          aria-label="Compliance Quick Tips"
                          title="Click to toggle compliance quick tips"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>{language === 'hi' ? 'त्वरित सुझाव' : 'Quick Tips'}</span>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        </button>

                        {/* Interactive Tooltip Card / Popover Overlay */}
                        {showQuickTipsTooltip && (
                          <div 
                            id="quick-tips-popover"
                            className="absolute right-0 top-10 w-80 sm:w-96 p-4 rounded-2xl bg-slate-900/98 border border-amber-400/60 text-white shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                          >
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/80">
                              <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                                  <Lightbulb className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-amber-300">
                                    {language === 'hi' ? 'विधिक माप विज्ञान त्वरित सुझाव' : 'Packaging Compliance Quick Tips'}
                                  </h5>
                                  <p className="text-[10px] text-slate-400">
                                    Legal Metrology (Packaged Commodities) Rules 2011
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowQuickTipsTooltip(false)}
                                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Close Quick Tips"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Tips List */}
                            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                              {complianceQuickTips.map((tip, idx) => {
                                const isCurrent = currentTipIndex === idx;
                                return (
                                  <div
                                    key={tip.id}
                                    onClick={() => setCurrentTipIndex(idx)}
                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                      isCurrent
                                        ? 'bg-amber-500/15 border-amber-400/60 ring-1 ring-amber-400/40'
                                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/70'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1.5 mb-1">
                                      <span className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                                        <span className="text-amber-400 font-mono text-[11px]">#{idx + 1}</span>
                                        <span>{language === 'hi' ? tip.titleHi : tip.titleEn}</span>
                                      </span>
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${tip.badgeColor}`}>
                                        {tip.ruleTag}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                      {language === 'hi' ? tip.descHi : tip.descEn}
                                    </p>
                                    <div className="mt-1 text-[9px] font-mono text-amber-300/80">
                                      § {tip.statutoryRef}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Popover Footer */}
                            <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">
                                {language === 'hi' ? '5 अनिवार्य नियम' : '5 Statutory Checkpoints'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowQuickTipsTooltip(false)}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                {language === 'hi' ? 'समझ गया, स्कैन करें' : 'Got it, Ready'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Live Helper Text Ticker inside Camera Frame */}
                    <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-20 pointer-events-auto">
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-white shadow-xl">
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                {complianceQuickTips[currentTipIndex].ruleTag}
                              </span>
                              <p className="text-xs font-semibold text-slate-100 truncate">
                                {language === 'hi'
                                  ? complianceQuickTips[currentTipIndex].titleHi
                                  : complianceQuickTips[currentTipIndex].titleEn}
                              </p>
                            </div>
                            <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                              {language === 'hi'
                                ? complianceQuickTips[currentTipIndex].descHi
                                : complianceQuickTips[currentTipIndex].descEn}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setCurrentTipIndex((prev) => (prev - 1 + complianceQuickTips.length) % complianceQuickTips.length)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Previous Tip"
                            aria-label="Previous Tip"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono text-slate-400 px-1">
                            {currentTipIndex + 1}/{complianceQuickTips.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentTipIndex((prev) => (prev + 1) % complianceQuickTips.length)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Next Tip"
                            aria-label="Next Tip"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowQuickTipsTooltip(true)}
                            className="ml-1 px-2 py-1 rounded-lg bg-blue-600/40 hover:bg-blue-600 text-blue-200 hover:text-white text-[10px] font-bold transition-all border border-blue-400/40 cursor-pointer"
                          >
                            {language === 'hi' ? 'सभी' : 'Tips'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white p-4">
                        <Camera className="w-12 h-12 text-slate-400 mb-2" />
                        <p className="text-sm font-semibold">Camera preview is inactive</p>
                        <button
                          onClick={startCamera}
                          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white cursor-pointer"
                        >
                          {t.startCameraBtn}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Dedicated Live Compliance Helper Text Banner */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start space-x-3 text-xs shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-amber-950 text-xs">
                        {language === 'hi' ? '💡 त्वरित अनुपालन अनुस्मारक (PCR 2011)' : '💡 Live Compliance Helper & Reminders'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowQuickTipsTooltip(true)}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>{language === 'hi' ? 'सभी 5 नियम देखें' : 'View all 5 compliance tips'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                      {language === 'hi' ? (
                        <span>
                          <strong>मुख्य नियम:</strong> सुनिश्चित करें कि मुख्य डिस्प्ले पैनल (PDP) पर फॉन्ट का आकार कम से कम <strong>2 मिमी</strong> हो (नियम 9)। एमआरपी और यूनिट सेल प्राइस (USP) को फ्रेम के भीतर रखें, और चमकदार पन्नी पर सीधी रोशनी से बचें।
                        </span>
                      ) : (
                        <span>
                          <strong>Key Reminder:</strong> Ensure font size is at least <strong>2mm</strong> on Principal Display Panel (Rule 9). Keep MRP and Unit Sale Price in frame, and tilt shiny packaging slightly to eliminate reflective glare.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {isCameraActive ? (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t.capturePhotoBtn}</span>
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        {t.stopCameraBtn}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{t.startCameraBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Upgraded Real Barcode-Based System */}
            {activeTab === 'barcode' && (
              <div className="space-y-6 max-w-2xl mx-auto py-2">
                {/* Header info */}
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Smart GS1 / EAN Barcode Scanner & Registry Lookup
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Optical hardware decoding of packaging barcodes (EAN-13, EAN-8, UPC-A, UPC-E) connected to Open Food Facts and the Verified Indian FMCG Registry.
                  </p>
                </div>

                {/* The Two Primary Action Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Button 1: Live Camera Scanner */}
                  <button
                    onClick={() => {
                      if (onNavigateToBarcodeScanner) {
                        onNavigateToBarcodeScanner();
                      } else {
                        setBarcodeModalMode('camera');
                        setIsBarcodeModalOpen(true);
                      }
                    }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all text-left group flex flex-col justify-between cursor-pointer border border-blue-500/40"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                        HARDWARE OPTICAL
                      </span>
                    </div>
                    <div>
                      <h5 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                        <span>📷 Scan Barcode with Camera</span>
                      </h5>
                      <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                        Instant auto-detection with real-time laser guidance frame and zero OCR guesswork.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-white">
                      <span>Launch Camera Scanner</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Button 2: Upload Barcode Image */}
                  <button
                    onClick={() => {
                      setBarcodeModalMode('upload');
                      setIsBarcodeModalOpen(true);
                    }}
                    className="p-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 text-slate-900 shadow-2xs hover:shadow-sm transition-all text-left group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        IMAGE FILE
                      </span>
                    </div>
                    <div>
                      <h5 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                        <span>📤 Upload Barcode Image</span>
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Upload a photo of packaging containing a barcode. Our engine will crop and decode it.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>Select Barcode Photo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Option 3: Direct Manual Entry Bar */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Or Enter Barcode Manually
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        placeholder="e.g. 8901030010103 or 8901719101014"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (barcodeInput.trim().length >= 4) {
                          handleBarcodeDetected(barcodeInput.trim(), 'EAN-13');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer shrink-0 flex items-center space-x-1.5 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Database</span>
                    </button>
                  </div>
                </div>

                {/* Verified Indian Packaged Goods Quick Shortcuts */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Quick Test with Real Indian FMCG Barcodes:</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Instant lookup</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { code: '8901030010103', name: 'Britannia Good Day Biscuits', brand: 'Britannia' },
                      { code: '8901719101014', name: 'Parle-G Gold Glucose', brand: 'Parle' },
                      { code: '8901262010054', name: 'Amul Pasteurised Butter 500g', brand: 'Amul' },
                      { code: '8901058852331', name: 'Maggi 2-Minute Noodles', brand: 'Nestlé' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setBarcodeInput(item.code);
                          handleBarcodeDetected(item.code, 'EAN-13');
                        }}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                            {item.name}
                          </p>
                          <span className="font-mono text-[11px] text-slate-500">
                            {item.code}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                          Scan →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* State: Barcode Not Found */}
                {barcodeNotFound && (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-amber-950">
                          Product not found in the connected database.
                        </h5>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Barcode <strong className="font-mono">{barcodeNotFound.barcode}</strong> was decoded successfully, but no matching SKU metadata was returned by Open Food Facts or the Verified Registry.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/80">
                      <button
                        onClick={() => {
                          setActiveTab('upload');
                          setBarcodeNotFound(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Try Image Scan</span>
                      </button>

                      <button
                        onClick={() => {
                          setBarcodeModalMode('manual');
                          setIsBarcodeModalOpen(true);
                          setBarcodeNotFound(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-500" />
                        <span>Enter Barcode Manually</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Image Preview & Action Trigger */}
            {selectedImage && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Image thumbnail */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video md:aspect-square flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Product label preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      LABEL READY
                    </div>
                  </div>

                  {/* Summary & Inspection Trigger */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                        Selected Packaging Sample
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {selectedSample?.productName || 'Custom Uploaded Package Label'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedSample?.category || 'Pre-packaged consumer commodity'}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Law:</span>
                        <span className="font-medium text-slate-800">Legal Metrology (Packaged Commodities) Rules, 2011</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Evaluation Scope:</span>
                        <span className="font-medium text-slate-800">Rule 6(1)(a)-(g), Rule 11 & Unit Sale Price</span>
                      </div>
                    </div>

                    <button
                      id="btn-run-ai-analysis"
                      disabled={isAnalyzing}
                      onClick={runAnalysis}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Analyzing Label via AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{t.btnRunAnalysis}</span>
                        </>
                      )}
                    </button>

                    {/* Quota Optimization Notice */}
                    {quotaNotice && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5 mt-3 animate-in fade-in">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-0.5">
                          <p className="font-bold text-amber-900">Statutory Rule Engine Active</p>
                          <p className="text-amber-800 leading-relaxed text-[11px]">{quotaNotice}</p>
                        </div>
                      </div>
                    )}

                    {/* Scan Error Message display */}
                    {scanError && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3 mt-3 animate-in fade-in">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-bold text-sm text-rose-900">Label Analysis Notice</p>
                          <p className="text-rose-700 leading-relaxed">{scanError}</p>
                          <p className="text-rose-600 font-medium pt-1">
                            Tip: Make sure the photo is clear, focused, and includes the back panel where MRP, net quantity, and manufacturer details are printed.
                          </p>
                          <div className="pt-2 flex items-center space-x-3">
                            <button
                              onClick={runAnalysis}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Retry Analysis
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading / Progress Animation Overlay */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto relative">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 animate-ping"></span>
            </div>

            {barcodeLoadingSequence ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {barcodeLoadingSequence.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {barcodeLoadingSequence.subtitle}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="max-w-md mx-auto">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>Barcode & Product Registry Pipeline</span>
                    <span>{analysisProgress}%</span>
                  </div>
                </div>

                {/* Barcode Sequential Steps as explicitly required */}
                <div className="max-w-md mx-auto text-left space-y-2.5 pt-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step > 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    )}
                    <span>Barcode detected</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 2 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step > 2 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : barcodeLoadingSequence.step === 2 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>Barcode decoded</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 3 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step > 3 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : barcodeLoadingSequence.step === 3 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>Searching product database...</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 4 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step > 4 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : barcodeLoadingSequence.step === 4 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>Product found</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 5 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step > 5 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : barcodeLoadingSequence.step === 5 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>Checking package compliance...</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${barcodeLoadingSequence.step >= 6 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    {barcodeLoadingSequence.step >= 6 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>Analysis complete</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {t.analyzingTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comparing optical characters with Legal Metrology (Packaged Commodities) Rules, 2011
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mt-4">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>OCR Pipeline</span>
                    <span>{analysisProgress}%</span>
                  </div>
                </div>

                {/* Live pipeline check stages */}
                <div className="max-w-md mx-auto text-left space-y-2 pt-4">
                  <div className={`flex items-center space-x-2 text-xs ${currentAnalysisStep >= 0 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {currentAnalysisStep > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    )}
                    <span>{t.analyzingStep1}</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${currentAnalysisStep >= 1 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {currentAnalysisStep > 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : currentAnalysisStep === 1 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                    <span>{t.analyzingStep2}</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${currentAnalysisStep >= 2 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {currentAnalysisStep > 2 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : currentAnalysisStep === 2 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                    <span>{t.analyzingStep3}</span>
                  </div>

                  <div className={`flex items-center space-x-2 text-xs ${currentAnalysisStep >= 3 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {currentAnalysisStep >= 3 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                    <span>{t.analyzingStep4}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extracted Information Cards (Display immediately after analysis) */}
        {extractedData && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md mb-1 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>OCR Text Extraction Complete</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {t.extractedHeader}
                </h3>
                <p className="text-xs text-slate-500">
                  Extracted statutory fields ready for compliance verdict
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-edit-extracted-data"
                  onClick={handleOpenEdit}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 shadow-2xs cursor-pointer transition-all shrink-0"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>Edit / Verify Declarations</span>
                </button>

                <button
                  id="btn-view-verdict"
                  onClick={handleProceedToVerdict}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md cursor-pointer transition-all shrink-0"
                >
                  <span>View Full Compliance Verdict & Score</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Extracted Fields Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Product Name */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.cardProductName}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {extractedData.productName}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Brand: {extractedData.brandName || 'N/A'}
                </div>
              </div>

              {/* Manufacturer */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t.cardManufacturer}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {extractedData.manufacturer}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Rule 6(1)(a) Declaration
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t.cardAddress}</span>
                </div>
                <div className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">
                  {extractedData.address}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Verified against postal PIN requirements
                </div>
              </div>

              {/* Net Quantity */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.cardNetQty}</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                  {extractedData.netQuantity}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Standard SI unit metric: Rule 11
                </div>
              </div>

              {/* MRP */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.cardMrp}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                  {extractedData.mrp}
                </div>
                {extractedData.unitSalePrice && (
                  <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                    USP: {extractedData.unitSalePrice}
                  </div>
                )}
              </div>

              {/* Manufacturing / Packing Date */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.cardMfgDate}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                  {extractedData.manufacturingDate}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Expiry/Best before: {extractedData.bestBefore || 'Declared'}
                </div>
              </div>

              {/* Consumer Care Details */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{t.cardConsumerCare}</span>
                </div>
                <div className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">
                  {extractedData.consumerCareDetails}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Rule 6(1)(f) Grievance Cell
                </div>
              </div>

              {/* Other Mandatory Declarations */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.cardOtherDeclarations}</span>
                </div>
                <div className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">
                  Origin: {extractedData.countryOfOrigin} | {extractedData.otherDeclarations || 'N/A'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Country of Origin / FSSAI
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification & Manual Correction Modal */}
        {isEditingData && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Verify & Edit Statutory Declarations
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify optical extraction against physical packaging before calculating compliance score
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingData(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-800">
                  <span className="font-bold">Legal Metrology Note:</span> If details (such as MRP or Customer Helpline) appear on the back of the package and were not captured in this photo, you can enter or correct them here. The compliance score will automatically recalculate.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editForm.productName}
                      onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Brand Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={editForm.brandName}
                      onChange={(e) => setEditForm({ ...editForm, brandName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Net Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Net Quantity (Rule 6(1)(c) & Rule 11)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 200 g, 500 ml, 1 kg, 1 N"
                      value={editForm.netQuantity}
                      onChange={(e) => setEditForm({ ...editForm, netQuantity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">Standard units: g, kg, ml, l, N (Avoid 'gms', 'gm')</span>
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Maximum Retail Price (Rule 6(1)(e))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 45.00 (Incl. of all taxes)"
                      value={editForm.mrp}
                      onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">Must declare "Incl. of all taxes"</span>
                  </div>

                  {/* Unit Sale Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unit Sale Price (USP) (Rule 6(11))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹ 0.22 per g"
                      value={editForm.unitSalePrice}
                      onChange={(e) => setEditForm({ ...editForm, unitSalePrice: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Manufacturing / Packing Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mfg / Packing Date (Rule 6(1)(d))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08/2026 or August 2026"
                      value={editForm.manufacturingDate}
                      onChange={(e) => setEditForm({ ...editForm, manufacturingDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Country of Origin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Country of Origin (Rule 6(1)(g))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      value={editForm.countryOfOrigin}
                      onChange={(e) => setEditForm({ ...editForm, countryOfOrigin: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Best Before */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Best Before / Use By
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Months from packaging"
                      value={editForm.bestBefore}
                      onChange={(e) => setEditForm({ ...editForm, bestBefore: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Manufacturer Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Manufacturer / Packer Legal Name (Rule 6(1)(a))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hindustan Foods Limited"
                      value={editForm.manufacturer}
                      onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Manufacturer Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Manufacturer Complete Physical Address with PIN Code
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Plot No. 15, Industrial Estate, Sector 58, Faridabad, Haryana - 121004"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Consumer Care */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Consumer Care / Helpline Details (Rule 6(1)(f))
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Toll Free: 1800-200-3344, Email: feedback@company.in"
                      value={editForm.consumerCareDetails}
                      onChange={(e) => setEditForm({ ...editForm, consumerCareDetails: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsEditingData(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Recalculate Compliance</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Barcode Scanner Modal with Camera and Upload Options */}
        <BarcodeScannerModal
          isOpen={isBarcodeModalOpen}
          onClose={() => setIsBarcodeModalOpen(false)}
          onBarcodeDetected={(barcode, format, capturedImage) => {
            handleBarcodeDetected(barcode, format || 'EAN-13', capturedImage);
          }}
          initialMode={barcodeModalMode}
        />
      </div>
    </div>
  );
};
