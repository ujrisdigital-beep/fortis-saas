"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { StarRating } from "../../components/star-rating";
import { saveAnalysis } from "../../lib/learning-engine";

const WATERMARK = "\n\n— FORTIS OS™ | UJU GROUP LIMITED | Confidential Analysis";

const DOC_TYPES = ["Contract", "Agreement", "Police Statement", "SAR Response", "Employment Letter", "Court Order", "MOU", "Policy Document", "Service Agreement", "Loan Agreement", "Other"];

const ACCEPTED_TYPES: Record<string, { type: string; icon: string; label: string }> = {
  "application/pdf": { type: "document", icon: "📄", label: "PDF" },
  "application/msword": { type: "document", icon: "📝", label: "Word Doc" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { type: "document", icon: "📝", label: "Word Doc" },
  "text/plain": { type: "document", icon: "📃", label: "Text File" },
  "text/rtf": { type: "document", icon: "📃", label: "RTF" },
  "application/rtf": { type: "document", icon: "📃", label: "RTF" },
  "application/zip": { type: "archive", icon: "🗜️", label: "ZIP Archive" },
  "application/x-rar-compressed": { type: "archive", icon: "🗜️", label: "RAR Archive" },
  "application/x-7z-compressed": { type: "archive", icon: "🗜️", label: "7Z Archive" },
  "image/jpeg": { type: "image", icon: "🖼️", label: "JPEG Image" },
  "image/png": { type: "image", icon: "🖼️", label: "PNG Image" },
  "image/gif": { type: "image", icon: "🖼️", label: "GIF Image" },
  "image/webp": { type: "image", icon: "🖼️", label: "WebP Image" },
  "audio/mpeg": { type: "audio", icon: "🎵", label: "MP3 Audio" },
  "audio/wav": { type: "audio", icon: "🎵", label: "WAV Audio" },
  "audio/ogg": { type: "audio", icon: "🎵", label: "OGG Audio" },
  "audio/mp4": { type: "audio", icon: "🎵", label: "M4A Audio" },
  "video/mp4": { type: "video", icon: "🎬", label: "MP4 Video" },
  "video/webm": { type: "video", icon: "🎬", label: "WebM Video" },
};

type RedFlag = { severity: "Critical" | "High" | "Medium" | "Low"; text: string };
type UjrisResult = {
  integrityScore: number;
  redFlags: RedFlag[];
  recommendations: string[];
  gambianLawViolations: string[];
  summary: string;
};

function IntegrityGauge({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const { color, bg, label } =
    pct >= 70 ? { color: "#065f46", bg: "#dcfce7", label: "Low Risk" }
    : pct >= 45 ? { color: "#92400e", bg: "#fef3c7", label: "Moderate Risk" }
    : { color: "#991b1b", bg: "#fee2e2", label: "High Risk" };
  const r = 50;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  const strokeColor = pct >= 70 ? "#10B981" : pct >= 45 ? "#D4AF37" : "#E63946";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${fill} ${circ - fill}`} transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 0.8s ease" }} />
          <text x="60" y="52" textAnchor="middle" fontSize="22" fontWeight="800" fill={strokeColor}>{pct}</text>
          <text x="60" y="68" textAnchor="middle" fontSize="9" fill="#64748B">/100 SCORE</text>
        </svg>
      </div>
      <div>
        <div style={{ display: "inline-block", padding: "0.3rem 0.85rem", borderRadius: "999px", background: bg, color, fontWeight: 800, fontSize: "0.88rem", marginBottom: "0.4rem" }}>
          {label}
        </div>
        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>
          Document Integrity Score
        </p>
      </div>
    </div>
  );
}

const SEVERITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Critical: { bg: "#fef2f2", color: "#991b1b", border: "rgba(239,68,68,0.3)" },
  High: { bg: "#fff7ed", color: "#9a3412", border: "rgba(249,115,22,0.3)" },
  Medium: { bg: "#fefce8", color: "#92400e", border: "rgba(234,179,8,0.3)" },
  Low: { bg: "#f0fdf4", color: "#166534", border: "rgba(34,197,94,0.3)" },
};

function parseRedFlags(raw: unknown[]): RedFlag[] {
  return raw.map((item) => {
    if (typeof item === "string") {
      const lower = item.toLowerCase();
      const severity: RedFlag["severity"] = lower.includes("critical") ? "Critical"
        : lower.includes("high") ? "High"
        : lower.includes("medium") ? "Medium"
        : "Low";
      return { severity, text: item };
    }
    const obj = item as Record<string, string>;
    return {
      severity: (obj.severity as RedFlag["severity"]) ?? "Medium",
      text: obj.text ?? obj.flag ?? String(item),
    };
  });
}

export default function AskUjrisPage() {
  const [docType, setDocType] = useState("Contract");
  const [concern, setConcern] = useState("");
  const [docText, setDocText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileNote, setFileNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UjrisResult | null>(null);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState<object>({});
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

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const info = ACCEPTED_TYPES[file.type] ?? { type: "unknown", icon: "📁", label: file.type || "Unknown" };

    if (info.type === "unknown" && !file.name.match(/\.(pdf|doc|docx|txt|rtf|zip|rar|7z|jpe?g|png|gif|webp|mp3|wav|ogg|m4a|mp4|webm)$/i)) {
      setFileNote(`⚠️ File type "${file.type || file.name.split(".").pop()}" is not supported. Please upload a document, image, audio, video, or archive.`);
      setFileName("");
      return;
    }

    setFileName(`${info.icon} ${file.name} (${info.label})`);
    setFileType(info.type);
    setFileNote("");

    if (info.type === "document" && (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".rtf"))) {
      const reader = new FileReader();
      reader.onload = () => setDocText(String(reader.result ?? ""));
      reader.readAsText(file);
    } else if (info.type === "image") {
      setDocText((prev) => prev || `[${info.icon} IMAGE UPLOADED: ${file.name}]\nOCR placeholder — image text extraction will be processed server-side.\nPlease also paste any visible text from the image below.`);
    } else if (info.type === "audio") {
      setDocText((prev) => prev || `[${info.icon} AUDIO UPLOADED: ${file.name}]\nTranscription placeholder — audio will be transcribed server-side.\nPlease summarise the audio content below if known.`);
    } else if (info.type === "video") {
      setDocText((prev) => prev || `[${info.icon} VIDEO UPLOADED: ${file.name}]\nVideo audio extraction placeholder — will be processed server-side.\nPlease summarise the video content below.`);
    } else if (info.type === "archive") {
      setDocText((prev) => prev || `[${info.icon} ARCHIVE UPLOADED: ${file.name}]\nArchive contents will be extracted and listed server-side.\nPlease list the key documents inside the archive below.`);
    } else {
      setDocText((prev) => prev || `[${info.icon} UPLOADED: ${file.name}]\nPaste the key clauses or text from this document below for analysis.`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docText.trim()) { setError("Please paste document text or upload a readable file."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    setFeedbackDone(false);

    const input = { documentType: docType, concern, documentText: docText };
    setLastInput(input);

    const offlineKey = `offline_ujris_page_${Date.now()}`;
    localStorage.setItem(offlineKey, JSON.stringify(input));

    try {
      const res = await fetch("/api/ask-ujris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      const a = data.analysis ?? data;

      const rawFlags = a.redFlags ?? a.flaggedClauses ?? [];
      const flags = parseRedFlags(rawFlags);

      setResult({
        integrityScore: Number(a.integrityScore ?? a.scores?.integrityScore ?? 0),
        redFlags: flags,
        recommendations: a.recommendations ?? a.recommendedActions ?? [],
        gambianLawViolations: a.gambianLawViolations ?? a.lawViolations ?? [],
        summary: a.summary ?? "",
      });
      localStorage.removeItem(offlineKey);
    } catch {
      setError("Analysis failed. Your submission has been saved offline.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(rating: number, feedback: string) {
    if (result) {
      await saveAnalysis("ask-ujris", lastInput, result, rating, feedback);
    }
    setFeedbackDone(true);
  }

  function handleCopy() {
    if (!result) return;
    const text = [
      `INTEGRITY SCORE: ${result.integrityScore}/100`,
      `SUMMARY: ${result.summary}`,
      result.redFlags.length ? `\nRED FLAGS:\n${result.redFlags.map(f => `[${f.severity}] ${f.text}`).join("\n")}` : "",
      result.gambianLawViolations.length ? `\nGAMBIAN LAW CONCERNS:\n${result.gambianLawViolations.join("\n")}` : "",
      result.recommendations.length ? `\nRECOMMENDATIONS:\n${result.recommendations.join("\n")}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text + WATERMARK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const criticalCount = result?.redFlags.filter(f => f.severity === "Critical").length ?? 0;
  const highCount = result?.redFlags.filter(f => f.severity === "High").length ?? 0;

  return (
    <>
      <Navbar />
      <main className="page-wrap" style={{ maxWidth: "860px" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={eyebrowStyle}>ASK UJRIS™</p>
          <h1 style={pageTitleStyle}>Forensic Document Analyzer</h1>
          <p style={pageSubStyle}>
            Upload any document, audio, video, image, or archive. UJRIS gives you an integrity score, flags risk clauses by severity, identifies Gambian law concerns, and recommends action before you sign.
          </p>
        </div>

        <div className="fortis-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={formStyle}>
            {/* Type + Concern */}
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Document Type <span style={reqStyle}>*</span></label>
                <select className="fortis-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Your Main Concern</label>
                <input type="text" className="fortis-input" value={concern} onChange={(e) => setConcern(e.target.value)} placeholder="e.g. Payment terms, IP rights, termination" />
              </div>
            </div>

            {/* File upload */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Upload File <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: "0.8rem" }}>(docs, images, audio, video, archives)</span></label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.m4a,.mp4,.webm"
                onChange={handleFile}
                className="fortis-input"
                style={{ paddingTop: "0.55rem", cursor: "pointer" }}
              />
              {fileName && <p style={fileNameStyle}>{fileName}</p>}
              {fileNote && <p style={fileNoteStyle}>{fileNote}</p>}
              {fileType === "image" && <p style={hintStyle}>📸 OCR text extraction will be applied to the uploaded image.</p>}
              {fileType === "audio" && <p style={hintStyle}>🎙️ Audio transcription will be applied server-side.</p>}
              {fileType === "video" && <p style={hintStyle}>🎬 Video audio extraction placeholder.</p>}
              {fileType === "archive" && <p style={hintStyle}>📦 Archive contents will be listed and analyzed.</p>}
            </div>

            {/* Text area */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Document Text <span style={reqStyle}>*</span></label>
              <textarea
                className="fortis-textarea"
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste the full document text, contract clauses, or key terms here. The more text, the more precise the analysis."
                rows={8}
                style={{ minHeight: "200px" }}
              />
            </div>

            {error && <div style={errorBoxStyle}>{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading || !docText.trim()} style={{ alignSelf: "flex-start", minWidth: "200px" }}>
              {loading ? <><span className="spinner" /> Analyzing Document...</> : "Analyze Document"}
            </button>
          </form>
        </div>

        {result && (
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Score + Summary */}
            <div style={scoreBannerStyle}>
              <IntegrityGauge score={result.integrityScore} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", lineHeight: 1.65, color: "var(--color-text)" }}>{result.summary}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {criticalCount > 0 && <span style={severityCountBadge("Critical")}>{criticalCount} Critical</span>}
                  {highCount > 0 && <span style={severityCountBadge("High")}>{highCount} High</span>}
                  <button type="button" onClick={handleCopy} style={copyBtnStyle}>{copied ? "✓ Copied" : "📋 Copy Report"}</button>
                  <button
                    type="button"
                    onClick={() => handleListen(
                      `Document integrity score: ${result.integrityScore} out of 100. ${result.summary} ${result.redFlags.length > 0 ? `Red flags detected: ${result.redFlags.map(f => `${f.severity}: ${f.text}`).join(". ")}` : "No red flags detected."}`
                    )}
                    disabled={audioLoading}
                    style={listenBtnStyle}
                  >
                    {audioLoading ? "⏳ Loading…" : "🔊 Listen"}
                  </button>
                </div>
                {audioMock && (
                  <p style={audioMockStyle}>Add <code>ELEVENLABS_API_KEY</code> to enable audio summaries.</p>
                )}
                {audioUrl && (
                  <audio src={audioUrl} controls autoPlay style={{ width: "100%", marginTop: "0.5rem" }} />
                )}
              </div>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 ? (
              <div style={sectionCardStyle}>
                <p style={sectionLabelStyle}>Red Flags — {result.redFlags.length} Issue{result.redFlags.length !== 1 ? "s" : ""} Detected</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {(["Critical", "High", "Medium", "Low"] as RedFlag["severity"][]).map((sev) => {
                    const flags = result.redFlags.filter(f => f.severity === sev);
                    if (flags.length === 0) return null;
                    const s = SEVERITY_STYLES[sev];
                    return (
                      <div key={sev}>
                        <p style={{ margin: "0 0 0.4rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: s.color }}>{sev}</p>
                        {flags.map((flag, i) => (
                          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", padding: "0.65rem 0.85rem", marginBottom: "0.35rem", background: s.bg, border: `1px solid ${s.border}`, borderRadius: "0.5rem" }}>
                            <span style={{ flexShrink: 0, fontSize: "0.85rem" }}>⚠</span>
                            <p style={{ margin: 0, fontSize: "0.88rem", color: s.color, lineHeight: 1.6 }}>{flag.text}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: "1rem 1.25rem", background: "#f0fdf4", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0.75rem" }}>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "#065f46", fontWeight: 600 }}>
                  ✓ No critical red flags detected. Proceed with careful standard review.
                </p>
              </div>
            )}

            {/* Gambian Law Violations */}
            {result.gambianLawViolations.length > 0 && (
              <div style={{ ...sectionCardStyle, borderColor: "rgba(239,68,68,0.2)", background: "#fff8f8" }}>
                <p style={{ ...sectionLabelStyle, color: "#991b1b" }}>Gambian Law Concerns</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {result.gambianLawViolations.map((v, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                      <span style={{ color: "#991b1b", fontWeight: 800, flexShrink: 0 }}>⚖</span>
                      <p style={{ margin: 0, fontSize: "0.88rem", color: "#991b1b", lineHeight: 1.6 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div style={sectionCardStyle}>
                <p style={sectionLabelStyle}>Recommended Actions</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} style={recCardStyle}>
                      <span style={recNumStyle}>{i + 1}</span>
                      <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--color-text)", lineHeight: 1.6 }}>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={disclaimerStyle}>
              AI-generated analysis for informational purposes. Always consult a qualified legal professional before signing. This report carries a metadata watermark when copied.
            </p>

            <StarRating tool="Ask UJRIS" onSubmit={handleFeedback} submitted={feedbackDone} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function severityCountBadge(sev: string): React.CSSProperties {
  const s = SEVERITY_STYLES[sev];
  return { padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` };
}

const eyebrowStyle: React.CSSProperties = { margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.14em", color: "var(--color-primary)" };
const pageTitleStyle: React.CSSProperties = { margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "var(--color-text)" };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "var(--color-text-muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "64ch" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1.25rem" };
const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "var(--color-text)" };
const reqStyle: React.CSSProperties = { color: "var(--color-danger)" };
const fileNameStyle: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: 600 };
const fileNoteStyle: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--color-danger)", fontWeight: 600 };
const hintStyle: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.78rem", color: "var(--color-text-muted)" };
const errorBoxStyle: React.CSSProperties = { padding: "0.75rem 1rem", background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: "0.5rem", color: "#991b1b", fontSize: "0.88rem" };
const scoreBannerStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.5rem", background: "var(--color-card-bg)", border: "1.5px solid var(--color-border)", borderRadius: "0.85rem", flexWrap: "wrap" as const };
const sectionCardStyle: React.CSSProperties = { padding: "1.5rem", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.85rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--color-primary)" };
const recCardStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", alignItems: "flex-start" };
const recNumStyle: React.CSSProperties = { flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%", background: "var(--color-primary)", color: "#FFFFFF", fontSize: "0.72rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: "1px" };
const disclaimerStyle: React.CSSProperties = { margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.6, fontStyle: "italic" };
const copyBtnStyle: React.CSSProperties = { border: "1px solid var(--color-border)", background: "#FFFFFF", color: "var(--color-text-muted)", fontSize: "0.78rem", fontWeight: 600, padding: "0.35rem 0.85rem", borderRadius: "0.45rem", cursor: "pointer", fontFamily: "inherit" };
const listenBtnStyle: React.CSSProperties = { padding: "0.35rem 0.85rem", background: "var(--color-primary)", color: "#FFFFFF", border: "none", borderRadius: "0.45rem", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" };
const audioMockStyle: React.CSSProperties = { margin: "0.4rem 0 0", padding: "0.5rem 0.85rem", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "0.45rem", fontSize: "0.75rem", color: "#92400e" };
