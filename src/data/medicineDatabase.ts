/**
 * PackSure AI – Smart Medicine Safety Database & Clinical Logic Engine
 * Provides structured pharmacological data and rule-based safety screening.
 * Strictly adheres to non-prescriptive, safety-first informational boundaries.
 */

import { MedicineInfo, UserHealthProfile, MedicineSafetyAnalysis, MedicineConflictItem, PossibleCauseCategory } from '../types';

export const VERIFIED_MEDICINE_DATABASE: MedicineInfo[] = [
  {
    id: 'med-dolo650',
    name: 'Dolo-650 Tablet',
    brand: 'Dolo',
    barcode: '8901148201201',
    activeIngredient: 'Paracetamol (Acetaminophen)',
    strength: '650 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Micro Labs Limited',
    category: 'Antipyretic & Analgesic',
    mrp: '₹34.15 per strip of 15 tablets',
    schedule: 'OTC',
    generalUses: [
      'Relief from mild to moderate fever',
      'Management of acute headaches and migraine aches',
      'Relief of body aches, joint pain, and toothache',
      'Post-vaccination pyrexia and flu-like discomfort',
    ],
    warnings: [
      'Do not exceed maximum 4 tablets (2600 mg) per day without medical supervision.',
      'Absolute daily ceiling for adults is 4000 mg across all medication sources.',
      'Strictly avoid alcohol consumption while taking Paracetamol due to heightened liver toxicity risk.',
      'Leave at least 4 to 6 hours between successive doses.',
    ],
    contraindications: [
      'Severe hepatic impairment / active acute liver disease',
      'Severe chronic renal failure (without dose adjustment)',
      'Known hypersensitivity or anaphylactic allergy to Paracetamol',
      'Concomitant use of multiple products containing Paracetamol (risk of accidental overdose)',
    ],
    commonSideEffects: ['Mild nausea', 'Epigastric discomfort', 'Constipation', 'Temporary drowsiness'],
    seriousSideEffects: [
      'Hepatotoxicity / acute liver injury (especially with overdose or chronic alcohol intake)',
      'Allergic skin reactions (Stevens-Johnson syndrome, angioedema)',
      'Thrombocytopenia or leukopenia (rare)',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Warfarin / Blood Thinners',
        severity: 'HIGH',
        effect: 'Prolonged high-dose Paracetamol can increase INR and enhance anticoagulant effects, raising bleeding hazard.',
      },
      {
        interactingDrug: 'Alcohol',
        severity: 'HIGH',
        effect: 'Induces CYP2E1 enzymes, significantly increasing toxic NAPQI metabolites and severe liver cell damage.',
      },
      {
        interactingDrug: 'Other Cold / Flu Combos',
        severity: 'HIGH',
        effect: 'Many OTC cold syrups contain hidden Paracetamol, leading to cumulative overdose over 4000 mg/day.',
      },
      {
        interactingDrug: 'Carbamazepine / Phenytoin',
        severity: 'MEDIUM',
        effect: 'Anti-epileptics increase metabolism of Paracetamol to toxic intermediates, reducing therapeutic efficacy and straining liver.',
      },
    ],
    maxDailyDose: 'Maximum 4000 mg (4 grams) per 24 hours for healthy adults; lower in elderly.',
    reliefTimeline: 'Antipyretic and analgesic action typically begins within 30 to 60 minutes after oral ingestion.',
    instructions: 'Take orally with a full glass of water after food to reduce gastric discomfort. Do not chew or crush modified-release forms.',
  },
  {
    id: 'med-crocin',
    name: 'Crocin Advance 500mg Tablet',
    brand: 'Crocin',
    barcode: '8901571001018',
    activeIngredient: 'Paracetamol with Fast-Release Optizorb',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd (GSK)',
    category: 'Antipyretic & Analgesic',
    mrp: '₹22.50 per strip of 20 tablets',
    schedule: 'OTC',
    generalUses: [
      'Quick reduction of fever and body temperature',
      'Relief of mild to moderate dental and muscular pain',
      'Alleviation of menstrual cramps and tension headaches',
    ],
    warnings: [
      'Rapid absorption formulation. Do not combine with other Paracetamol medications.',
      'Maintain an interval of at least 4 hours between doses.',
      'Do not consume with alcohol.',
    ],
    contraindications: [
      'Severe hepatic failure or acute hepatitis',
      'Known allergy to Paracetamol or Optizorb excipients',
    ],
    commonSideEffects: ['Mild stomach upset', 'Nausea', 'Transient lightheadedness'],
    seriousSideEffects: ['Liver enzyme elevation', 'Pruritus / urticaria skin rash'],
    drugInteractions: [
      {
        interactingDrug: 'Warfarin',
        severity: 'HIGH',
        effect: 'Regular daily use may enhance anticoagulant effect.',
      },
      {
        interactingDrug: 'Cholestyramine',
        severity: 'LOW',
        effect: 'Reduces Paracetamol absorption if taken within 1 hour.',
      },
    ],
    maxDailyDose: '8 tablets (4000 mg) per 24 hours for adults.',
    reliefTimeline: 'Accelerated release begins action in 15 to 30 minutes.',
    instructions: 'Take with half glass of water. Suitable on an empty stomach or with food.',
  },
  {
    id: 'med-pantocid',
    name: 'Pantocid 40 Tablet',
    brand: 'Pantocid',
    barcode: '8901117001402',
    activeIngredient: 'Pantoprazole Sodium',
    strength: '40 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Sun Pharmaceutical Industries Ltd',
    category: 'Proton Pump Inhibitor (PPI) / Antacid',
    mrp: '₹168.00 per strip of 15 tablets',
    schedule: 'Schedule H',
    generalUses: [
      'Gastroesophageal reflux disease (GERD) & severe heartburn',
      'Healing and prevention of gastric and duodenal ulcers',
      'Protection against NSAID-induced gastrointestinal erosion',
      'Zollinger-Ellison syndrome hypersecretion',
    ],
    warnings: [
      'Long-term continuous use (>1 year) may decrease magnesium levels and vitamin B12 absorption.',
      'Should be swallowed whole with water 30-60 minutes before morning breakfast.',
      'Do not crush, break, or chew enteric-coated tablets.',
    ],
    contraindications: [
      'Hypersensitivity to substituted benzimidazoles (Pantoprazole, Omeprazole, Rabeprazole)',
      'Co-administration with Rilpivirine-containing antiviral products',
    ],
    commonSideEffects: ['Headache', 'Diarrhea or flatulence', 'Abdominal pain', 'Dry mouth'],
    seriousSideEffects: [
      'Clostridium difficile-associated severe diarrhea',
      'Bone fractures (hip/wrist/spine) with prolonged high-dose therapy',
      'Hypomagnesemia leading to tetany or arrhythmias (rare long-term)',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Clopidogrel (Blood Thinner)',
        severity: 'MEDIUM',
        effect: 'Minor reduction in antiplatelet activation compared to Omeprazole, but clinical monitoring recommended.',
      },
      {
        interactingDrug: 'Ketoconazole / Itraconazole',
        severity: 'MEDIUM',
        effect: 'Decreased gastric acidity impairs antifungal tablet absorption.',
      },
      {
        interactingDrug: 'Iron Supplements',
        severity: 'LOW',
        effect: 'Absorption of oral iron salts may be diminished.',
      },
    ],
    maxDailyDose: 'Typically 40 mg once daily; up to 80 mg in hypersecretory conditions.',
    reliefTimeline: 'Inhibits acid pump within 2 hours; full symptom relief develops over 2-3 days.',
    instructions: 'Swallow whole strictly 30 to 60 minutes BEFORE the first meal of the day (breakfast).',
  },
  {
    id: 'med-augmentin',
    name: 'Augmentin 625 Duo Tablet',
    brand: 'Augmentin',
    barcode: '8901571002206',
    activeIngredient: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    strength: '625 mg',
    dosageForm: 'Tablet',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd (GSK)',
    category: 'Beta-Lactam Antibiotic + Beta-Lactamase Inhibitor',
    mrp: '₹223.50 per strip of 10 tablets',
    schedule: 'Schedule H1',
    generalUses: [
      'Bacterial respiratory tract infections (sinusitis, bronchitis, pneumonia)',
      'Ear, nose, and throat bacterial infections (otitis media)',
      'Urinary tract infections (UTI) and pyelonephritis',
      'Skin, soft tissue, and dental abscess bacterial infections',
    ],
    warnings: [
      'Prescription-only medicine. Must NEVER be taken for common viral colds or flu.',
      'Complete the entire prescribed course even if symptoms resolve early to avoid antibiotic resistance.',
      'Take at the start of a meal to minimize gastrointestinal upset.',
    ],
    contraindications: [
      'History of penicillin or cephalosporin allergy (can cause fatal anaphylaxis)',
      'Previous history of Augmentin-associated cholestatic jaundice or liver impairment',
      'Infectious mononucleosis (high risk of developing widespread erythematous rash)',
    ],
    commonSideEffects: ['Diarrhea or loose stools', 'Nausea / vomiting', 'Candida oral/vaginal thrush', 'Mild abdominal cramps'],
    seriousSideEffects: [
      'Severe anaphylactic shock / swelling of lips, throat, tongue',
      'Antibiotic-associated pseudomembranous colitis',
      'Cholestatic jaundice / acute hepatitis (more frequent in elderly males)',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Allopurinol (Uric Acid Medicine)',
        severity: 'MEDIUM',
        effect: 'Significantly increases the risk of developing allergic skin rashes.',
      },
      {
        interactingDrug: 'Oral Contraceptives',
        severity: 'MEDIUM',
        effect: 'May reduce gut flora and slightly impair enterohepatic circulation of estrogens.',
      },
      {
        interactingDrug: 'Methotrexate',
        severity: 'HIGH',
        effect: 'Amoxicillin decreases renal clearance of methotrexate, causing toxic systemic buildup.',
      },
    ],
    maxDailyDose: 'As determined by registered physician (commonly 625 mg twice daily for 5-7 days).',
    reliefTimeline: 'Bacterial load begins reducing within 24 to 48 hours; finish prescribed duration.',
    instructions: 'Take immediately with or just before food to optimize clavulanic acid absorption and avoid nausea.',
  },
  {
    id: 'med-combiflam',
    name: 'Combiflam Tablet',
    brand: 'Combiflam',
    barcode: '8901043001021',
    activeIngredient: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    strength: '725 mg Combined',
    dosageForm: 'Tablet',
    manufacturer: 'Sanofi India Limited',
    category: 'NSAID + Analgesic Combination',
    mrp: '₹51.00 per strip of 20 tablets',
    schedule: 'Schedule H',
    generalUses: [
      'Relief of acute inflammatory pain and swelling',
      'Arthritic pain, spondylitis, and musculoskeletal sprains',
      'Severe dental pain and post-extraction soreness',
      'Fever accompanied by intense body ache',
    ],
    warnings: [
      'Contains NSAID (Ibuprofen). High risk of stomach ulcers and gastrointestinal bleeding.',
      'NEVER take on an empty stomach; always consume after a substantial meal.',
      'Use the lowest effective dose for the shortest duration possible.',
      'Do not combine with other painkillers or aspirin.',
    ],
    contraindications: [
      'Active peptic ulcer disease or history of recurrent GI bleeding',
      'Severe heart failure, uncontrolled hypertension, or post-CABG heart surgery',
      'Severe chronic kidney disease (CKD) or renal artery stenosis',
      'Aspirin-induced asthma / bronchospasm history',
      'Third trimester of pregnancy (can cause premature closure of ductus arteriosus)',
    ],
    commonSideEffects: ['Heartburn / acid reflux', 'Stomach pain', 'Nausea', 'Dizziness', 'Fluid retention'],
    seriousSideEffects: [
      'Gastric perforation or severe gastrointestinal hemorrhage (black tarry stools)',
      'Acute kidney injury / renal failure',
      'Increased cardiovascular thromboembolic events (stroke, myocardial infarction)',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Blood Thinners (Warfarin / Aspirin / Heparin)',
        severity: 'HIGH',
        effect: 'Profoundly increases major gastrointestinal and systemic hemorrhage risk.',
      },
      {
        interactingDrug: 'Antihypertensives (ACE Inhibitors / ARBs / Beta Blockers)',
        severity: 'HIGH',
        effect: 'NSAIDs blunt antihypertensive efficacy and can induce sudden acute kidney failure.',
      },
      {
        interactingDrug: 'Corticosteroids (Prednisone)',
        severity: 'HIGH',
        effect: 'Synergistic destruction of gastric mucosal barrier, multiplying ulcer risk.',
      },
    ],
    maxDailyDose: 'Maximum 3 tablets per 24 hours under medical supervision.',
    reliefTimeline: 'Pain and inflammation relief begins in 30 to 45 minutes.',
    instructions: 'Take strictly after a meal with a full glass of milk or water. Never take lying down immediately.',
  },
  {
    id: 'med-azithral',
    name: 'Azithral 500 Tablet',
    brand: 'Azithral',
    barcode: '8901235003012',
    activeIngredient: 'Azithromycin',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    category: 'Macrolide Antibiotic',
    mrp: '₹132.50 per strip of 5 tablets',
    schedule: 'Schedule H1',
    generalUses: [
      'Bacterial pharyngitis, tonsillitis, and community-acquired pneumonia',
      'Chlamydia and uncomplicated genital bacterial infections',
      'Bacterial skin infections and typhoid enteric fever alternative',
    ],
    warnings: [
      'Must not be taken without a registered medical practitioner prescription.',
      'Potential to cause QT interval prolongation on cardiac ECG.',
      'Do not take antacids containing aluminum or magnesium at the same time.',
    ],
    contraindications: [
      'Known hypersensitivity to Azithromycin, Erythromycin, or any macrolide antibiotic',
      'History of cholestatic jaundice or hepatic dysfunction associated with previous azithromycin use',
      'Congenital long QT syndrome or severe uncorrected hypokalemia',
    ],
    commonSideEffects: ['Diarrhea', 'Nausea and vomiting', 'Abdominal cramping', 'Temporary taste disturbance'],
    seriousSideEffects: [
      'Cardiac arrhythmia / Torsades de pointes (rare)',
      'Severe liver failure',
      'Anaphylaxis and angioedema',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Antacids (Aluminium / Magnesium)',
        severity: 'MEDIUM',
        effect: 'Decreases peak serum concentrations of Azithromycin; separate doses by at least 2 hours.',
      },
      {
        interactingDrug: 'Digoxin',
        severity: 'HIGH',
        effect: 'Increases serum digoxin levels leading to digitalis toxicity.',
      },
    ],
    maxDailyDose: '500 mg once daily, typically for 3 or 5 consecutive days.',
    reliefTimeline: 'Tissue levels build over 24-48 hours; has long post-antibiotic effect lasting several days after course.',
    instructions: 'Take once daily at the same time each day, 1 hour before or 2 hours after food.',
  },
  {
    id: 'med-cetzine',
    name: 'Cetzine 10mg Tablet',
    brand: 'Cetzine',
    barcode: '8901148005014',
    activeIngredient: 'Cetirizine Hydrochloride',
    strength: '10 mg',
    dosageForm: 'Tablet',
    manufacturer: "Dr. Reddy's Laboratories Ltd",
    category: 'Second-Generation Antihistamine',
    mrp: '₹24.00 per strip of 10 tablets',
    schedule: 'Schedule H',
    generalUses: [
      'Allergic rhinitis (sneezing, runny nose, itchy watery eyes)',
      'Chronic idiopathic urticaria (hives, intense skin itching)',
      'Allergic dermatitis and seasonal pollen allergies',
    ],
    warnings: [
      'May cause mild sedation in sensitive individuals; exercise caution when driving or operating machinery.',
      'Avoid concurrent alcohol consumption as it intensifies drowsiness.',
      'Dose adjustment required in patients with renal clearance impairment.',
    ],
    contraindications: [
      'Severe end-stage renal disease (creatinine clearance < 10 ml/min)',
      'Hypersensitivity to Cetirizine or Hydroxyzine',
    ],
    commonSideEffects: ['Mild drowsiness', 'Dry mouth', 'Headache', 'Fatigue'],
    seriousSideEffects: ['Urinary retention in prostatic enlargement', 'Severe allergic angioedema (extremely rare)'],
    drugInteractions: [
      {
        interactingDrug: 'Alcohol / Sedatives / Sleeping Pills',
        severity: 'HIGH',
        effect: 'Severe central nervous system depression, extreme somnolence, and impaired motor reflexes.',
      },
      {
        interactingDrug: 'Theophylline',
        severity: 'LOW',
        effect: 'Slight decrease in clearance of Cetirizine.',
      },
    ],
    maxDailyDose: '10 mg (one tablet) once daily for adults and children aged 12+.',
    reliefTimeline: 'Antihistaminic action begins within 20 to 60 minutes and persists for 24 full hours.',
    instructions: 'Take once daily, preferably in the evening before bedtime with water.',
  },
  {
    id: 'med-glycomet',
    name: 'Glycomet 500 Tablet',
    brand: 'Glycomet',
    barcode: '8901182004051',
    activeIngredient: 'Metformin Hydrochloride',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'USV Private Limited',
    category: 'Biguanide Antidiabetic',
    mrp: '₹22.50 per strip of 20 tablets',
    schedule: 'Schedule H',
    generalUses: [
      'First-line treatment of Type 2 Diabetes Mellitus',
      'Improves peripheral insulin sensitivity and reduces hepatic glucose production',
      'Polycystic ovary syndrome (PCOS) management (off-label under physician guidance)',
    ],
    warnings: [
      'Rare but life-threatening risk of Lactic Acidosis, especially in renal impairment.',
      'Must temporarily discontinue prior to iodinated radiocontrast imaging procedures.',
      'Long-term therapy can cause Vitamin B12 deficiency; monitor annually.',
    ],
    contraindications: [
      'Severe renal dysfunction (eGFR < 30 mL/min/1.73 m²)',
      'Acute or chronic metabolic acidosis, including diabetic ketoacidosis',
      'Severe congestive heart failure or acute tissue hypoxia conditions',
      'Excessive acute or chronic alcohol abuse',
    ],
    commonSideEffects: ['Diarrhea / soft stools', 'Abdominal bloating', 'Metallic taste in mouth', 'Loss of appetite'],
    seriousSideEffects: [
      'Lactic acidosis (muscle pain, hypothermia, severe somnolence, respiratory distress)',
      'Megaloblastic anemia due to B12 malabsorption',
    ],
    drugInteractions: [
      {
        interactingDrug: 'Iodinated Radiographic Contrast Agents',
        severity: 'HIGH',
        effect: 'Acute contrast-induced nephropathy can lead to Metformin accumulation and fatal lactic acidosis.',
      },
      {
        interactingDrug: 'Alcohol',
        severity: 'HIGH',
        effect: 'Multiplies risk of lactic acidosis and hypoglycemia.',
      },
    ],
    maxDailyDose: 'Typically titrated up to 2000 mg/day in divided doses with meals.',
    reliefTimeline: 'Blood glucose reduction begins within days; full glycemic equilibrium takes 2 weeks.',
    instructions: 'Take strictly WITH or immediately after meals to minimize gastrointestinal adverse effects.',
  },
];

/**
 * Intelligent Safety Analysis Engine
 * Screens medicine against user profile without making definitive clinical diagnosis.
 */
export function analyzeMedicineSafety(
  medicine: MedicineInfo,
  profile: UserHealthProfile
): MedicineSafetyAnalysis {
  const conflicts: MedicineConflictItem[] = [];

  const medNameLower = medicine.name.toLowerCase();
  const activeLower = medicine.activeIngredient.toLowerCase();

  // 1. Check Allergies
  profile.allergies.forEach((allergy) => {
    const aLower = allergy.toLowerCase();
    if (activeLower.includes(aLower) || medNameLower.includes(aLower) || (aLower === 'nsaids' && medicine.category.includes('NSAID'))) {
      conflicts.push({
        id: `conf-allergy-${allergy}`,
        type: 'ALLERGY_WARNING',
        severity: 'RED',
        title: `Known Allergy Conflict: ${allergy}`,
        description: `You have reported an allergy to "${allergy}". This product contains ${medicine.activeIngredient}, which presents an acute allergic hypersensitivity risk.`,
        recommendation: 'DO NOT TAKE. Seek an alternative non-cross-reactive medication from your doctor.',
      });
    }
  });

  // 2. Check Existing Conditions (Contraindications)
  profile.existingConditions.forEach((cond) => {
    const cLower = cond.toLowerCase();

    // Liver Disease + Paracetamol
    if ((cLower.includes('liver') || cLower.includes('hepatic')) && activeLower.includes('paracetamol')) {
      conflicts.push({
        id: 'conf-liver-paracetamol',
        type: 'CONTRAINDICATION',
        severity: 'RED',
        title: 'Critical Hepatic Warning: Liver Disease vs Paracetamol',
        description: `Paracetamol is primarily metabolized via liver glucuronidation and sulfation. In chronic liver impairment, toxic intermediate (NAPQI) clearance is impaired, escalating hepatotoxicity hazard.`,
        recommendation: 'Consult a hepatologist or physician before taking any Paracetamol-based formulations.',
      });
    }

    // Peptic Ulcers + NSAIDs
    if ((cLower.includes('ulcer') || cLower.includes('gastric') || cLower.includes('stomach')) && (medicine.category.includes('NSAID') || activeLower.includes('ibuprofen'))) {
      conflicts.push({
        id: 'conf-ulcer-nsaid',
        type: 'CONTRAINDICATION',
        severity: 'RED',
        title: 'High Bleeding Risk: Peptic Ulcer vs NSAID',
        description: `Ibuprofen inhibits COX-1 enzymes, depleting cytoprotective prostaglandins in gastric mucosa and creating high risk of ulcer reactivation or GI hemorrhage.`,
        recommendation: 'AVOID this product. Prefer gastro-safe alternatives like pure Paracetamol under medical guidance.',
      });
    }

    // Kidney Disease + NSAID / Metformin
    if ((cLower.includes('kidney') || cLower.includes('renal')) && (medicine.category.includes('NSAID') || activeLower.includes('ibuprofen'))) {
      conflicts.push({
        id: 'conf-kidney-nsaid',
        type: 'CONTRAINDICATION',
        severity: 'RED',
        title: 'Renal Perfusion Warning: Kidney Disease vs NSAID',
        description: `NSAIDs inhibit renal prostaglandins, causing vasoconstriction of afferent renal arterioles, which can induce sudden acute kidney decline.`,
        recommendation: 'Avoid NSAIDs in kidney disease without nephrologist approval.',
      });
    }

    if ((cLower.includes('kidney') || cLower.includes('renal')) && activeLower.includes('metformin')) {
      conflicts.push({
        id: 'conf-kidney-metformin',
        type: 'CONTRAINDICATION',
        severity: 'YELLOW',
        title: 'Renal Clearance Check Required: Metformin',
        description: `Metformin is eliminated unchanged by renal excretion. Renal impairment can result in drug accumulation and risk of lactic acidosis. Check current eGFR levels.`,
        recommendation: 'Ensure your eGFR is above 30-45 mL/min before continuing Metformin.',
      });
    }

    // High BP + NSAID
    if ((cLower.includes('hypertension') || cLower.includes('blood pressure') || cLower.includes('bp')) && medicine.category.includes('NSAID')) {
      conflicts.push({
        id: 'conf-bp-nsaid',
        type: 'PRECAUTION',
        severity: 'YELLOW',
        title: 'Blood Pressure Elevation Concern',
        description: `NSAIDs promote renal sodium retention and attenuate the efficacy of antihypertensive agents (ACE inhibitors, beta-blockers).`,
        recommendation: 'Monitor blood pressure closely. Limit NSAID usage to 24-48 hours only if approved.',
      });
    }

    // Asthma + Aspirin / NSAID
    if (cLower.includes('asthma') && (medicine.category.includes('NSAID') || activeLower.includes('ibuprofen'))) {
      conflicts.push({
        id: 'conf-asthma-nsaid',
        type: 'PRECAUTION',
        severity: 'YELLOW',
        title: 'Aspirin-Exacerbated Respiratory Disease (AERD) Caution',
        description: `Up to 10-20% of adult asthmatics possess sensitivity to NSAIDs, which can precipitate acute bronchospasm.`,
        recommendation: 'Verify if you have safely tolerated Ibuprofen in the past before consumption.',
      });
    }
  });

  // 3. Check Current Medicines (Drug Interactions)
  profile.currentMedicines.forEach((currMed) => {
    const curLower = currMed.toLowerCase();

    // Warfarin / Blood Thinners + Paracetamol / NSAID
    if (curLower.includes('warfarin') || curLower.includes('blood thinner') || curLower.includes('heparin') || curLower.includes('aspirin')) {
      if (medicine.category.includes('NSAID') || activeLower.includes('ibuprofen')) {
        conflicts.push({
          id: 'conf-thin-nsaid',
          type: 'DRUG_INTERACTION',
          severity: 'RED',
          title: 'Major Hemorrhage Risk: Anticoagulant + NSAID',
          description: `Combining blood thinners with Ibuprofen damages platelets and gastric lining simultaneously, multiplying catastrophic internal bleeding hazard.`,
          recommendation: 'DO NOT COMBINE without emergency prescription oversight.',
        });
      } else if (activeLower.includes('paracetamol')) {
        conflicts.push({
          id: 'conf-thin-para',
          type: 'DRUG_INTERACTION',
          severity: 'YELLOW',
          title: 'INR Monitoring Needed: Blood Thinner + Paracetamol',
          description: `Frequent or high-dose Paracetamol (>2g/day for multiple days) can elevate prothrombin time (INR) in patients taking Warfarin.`,
          recommendation: 'Short-term single dose is generally acceptable, but frequent monitoring is advised.',
        });
      }
    }

    // Duplicate Paracetamol Detection
    if ((curLower.includes('paracetamol') || curLower.includes('dolo') || curLower.includes('crocin') || curLower.includes('calpol')) && activeLower.includes('paracetamol')) {
      conflicts.push({
        id: 'conf-dup-paracetamol',
        type: 'DOSE_CONCERN',
        severity: 'RED',
        title: 'Duplicate Paracetamol Exposure Alert',
        description: `You are already taking a product containing Paracetamol (${currMed}). Taking ${medicine.name} at the same time creates an acute risk of exceeding the safe 4000 mg/day ceiling.`,
        recommendation: 'Do NOT take both medicines simultaneously. Choose one or consult your pharmacist.',
      });
    }
  });

  // 4. Check Pregnancy / Nursing
  if (profile.isPregnantOrNursing) {
    if (medicine.category.includes('NSAID') || activeLower.includes('ibuprofen')) {
      conflicts.push({
        id: 'conf-preg-nsaid',
        type: 'CONTRAINDICATION',
        severity: 'RED',
        title: 'Pregnancy Warning: NSAIDs Avoided in 3rd Trimester',
        description: `NSAID exposure in the third trimester can cause premature closure of fetal ductus arteriosus and oligohydramnios (low amniotic fluid).`,
        recommendation: 'Strictly avoid NSAIDs in pregnancy unless explicitly directed by your obstetrician.',
      });
    } else if (medicine.schedule.includes('Schedule H1') || medicine.category.includes('Antibiotic')) {
      conflicts.push({
        id: 'conf-preg-abx',
        type: 'PRECAUTION',
        severity: 'YELLOW',
        title: 'Pregnancy Safety Category Review',
        description: `Antibiotics require precise maternal-fetal benefit vs risk assessment by your doctor before initiation.`,
        recommendation: 'Verify exact gestational age and medical indication with your gynecologist.',
      });
    }
  }

  // 5. Age Group Checks
  if (profile.ageGroup === 'child' && medicine.strength.includes('650')) {
    conflicts.push({
      id: 'conf-child-dose',
      type: 'DOSE_CONCERN',
      severity: 'RED',
      title: 'Pediatric Dose Discrepancy',
      description: `Adult 650 mg tablet formulation is excessive for pediatric weight-based dosing. Children require calibrated liquid suspension (120mg-250mg/5ml).`,
      recommendation: 'Use pediatric syrup with calibrated measuring syringe based strictly on body weight.',
    });
  }

  // Emergency Symptoms Detection
  const allSymptomsText = [...profile.symptoms, profile.customSymptom || ''].join(' ').toLowerCase();
  const emergencyKeywords = [
    'difficulty breathing',
    'breath',
    'breathing',
    'severe swelling',
    'swelling of throat',
    'swelling of lips',
    'loss of consciousness',
    'fainting',
    'chest pain',
    'severe chest',
    'rapidly worsening',
  ];
  const isEmergency = emergencyKeywords.some((kw) => allSymptomsText.includes(kw));

  let emergencyWarning: MedicineSafetyAnalysis['emergencyWarning'] = undefined;
  if (isEmergency) {
    emergencyWarning = {
      isEmergency: true,
      urgentReason: 'Potentially serious symptoms detected (respiratory compromise, severe swelling, chest discomfort, or rapid deterioration).',
      actionRequired:
        'These symptoms may require urgent medical assessment. Seek immediate professional medical care or emergency assistance (Call 102/108/112). Do not rely on self-medication.',
    };
  }

  // Food + Symptom Analysis
  let foodCorrelation: MedicineSafetyAnalysis['foodCorrelation'] = undefined;
  if (profile.recentFoodEaten) {
    const foodLower = profile.recentFoodEaten.toLowerCase();
    const ingLower = (profile.recentFoodIngredients || '').toLowerCase();
    let concernDetected = false;
    let concernTitle = '';
    let concernExplanation = '';

    if (
      (foodLower.includes('bhujia') || foodLower.includes('sev') || foodLower.includes('spicy') || ingLower.includes('chilli') || ingLower.includes('pepper')) &&
      (allSymptomsText.includes('stomach') || allSymptomsText.includes('acidity') || allSymptomsText.includes('vomit') || allSymptomsText.includes('nausea') || allSymptomsText.includes('diarrhea'))
    ) {
      concernDetected = true;
      concernTitle = 'Spicy & High-Fat Snack Exposure vs Gastric Distress';
      concernExplanation =
        'High amounts of capsaicin (chilli), black pepper, and deep-fried gram flour present in spicy savoury snacks can cause direct irritation to the gastric mucosa, precipitating acute gastritis, acid reflux, or abdominal cramping.';
    } else if (
      (foodLower.includes('butter') || foodLower.includes('milk') || foodLower.includes('cheese') || ingLower.includes('milk') || ingLower.includes('dairy')) &&
      (allSymptomsText.includes('diarrhea') || allSymptomsText.includes('vomit') || allSymptomsText.includes('stomach') || allSymptomsText.includes('nausea'))
    ) {
      concernDetected = true;
      concernTitle = 'Dairy / Lactose Digestion Sensitivity';
      concernExplanation =
        'Dairy fats and lactose sugars can cause osmotic diarrhea, bloating, or nausea in individuals with transient or underlying lactase insufficiency.';
    } else if (
      (ingLower.includes('wheat') || ingLower.includes('maida') || ingLower.includes('nut') || ingLower.includes('peanut') || ingLower.includes('soy')) &&
      (allSymptomsText.includes('itching') || allSymptomsText.includes('rash') || allSymptomsText.includes('swelling'))
    ) {
      concernDetected = true;
      concernTitle = 'Common Food Allergen Notice (Wheat / Nuts / Soy)';
      concernExplanation =
        'The scanned food package contains recognized allergens (such as gluten/wheat or tree nuts/soy) which may be associated with immunological cutaneous reactions such as urticaria or pruritus.';
    } else if (allSymptomsText.includes('fever') || allSymptomsText.includes('vomit') || allSymptomsText.includes('diarrhea')) {
      concernDetected = true;
      concernTitle = 'Foodborne Pathogen Consideration';
      concernExplanation =
        'Gastrointestinal distress accompanied by fever after food consumption can sometimes point towards foodborne bacterial or viral pathogens (e.g. Salmonella, Staphylococcus enterotoxin, or Norovirus) or environmental water contamination.';
    }

    foodCorrelation = {
      foodProductName: profile.recentFoodEaten,
      foodIngredients: profile.recentFoodIngredients || 'Standard commercial packaged ingredients',
      potentialConcernDetected: concernDetected,
      concernTitle: concernTitle || 'No Specific Allergen Trigger Highlighted',
      concernExplanation: concernDetected
        ? `${concernExplanation} An ingredient listed on the scanned product may be relevant to the symptoms reported. This does NOT confirm that the food caused the symptoms.`
        : 'The ingredients listed do not show an obvious immediate correlation with the specific symptoms entered. However, personal dietary intolerances may still exist.',
      disclaimer: 'The exact cause cannot be confirmed by this application. Never make a definitive diagnosis without laboratory and clinical evaluation.',
    };
  }

  // Determine Overall Risk Level
  const hasRed = conflicts.some((c) => c.severity === 'RED') || isEmergency;
  const hasYellow = conflicts.some((c) => c.severity === 'YELLOW');

  const riskLevel = hasRed ? 'RED' : hasYellow ? 'YELLOW' : 'GREEN';
  const riskTitle = hasRed
    ? 'Important Medical Warning / Critical Conflict'
    : hasYellow
    ? 'Potential Safety Concern / Review Needed'
    : 'No Known Conflict Detected (Safe Baseline)';
  const statusLabel = hasRed
    ? 'High Safety Conflict'
    : hasYellow
    ? 'Precautions Required'
    : 'No Critical Interactions Found';

  // "TABLET LENI CHAHIYE YA NAHI?" Evaluator
  let tabletDecisionAdvice: MedicineSafetyAnalysis['tabletDecisionAdvice'];
  if (profile.symptoms.length === 0 && !profile.customSymptom && profile.existingConditions.length === 0 && profile.currentMedicines.length === 0) {
    tabletDecisionAdvice = {
      status: 'UNCERTAIN',
      headline: '⚠️ SAFETY CANNOT BE CONFIRMED',
      statement: 'Please consult a doctor or pharmacist before deciding whether this medicine is appropriate for you.',
      guidance: 'Insufficient health or clinical context has been entered to evaluate individualized suitability. Do not self-medicate blindly.',
    };
  } else if (hasRed) {
    tabletDecisionAdvice = {
      status: 'RED',
      headline: '🔴 POTENTIAL SAFETY CONCERN',
      statement: 'Do not rely on this application alone to decide whether to take this medicine. Please consult a doctor/pharmacist.',
      guidance: 'A critical medical warning, contraindication, or drug-drug collision was detected with your provided health profile.',
    };
  } else if (hasYellow) {
    tabletDecisionAdvice = {
      status: 'YELLOW',
      headline: '🟡 POTENTIAL SAFETY CONCERN',
      statement: 'Do not rely on this application alone to decide whether to take this medicine. Please consult a doctor/pharmacist.',
      guidance: 'Precautions or potential interactions exist. Timing, dosing, or existing health conditions require pharmacist or physician oversight.',
    };
  } else {
    tabletDecisionAdvice = {
      status: 'GREEN',
      headline: '🟢 NO KNOWN CONFLICT DETECTED',
      statement: 'No relevant conflict was identified from the information provided. This does not guarantee that the medicine is appropriate for you.',
      guidance: 'Always follow the manufacturer package leaflet for exact dosage and consult a licensed pharmacist before taking any tablet.',
    };
  }

  // Benefit and Risk explanation
  const benefitSummary = `Primary therapeutic purpose is ${medicine.generalUses.slice(0, 2).join(' and ')}. ${medicine.reliefTimeline}`;
  const riskSummary = `${medicine.maxDailyDose}. Always observe warnings: ${medicine.warnings[0]} Remember that one size does not fit all due to individual hepatic, renal, and genetic variations. If information is unavailable or unverified, safety information could not be fully verified.`;

  // Possible Cause Generator (strictly Non-Diagnostic)
  const possibleCauses: PossibleCauseCategory[] = [];
  if (profile.symptoms.some((s) => s.toLowerCase().includes('fever') || s.toLowerCase().includes('temperature')) || allSymptomsText.includes('fever')) {
    possibleCauses.push({
      category: 'Symptom Overview: Elevated Temperature / Fever',
      examples: [
        'Viral infection (e.g. Seasonal Influenza, Rhinovirus, Adenovirus)',
        'Bacterial infection (e.g. Pharyngitis, Urinary tract infection, Enteric fever)',
        'Foodborne illness / acute gastroenteritis from contaminated food or water',
        'Other medical causes (inflammatory reaction, heat exhaustion, post-vaccination)',
      ],
      description: 'Fever can have multiple possible causes. Fever is not an independent disease entity, but rather a physiological immune response. The exact cause cannot be confirmed by this application.',
    });
  }

  if (allSymptomsText.includes('stomach') || allSymptomsText.includes('vomit') || allSymptomsText.includes('diarrhea') || allSymptomsText.includes('nausea')) {
    possibleCauses.push({
      category: 'Symptom Overview: Gastrointestinal Distress',
      examples: [
        'Foodborne illness / food poisoning (bacterial or viral enterotoxins)',
        'Acute gastritis / mucosal irritation from hyper-spicy or highly acidic food',
        'Dietary intolerance or enzyme deficiency (e.g. lactose intolerance)',
        'Viral gastroenteritis (stomach flu) or traveler’s diarrhea',
      ],
      description: 'Digestive upset has many distinct etiologies ranging from simple dietary irritation to pathogenic infection. The exact cause cannot be confirmed by this application.',
    });
  }

  if (allSymptomsText.includes('itching') || allSymptomsText.includes('rash') || allSymptomsText.includes('swelling')) {
    possibleCauses.push({
      category: 'Symptom Overview: Dermatological / Allergic Reaction',
      examples: [
        'IgE-mediated food allergy (nuts, dairy, gluten, shellfish, or food preservatives)',
        'Contact dermatitis or environmental allergen exposure',
        'Viral exanthem (rash accompanying viral prodrome)',
        'Adverse drug reaction (cutaneous eruption from previously taken medication)',
      ],
      description: 'Cutaneous eruptions and pruritus can stem from diverse allergic, infectious, or pharmacological origins. The exact cause cannot be confirmed by this application.',
    });
  }

  if (allSymptomsText.includes('headache') || allSymptomsText.includes('pain')) {
    possibleCauses.push({
      category: 'Symptom Overview: Pain / Cephalea Discomfort',
      examples: [
        'Tension headache from dehydration, ergonomic strain, or lack of sleep',
        'Systemic viral prodrome (early phase of flu or fever)',
        'Sinus pressure from allergic rhinitis or seasonal barometric shifts',
        'Dietary triggers (excessive sodium, caffeine withdrawal, or food additives)',
      ],
      description: 'Headache and muscular discomfort are non-specific symptoms signaling underlying physiological strain. The exact cause cannot be confirmed by this application.',
    });
  }

  // Fallback possible cause if no symptom specified
  if (possibleCauses.length === 0) {
    possibleCauses.push({
      category: 'General Pharmacological Context',
      examples: [
        `Indications aligned with ${medicine.category}`,
        'Symptomatic relief of transient physiological discomforts',
        'Physician-prescribed maintenance therapy',
      ],
      description: 'Medicines should be targeted to specific confirmed indications and discontinued once resolved unless prescribed for chronic conditions. The exact cause cannot be confirmed by this application.',
    });
  }

  // Safe Next Steps
  const safeNextSteps = {
    selfCare: [
      'Monitor your symptoms closely and maintain continuous hydration with oral fluids, clean water, or electrolyte broth.',
      'Follow the official medicine label/leaflet for proper dosage, timing, and storage.',
      'Consult a licensed pharmacist for over-the-counter advice regarding individual health context.',
      'Ensure adequate physical rest in a cool, well-ventilated space.',
      'Record your body temperature and symptom onset times in a log.',
    ],
    redFlags: [
      'Difficulty breathing, wheezing, or chest tightness / severe chest pain.',
      'Severe swelling of the lips, tongue, face, or throat.',
      'Loss of consciousness, severe dizziness, fainting, or acute disorientation.',
      'High fever exceeding 103°F (39.4°C) or fever lasting more than 3 consecutive days.',
      'Inability to retain oral liquids due to persistent vomiting, or signs of severe dehydration.',
    ],
    consultationAdvice:
      'Always consult a registered medical doctor (MBBS/MD) or licensed pharmacist before taking new medication. Seek urgent emergency medical attention if severe red-flag symptoms occur.',
  };

  const sources = [
    'Indian Pharmacopoeia (IP 2022) — Indian Pharmacopoeia Commission',
    'Central Drugs Standard Control Organisation (CDSCO), Govt of India',
    'WHO Model List of Essential Medicines (23rd List)',
    'British National Formulary (BNF 86)',
    'Official Manufacturer Patient Information Leaflet (PIL)',
  ];

  return {
    riskLevel,
    riskTitle,
    statusLabel,
    conflicts,
    benefitSummary,
    riskSummary,
    possibleCauses,
    emergencyWarning,
    foodCorrelation,
    tabletDecisionAdvice,
    safeNextSteps,
    sources,
  };
}
