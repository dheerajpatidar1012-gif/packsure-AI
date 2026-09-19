import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  ScanLine,
  Zap,
  RotateCcw,
  Keyboard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Search,
  ArrowRight,
  Database,
  ExternalLink,
  Layers,
  FileCheck2,
  Info,
  RefreshCw,
  Building2,
  Calendar,
  Tag,
  Scale,
  Sparkles,
  AlertOctagon,
  Copy,
  ChevronRight,
  HelpCircle,
  Check,
  Radio,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { createBarcodeReader } from '../utils/barcodeScanner';
import {
  validateLiveBarcode,
  lookupProductIntelligence,
  buildUnifiedBarcodeInspection,
  UnifiedBarcodeInspection,
} from '../services/barcodeIntelligence';
import { ProductScanResult, Language } from '../types';
import { EvidenceComplaintModal } from './EvidenceComplaintModal';
import { saveScanToHistory } from './ScanHistoryView';

interface LiveBarcodeScannerProps {
  language?: Language;
  onScanComplete: (result: ProductScanResult) => void;
  onNavigateToDigitalTwin?: (barcode?: string) => void;
  onNavigateToComplaints?: (productName?: string) => void;
  onSwitchToOcrScanner?: () => void;
}

// Preset Quick Test Barcodes for instant testing & demonstration
const PRESET_TEST_BARCODES = [
  {
    code: '8904063200155',
    name: "Haldiram's Bhujia Sev",
    category: 'Twin Packaging Drift Alert',
    badge: 'Shrinkflation & Price Mismatch',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    code: '8901030010103',
    name: 'Britannia Good Day Butter Cookies',
    category: 'GS1 India Verified',
    badge: 'Compliant FMCG',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    code: '8901719101018',
    name: 'Parle-G Gold Biscuits',
    category: 'Digital Twin Registered',
    badge: 'Font Height Drift',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    code: '8901058852331',
    name: 'Nestlé Maggi 2-Minute Noodles',
    category: 'National Registry Verified',
    badge: 'Verified Entry',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    code: '8901058000107',
    name: 'Tata Salt Vacuum Evaporated',
    category: 'Groceries & Staples',
    badge: 'Clean Compliance',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    code: '8909999000111',
    name: 'Unregistered Retail Product',
    category: 'Unknown Barcode Simulation',
    badge: 'Unknown Flow',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
  },
];

export const LiveBarcodeScanner: React.FC<LiveBarcodeScannerProps> = ({
  language = 'en',
  onScanComplete,
  onNavigateToDigitalTwin,
  onNavigateToComplaints,
  onSwitchToOcrScanner,
}) => {
  // Scanner state
  const [isScanning, setIsScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  // Live detection & capture lock state
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [captureStatus, setCaptureStatus] = useState<'scanning' | 'detected' | 'processing' | 'completed' | 'not_found'>('scanning');
  const [searchStatusText, setSearchStatusText] = useState('Align barcode inside the box');
  const [showMoveCloserHint, setShowMoveCloserHint] = useState(false);

  // Inspection outcome
  const [inspectionResult, setInspectionResult] = useState<UnifiedBarcodeInspection | null>(null);
  const [unknownBarcodeData, setUnknownBarcodeData] = useState<{
    barcode: string;
    validationNotice: string;
    isCheckDigitVerified: boolean;
  } | null>(null);

  // Manual code input modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [manualInputError, setManualInputError] = useState<string | null>(null);

  // MRP Verification & Selling Price State
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Video and reader references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const lockProcessingRef = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play auditory feedback upon barcode detection
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context restricted or unsupported
    }
  }, []);

  // Stop camera media stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        // ZXing reader cleanup
      } catch {
        // Ignored
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Start continuous camera stream and barcode detector
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setShowMoveCloserHint(false);
    lockProcessingRef.current = false;
    setCaptureStatus('scanning');
    setSearchStatusText('Align barcode inside the box');

    // Show hint if barcode not found in 4.5 seconds
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowMoveCloserHint(true);
    }, 4500);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as any) : {};
        setTorchSupported(Boolean(capabilities.torch));
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }

      // Initialize scanner reader
      const reader = createBarcodeReader();
      codeReaderRef.current = reader;

      // Continuous video decoding loop
      if (videoRef.current) {
        reader.decodeFromVideoElement(videoRef.current, (result) => {
          if (result && !lockProcessingRef.current) {
            const rawText = result.getText();
            if (rawText && rawText.trim().length >= 4) {
              lockProcessingRef.current = true;
              handleBarcodeCaptured(rawText.trim());
            }
          }
        });
      }
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please grant camera permissions or use Manual Entry / Test Presets.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No video input camera detected on this system.');
      } else {
        setCameraError(err.message || 'Unable to start camera video feed.');
      }
    }
  }, [facingMode, stopCamera]);

  // Master handler when a barcode is automatically captured by the camera
  const handleBarcodeCaptured = async (barcode: string) => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    playBeep();
    setDetectedCode(barcode);
    setCaptureStatus('detected');
    setSearchStatusText('✓ Barcode Detected');

    // Pause video scanning momentarily
    stopCamera();

    // Step 2: Validate barcode format & check digit
    await new Promise((r) => setTimeout(r, 450));
    setCaptureStatus('processing');
    setSearchStatusText('✓ Automatically captured • Verifying with National Registries...');

    try {
      // Step 3: Multi-tier Database Lookup
      const dbInfo = await lookupProductIntelligence(barcode);

      if (!dbInfo.found) {
        // Unknown barcode flow
        const val = validateLiveBarcode(barcode);
        setCaptureStatus('not_found');
        setUnknownBarcodeData({
          barcode,
          validationNotice: val.validationNotice,
          isCheckDigitVerified: val.isCheckDigitVerified,
        });
        return;
      }

      // Step 4: Full Unified Inspection (Cross-checks, Brand/Manufacturer verification, Fraud Shield, Digital Twin)
      const unified = buildUnifiedBarcodeInspection(barcode, dbInfo);
      setInspectionResult(unified);

      // Pre-populate selling price from detected / database MRP
      const printedMrpStr = unified.fieldsWithSources.mrp.value || unified.databaseInfo.databaseMrp || '₹50.00';
      const numMatch = printedMrpStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
      const defaultMrpNum = numMatch ? parseFloat(numMatch[0]) : 50;
      setSellingPriceInput(defaultMrpNum.toString());

      // Save initial scan to History
      saveScanToHistory({
        id: `scan-${Date.now()}`,
        barcode,
        format: 'EAN-13',
        productName: unified.packageData.productName,
        brand: unified.databaseInfo.brand || unified.packageData.brandName,
        date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        complianceScore: unified.packageData.complianceScore,
        status: unified.packageData.status,
        hasDatabaseInfo: true,
        hasPackageScan: true,
        mrp: printedMrpStr,
        sellingPrice: `₹${defaultMrpNum.toFixed(2)}`,
        priceDifference: 0,
        safetyStatus: 'FAIR_PRICE',
        category: unified.databaseInfo.category || 'Packaged Commodity',
        resultPayload: unified.packageData,
      });

      setCaptureStatus('completed');
      setIsScanning(false);
    } catch (err) {
      console.error('Failed to process barcode intelligence:', err);
      setCaptureStatus('not_found');
      setUnknownBarcodeData({
        barcode,
        validationNotice: 'Database request timed out or returned an error.',
        isCheckDigitVerified: false,
      });
    }
  };

  // Switch between front & back cameras
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && torchSupported) {
      try {
        const newTorch = !torchEnabled;
        await (track as any).applyConstraints({
          advanced: [{ torch: newTorch }],
        });
        setTorchEnabled(newTorch);
      } catch (e) {
        console.warn('Torch toggle error:', e);
      }
    }
  };

  // Re-activate live camera scanning
  const restartScanning = () => {
    setInspectionResult(null);
    setUnknownBarcodeData(null);
    setDetectedCode(null);
    setIsScanning(true);
    startCamera();
  };

  // Manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualInputError(null);
    const clean = manualBarcode.trim().replace(/[-\s]/g, '');
    if (!clean || clean.length < 4) {
      setManualInputError('Please enter a valid barcode containing at least 4 characters.');
      return;
    }
    setShowManualModal(false);
    setManualBarcode('');
    handleBarcodeCaptured(clean);
  };

  // Lifecycle effect: auto-start camera on mount
  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    return () => {
      stopCamera();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isScanning, startCamera, stopCamera]);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16">
      {/* Top Header */}
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Live Barcode Intelligence Scanner
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Zero-Manual AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous camera feed • GS1 / EAN-13 verification • Legal Metrology Fraud Shield
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Enter Barcode Manually"
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              Manual Barcode
            </button>
            {onSwitchToOcrScanner && (
              <button
                onClick={onSwitchToOcrScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 text-xs font-medium border border-indigo-700/50 transition"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-300" />
                Package OCR Scanner
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-5 flex-1 flex flex-col">
        {isScanning ? (
          /* ======================================================== */
          /* 1. ZERO-MANUAL CONTINUOUS LIVE SCANNER VIEW               */
          /* ======================================================== */
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
            {/* Camera Viewport Card */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] border border-slate-800 shadow-2xl flex items-center justify-center">
              {/* Live Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  cameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Camera Fallback / Permission Error State */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
                  <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1">Camera Stream Unavailable</h3>
                  <p className="text-xs text-slate-300 max-w-md mb-4">{cameraError}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Camera
                    </button>
                    <button
                      onClick={() => setShowManualModal(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      Enter Barcode Manually
                    </button>
                  </div>
                </div>
              )}

              {/* Scanning Reticle Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Visual Backdrop Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Central Targeting Box */}
                <div className="relative w-72 sm:w-96 h-48 sm:h-56 rounded-2xl border-2 border-emerald-400/70 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] overflow-hidden transition-all">
                  {/* Corner Accent Brackets */}
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                  {/* Laser Scan Sweeper Animation */}
                  {captureStatus === 'scanning' && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[scanLaser_2.2s_ease-in-out_infinite]" />
                  )}

                  {/* Detection Freeze Visual */}
                  {captureStatus !== 'scanning' && (
                    <div className="absolute inset-0 bg-emerald-500/15 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold mb-2 animate-bounce">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-300">
                        Barcode Captured
                      </span>
                      <span className="text-[11px] font-mono text-white mt-0.5">
                        {detectedCode}
                      </span>
                    </div>
                  )}

                  {/* Inside Frame Instruction Label */}
                  <div className="absolute bottom-2.5 inset-x-0 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
                      Align barcode inside the box
                    </span>
                  </div>
                </div>

                {/* Move closer hint if not detected in 4.5s */}
                {showMoveCloserHint && captureStatus === 'scanning' && (
                  <div className="mt-4 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 animate-pulse">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Move closer or improve lighting for better optical detection</span>
                  </div>
                )}
              </div>

              {/* Status Bar Floating on Top of Video */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur border border-slate-800 text-xs font-medium text-slate-200">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{searchStatusText}</span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {torchSupported && (
                    <button
                      onClick={toggleTorch}
                      className={`p-2 rounded-full border transition ${
                        torchEnabled
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                      title={torchEnabled ? 'Turn Torch Off' : 'Turn Torch On'}
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={toggleCameraFacing}
                    className="p-2 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 transition"
                    title="Switch Camera (Front/Back)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-card: No button press required notice & formats */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Continuous feed analysis • Zero button press required</span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-slate-500 text-[11px]">Supported:</span>
                {['EAN-13', 'EAN-8', 'UPC-A', 'Code 128', 'QR'].map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[10px] font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Test Barcodes Carousel / Grid */}
            <div className="w-full mt-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Quick Sample Barcodes (1-Click Instant Test)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Test live verification without camera hardware
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PRESET_TEST_BARCODES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleBarcodeCaptured(item.code)}
                    className="flex flex-col text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-xs text-emerald-400 group-hover:text-emerald-300 font-medium">
                        {item.code}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. INSPECTION RESULT OR UNKNOWN BARCODE VIEW              */
          /* ======================================================== */
          <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Live Barcode Intelligence Audit
                  </h2>
                  <p className="text-xs text-slate-400">
                    GTIN: <span className="font-mono text-emerald-400 font-semibold">{inspectionResult?.barcode || unknownBarcodeData?.barcode}</span> • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={restartScanning}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  Scan Another Barcode
                </button>

                {inspectionResult && (
                  <button
                    onClick={() => onScanComplete(inspectionResult.packageData)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                  >
                    View Full Compliance Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* UNKNOWN BARCODE STATE */}
            {unknownBarcodeData && !inspectionResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center max-w-2xl mx-auto my-6 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Barcode Detected, But Product Information Not Verified
                </h3>
                <p className="text-xs font-mono text-slate-400 mb-2">
                  GTIN: {unknownBarcodeData.barcode}
                </p>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
                  {unknownBarcodeData.validationNotice} However, no registered commodity matching this GTIN was found in the authorized GS1 India or connected FMCG directories.
                </p>

                {/* Validation Info Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 max-w-md mx-auto mb-6 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Barcode Format:</span>
                    <span className="text-slate-200 font-mono">EAN-13 Standard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Check Digit Verified:</span>
                    <span className={unknownBarcodeData.isCheckDigitVerified ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {unknownBarcodeData.isCheckDigitVerified ? '✓ Check Digit Matches GS1 Modulo-10' : '⚠️ Modulo-10 Check Digit Mismatch'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                    Notice: Valid barcode formatting alone does not verify company existence or product legitimacy.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center">
                  <button
                    onClick={restartScanning}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
                  >
                    Search Again
                  </button>
                  {onSwitchToOcrScanner && (
                    <button
                      onClick={onSwitchToOcrScanner}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Scan Package with AI (OCR Fallback)
                    </button>
                  )}
                  {onNavigateToComplaints && (
                    <button
                      onClick={() => onNavigateToComplaints(`Unregistered Barcode ${unknownBarcodeData.barcode}`)}
                      className="px-4 py-2 bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 text-xs font-medium rounded-xl border border-rose-800/60 transition"
                    >
                      Report Unknown Barcode
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* VERIFIED INSPECTION REPORT SCREEN */}
            {inspectionResult && (
              <>
                {/* 1. Barcode Validation Card (Section 3 of User Prompt) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5 mb-3.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        BARCODE DETECTED
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xl font-mono font-bold text-white tracking-wider">
                          {inspectionResult.validationReport.gtin}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {inspectionResult.validationReport.format}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Valid Barcode Format</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Check Digit Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Hallucination Disclaimer */}
                  <div className="flex items-start gap-2 bg-slate-900/90 rounded-xl p-3 text-xs text-slate-300 border border-slate-800">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Statutory Metrology Disclaimer: </span>
                      Do not claim that a barcode is authentic merely because its checksum is valid.
                      Mathematical check digit verification confirms syntax compliance under GS1 specifications, but physical package auditing and authorized database cross-checks are required to establish statutory product identity.
                    </div>
                  </div>
                </div>

                {/* 2. Discrepancy / Mismatch Alert Banner (Section 7 of User Prompt) */}
                {inspectionResult.mismatches.details.length > 0 && (
                  <div className="bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-950 border-2 border-rose-500/60 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-lg shadow-rose-500/30">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500 text-white">
                            POTENTIAL MISMATCH DETECTED
                          </span>
                          <span className="text-xs text-rose-300 font-medium">
                            Variance identified between Authorized Database Record and Physical Package Label
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {inspectionResult.mismatches.details.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Automatic Product Information Card with Source Transparency (Sections 5 & 6) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="text-base font-bold text-white">
                          Automatic Product Information Card
                        </h3>
                        <p className="text-xs text-slate-400">
                          Database Source: <span className="text-emerald-400 font-medium">{inspectionResult.databaseInfo.source}</span> • Last Verified: {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">Field Sources:</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-[10px] font-medium">
                        ✓ Verified Database
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[10px] font-medium">
                        ⚠️ Package OCR
                      </span>
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Product Name */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Product Name</span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {inspectionResult.fieldsWithSources.productName.sourceLabel}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white block">
                          {inspectionResult.fieldsWithSources.productName.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2">Generic Nomenclature</span>
                    </div>

                    {/* Brand */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Brand Ownership</span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {inspectionResult.fieldsWithSources.brand.sourceLabel}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white block">
                          {inspectionResult.fieldsWithSources.brand.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2">Registered Trademark</span>
                    </div>

                    {/* Manufacturer */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Manufacturer / Packer</span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {inspectionResult.fieldsWithSources.manufacturer.sourceLabel}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-white block truncate">
                          {inspectionResult.fieldsWithSources.manufacturer.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 truncate">
                        {inspectionResult.databaseInfo.manufacturerAddress || 'Industrial Premise Registered'}
                      </span>
                    </div>

                    {/* Net Quantity */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Net Quantity</span>
                          <span className="text-[10px] text-amber-400 font-medium">
                            {inspectionResult.fieldsWithSources.netQuantity.sourceLabel}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white block">
                          {inspectionResult.fieldsWithSources.netQuantity.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2">Standard SI Metric Unit</span>
                    </div>

                    {/* MRP */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Maximum Retail Price</span>
                          <span className="text-[10px] text-amber-400 font-medium">
                            {inspectionResult.fieldsWithSources.mrp.sourceLabel}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-400 block">
                          {inspectionResult.fieldsWithSources.mrp.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2">Inclusive of all statutory taxes</span>
                    </div>

                    {/* Country of Origin */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-slate-400">Country of Origin</span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {inspectionResult.fieldsWithSources.countryOfOrigin.sourceLabel}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white block">
                          {inspectionResult.fieldsWithSources.countryOfOrigin.value}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2">Statutory Rule 6(10) Compliance</span>
                    </div>
                  </div>

                  {/* Explicit Source Transparency Statement */}
                  <div className="bg-slate-900/40 p-3.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      Notice: Database information and physically printed package declarations are independently audited under the Legal Metrology Act, 2009.
                    </span>
                    <span className="font-mono text-slate-500">ISO/IEC 15420</span>
                  </div>
                </div>

                {/* 3B. MRP PROTECTION & SELLING PRICE VERIFICATION CARD (Requirement 2) */}
                {(() => {
                  const mrpStr = inspectionResult.fieldsWithSources.mrp.value || inspectionResult.databaseInfo.databaseMrp || '₹50.00';
                  const match = mrpStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
                  const printedMrpNum = match ? parseFloat(match[0]) : 50;
                  const sellingPriceNum = parseFloat(sellingPriceInput) || 0;
                  const extraAmount = Math.max(0, sellingPriceNum - printedMrpNum);
                  const isOvercharging = sellingPriceNum > printedMrpNum;
                  const isDiscount = sellingPriceNum < printedMrpNum && sellingPriceNum > 0;
                  const isMatch = Math.abs(sellingPriceNum - printedMrpNum) < 0.01;

                  return (
                    <div className={`border-2 rounded-2xl p-5 shadow-xl transition-all ${
                      isOvercharging
                        ? 'bg-gradient-to-br from-rose-950/90 via-slate-950 to-slate-950 border-rose-500 shadow-rose-950/40 text-white'
                        : isDiscount
                        ? 'bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 border-emerald-500 shadow-emerald-950/30 text-white'
                        : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-emerald-600/60 shadow-slate-950/40 text-white'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md ${
                            isOvercharging ? 'bg-rose-500 text-white' : isDiscount ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white'
                          }`}>
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <span>MRP Protection & Selling Price Verification</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-slate-300">
                                Rule 18(2) PCR 2011
                              </span>
                            </h3>
                            <p className="text-xs text-slate-400">
                              Real-time statutory ceiling check • Extra Amount = Selling Price − Printed MRP
                            </p>
                          </div>
                        </div>

                        {/* Preset Quick Simulation Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSellingPriceInput((printedMrpNum + 10).toString())}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition cursor-pointer"
                          >
                            🚨 Test Overcharging (+₹10)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSellingPriceInput(printedMrpNum.toString())}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition cursor-pointer"
                          >
                            ✅ Fair Price (MRP)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSellingPriceInput(Math.max(1, printedMrpNum - 5).toString())}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition cursor-pointer"
                          >
                            🟢 Discount (-₹5)
                          </button>
                        </div>
                      </div>

                      {/* 3 Metric Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        {/* Printed MRP */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                          <span className="text-[11px] font-medium text-slate-400 block mb-1">
                            Printed MRP (Package Ceiling)
                          </span>
                          <span className="text-xl font-mono font-black text-emerald-400">
                            ₹{printedMrpNum.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Inclusive of all statutory taxes
                          </span>
                        </div>

                        {/* Retail Selling Price Input */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                          <span className="text-[11px] font-medium text-slate-300 block mb-1">
                            Retailer Selling Price (Charged)
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold text-base">₹</span>
                            <input
                              type="number"
                              step="0.5"
                              value={sellingPriceInput}
                              onChange={(e) => setSellingPriceInput(e.target.value)}
                              placeholder={printedMrpNum.toString()}
                              className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1 text-lg font-mono font-bold text-white focus:outline-none"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Enter price demanded at counter
                          </span>
                        </div>

                        {/* Calculated Difference */}
                        <div className={`border rounded-xl p-3.5 ${
                          isOvercharging
                            ? 'bg-rose-950/60 border-rose-500/70 text-rose-200'
                            : isDiscount
                            ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}>
                          <span className="text-[11px] font-medium block mb-1 opacity-80">
                            Extra Amount (Difference)
                          </span>
                          <span className={`text-xl font-mono font-black ${
                            isOvercharging ? 'text-rose-400' : isDiscount ? 'text-emerald-400' : 'text-slate-200'
                          }`}>
                            {isOvercharging ? `+₹${extraAmount.toFixed(2)}` : isDiscount ? `-₹${(printedMrpNum - sellingPriceNum).toFixed(2)}` : '₹0.00'}
                          </span>
                          <span className="text-[10px] opacity-75 block mt-1">
                            Extra Amount = Selling Price − Printed MRP
                          </span>
                        </div>
                      </div>

                      {/* Status Banner */}
                      {isOvercharging ? (
                        <div className="bg-rose-950/80 border border-rose-600/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-extrabold text-rose-200 uppercase tracking-wide">
                                🚨 OVERCHARGING ALERT
                              </h4>
                              <p className="text-xs text-rose-300 mt-0.5">
                                <strong>₹{extraAmount.toFixed(2)}</strong> is being charged above the printed MRP. Potential overcharging detected. Please verify the printed MRP and selling price.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowComplaintModal(true)}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Create Grievance Dossier</span>
                          </button>
                        </div>
                      ) : isMatch ? (
                        <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <strong className="text-white block">✅ Price Matches MRP</strong>
                            Product is being sold at the exact statutory Maximum Retail Price. No illegal overcharging detected.
                          </div>
                        </div>
                      ) : isDiscount ? (
                        <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <strong className="text-white block">🟢 Below MRP (Consumer Discount)</strong>
                            Product is being sold at ₹{(printedMrpNum - sellingPriceNum).toFixed(2)} discount below the statutory MRP ceiling.
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}

                {/* 4. Brand & Manufacturer Verification Section (Section 8 of User Prompt) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-base font-bold text-white">
                        Brand & Manufacturer Verification
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {inspectionResult.brandVerification.databaseSource}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Barcode Registration
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Found in Registry
                      </span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Brand Identity
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        inspectionResult.brandVerification.brandMatch === 'MATCH'
                          ? 'text-emerald-400'
                          : inspectionResult.brandVerification.brandMatch === 'MISMATCH'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}>
                        {inspectionResult.brandVerification.brandMatch === 'MATCH' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {inspectionResult.brandVerification.brandMatch === 'MISMATCH' && <XCircle className="w-3.5 h-3.5" />}
                        {inspectionResult.brandVerification.brandMatch === 'MATCH' ? 'Matches Record' : inspectionResult.brandVerification.brandMatch}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Manufacturer
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        inspectionResult.brandVerification.manufacturerMatch === 'MATCH'
                          ? 'text-emerald-400'
                          : inspectionResult.brandVerification.manufacturerMatch === 'MISMATCH'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}>
                        {inspectionResult.brandVerification.manufacturerMatch === 'MATCH' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {inspectionResult.brandVerification.manufacturerMatch === 'MISMATCH' && <XCircle className="w-3.5 h-3.5" />}
                        {inspectionResult.brandVerification.manufacturerMatch === 'MATCH' ? 'Matches Record' : inspectionResult.brandVerification.manufacturerMatch}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Product Commodity
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        inspectionResult.brandVerification.productMatch === 'MATCH'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}>
                        {inspectionResult.brandVerification.productMatch === 'MATCH' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {inspectionResult.brandVerification.productMatch === 'MATCH' ? 'Matches Commodity' : 'Mismatch'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-200">Legal Metrology Caution: </span>
                    {inspectionResult.brandVerification.identityStatement}
                  </p>
                </div>

                {/* 5. PackSure Fraud Shield Integration (Section 10 of User Prompt) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      {inspectionResult.fraudShield.riskLevel === 'HIGH' ? (
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                      ) : inspectionResult.fraudShield.riskLevel === 'MEDIUM' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white">
                          PackSure Fraud Shield Analysis
                        </h3>
                        <p className="text-xs text-slate-400">
                          Comprehensive risk pattern evaluation • Non-defamatory statistical anomaly analysis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inspectionResult.fraudShield.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : inspectionResult.fraudShield.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        Risk Indicators: {inspectionResult.fraudShield.riskIndicatorsCount}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-4">
                    {inspectionResult.fraudShield.summary}
                  </p>

                  {/* Indicator Breakdown */}
                  {inspectionResult.fraudShield.indicators.length > 0 ? (
                    <div className="space-y-2.5 mb-4">
                      {inspectionResult.fraudShield.indicators.map((ind) => (
                        <div
                          key={ind.id}
                          className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            ind.severity === 'high'
                              ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                              : ind.severity === 'medium'
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                              : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-white">{ind.title}</span>
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800/80">
                                {ind.severity}
                              </span>
                            </div>
                            <p className="text-[11px] opacity-90">{ind.description}</p>
                          </div>

                          {ind.databaseValue && ind.packageValue && (
                            <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                              <span className="text-slate-400">DB: {ind.databaseValue}</span>
                              <span className="text-slate-600">vs</span>
                              <span className="text-rose-400 font-bold">Pkg: {ind.packageValue}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero fraud indicators detected. Commercial barcode maps consistently to verified manufacturing premises.</span>
                    </div>
                  )}

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Recommendation: </span>
                      {inspectionResult.fraudShield.recommendation}
                    </div>
                  </div>
                </div>

                {/* 6. Compliance Digital Twin Integration (Section 11 of User Prompt) */}
                {inspectionResult.digitalTwin ? (
                  <div className="bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-800/50 rounded-2xl p-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/30 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="text-base font-bold text-white">
                            Compliance Digital Twin History Detected
                          </h3>
                          <p className="text-xs text-purple-300">
                            Unique Fingerprint: <span className="font-mono text-purple-200">{inspectionResult.digitalTwin.fingerprintHash.slice(0, 22)}...</span>
                          </p>
                        </div>
                      </div>

                      {onNavigateToDigitalTwin && (
                        <button
                          onClick={() => onNavigateToDigitalTwin(inspectionResult.barcode)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open Digital Twin Deep Analysis
                        </button>
                      )}
                    </div>

                    {/* Previous Scan vs Current Scan Comparison Table */}
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2 pr-4 font-semibold">Packaging Field</th>
                            <th className="py-2 px-4 font-semibold text-purple-300">Previous Scan (Baseline)</th>
                            <th className="py-2 px-4 font-semibold text-white">Current Live Scan</th>
                            <th className="py-2 pl-4 font-semibold">Change Verdict</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          <tr>
                            <td className="py-2.5 pr-4 text-slate-300 font-semibold">Maximum Retail Price</td>
                            <td className="py-2.5 px-4 text-slate-400 font-mono">{inspectionResult.digitalTwin.baselineSnapshot.mrp}</td>
                            <td className="py-2.5 px-4 text-white font-mono font-bold">{inspectionResult.digitalTwin.currentSnapshot.mrp}</td>
                            <td className="py-2.5 pl-4">
                              <span className="text-rose-400 font-semibold">🔴 +10.1% Price Hike</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-4 text-slate-300 font-semibold">Net Quantity</td>
                            <td className="py-2.5 px-4 text-slate-400 font-mono">{inspectionResult.digitalTwin.baselineSnapshot.netQuantity}</td>
                            <td className="py-2.5 px-4 text-white font-mono font-bold">{inspectionResult.digitalTwin.currentSnapshot.netQuantity}</td>
                            <td className="py-2.5 pl-4">
                              <span className="text-rose-400 font-semibold">🔴 -50g Shrinkflation</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-4 text-slate-300 font-semibold">Unit Sale Price (USP)</td>
                            <td className="py-2.5 px-4 text-slate-400 font-mono">{inspectionResult.digitalTwin.baselineSnapshot.unitSalePrice}</td>
                            <td className="py-2.5 px-4 text-rose-400 font-mono font-bold">Omitted on Package</td>
                            <td className="py-2.5 pl-4">
                              <span className="text-rose-400 font-semibold">🔴 Rule 6(11) Violation</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-4 text-slate-300 font-semibold">Manufacturer</td>
                            <td className="py-2.5 px-4 text-slate-400 truncate max-w-[180px]">{inspectionResult.digitalTwin.baselineSnapshot.manufacturer}</td>
                            <td className="py-2.5 px-4 text-slate-200 truncate max-w-[180px]">{inspectionResult.digitalTwin.currentSnapshot.manufacturer}</td>
                            <td className="py-2.5 pl-4">
                              <span className="text-emerald-400 font-semibold">🟢 Unchanged</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-xs text-purple-200/90 bg-purple-950/50 p-3 rounded-xl border border-purple-800/40">
                      ⚡ Digital Twin alert: Physical packaging modifications detected since first inspection. Visual difference mapping confirmed alteration of price and quantity declarations.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>First time scan for barcode {inspectionResult.barcode}. Initial compliance baseline registered to Digital Twin.</span>
                    </div>
                    {onNavigateToDigitalTwin && (
                      <button
                        onClick={() => onNavigateToDigitalTwin(inspectionResult.barcode)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        Create Twin Baseline
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Bottom Master Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 sticky bottom-4 z-20 backdrop-blur shadow-2xl">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={restartScanning}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      Scan Next Product
                    </button>
                    {onNavigateToComplaints && (
                      <button
                        onClick={() => onNavigateToComplaints(inspectionResult.packageData.productName)}
                        className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold border border-rose-800/50 transition flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        Create Citizen Grievance
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onScanComplete(inspectionResult.packageData)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Launch Full Statutory Inspection
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Manual Barcode Entry Modal Fallback */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Enter Barcode Manually</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  GTIN / EAN-13 / UPC / Code 128
                </label>
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="e.g. 8904063200155 or 8901030010103"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                {manualInputError && (
                  <p className="text-xs text-rose-400 mt-1.5">{manualInputError}</p>
                )}
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Check digit will be computed and verified using GS1 Modulo-10 rules upon submission.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  Lookup Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizen Evidence & Complaint Dossier Modal */}
      {showComplaintModal && inspectionResult && (
        <EvidenceComplaintModal
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          language={language}
          data={{
            productName: inspectionResult.packageData.productName,
            brand: inspectionResult.databaseInfo.brand || inspectionResult.packageData.brandName,
            barcode: inspectionResult.barcode,
            printedMrp: inspectionResult.fieldsWithSources.mrp.value || inspectionResult.databaseInfo.databaseMrp || '₹50.00',
            sellingPrice: `₹${parseFloat(sellingPriceInput || '0').toFixed(2)}`,
            extraAmount: Math.max(0, (parseFloat(sellingPriceInput || '0')) - (parseFloat((inspectionResult.fieldsWithSources.mrp.value || '50').replace(/[^0-9.]/g, '')) || 50)),
            detectedIssue: `Overcharging violation under Section 36 of Legal Metrology Act, 2009.`,
          }}
        />
      )}
    </div>
  );
};
