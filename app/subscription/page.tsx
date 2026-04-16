"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { useCurrency } from "../../hooks/useCurrency";
import { Currency, CURRENCY_LABELS, SYMBOLS } from "../../lib/currency";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    gmd: 3430,
    usd: 49,
    period: "/ month",
    badge: null,
    features: [
      "UJU Cycle™ — 10 analyses/month",
      "Ikenga™ — 5 brand assessments/month",
      "Ask UJRIS™ — 3 document reviews/month",
      "Grant Generator — 5 applications",
      "All 8 Sector Calculators",
      "Email support (48hr response)",
    ],
    highlight: false,
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    gmd: 6930,
    usd: 99,
    period: "/ month",
    badge: "MOST POPULAR",
    features: [
      "UJU Cycle™ — Unlimited analyses",
      "Ikenga™ — Unlimited assessments",
      "Ask UJRIS™ — 20 document reviews/month",
      "Grant Generator — Unlimited applications",
      "API access (1,000 calls/month)",
      "Marketplace seller account",
      "Priority support (12hr response)",
      "PDF export reports",
    ],
    highlight: true,
    cta: "Go Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    gmd: 13930,
    usd: 199,
    period: "/ month",
    badge: "FULL ACCESS",
    features: [
      "Everything in Professional",
      "Ask UJRIS™ — Unlimited reviews",
      "API access — Unlimited calls",
      "Dedicated account manager",
      "Custom AI system prompts",
      "White-label reports",
      "SLA: 2hr response time",
      "Onboarding & training session",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
];

const CURRENCIES: Currency[] = ["GMD", "USD", "GBP", "EUR"];
const RATES: Record<Currency, number> = { GMD: 1, USD: 70, GBP: 85, EUR: 75 };

function formatPlanPrice(gmd: number, currency: Currency): string {
  if (currency === "GMD") return `D${gmd.toLocaleString()}`;
  const amount = gmd / RATES[currency];
  return `${SYMBOLS[currency]}${Math.round(amount).toLocaleString()}`;
}

export default function SubscriptionPage() {
  const { currency, setCurrency } = useCurrency();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  function handleSelect(planId: string) {
    setLoading(planId);
    setTimeout(() => {
      setLoading(null);
      window.location.href = `/payment?plan=${planId}&billing=${billing}&currency=${currency}`;
    }, 900);
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <span style={sectorTagStyle}>FORTIS OS™ PRICING</span>
            <h1 style={heroTitleStyle}>Invest in Gambia's Future</h1>
            <p style={heroSubStyle}>
              Enterprise-grade AI tools built for Gambian entrepreneurs, investors, and government partners.
              Priced for local impact.
            </p>

            {/* Currency + Billing toggles */}
            <div style={controlsRowStyle}>
              <div style={toggleGroupStyle}>
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    style={{
                      ...toggleBtnStyle,
                      background: currency === c ? "#D4AF37" : "rgba(255,255,255,0.1)",
                      color: currency === c ? "#0A1C2E" : "rgba(255,255,255,0.85)",
                      fontWeight: currency === c ? 800 : 600,
                    }}
                  >{c}</button>
                ))}
              </div>
              <div style={toggleGroupStyle}>
                {(["monthly", "annual"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBilling(b)}
                    style={{
                      ...toggleBtnStyle,
                      background: billing === b ? "#D4AF37" : "rgba(255,255,255,0.1)",
                      color: billing === b ? "#0A1C2E" : "rgba(255,255,255,0.85)",
                      fontWeight: billing === b ? 800 : 600,
                    }}
                  >
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                    {b === "annual" && <span style={{ fontSize: "0.65rem", marginLeft: "0.3rem", color: billing === "annual" ? "#1B4D3E" : "#D4AF37" }}>-20%</span>}
                  </button>
                ))}
              </div>
            </div>

            {billing === "annual" && (
              <p style={{ margin: "0.75rem 0 0", color: "#D4AF37", fontSize: "0.85rem", fontWeight: 700 }}>
                Annual billing saves you 20% — 2 months free
              </p>
            )}
          </div>
        </div>

        {/* Cards */}
        <div style={cardsWrapStyle}>
          <div style={cardsGridStyle}>
            {PLANS.map((plan) => {
              const gmd = billing === "annual" ? Math.round(plan.gmd * 10 * 0.8) : plan.gmd;
              const displayed = formatPlanPrice(gmd, currency);
              const gmdStr = billing === "annual" ? `D${gmd.toLocaleString()}` : `D${plan.gmd.toLocaleString()}`;

              return (
                <div key={plan.id} style={{
                  ...planCardStyle,
                  border: plan.highlight ? "2.5px solid #1B4D3E" : "1.5px solid #E2E8F0",
                  boxShadow: plan.highlight ? "0 8px 40px rgba(27,77,62,0.15)" : "0 2px 12px rgba(10,28,46,0.06)",
                  transform: plan.highlight ? "translateY(-8px)" : "none",
                }}>
                  {plan.badge && (
                    <div style={badgeStyle}>{plan.badge}</div>
                  )}

                  <p style={planNameStyle}>{plan.name}</p>

                  <div style={priceRowStyle}>
                    <span style={priceAmountStyle}>{displayed}</span>
                    <span style={pricePeriodStyle}>{billing === "annual" ? "/ year" : plan.period}</span>
                  </div>

                  {currency !== "GMD" && (
                    <p style={gmdEquivStyle}>{gmdStr} GMD equivalent</p>
                  )}

                  <div style={dividerStyle} />

                  <ul style={featureListStyle}>
                    {plan.features.map((f) => (
                      <li key={f} style={featureItemStyle}>
                        <span style={checkStyle}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={loading === plan.id}
                    onClick={() => handleSelect(plan.id)}
                    style={{
                      ...ctaBtnStyle,
                      background: plan.highlight ? "#1B4D3E" : "#FFFFFF",
                      color: plan.highlight ? "#FFFFFF" : "#1B4D3E",
                      border: plan.highlight ? "none" : "2px solid #1B4D3E",
                      opacity: loading === plan.id ? 0.7 : 1,
                    }}
                  >
                    {loading === plan.id ? "Processing…" : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Row */}
        <div style={trustBandStyle}>
          <div style={trustInnerStyle}>
            {[
              { icon: "🔒", label: "Secure Payment", sub: "SSL encrypted, no card data stored" },
              { icon: "🔄", label: "Cancel Anytime", sub: "No lock-in, monthly billing" },
              { icon: "🇬🇲", label: "Gambia-First", sub: "GMD pricing, local support" },
              { icon: "📞", label: "Dedicated Support", sub: "WhatsApp + email support" },
            ].map((t) => (
              <div key={t.label} style={trustItemStyle}>
                <span style={{ fontSize: "1.75rem" }}>{t.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#0A1C2E" }}>{t.label}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={faqWrapStyle}>
          <h2 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.4rem", color: "#0A1C2E", marginBottom: "1.5rem" }}>
            Frequently Asked Questions
          </h2>
          <div style={faqGridStyle}>
            {[
              { q: "Can I switch plans?", a: "Yes — upgrade or downgrade at any time. Changes take effect on your next billing cycle." },
              { q: "What currencies can I pay in?", a: "We accept GMD via bank transfer or mobile money (Afrimoney, Wave). USD/GBP/EUR via Stripe." },
              { q: "Is there a free trial?", a: "Yes — 7-day free trial on Starter and Professional. No credit card required." },
              { q: "Who uses Fortis OS?", a: "Gambian SMEs, NGOs, government agencies, and international investors operating in The Gambia." },
            ].map((item) => (
              <div key={item.q} style={faqItemStyle}>
                <p style={{ margin: "0 0 0.4rem", fontWeight: 700, color: "#1B4D3E", fontSize: "0.95rem" }}>{item.q}</p>
                <p style={{ margin: 0, color: "#64748B", fontSize: "0.88rem", lineHeight: 1.65 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Styles
const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "4rem 1.25rem 3rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 860, margin: "0 auto", textAlign: "center" };
const sectorTagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const heroSubStyle: React.CSSProperties = { margin: "0 auto 1.75rem", color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" };
const controlsRowStyle: React.CSSProperties = { display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const };
const toggleGroupStyle: React.CSSProperties = { display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: "0.6rem", padding: "0.2rem", gap: "0.15rem" };
const toggleBtnStyle: React.CSSProperties = { padding: "0.4rem 0.85rem", borderRadius: "0.4rem", border: "none", cursor: "pointer", fontSize: "0.82rem", transition: "all 0.15s", fontFamily: "inherit" };
const cardsWrapStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem 2rem" };
const cardsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", alignItems: "start" };
const planCardStyle: React.CSSProperties = { background: "#FFFFFF", borderRadius: "1rem", padding: "2rem 1.75rem", display: "flex", flexDirection: "column" as const, gap: "1rem", position: "relative" as const };
const badgeStyle: React.CSSProperties = { position: "absolute" as const, top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#1B4D3E", color: "#D4AF37", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", padding: "0.25rem 0.85rem", borderRadius: "999px", whiteSpace: "nowrap" as const };
const planNameStyle: React.CSSProperties = { margin: 0, fontSize: "1rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" };
const priceRowStyle: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: "0.3rem" };
const priceAmountStyle: React.CSSProperties = { fontSize: "2.4rem", fontWeight: 800, color: "#0A1C2E", lineHeight: 1 };
const pricePeriodStyle: React.CSSProperties = { fontSize: "0.88rem", color: "#64748B", fontWeight: 600 };
const gmdEquivStyle: React.CSSProperties = { margin: "-0.5rem 0 0", fontSize: "0.78rem", color: "#64748B" };
const dividerStyle: React.CSSProperties = { borderTop: "1px solid #E2E8F0", margin: "0.25rem 0" };
const featureListStyle: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" as const, gap: "0.6rem", flex: 1 };
const featureItemStyle: React.CSSProperties = { display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.88rem", color: "#0A1C2E", lineHeight: 1.5 };
const checkStyle: React.CSSProperties = { color: "#1B4D3E", fontWeight: 800, flexShrink: 0 };
const ctaBtnStyle: React.CSSProperties = { width: "100%", padding: "0.85rem", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "inherit", marginTop: "0.5rem", transition: "opacity 0.15s" };
const trustBandStyle: React.CSSProperties = { background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "2rem 1.25rem" };
const trustInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" };
const trustItemStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", alignItems: "center" };
const faqWrapStyle: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "3rem 1.25rem 5rem" };
const faqGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" };
const faqItemStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
