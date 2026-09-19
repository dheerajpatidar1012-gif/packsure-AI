import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  IndianRupee,
  Building2,
  PhoneCall,
  Calendar,
  Globe2,
  Sparkles,
  Award
} from 'lucide-react';
import { ProductScanResult, Language } from '../types';
import { sampleProducts } from '../data/sampleProducts';
import { getTranslation } from '../utils/translations';

interface ProductComparisonProps {
  language: Language;
  availableProducts: ProductScanResult[];
  onSelectProductForDetails: (product: ProductScanResult) => void;
  onScanNewProduct: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  language,
  availableProducts,
  onSelectProductForDetails,
  onScanNewProduct,
}) => {
  const t = getTranslation(language);

  // Pool of available products (passed scanned products + sample products)
  const allProducts = [...availableProducts];
  sampleProducts.forEach((sp) => {
    if (!allProducts.some((p) => p.id === sp.id)) {
      allProducts.push(sp);
    }
  });

  const [productAId, setProductAId] = useState<string>(allProducts[0]?.id || 'scan-pkg-001');
  const [productBId, setProductBId] = useState<string>(allProducts[1]?.id || 'scan-pkg-003');

  const productA = allProducts.find((p) => p.id === productAId) || allProducts[0];
  const productB = allProducts.find((p) => p.id === productBId) || (allProducts[1] || allProducts[0]);

  const handleSwap = () => {
    const temp = productAId;
    setProductAId(productBId);
    setProductBId(temp);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            COMPLIANT
          </span>
        );
      case 'PARTIALLY COMPLIANT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            PARTIALLY COMPLIANT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            NON-COMPLIANT
          </span>
        );
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          🟢 LOW RISK
        </span>
      );
    } else if (score >= 65) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          🟡 MEDIUM RISK
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          🔴 HIGH RISK
        </span>
      );
    }
  };

  // Helper for checking rules status in a product
  const getRuleValue = (product: ProductScanResult, keyword: string) => {
    const r = product.rules.find(
      (rule) =>
        rule.ruleCode.toLowerCase().includes(keyword) ||
        rule.ruleName.toLowerCase().includes(keyword) ||
        rule.legalClause.toLowerCase().includes(keyword)
    );
    return r;
  };

  const scoreDiff = productA.complianceScore - productB.complianceScore;

  const comparisonRows = [
    {
      title: 'Maximum Retail Price (MRP)',
      icon: <IndianRupee className="w-4 h-4 text-blue-600" />,
      ruleCode: 'Rule 6(1)(e)',
      valA: productA.mrp || 'Not declared',
      statusA: getRuleValue(productA, '6(1)(e)')?.status || (productA.mrp ? 'PASS' : 'FAIL'),
      valB: productB.mrp || 'Not declared',
      statusB: getRuleValue(productB, '6(1)(e)')?.status || (productB.mrp ? 'PASS' : 'FAIL'),
      statute: 'Inclusive of all taxes mandatory, no "taxes extra" permitted.',
    },
    {
      title: 'Net Quantity (SI Metric)',
      icon: <Scale className="w-4 h-4 text-emerald-600" />,
      ruleCode: 'Rule 6(1)(c) & Rule 11',
      valA: productA.netQuantity || 'Not declared',
      statusA: getRuleValue(productA, '6(1)(c)')?.status || (productA.netQuantity ? 'PASS' : 'FAIL'),
      valB: productB.netQuantity || 'Not declared',
      statusB: getRuleValue(productB, '6(1)(c)')?.status || (productB.netQuantity ? 'PASS' : 'FAIL'),
      statute: 'Standard SI metric symbols (g, kg, ml, l, N) only.',
    },
    {
      title: 'Manufacturer / Importer Address',
      icon: <Building2 className="w-4 h-4 text-indigo-600" />,
      ruleCode: 'Rule 6(1)(a) & (b)',
      valA: `${productA.manufacturer} — ${productA.address}`,
      statusA: getRuleValue(productA, '6(1)(a)')?.status || 'PASS',
      valB: `${productB.manufacturer} — ${productB.address}`,
      statusB: getRuleValue(productB, '6(1)(a)')?.status || 'FAIL',
      statute: 'Complete premises address with 6-digit postal PIN code.',
    },
    {
      title: 'Consumer Care Cell',
      icon: <PhoneCall className="w-4 h-4 text-teal-600" />,
      ruleCode: 'Rule 6(1)(f)',
      valA: productA.consumerCareDetails || 'Not declared',
      statusA: getRuleValue(productA, '6(1)(f)')?.status || (productA.consumerCareDetails ? 'PASS' : 'FAIL'),
      valB: productB.consumerCareDetails || 'Not declared',
      statusB: getRuleValue(productB, '6(1)(f)')?.status || (productB.consumerCareDetails ? 'PASS' : 'FAIL'),
      statute: 'Name/designation, telephone number, and official email ID required.',
    },
    {
      title: 'Unit Sale Price (USP)',
      icon: <IndianRupee className="w-4 h-4 text-amber-600" />,
      ruleCode: 'Rule 6(11)',
      valA: productA.unitSalePrice || 'Not declared',
      statusA: productA.unitSalePrice && !productA.unitSalePrice.toLowerCase().includes('missing') ? 'PASS' : 'FAIL',
      valB: productB.unitSalePrice || 'Not declared',
      statusB: productB.unitSalePrice && !productB.unitSalePrice.toLowerCase().includes('missing') ? 'PASS' : 'FAIL',
      statute: 'Mandatory price per g or ml for commodities exceeding 100g/ml.',
    },
    {
      title: 'Date of Manufacture / Packing',
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
      ruleCode: 'Rule 6(1)(d)',
      valA: productA.manufacturingDate || 'Not declared',
      statusA: getRuleValue(productA, '6(1)(d)')?.status || (productA.manufacturingDate ? 'PASS' : 'FAIL'),
      valB: productB.manufacturingDate || 'Not declared',
      statusB: getRuleValue(productB, '6(1)(d)')?.status || (productB.manufacturingDate ? 'PASS' : 'FAIL'),
      statute: 'Month & year of manufacture or packaging in clear MM/YYYY format.',
    },
    {
      title: 'Country of Origin',
      icon: <Globe2 className="w-4 h-4 text-cyan-600" />,
      ruleCode: 'Rule 6(1)(g)',
      valA: productA.countryOfOrigin || 'Not declared',
      statusA: getRuleValue(productA, '6(1)(g)')?.status || (productA.countryOfOrigin ? 'PASS' : 'FAIL'),
      valB: productB.countryOfOrigin || 'Not declared',
      statusB: getRuleValue(productB, '6(1)(g)')?.status || (productB.countryOfOrigin ? 'PASS' : 'FAIL'),
      statute: 'Mandatory declaration on principal display panel.',
    },
  ];

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory Comparative Audit</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Product Compliance Comparison
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Compare two packaged commodities side-by-side against Legal Metrology (Packaged Commodities) Rules, 2011 standards.
          </p>
        </div>

        {/* Product Selectors Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Product A selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Select Product A</span>
              </label>
              <select
                id="select-product-a"
                value={productAId}
                onChange={(e) => setProductAId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} ({p.complianceScore}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                title="Swap Products"
                className="p-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* Product B selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Select Product B</span>
              </label>
              <select
                id="select-product-b"
                value={productBId}
                onChange={(e) => setProductBId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} ({p.complianceScore}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top Product Hero Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-200/80 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={productA.imageUrl}
                  alt={productA.productName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold">
                    PRODUCT A
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {productA.productName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {productA.category} • Batch: {productA.batchNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl font-black font-mono text-blue-700">
                  {productA.complianceScore}%
                </div>
                <div className="mt-1">
                  {getRiskBadge(productA.complianceScore)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Verdict: </span>
                {getStatusBadge(productA.status)}
              </div>
              <button
                onClick={() => onSelectProductForDetails(productA)}
                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200/80 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={productB.imageUrl}
                  alt={productB.productName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                    PRODUCT B
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {productB.productName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {productB.category} • Batch: {productB.batchNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl font-black font-mono text-indigo-700">
                  {productB.complianceScore}%
                </div>
                <div className="mt-1">
                  {getRiskBadge(productB.complianceScore)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Verdict: </span>
                {getStatusBadge(productB.status)}
              </div>
              <button
                onClick={() => onSelectProductForDetails(productB)}
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Comparative Insight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-md space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              AI Comparative Analysis
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {scoreDiff > 0 ? (
              <>
                <strong>{productA.productName}</strong> outperforms <strong>{productB.productName}</strong> by <span className="text-emerald-300 font-bold font-mono">+{scoreDiff}%</span>. Product A maintains full statutory compliance across standard SI units, transparent tax declarations, and verifiable customer redressal channels.
              </>
            ) : scoreDiff < 0 ? (
              <>
                <strong>{productB.productName}</strong> is more compliant than <strong>{productA.productName}</strong> by <span className="text-emerald-300 font-bold font-mono">+{Math.abs(scoreDiff)}%</span>. Product A has {productA.violations.length} statutory infractions requiring immediate notice under Section 36(1).
              </>
            ) : (
              <>
                Both packages share an equivalent compliance score of <span className="text-blue-300 font-bold font-mono">{productA.complianceScore}%</span> with identical statutory declaration integrity levels.
              </>
            )}
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Rule-by-Rule Statutory Declarations Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Detailed side-by-side audit of mandatory provisions required under Rule 6.
              </p>
            </div>
            <button
              onClick={onScanNewProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors self-start sm:self-auto"
            >
              Scan New Label
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-4 px-6 w-1/4">Mandatory Requirement</th>
                  <th className="py-4 px-6 w-3/8 text-blue-900 bg-blue-50/50">
                    Product A: {productA.productName}
                  </th>
                  <th className="py-4 px-6 w-3/8 text-indigo-900 bg-indigo-50/50">
                    Product B: {productB.productName}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => {
                  const isPassA = row.statusA === 'PASS';
                  const isPassB = row.statusB === 'PASS';
                  const isWarnA = row.statusA === 'WARNING';
                  const isWarnB = row.statusB === 'WARNING';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      {/* Provision title & statute */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                          {row.icon}
                          <span>{row.title}</span>
                        </div>
                        <div className="text-[10px] font-mono text-blue-700 mt-1">
                          {row.ruleCode}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                          {row.statute}
                        </div>
                      </td>

                      {/* Product A column */}
                      <td className="py-4 px-6 align-top bg-blue-50/20">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-slate-800 text-xs break-words">
                            {row.valA}
                          </div>
                          <div className="shrink-0">
                            {isPassA ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Valid
                              </span>
                            ) : isWarnA ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                                Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                                Missing
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product B column */}
                      <td className="py-4 px-6 align-top bg-indigo-50/20">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-slate-800 text-xs break-words">
                            {row.valB}
                          </div>
                          <div className="shrink-0">
                            {isPassB ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Valid
                              </span>
                            ) : isWarnB ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                                Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                                Missing
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Audit More Packaged Commodities
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan shelf images or upload retail label photos to expand comparative data.
              </p>
            </div>
            <button
              onClick={onScanNewProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Scan Label
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Statutory Penalties Registry
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Review legal fine matrices and compound notices under Section 36(1).
              </p>
            </div>
            <button
              onClick={() => onSelectProductForDetails(productA)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Inspection Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
