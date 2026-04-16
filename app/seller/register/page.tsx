"use client";

import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

type Step = "info" | "kyc" | "deposit" | "confirm";

type FormData = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  idType: string;
  idNumber: string;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  mobileNumber: string;
  agreeTerms: boolean;
};

const CATEGORIES = [
  "Fashion & Textiles", "Food & Agriculture", "Electronics", "Crafts & Art",
  "Beauty & Health", "Home & Furniture", "Services", "Tourism", "Other",
];

const ID_TYPES = ["National ID", "Passport", "Driver's License", "Voter Card"];

const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Business Info" },
  { id: "kyc", label: "KYC Verification" },
  { id: "deposit", label: "Security Deposit" },
  { id: "confirm", label: "Confirmation" },
];

export default function SellerRegisterPage() {
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    businessName: "", ownerName: "", phone: "", email: "", address: "",
    category: "", idType: "National ID", idNumber: "", paymentMethod: "mobile",
    bankName: "", accountNumber: "", mobileNumber: "", agreeTerms: false,
  });

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function next() {
    const order: Step[] = ["info", "kyc", "deposit", "confirm"];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  }
  function back() {
    const order: Step[] = ["info", "kyc", "deposit", "confirm"];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
  }

  async function submit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main style={pageStyle}>
          <div style={successCardStyle}>
            <div style={{ fontSize: "3.5rem" }}>✅</div>
            <h1 style={{ margin: "0.75rem 0 0.5rem", fontSize: "1.5rem", fontWeight: 800, color: "#0A1C2E" }}>
              Application Received!
            </h1>
            <p style={{ color: "#64748B", margin: "0 0 1.5rem", lineHeight: 1.7, maxWidth: "45ch", textAlign: "center" }}>
              Your seller registration and 500 GMD deposit is being processed. We will verify your documents
              and activate your account within <strong>24–48 hours</strong>.
            </p>
            <div style={escrowNoticeStyle}>
              <strong>Deposit: 500 GMD held in escrow</strong><br />
              Released after 10 successful sales + 4.5★ rating + 30 days active
            </div>
            <a href="/marketplace" style={ctaLinkStyle}>Browse Marketplace →</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Header */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <span style={tagStyle}>BECOME A SELLER</span>
            <h1 style={heroTitleStyle}>Register Your Business</h1>
            <p style={heroSubStyle}>
              Join Gambia's trusted marketplace. One-time 500 GMD security deposit protects buyers and builds your reputation.
            </p>
          </div>
        </div>

        <div style={contentWrapStyle}>
          {/* Stepper */}
          <div style={stepperStyle}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={stepWrapStyle}>
                <div style={{
                  ...stepCircleStyle,
                  background: i < stepIndex ? "#1B4D3E" : i === stepIndex ? "#D4AF37" : "#E2E8F0",
                  color: i <= stepIndex ? "#FFFFFF" : "#64748B",
                }}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: i === stepIndex ? 700 : 500, color: i === stepIndex ? "#1B4D3E" : "#64748B" }}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div style={stepLineStyle} />}
              </div>
            ))}
          </div>

          <div style={formCardStyle}>

            {/* Step 1: Business Info */}
            {step === "info" && (
              <div>
                <h2 style={cardTitleStyle}>Business Information</h2>
                <div style={fieldsStyle}>
                  <Field label="Business Name *" value={form.businessName} onChange={(v) => set("businessName", v)} placeholder="e.g. Fatou's Fashion House" />
                  <Field label="Owner Full Name *" value={form.ownerName} onChange={(v) => set("ownerName", v)} placeholder="e.g. Fatou Jallow" />
                  <Field label="Phone (WhatsApp) *" value={form.phone} onChange={(v) => set("phone", v)} placeholder="e.g. 2207012345" type="tel" />
                  <Field label="Email Address *" value={form.email} onChange={(v) => set("email", v)} placeholder="e.g. fatou@example.com" type="email" />
                  <Field label="Business Address *" value={form.address} onChange={(v) => set("address", v)} placeholder="e.g. Serrekunda Market, KMC" />
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Business Category *</label>
                    <select
                      className="fortis-input"
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                    >
                      <option value="">Select category…</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={navBtnsStyle}>
                  <div />
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!form.businessName || !form.ownerName || !form.phone || !form.category}
                    onClick={next}
                    style={{ opacity: (!form.businessName || !form.ownerName || !form.phone || !form.category) ? 0.5 : 1 }}
                  >
                    Next: KYC →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: KYC */}
            {step === "kyc" && (
              <div>
                <h2 style={cardTitleStyle}>Identity Verification (KYC)</h2>
                <div style={kycNoticeStyle}>
                  <strong>🔐 Why we verify:</strong> KYC protects buyers and ensures marketplace trust. Your information is encrypted and never shared with third parties.
                </div>
                <div style={fieldsStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>ID Document Type *</label>
                    <select className="fortis-input" value={form.idType} onChange={(e) => set("idType", e.target.value)}>
                      {ID_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <Field label="ID Number *" value={form.idNumber} onChange={(v) => set("idNumber", v)} placeholder="Enter your ID number" />

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Upload Front of ID *</label>
                    <div style={uploadBoxStyle}>
                      <span style={{ fontSize: "2rem" }}>📄</span>
                      <p style={{ margin: "0.5rem 0 0.25rem", fontWeight: 700, color: "#0A1C2E", fontSize: "0.88rem" }}>Click to upload or drag & drop</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>JPG, PNG or PDF — max 5MB</p>
                      <input type="file" accept="image/*,.pdf" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </div>
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Upload Selfie with ID *</label>
                    <div style={uploadBoxStyle}>
                      <span style={{ fontSize: "2rem" }}>🤳</span>
                      <p style={{ margin: "0.5rem 0 0.25rem", fontWeight: 700, color: "#0A1C2E", fontSize: "0.88rem" }}>Photo of you holding your ID</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>Clear face + ID visible — max 5MB</p>
                      <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </div>
                  </div>
                </div>
                <div style={navBtnsStyle}>
                  <button type="button" onClick={back} style={backBtnStyle}>← Back</button>
                  <button type="button" className="btn-primary" disabled={!form.idNumber} onClick={next} style={{ opacity: !form.idNumber ? 0.5 : 1 }}>
                    Next: Deposit →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Deposit */}
            {step === "deposit" && (
              <div>
                <h2 style={cardTitleStyle}>Security Deposit — 500 GMD</h2>

                <div style={depositInfoBoxStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0 0 0.25rem", fontWeight: 800, fontSize: "1.4rem", color: "#1B4D3E" }}>500 GMD</p>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748B" }}>One-time refundable deposit</p>
                    </div>
                    <span style={{ fontSize: "2.5rem" }}>🔐</span>
                  </div>
                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      "✅ Held in escrow — not charged to your balance",
                      "✅ Released after 10 sales + 4.5★ + 30 days",
                      "⚠️ Forfeited on valid buyer complaints or fraud",
                    ].map((t) => (
                      <p key={t} style={{ margin: 0, fontSize: "0.85rem", color: "#0A1C2E" }}>{t}</p>
                    ))}
                  </div>
                </div>

                <div style={fieldsStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Payment Method</label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {[
                        { id: "mobile", label: "📱 Mobile Money", sub: "Wave / Afrimoney" },
                        { id: "bank", label: "🏦 Bank Transfer", sub: "Ecobank / GTBank" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => set("paymentMethod", m.id)}
                          style={{
                            flex: 1, padding: "0.85rem", borderRadius: "0.6rem", border: `2px solid ${form.paymentMethod === m.id ? "#1B4D3E" : "#E2E8F0"}`,
                            background: form.paymentMethod === m.id ? "rgba(27,77,62,0.06)" : "#FFFFFF",
                            cursor: "pointer", fontFamily: "inherit", textAlign: "center" as const,
                          }}
                        >
                          <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.88rem", color: "#0A1C2E" }}>{m.label}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>{m.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.paymentMethod === "mobile" && (
                    <Field label="Mobile Money Number *" value={form.mobileNumber} onChange={(v) => set("mobileNumber", v)} placeholder="e.g. 2207012345" type="tel" />
                  )}

                  {form.paymentMethod === "bank" && (
                    <>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Bank Name *</label>
                        <select className="fortis-input" value={form.bankName} onChange={(e) => set("bankName", e.target.value)}>
                          <option value="">Select bank…</option>
                          {["Ecobank Gambia", "GTBank Gambia", "Trust Bank", "First International Bank", "Bloom Bank"].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <Field label="Account Number *" value={form.accountNumber} onChange={(v) => set("accountNumber", v)} placeholder="Enter account number" />
                    </>
                  )}

                  <div style={fieldStyle}>
                    <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => set("agreeTerms", e.target.checked)}
                        style={{ marginTop: "0.2rem", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#0A1C2E", lineHeight: 1.5 }}>
                        I agree to the <a href="/terms" style={{ color: "#1B4D3E", fontWeight: 700 }}>Seller Terms & Conditions</a> and understand the deposit forfeit policy.
                      </span>
                    </label>
                  </div>
                </div>

                <div style={navBtnsStyle}>
                  <button type="button" onClick={back} style={backBtnStyle}>← Back</button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!form.agreeTerms || loading}
                    onClick={submit}
                    style={{ opacity: !form.agreeTerms ? 0.5 : 1, minWidth: "160px" }}
                  >
                    {loading ? "Processing…" : "Pay 500 GMD & Register"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={sidePanelStyle}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 700, color: "#0A1C2E" }}>
              Why Sell on Buy Gambia?
            </h3>
            {[
              { icon: "🌍", title: "National Reach", body: "Sell to buyers across all regions of The Gambia." },
              { icon: "🔒", title: "Escrow Protection", body: "Funds held safely until delivery is confirmed." },
              { icon: "⭐", title: "Build Your Reputation", body: "Ratings and badges increase buyer trust and sales." },
              { icon: "📱", title: "WhatsApp Integration", body: "Buyers contact you directly via WhatsApp." },
              { icon: "💰", title: "Low Commission", body: "Only 5% per successful sale. No monthly fee." },
            ].map((b) => (
              <div key={b.title} style={benefitItemStyle}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.85rem", color: "#1B4D3E" }}>{b.title}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B", lineHeight: 1.5 }}>{b.body}</p>
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

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input type={type} className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// Styles
const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" };
const contentWrapStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" };
const stepperStyle: React.CSSProperties = { gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 0, marginBottom: "0.5rem" };
const stepWrapStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 };
const stepCircleStyle: React.CSSProperties = { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 };
const stepLineStyle: React.CSSProperties = { flex: 1, height: "2px", background: "#E2E8F0", marginLeft: "0.5rem" };
const formCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "1rem", padding: "2rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.5rem", fontSize: "1.1rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const navBtnsStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem" };
const backBtnStyle: React.CSSProperties = { background: "none", border: "1.5px solid #E2E8F0", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 700, color: "#64748B", fontFamily: "inherit", fontSize: "0.88rem" };
const kycNoticeStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.65rem", padding: "0.85rem 1rem", fontSize: "0.85rem", color: "#0A1C2E", marginBottom: "1.25rem", lineHeight: 1.6 };
const uploadBoxStyle: React.CSSProperties = { border: "2px dashed #E2E8F0", borderRadius: "0.65rem", padding: "1.75rem 1rem", textAlign: "center" as const, cursor: "pointer", position: "relative" as const, display: "flex", flexDirection: "column" as const, alignItems: "center" };
const depositInfoBoxStyle: React.CSSProperties = { background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: "0.85rem", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" };
const sidePanelStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column" as const, gap: "1rem" };
const benefitItemStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", alignItems: "flex-start" };
const successCardStyle: React.CSSProperties = { maxWidth: 520, margin: "5rem auto", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "1rem", padding: "3rem 2.5rem", display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const };
const escrowNoticeStyle: React.CSSProperties = { background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.65rem", padding: "0.85rem 1.25rem", fontSize: "0.85rem", color: "#0A1C2E", lineHeight: 1.6 };
const ctaLinkStyle: React.CSSProperties = { display: "inline-block", marginTop: "0.75rem", background: "#1B4D3E", color: "#FFFFFF", padding: "0.75rem 2rem", borderRadius: "0.6rem", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" };
