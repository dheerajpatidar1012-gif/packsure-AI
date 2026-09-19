/**
 * PackSure AI – Smart Legal Metrology Compliance Scanner
 * Type definitions
 */

export type Language = 'en' | 'hi';

export type ActiveTab =
  | 'dashboard'
  | 'scan'
  | 'twins'
  | 'evidence-map'
  | 'change-detection'
  | 'history'
  | 'queue'
  | 'gov-data'
  | 'ai-insights'
  | 'reports'
  | 'settings'
  | 'live-barcode'
  | 'digital-twin'
  | 'alerts'
  | 'compare'
  | 'how-it-works'
  | 'about'
  | 'home'
  | 'login'
  | 'smart-medicine';

export type ComplianceStatus = 'COMPLIANT' | 'PARTIALLY COMPLIANT' | 'POTENTIAL_ISSUE' | 'NON-COMPLIANT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RiskPriority = 'NORMAL' | 'REVIEW_REQUIRED' | 'HIGH_ATTENTION' | 'CRITICAL_REVIEW';

export type EvidenceSource = 'Barcode' | 'OCR' | 'Label Image' | 'Database' | 'Manual';

export interface ExtractedFieldIdentity {
  value: string;
  source: EvidenceSource;
  confidence: number; // 0 - 100
  evidenceBoxId?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  status: 'DETECTED' | 'NOT_DETECTED' | 'LOW_CONFIDENCE' | 'MODIFIED';
  originalLanguageText?: string;
  normalizedText?: string;
  isManualOverride?: boolean;
}

export interface ProductIdentityProfile {
  productName: ExtractedFieldIdentity;
  brand: ExtractedFieldIdentity;
  manufacturer: ExtractedFieldIdentity;
  category: ExtractedFieldIdentity;
  batchLot: ExtractedFieldIdentity;
  mrp: ExtractedFieldIdentity;
  netQuantity: ExtractedFieldIdentity;
  manufacturingDate: ExtractedFieldIdentity;
  expiryOrBestBefore: ExtractedFieldIdentity;
  countryOfOrigin: ExtractedFieldIdentity;
  consumerCare: ExtractedFieldIdentity;
  unitSalePrice: ExtractedFieldIdentity;
  otherDeclarations: ExtractedFieldIdentity;
}

export interface EvidenceMapItem {
  id: string;
  requirement: string;
  extractedValue: string;
  source: EvidenceSource;
  applicableRule: string;
  validationResult: 'DETECTED' | 'POTENTIAL_ISSUE' | 'NOT_DETECTED' | 'NEEDS_VERIFICATION';
  confidence: number; // e.g. 96
  boundingBox: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage
    height: number; // percentage
    panel?: 'front' | 'back' | 'side' | 'mrp_panel';
  };
  whyItApplies: string;
  whatWasFound: string;
  whatIsExpected: string;
  statutoryClause: string;
  actionRequired: string;
  inspectorDecision?: 'VERIFIED' | 'INCORRECT' | 'RESCAN';
  inspectorRemarks?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export type LabelDiffStatus = 'UNCHANGED' | 'CHANGED' | 'NEW_INFO' | 'REMOVED_INFO';

export interface LabelDiffItem {
  id: string;
  field: string;
  label: string;
  previousValue: string;
  currentValue: string;
  status: LabelDiffStatus;
  diffType: 'mrp' | 'quantity' | 'manufacturer' | 'dates' | 'declarations' | 'contact' | 'text' | 'layout';
  statutoryNote: string;
  verificationRequired: boolean;
  previousBox?: { x: number; y: number; width: number; height: number };
  currentBox?: { x: number; y: number; width: number; height: number };
}

export interface OfflineInspectionRecord {
  id: string;
  barcode?: string;
  productNameHint?: string;
  timestamp: string;
  images: {
    front?: string;
    back?: string;
    side?: string;
    mrpPanel?: string;
  };
  notes: string;
  gpsCoordinates?: string;
  inspectorName: string;
  inspectorBadge: string;
  synced: boolean;
  syncTimestamp?: string;
}

export interface InspectionQueueItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  barcode: string;
  scannedAt: string;
  riskPriority: RiskPriority;
  detectedConditionReason: string;
  complianceScore: number;
  status: ComplianceStatus;
  inspectorName?: string;
  inspectorDecision?: 'PENDING' | 'VERIFIED' | 'FLAGGED_INCORRECT' | 'RESCAN_ORDERED';
  inspectorRemarks?: string;
  thumbnailUrl: string;
  flaggedItemsCount: number;
}

export interface HeatmapBox {
  id: string;
  label: string;
  status: 'verified' | 'warning' | 'violation';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  detail: string;
  ruleCode: string;
}

export interface GeoInspectionRecord {
  id: string;
  inspectionId: string;
  date: string;
  time: string;
  location: string;
  coordinates: string;
  inspector: string;
  product: string;
  complianceScore: number;
  status: ComplianceStatus;
  risk: RiskLevel;
}

export interface RuleCheckResult {
  id: string;
  ruleCode: string;
  ruleName: string;
  requirement: string;
  found: boolean;
  extractedValue?: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  explanation: string;
  legalClause: string;
  penaltyClause?: string;
  whyItMatters?: string;
  recommendedAction?: string;
}

export interface ProductScanResult {
  id: string;
  productName: string;
  brandName?: string;
  category: string;
  barcode?: string;
  imageUrl?: string;
  scannedAt: string;
  inspectorName?: string;
  batchNumber?: string;
  
  // Mandatory Declarations under Rule 6 of Packaged Commodities Rules 2011
  manufacturer: string;
  address: string;
  netQuantity: string;
  mrp: string;
  unitSalePrice?: string;
  manufacturingDate: string;
  consumerCareDetails: string;
  countryOfOrigin: string;
  bestBefore?: string;
  otherDeclarations?: string;

  // Compliance analysis
  complianceScore: number; // 0 - 100
  status: ComplianceStatus;
  riskLevel?: RiskLevel;
  subScores?: {
    mandatoryInfo: number; // e.g. 8/10
    labelClarity: number; // e.g. 9/10
    declarationCompliance: number; // e.g. 8/10
  };
  heatmapBoxes?: HeatmapBox[];
  aiInsight?: {
    summary: string;
    topIssue: string;
    fieldsDetectedCount: number;
    fieldsAttentionCount: number;
  };
  rules: RuleCheckResult[];
  violations: string[];
  penaltiesNotice: string;
  recommendations?: string[];

  // Database cross-check verification
  databaseInfo?: DatabaseProductInfo;
  packageVerification?: VerificationComparisonItem[];
}

export interface DatabaseProductInfo {
  barcode: string;
  barcodeFormat?: string;
  found: boolean;
  source: string;
  productName?: string;
  brand?: string;
  genericName?: string;
  categories?: string[];
  category?: string;
  quantity?: string;
  netWeight?: string;
  servingSize?: string;
  ingredients?: string;
  allergens?: string[];
  nutritionalInfo?: {
    energy?: string;
    protein?: string;
    carbohydrates?: string;
    fat?: string;
    sugar?: string;
    salt?: string;
    fiber?: string;
    sodium?: string;
  };
  additives?: string[];
  packagingType?: string;
  manufacturer?: string;
  manufacturerAddress?: string;
  countryOfOrigin?: string;
  imageUrl?: string;
  description?: string;
  storageInstructions?: string;
  usageInstructions?: string;
  certifications?: string[];
  labels?: string[];
  mrpAvailable: boolean;
  databaseMrp?: string;
  currency?: string;
  priceSource?: string;
  rawSourceUrl?: string;
}

export interface VerificationComparisonItem {
  field: string;
  label: string;
  packageValue: string | null;
  databaseValue: string | null;
  status: 'MATCH' | 'DISCREPANCY' | 'CANNOT_VERIFY' | 'PACKAGE_ONLY' | 'DATABASE_ONLY';
  notes?: string;
}

export interface BarcodeScanRecord {
  id: string;
  barcode: string;
  format?: string;
  productName: string;
  brand?: string;
  date: string;
  complianceScore: number;
  status: ComplianceStatus;
  hasDatabaseInfo: boolean;
  hasPackageScan: boolean;
  resultPayload?: ProductScanResult;
  // Enhanced price and safety tracking fields
  mrp?: string;
  sellingPrice?: string;
  priceDifference?: number;
  safetyStatus?: 'COMPLIANT' | 'OVERCHARGED' | 'DISCOUNTED' | 'FAIR_PRICE' | 'SAFE' | 'CAUTION' | 'WARNING';
  category?: string;
  storeInfo?: string;
  isMedicine?: boolean;
}

export interface BarcodeValidationReport {
  gtin: string;
  format: string;
  isValidFormat: boolean;
  isCheckDigitVerified: boolean;
  calculatedCheckDigit?: number;
  actualCheckDigit?: number;
  isGs1India: boolean;
  validationNotice: string;
}

export interface BrandVerificationStatus {
  barcodeFound: 'FOUND' | 'NOT_FOUND';
  brandMatch: 'MATCH' | 'UNVERIFIED' | 'MISMATCH';
  manufacturerMatch: 'MATCH' | 'UNVERIFIED' | 'MISMATCH';
  productMatch: 'MATCH' | 'MISMATCH' | 'UNVERIFIED';
  identityStatement: string;
  databaseSource: string;
}

export interface FraudShieldIndicatorItem {
  id: string;
  label: string;
  type: 'mrp_mismatch' | 'qty_mismatch' | 'identity_mismatch' | 'packaging_drift' | 'duplicate_record' | 'suspicious_anomaly';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  databaseValue?: string;
  packageValue?: string;
}

export interface FraudShieldReport {
  riskScore: number; // 0 - 100
  riskIndicatorsCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  statusLabel: string;
  summary: string;
  indicators: FraudShieldIndicatorItem[];
  recommendation: string;
}

export interface FieldWithSource<T = string> {
  value: T;
  source: 'VERIFIED_DATABASE' | 'PACKAGE_OCR' | 'REFERENCE_REGISTRY' | 'USER_SUBMITTED';
  sourceLabel: string;
  isVerified: boolean;
}

export interface LegalMetrologyRule {
  id: string;
  ruleNumber: string;
  titleEn: string;
  titleHi: string;
  category: 'pricing' | 'quantity' | 'identity' | 'consumer_care' | 'dates' | 'origin';
  mandatory: boolean;
  requirementEn: string;
  requirementHi: string;
  simpleExplanationEn: string;
  simpleExplanationHi: string;
  legalActClause: string;
  penaltyDetailEn: string;
  penaltyDetailHi: string;
  compliantExampleEn: string;
  nonCompliantExampleEn: string;
}

export interface InspectorProfile {
  name: string;
  badgeId: string;
  jurisdiction: string;
  department: string;
  avatarUrl?: string;
  email?: string;
  role?: string;
}

// ==========================================
// AI COMPLIANCE DIGITAL TWIN TYPES
// ==========================================

export interface DigitalTwinSnapshot {
  scanId: string;
  timestamp: string;
  mrp: string;
  netQuantity: string;
  unitSalePrice?: string;
  manufacturer: string;
  address: string;
  batchNumber: string;
  manufacturingDate: string;
  bestBefore?: string;
  consumerCareDetails: string;
  countryOfOrigin: string;
  mandatoryDeclarationsCount: number;
  detectedLabelText: string;
  labelLayoutStructure: string;
  imageUrl: string;
  complianceScore: number;
  complianceStatus: ComplianceStatus;
  applicableRulesCount: number;
  fontMetrics?: {
    minDetectedHeightMm: number;
    statutoryRequirementMm: number;
    isCompliant: boolean;
  };
}

export interface VisualDifferenceRegion {
  id: string;
  field: string;
  label: string;
  status: 'changed_violation' | 'changed_warning' | 'changed_neutral' | 'unchanged' | 'removed';
  changeType: string;
  box: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage
    height: number; // percentage
  };
  previousValue: string;
  currentValue: string;
  explanation: string;
  ruleRef: string;
  severity: 'CRITICAL' | 'WARNING' | 'COMPLIANT' | 'INFO';
}

export interface FieldDifferenceItem {
  id: string;
  field: string;
  label: string;
  previousValue: string;
  currentValue: string;
  status: 'CHANGED_VIOLATION' | 'CHANGED_WARNING' | 'CHANGED_INFO' | 'UNCHANGED';
  badge: '🔴' | '🟢' | '🟡' | '🟠';
  changeDescription: string;
  statutoryClause: string;
  requiresInspection: boolean;
  historicalMismatch?: boolean;
}

export interface TwinRiskAnalysisItem {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  statutoryRef: string;
  actionRequired: string;
  badge: string;
}

export interface TwinRiskAnalysis {
  title: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalRiskAreas: number;
  items: TwinRiskAnalysisItem[];
  aiSummary: string;
}

export interface RegulationAmendmentHistoryItem {
  date: string;
  title: string;
  clause: string;
  summary: string;
  appliesToThisBatch: boolean;
}

export interface RegulationTimeMachineData {
  mfgDate: string;
  applicableRegulation: string;
  applicableVersion: string;
  gazetteNotification: string;
  enforcementDate: string;
  historicalRulesAvailable: boolean;
  status: 'COMPLIANT_ON_MFG_DATE' | 'RETROACTIVE_NON_COMPLIANT' | 'MANUAL_VERIFICATION_REQUIRED';
  verdictText: string;
  amendmentHistory: RegulationAmendmentHistoryItem[];
}

export interface TwinTimelineEvent {
  id: string;
  stepNumber: number;
  date: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  inspector: string;
  status: 'completed' | 'current' | 'flagged';
}

export interface ComplianceDigitalTwin {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  category: string;
  barcode: string;
  firstScanDate: string;
  lastScanDate: string;
  totalScansCount: number;
  changesDetectedCount: number;
  requiresInspection: boolean;
  historicalRuleMismatch: boolean;
  complianceStatus: ComplianceStatus;
  riskLevel: RiskLevel;
  complianceScore: number;
  fingerprintHash: string; // SHA-256 digital fingerprint
  baselineSnapshot: DigitalTwinSnapshot;
  currentSnapshot: DigitalTwinSnapshot;
  visualRegions: VisualDifferenceRegion[];
  fieldDifferences: FieldDifferenceItem[];
  riskAnalysis: TwinRiskAnalysis;
  regulationTimeMachine: RegulationTimeMachineData;
  inspectionTimeline: TwinTimelineEvent[];
}

// ==========================================
// SMART MEDICINE SAFETY SCANNER TYPES
// ==========================================

export type MedicineRiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface MedicineInfo {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  activeIngredient: string; // e.g. "Paracetamol (Acetaminophen)"
  strength: string; // e.g. "650 mg"
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Suspension' | 'Ointment' | 'Drops';
  manufacturer: string;
  category: string; // e.g. "Antipyretic & Analgesic"
  mrp: string;
  schedule: 'OTC' | 'Schedule H' | 'Schedule H1' | 'Schedule X';
  generalUses: string[];
  warnings: string[];
  contraindications: string[]; // Situations where medicine must NOT be taken
  commonSideEffects: string[];
  seriousSideEffects: string[];
  drugInteractions: {
    interactingDrug: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    effect: string;
  }[];
  maxDailyDose: string;
  reliefTimeline: string;
  instructions: string;
}

export interface UserHealthProfile {
  ageGroup: 'child' | 'adult' | 'senior';
  symptoms: string[];
  customSymptom?: string;
  symptomOnsetTime?: string; // e.g. "Just now (<1 hr)", "1-3 hours ago", "4-12 hours ago", "Today", "2+ days ago"
  recentFoodEaten?: string; // e.g. "Haldiram's Bhujia Sev", "Milkshake", etc.
  recentFoodIngredients?: string;
  existingConditions: string[]; // e.g., 'Liver Disease', 'Kidney Disease', 'Diabetes'
  allergies: string[]; // e.g., 'Paracetamol', 'Penicillin', 'NSAIDs'
  currentMedicines: string[]; // e.g., 'Warfarin', 'Metformin'
  isPregnantOrNursing: boolean;
}

export interface FoodSymptomCorrelation {
  foodProductName?: string;
  foodIngredients?: string;
  potentialConcernDetected: boolean;
  concernTitle?: string;
  concernExplanation: string;
  disclaimer: string;
}

export interface DecisionAdvice {
  status: 'GREEN' | 'YELLOW' | 'RED' | 'UNCERTAIN';
  headline: string;
  statement: string;
  guidance: string;
}

export interface MedicineConflictItem {
  id: string;
  type: 'CONTRAINDICATION' | 'DRUG_INTERACTION' | 'ALLERGY_WARNING' | 'DOSE_CONCERN' | 'PRECAUTION';
  severity: 'RED' | 'YELLOW' | 'GREEN';
  title: string;
  description: string;
  recommendation: string;
}

export interface PossibleCauseCategory {
  category: string;
  examples: string[];
  description: string;
}

export interface MedicineSafetyAnalysis {
  riskLevel: MedicineRiskLevel;
  riskTitle: string;
  statusLabel: string;
  conflicts: MedicineConflictItem[];
  benefitSummary: string;
  riskSummary: string;
  possibleCauses: PossibleCauseCategory[];
  emergencyWarning?: {
    isEmergency: boolean;
    urgentReason?: string;
    actionRequired: string;
  };
  foodCorrelation?: FoodSymptomCorrelation;
  tabletDecisionAdvice: DecisionAdvice;
  safeNextSteps: {
    selfCare: string[];
    redFlags: string[];
    consultationAdvice: string;
  };
  sources: string[];
}


