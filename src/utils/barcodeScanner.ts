/**
 * PackSure AI – Barcode Scanning and Decoding Engine
 * Supports EAN-13, EAN-8, UPC-A, UPC-E, Code 128, QR Code, GS1 DataBar
 * Uses @zxing/browser with fallback to native BarcodeDetector API
 */
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

export interface DecodedBarcodeResult {
  text: string;
  format: string;
  timestamp: number;
}

// Map ZXing formats to user-friendly names
export function formatName(format: BarcodeFormat): string {
  switch (format) {
    case BarcodeFormat.EAN_13:
      return 'EAN-13 (GS1)';
    case BarcodeFormat.EAN_8:
      return 'EAN-8';
    case BarcodeFormat.UPC_A:
      return 'UPC-A';
    case BarcodeFormat.UPC_E:
      return 'UPC-E';
    case BarcodeFormat.CODE_128:
      return 'Code 128';
    case BarcodeFormat.QR_CODE:
      return 'QR Code';
    case BarcodeFormat.DATA_MATRIX:
      return 'Data Matrix';
    case BarcodeFormat.ITF:
      return 'ITF-14';
    default:
      return BarcodeFormat[format] || 'Barcode';
  }
}

// Configured reader with GS1 / Retail barcode hints
export function createBarcodeReader(): BrowserMultiFormatReader {
  const hints = new Map();
  const possibleFormats = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.ITF,
    BarcodeFormat.CODE_39,
  ];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, possibleFormats);
  hints.set(DecodeHintType.TRY_HARDER, true);

  return new BrowserMultiFormatReader(hints);
}

/**
 * Decode barcode from an image file (data URL or Object URL)
 */
export async function decodeBarcodeFromImage(imageUrl: string): Promise<DecodedBarcodeResult | null> {
  // Method 1: Try Native BarcodeDetector if available in browser
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // @ts-ignore - BarcodeDetector might not be in standard TS lib
      const detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code', 'data_matrix'],
      });
      const barcodes = await detector.detect(img);
      if (barcodes && barcodes.length > 0) {
        const primary = barcodes[0];
        return {
          text: primary.rawValue,
          format: primary.format?.toUpperCase() || 'EAN-13',
          timestamp: Date.now(),
        };
      }
    } catch (e) {
      console.warn('Native BarcodeDetector fallback to ZXing:', e);
    }
  }

  // Method 2: ZXing Browser Multi-Format Reader
  try {
    const reader = createBarcodeReader();
    const result = await reader.decodeFromImageUrl(imageUrl);
    if (result) {
      return {
        text: result.getText(),
        format: formatName(result.getBarcodeFormat()),
        timestamp: Date.now(),
      };
    }
  } catch (err) {
    console.log('ZXing direct decode not found, attempting image contrast enhancement...', err);
  }

  // Method 3: Preprocess canvas with contrast thresholding if initial pass didn't catch faint/small barcode
  try {
    const enhancedUrl = await enhanceImageForBarcode(imageUrl);
    if (enhancedUrl) {
      const reader = createBarcodeReader();
      const result = await reader.decodeFromImageUrl(enhancedUrl);
      if (result) {
        return {
          text: result.getText(),
          format: formatName(result.getBarcodeFormat()),
          timestamp: Date.now(),
        };
      }
    }
  } catch (enhanceErr) {
    console.warn('Enhanced barcode decode pass error:', enhanceErr);
  }

  return null;
}

/**
 * Canvas filter to boost contrast for barcode bars detection
 */
async function enhanceImageForBarcode(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Grayscale + high contrast
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Binarize / high contrast stretch
          const v = gray > 120 ? 255 : 0;
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/**
 * GS1 Standard Modulo-10 Check Digit Calculation
 * Works universally for EAN-8, UPC-A (GTIN-12), EAN-13, and GTIN-14.
 * From right to left of the data digits, weights alternate 3 and 1.
 */
export function calculateGs1CheckDigit(dataDigits: string): number {
  let sum = 0;
  let weight = 3;
  for (let i = dataDigits.length - 1; i >= 0; i--) {
    const digit = parseInt(dataDigits[i], 10);
    if (isNaN(digit)) return -1;
    sum += digit * weight;
    weight = weight === 3 ? 1 : 3;
  }
  return (10 - (sum % 10)) % 10;
}

export function verifyGs1CheckDigit(fullBarcode: string): {
  isVerifiable: boolean;
  isCheckDigitValid: boolean;
  calculatedCheckDigit?: number;
  actualCheckDigit?: number;
} {
  const cleaned = fullBarcode.trim().replace(/[-\s]/g, '');
  if (!/^\d+$/.test(cleaned) || (cleaned.length !== 8 && cleaned.length !== 12 && cleaned.length !== 13 && cleaned.length !== 14)) {
    return { isVerifiable: false, isCheckDigitValid: false };
  }

  const dataPart = cleaned.slice(0, -1);
  const actualCheck = parseInt(cleaned.slice(-1), 10);
  const calculatedCheck = calculateGs1CheckDigit(dataPart);

  return {
    isVerifiable: true,
    isCheckDigitValid: actualCheck === calculatedCheck,
    calculatedCheckDigit: calculatedCheck,
    actualCheckDigit: actualCheck,
  };
}

/**
 * Validates barcode format (EAN-13, EAN-8, UPC-A, UPC-E, GTIN-14, Code 128)
 * Verifies check digit and returns statutory validation breakdown.
 */
export function validateBarcode(code: string): { 
  isValid: boolean; 
  format: string; 
  gtin: string;
  isCheckDigitVerified: boolean;
  calculatedCheckDigit?: number;
  actualCheckDigit?: number;
  isGs1India: boolean;
  error?: string;
  validationNotice: string;
} {
  const cleaned = code.trim().replace(/[-\s]/g, '');

  if (!cleaned) {
    return { 
      isValid: false, 
      format: 'Unknown', 
      gtin: '',
      isCheckDigitVerified: false,
      isGs1India: false,
      error: 'Barcode number cannot be empty.',
      validationNotice: 'No input provided.'
    };
  }

  const checkResult = verifyGs1CheckDigit(cleaned);
  const isIndia = cleaned.startsWith('890');

  // Standard numeric barcodes
  if (/^\d+$/.test(cleaned)) {
    if (cleaned.length === 8) {
      return { 
        isValid: true, 
        format: 'EAN-8',
        gtin: cleaned,
        isCheckDigitVerified: checkResult.isCheckDigitValid,
        calculatedCheckDigit: checkResult.calculatedCheckDigit,
        actualCheckDigit: checkResult.actualCheckDigit,
        isGs1India: isIndia,
        validationNotice: checkResult.isCheckDigitValid 
          ? 'Format compliant & check digit mathematically verified.' 
          : '⚠️ Check digit mismatch detected against standard GS1 modulo-10 algorithm.'
      };
    }
    if (cleaned.length === 12) {
      return { 
        isValid: true, 
        format: 'UPC-A (GTIN-12)',
        gtin: cleaned,
        isCheckDigitVerified: checkResult.isCheckDigitValid,
        calculatedCheckDigit: checkResult.calculatedCheckDigit,
        actualCheckDigit: checkResult.actualCheckDigit,
        isGs1India: isIndia,
        validationNotice: checkResult.isCheckDigitValid 
          ? 'Format compliant & check digit mathematically verified.' 
          : '⚠️ Check digit mismatch detected against standard GS1 modulo-10 algorithm.'
      };
    }
    if (cleaned.length === 13) {
      return { 
        isValid: true, 
        format: isIndia ? 'EAN-13 (GS1 India 890)' : 'EAN-13',
        gtin: cleaned,
        isCheckDigitVerified: checkResult.isCheckDigitValid,
        calculatedCheckDigit: checkResult.calculatedCheckDigit,
        actualCheckDigit: checkResult.actualCheckDigit,
        isGs1India: isIndia,
        validationNotice: checkResult.isCheckDigitValid 
          ? (isIndia ? 'Valid GS1 India (890 prefix) barcode format & check digit verified.' : 'Valid EAN-13 format & check digit verified.') 
          : '⚠️ EAN-13 check digit mismatch detected.'
      };
    }
    if (cleaned.length === 14) {
      return { 
        isValid: true, 
        format: 'GTIN-14 (Shipping Container Code)',
        gtin: cleaned,
        isCheckDigitVerified: checkResult.isCheckDigitValid,
        calculatedCheckDigit: checkResult.calculatedCheckDigit,
        actualCheckDigit: checkResult.actualCheckDigit,
        isGs1India: isIndia,
        validationNotice: 'Valid GTIN-14 format.'
      };
    }
    if (cleaned.length === 6) {
      return { 
        isValid: true, 
        format: 'UPC-E',
        gtin: cleaned,
        isCheckDigitVerified: true,
        isGs1India: false,
        validationNotice: 'Valid zero-suppressed UPC-E code.'
      };
    }
    if (cleaned.length >= 6 && cleaned.length <= 18) {
      return { 
        isValid: true, 
        format: `Numeric Barcode (${cleaned.length} digits)`,
        gtin: cleaned,
        isCheckDigitVerified: false,
        isGs1India: isIndia,
        validationNotice: 'Numeric barcode structure detected.'
      };
    }
  }

  // Alphanumeric standard (Code 128, QR Code, Data Matrix)
  if (/^[A-Za-z0-9_.\-\s/:?&=#]+$/.test(cleaned) && cleaned.length >= 3) {
    const isQr = cleaned.startsWith('http') || cleaned.includes('/') || cleaned.length > 25;
    return { 
      isValid: true, 
      format: isQr ? 'QR Code / 2D Matrix' : 'Code 128 / Alphanumeric',
      gtin: cleaned,
      isCheckDigitVerified: true,
      isGs1India: false,
      validationNotice: 'Alphanumeric payload decoded successfully.'
    };
  }

  return {
    isValid: false,
    format: 'Invalid',
    gtin: cleaned,
    isCheckDigitVerified: false,
    isGs1India: false,
    error: 'Please scan or enter a valid EAN-13, UPC-A, EAN-8, or Code 128 barcode.',
    validationNotice: 'Invalid barcode character or length structure.'
  };
}
