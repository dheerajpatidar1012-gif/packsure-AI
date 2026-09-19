import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Scan, 
  Rotate3d, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  QrCode, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  Layers, 
  ZoomIn, 
  RefreshCw,
  Box,
  FileCheck
} from 'lucide-react';
import { Language } from '../types';

interface Packaging3DViewerProps {
  language?: Language;
  onScanThisPackage?: (packageName: string, barcode: string) => void;
  className?: string;
}

export type PackageType = 'food' | 'cosmetic' | 'pharma';

interface StatutoryHotspot {
  id: string;
  name: string;
  nameHi: string;
  ruleCitation: string;
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  position: [number, number, number]; // 3D coordinates relative to box
  normal: [number, number, number];
  status: 'PASS' | 'ATTENTION';
  extractedText: string;
  statutoryDetail: string;
  statutoryDetailHi: string;
}

export const Packaging3DViewer: React.FC<Packaging3DViewerProps> = ({
  language = 'en',
  onScanThisPackage,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [packageType, setPackageType] = useState<PackageType>('food');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isScanningLaser, setIsScanningLaser] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<StatutoryHotspot | null>(null);
  const [projectedHotspots, setProjectedHotspots] = useState<
    Array<StatutoryHotspot & { x: number; y: number; visible: boolean }>
  >([]);
  const [scanPulsePhase, setScanPulsePhase] = useState<number>(0);
  const [inspectionScore, setInspectionScore] = useState<number>(98);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const boxMeshRef = useRef<THREE.Mesh | null>(null);
  const laserMeshRef = useRef<THREE.Group | null>(null);
  const laserLightRef = useRef<THREE.PointLight | null>(null);
  const reticlesGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Interaction controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.25, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.25, y: -0.6 });

  // Hotspots definitions per package type
  const getHotspots = useCallback((type: PackageType): StatutoryHotspot[] => {
    if (type === 'food') {
      return [
        {
          id: 'mrp-usp',
          name: 'MRP & Unit Sale Price',
          nameHi: 'अधिकतम खुदरा मूल्य एवं इकाई विक्रय मूल्य',
          ruleCitation: 'Rule 6(1)(e) - Legal Metrology',
          face: 'back',
          position: [0.35, 0.45, -0.71],
          normal: [0, 0, -1],
          status: 'PASS',
          extractedText: '₹120.00 (Incl. of all taxes) | USP: ₹0.24/g',
          statutoryDetail: 'Complies with mandatory Unit Sale Price declaration amendment for commodities over 100g.',
          statutoryDetailHi: '100 ग्राम से अधिक वस्तुओं के लिए अनिवार्य इकाई विक्रय मूल्य घोषणा का अनुपालन करता है।',
        },
        {
          id: 'net-qty',
          name: 'Net Quantity (500 g)',
          nameHi: 'शुद्ध मात्रा (500 ग्राम)',
          ruleCitation: 'Rule 6(1)(c) - Net Quantity Declaration',
          face: 'front',
          position: [0.4, -0.85, 0.71],
          normal: [0, 0, 1],
          status: 'PASS',
          extractedText: 'Net Wt: 500 g e',
          statutoryDetail: 'Font height > 4.0 mm conforming to First Schedule of PCR 2011 for 500g packages.',
          statutoryDetailHi: '500 ग्राम पैक के लिए पीसीआर 2011 की पहली अनुसूची के अनुसार फ़ॉन्ट ऊंचाई > 4.0 मिमी।',
        },
        {
          id: 'barcode',
          name: 'GS1 EAN-13 Barcode',
          nameHi: 'जीएस1 ईएएन-13 बारकोड',
          ruleCitation: 'Optical GTIN Standards',
          face: 'left',
          position: [-1.21, -0.4, 0],
          normal: [-1, 0, 0],
          status: 'PASS',
          extractedText: '8901030010103',
          statutoryDetail: 'India GS1 prefix (890) verified. Contrast ratio 87% within optical scanning tolerance.',
          statutoryDetailHi: 'भारत जीएस1 उपसर्ग (890) सत्यापित। ऑप्टिकल स्कैनिंग सहनशीलता के भीतर 87% कंट्रास्ट।',
        },
        {
          id: 'mfg-address',
          name: 'Manufacturer & Packer Details',
          nameHi: 'निर्माता एवं पैकर का पूरा पता',
          ruleCitation: 'Rule 6(1)(a) - Name & Complete Address',
          face: 'back',
          position: [-0.3, -0.3, -0.71],
          normal: [0, 0, -1],
          status: 'PASS',
          extractedText: 'PureGrain Foods Pvt. Ltd., Plot 42, Okhla Ph-III, New Delhi - 110020',
          statutoryDetail: 'Contains complete legal name, street/plot, city, state and 6-digit PIN code.',
          statutoryDetailHi: 'पूर्ण कानूनी नाम, सड़क/प्लाट, शहर, राज्य और 6-अंकीय पिन कोड शामिल है।',
        },
        {
          id: 'date-pack',
          name: 'Date of Packing & Best Before',
          nameHi: 'पैकिंग की तारीख एवं सर्वश्रेष्ठ उपयोग',
          ruleCitation: 'Rule 6(1)(d) - Month and Year of Manufacture',
          face: 'right',
          position: [1.21, 0.5, 0],
          normal: [1, 0, 0],
          status: 'PASS',
          extractedText: 'PKD: 08/2024 | USE BY: 05/2025',
          statutoryDetail: 'Clear MM/YYYY format with legible contrast against dark background.',
          statutoryDetailHi: 'गहरे रंग की पृष्ठभूमि पर स्पष्ट रूप से पठनीय एमएम/वाइवाइवाइवाइ प्रारूप।',
        }
      ];
    } else if (type === 'cosmetic') {
      return [
        {
          id: 'mrp-usp',
          name: 'MRP & Unit Sale Price',
          nameHi: 'एमआरपी एवं इकाई मूल्य',
          ruleCitation: 'Rule 6(1)(e) - Cosmetics',
          face: 'back',
          position: [0.35, 0.45, -0.71],
          normal: [0, 0, -1],
          status: 'PASS',
          extractedText: '₹299.00 (Incl. of all taxes) | ₹0.85/mL',
          statutoryDetail: 'Unit Sale Price printed per milliliter with clear inclusive tax declaration.',
          statutoryDetailHi: 'स्पष्ट कर-सहित घोषणा के साथ प्रति मिलीलीटर इकाई विक्रय मूल्य मुद्रित।',
        },
        {
          id: 'net-qty',
          name: 'Net Volume (350 mL)',
          nameHi: 'शुद्ध मात्रा (350 एमएल)',
          ruleCitation: 'Rule 6(1)(c) - Volume Standards',
          face: 'front',
          position: [0.0, -0.85, 0.71],
          normal: [0, 0, 1],
          status: 'PASS',
          extractedText: 'Net Vol: 350 mL',
          statutoryDetail: 'Standard metric liquid volume declaration with approved abbreviation (mL).',
          statutoryDetailHi: 'स्वीकृत संक्षिप्त नाम (mL) के साथ मानक मीट्रिक तरल मात्रा घोषणा।',
        },
        {
          id: 'barcode',
          name: 'Cosmetic Barcode',
          nameHi: 'कॉस्मेटिक बारकोड',
          ruleCitation: 'GS1 Standards',
          face: 'left',
          position: [-1.21, -0.3, 0],
          normal: [-1, 0, 0],
          status: 'PASS',
          extractedText: '8904001928371',
          statutoryDetail: 'Authentic Indian Cosmetic SKU registered in National Database.',
          statutoryDetailHi: 'राष्ट्रीय डेटाबेस में पंजीकृत प्रामाणिक भारतीय कॉस्मेटिक एसकेयू।',
        },
        {
          id: 'mfg-address',
          name: 'Mfg License & Address',
          nameHi: 'निर्माण लाइसेंस एवं पता',
          ruleCitation: 'Rule 6(1)(a) & Drugs/Cosmetics Act',
          face: 'back',
          position: [-0.3, -0.3, -0.71],
          normal: [0, 0, -1],
          status: 'PASS',
          extractedText: 'Lic No. AYU-DL-1092 | Vedic Herbals Ltd, Haridwar',
          statutoryDetail: 'Manufacturing License number present alongside state and address.',
          statutoryDetailHi: 'राज्य और पते के साथ निर्माण लाइसेंस संख्या मौजूद है।',
        }
      ];
    } else {
      return [
        {
          id: 'mrp-usp',
          name: 'MRP & Unit Price (Pharma)',
          nameHi: 'एमआरपी एवं इकाई मूल्य (दवा)',
          ruleCitation: 'Rule 6(1)(e) & DPCO 2013',
          face: 'back',
          position: [0.35, 0.45, -0.71],
          normal: [0, 0, -1],
          status: 'PASS',
          extractedText: '₹145.00 (Incl. of all taxes) | ₹4.83 / Tab',
          statutoryDetail: 'Complies with Drug Price Control Order and Legal Metrology Rule 6 per-unit pricing.',
          statutoryDetailHi: 'ड्रग प्राइस कंट्रोल ऑर्डर और लीगल मेट्रोलॉजी नियम 6 प्रति-इकाई मूल्य निर्धारण का अनुपालन।',
        },
        {
          id: 'net-qty',
          name: 'Package Count (30 Tablets)',
          nameHi: 'पैकेज संख्या (30 गोलियां)',
          ruleCitation: 'Rule 6(1)(c) - Number of Units',
          face: 'front',
          position: [0.0, -0.85, 0.71],
          normal: [0, 0, 1],
          status: 'PASS',
          extractedText: '30 Film-Coated Tablets',
          statutoryDetail: 'Exact numerical count declared on the Principal Display Panel.',
          statutoryDetailHi: 'मुख्य प्रदर्शन पैनल पर घोषित सटीक संख्यात्मक गणना।',
        },
        {
          id: 'barcode',
          name: 'Pharma 2D/1D Barcode',
          nameHi: 'फार्मा बारकोड',
          ruleCitation: 'GS1 Healthcare',
          face: 'left',
          position: [-1.21, -0.3, 0],
          normal: [-1, 0, 0],
          status: 'PASS',
          extractedText: '8902008819203',
          statutoryDetail: 'Track & trace compatible GS1 barcode format.',
          statutoryDetailHi: 'ट्रैक और ट्रेस संगत जीएस1 बारकोड प्रारूप।',
        }
      ];
    }
  }, []);

  // Helper function to create high-resolution Canvas Textures for all 6 box faces
  const createBoxTextures = useCallback((type: PackageType) => {
    const createFaceCanvas = (
      width: number, 
      height: number, 
      renderFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        renderFn(ctx, width, height);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const W = 1024;
    const H = 1365; // Matches box aspect ratio (2.4 : 3.2)
    const SideW = 597; // Matches box depth (1.4)

    // TEXTURE 1: FRONT FACE (+Z)
    const frontTexture = createFaceCanvas(W, H, (ctx, w, h) => {
      if (type === 'food') {
        // Rich biscuit box front
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0b3954');
        grad.addColorStop(0.4, '#087e8b');
        grad.addColorStop(0.85, '#bf9b30');
        grad.addColorStop(1, '#8c6b12');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Pattern overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let y = 0; y < h; y += 40) {
          ctx.fillRect(0, y, w, 2);
        }

        // Top Gold Banner
        ctx.fillStyle = '#f4d03f';
        ctx.fillRect(0, 0, w, 40);
        ctx.fillStyle = '#111';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ 100% WHOLE WHEAT ATTA ★ ZERO TRANS FAT ★', w / 2, 28);

        // Brand Title
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 68px system-ui, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12;
        ctx.fillText('SUNSHINE', w / 2, 170);
        
        ctx.fillStyle = '#ffde59';
        ctx.font = '800 48px system-ui, sans-serif';
        ctx.fillText('GOLD BISCUITS', w / 2, 230);
        ctx.shadowBlur = 0;

        // Subheading
        ctx.fillStyle = '#e0f2fe';
        ctx.font = '500 28px system-ui, sans-serif';
        ctx.fillText('Crisp Rich Wheat Butter Cookies', w / 2, 280);

        // Golden Biscuit Graphic Circle
        const cx = w / 2;
        const cy = 600;
        const radius = 220;
        
        // Biscuit base
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#d4a373';
        ctx.fill();
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#faedcd';
        ctx.stroke();

        // Biscuit holes & details
        ctx.fillStyle = '#bc6c25';
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
          const bx = cx + Math.cos(angle) * 120;
          const by = cy + Math.sin(angle) * 120;
          ctx.beginPath();
          ctx.arc(bx, by, 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center badge on biscuit
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PURE BUTTER', cx, cy + 12);

        // Veg Symbol (Green Dot inside Square)
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#16a34a';
        ctx.strokeRect(60, 950, 70, 70);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(95, 985, 20, 0, Math.PI * 2);
        ctx.fill();

        // FSSAI Badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(160, 950, 260, 70, 12);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('fssai', 180, 982);
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText('Lic. No. 10014011001928', 180, 1005);

        // Principal Display Panel - Statutory Net Quantity
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.roundRect(w - 380, 950, 320, 90, 16);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fde047';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde047';
        ctx.font = '600 20px system-ui, sans-serif';
        ctx.fillText('NET QUANTITY / शुद्ध मात्रा', w - 220, 982);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 44px system-ui, sans-serif';
        ctx.fillText('500 g ℮', w - 220, 1025);

        // Legal Metrology compliance watermark footer
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LEGAL METROLOGY PCR 2011 COMPLIANT PACKAGING', w / 2, h - 35);
      } else if (type === 'cosmetic') {
        // Emerald green cosmetic shampoo package
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#047857');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 28px serif';
        ctx.textAlign = 'center';
        ctx.fillText('AYURVEDIC FORMULATION', w / 2, 100);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 64px serif';
        ctx.fillText('VEDIC BOTANICS', w / 2, 180);

        ctx.fillStyle = '#6ee7b7';
        ctx.font = '600 36px system-ui, sans-serif';
        ctx.fillText('BHRINGRAJ & NEEM SHAMPOO', w / 2, 240);

        ctx.fillStyle = '#d1fae5';
        ctx.font = '400 24px system-ui, sans-serif';
        ctx.fillText('Intense Root Strengthening & Scalp Care', w / 2, 290);

        // Bottle silhouette icon
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.roundRect(w / 2 - 120, 420, 240, 460, 40);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 32px system-ui, sans-serif';
        ctx.fillText('PURE EXTRACTS', w / 2, 650);

        // Net Volume
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 180, 960, 360, 90, 16);
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.stroke();

        ctx.fillStyle = '#a7f3d0';
        ctx.font = '600 20px system-ui, sans-serif';
        ctx.fillText('NET VOLUME / शुद्ध परिमाण', w / 2, 995);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 44px system-ui, sans-serif';
        ctx.fillText('350 mL', w / 2, 1038);
      } else {
        // Clean Pharma tablet package
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        // Cyan top band
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, w, 180);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('HEALTHCARE PHARMACEUTICALS', 60, 80);
        ctx.font = '22px system-ui, sans-serif';
        ctx.fillText('GMP & ISO 9001:2015 CERTIFIED FACILITY', 60, 130);

        // Product name
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 76px system-ui, sans-serif';
        ctx.fillText('VITA-CALM', 60, 320);

        ctx.fillStyle = '#0284c7';
        ctx.font = '700 40px system-ui, sans-serif';
        ctx.fillText('Multivitamin & Mineral Complex', 60, 380);

        // Red Rx / Schedule warning
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText('SCHEDULE H PRESCRIPTION DRUG - CAUTION', 60, 460);

        // Tablet blister render
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(60, 520, w - 120, 380, 20);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 26px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CLINICALLY FORMULATED ESSENTIAL NUTRIENTS', w / 2, 720);

        // Net Count
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(60, 960, w - 120, 100, 16);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.fillText('NET CONTENT (PRINCIPAL DISPLAY PANEL)', w / 2, 1000);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 42px system-ui, sans-serif';
        ctx.fillText('30 FILM COATED TABLETS', w / 2, 1045);
      }
    });

    // TEXTURE 2: BACK FACE (-Z) (Full Statutory Legal Metrology Declarations)
    const backTexture = createFaceCanvas(W, H, (ctx, w, h) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Header
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MANDATORY STATUTORY DECLARATIONS', w / 2, 50);

      // Subhead Rule 6
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('[ Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6 ]', w / 2, 125);

      // Declarations Box Table
      const startY = 160;
      const boxW = w - 100;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(50, startY, boxW, 760, 16);
      ctx.fill();
      ctx.stroke();

      // Table Rows
      const rows = [
        {
          rule: 'Rule 6(1)(a)',
          label: 'COMMODITY NAME:',
          val: type === 'food' ? 'Biscuits / Baked Snacks' : type === 'cosmetic' ? 'Herbal Hair Shampoo' : 'Multivitamin Supplement Tablets',
        },
        {
          rule: 'Rule 6(1)(c)',
          label: 'NET QUANTITY:',
          val: type === 'food' ? '500 g (Pack of 4 x 125g)' : type === 'cosmetic' ? '350 mL' : '30 Tablets (3 Blister strips)',
        },
        {
          rule: 'Rule 6(1)(e)',
          label: 'MAX. RETAIL PRICE (MRP):',
          val: type === 'food' ? '₹ 120.00 (Incl. of all taxes)' : type === 'cosmetic' ? '₹ 299.00 (Incl. of all taxes)' : '₹ 145.00 (Incl. of all taxes)',
          highlight: true,
        },
        {
          rule: 'Rule 6(1)(e) USP',
          label: 'UNIT SALE PRICE (USP):',
          val: type === 'food' ? '₹ 0.24 per gram' : type === 'cosmetic' ? '₹ 0.85 per mL' : '₹ 4.83 per Tablet',
          highlight: true,
        },
        {
          rule: 'Rule 6(1)(d)',
          label: 'MONTH & YEAR OF MFG/PKD:',
          val: '08/2024  (BEST BEFORE 9 MONTHS)',
        },
        {
          rule: 'Rule 6(1)(b)',
          label: 'COUNTRY OF ORIGIN:',
          val: 'MADE IN INDIA',
        },
        {
          rule: 'Rule 6(1)(a)',
          label: 'MANUFACTURED & PACKED BY:',
          val: 'PureGrain Foods Pvt. Ltd.\nPlot 42, Okhla Industrial Area Phase-III\nNew Delhi - 110020, India',
          multiline: true,
        },
        {
          rule: 'Rule 6(1)(f)',
          label: 'CONSUMER CARE DETAILS:',
          val: 'Consumer Care Executive, Address as above\nToll Free: 1800-11-4000 | Email: care@packsure.in',
        },
      ];

      let rowY = startY + 30;
      rows.forEach((r) => {
        ctx.textAlign = 'left';

        // Tag Rule badge
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(70, rowY, 140, 28, 6);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(r.rule, 80, rowY + 19);

        // Label
        ctx.fillStyle = r.highlight ? '#1e3a8a' : '#0f172a';
        ctx.font = r.highlight ? 'bold 22px system-ui, sans-serif' : '600 20px system-ui, sans-serif';
        ctx.fillText(r.label, 230, rowY + 22);

        // Value
        ctx.fillStyle = r.highlight ? '#0369a1' : '#334155';
        ctx.font = r.highlight ? 'bold 24px system-ui, sans-serif' : '500 20px system-ui, sans-serif';

        if (r.multiline) {
          const lines = r.val.split('\n');
          lines.forEach((l, idx) => {
            ctx.fillText(l, 70, rowY + 56 + idx * 28);
          });
          rowY += 60 + lines.length * 28;
        } else {
          ctx.fillText(r.val, 70, rowY + 54);
          rowY += 80;
        }

        // Row divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(70, rowY - 10);
        ctx.lineTo(w - 70, rowY - 10);
        ctx.stroke();
      });

      // Bottom Barcode & Verification Seals
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(50, 960, boxW, 110, 16);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LEGAL METROLOGY ACT, 2009 & PCR 2011 STATUTORY AUDIT READY', w / 2, 1005);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('All mandatory statutory declarations printed in specified font size and contrast ratio.', w / 2, 1038);
    });

    // TEXTURE 3: LEFT SIDE FACE (-X) (GS1 Barcode & Batch Number)
    const leftTexture = createFaceCanvas(SideW, H, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Top colored bar
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, w, 50);

      // Section title
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GS1 IDENTIFICATION', w / 2, 120);

      // Draw high-precision EAN-13 Barcode
      const barcodeX = 50;
      const barcodeY = 170;
      const barcodeW = w - 100;
      const barcodeH = 260;

      // Barcode white card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(barcodeX - 10, barcodeY - 10, barcodeW + 20, barcodeH + 80);

      const barcodeDigits = type === 'food' ? '8901030010103' : type === 'cosmetic' ? '8904001928371' : '8902008819203';
      
      // Draw realistic bars
      ctx.fillStyle = '#000000';
      let currX = barcodeX + 15;
      const totalWidth = barcodeW - 30;
      const barStep = totalWidth / 70;

      for (let i = 0; i < 65; i++) {
        // Pseudo barcode pattern with guard bars
        const isGuard = i === 0 || i === 1 || i === 31 || i === 32 || i === 63 || i === 64;
        const shouldDraw = isGuard || (i * 7 + 3) % 5 > 1;
        const barHeight = isGuard ? barcodeH + 20 : barcodeH;

        if (shouldDraw) {
          const thickness = (i % 4 === 0) ? barStep * 1.5 : barStep * 0.9;
          ctx.fillRect(currX, barcodeY, thickness, barHeight);
        }
        currX += barStep;
      }

      // Barcode digits text below
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 38px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(barcodeDigits, w / 2, barcodeY + barcodeH + 55);

      // Batch & Dates box
      const batchY = 560;
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, batchY, w - 80, 240, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('BATCH / PACKING DETAILS:', 60, batchY + 45);

      ctx.font = '500 20px monospace';
      ctx.fillStyle = '#334155';
      ctx.fillText(`BATCH NO: B${Math.floor(Math.random() * 8000 + 1000)}-IN`, 60, batchY + 95);
      ctx.fillText('MFD: 15/08/2024', 60, batchY + 135);
      ctx.fillText('EXP: 14/05/2025', 60, batchY + 175);
      ctx.fillText('STD RETAIL PACK', 60, batchY + 215);

      // Storage & Disposal Icons
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('STORE IN A COOL, DRY & HYGIENIC PLACE', w / 2, 860);
      ctx.fillText('KEEP AWAY FROM DIRECT SUNLIGHT', w / 2, 895);

      // Recycling symbol text
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('♻ 100% RECYCLABLE CARTON', w / 2, 980);
    });

    // TEXTURE 4: RIGHT SIDE FACE (+X) (Nutritional Facts / Technical Specs)
    const rightTexture = createFaceCanvas(SideW, H, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Top Header
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 0, w, 50);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(type === 'food' ? 'NUTRITIONAL FACTS' : type === 'cosmetic' ? 'KEY INGREDIENTS' : 'COMPOSITION', w / 2, 120);

      // Subtitle
      ctx.fillStyle = '#64748b';
      ctx.font = '500 18px system-ui, sans-serif';
      ctx.fillText('Approx. values per 100g / serving', w / 2, 155);

      // Table box
      const tableY = 190;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, tableY, w - 70, 480);

      const facts = type === 'food' ? [
        ['Energy', '478 kcal'],
        ['Carbohydrates', '68.5 g'],
        ['Total Sugars', '22.0 g'],
        ['Added Sugars', '19.5 g'],
        ['Dietary Fibre', '4.2 g'],
        ['Protein', '7.4 g'],
        ['Total Fat', '19.8 g'],
        ['Saturated Fat', '9.1 g'],
        ['Trans Fat', '0.0 g'],
        ['Cholesterol', '8.0 mg'],
        ['Sodium', '280 mg'],
      ] : [
        ['Bhringraj Extract', '15.0%'],
        ['Neem Bark Infusion', '10.0%'],
        ['Amla Superfruit', '8.0%'],
        ['Aloe Vera Gel', '12.0%'],
        ['Coconut Cleanser', '25.0%'],
        ['Purified Aqua', 'Q.S.'],
      ];

      let rowY = tableY + 40;
      facts.forEach(([k, v], idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        ctx.fillRect(37, rowY - 26, w - 74, 38);

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 19px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(k, 50, rowY);

        ctx.textAlign = 'right';
        ctx.font = '500 19px monospace';
        ctx.fillText(v, w - 50, rowY);

        rowY += 40;
      });

      // Consumer care helpline badge
      ctx.fillStyle = '#f0fdf4';
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(35, 710, w - 70, 160, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#166534';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('FEEDBACK & INQUIRIES', w / 2, 755);
      ctx.font = '500 18px system-ui, sans-serif';
      ctx.fillText('Direct Consumer Grievance Cell', w / 2, 790);
      ctx.fillText('Email: helpdesk@packsure.gov.in', w / 2, 825);
    });

    // TEXTURE 5: TOP FACE (+Y) (Brand Tape & Security Seal)
    const topTexture = createFaceCanvas(W, SideW, (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, h / 2 - 30, w, 60);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ TAMPER EVIDENT SEAL ★ DO NOT ACCEPT IF BROKEN ★', w / 2, h / 2 + 10);
    });

    // TEXTURE 6: BOTTOM FACE (-Y) (Statutory Metrology Inspection Seal)
    const bottomTexture = createFaceCanvas(W, SideW, (ctx, w, h) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LEGAL METROLOGY SURVEILLANCE CODE', w / 2, h / 2 - 15);
      ctx.font = 'bold 26px monospace';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('LM-DEL-2024-REG-09941', w / 2, h / 2 + 25);
    });

    return [
      new THREE.MeshStandardMaterial({ map: rightTexture, roughness: 0.35, metalness: 0.05 }),  // +X
      new THREE.MeshStandardMaterial({ map: leftTexture, roughness: 0.35, metalness: 0.05 }),   // -X
      new THREE.MeshStandardMaterial({ map: topTexture, roughness: 0.4, metalness: 0.1 }),     // +Y
      new THREE.MeshStandardMaterial({ map: bottomTexture, roughness: 0.4, metalness: 0.1 }),  // -Y
      new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.25, metalness: 0.1 }),   // +Z
      new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.25, metalness: 0.05 }),  // -Z
    ];
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.8);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainKeyLight.position.set(4, 5, 5);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.8);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // Dynamic Laser Point Light
    const laserPointLight = new THREE.PointLight(0x00f0ff, 3.5, 4.5);
    laserPointLight.position.set(0, 0, 1.2);
    scene.add(laserPointLight);
    laserLightRef.current = laserPointLight;

    // Floor Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.9;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Subtle 3D Grid Underneath
    const gridHelper = new THREE.GridHelper(6, 12, 0x0284c7, 0xe2e8f0);
    gridHelper.position.y = -1.89;
    scene.add(gridHelper);

    // 3D Packaging Box Mesh
    // Dimensions: width = 2.4, height = 3.2, depth = 1.4
    const boxGeometry = new THREE.BoxGeometry(2.4, 3.2, 1.4);
    const boxMaterials = createBoxTextures(packageType);
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterials);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    scene.add(boxMesh);
    boxMeshRef.current = boxMesh;

    // 3D Optical Scanner Laser Group
    const laserGroup = new THREE.Group();

    // Glowing Laser Plane Bar
    const laserBarGeo = new THREE.BoxGeometry(3.0, 0.04, 2.0);
    const laserBarMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.85,
    });
    const laserBar = new THREE.Mesh(laserBarGeo, laserBarMat);
    laserGroup.add(laserBar);

    // Glowing Horizontal Laser Beam Line
    const laserBeamGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.4, 16);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.rotation.z = Math.PI / 2;
    laserGroup.add(laserBeam);

    // Holographic Wireframe Scan Plane
    const laserGridGeo = new THREE.PlaneGeometry(2.8, 1.8);
    const laserGridMat = new THREE.MeshBasicMaterial({
      color: 0x00d8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const laserGrid = new THREE.Mesh(laserGridGeo, laserGridMat);
    laserGrid.rotation.x = Math.PI / 2;
    laserGroup.add(laserGrid);

    scene.add(laserGroup);
    laserMeshRef.current = laserGroup;

    // Holographic Corner Brackets / AR Inspection Reticles
    const reticlesGroup = new THREE.Group();
    const cornerLineMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      linewidth: 2,
      transparent: true,
      opacity: 0.7,
    });

    const halfW = 1.35;
    const halfH = 1.75;
    const halfD = 0.85;
    const bracketSize = 0.3;

    // 8 Corner wireframe brackets
    const corners = [
      [1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1],
      [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1],
    ];

    corners.forEach(([cx, cy, cz]) => {
      const p = [cx * halfW, cy * halfH, cz * halfD];
      
      // Line along X
      const geoX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p[0], p[1], p[2]),
        new THREE.Vector3(p[0] - cx * bracketSize, p[1], p[2]),
      ]);
      reticlesGroup.add(new THREE.Line(geoX, cornerLineMat));

      // Line along Y
      const geoY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p[0], p[1], p[2]),
        new THREE.Vector3(p[0], p[1] - cy * bracketSize, p[2]),
      ]);
      reticlesGroup.add(new THREE.Line(geoY, cornerLineMat));

      // Line along Z
      const geoZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p[0], p[1], p[2]),
        new THREE.Vector3(p[0], p[1], p[2] - cz * bracketSize),
      ]);
      reticlesGroup.add(new THREE.Line(geoZ, cornerLineMat));
    });

    scene.add(reticlesGroup);
    reticlesGroupRef.current = reticlesGroup;

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation
      if (boxMeshRef.current) {
        if (isAutoRotating && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.008;
        }

        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

        boxMeshRef.current.rotation.x = currentRotationRef.current.x;
        boxMeshRef.current.rotation.y = currentRotationRef.current.y;

        // Subtle breathing floating motion
        boxMeshRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

        if (reticlesGroupRef.current) {
          reticlesGroupRef.current.position.y = boxMeshRef.current.position.y;
        }
      }

      // Animate Laser Beam Scanner up & down
      if (laserMeshRef.current && isScanningLaser) {
        const laserY = Math.sin(elapsedTime * 2.2) * 1.55;
        laserMeshRef.current.position.y = laserY + (boxMeshRef.current?.position.y || 0);
        laserMeshRef.current.visible = true;

        if (laserLightRef.current) {
          laserLightRef.current.position.y = laserY;
          laserLightRef.current.intensity = 2.5 + Math.sin(elapsedTime * 8) * 0.8;
        }
      } else if (laserMeshRef.current) {
        laserMeshRef.current.visible = false;
        if (laserLightRef.current) laserLightRef.current.intensity = 0;
      }

      // Update projected 2D coordinates for UI Hotspot Pins
      if (cameraRef.current && boxMeshRef.current && containerRef.current) {
        const box = boxMeshRef.current;
        const cam = cameraRef.current;
        const cWidth = containerRef.current.clientWidth;
        const cHeight = containerRef.current.clientHeight;

        const currentHotspots = getHotspots(packageType);
        const projected = currentHotspots.map((h) => {
          // Calculate world position based on box transform
          const localPos = new THREE.Vector3(...h.position);
          const worldPos = localPos.applyMatrix4(box.matrixWorld);

          // Calculate normal in world space to determine if face is facing camera
          const localNorm = new THREE.Vector3(...h.normal);
          const worldNorm = localNorm.applyEuler(box.rotation).normalize();
          
          // Vector from hotspot to camera
          const toCam = new THREE.Vector3().subVectors(cam.position, worldPos).normalize();
          const dot = worldNorm.dot(toCam);
          const isFacingCamera = dot > 0.05;

          // Project to 2D NDC space
          const ndc = worldPos.clone().project(cam);

          // Map to container pixel coordinates
          const px = ((ndc.x + 1) * cWidth) / 2;
          const py = ((-ndc.y + 1) * cHeight) / 2;

          return {
            ...h,
            x: px,
            y: py,
            visible: isFacingCamera && ndc.z < 1,
          };
        });

        setProjectedHotspots(projected);
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [createBoxTextures, getHotspots, isAutoRotating, isScanningLaser, packageType]);

  // Update box textures when package type changes
  useEffect(() => {
    if (boxMeshRef.current) {
      const newMats = createBoxTextures(packageType);
      boxMeshRef.current.material = newMats;
      
      // Update inspection score dynamically
      if (packageType === 'food') setInspectionScore(98);
      if (packageType === 'cosmetic') setInspectionScore(95);
      if (packageType === 'pharma') setInspectionScore(100);

      // Default to null active hotspot on switch
      setActiveHotspot(null);
    }
  }, [packageType, createBoxTextures]);

  // Mouse / Touch Orbit Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.01;
    targetRotationRef.current.x = Math.max(
      -Math.PI / 4,
      Math.min(Math.PI / 4, targetRotationRef.current.x + deltaY * 0.01)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Rotate box to face specific statutory spot
  const focusHotspot = (hotspot: StatutoryHotspot) => {
    setActiveHotspot(hotspot);
    setIsAutoRotating(false);

    if (hotspot.face === 'front') {
      targetRotationRef.current = { x: 0.1, y: 0 };
    } else if (hotspot.face === 'back') {
      targetRotationRef.current = { x: 0.1, y: Math.PI };
    } else if (hotspot.face === 'left') {
      targetRotationRef.current = { x: 0.1, y: Math.PI / 2 };
    } else if (hotspot.face === 'right') {
      targetRotationRef.current = { x: 0.1, y: -Math.PI / 2 };
    }
  };

  // Reset to ideal 3D isometric angle
  const resetCamera = () => {
    targetRotationRef.current = { x: 0.25, y: -0.6 };
    setIsAutoRotating(true);
    setActiveHotspot(null);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl ${className}`}>
      {/* 3D Viewport Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Rotate3d className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-white tracking-wide">
                {language === 'hi' ? '3डी पैकेजिंग अनुपालन दृश्य' : '3D PACKAGING COMPLIANCE ENGINE'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>PCR 2011 VALIDATED</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'hi' ? 'घुमाने के लिए ड्रैग करें • वैधानिक टैग पर क्लिक करें' : 'Interactive 3D orbit • Click pins to inspect Rule 6 fields'}
            </p>
          </div>
        </div>

        {/* Commodity Selector Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setPackageType('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              packageType === 'food'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍪</span>
            <span className="hidden sm:inline">{language === 'hi' ? 'खाद्य कार्टन' : 'Food Carton'}</span>
          </button>

          <button
            onClick={() => setPackageType('cosmetic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              packageType === 'cosmetic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🧴</span>
            <span className="hidden sm:inline">{language === 'hi' ? 'सौंदर्य प्रसाधन' : 'Cosmetics'}</span>
          </button>

          <button
            onClick={() => setPackageType('pharma')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              packageType === 'pharma'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💊</span>
            <span className="hidden sm:inline">{language === 'hi' ? 'दवा पैक' : 'Pharma'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full h-[460px] sm:h-[500px] cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Floating 3D Hotspots overlay */}
        {projectedHotspots.map((hotspot) => {
          if (!hotspot.visible) return null;
          const isSelected = activeHotspot?.id === hotspot.id;

          return (
            <button
              key={hotspot.id}
              onClick={(e) => {
                e.stopPropagation();
                focusHotspot(hotspot);
              }}
              style={{
                left: `${hotspot.x}px`,
                top: `${hotspot.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-10 group flex items-center space-x-1.5 px-2.5 py-1 rounded-full backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg ${
                isSelected
                  ? 'bg-blue-500 text-white ring-4 ring-blue-400/40 scale-110'
                  : 'bg-slate-900/85 hover:bg-blue-600 text-slate-200 hover:text-white border border-blue-400/50 hover:border-blue-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${hotspot.status === 'PASS' ? 'bg-emerald-400' : 'bg-amber-400'} animate-ping`} />
              <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
                {language === 'hi' ? hotspot.nameHi : hotspot.name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            </button>
          );
        })}

        {/* Optical Scanning HUD Overlay Elements */}
        <div className="absolute top-18 left-4 z-10 pointer-events-none">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-400 bg-slate-950/75 px-2.5 py-1 rounded-md border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>OPTICAL 3D SCAN: {isScanningLaser ? 'ACTIVE' : 'STANDBY'}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded">
              GS1 EAN: {packageType === 'food' ? '8901030010103' : packageType === 'cosmetic' ? '8904001928371' : '8902008819203'}
            </div>
          </div>
        </div>

        {/* Top Right Live Compliance Metric Badge */}
        <div className="absolute top-18 right-4 z-10 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl shadow-lg flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-extrabold text-sm font-mono">
              {inspectionScore}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'वैधानिक स्कोर' : 'Statutory Score'}
              </div>
              <div className="text-xs font-extrabold text-emerald-400">
                {language === 'hi' ? 'अनुपालक (PASS)' : 'COMPLIANT (PASS)'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Inspection Detail Drawer if hotspot is clicked */}
        {activeHotspot && (
          <div className="absolute bottom-16 inset-x-4 z-20 bg-slate-900/95 backdrop-blur-lg border border-blue-500/50 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-400/30">
                    {activeHotspot.ruleCitation}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {language === 'hi' ? activeHotspot.nameHi : activeHotspot.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    ✓ PASS
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-amber-300">
                  {activeHotspot.extractedText}
                </div>

                <p className="text-xs text-slate-300">
                  {language === 'hi' ? activeHotspot.statutoryDetailHi : activeHotspot.statutoryDetail}
                </p>
              </div>

              <button
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Viewport Footer Control Bar */}
      <div className="px-4 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isAutoRotating
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? (language === 'hi' ? 'रोटेशन रोकें' : 'Pause Orbit') : (language === 'hi' ? 'घूमाएं' : 'Auto Orbit')}</span>
          </button>

          <button
            onClick={() => setIsScanningLaser(!isScanningLaser)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isScanningLaser
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'ऑप्टिकल लेजर' : 'Laser Scanner'}</span>
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs cursor-pointer"
            title="Reset 3D View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Direct Action: Test/Scan This 3D Box */}
        <button
          onClick={() => {
            const barcode = packageType === 'food' ? '8901030010103' : packageType === 'cosmetic' ? '8904001928371' : '8902008819203';
            const name = packageType === 'food' ? 'Sunshine Gold Biscuits 500g' : packageType === 'cosmetic' ? 'Vedic Botanics Shampoo 350mL' : 'Vita-Calm Multivitamin Tablets';
            if (onScanThisPackage) {
              onScanThisPackage(name, barcode);
            }
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Scan className="w-4 h-4" />
          <span>{language === 'hi' ? 'इस 3D पैकेज का पूर्ण ऑडिट करें' : 'Audit This 3D Packaging'}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
