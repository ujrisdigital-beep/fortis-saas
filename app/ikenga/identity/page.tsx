"use client";
// app/ikenga/identity/page.tsx
// IKENGA Digital Identity Suite — 5-step wizard
// Brand Profile → Logo → Deep Search → Platform Accounts → Website
import { useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const INDUSTRIES = [
  "Agriculture","Fintech","Health","Education","Energy","Retail",
  "Logistics","Tourism","Media","Tech","Construction","Food & Beverage",
];

const LOGO_STYLES = [
  { id: "modern",      label: "Modern",      icon: "◼", desc: "Clean, minimal, professional" },
  { id: "bold",        label: "Bold",         icon: "◆", desc: "Strong, impactful, memorable" },
  { id: "traditional", label: "Traditional",  icon: "✦", desc: "African-inspired, cultural" },
  { id: "tech",        label: "Tech",         icon: "⬡", desc: "Futuristic, digital aesthetic" },
  { id: "natural",     label: "Natural",      icon: "◯", desc: "Organic, earth tones, green" },
];

const PLATFORM_CATEGORIES = [
  {
    label: "Social Media",
    platforms: [
      { id: "twitter", name: "X / Twitter", icon: "𝕏" },
      { id: "instagram", name: "Instagram", icon: "📸" },
      { id: "facebook", name: "Facebook", icon: "f" },
      { id: "tiktok", name: "TikTok", icon: "♪" },
      { id: "threads", name: "Threads", icon: "𝞰" },
      { id: "snapchat", name: "Snapchat", icon: "👻" },
    ],
  },
  {
    label: "Professional",
    platforms: [
      { id: "linkedin", name: "LinkedIn", icon: "in" },
      { id: "github", name: "GitHub", icon: "⌥" },
      { id: "medium", name: "Medium", icon: "M" },
      { id: "substack", name: "Substack", icon: "S" },
    ],
  },
  {
    label: "Video & Commerce",
    platforms: [
      { id: "youtube", name: "YouTube", icon: "▶" },
      { id: "pinterest", name: "Pinterest", icon: "P" },
      { id: "etsy", name: "Etsy", icon: "e" },
      { id: "shopify", name: "Shopify", icon: "🛍" },
    ],
  },
  {
    label: "Gambia & Africa",
    platforms: [
      { id: "fortisos", name: "FORTIS OS", icon: "🇬🇲" },
      { id: "whatsapp", name: "WhatsApp Biz", icon: "💬" },
      { id: "telegram", name: "Telegram", icon: "✈" },
      { id: "jumia", name: "Jumia", icon: "🛒" },
    ],
  },
];

type Step = 1 | 2 | 3 | 4 | 5;

interface BrandProfile {
  name: string;
  industry: string;
  tagline: string;
  email: string;
  phone: string;
  primaryColor: string;
}

interface LogoResult {
  conceptId: string;
  style: string;
  imageUrl: string | null;
  description: string;
  fallback: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  category: string;
  status: "found" | "available" | "unknown";
  url: string | null;
  handle: string | null;
  confidence: number;
}

const STATUS_COLOR = { found: "#16A34A", available: "#3B82F6", unknown: "#9CA3AF" };
const STATUS_LABEL = { found: "Found", available: "Available", unknown: "Unknown" };

export default function IkengaIdentityPage() {
  const [step, setStep] = useState<Step>(1);
  const [profile, setProfile] = useState<BrandProfile>({
    name: "", industry: "", tagline: "", email: "", phone: "", primaryColor: "#1B4D3E",
  });
  const [logoStyle, setLogoStyle] = useState("modern");
  const [logos, setLogos] = useState<LogoResult[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [generatingLogos, setGeneratingLogos] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const STEPS = [
    { n: 1, label: "Brand Profile" },
    { n: 2, label: "Logo" },
    { n: 3, label: "Deep Search" },
    { n: 4, label: "Platforms" },
    { n: 5, label: "Website" },
  ];

  async function generateLogos() {
    setGeneratingLogos(true);
    try {
      const res = await fetch("/api/ikenga/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: profile.name,
          industry: profile.industry,
          tagline: profile.tagline,
          primaryColor: profile.primaryColor,
          style: logoStyle,
          count: 3,
        }),
      });
      const data = await res.json();
      setLogos(data.concepts ?? []);
    } catch {
      setLogos([]);
    } finally {
      setGeneratingLogos(false);
    }
  }

  async function runDeepSearch() {
    setSearching(true);
    try {
      const res = await fetch("/api/ikenga/deep-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email, phone: profile.phone }),
      });
      const data = await res.json();
      setSearchResults(data.results ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const canProceed1 = profile.name.trim() && profile.industry;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "1.75rem 1.5rem", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>⚡ IKENGA™</div>
              <h1 style={{ margin: 0, color: WHITE, fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 900 }}>Digital Identity Suite</h1>
              <p style={{ margin: "0.2rem 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>
                Your complete digital presence — created in 5 steps
              </p>
            </div>
            <Link href="/ikenga" style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              ← IKENGA
            </Link>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 0 }}>
            {STEPS.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <div key={s.n} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: done ? GOLD : active ? WHITE : "rgba(255,255,255,0.15)",
                      color: done ? DARK : active ? DARK : "rgba(255,255,255,0.4)",
                      fontSize: "0.75rem", fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 4px",
                    }}>
                      {done ? "✓" : s.n}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: active ? WHITE : "rgba(255,255,255,0.45)", fontWeight: active ? 700 : 400 }}>
                      {s.label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ height: 2, flex: 1, background: done ? GOLD : "rgba(255,255,255,0.15)", marginBottom: 20 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: "2rem auto", padding: "0 1.5rem 3rem" }}>

        {/* ── STEP 1: Brand Profile ── */}
        {step === 1 && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.25rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>📋 Brand Profile</h2>
            <p style={{ margin: "0 0 1.5rem", color: "#6B7280", fontSize: "0.85rem" }}>Tell us about your brand. This powers your logo, search, and account setup.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Brand / Business Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Senegambia Digital"
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Industry *</label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", background: WHITE, outline: "none", boxSizing: "border-box" }}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Brand Color</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="color"
                    value={profile.primaryColor}
                    onChange={(e) => setProfile((p) => ({ ...p, primaryColor: e.target.value }))}
                    style={{ width: 44, height: 40, border: "1.5px solid #D1D5DB", borderRadius: 8, cursor: "pointer", padding: 2 }}
                  />
                  <input
                    type="text"
                    value={profile.primaryColor}
                    onChange={(e) => setProfile((p) => ({ ...p, primaryColor: e.target.value }))}
                    style={{ flex: 1, padding: "0.7rem 0.75rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.85rem", fontFamily: "monospace", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Tagline</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder="e.g. Gambia's digital future, today"
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@yourbrand.com"
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+220 XXX XXXX"
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed1}
                style={{ padding: "0.75rem 2rem", background: canProceed1 ? `linear-gradient(135deg, ${PRIMARY}, #2A6B52)` : "#9CA3AF", color: WHITE, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 700, cursor: canProceed1 ? "pointer" : "not-allowed", fontFamily: "inherit" }}
              >
                Next: Logo →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Logo Generation ── */}
        {step === 2 && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.25rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>🎨 AI Logo Generation</h2>
            <p style={{ margin: "0 0 1.5rem", color: "#6B7280", fontSize: "0.85rem" }}>Choose a style. IKENGA AI creates 3 logo concepts for <strong>{profile.name}</strong>.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {LOGO_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setLogoStyle(s.id)}
                  style={{
                    padding: "0.85rem 0.5rem", border: `2px solid ${logoStyle === s.id ? PRIMARY : "#E2E8F0"}`,
                    background: logoStyle === s.id ? `${PRIMARY}08` : WHITE,
                    borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: logoStyle === s.id ? PRIMARY : DARK }}>{s.label}</div>
                  <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: 2 }}>{s.desc}</div>
                </button>
              ))}
            </div>

            {logos.length === 0 && (
              <button
                onClick={generateLogos}
                disabled={generatingLogos}
                style={{ width: "100%", padding: "0.8rem", background: generatingLogos ? "#9CA3AF" : `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 800, cursor: generatingLogos ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: "1rem" }}
              >
                {generatingLogos ? "⏳ Generating logos…" : "🎨 Generate Logo Concepts"}
              </button>
            )}

            {logos.length > 0 && (
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.75rem" }}>Choose your concept:</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                  {logos.map((logo) => (
                    <div
                      key={logo.conceptId}
                      onClick={() => setSelectedLogo(logo.conceptId)}
                      style={{
                        border: `2px solid ${selectedLogo === logo.conceptId ? GOLD : "#E2E8F0"}`,
                        borderRadius: 12, overflow: "hidden", cursor: "pointer",
                        background: selectedLogo === logo.conceptId ? `${GOLD}08` : WHITE,
                      }}
                    >
                      <div style={{ height: 140, background: `linear-gradient(135deg, ${profile.primaryColor}20, ${profile.primaryColor}05)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {logo.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo.imageUrl} alt={`Logo ${logo.conceptId}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        ) : (
                          <div style={{ textAlign: "center", padding: "1rem" }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: profile.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "1.5rem", fontWeight: 900, color: WHITE }}>
                              {profile.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Preview</div>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "0.65rem 0.85rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: DARK }}>
                          {logo.style.charAt(0).toUpperCase() + logo.style.slice(1)} Style
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>{logo.fallback ? "AI Preview" : "DALL-E 3"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateLogos}
                  style={{ fontSize: "0.8rem", color: PRIMARY, background: "none", border: "1px solid #E2E8F0", borderRadius: 7, padding: "0.45rem 1rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "0.5rem" }}
                >
                  ↺ Regenerate
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", marginTop: "1rem" }}>
              <button onClick={() => setStep(1)} style={{ padding: "0.65rem 1.25rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
              <button
                onClick={() => { setStep(3); runDeepSearch(); }}
                style={{ padding: "0.65rem 1.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                {selectedLogo ? "Next: Deep Search →" : "Skip → Deep Search"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Deep Search ── */}
        {step === 3 && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.25rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>🔍 Deep Search — 18 Platforms</h2>
            <p style={{ margin: "0 0 1.25rem", color: "#6B7280", fontSize: "0.85rem" }}>Scanning platforms for <strong>{profile.name}</strong> — finding existing accounts and available handles.</p>

            {searching && (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "#6B7280" }}>
                <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>⏳</div>
                <div style={{ fontWeight: 600 }}>Searching 18 platforms…</div>
                <div style={{ fontSize: "0.8rem", marginTop: 4 }}>This takes a few seconds</div>
              </div>
            )}

            {!searching && searchResults.length > 0 && (
              <div>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  {(["found", "available", "unknown"] as const).map((status) => {
                    const count = searchResults.filter((r) => r.status === status).length;
                    return (
                      <div key={status} style={{ background: `${STATUS_COLOR[status]}10`, border: `1px solid ${STATUS_COLOR[status]}30`, borderRadius: 8, padding: "0.55rem 1rem", display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: STATUS_COLOR[status] }}>{count}</span>
                        <span style={{ fontSize: "0.78rem", color: "#6B7280" }}>{STATUS_LABEL[status]}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.6rem" }}>
                  {searchResults.map((r) => (
                    <div key={r.id} style={{ border: "1.5px solid #E2E8F0", borderLeft: `4px solid ${STATUS_COLOR[r.status]}`, borderRadius: 8, padding: "0.65rem 0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: DARK }}>{r.name}</div>
                        <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>{r.category}</div>
                      </div>
                      <span style={{ padding: "2px 8px", borderRadius: 999, background: `${STATUS_COLOR[r.status]}15`, color: STATUS_COLOR[r.status], fontSize: "0.68rem", fontWeight: 700, flexShrink: 0 }}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!searching && searchResults.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#9CA3AF" }}>
                <button onClick={runDeepSearch} style={{ padding: "0.75rem 1.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  🔍 Run Deep Search
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", marginTop: "1.5rem" }}>
              <button onClick={() => setStep(2)} style={{ padding: "0.65rem 1.25rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
              <button onClick={() => setStep(4)} style={{ padding: "0.65rem 1.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Next: Platforms →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Platform Account Selection ── */}
        {step === 4 && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
            <h2 style={{ margin: "0 0 0.25rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>📱 Select Platforms</h2>
            <p style={{ margin: "0 0 1.25rem", color: "#6B7280", fontSize: "0.85rem" }}>
              Choose which platforms to set up for <strong>{profile.name}</strong>. IKENGA will guide you through account creation for each.
            </p>

            {PLATFORM_CATEGORIES.map((cat) => (
              <div key={cat.label} style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.65rem" }}>{cat.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.5rem" }}>
                  {cat.platforms.map((p) => {
                    const selected = selectedPlatforms.includes(p.id);
                    const searchResult = searchResults.find((r) => r.id === p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        style={{
                          padding: "0.65rem 0.5rem",
                          border: `2px solid ${selected ? PRIMARY : "#E2E8F0"}`,
                          background: selected ? `${PRIMARY}08` : WHITE,
                          borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                          position: "relative",
                        }}
                      >
                        {searchResult && (
                          <div style={{
                            position: "absolute", top: -6, right: -6,
                            width: 14, height: 14, borderRadius: "50%",
                            background: STATUS_COLOR[searchResult.status],
                          }} />
                        )}
                        <div style={{ fontSize: "1.1rem", marginBottom: 3 }}>{p.icon}</div>
                        <div style={{ fontSize: "0.72rem", fontWeight: selected ? 700 : 500, color: selected ? PRIMARY : "#4B5563" }}>{p.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedPlatforms.length > 0 && (
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#1D4ED8" }}>
                ✅ <strong>{selectedPlatforms.length} platforms selected.</strong> IKENGA will create your accounts using the handle <strong>{profile.name.toLowerCase().replace(/\s+/g, "")}</strong>.
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <button onClick={() => setStep(3)} style={{ padding: "0.65rem 1.25rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
              <button onClick={() => setStep(5)} style={{ padding: "0.65rem 1.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Next: Website →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Website ── */}
        {step === 5 && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: "1rem" }}>🌐</div>
            <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.2rem", fontWeight: 800 }}>Your Identity Suite is Ready!</h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              <strong>{profile.name}</strong> is set up across {selectedPlatforms.length} platforms.
              {selectedLogo ? " Your logo has been generated." : ""}
              {" "}Now build your professional website with our Website Builder.
            </p>

            {/* Summary card */}
            <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Identity Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {[
                  { label: "Brand Name", value: profile.name },
                  { label: "Industry", value: profile.industry },
                  { label: "Tagline", value: profile.tagline || "—" },
                  { label: "Platforms", value: `${selectedPlatforms.length} selected` },
                  { label: "Logo", value: selectedLogo ? "Generated" : "Skipped" },
                  { label: "Deep Search", value: searchResults.length > 0 ? `${searchResults.filter(r => r.status === "found").length} found` : "—" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>{item.label}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: DARK }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/website-builder/framer?brand=${encodeURIComponent(profile.name)}&tagline=${encodeURIComponent(profile.tagline)}`}
                style={{ padding: "0.75rem 1.75rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, borderRadius: 10, fontSize: "0.95rem", fontWeight: 800, textDecoration: "none", display: "inline-block" }}
              >
                🚀 Build My Website
              </Link>
              <Link
                href="/ikenga"
                style={{ padding: "0.75rem 1.5rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", display: "inline-block" }}
              >
                Back to IKENGA
              </Link>
            </div>

            <button
              onClick={() => { setStep(1); setProfile({ name: "", industry: "", tagline: "", email: "", phone: "", primaryColor: "#1B4D3E" }); setLogos([]); setSelectedLogo(null); setSearchResults([]); setSelectedPlatforms([]); }}
              style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
