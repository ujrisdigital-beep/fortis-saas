"use client";

import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";
import { useLang } from "../../../hooks/useLang";

type BizType = "sme" | "sole_trader" | "corporation" | "nonprofit";
type ProductCat = "electronics" | "vehicles" | "food" | "clothing" | "machinery" | "raw_materials";

const BIZ_TYPES: Record<BizType, { label: string; corpRate: number; vatRequired: boolean }> = {
  sme:         { label: "SME (Small/Medium Enterprise)", corpRate: 0.25, vatRequired: false },
  sole_trader: { label: "Sole Trader", corpRate: 0.20, vatRequired: false },
  corporation: { label: "Corporation / Ltd", corpRate: 0.25, vatRequired: true },
  nonprofit:   { label: "Non-Profit Organisation", corpRate: 0.0, vatRequired: false },
};

const IMPORT_CATEGORIES: Record<ProductCat, { label: string; dutyRate: number; ecowasReduction: number }> = {
  electronics:   { label: "Electronics & Appliances", dutyRate: 0.20, ecowasReduction: 0.05 },
  vehicles:      { label: "Vehicles & Automotive", dutyRate: 0.35, ecowasReduction: 0.05 },
  food:          { label: "Food & Beverages", dutyRate: 0.10, ecowasReduction: 0.10 },
  clothing:      { label: "Clothing & Textiles", dutyRate: 0.20, ecowasReduction: 0.05 },
  machinery:     { label: "Industrial Machinery", dutyRate: 0.05, ecowasReduction: 0.05 },
  raw_materials: { label: "Raw Materials", dutyRate: 0.0, ecowasReduction: 0.0 },
};

const ECOWAS_COUNTRIES = [
  "Benin","Burkina Faso","Cape Verde","Côte d'Ivoire","Gambia","Ghana","Guinea",
  "Guinea-Bissau","Liberia","Mali","Mauritania","Niger","Nigeria","Senegal",
  "Sierra Leone","Togo",
];

const OTHER_COUNTRIES = [
  "China","India","United States","United Kingdom","France","Germany",
  "United Arab Emirates","Turkey","Brazil","South Africa","Other",
];

type TaxResult = {
  taxableIncome: number;
  corpTax: number;
  vatAmount: number;
  withholdingTax: number;
  total: number;
  effectiveRate: number;
};

type ImportResult = {
  customsValue: number;
  dutyRate: number;
  importDuty: number;
  ecowasLevy: number;
  vatOnImport: number;
  surcharge: number;
  totalDue: number;
  totalCost: number;
};

export default function TaxImportPage() {
  const { t } = useLang();

  // Tax calculator state
  const [bizType, setBizType] = useState<BizType>("sme");
  const [revenue, setRevenue] = useState("");
  const [deductions, setDeductions] = useState("");
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);

  // Import duty state
  const [productCat, setProductCat] = useState<ProductCat>("electronics");
  const [customsValue, setCustomsValue] = useState("");
  const [valueInUSD, setValueInUSD] = useState(false);
  const [origin, setOrigin] = useState("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const [activeTab, setActiveTab] = useState<"tax" | "import">("tax");

  function calcTax() {
    const rev = Number(revenue);
    const ded = Number(deductions) || 0;
    const biz = BIZ_TYPES[bizType];
    const taxableIncome = Math.max(0, rev - ded);
    const corpTax = Math.round(taxableIncome * biz.corpRate);
    const vatAmount = biz.vatRequired ? Math.round(rev * 0.15) : 0;
    const withholdingTax = Math.round(rev * 0.015); // 1.5% WHT
    const total = corpTax + vatAmount + withholdingTax;
    const effectiveRate = rev > 0 ? Math.round((total / rev) * 1000) / 10 : 0;
    setTaxResult({ taxableIncome, corpTax, vatAmount, withholdingTax, total, effectiveRate });
  }

  function calcImport() {
    const isEcowas = ECOWAS_COUNTRIES.includes(origin);
    const cv = Number(customsValue) * (valueInUSD ? 70 : 1);
    const cat = IMPORT_CATEGORIES[productCat];
    const effectiveDuty = Math.max(0, cat.dutyRate - (isEcowas ? cat.ecowasReduction : 0));
    const importDuty = Math.round(cv * effectiveDuty);
    const ecowasLevy = Math.round(cv * 0.005);
    const vatOnImport = Math.round((cv + importDuty) * 0.15);
    const surcharge = Math.round(cv * 0.01);
    const totalDue = importDuty + ecowasLevy + vatOnImport + surcharge;
    const totalCost = cv + totalDue;
    setImportResult({ customsValue: cv, dutyRate: effectiveDuty, importDuty, ecowasLevy, vatOnImport, surcharge, totalDue, totalCost });
  }

  function printPDF() {
    window.print();
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <span style={tagStyle}>💰 GAMBIA REVENUE AUTHORITY</span>
            <h1 style={heroTitleStyle}>{t("tax.title")}</h1>
            <p style={heroSubStyle}>{t("tax.sub")}</p>
            <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.65)", fontSize: "0.75rem" }}>
              Based on GRA rates 2026. Consult a certified accountant for official filing.
            </p>
          </div>
        </div>

        {/* Tab selector */}
        <div style={tabBarStyle}>
          <div style={tabInnerStyle}>
            {[
              { id: "tax", label: "🧾 Business Tax" },
              { id: "import", label: "📦 Import Duty" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "tax" | "import")}
                style={{
                  ...tabBtnStyle,
                  borderBottom: activeTab === tab.id ? "3px solid #1B4D3E" : "3px solid transparent",
                  color: activeTab === tab.id ? "#1B4D3E" : "#64748B",
                  fontWeight: activeTab === tab.id ? 800 : 600,
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>

            {/* ── TAX CALCULATOR ─────────────────────────────── */}
            {activeTab === "tax" && (
              <>
                <div style={formCardStyle}>
                  <h2 style={cardTitleStyle}>Business Tax Calculator</h2>
                  <div style={fieldsStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.bizType")}</label>
                      <select className="fortis-input" value={bizType} onChange={(e) => setBizType(e.target.value as BizType)}>
                        {Object.entries(BIZ_TYPES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.revenue")}</label>
                      <input type="number" className="fortis-input" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 2,500,000" min="0" />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.deductions")}</label>
                      <input type="number" className="fortis-input" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="e.g. 500,000 (rent, salaries…)" min="0" />
                    </div>

                    <div style={noteBoxStyle}>
                      <strong>📋 Allowable deductions include:</strong> Business rent, employee salaries, utility bills, equipment depreciation, loan interest, and marketing costs.
                    </div>

                    <button type="button" className="btn-primary" disabled={!revenue} onClick={calcTax} style={{ opacity: !revenue ? 0.5 : 1 }}>
                      {t("btn.calculate")}
                    </button>
                  </div>
                </div>

                <div>
                  {!taxResult && (
                    <div style={emptyStyle}>
                      <span style={{ fontSize: "3rem" }}>🧾</span>
                      <p style={{ color: "#64748B", margin: 0, fontSize: "0.92rem" }}>Enter your business details to calculate tax obligations.</p>
                    </div>
                  )}
                  {taxResult && (
                    <div style={resultCardStyle}>
                      <div style={resultHeaderStyle}>
                        <h3 style={{ margin: 0, color: "#FFFFFF", fontWeight: 800 }}>Tax Breakdown</h3>
                        <button type="button" onClick={printPDF} style={printBtnStyle}>🖨️ Print / PDF</button>
                      </div>
                      <div style={resultBodyStyle}>
                        <ResultRow label="Gross Revenue" value={`D${Number(revenue).toLocaleString()}`} />
                        <ResultRow label="Allowable Deductions" value={`− D${Number(deductions || 0).toLocaleString()}`} />
                        <ResultRow label="Taxable Income" value={`D${taxResult.taxableIncome.toLocaleString()}`} />
                        <div style={dividerStyle} />
                        <ResultRow label={`${t("tax.corpTax")} (${Math.round(BIZ_TYPES[bizType].corpRate * 100)}%)`} value={`D${taxResult.corpTax.toLocaleString()}`} />
                        {taxResult.vatAmount > 0 && <ResultRow label={t("tax.vat")} value={`D${taxResult.vatAmount.toLocaleString()}`} />}
                        <ResultRow label="Withholding Tax (1.5%)" value={`D${taxResult.withholdingTax.toLocaleString()}`} />
                        <div style={dividerStyle} />
                        <ResultRow label={t("tax.totalDue")} value={`D${taxResult.total.toLocaleString()}`} highlight />
                        <ResultRow label="Effective Tax Rate" value={`${taxResult.effectiveRate}%`} />
                      </div>

                      {BIZ_TYPES[bizType].corpRate === 0 && (
                        <div style={tipBoxStyle}>💡 Non-profit organisations are exempt from corporate tax but must still file annual returns with GRA.</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── IMPORT DUTY ─────────────────────────────── */}
            {activeTab === "import" && (
              <>
                <div style={formCardStyle}>
                  <h2 style={cardTitleStyle}>{t("tax.importTitle")}</h2>
                  <div style={fieldsStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.productCat")}</label>
                      <select className="fortis-input" value={productCat} onChange={(e) => setProductCat(e.target.value as ProductCat)}>
                        {Object.entries(IMPORT_CATEGORIES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label} — {Math.round(v.dutyRate * 100)}% duty</option>
                        ))}
                      </select>
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.customsValue")}</label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input type="number" className="fortis-input" style={{ flex: 1 }} value={customsValue} onChange={(e) => setCustomsValue(e.target.value)} placeholder={valueInUSD ? "e.g. 5,000 USD" : "e.g. 350,000 GMD"} min="0" />
                        <button
                          type="button"
                          onClick={() => setValueInUSD((v) => !v)}
                          style={{ ...currencyToggleStyle, background: valueInUSD ? "#D4AF37" : "#F8FAFC", color: valueInUSD ? "#0A1C2E" : "#64748B" }}
                        >{valueInUSD ? "$ USD" : "D GMD"}</button>
                      </div>
                      {valueInUSD && customsValue && (
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#64748B" }}>
                          = D{(Number(customsValue) * 70).toLocaleString()} GMD (at D70/USD)
                        </p>
                      )}
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>{t("tax.origin")}</label>
                      <select className="fortis-input" value={origin} onChange={(e) => setOrigin(e.target.value)}>
                        <option value="">Select country…</option>
                        <optgroup label="ECOWAS Members (duty reduction applies)">
                          {ECOWAS_COUNTRIES.map((c) => <option key={c} value={c}>{c} ✓ ECOWAS</option>)}
                        </optgroup>
                        <optgroup label="Other Countries">
                          {OTHER_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </optgroup>
                      </select>
                      {ECOWAS_COUNTRIES.includes(origin) && (
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#065f46", fontWeight: 700 }}>
                          ✓ ECOWAS member — reduced duty rate applies
                        </p>
                      )}
                    </div>

                    <button type="button" className="btn-primary" disabled={!customsValue || !origin} onClick={calcImport} style={{ opacity: (!customsValue || !origin) ? 0.5 : 1 }}>
                      {t("btn.calculate")}
                    </button>
                  </div>
                </div>

                <div>
                  {!importResult && (
                    <div style={emptyStyle}>
                      <span style={{ fontSize: "3rem" }}>📦</span>
                      <p style={{ color: "#64748B", margin: 0, fontSize: "0.92rem" }}>Enter import details to calculate duties and total landed cost.</p>
                    </div>
                  )}
                  {importResult && (
                    <div style={resultCardStyle}>
                      <div style={resultHeaderStyle}>
                        <h3 style={{ margin: 0, color: "#FFFFFF", fontWeight: 800 }}>Import Duty Breakdown</h3>
                        <button type="button" onClick={printPDF} style={printBtnStyle}>🖨️ Print / PDF</button>
                      </div>
                      <div style={resultBodyStyle}>
                        <ResultRow label="Customs Value (GMD)" value={`D${importResult.customsValue.toLocaleString()}`} />
                        <ResultRow label={`${t("tax.importDuty")} (${Math.round(importResult.dutyRate * 100)}%)`} value={`D${importResult.importDuty.toLocaleString()}`} />
                        <ResultRow label={t("tax.ecowasLevy")} value={`D${importResult.ecowasLevy.toLocaleString()}`} />
                        <ResultRow label="VAT on Import (15%)" value={`D${importResult.vatOnImport.toLocaleString()}`} />
                        <ResultRow label="Surcharge (1%)" value={`D${importResult.surcharge.toLocaleString()}`} />
                        <div style={dividerStyle} />
                        <ResultRow label="Total Duties & Taxes" value={`D${importResult.totalDue.toLocaleString()}`} highlight />
                        <ResultRow label="Total Landed Cost" value={`D${importResult.totalCost.toLocaleString()}`} />
                      </div>
                      {ECOWAS_COUNTRIES.includes(origin) && (
                        <div style={tipBoxStyle}>✓ ECOWAS reduction applied. Standard duty would have been {Math.round((IMPORT_CATEGORIES[productCat].dutyRate) * 100)}%.</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Reference table */}
          <div style={refTableStyle}>
            <h3 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "0.95rem", color: "#0A1C2E" }}>📋 Quick Reference — Gambia Tax Rates 2026</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.85rem" }}>
              {[
                { label: "Corporate Income Tax", value: "25%", note: "On taxable profit" },
                { label: "VAT (Value Added Tax)", value: "15%", note: "Turnover >D5M" },
                { label: "Withholding Tax", value: "1.5%", note: "On gross payments" },
                { label: "ECOWAS Levy", value: "0.5%", note: "On CIF value" },
                { label: "Import Surcharge", value: "1%", note: "On CIF value" },
                { label: "ECOWAS duty reduction", value: "5%", note: "For ECOWAS origin" },
              ].map((r) => (
                <div key={r.label} style={refItemStyle}>
                  <p style={{ margin: "0 0 0.2rem", fontSize: "0.78rem", color: "#64748B" }}>{r.label}</p>
                  <p style={{ margin: "0 0 0.1rem", fontWeight: 800, color: "#1B4D3E", fontSize: "1.1rem" }}>{r.value}</p>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "#94A3B8" }}>{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: "0.88rem", color: highlight ? "#0A1C2E" : "#64748B", fontWeight: highlight ? 800 : 500 }}>{label}</span>
      <span style={{ fontSize: highlight ? "1rem" : "0.88rem", fontWeight: 800, color: highlight ? "#1B4D3E" : "#0A1C2E" }}>{value}</span>
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7 };
const tabBarStyle: React.CSSProperties = { background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 1.25rem" };
const tabInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", display: "flex" };
const tabBtnStyle: React.CSSProperties = { background: "none", border: "none", padding: "0.85rem 1.25rem", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", transition: "all 0.15s" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "400px 1fr", gap: "1.5rem", marginBottom: "2rem" };
const formCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const noteBoxStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "0.6rem", padding: "0.85rem", fontSize: "0.82rem", color: "#0A1C2E", lineHeight: 1.6 };
const currencyToggleStyle: React.CSSProperties = { border: "1.5px solid #E2E8F0", borderRadius: "0.45rem", padding: "0 0.85rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const };
const emptyStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "4rem 2rem", background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", textAlign: "center" as const };
const resultCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", overflow: "hidden" };
const resultHeaderStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" };
const printBtnStyle: React.CSSProperties = { background: "rgba(255,255,255,0.15)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", padding: "0.4rem 0.85rem", borderRadius: "0.4rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", fontFamily: "inherit" };
const resultBodyStyle: React.CSSProperties = { padding: "1.25rem 1.5rem" };
const dividerStyle: React.CSSProperties = { borderTop: "2px solid #E2E8F0", margin: "0.5rem 0" };
const tipBoxStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", borderTop: "1px solid rgba(27,77,62,0.15)", padding: "0.85rem 1.5rem", fontSize: "0.82rem", color: "#0A1C2E", lineHeight: 1.6 };
const refTableStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem 2rem" };
const refItemStyle: React.CSSProperties = { background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "0.65rem", padding: "0.85rem 1rem" };
