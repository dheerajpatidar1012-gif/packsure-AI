import { 
  EvidenceMapItem, 
  ProductIdentityProfile, 
  LabelDiffItem, 
  InspectionQueueItem, 
  OfflineInspectionRecord, 
  RiskPriority, 
  ProductScanResult 
} from '../types';

export interface EnrichedProductComplianceTwin {
  id: string;
  productId: string;
  barcode: string;
  productName: string;
  brand: string;
  category: string;
  status: 'COMPLIANT' | 'PARTIALLY COMPLIANT' | 'POTENTIAL_ISSUE' | 'NON-COMPLIANT';
  riskPriority: RiskPriority;
  riskReasoning: string;
  complianceScore: number;
  lastInspectedAt: string;
  inspectorName: string;
  inspectorBadge: string;
  imageUrl: string;
  panelsCaptured: {
    front: string;
    back?: string;
    side?: string;
    mrpPanel?: string;
  };
  identityProfile: ProductIdentityProfile;
  evidenceMap: EvidenceMapItem[];
  changesDetected: LabelDiffItem[];
  timeline: {
    id: string;
    scanNumber: number;
    scanId: string;
    date: string;
    inspector: string;
    badge: string;
    summary: string;
    changesDetected: string[];
    mrp: string;
    netQuantity: string;
    status: 'COMPLIANT' | 'POTENTIAL_ISSUE' | 'NON-COMPLIANT';
    imageUrl: string;
  }[];
  inspectorDecision?: 'VERIFIED' | 'INCORRECT' | 'RESCAN';
  inspectorRemarks?: string;
  verifiedAt?: string;
}

// ----------------------------------------------------
// REALISTIC DEMO DATA: Britannia Good Day Butter Cookies
// SCAN 1 (Baseline - Compliant) vs SCAN 2 (Current - Shrinkflation & Alteration)
// ----------------------------------------------------

export const demoScan1Baseline: EnrichedProductComplianceTwin = {
  id: 'twin-britannia-good-day-001',
  productId: 'prod-8901030010103',
  barcode: '8901030010103',
  productName: 'Britannia Good Day Butter Cookies',
  brand: 'Britannia',
  category: 'Snacks & Biscuits',
  status: 'COMPLIANT',
  riskPriority: 'NORMAL',
  riskReasoning: 'All 7 statutory declarations confirmed with >94% vision OCR confidence and valid metric notation.',
  complianceScore: 98,
  lastInspectedAt: '15 Jan 2026, 10:30 AM',
  inspectorName: 'Insp. Dheeraj Patidar',
  inspectorBadge: 'LM-DEL-4092',
  imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
  panelsCaptured: {
    front: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    back: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    mrpPanel: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
  },
  identityProfile: {
    productName: {
      value: 'Britannia Good Day Butter Cookies',
      source: 'Label Image',
      confidence: 99,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 15, width: 75, height: 18 },
    },
    brand: {
      value: 'Britannia',
      source: 'Label Image',
      confidence: 99,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 10, width: 35, height: 12 },
    },
    manufacturer: {
      value: 'Britannia Industries Limited, 5/1A, Hungerford Street, Kolkata, West Bengal - 700017',
      source: 'OCR',
      confidence: 95,
      status: 'DETECTED',
      boundingBox: { x: 8, y: 40, width: 84, height: 16 },
    },
    category: {
      value: 'Bakery & Biscuits (Packaged Food)',
      source: 'Database',
      confidence: 96,
      status: 'DETECTED',
    },
    batchLot: {
      value: 'B.No. GDB-250109-A',
      source: 'OCR',
      confidence: 92,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 60, width: 38, height: 10 },
    },
    mrp: {
      value: '₹20.00 (Incl. of all taxes)',
      source: 'Label Image',
      confidence: 98,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 72, width: 38, height: 14 },
    },
    netQuantity: {
      value: '100 g',
      source: 'Label Image',
      confidence: 97,
      status: 'DETECTED',
      boundingBox: { x: 54, y: 72, width: 36, height: 14 },
    },
    unitSalePrice: {
      value: '₹0.20 / g',
      source: 'OCR',
      confidence: 94,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 86, width: 38, height: 10 },
    },
    manufacturingDate: {
      value: '01/2026',
      source: 'OCR',
      confidence: 94,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 70, width: 38, height: 10 },
    },
    expiryOrBestBefore: {
      value: 'Best before 6 months from packaging',
      source: 'OCR',
      confidence: 93,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 80, width: 40, height: 10 },
    },
    countryOfOrigin: {
      value: 'Country of Origin: India',
      source: 'OCR',
      confidence: 98,
      status: 'DETECTED',
      boundingBox: { x: 8, y: 57, width: 42, height: 10 },
    },
    consumerCare: {
      value: 'Executive Consumer Cell: 1800-4254449 | feedback@britindia.com | 5/1A Hungerford St, Kolkata',
      source: 'OCR',
      confidence: 95,
      status: 'DETECTED',
      boundingBox: { x: 8, y: 28, width: 84, height: 12 },
    },
    otherDeclarations: {
      value: 'Vegetarian Green Dot • FSSAI Lic. No. 10015043001129',
      source: 'OCR',
      confidence: 97,
      status: 'DETECTED',
      boundingBox: { x: 82, y: 12, width: 12, height: 12 },
    },
  },
  evidenceMap: [
    {
      id: 'ev-1',
      requirement: 'Net Quantity Declaration',
      extractedValue: '100 g',
      source: 'Label Image',
      applicableRule: 'Rule 6(1)(c) & Rule 11 (Legal Metrology Rules, 2011)',
      validationResult: 'DETECTED',
      confidence: 97,
      boundingBox: { x: 54, y: 72, width: 36, height: 14, panel: 'front' },
      whyItApplies: 'Mandatory standard metric declaration on the Principal Display Panel (PDP).',
      whatWasFound: '"100 g" in standard SI units with mandatory spacing.',
      whatIsExpected: 'Net quantity in g, kg, ml, or l adhering to Schedule II numeral heights.',
      statutoryClause: 'Rule 6(1)(c) & Rule 11',
      actionRequired: 'No action required — compliant.',
    },
    {
      id: 'ev-2',
      requirement: 'Maximum Retail Price (MRP)',
      extractedValue: '₹20.00 (Incl. of all taxes)',
      source: 'Label Image',
      applicableRule: 'Rule 6(1)(e) (Price Transparency Mandate)',
      validationResult: 'DETECTED',
      confidence: 98,
      boundingBox: { x: 12, y: 72, width: 38, height: 14, panel: 'front' },
      whyItApplies: 'Prevents arbitrary retail overcharging and concealed taxes.',
      whatWasFound: '"MRP ₹20.00 (Incl. of all taxes)" clearly stated in INR.',
      whatIsExpected: 'Explicit currency symbol with "inclusive of all taxes" clause.',
      statutoryClause: 'Rule 6(1)(e)',
      actionRequired: 'No action required — compliant.',
    },
    {
      id: 'ev-3',
      requirement: 'Unit Sale Price (USP)',
      extractedValue: '₹0.20 / g',
      source: 'OCR',
      applicableRule: 'Rule 6(11) (Gazette Amendment for Consumer Comparability)',
      validationResult: 'DETECTED',
      confidence: 94,
      boundingBox: { x: 12, y: 86, width: 38, height: 10, panel: 'front' },
      whyItApplies: 'Allows consumers to compare prices per standard unit.',
      whatWasFound: '₹0.20 per gram declared adjacent to MRP.',
      whatIsExpected: 'Per gram/ml unit pricing on commodities containing >100g.',
      statutoryClause: 'Rule 6(11)',
      actionRequired: 'No action required — compliant.',
    },
    {
      id: 'ev-4',
      requirement: 'Manufacturer & Packer Address',
      extractedValue: 'Britannia Industries Limited, 5/1A, Hungerford Street, Kolkata - 700017',
      source: 'OCR',
      applicableRule: 'Rule 6(1)(a) (Manufacturer Traceability)',
      validationResult: 'DETECTED',
      confidence: 95,
      boundingBox: { x: 8, y: 40, width: 84, height: 16, panel: 'back' },
      whyItApplies: 'Ensures legal entity accountability and location traceability.',
      whatWasFound: 'Complete registered physical address with 6-digit postal PIN code.',
      whatIsExpected: 'Name and complete address of the manufacturer or packer.',
      statutoryClause: 'Rule 6(1)(a)',
      actionRequired: 'No action required — compliant.',
    },
    {
      id: 'ev-5',
      requirement: 'Consumer Grievance Care Cell',
      extractedValue: '1800-4254449 | feedback@britindia.com',
      source: 'OCR',
      applicableRule: 'Rule 6(1)(f) (Consumer Grievance Redressal)',
      validationResult: 'DETECTED',
      confidence: 95,
      boundingBox: { x: 8, y: 28, width: 84, height: 12, panel: 'back' },
      whyItApplies: 'Empowers consumers with immediate grievance contact.',
      whatWasFound: 'Toll-free telephone and dedicated electronic email address.',
      whatIsExpected: 'Designation, phone number, and email of consumer care executive.',
      statutoryClause: 'Rule 6(1)(f)',
      actionRequired: 'No action required — compliant.',
    },
  ],
  changesDetected: [],
  timeline: [
    {
      id: 'tl-1',
      scanNumber: 1,
      scanId: 'SCN-DEL-2026-0115',
      date: '15 Jan 2026, 10:30 AM',
      inspector: 'Insp. Dheeraj Patidar',
      badge: 'LM-DEL-4092',
      summary: 'Baseline Twin created. Complete statutory compliance confirmed.',
      changesDetected: ['Initial Twin Baseline Registration'],
      mrp: '₹20.00',
      netQuantity: '100 g',
      status: 'COMPLIANT',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    },
  ],
};

// SCAN 2 (Current Re-scan - 3 Changes detected including shrinkflation!)
export const demoScan2Current: EnrichedProductComplianceTwin = {
  id: 'twin-britannia-good-day-001',
  productId: 'prod-8901030010103',
  barcode: '8901030010103',
  productName: 'Britannia Good Day Butter Cookies',
  brand: 'Britannia',
  category: 'Snacks & Biscuits',
  status: 'POTENTIAL_ISSUE',
  riskPriority: 'HIGH_ATTENTION',
  riskReasoning: 'Shrinkflation detected: Net Quantity reduced from 100g to 90g (-10%) accompanied by +₹5.00 (+25%) MRP inflation. Consumer Care electronic grievance email missing on revised panel.',
  complianceScore: 68,
  lastInspectedAt: '16 Sep 2026, 04:15 PM',
  inspectorName: 'Insp. Dheeraj Patidar',
  inspectorBadge: 'LM-DEL-4092',
  imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
  panelsCaptured: {
    front: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    back: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    mrpPanel: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
  },
  identityProfile: {
    productName: {
      value: 'Britannia Good Day Butter Cookies',
      source: 'Label Image',
      confidence: 99,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 15, width: 75, height: 18 },
    },
    brand: {
      value: 'Britannia',
      source: 'Label Image',
      confidence: 99,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 10, width: 35, height: 12 },
    },
    manufacturer: {
      value: 'Britannia Industries Limited, Plot 42, Sector 8, Industrial Estate, Pantnagar, Uttarakhand - 263153',
      source: 'OCR',
      confidence: 94,
      status: 'DETECTED',
      boundingBox: { x: 8, y: 40, width: 84, height: 16 },
    },
    category: {
      value: 'Bakery & Biscuits (Packaged Food)',
      source: 'Database',
      confidence: 96,
      status: 'DETECTED',
    },
    batchLot: {
      value: 'B.No. GDB-260818-K',
      source: 'OCR',
      confidence: 93,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 60, width: 38, height: 10 },
    },
    mrp: {
      value: '₹25.00 (Incl. of all taxes)',
      source: 'Label Image',
      confidence: 98,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 72, width: 38, height: 14 },
    },
    netQuantity: {
      value: '90 g',
      source: 'Label Image',
      confidence: 96,
      status: 'DETECTED',
      boundingBox: { x: 54, y: 72, width: 36, height: 14 },
    },
    unitSalePrice: {
      value: '₹0.278 / g',
      source: 'OCR',
      confidence: 92,
      status: 'DETECTED',
      boundingBox: { x: 12, y: 86, width: 38, height: 10 },
    },
    manufacturingDate: {
      value: '08/2026',
      source: 'OCR',
      confidence: 95,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 70, width: 38, height: 10 },
    },
    expiryOrBestBefore: {
      value: 'Best before 6 months from packaging',
      source: 'OCR',
      confidence: 93,
      status: 'DETECTED',
      boundingBox: { x: 55, y: 80, width: 40, height: 10 },
    },
    countryOfOrigin: {
      value: 'Country of Origin: India',
      source: 'OCR',
      confidence: 98,
      status: 'DETECTED',
      boundingBox: { x: 8, y: 57, width: 42, height: 10 },
    },
    consumerCare: {
      value: 'Consumer Helpline: 1800-4254449 (Electronic Grievance Email Not Detected)',
      source: 'OCR',
      confidence: 81,
      status: 'LOW_CONFIDENCE',
      boundingBox: { x: 8, y: 28, width: 84, height: 12 },
    },
    otherDeclarations: {
      value: 'Vegetarian Green Dot • FSSAI Lic. No. 10015043001129 • Added Cashew Flavour',
      source: 'OCR',
      confidence: 95,
      status: 'DETECTED',
      boundingBox: { x: 82, y: 12, width: 12, height: 12 },
    },
  },
  evidenceMap: [
    {
      id: 'ev-qty',
      requirement: 'Net Quantity Declaration',
      extractedValue: '90 g (Changed from 100 g)',
      source: 'Label Image',
      applicableRule: 'Rule 6(1)(c) & Rule 11 (Shrinkflation Screening)',
      validationResult: 'POTENTIAL_ISSUE',
      confidence: 96,
      boundingBox: { x: 54, y: 72, width: 36, height: 14, panel: 'front' },
      whyItApplies: 'Weight reduction while maintaining similar package outline requires explicit Unit Sale Price recalibration to alert consumers.',
      whatWasFound: '"90 g" detected. Twin comparison indicates -10g reduction from baseline batch.',
      whatIsExpected: 'Accurate net quantity with corresponding updated Unit Sale Price (USP).',
      statutoryClause: 'Rule 6(1)(c) & Rule 6(11)',
      actionRequired: 'Verify whether pack dimensions maintain proportionate fill volume under Rule 5.',
    },
    {
      id: 'ev-mrp',
      requirement: 'Maximum Retail Price (MRP)',
      extractedValue: '₹25.00 (Changed from ₹20.00)',
      source: 'Label Image',
      applicableRule: 'Rule 6(1)(e) (Price Integrity)',
      validationResult: 'POTENTIAL_ISSUE',
      confidence: 98,
      boundingBox: { x: 12, y: 72, width: 38, height: 14, panel: 'front' },
      whyItApplies: 'Price changes must be verified against registered trade filings.',
      whatWasFound: '₹25.00 (Incl. of all taxes) detected — +25% hike.',
      whatIsExpected: 'Clear unambiguous price declaration without dual-pricing or stickers.',
      statutoryClause: 'Rule 6(1)(e)',
      actionRequired: 'Confirm no re-stickering or over-printing over old ₹20 MRP was applied.',
    },
    {
      id: 'ev-care',
      requirement: 'Consumer Grievance Care Cell',
      extractedValue: 'Helpline 1800-4254449 (Email Missing)',
      source: 'OCR',
      applicableRule: 'Rule 6(1)(f) (Mandatory Electronic Grievance Address)',
      validationResult: 'POTENTIAL_ISSUE',
      confidence: 79,
      boundingBox: { x: 8, y: 28, width: 84, height: 12, panel: 'back' },
      whyItApplies: 'Rule 6(1)(f) mandates postal address, phone, AND electronic email address for consumer contact.',
      whatWasFound: 'Phone helpline is printed; however, former email "feedback@britindia.com" is absent on current label print.',
      whatIsExpected: 'Mandatory electronic grievance email or web portal URL.',
      statutoryClause: 'Rule 6(1)(f), Packaged Commodities Rules 2011',
      actionRequired: 'Request manufacturer explanation regarding omission of digital contact channel.',
    },
    {
      id: 'ev-usp',
      requirement: 'Unit Sale Price (USP)',
      extractedValue: '₹0.278 / g',
      source: 'OCR',
      applicableRule: 'Rule 6(11) (Price per Unit Measure)',
      validationResult: 'DETECTED',
      confidence: 92,
      boundingBox: { x: 12, y: 86, width: 38, height: 10, panel: 'front' },
      whyItApplies: 'Mandatory on commodities >100g/ml or when quantity shifts.',
      whatWasFound: '₹0.278/g correctly computed based on ₹25.00 / 90 g.',
      whatIsExpected: 'Recalculated unit price rounded to nearest paise.',
      statutoryClause: 'Rule 6(11)',
      actionRequired: 'No action required — math is verified.',
    },
    {
      id: 'ev-mfg',
      requirement: 'Manufacturer Packaging Facility',
      extractedValue: 'Pantnagar Plant (Uttarakhand) - 263153',
      source: 'OCR',
      applicableRule: 'Rule 6(1)(a) (Manufacturing Facility Transfer)',
      validationResult: 'DETECTED',
      confidence: 94,
      boundingBox: { x: 8, y: 40, width: 84, height: 16, panel: 'back' },
      whyItApplies: 'Facility change from Kolkata to Pantnagar must carry valid factory license.',
      whatWasFound: 'New manufacturing facility address with PIN 263153.',
      whatIsExpected: 'Valid physical address of packaging unit.',
      statutoryClause: 'Rule 6(1)(a)',
      actionRequired: 'Verify factory license registration under State Legal Metrology office.',
    },
  ],
  changesDetected: [
    {
      id: 'ch-mrp',
      field: 'mrp',
      label: 'Maximum Retail Price (MRP)',
      previousValue: '₹20.00 (Incl. of all taxes)',
      currentValue: '₹25.00 (Incl. of all taxes)',
      status: 'CHANGED',
      diffType: 'mrp',
      statutoryNote: 'Price increased by +₹5.00 (+25%). Verify that retailers do not charge beyond revised MRP and that existing older inventory is sold at original ₹20 rate.',
      verificationRequired: true,
      previousBox: { x: 12, y: 72, width: 38, height: 14 },
      currentBox: { x: 12, y: 72, width: 38, height: 14 },
    },
    {
      id: 'ch-qty',
      field: 'netQuantity',
      label: 'Net Quantity (Shrinkflation Alert)',
      previousValue: '100 g',
      currentValue: '90 g',
      status: 'CHANGED',
      diffType: 'quantity',
      statutoryNote: 'Net weight reduced by 10g (-10%) while retail price simultaneously rose. Label verification required to confirm package volume compliance under Rule 5.',
      verificationRequired: true,
      previousBox: { x: 54, y: 72, width: 36, height: 14 },
      currentBox: { x: 54, y: 72, width: 36, height: 14 },
    },
    {
      id: 'ch-care',
      field: 'consumerCare',
      label: 'Consumer Care Electronic Email',
      previousValue: 'feedback@britindia.com | 1800-4254449',
      currentValue: '1800-4254449 (Email Not Found)',
      status: 'REMOVED_INFO',
      diffType: 'contact',
      statutoryNote: 'Required electronic communication channel appears omitted on this panel revision under Rule 6(1)(f).',
      verificationRequired: true,
      previousBox: { x: 8, y: 28, width: 84, height: 12 },
      currentBox: { x: 8, y: 28, width: 84, height: 12 },
    },
    {
      id: 'ch-mfg',
      field: 'manufacturer',
      label: 'Packaging Facility Location',
      previousValue: 'Hungerford St, Kolkata - 700017',
      currentValue: 'Sector 8, Pantnagar, Uttarakhand - 263153',
      status: 'CHANGED',
      diffType: 'manufacturer',
      statutoryNote: 'Production moved to Pantnagar manufacturing cluster. New address carries valid postal PIN 263153.',
      verificationRequired: false,
      previousBox: { x: 8, y: 40, width: 84, height: 16 },
      currentBox: { x: 8, y: 40, width: 84, height: 16 },
    },
    {
      id: 'ch-claim',
      field: 'otherDeclarations',
      label: 'New Sensory Claim Declaration',
      previousValue: 'Standard Butter Recipe',
      currentValue: 'Added Cashew Flavour declaration',
      status: 'NEW_INFO',
      diffType: 'declarations',
      statutoryNote: 'New flavour ingredient descriptor declared on lower front panel.',
      verificationRequired: false,
      previousBox: { x: 82, y: 12, width: 12, height: 12 },
      currentBox: { x: 82, y: 12, width: 12, height: 12 },
    },
  ],
  timeline: [
    {
      id: 'tl-1',
      scanNumber: 1,
      scanId: 'SCN-DEL-2026-0115',
      date: '15 Jan 2026, 10:30 AM',
      inspector: 'Insp. Dheeraj Patidar',
      badge: 'LM-DEL-4092',
      summary: 'Baseline Scan: 100g, ₹20. All declarations verified.',
      changesDetected: ['Baseline Profile Created'],
      mrp: '₹20.00',
      netQuantity: '100 g',
      status: 'COMPLIANT',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'tl-2',
      scanNumber: 2,
      scanId: 'SCN-DEL-2026-0916',
      date: '16 Sep 2026, 04:15 PM',
      inspector: 'Insp. Dheeraj Patidar',
      badge: 'LM-DEL-4092',
      summary: 'Re-inspection: ₹20 → ₹25 MRP changed, 100g → 90g shrinkflation detected, Email contact omitted.',
      changesDetected: ['MRP Changed (+₹5)', 'Net Qty Reduced (-10g)', 'Consumer Email Omitted', 'Plant Address Updated'],
      mrp: '₹25.00',
      netQuantity: '90 g',
      status: 'POTENTIAL_ISSUE',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&auto=format&fit=crop&q=80',
    },
  ],
};

// ----------------------------------------------------
// INSPECTION QUEUE INITIAL SEED DATA
// ----------------------------------------------------

export const initialInspectionQueue: InspectionQueueItem[] = [
  {
    id: 'queue-001',
    productId: 'prod-8901030010103',
    productName: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    barcode: '8901030010103',
    scannedAt: '16 Sep 2026, 04:15 PM',
    riskPriority: 'HIGH_ATTENTION',
    detectedConditionReason: 'Shrinkflation detected (-10% weight, +25% price increase) & electronic grievance address absent under Rule 6(1)(f).',
    complianceScore: 68,
    status: 'POTENTIAL_ISSUE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    flaggedItemsCount: 3,
    inspectorDecision: 'PENDING',
  },
  {
    id: 'queue-002',
    productId: 'scan-pkg-003',
    productName: "Haldiram's Nagpur Bhujia Sev",
    brand: "Haldiram's",
    barcode: '8904063200155',
    scannedAt: '16 Sep 2026, 02:45 PM',
    riskPriority: 'CRITICAL_REVIEW',
    detectedConditionReason: 'Unit Sale Price (USP) completely omitted on 450g package under Rule 6(11) and font size below 2.0mm threshold.',
    complianceScore: 48,
    status: 'NON-COMPLIANT',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&auto=format&fit=crop&q=80',
    flaggedItemsCount: 4,
    inspectorDecision: 'PENDING',
  },
  {
    id: 'queue-003',
    productId: 'scan-pkg-002',
    productName: 'Amul Pasteurised Salted Table Butter',
    brand: 'Amul',
    barcode: '8901262010054',
    scannedAt: '15 Sep 2026, 11:10 AM',
    riskPriority: 'NORMAL',
    detectedConditionReason: 'All mandatory declarations verified in standard dual language format (English/Hindi). High OCR confidence 98%.',
    complianceScore: 99,
    status: 'COMPLIANT',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80',
    flaggedItemsCount: 0,
    inspectorDecision: 'VERIFIED',
    inspectorRemarks: 'Regular market check. Full statutory conformity.',
  },
  {
    id: 'queue-004',
    productId: 'scan-pkg-004',
    productName: 'Nestlé Maggi 2-Minute Masala Noodles',
    brand: 'Maggi',
    barcode: '8901058852331',
    scannedAt: '14 Sep 2026, 03:20 PM',
    riskPriority: 'REVIEW_REQUIRED',
    detectedConditionReason: 'Net quantity formatting shows composite pack declaration (4 x 70g = 280g); verify individual sachet marking compliance.',
    complianceScore: 84,
    status: 'PARTIALLY COMPLIANT',
    thumbnailUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
    flaggedItemsCount: 1,
    inspectorDecision: 'PENDING',
  },
];

// ----------------------------------------------------
// LOCAL STORAGE PERSISTENCE HELPERS
// ----------------------------------------------------

const TWINS_STORAGE_KEY = 'packsure_digital_twins_v2';
const QUEUE_STORAGE_KEY = 'packsure_inspection_queue_v2';
const OFFLINE_STORAGE_KEY = 'packsure_offline_inspections_v2';

export function getStoredTwins(): EnrichedProductComplianceTwin[] {
  try {
    const raw = localStorage.getItem(TWINS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored twins', e);
  }
  return [demoScan2Current];
}

export function saveStoredTwins(twins: EnrichedProductComplianceTwin[]) {
  try {
    localStorage.setItem(TWINS_STORAGE_KEY, JSON.stringify(twins));
  } catch (e) {
    console.error('Failed to save twins', e);
  }
}

export function getStoredQueue(): InspectionQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored queue', e);
  }
  return initialInspectionQueue;
}

export function saveStoredQueue(queue: InspectionQueueItem[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save queue', e);
  }
}

export function getStoredOfflineRecords(): OfflineInspectionRecord[] {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse offline records', e);
  }
  return [];
}

export function saveStoredOfflineRecords(records: OfflineInspectionRecord[]) {
  try {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save offline records', e);
  }
}
