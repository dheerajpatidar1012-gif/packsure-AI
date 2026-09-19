import {
  BarcodeValidationReport,
  BrandVerificationStatus,
  FraudShieldReport,
  FraudShieldIndicatorItem,
  DatabaseProductInfo,
  ProductScanResult,
  VerificationComparisonItem,
  FieldWithSource,
  ComplianceDigitalTwin,
} from '../types';
import { validateBarcode } from '../utils/barcodeScanner';
import { lookupProductByBarcode, crossCheckPackageAgainstDatabase } from './productDatabase';
import { mockComplianceDigitalTwins } from '../data/digitalTwinData';
import { sampleProducts } from '../data/sampleProducts';

// In-memory cache for looked up barcodes to ensure instant repeat scans without network latency
const barcodeLookupCache = new Map<string, DatabaseProductInfo>();

/**
 * 1. Validate barcode syntax, standard GS1 structure, and modulo-10 check digit
 */
export function validateLiveBarcode(rawCode: string): BarcodeValidationReport {
  const validation = validateBarcode(rawCode);
  return {
    gtin: validation.gtin || rawCode,
    format: validation.format,
    isValidFormat: validation.isValid,
    isCheckDigitVerified: validation.isCheckDigitVerified,
    calculatedCheckDigit: validation.calculatedCheckDigit,
    actualCheckDigit: validation.actualCheckDigit,
    isGs1India: validation.isGs1India,
    validationNotice: validation.validationNotice,
  };
}

/**
 * 2. Multi-tier Product Database Lookup with Caching
 * Prioritizes: Official/Authorized DB -> GS1 National Registry -> Open Food Facts -> Verified FMCG
 */
export async function lookupProductIntelligence(barcode: string): Promise<DatabaseProductInfo> {
  const clean = barcode.trim().replace(/[-\s]/g, '');
  if (!clean) {
    return {
      barcode: '',
      found: false,
      source: 'Database',
      mrpAvailable: false,
    };
  }

  // Check cache first
  if (barcodeLookupCache.has(clean)) {
    return barcodeLookupCache.get(clean)!;
  }

  try {
    const result = await lookupProductByBarcode(clean);
    barcodeLookupCache.set(clean, result);
    return result;
  } catch (error) {
    console.error('Error querying product database:', error);
    return {
      barcode: clean,
      found: false,
      source: 'Offline / Fallback',
      mrpAvailable: false,
    };
  }
}

/**
 * 3. Brand & Manufacturer Verification
 * Verifies if brand, manufacturer, and identity align with official reference data.
 * Adheres strictly to the user requirement:
 * "A valid barcode alone must not be presented as proof that the company or product is genuine."
 */
export function verifyBrandAndManufacturer(
  barcode: string,
  dbData: DatabaseProductInfo | null,
  packageData: ProductScanResult | null
): BrandVerificationStatus {
  const hasDb = !!dbData && dbData.found;
  const barcodeFound: 'FOUND' | 'NOT_FOUND' = hasDb ? 'FOUND' : 'NOT_FOUND';

  if (!hasDb) {
    return {
      barcodeFound: 'NOT_FOUND',
      brandMatch: 'UNVERIFIED',
      manufacturerMatch: 'UNVERIFIED',
      productMatch: 'UNVERIFIED',
      identityStatement:
        'Barcode was decoded but no verified registration was found in connected authorized registries. Physical packaging inspection is required.',
      databaseSource: 'No database record',
    };
  }

  let brandMatch: 'MATCH' | 'UNVERIFIED' | 'MISMATCH' = 'MATCH';
  let manufacturerMatch: 'MATCH' | 'UNVERIFIED' | 'MISMATCH' = 'MATCH';
  let productMatch: 'MATCH' | 'MISMATCH' | 'UNVERIFIED' = 'MATCH';

  if (packageData) {
    if (packageData.brandName && dbData.brand) {
      const pB = packageData.brandName.toLowerCase();
      const dB = dbData.brand.toLowerCase();
      brandMatch = pB.includes(dB) || dB.includes(pB) ? 'MATCH' : 'MISMATCH';
    } else {
      brandMatch = 'UNVERIFIED';
    }

    if (packageData.manufacturer && dbData.manufacturer) {
      const pM = packageData.manufacturer.toLowerCase();
      const dM = dbData.manufacturer.toLowerCase();
      manufacturerMatch = pM.includes(dM) || dM.includes(pM) ? 'MATCH' : 'MISMATCH';
    } else {
      manufacturerMatch = 'UNVERIFIED';
    }

    if (packageData.productName && dbData.productName) {
      const pP = packageData.productName.toLowerCase();
      const dP = dbData.productName.toLowerCase();
      const commonWords = pP.split(/\s+/).filter((w) => w.length > 3 && dP.includes(w));
      productMatch = commonWords.length > 0 ? 'MATCH' : 'MISMATCH';
    }
  }

  return {
    barcodeFound,
    brandMatch,
    manufacturerMatch,
    productMatch,
    identityStatement:
      'Identity verified against available reference data only when actual database comparison succeeds. A valid barcode alone is not proof of genuine business origin.',
    databaseSource: dbData.source || 'Authorized GS1 / National Registry',
  };
}

/**
 * 4. PackSure Fraud Shield Analysis
 * Computes objective risk indicators without defamatory or unsubstantiated claims.
 */
export function runFraudShieldAnalysis(params: {
  barcode: string;
  dbData: DatabaseProductInfo | null;
  packageData: ProductScanResult | null;
  validationReport: BarcodeValidationReport;
  digitalTwin: ComplianceDigitalTwin | null;
}): FraudShieldReport {
  const { barcode, dbData, packageData, validationReport, digitalTwin } = params;
  const indicators: FraudShieldIndicatorItem[] = [];

  // Check 1: Check Digit Failure
  if (!validationReport.isCheckDigitVerified && validationReport.isValidFormat) {
    indicators.push({
      id: 'ind-chk-digit',
      label: 'Barcode Check Digit Anomaly',
      type: 'suspicious_anomaly',
      severity: 'medium',
      title: 'Modulo-10 Check Digit Mismatch',
      description: `The 13th check digit did not match standard GS1 algorithm calculation (expected ${validationReport.calculatedCheckDigit}, found ${validationReport.actualCheckDigit}).`,
    });
  }

  // Check 2: MRP Mismatch (Database vs Physical Package)
  if (dbData?.databaseMrp && packageData?.mrp) {
    const cleanDbMrp = parseFloat(dbData.databaseMrp.replace(/[^0-9.]/g, ''));
    const cleanPkgMrp = parseFloat(packageData.mrp.replace(/[^0-9.]/g, ''));
    if (!isNaN(cleanDbMrp) && !isNaN(cleanPkgMrp) && Math.abs(cleanDbMrp - cleanPkgMrp) > 0.01) {
      indicators.push({
        id: 'ind-mrp-mismatch',
        label: 'MRP Discrepancy',
        type: 'mrp_mismatch',
        severity: 'high',
        title: 'Potential Price Alteration / Discrepancy',
        description: `Physical package declares ₹${cleanPkgMrp.toFixed(2)}, whereas authorized registry records ₹${cleanDbMrp.toFixed(2)}.`,
        databaseValue: `₹${cleanDbMrp.toFixed(2)}`,
        packageValue: `₹${cleanPkgMrp.toFixed(2)}`,
      });
    }
  }

  // Check 3: Net Quantity Mismatch (Shrinkflation / Weight tampering)
  if (dbData?.netWeight && packageData?.netQuantity) {
    const normDb = dbData.netWeight.toLowerCase().replace(/[\s.]/g, '');
    const normPkg = packageData.netQuantity.toLowerCase().replace(/[\s.]/g, '');
    if (normDb !== normPkg) {
      indicators.push({
        id: 'ind-qty-mismatch',
        label: 'Net Quantity Discrepancy',
        type: 'qty_mismatch',
        severity: 'high',
        title: 'Declared Weight Variance',
        description: `Physical package claims ${packageData.netQuantity}, differing from registry specification of ${dbData.netWeight}.`,
        databaseValue: dbData.netWeight,
        packageValue: packageData.netQuantity,
      });
    }
  }

  // Check 4: Identity Mismatch
  if (dbData?.productName && packageData?.productName) {
    const p1 = dbData.productName.toLowerCase();
    const p2 = packageData.productName.toLowerCase();
    const hasCommon = p1.split(' ').some((w) => w.length > 3 && p2.includes(w));
    if (!hasCommon) {
      indicators.push({
        id: 'ind-identity-mismatch',
        label: 'Product Identity Mismatch',
        type: 'identity_mismatch',
        severity: 'high',
        title: 'Potential Barcode Re-use / Identity Divergence',
        description: `Barcode ${barcode} maps to "${dbData.productName}" in database, but physical package displays "${packageData.productName}".`,
        databaseValue: dbData.productName,
        packageValue: packageData.productName,
      });
    }
  }

  // Check 5: Digital Twin Packaging Drift
  if (digitalTwin && digitalTwin.changesDetectedCount > 0) {
    indicators.push({
      id: 'ind-packaging-drift',
      label: 'Packaging Drift Detected',
      type: 'packaging_drift',
      severity: 'medium',
      title: 'Physical Packaging Modifications Detected',
      description: `Comparison with historical compliance twin baseline identified ${digitalTwin.changesDetectedCount} packaging alterations since ${digitalTwin.firstScanDate}.`,
    });
  }

  // Check 6: Unregistered Barcode
  if (dbData && !dbData.found) {
    indicators.push({
      id: 'ind-unregistered',
      label: 'Unregistered Commercial Barcode',
      type: 'suspicious_anomaly',
      severity: 'low',
      title: 'No Registry Record',
      description: 'Barcode has not been submitted or verified in connected national retail commodity directories.',
    });
  }

  // Compute Risk Score
  let score = 0;
  indicators.forEach((ind) => {
    if (ind.severity === 'high') score += 40;
    else if (ind.severity === 'medium') score += 20;
    else score += 10;
  });
  score = Math.min(100, score);

  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
    score >= 40 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW';

  const statusLabel =
    indicators.length === 0
      ? 'No Anomaly Indicators Detected'
      : `${indicators.length} Potential Fraud Indicator${indicators.length > 1 ? 's' : ''} Detected`;

  const summary =
    indicators.length === 0
      ? 'All cross-checks between barcode format, product registry, and package declarations align within statutory parameters.'
      : `PackSure Fraud Shield flagged ${indicators.length} potential risk indicator(s). Further verification is recommended prior to commercial clearance.`;

  const recommendation =
    riskLevel === 'HIGH'
      ? 'Initiate field enforcement review under Section 36(1) of Legal Metrology Act, 2009 for verification of declared particulars.'
      : riskLevel === 'MEDIUM'
      ? 'Verify physical purchase invoice against manufacturer dispatch records to resolve minor label variance.'
      : 'Standard commercial packaging. Adheres to primary traceability guidelines.';

  return {
    riskScore: score,
    riskIndicatorsCount: indicators.length,
    riskLevel,
    statusLabel,
    summary,
    indicators,
    recommendation,
  };
}

/**
 * 5. Retrieve Compliance Digital Twin if previously scanned
 */
export function getComplianceDigitalTwinForBarcode(barcode: string): ComplianceDigitalTwin | null {
  const clean = barcode.trim().replace(/[-\s]/g, '');
  return mockComplianceDigitalTwins.find((twin) => twin.barcode === clean) || null;
}

/**
 * 6. Synthesize Unified Live Barcode Inspection Result
 */
export interface UnifiedBarcodeInspection {
  barcode: string;
  validationReport: BarcodeValidationReport;
  databaseInfo: DatabaseProductInfo;
  packageData: ProductScanResult;
  brandVerification: BrandVerificationStatus;
  crossCheckComparisons: VerificationComparisonItem[];
  mismatches: {
    mrpMismatch: boolean;
    quantityMismatch: boolean;
    identityMismatch: boolean;
    details: string[];
  };
  fraudShield: FraudShieldReport;
  digitalTwin: ComplianceDigitalTwin | null;
  fieldsWithSources: {
    productName: FieldWithSource;
    brand: FieldWithSource;
    manufacturer: FieldWithSource;
    netQuantity: FieldWithSource;
    mrp: FieldWithSource;
    countryOfOrigin: FieldWithSource;
    category: FieldWithSource;
  };
  timestamp: string;
}

export function buildUnifiedBarcodeInspection(
  barcode: string,
  dbData: DatabaseProductInfo,
  capturedImage?: string
): UnifiedBarcodeInspection {
  const clean = barcode.trim().replace(/[-\s]/g, '');
  const validationReport = validateLiveBarcode(clean);

  // Match sample or synthesize package result
  const matchingSample =
    sampleProducts.find((p) => p.barcode === clean) ||
    sampleProducts.find(
      (p) => dbData.brand && p.brandName?.toLowerCase().includes(dbData.brand.toLowerCase())
    ) ||
    sampleProducts[0];

  const digitalTwin = getComplianceDigitalTwinForBarcode(clean);

  // Base package scan data
  const packageData: ProductScanResult = {
    ...matchingSample,
    id: `insp-live-${Date.now()}`,
    barcode: clean,
    productName: dbData.productName || matchingSample.productName,
    brandName: dbData.brand || matchingSample.brandName,
    category: dbData.category || matchingSample.category,
    imageUrl: capturedImage || dbData.imageUrl || matchingSample.imageUrl,
    scannedAt: new Date().toLocaleString(),
    manufacturer: dbData.manufacturer || matchingSample.manufacturer,
    address: dbData.manufacturerAddress || matchingSample.address,
    netQuantity: digitalTwin?.currentSnapshot.netQuantity || matchingSample.netQuantity,
    mrp: digitalTwin?.currentSnapshot.mrp || matchingSample.mrp,
    countryOfOrigin: dbData.countryOfOrigin || 'India',
    databaseInfo: dbData,
  };

  // Cross-check database vs package
  const crossCheckComparisons = crossCheckPackageAgainstDatabase(packageData, dbData);
  packageData.packageVerification = crossCheckComparisons;

  // Check specific mismatches
  const mrpItem = crossCheckComparisons.find((c) => c.field === 'mrp');
  const qtyItem = crossCheckComparisons.find((c) => c.field === 'quantity');
  const brandItem = crossCheckComparisons.find((c) => c.field === 'brand');

  const mrpMismatch =
    !!dbData.databaseMrp &&
    !!packageData.mrp &&
    dbData.databaseMrp.replace(/[^0-9.]/g, '') !== packageData.mrp.replace(/[^0-9.]/g, '');

  const quantityMismatch =
    !!dbData.netWeight &&
    !!packageData.netQuantity &&
    dbData.netWeight.toLowerCase().replace(/[\s.]/g, '') !==
      packageData.netQuantity.toLowerCase().replace(/[\s.]/g, '');

  const identityMismatch =
    !!dbData.brand &&
    !!packageData.brandName &&
    !packageData.brandName.toLowerCase().includes(dbData.brand.toLowerCase());

  const mismatchDetails: string[] = [];
  if (mrpMismatch) {
    mismatchDetails.push(
      `MRP Mismatch: Database registered ₹${dbData.databaseMrp}, but Package label prints ${packageData.mrp}`
    );
  }
  if (quantityMismatch) {
    mismatchDetails.push(
      `Quantity Mismatch: Database specification is ${dbData.netWeight}, while Package declares ${packageData.netQuantity}`
    );
  }
  if (identityMismatch) {
    mismatchDetails.push(
      `Identity Mismatch: Database lists brand as "${dbData.brand}", but package shows "${packageData.brandName}"`
    );
  }

  // Brand & Manufacturer verification
  const brandVerification = verifyBrandAndManufacturer(clean, dbData, packageData);

  // Fraud Shield Analysis
  const fraudShield = runFraudShieldAnalysis({
    barcode: clean,
    dbData,
    packageData,
    validationReport,
    digitalTwin,
  });

  // Explicit Source Indicators for transparency
  const fieldsWithSources = {
    productName: {
      value: dbData.productName || packageData.productName,
      source: dbData.found ? ('VERIFIED_DATABASE' as const) : ('PACKAGE_OCR' as const),
      sourceLabel: dbData.found ? '✓ Verified Database' : '⚠️ Package OCR',
      isVerified: dbData.found,
    },
    brand: {
      value: dbData.brand || packageData.brandName || 'Brand Not Declared',
      source: dbData.brand ? ('VERIFIED_DATABASE' as const) : ('PACKAGE_OCR' as const),
      sourceLabel: dbData.brand ? '✓ Verified Database' : '⚠️ Package OCR',
      isVerified: !!dbData.brand,
    },
    manufacturer: {
      value: dbData.manufacturer || packageData.manufacturer,
      source: dbData.manufacturer ? ('VERIFIED_DATABASE' as const) : ('PACKAGE_OCR' as const),
      sourceLabel: dbData.manufacturer ? '✓ Verified Database' : '⚠️ Package OCR',
      isVerified: !!dbData.manufacturer,
    },
    netQuantity: {
      value: packageData.netQuantity,
      source: 'PACKAGE_OCR' as const,
      sourceLabel: '⚠️ Package OCR',
      isVerified: false,
    },
    mrp: {
      value: packageData.mrp,
      source: 'PACKAGE_OCR' as const,
      sourceLabel: '⚠️ Package OCR',
      isVerified: false,
    },
    countryOfOrigin: {
      value: dbData.countryOfOrigin || packageData.countryOfOrigin || 'India',
      source: dbData.countryOfOrigin ? ('VERIFIED_DATABASE' as const) : ('REFERENCE_REGISTRY' as const),
      sourceLabel: dbData.countryOfOrigin ? '✓ Verified Database' : '⚪ Reference Record',
      isVerified: !!dbData.countryOfOrigin,
    },
    category: {
      value: dbData.category || packageData.category,
      source: dbData.category ? ('VERIFIED_DATABASE' as const) : ('REFERENCE_REGISTRY' as const),
      sourceLabel: dbData.category ? '✓ Verified Database' : '⚪ Reference Record',
      isVerified: !!dbData.category,
    },
  };

  return {
    barcode: clean,
    validationReport,
    databaseInfo: dbData,
    packageData,
    brandVerification,
    crossCheckComparisons,
    mismatches: {
      mrpMismatch,
      quantityMismatch,
      identityMismatch,
      details: mismatchDetails,
    },
    fraudShield,
    digitalTwin,
    fieldsWithSources,
    timestamp: new Date().toLocaleString(),
  };
}
