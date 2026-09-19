import { Language } from '../types';

export const translations = {
  en: {
    appName: 'PackSure AI',
    tagline: 'Scan. Verify. Comply.',
    subtitle: 'Smart Legal Metrology Compliance Scanner',
    govBadge: 'Legal Metrology (Packaged Commodities) Rules, 2011 Compliance System',
    
    // Nav
    navHome: 'Home',
    navScan: 'Scan Product',
    navHowItWorks: 'How It Works',
    navRules: 'Compliance Rules',
    navReports: 'Reports',
    navDashboard: 'Dashboard',
    navAbout: 'About',
    officerLogin: 'Officer Portal',
    getStarted: 'Start Free Scan',
    
    // Hero
    heroHeading: 'Smart Product Compliance Verification with AI',
    heroSubheading: 'Scan a packaged product and instantly identify missing or incorrect mandatory declarations under the Legal Metrology (Packaged Commodities) Rules, 2011.',
    btnScanProduct: 'Scan Product Now',
    btnViewDemo: 'View Interactive Demo',
    btnDashboard: 'Inspector Dashboard',
    
    // Hero diagram steps
    flowStep1: 'Product Package',
    flowStep2: 'Camera Scan',
    flowStep3: 'AI Analysis',
    flowStep4: 'Compliance Result',
    
    // Stats
    stat1Title: 'AI Powered Verification',
    stat1Desc: '99.4% OCR precision extracting Rule 6 mandatory declarations and font height metrics.',
    stat2Title: 'Fast Label Analysis',
    stat2Desc: 'Instant 2.3-second automated verification against 14+ statutory legal clauses.',
    stat3Title: 'Compliance Report',
    stat3Desc: 'Official downloadable inspection certificate with tamper-proof QR code & violation log.',

    // Problem section
    problemTitle: 'Why Packaged Product Verification Needs Automation',
    problemSubtitle: 'Traditional manual inspections face severe bottlenecks across retail hubs and supply chains.',
    problem1Title: 'Manual Verification',
    problem1Desc: 'Officers must manually inspect tiny fonts, abbreviations, and multi-sided product cartons with magnifying tools.',
    problem2Title: 'Time Consuming Process',
    problem2Desc: 'Physical paper audits take 25 to 45 minutes per product batch, causing major inspection backlogs.',
    problem3Title: 'Human Errors',
    problem3Desc: 'Overlooked mandatory details like Unit Sale Price, complete address, or customer care cell email IDs.',
    problem4Title: 'Difficult Rule Checking',
    problem4Desc: 'Frequent amendments to the Packaged Commodities Rules 2011 make manual compliance tracking complex.',

    // Solution section
    solutionTitle: 'Our AI-Powered Solution',
    solutionSubtitle: 'PackSure AI uses OCR and AI-based text analysis to extract information from product labels and compare it with required Legal Metrology declarations.',
    step1Title: 'Scan Product',
    step1Desc: 'Capture photo via mobile camera, upload front/back carton images, or scan product barcode.',
    step2Title: 'Extract Label Information',
    step2Desc: 'Advanced multimodal vision parses text, numerals, MRP stamps, and manufacturer blocks.',
    step3Title: 'Identify Mandatory Details',
    step3Desc: 'Classifies mandatory items: MRP, Net Qty, Dates, Address, Importer, and Customer Care.',
    step4Title: 'Compare With Rules',
    step4Desc: 'Checks against Rule 6(1)(a)-(g), Rule 11, and font height mandates under Legal Metrology Act.',
    step5Title: 'Generate Compliance Result',
    step5Desc: 'Outputs an instant compliance score (0-100%), violation breakdown, and penalty advisory.',

    // Scan page
    scanHeading: 'Scan Your Product Label',
    scanSubheading: 'Upload high-resolution label photos, use your camera, or choose a preset test sample to run live verification.',
    tabUpload: 'Upload Image',
    tabCamera: 'Take Photo',
    tabBarcode: 'Scan Barcode',
    dropzoneTitle: 'Drag and drop label image here, or browse files',
    dropzoneSubtitle: 'Supports JPG, PNG, WEBP (front, back, or side panel packaging)',
    capturePhotoBtn: 'Capture Label Photo',
    startCameraBtn: 'Open Live Camera',
    stopCameraBtn: 'Turn Off Camera',
    sampleSelectorTitle: 'Or select a preloaded sample product for instant demonstration:',
    sample1Name: 'Standard Biscuit Carton (Fully Compliant - 96%)',
    sample2Name: 'Spice Blend Pouch (Partially Compliant - 78%)',
    sample3Name: 'Laundry Detergent Tub (Non-Compliant - 42%)',
    sample4Name: 'Imported Dark Chocolate Bar (Partially Compliant - 70%)',
    btnRunAnalysis: 'Analyze Package with AI',
    analyzingTitle: 'AI is analyzing the product label...',
    analyzingStep1: 'Preprocessing image and enhancing contrast...',
    analyzingStep2: 'Extracting text and bounding boxes via OCR...',
    analyzingStep3: 'Parsing Rule 6(1) mandatory commodity declarations...',
    analyzingStep4: 'Computing compliance score and statutory penalties...',

    // Extracted Cards
    extractedHeader: 'Extracted Label Declarations',
    cardProductName: 'Product Name',
    cardManufacturer: 'Manufacturer / Packer',
    cardAddress: 'Full Address',
    cardNetQty: 'Net Quantity',
    cardMrp: 'Maximum Retail Price (MRP)',
    cardMfgDate: 'Manufacturing / Packing Date',
    cardConsumerCare: 'Consumer Care Details',
    cardOtherDeclarations: 'Other Mandatory Declarations',

    // Result Card
    resultHeading: 'Compliance Audit Assessment',
    complianceScoreLabel: 'Compliance Score',
    statusCompliant: 'COMPLIANT',
    statusPartial: 'PARTIALLY COMPLIANT',
    statusNonCompliant: 'NON-COMPLIANT',
    violationsDetected: 'Statutory Violations Detected',
    penaltiesClause: 'Applicable Penalties (Legal Metrology Act, 2009)',
    btnDownloadReport: 'Download Official Report (PDF)',
    btnScanAnother: 'Scan Another Product',
    btnViewCertificate: 'View Official Inspection Certificate',

    // Rules
    rulesHeading: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    rulesSubheading: 'Statutory requirements governing declarations on pre-packaged commodities sold in India.',
    searchRulesPlaceholder: 'Search rules by keyword (e.g., MRP, Unit Sale Price, Consumer Care, Address)...',
    allCategories: 'All Categories',

    // Dashboard
    dashboardHeading: 'Legal Metrology Enforcement Dashboard',
    dashboardSubheading: 'Real-time surveillance overview, compliance rate monitoring, and inspection statistics.',
    totalScanned: 'Total Products Scanned',
    compliantCount: 'Compliant Products',
    nonCompliantCount: 'Non-Compliant Products',
    avgScore: 'Average Compliance Score',

    // Reports
    reportsHeading: 'Product Inspection Records & Audit Trail',
    reportsSubheading: 'Archived inspection logs with detailed declaration breakdowns and certified reports.',
    searchReportsPlaceholder: 'Search by product name, manufacturer or barcode...',
    filterAll: 'All Statuses',

    // About
    aboutHeading: 'About PackSure AI',
    aboutMissionTitle: 'Modernizing Consumer Protection & Regulatory Compliance',
    techStackHeading: 'Core Technologies Powering PackSure AI',
    footerCopyright: 'PackSure AI – Ministry of Consumer Affairs, Food & Public Distribution aligned compliance platform.',
  },
  hi: {
    appName: 'पैकश्योर AI',
    tagline: 'स्कैन करें. सत्यापित करें. अनुपालन करें.',
    subtitle: 'स्मार्ट विधिक मापविज्ञान अनुपालन स्कैनर',
    govBadge: 'विधिक मापविज्ञान (पैक की गई वस्तुएं) नियम, 2011 अनुपालन प्रणाली',
    
    // Nav
    navHome: 'होम',
    navScan: 'उत्पाद स्कैन करें',
    navHowItWorks: 'यह कैसे काम करता है',
    navRules: 'अनुपालन नियम',
    navReports: 'रिपोर्ट्स',
    navDashboard: 'डैशबोर्ड',
    navAbout: 'परिचय',
    officerLogin: 'अधिकारी पोर्टल',
    getStarted: 'निःशुल्क स्कैन करें',
    
    // Hero
    heroHeading: 'AI के साथ स्मार्ट उत्पाद अनुपालन सत्यापन',
    heroSubheading: 'पैक किए गए उत्पाद को स्कैन करें और विधिक मापविज्ञान (पैक की गई वस्तुएं) नियम, 2011 के तहत गायब या गलत अनिवार्य घोषणाओं की तुरंत पहचान करें।',
    btnScanProduct: 'उत्पाद स्कैन करें',
    btnViewDemo: 'डेमो देखें',
    btnDashboard: 'निरीक्षक डैशबोर्ड',
    
    // Hero diagram steps
    flowStep1: 'उत्पाद पैकेज',
    flowStep2: 'कैमरा स्कैन',
    flowStep3: 'AI विश्लेषण',
    flowStep4: 'अनुपालन परिणाम',
    
    // Stats
    stat1Title: 'AI संचालित सत्यापन',
    stat1Desc: 'नियम 6 की अनिवार्य घोषणाओं और फॉन्ट ऊंचाई को निकालने में 99.4% OCR सटीकता।',
    stat2Title: 'तेज़ लेबल विश्लेषण',
    stat2Desc: '14+ वैधानिक कानूनी खंडों के विरुद्ध 2.3 सेकंड में स्वचालित त्वरित सत्यापन।',
    stat3Title: 'अनुपालन रिपोर्ट',
    stat3Desc: 'सुरक्षित क्यूआर कोड और उल्लंघन विवरण के साथ आधिकारिक डाउनलोड करने योग्य निरीक्षण प्रमाण पत्र।',

    // Problem section
    problemTitle: 'पैकेज्ड उत्पाद सत्यापन को ऑटोमेशन की आवश्यकता क्यों है',
    problemSubtitle: 'पारंपरिक मैन्युअल निरीक्षणों को खुदरा दुकानों और आपूर्ति श्रृंखलाओं में भारी बाधाओं का सामना करना पड़ता है।',
    problem1Title: 'मैन्युअल सत्यापन',
    problem1Desc: 'अधिकारियों को छोटे फॉन्ट, संक्षिप्ताक्षरों और बहु-पक्षीय कार्टन का लेंस से मैन्युअल निरीक्षण करना पड़ता है।',
    problem2Title: 'समय लेने वाली प्रक्रिया',
    problem2Desc: 'भौतिक कागजी ऑडिट में प्रति उत्पाद बैच 25 से 45 मिनट का समय लगता है, जिससे बड़ा बैकलॉग बनता है।',
    problem3Title: 'मानवीय गलतियाँ',
    problem3Desc: 'यूनिट विक्रय मूल्य, पूरा पता, या उपभोक्ता सेवा ईमेल जैसी अनिवार्य जानकारियों का छूट जाना।',
    problem4Title: 'कठिन नियम जांच',
    problem4Desc: 'पैक की गई वस्तुएं नियम 2011 में बार-बार होने वाले संशोधनों से मैन्युअल अनुपालन ट्रैक करना जटिल हो जाता है।',

    // Solution section
    solutionTitle: 'हमारा AI-संचालित समाधान',
    solutionSubtitle: 'पैकश्योर AI उत्पाद लेबल से जानकारी निकालने और आवश्यक विधिक मापविज्ञान घोषणाओं से मिलान करने के लिए OCR और AI-आधारित टेक्स्ट विश्लेषण का उपयोग करता है।',
    step1Title: 'उत्पाद स्कैन करें',
    step1Desc: 'मोबाइल कैमरे से फोटो लें, कार्टन छवियां अपलोड करें या बारकोड स्कैन करें।',
    step2Title: 'लेबल जानकारी निकालें',
    step2Desc: 'उन्नत मल्टीमॉडल विज़न टेक्स्ट, संख्याएं, एमआरपी स्टैम्प और निर्माता ब्लॉक को पढ़ता है।',
    step3Title: 'अनिवार्य विवरण पहचानें',
    step3Desc: 'एमआरपी, शुद्ध मात्रा, दिनांक, पता और उपभोक्ता देखभाल जैसे अनिवार्य बिंदुओं को वर्गीकृत करता है।',
    step4Title: 'नियमों के साथ तुलना करें',
    step4Desc: 'विधिक मापविज्ञान अधिनियम के नियम 6(1)(क)-(छ), नियम 11 और फॉन्ट ऊंचाई का परीक्षण करता है।',
    step5Title: 'अनुपालन परिणाम उत्पन्न करें',
    step5Desc: 'तुरंत अनुपालन स्कोर (0-100%), उल्लंघन सूची और दंड परामर्श प्रदान करता है।',

    // Scan page
    scanHeading: 'अपने उत्पाद का लेबल स्कैन करें',
    scanSubheading: 'उच्च-रिज़ॉल्यूशन लेबल फोटो अपलोड करें, कैमरे का उपयोग करें, या लाइव टेस्ट के लिए सैंपल चुनें।',
    tabUpload: 'छवि अपलोड करें',
    tabCamera: 'फोटो खींचें',
    tabBarcode: 'बारकोड स्कैन करें',
    dropzoneTitle: 'लेबल छवि को यहाँ खींचें और छोड़ें, या फ़ाइलें चुनें',
    dropzoneSubtitle: 'JPG, PNG, WEBP प्रारूप समर्थित हैं (फ्रंट, बैक या साइड पैनल)',
    capturePhotoBtn: 'फोटो कैप्चर करें',
    startCameraBtn: 'लाइव कैमरा शुरू करें',
    stopCameraBtn: 'कैमरा बंद करें',
    sampleSelectorTitle: 'या त्वरित प्रदर्शन के लिए पहले से मौजूद नमूना उत्पाद चुनें:',
    sample1Name: 'बिस्कुट पैक (पूर्ण अनुपालन - 96%)',
    sample2Name: 'मसाला मिश्रण पाउच (आंशिक अनुपालन - 78%)',
    sample3Name: 'डिटर्जेंट टब (गैर-अनुपालन - 42%)',
    sample4Name: 'आयातित डार्क चॉकलेट (आंशिक अनुपालन - 70%)',
    btnRunAnalysis: 'AI के साथ पैकेज का विश्लेषण करें',
    analyzingTitle: 'AI उत्पाद लेबल का विश्लेषण कर रहा है...',
    analyzingStep1: 'छवि तैयार करना और कंट्रास्ट बढ़ाना...',
    analyzingStep2: 'OCR द्वारा टेक्स्ट और सीमाएं निकालना...',
    analyzingStep3: 'नियम 6(1) अनिवार्य घोषणाओं का विश्लेषण...',
    analyzingStep4: 'अनुपालन स्कोर और कानूनी प्रावधानों की गणना...',

    // Extracted Cards
    extractedHeader: 'निकाली गई लेबल घोषणाएं',
    cardProductName: 'उत्पाद का नाम',
    cardManufacturer: 'निर्माता / पैकर',
    cardAddress: 'पूरा पता',
    cardNetQty: 'शुद्ध मात्रा (Net Qty)',
    cardMrp: 'अधिकतम खुदरा मूल्य (MRP)',
    cardMfgDate: 'निर्माण / पैकिंग की तिथि',
    cardConsumerCare: 'उपभोक्ता सेवा विवरण',
    cardOtherDeclarations: 'अन्य अनिवार्य घोषणाएं',

    // Result Card
    resultHeading: 'अनुपालन ऑडिट मूल्यांकन',
    complianceScoreLabel: 'अनुपालन स्कोर',
    statusCompliant: 'अनुपालन योग्य (COMPLIANT)',
    statusPartial: 'आंशिक अनुपालन (PARTIALLY COMPLIANT)',
    statusNonCompliant: 'गैर-अनुपालन (NON-COMPLIANT)',
    violationsDetected: 'पहचाने गए वैधानिक उल्लंघन',
    penaltiesClause: 'लागू दंड प्रावधान (विधिक मापविज्ञान अधिनियम, 2009)',
    btnDownloadReport: 'आधिकारिक रिपोर्ट डाउनलोड करें (PDF)',
    btnScanAnother: 'दूसरा उत्पाद स्कैन करें',
    btnViewCertificate: 'निरीक्षण प्रमाण पत्र देखें',

    // Rules
    rulesHeading: 'विधिक मापविज्ञान (पैक की गई वस्तुएं) नियम, 2011',
    rulesSubheading: 'भारत में बेची जाने वाली पूर्व-पैक वस्तुओं पर घोषणाओं को नियंत्रित करने वाले वैधानिक नियम।',
    searchRulesPlaceholder: 'नियम खोजें (उदा: MRP, यूनिट विक्रय मूल्य, उपभोक्ता देखभाल, पता)...',
    allCategories: 'सभी श्रेणियां',

    // Dashboard
    dashboardHeading: 'विधिक मापविज्ञान प्रवर्तन डैशबोर्ड',
    dashboardSubheading: 'वास्तविक समय निगरानी अवलोकन, अनुपालन दर और निरीक्षण सांख्यिकी।',
    totalScanned: 'कुल स्कैन किए गए उत्पाद',
    compliantCount: 'अनुपालक उत्पाद',
    nonCompliantCount: 'गैर-अनुपालक उत्पाद',
    avgScore: 'औसत अनुपालन स्कोर',

    // Reports
    reportsHeading: 'उत्पाद निरीक्षण रिकॉर्ड एवं ऑडिट ट्रेल',
    reportsSubheading: 'विस्तृत घोषणा विवरण और प्रमाणित रिपोर्ट के साथ संग्रहीत निरीक्षण लॉग।',
    searchReportsPlaceholder: 'उत्पाद नाम, निर्माता या बारकोड से खोजें...',
    filterAll: 'सभी स्थितियां',

    // About
    aboutHeading: 'पैकश्योर AI के बारे में',
    aboutMissionTitle: 'उपभोक्ता संरक्षण और नियामक अनुपालन का आधुनिकीकरण',
    techStackHeading: 'पैकश्योर AI को संचालित करने वाली प्रमुख तकनीकें',
    footerCopyright: 'पैकश्योर AI – उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय के अनुरूप अनुपालन मंच।',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
