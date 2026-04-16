"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { StarRating } from "../../components/star-rating";
import { saveAnalysis } from "../../lib/learning-engine";

const WATERMARK = "\n\n— FORTIS OS™ | UJU GROUP LIMITED | Confidential";

type UjuResult = {
  digitiseScore: number;
  digitiseActions: string[];
  optimiseOpportunities: string[];
  scaleChannels: string[];
  dominateStrategy: string;
  summary: string;
  phase: string;
};

function GaugeBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>{label}</span>
        <span style={{ fontSize: "0.9rem", fontWeight: 800, color }}>{pct}/100</span>
      </div>
      <div style={{ height: "10px", background: "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function StageBadge({ stage, active }: { stage: string; active: boolean }) {
  return (
    <div style={{
      padding: "0.4rem 0.85rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700,
      background: active ? "var(--color-primary)" : "var(--color-card-bg)",
      color: active ? "#FFFFFF" : "var(--color-text-muted)",
      border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
      transition: "all 0.2s",
    }}>
      {stage}
    </div>
  );
}

const PLACEHOLDER = `Jallow Trading - import/export in Serrekunda. 12 employees. We use WhatsApp for orders and Excel for inventory. Our biggest problem is tracking payments. We want to grow to 50 customers this year.`;

export default function UjuCyclePage() {
  const [text, setText] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UjuResult | null>(null);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState("");
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioMock, setAudioMock] = useState(false);

  async function handleListen(text: string) {
    setAudioLoading(true);
    setAudioUrl(null);
    setAudioMock(false);
    try {
      const res = await fetch("/api/audio/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 3000) }),
      });
      const data = await res.json();
      if (data.mock) { setAudioMock(true); return; }
      setAudioUrl(data.audioUrl);
    } catch {
      setAudioMock(true);
    } finally {
      setAudioLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    setFeedbackDone(false);
    setLastInput(text);

    const offlineKey = `offline_uju_${Date.now()}`;
    localStorage.setItem(offlineKey, JSON.stringify({ businessOverview: text }));

    try {
      const res = await fetch("/api/uju-cycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessOverview: text }),
      });
      const data = await res.json();
      const a = data.analysis ?? data;
      const parsed: UjuResult = {
        digitiseScore: Number(a.digitiseScore ?? a.scores?.transformationReadiness ?? 0),
        digitiseActions: a.digitiseActions ?? a.priorities ?? [],
        optimiseOpportunities: a.optimiseOpportunities ?? a.detectedSignals ?? [],
        scaleChannels: a.scaleChannels ?? [],
        dominateStrategy: a.dominateStrategy ?? a.summary ?? "",
        summary: a.summary ?? "",
        phase: a.phase ?? "Diagnose",
      };
      setResult(parsed);
      localStorage.removeItem(offlineKey);
    } catch {
      setError("Analysis failed. Your submission has been saved offline.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(rating: number, feedback: string) {
    if (result && lastInput) {
      await saveAnalysis("uju-cycle", { businessOverview: lastInput }, result, rating, feedback);
    }
    setFeedbackDone(true);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text + WATERMARK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Navbar />
      <main className="page-wrap" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={eyebrowStyle}>UJU CYCLE™</p>
          <h1 style={pageTitleStyle}>Business Transformation Analyzer</h1>
          <p style={pageSubStyle}>
            Describe your business in plain language. The AI will score you across four transformation stages — Digitise, Optimise, Scale, and Dominate — and give you an action plan.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            {["DIGITISE", "OPTIMISE", "SCALE", "DOMINATE"].map((s) => (
              <StageBadge key={s} stage={s} active={result?.phase?.toUpperCase() === s.split("→")[0] || false} />
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="fortis-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={labelStyle} htmlFor="uju-text">
              Tell us about your business <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <textarea
              id="uju-text"
              className="fortis-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              style={{ minHeight: "170px" }}
              required
            />
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              Include: what you sell, team size, biggest challenge, revenue stage, and growth goals.
            </p>
            {error && <div style={errorBoxStyle}>{error}</div>}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn-primary" disabled={loading || !text.trim()} style={{ minWidth: "180px" }}>
                {loading ? <><span className="spinner" /> Analyzing...</> : "Analyze My Business"}
              </button>
              {result && (
                <button type="button" className="btn-secondary" onClick={() => { setResult(null); setFeedbackDone(false); }}>
                  Refine Analysis
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Phase Banner */}
            <div style={phaseBannerStyle}>
              <div style={{ flex: 1 }}>
                <p style={phaseEyebrowStyle}>Current Phase</p>
                <h2 style={phaseTitleStyle}>{result.phase}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleListen(`${result.summary} ${result.dominateStrategy}`)}
                  disabled={audioLoading}
                  style={listenBtnStyle}
                >
                  {audioLoading ? "⏳ Loading…" : audioUrl ? "🔊 Playing" : "🔊 Listen"}
                </button>
                <div style={phaseBadgeStyle}>{result.phase?.toUpperCase()}</div>
              </div>
            </div>
            {audioMock && (
              <p style={audioMockStyle}>Add <code>ELEVENLABS_API_KEY</code> to enable audio summaries.</p>
            )}
            {audioUrl && (
              <audio src={audioUrl} controls autoPlay style={{ width: "100%", marginTop: "0.5rem" }} />
            )}
            <p style={summaryBoxStyle}>{result.summary}</p>

            {/* DIGITISE */}
            <div style={stageCardStyle}>
              <div style={stageHeaderStyle}>
                <div style={{ ...stageIconStyle, background: "rgba(27,77,62,0.1)" }}>
                  <span>🔢</span>
                </div>
                <div>
                  <p style={stageTagStyle}>STAGE 1</p>
                  <h3 style={stageTitleStyle}>Digitise</h3>
                </div>
              </div>
              <GaugeBar
                label="Digitise Readiness"
                value={result.digitiseScore}
                color={result.digitiseScore >= 70 ? "#10B981" : result.digitiseScore >= 45 ? "#D4AF37" : "#E63946"}
              />
              {result.digitiseActions.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={listLabelStyle}>Action Items</p>
                  <ol style={orderedListStyle}>
                    {result.digitiseActions.map((a, i) => (
                      <li key={i} style={listItemStyle}>{a}</li>
                    ))}
                  </ol>
                </div>
              )}
              <CopyBtn label="Copy Digitise Actions" onCopy={() => handleCopy(result.digitiseActions.join("\n"))} />
            </div>

            {/* OPTIMISE */}
            {result.optimiseOpportunities.length > 0 && (
              <div style={stageCardStyle}>
                <div style={stageHeaderStyle}>
                  <div style={{ ...stageIconStyle, background: "rgba(212,175,55,0.1)" }}>
                    <span>⚙️</span>
                  </div>
                  <div>
                    <p style={stageTagStyle}>STAGE 2</p>
                    <h3 style={stageTitleStyle}>Optimise</h3>
                  </div>
                </div>
                <div style={tagWrapStyle}>
                  {result.optimiseOpportunities.map((opp, i) => (
                    <span key={i} style={oppTagStyle}>{opp}</span>
                  ))}
                </div>
                <CopyBtn label="Copy Opportunities" onCopy={() => handleCopy(result.optimiseOpportunities.join("\n"))} />
              </div>
            )}

            {/* SCALE */}
            {result.scaleChannels.length > 0 && (
              <div style={stageCardStyle}>
                <div style={stageHeaderStyle}>
                  <div style={{ ...stageIconStyle, background: "rgba(27,77,62,0.1)" }}>
                    <span>📈</span>
                  </div>
                  <div>
                    <p style={stageTagStyle}>STAGE 3</p>
                    <h3 style={stageTitleStyle}>Scale</h3>
                  </div>
                </div>
                <div style={channelGridStyle}>
                  {result.scaleChannels.map((ch, i) => (
                    <div key={i} style={channelCardStyle}>
                      <span style={channelIconStyle}>→</span>
                      <span style={{ fontSize: "0.88rem", color: "var(--color-text)" }}>{ch}</span>
                    </div>
                  ))}
                </div>
                <CopyBtn label="Copy Scale Channels" onCopy={() => handleCopy(result.scaleChannels.join("\n"))} />
              </div>
            )}

            {/* DOMINATE */}
            {result.dominateStrategy && (
              <div style={{ ...stageCardStyle, background: "rgba(27,77,62,0.04)", border: "1.5px solid rgba(27,77,62,0.2)" }}>
                <div style={stageHeaderStyle}>
                  <div style={{ ...stageIconStyle, background: "rgba(212,175,55,0.15)" }}>
                    <span>👑</span>
                  </div>
                  <div>
                    <p style={stageTagStyle}>STAGE 4</p>
                    <h3 style={stageTitleStyle}>Dominate</h3>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.75, color: "var(--color-text)", fontWeight: 500 }}>
                  {result.dominateStrategy}
                </p>
                <CopyBtn label={copied ? "Copied!" : "Copy Strategy"} onCopy={() => handleCopy(result.dominateStrategy)} />
              </div>
            )}

            {/* Feedback */}
            <StarRating tool="UJU Cycle" onSubmit={handleFeedback} submitted={feedbackDone} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function CopyBtn({ label, onCopy }: { label: string; onCopy: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { onCopy(); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={copyBtnStyle}
    >
      {done ? "✓ Copied" : `📋 ${label}`}
    </button>
  );
}

const eyebrowStyle: React.CSSProperties = { margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.14em", color: "var(--color-primary)" };
const pageTitleStyle: React.CSSProperties = { margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "var(--color-text)" };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "var(--color-text-muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "64ch" };
const labelStyle: React.CSSProperties = { fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text)" };
const errorBoxStyle: React.CSSProperties = { padding: "0.75rem 1rem", background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: "0.5rem", color: "#991b1b", fontSize: "0.88rem" };
const phaseBannerStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", background: "var(--color-primary)", borderRadius: "0.75rem", flexWrap: "wrap", gap: "0.75rem" };
const listenBtnStyle: React.CSSProperties = { padding: "0.4rem 1rem", background: "rgba(255,255,255,0.15)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "999px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" };
const audioMockStyle: React.CSSProperties = { margin: 0, padding: "0.6rem 1rem", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "0.5rem", fontSize: "0.8rem", color: "#92400e" };
const phaseEyebrowStyle: React.CSSProperties = { margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)" };
const phaseTitleStyle: React.CSSProperties = { margin: "0.2rem 0 0", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" };
const phaseBadgeStyle: React.CSSProperties = { background: "#D4AF37", color: "#0A1C2E", fontWeight: 800, fontSize: "0.82rem", padding: "0.45rem 1.1rem", borderRadius: "999px", letterSpacing: "0.06em" };
const summaryBoxStyle: React.CSSProperties = { margin: 0, padding: "1.25rem", background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "0.6rem", color: "var(--color-text)", fontSize: "1rem", lineHeight: 1.7 };
const stageCardStyle: React.CSSProperties = { padding: "1.5rem", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.85rem", display: "flex", flexDirection: "column" as const, gap: "0.85rem" };
const stageHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.85rem" };
const stageIconStyle: React.CSSProperties = { width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 };
const stageTagStyle: React.CSSProperties = { margin: 0, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--color-text-muted)" };
const stageTitleStyle: React.CSSProperties = { margin: "0.1rem 0 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)" };
const listLabelStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--color-text-muted)" };
const orderedListStyle: React.CSSProperties = { margin: 0, padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column" as const, gap: "0.5rem" };
const listItemStyle: React.CSSProperties = { fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.65 };
const tagWrapStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap" as const, gap: "0.45rem" };
const oppTagStyle: React.CSSProperties = { padding: "0.35rem 0.85rem", borderRadius: "999px", background: "var(--color-primary-light)", color: "var(--color-primary)", fontSize: "0.82rem", fontWeight: 600, border: "1px solid rgba(27,77,62,0.15)" };
const channelGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.5rem" };
const channelCardStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "0.5rem" };
const channelIconStyle: React.CSSProperties = { color: "var(--color-primary)", fontWeight: 800, flexShrink: 0 };
const copyBtnStyle: React.CSSProperties = { alignSelf: "flex-start" as const, border: "1px solid var(--color-border)", background: "#FFFFFF", color: "var(--color-text-muted)", fontSize: "0.78rem", fontWeight: 600, padding: "0.4rem 0.85rem", borderRadius: "0.45rem", cursor: "pointer", fontFamily: "inherit" };
