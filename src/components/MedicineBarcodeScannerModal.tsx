import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  X,
  Zap,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  FileText,
  Volume2
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { createBarcodeReader, formatName } from '../utils/barcodeScanner';
import { MedicineInfo, Language } from '../types';
import { VERIFIED_MEDICINE_DATABASE } from '../data/medicineDatabase';

interface MedicineBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicineSelected: (medicine: MedicineInfo) => void;
  language?: Language;
}

export const MedicineBarcodeScannerModal: React.FC<MedicineBarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onMedicineSelected,
  language = 'en',
}) => {
  // Scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  // Barcode detection and lifecycle status
  // scanning: actively looking for real barcode
  // detected: real barcode decoded, locked, green animation
  // fetching: calling /api/medicine-lookup/:barcode
  // success: medicine found and confirmed
  // not_found: barcode detected but not cataloged in medicine database
  const [scanState, setScanState] = useState<'scanning' | 'detected' | 'fetching' | 'success' | 'not_found'>('scanning');
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [barcodeFormat, setBarcodeFormat] = useState<string>('Barcode');
  const [identifiedMedicine, setIdentifiedMedicine] = useState<MedicineInfo | null>(null);
  const [notFoundMessage, setNotFoundMessage] = useState<string>('');

  // Idle warning state ("⚠️ Barcode not detected")
  const [showNoBarcodeWarning, setShowNoBarcodeWarning] = useState(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const lockRef = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio feedback beep upon successful barcode detection
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz A5 clean chime
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      // Audio context policy or unsupported
    }
  }, []);

  // Stop camera media stream and reset decoding engines
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch {
        // ignore
      }
      codeReaderRef.current = null;
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

  // Start Camera and Real Barcode Detection loop
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScanState('scanning');
    setDetectedBarcode(null);
    setIdentifiedMedicine(null);
    setShowNoBarcodeWarning(false);
    lockRef.current = false;

    // After 3.5 seconds of searching without a barcode detected, trigger the explicit warning
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!lockRef.current) {
        setShowNoBarcodeWarning(true);
      }
    }, 3500);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this browser device.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      // Check if camera supports torch
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

      // Initialize Dual-Engine Barcode Detection (Native BarcodeDetector + ZXing MultiFormatReader)
      initiateBarcodeDetection();
    } catch (err: any) {
      console.warn('Medicine camera initialization error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access permission was denied. Please allow camera permissions or test with verified medicine barcodes below.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No active video camera found on this device.');
      } else {
        setCameraError(err.message || 'Unable to access live camera feed.');
      }
    }
  }, [facingMode, stopCamera]);

  // Dual-Engine continuous detection
  const initiateBarcodeDetection = () => {
    if (!videoRef.current) return;

    // Engine 1: Native Hardware-Accelerated BarcodeDetector (Android Chrome, Desktop Chrome, Safari 17+)
    let nativeDetector: any = null;
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        // Support all standard packaging barcode formats specified by user
        nativeDetector = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'data_matrix'],
        });
      } catch (e) {
        nativeDetector = null;
      }
    }

    const checkNativeFrame = async () => {
      if (lockRef.current) return;

      if (nativeDetector && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const barcodes = await nativeDetector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0 && !lockRef.current) {
            const match = barcodes[0];
            const text = match.rawValue?.trim();
            if (text && text.length >= 4) {
              const fmt = match.format ? match.format.toUpperCase().replace('_', '-') : 'EAN-13';
              handleBarcodeSuccess(text, fmt);
              return;
            }
          }
        } catch {
          // Native frame skipped or unsupported format
        }
      }

      if (!lockRef.current) {
        animFrameRef.current = requestAnimationFrame(checkNativeFrame);
      }
    };

    if (nativeDetector) {
      animFrameRef.current = requestAnimationFrame(checkNativeFrame);
    }

    // Engine 2: ZXing MultiFormatReader running on the video element simultaneously
    try {
      const reader = createBarcodeReader();
      codeReaderRef.current = reader;

      reader.decodeFromVideoElement(videoRef.current, (result) => {
        if (result && !lockRef.current) {
          const rawText = result.getText()?.trim();
          if (rawText && rawText.length >= 4) {
            const fmt = formatName(result.getBarcodeFormat());
            handleBarcodeSuccess(rawText, fmt);
          }
        }
      });
    } catch (zxErr) {
      console.warn('ZXing video decoder attachment warning:', zxErr);
    }
  };

  // STEP 7: When a valid barcode is detected:
  // - Freeze/lock the detected barcode value
  // - Show green scanning animation
  // - Display: "✓ Barcode Detected" + "Barcode: XXXXXXXX"
  // - STEP 8: Only after barcode detection, call the medicine/product API
  const handleBarcodeSuccess = async (barcodeText: string, format: string) => {
    if (lockRef.current) return;
    lockRef.current = true;

    // Freeze video feed
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // ignore
      }
    }

    // Audio chime
    playBeep();

    // Lock detected values and trigger green celebratory animation
    setDetectedBarcode(barcodeText);
    setBarcodeFormat(format);
    setScanState('detected');
    setShowNoBarcodeWarning(false);

    // Wait 750ms so user clearly sees the "✓ Barcode Detected" green animation & locked barcode
    setTimeout(async () => {
      setScanState('fetching');

      try {
        // Call backend medicine lookup API
        const response = await fetch(`/api/medicine-lookup/${encodeURIComponent(barcodeText)}`);
        let medicine: MedicineInfo | null = null;

        if (response.ok) {
          const data = await response.json();
          if (data.found && data.medicine) {
            medicine = data.medicine;
          }
        }

        // Fallback to local verified database if network failure or local match
        if (!medicine) {
          const localMatch = VERIFIED_MEDICINE_DATABASE.find(
            (m) => m.barcode.trim() === barcodeText.trim() || barcodeText.includes(m.barcode)
          );
          if (localMatch) {
            medicine = localMatch;
          }
        }

        if (medicine) {
          setIdentifiedMedicine(medicine);
          setScanState('success');
        } else {
          setNotFoundMessage(`Barcode ${barcodeText} was read accurately, but is not registered in the CDSCO Verified Medicine Database.`);
          setScanState('not_found');
        }
      } catch (err) {
        // Check local DB as fallback
        const localMatch = VERIFIED_MEDICINE_DATABASE.find(
          (m) => m.barcode.trim() === barcodeText.trim() || barcodeText.includes(m.barcode)
        );
        if (localMatch) {
          setIdentifiedMedicine(localMatch);
          setScanState('success');
        } else {
          setNotFoundMessage(`Barcode ${barcodeText} was detected, but could not be verified against the pharmacopoeia registry.`);
          setScanState('not_found');
        }
      }
    }, 750);
  };

  // Toggle Camera Facing Mode (rear <-> front)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch Light if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const next = !torchEnabled;
        await videoTrack.applyConstraints({
          advanced: [{ torch: next } as any],
        });
        setTorchEnabled(next);
      } catch (e) {
        console.warn('Torch control not supported on this device/browser');
      }
    }
  };

  // Reset and resume scanning
  const resumeScanning = () => {
    lockRef.current = false;
    setDetectedBarcode(null);
    setIdentifiedMedicine(null);
    setScanState('scanning');
    setShowNoBarcodeWarning(false);
    if (videoRef.current) {
      try {
        videoRef.current.play();
      } catch {
        // ignore
      }
    }
    // Re-arm warning timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!lockRef.current) {
        setShowNoBarcodeWarning(true);
      }
    }, 3500);
  };

  // Select verified medicine and proceed to safety analysis
  const proceedWithMedicine = (med: MedicineInfo) => {
    stopCamera();
    onMedicineSelected(med);
    onClose();
  };

  // Start camera on modal open and cleanup on modal close
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Scan Medicine Barcode</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800">
                  REAL BARCODE ONLY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Point camera at the striped EAN/UPC/Code-128 barcode or QR code
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close barcode scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Required Instruction Text */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-center space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-teal-300 tracking-wide">
            "Barcode ko frame ke andar dikhaye"
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-medium">
            "Medicine ka barcode camera ke saamne rakhein"
          </div>
        </div>

        {/* Camera Live Viewfinder Container */}
        <div className="relative aspect-[4/3] sm:aspect-video bg-black rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center">
          
          {/* Active Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Viewfinder Target Reticle Frame */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div
              className={`w-72 h-44 sm:w-80 sm:h-48 rounded-2xl relative transition-all duration-300 ${
                scanState === 'detected' || scanState === 'fetching' || scanState === 'success'
                  ? 'border-4 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)] bg-emerald-500/10'
                  : 'border-2 border-dashed border-teal-400/90 shadow-2xl bg-teal-500/5'
              }`}
            >
              {/* Corner Brackets */}
              <div className={`absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 rounded-tl-lg ${scanState === 'detected' ? 'border-emerald-400' : 'border-teal-300'}`} />
              <div className={`absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 rounded-tr-lg ${scanState === 'detected' ? 'border-emerald-400' : 'border-teal-300'}`} />
              <div className={`absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 rounded-bl-lg ${scanState === 'detected' ? 'border-emerald-400' : 'border-teal-300'}`} />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 rounded-br-lg ${scanState === 'detected' ? 'border-emerald-400' : 'border-teal-300'}`} />

              {/* Scanning Laser Line Animation */}
              {scanState === 'scanning' && (
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] animate-[scanLaser_2.2s_ease-in-out_infinite]" />
              )}

              {/* GREEN Scanning Animation when detected */}
              {(scanState === 'detected' || scanState === 'fetching' || scanState === 'success') && (
                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#34d399] animate-pulse top-1/2 -translate-y-1/2" />
              )}

              {/* Reticle Central Guide Label */}
              <div className="absolute -top-7 inset-x-0 text-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                    scanState === 'detected' || scanState === 'fetching' || scanState === 'success'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-black/75 text-teal-300 border border-teal-500/50'
                  }`}
                >
                  {scanState === 'detected' || scanState === 'fetching' || scanState === 'success'
                    ? '✓ BARCODE LOCKED'
                    : 'ALIGN MEDICINE BARCODE'}
                </span>
              </div>
            </div>
          </div>

          {/* Camera Controls Overlay (Torch & Flip) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {torchSupported && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-xl backdrop-blur-md border transition cursor-pointer ${
                  torchEnabled
                    ? 'bg-amber-500/90 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                }`}
                title="Toggle Torch Light"
              >
                <Zap className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleFacingMode}
              className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/20 hover:bg-black/80 transition cursor-pointer"
              title="Switch Camera (Rear / Front)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Error Message Overlay */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/95 p-5 flex flex-col items-center justify-center text-center space-y-3 z-20">
              <AlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-300">Camera Device Access Notice</p>
                <p className="text-[11px] text-slate-300 max-w-xs">{cameraError}</p>
              </div>
              <button
                onClick={startCamera}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* STEP 7 & 8: Barcode Detected Success State Display */}
        {(scanState === 'detected' || scanState === 'fetching') && detectedBarcode && (
          <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500/90 rounded-2xl space-y-2 shadow-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
                <span className="text-sm font-black text-emerald-300 tracking-tight">
                  ✓ Barcode Detected
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900 text-emerald-200 border border-emerald-700">
                {barcodeFormat}
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-white bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-800/80 flex items-center justify-between">
              <span>Barcode:</span>
              <span className="text-emerald-300 tracking-wider text-sm">{detectedBarcode}</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Querying verified pharmacopoeia registry for clinical details...</span>
            </p>
          </div>
        )}

        {/* STEP 9 & 10: Medicine Found & Verified Card */}
        {scanState === 'success' && identifiedMedicine && (
          <div className="p-4 bg-slate-800/90 border-2 border-teal-500 rounded-2xl space-y-3 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Verified Medicine Identified</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {identifiedMedicine.name}
                </h4>
                <p className="text-xs text-slate-300">
                  {identifiedMedicine.activeIngredient} • {identifiedMedicine.strength}
                </p>
              </div>
              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-700 shrink-0">
                {identifiedMedicine.schedule}
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/80 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Manufacturer:</span>
                <span className="text-slate-200 font-semibold">{identifiedMedicine.manufacturer}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="text-slate-200 font-semibold">{identifiedMedicine.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barcode:</span>
                <span className="font-mono text-teal-300 font-bold">{identifiedMedicine.barcode}</span>
              </div>
            </div>

            <button
              onClick={() => proceedWithMedicine(identifiedMedicine)}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-teal-500/30 transition cursor-pointer"
            >
              <span>Continue to Safety Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NOT FOUND State */}
        {scanState === 'not_found' && (
          <div className="p-4 bg-amber-950/80 border border-amber-500/60 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Medicine Barcode Unregistered in Local Prototype</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {notFoundMessage}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={resumeScanning}
                className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Scan Another Barcode
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition cursor-pointer"
              >
                Search Manually
              </button>
            </div>
          </div>
        )}

        {/* VERY IMPORTANT VALIDATION:
            IF NO BARCODE IS DETECTED:
            Show "⚠️ Barcode not detected"
            "Please place the medicine barcode inside the scanning frame."
            IF USER SHOWS ONLY THE MEDICINE FRONT/BACK:
            Do NOT treat it as a successful scan. */}
        {scanState === 'scanning' && showNoBarcodeWarning && (
          <div className="p-3 bg-amber-500/15 border border-amber-500/50 rounded-2xl space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>⚠️ Barcode not detected</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-snug">
              Please place the medicine barcode inside the scanning frame.
            </p>
            <p className="text-[10px] text-slate-400">
              Note: Medicine strip photos, front logos, or tablet shapes are strictly rejected. Please flip the medicine strip to reveal the printed barcode lines.
            </p>
          </div>
        )}

        {/* Presets for Testing & Instant Demonstration */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Test Medicine Barcodes (1-Click Test):
            </span>
            <span className="text-[10px] text-teal-400 font-medium">
              EAN-13 / GS1 Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {VERIFIED_MEDICINE_DATABASE.slice(0, 6).map((med) => (
              <button
                key={med.id}
                type="button"
                onClick={() => {
                  handleBarcodeSuccess(med.barcode, 'EAN-13');
                }}
                className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/50 text-left transition flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white group-hover:text-teal-300 transition truncate block">
                    {med.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {med.activeIngredient} ({med.strength})
                  </span>
                </div>
                <span className="font-mono text-[10px] text-teal-400 bg-black/40 px-1.5 py-0.5 rounded border border-slate-700 shrink-0 font-bold">
                  {med.barcode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>CDSCO & Indian Pharmacopoeia Guidelines</span>
          </span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
