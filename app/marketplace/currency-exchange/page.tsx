"use client";

import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

type Currency = "GMD" | "USD" | "GBP" | "EUR";

const RATES: Record<Currency, number> = { GMD: 1, USD: 70, GBP: 85, EUR: 75 };
const SYMBOLS: Record<Currency, string> = { GMD: "D", USD: "$", GBP: "£", EUR: "€" };

const OPERATORS = [
  { id: "fx1", name: "Gambia Forex Bureau", buyRate: 68.5, sellRate: 71.0, currency: "USD" as Currency, minAmount: 1000, maxAmount: 500000, kycVerified: true, rating: 4.8, location: "Banjul Independence Drive", phone: "2203001234", badge: "🥇 Best Rate" },
  { id: "fx2", name: "Premier Forex", buyRate: 84.0, sellRate: 86.0, currency: "GBP" as Currency, minAmount: 5000, maxAmount: 2000000, kycVerified: true, rating: 4.9, location: "Bertil Harding Highway", phone: "2203005678", badge: "🥇 Best Rate" },
  { id: "fx3", name: "Euro Africa Forex", buyRate: 73.5, sellRate: 76.5, currency: "EUR" as Currency, minAmount: 1000, maxAmount: 750000, kycVerified: true, rating: 4.7, location: "Kairaba Avenue, KMC", phone: "2203003456", badge: null },
  { id: "fx4", name: "Atlantic Exchange", buyRate: 83.0, sellRate: 87.0, currency: "GBP" as Currency, minAmount: 2000, maxAmount: 1000000, kycVerified: true, rating: 4.6, location: "Senegambia Strip, Kololi", phone: "2203002345", badge: null },
  { id: "fx5", name: "Trust Bureau de Change", buyRate: 67.0, sellRate: 72.5, currency: "USD" as Currency, minAmount: 500, maxAmount: 200000, kycVerified: false, rating: 4.2, location: "Serrekunda Market", phone: "2203004567", badge: null },
];

export default function CurrencyExchangePage() {
  const [fromCurrency, setFromCurrency] = useState<Currency>("GMD");
  const [toCurrency, setToCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{ converted: number; rate: number; commission: number } | null>(null);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState("");

  function calculate() {
    if (!amount) return;
    const gmdAmount = fromCurrency === "GMD" ? Number(amount) : Number(amount) * RATES[fromCurrency];
    const rate = RATES[toCurrency];
    const converted = toCurrency === "GMD" ? gmdAmount : gmdAmount / rate;
    const commission = gmdAmount * 0.005;
    setResult({ converted: Math.round(converted * 100) / 100, rate, commission: Math.round(commission) });
  }

  function initTransaction(opId: string) {
    setSelectedOp(opId);
    setTxnRef(`FX-${Date.now().toString(36).toUpperCase()}`);
  }

  const filteredOps = OPERATORS.filter((o) => o.currency === toCurrency || o.currency === fromCurrency || fromCurrency === "GMD" || toCurrency === "GMD");

  const currencies: Currency[] = ["GMD", "USD", "GBP", "EUR"];

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <span style={tagStyle}>💱 CURRENCY EXCHANGE</span>
            <h1 style={heroTitleStyle}>Gambia Forex Marketplace</h1>
            <p style={heroSubStyle}>
              Compare rates from licensed operators. Best rates highlighted. 0.5% platform commission on all exchanges.
            </p>

            {/* Live rates bar */}
            <div style={ratesBarStyle}>
              {(["USD", "GBP", "EUR"] as Currency[]).map((c) => (
                <div key={c} style={rateItemStyle}>
                  <span style={{ color: "#D4AF37", fontWeight: 800, fontSize: "1.1rem" }}>{SYMBOLS[c]}1 = D{RATES[c]}</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem" }}>Central Bank Rate</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={mainGridStyle}>
            {/* Calculator */}
            <div style={calcCardStyle}>
              <h2 style={cardTitleStyle}>Currency Converter</h2>
              <div style={fieldsStyle}>
                <div style={twoColStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Amount</label>
                    <input type="number" className="fortis-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" min="1" />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>From Currency</label>
                    <select className="fortis-input" value={fromCurrency} onChange={(e) => { setFromCurrency(e.target.value as Currency); setResult(null); }}>
                      {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <button
                    type="button"
                    onClick={() => { const tmp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(tmp); setResult(null); }}
                    style={swapBtnStyle}
                    title="Swap currencies"
                  >⇌</button>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>To Currency</label>
                  <select className="fortis-input" value={toCurrency} onChange={(e) => { setToCurrency(e.target.value as Currency); setResult(null); }}>
                    {currencies.filter((c) => c !== fromCurrency).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button type="button" className="btn-primary" onClick={calculate} disabled={!amount} style={{ opacity: !amount ? 0.5 : 1 }}>
                  💱 Calculate Exchange
                </button>

                {result && (
                  <div style={resultBoxStyle}>
                    <p style={{ margin: "0 0 0.4rem", fontSize: "0.78rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Converted Amount</p>
                    <p style={{ margin: "0 0 0.25rem", fontSize: "2rem", fontWeight: 800, color: "#1B4D3E" }}>
                      {SYMBOLS[toCurrency]}{result.converted.toLocaleString()}
                    </p>
                    <div style={{ fontSize: "0.82rem", color: "#64748B", display: "flex", flexDirection: "column" as const, gap: "0.2rem" }}>
                      <span>Rate: D{result.rate} per {SYMBOLS[toCurrency]}1</span>
                      <span>Platform commission (0.5%): D{result.commission.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KYC notice */}
            <div style={kycNoticeCardStyle}>
              <h3 style={{ margin: "0 0 0.6rem", fontWeight: 800, color: "#0A1C2E", fontSize: "0.95rem" }}>🔐 Compliance & KYC</h3>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
                All currency exchanges require identity verification per Central Bank of The Gambia regulations.
              </p>
              {[
                "Valid National ID or Passport",
                "Proof of funds for amounts >D50,000",
                "Business registration (corporate exchanges)",
              ].map((r) => (
                <div key={r} style={{ display: "flex", gap: "0.5rem", fontSize: "0.82rem", color: "#0A1C2E", marginBottom: "0.4rem" }}>
                  <span style={{ color: "#1B4D3E" }}>✓</span> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Operator table */}
          <h2 style={sectionTitleStyle}>Licensed Exchange Operators</h2>
          <p style={{ margin: "-0.5rem 0 1.25rem", fontSize: "0.85rem", color: "#64748B" }}>
            All operators are licensed by the Central Bank of The Gambia. ✓ = KYC verified with Fortis platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
            {filteredOps.map((op) => (
              <div key={op.id} style={{ ...opCardStyle, borderLeft: `4px solid ${op.kycVerified ? "#1B4D3E" : "#E2E8F0"}` }}>
                <div style={opInfoStyle}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" as const }}>
                      <p style={{ margin: 0, fontWeight: 800, color: "#0A1C2E", fontSize: "0.95rem" }}>{op.name}</p>
                      {op.kycVerified && <span style={kycBadgeStyle}>✓ KYC Verified</span>}
                      {op.badge && <span style={bestRateBadgeStyle}>{op.badge}</span>}
                    </div>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "#64748B" }}>📍 {op.location}</p>
                  </div>
                  <div style={opRatesStyle}>
                    <div style={rateBoxStyle}>
                      <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>BUY RATE</span>
                      <span style={{ fontWeight: 800, color: "#1B4D3E" }}>D{op.buyRate}</span>
                      <span style={{ fontSize: "0.7rem", color: "#64748B" }}>per {SYMBOLS[op.currency]}</span>
                    </div>
                    <div style={rateBoxStyle}>
                      <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>SELL RATE</span>
                      <span style={{ fontWeight: 800, color: "#0A1C2E" }}>D{op.sellRate}</span>
                      <span style={{ fontSize: "0.7rem", color: "#64748B" }}>per {SYMBOLS[op.currency]}</span>
                    </div>
                    <div style={rateBoxStyle}>
                      <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>CURRENCY</span>
                      <span style={{ fontWeight: 800, color: "#D4AF37", fontSize: "1.1rem" }}>{op.currency}</span>
                    </div>
                    <div style={rateBoxStyle}>
                      <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>RATING</span>
                      <span style={{ fontWeight: 800, color: "#D4AF37" }}>★ {op.rating}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.4rem" }}>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>Min: D{op.minAmount.toLocaleString()} · Max: D{op.maxAmount.toLocaleString()}</p>
                    <a
                      href={`https://wa.me/${op.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={waOpBtnStyle}
                    >
                      💬 WhatsApp Operator
                    </a>
                    {selectedOp === op.id ? (
                      <div style={txnRefBoxStyle}>
                        <strong>Ref: {txnRef}</strong><br />
                        <span style={{ fontSize: "0.72rem" }}>Show this at the operator's location</span>
                      </div>
                    ) : (
                      <button type="button" onClick={() => initTransaction(op.id)} style={initBtnStyle}>
                        Initiate Transaction →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#FFFFFF" };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" };
const ratesBarStyle: React.CSSProperties = { display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" as const };
const rateItemStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.2rem" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const mainGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start", marginBottom: "2.5rem" };
const calcCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.85rem" };
const twoColStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const swapBtnStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const resultBoxStyle: React.CSSProperties = { background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const kycNoticeCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem" };
const sectionTitleStyle: React.CSSProperties = { margin: "0 0 0.4rem", fontSize: "1.1rem", fontWeight: 800, color: "#0A1C2E" };
const opCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.25rem 1.5rem" };
const opInfoStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1.5rem", alignItems: "center" };
const opRatesStyle: React.CSSProperties = { display: "flex", gap: "1rem" };
const rateBoxStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.15rem", alignItems: "center", minWidth: "65px" };
const kycBadgeStyle: React.CSSProperties = { background: "#dcfce7", color: "#065f46", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" };
const bestRateBadgeStyle: React.CSSProperties = { background: "#fef3c7", color: "#92400e", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" };
const waOpBtnStyle: React.CSSProperties = { display: "inline-block", background: "#25D366", color: "#FFFFFF", padding: "0.45rem 0.85rem", borderRadius: "0.4rem", textDecoration: "none", fontWeight: 700, fontSize: "0.78rem", textAlign: "center" as const };
const initBtnStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", border: "none", padding: "0.45rem 0.85rem", borderRadius: "0.4rem", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", fontFamily: "inherit" };
const txnRefBoxStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", padding: "0.5rem 0.85rem", borderRadius: "0.4rem", fontSize: "0.78rem", lineHeight: 1.5 };
