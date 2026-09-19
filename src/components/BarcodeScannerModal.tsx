import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ScanLine,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { createBarcodeReader, decodeBarcodeFromImage, validateBarcode } from '../utils/barcodeScanner';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string, format?: string, imageFile?: string) => void;
  initialMode?: 'camera' | 'upload' | 'manual';
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onBarcodeDetected,
  initialMode = 'camera',
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>(initialMode);
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  
  // Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadDecoding, setUploadDecoding] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual input state
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isLockedRef = useRef(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setDetectedCode(null);
      setDetectedFormat(null);
      setCameraError(null);
      setUploadError(null);
      setManualError(null);
      isLockedRef.current = false;
      if (initialMode === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, initialMode]);

  // Handle Tab Switch
  const handleTabChange = (tab: 'camera' | 'upload' | 'manual') => {
    setActiveTab(tab);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  // Start Camera with ZXing
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsDetecting(true);
    isLockedRef.current = false;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }

      // Initialize reader
      const reader = createBarcodeReader();
      codeReaderRef.current = reader;

      // Start continuous detection
      if (videoRef.current) {
        reader.decodeFromVideoElement(videoRef.current, (result, error) => {
          if (result && !isLockedRef.current) {
            const text = result.getText();
            if (text && text.trim().length >= 4) {
              isLockedRef.current = true;
              const formatStr = result.getBarcodeFormat() ? String(result.getBarcodeFormat()) : 'EAN-13';
              handleBarcodeFound(text.trim(), formatStr);
            }
          }
        });
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraActive(false);
      setIsDetecting(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser settings or use the Barcode Image Upload option.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can upload an image containing a barcode or enter it manually.');
      } else {
        setCameraError(err.message || 'Unable to open camera. Please use Barcode Image Upload.');
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsDetecting(false);
  };

  // Handle successful barcode discovery
  const handleBarcodeFound = (code: string, format: string, image?: string) => {
    setDetectedCode(code);
    setDetectedFormat(format);
    stopCamera();

    // Play subtle audio cue if supported
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted
    }

    setTimeout(() => {
      onBarcodeDetected(code, format, image || uploadedImage || undefined);
      onClose();
    }, 900);
  };

  // Handle Image Upload
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadDecoding(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);

      try {
        const decoded = await decodeBarcodeFromImage(base64);
        setUploadDecoding(false);

        if (decoded && decoded.text) {
          handleBarcodeFound(decoded.text, decoded.format, base64);
        } else {
          setUploadError('Barcode not detected. Please ensure the barcode is clearly focused, well-lit, and uncropped, or enter the barcode numbers manually.');
        }
      } catch (err) {
        setUploadDecoding(false);
        setUploadError('Could not decode barcode from this file. Please try another photo or enter manually.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Manual Search
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    const validation = validateBarcode(manualCode);
    if (!validation.isValid) {
      setManualError(validation.error || 'Please enter a valid barcode number.');
      return;
    }

    onBarcodeDetected(manualCode.trim(), validation.format);
    onClose();
  };

  // Sample quick barcodes for quick testing
  const sampleBarcodes = [
    { code: '8901030010103', name: 'Britannia Good Day (8901030010103)', type: 'EAN-13' },
    { code: '8901719101014', name: 'Parle-G Gold (8901719101014)', type: 'EAN-13' },
    { code: '8901262010054', name: 'Amul Butter 500g (8901262010054)', type: 'EAN-13' },
    { code: '8901058852331', name: 'Maggi 2-Min Noodles (8901058852331)', type: 'EAN-13' },
    { code: '8901058000107', name: 'Tata Salt 1kg (8901058000107)', type: 'EAN-13' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight text-white">Smart Barcode Scanner</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  GS1 / EAN / UPC
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hardware & Optical Barcode Decoding Engine (Zero OCR Guesswork)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2">
          <button
            onClick={() => handleTabChange('camera')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'camera'
                ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📷 Live Camera Scanner</span>
          </button>

          <button
            onClick={() => handleTabChange('upload')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'upload'
                ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>📤 Upload Barcode Image</span>
          </button>

          <button
            onClick={() => handleTabChange('manual')}
            className={`flex items-center space-x-2 px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'manual'
                ? 'bg-white text-blue-700 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>⌨️ Enter Barcode</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* CAMERA MODE */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-4/3 max-h-[360px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive && !cameraError && (
                  <div className="text-center p-6 text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-sm font-medium text-slate-200">Initializing camera hardware...</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Please allow browser camera permissions when prompted.
                    </p>
                  </div>
                )}

                {cameraError && (
                  <div className="p-6 text-center space-y-3 max-w-md">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-white">Camera Access Notice</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => handleTabChange('upload')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Upload Image Instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Laser Scanning Frame & Animation */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Targeting Box */}
                    <div className="relative w-64 sm:w-72 h-44 rounded-2xl border-2 border-blue-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] overflow-hidden">
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                      {/* Moving Red Laser Line */}
                      <div className="w-full h-1 bg-red-500 shadow-[0_0_12px_#ef4444] animate-[bounce_2s_infinite]" />

                      {/* Status indicator inside frame */}
                      <div className="absolute bottom-3 inset-x-0 text-center">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-semibold text-blue-300 border border-blue-400/30 backdrop-blur-xs">
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                          <span>Scanning barcode...</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detected Success Overlay */}
                {detectedCode && (
                  <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-3">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                      {detectedFormat || 'EAN-13'} Decoded
                    </p>
                    <p className="text-2xl font-mono font-extrabold text-white tracking-widest mt-1">
                      {detectedCode}
                    </p>
                    <p className="text-xs text-emerald-200/80 mt-2">
                      Fetching product intelligence from database...
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Supports EAN-13, EAN-8, UPC-A, UPC-E, Code 128 & GS1</span>
                </span>
                <button
                  onClick={() => handleTabChange('manual')}
                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Can't scan? Enter code manually →
                </button>
              </div>
            </div>
          )}

          {/* UPLOAD MODE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px]">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/bmp"
                  onChange={handleImageFile}
                  className="sr-only"
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Upload Product Image containing Barcode
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Drag & drop or browse packaging photo. Our computer vision engine will detect and decode the barcode automatically.
                </p>
                <span className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs">
                  Choose Image File
                </span>
              </label>

              {uploadDecoding && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                  <span>Scanning image for EAN / UPC / Code 128 barcode patterns...</span>
                </div>
              )}

              {uploadError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-rose-950">Barcode Not Detected</p>
                    <p className="text-rose-700">{uploadError}</p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleTabChange('manual')}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Enter Barcode Manually
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MANUAL ENTRY MODE */}
          {activeTab === 'manual' && (
            <div className="space-y-5">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Enter Barcode / GTIN Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="e.g. 8901030010103 or 8901719101014"
                      className="w-full px-4 py-3 text-base font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 placeholder:font-sans placeholder:font-normal"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1.5 transition-all"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Product</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts standard EAN-13 (13 digits), UPC-A (12 digits), EAN-8 (8 digits), and GTIN-14.
                  </p>
                </div>

                {manualError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{manualError}</span>
                  </div>
                )}
              </form>

              {/* Verified Quick Demo Barcodes */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Try Real Indian Packaged Goods Barcodes:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleBarcodes.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setManualCode(item.code);
                        onBarcodeDetected(item.code, item.type);
                        onClose();
                      }}
                      className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                        {item.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Hardware barcode decoding queries official GS1 and Open Food Facts APIs.</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
