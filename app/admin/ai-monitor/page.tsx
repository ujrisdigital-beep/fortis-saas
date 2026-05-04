"use client";
// app/admin/ai-monitor/page.tsx
// AI-First Operations Monitor — view only, no manual controls
// AI does everything. Human reads this to understand system state.
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface CheckResult {
  name: string;
  healthy: boolean;
  latencyMs?: number;
  detail: string;
  remediated: boolean;
  escalated: boolean;
}

interface DiagRun {
  ts: string;
  healthScore: number;
  summary: string;
  escalations: number;
  results: CheckResult[];
}

const RESPONSIBILITY_MATRIX = [
  { func: "System Monitoring",    ai: true,  human: false, note: "Real-time every 5 min" },
  { func: "Auto-remediation",     ai: true,  human: "5% escalated", note: "95% AI self-healed" },
  { func: "User Support Tier 1",  ai: true,  human: false, note: "80% auto-resolved" },
  { func: "User Support Tier 2",  ai: "triages", human: "escalated only", note: "AI prepares context" },
  { func: "Content Generation",   ai: true,  human: false, note: "GPT-4o-mini + tones" },
  { func: "Court Order PII",      ai: "prepares token", human: true, note: "Human approves always" },
  { func: "Emergency P0",         ai: "alerts", human: true, note: "Page on-call engineer" },
  { func: "Code Deployment",      ai: "CI/CD", human: false, note: "Vercel auto-deploy" },
  { func: "SOP Updates",          ai: true,  human: "monthly review", note: "AI generates from incidents" },
];

export default function AIMonitorPage() {
  const [latest, setLatest] = useState<DiagRun | null>(null);
  const [history, setHistory] = useState<DiagRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  const fetchDiag = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnostics/run", { method: "POST" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const run: DiagRun = {
        ts: data.ts ?? new Date().toISOString(),
        healthScore: data.healthScore ?? 0,
        summary: data.summary ?? "",
        escalations: data.escalations ?? 0,
        results: data.results ?? [],
      };
      setLatest(run);
      setHistory((prev) => [run, ...prev].slice(0, 12));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiag();
  }, [fetchDiag]);

  useEffect(() => {
    if (!autoMode) return;
    const iv = setInterval(fetchDiag, 60000); // refresh every 60s in monitor
    return () => clearInterval(iv);
  }, [autoMode, fetchDiag]);

  const healthColor = !latest ? "#6B7280" : latest.healthScore >= 90 ? "#16A34A" : latest.healthScore >= 70 ? "#D97706" : "#DC2626";
  const avgHealth = history.length > 0 ? Math.round(history.reduce((s, r) => s + r.healthScore, 0) / history.length) : null;
  const autoHealCount = latest?.results.filter((r) => r.remediated && !r.escalated).length ?? 0;
  const escalatedCount = latest?.results.filter((r) => r.escalated).length ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", fontFamily: "'DM Sans', system-ui, sans-serif", color: WHITE }}>
      {/* Header */}
      <header style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(196,148,58,0.2)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1B4D3E, #0F3D21)", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 13, color: GOLD }}>FI</div>
            <div>
              <div style={{ color: GOLD, fontSize: 14, fontWeight: 700 }}>FORTIS OS — AI Monitor</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>AI-First Operations · View Only</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setAutoMode(!autoMode)} style={{ padding: "0.45rem 0.9rem", background: autoMode ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.08)", border: `1px solid ${autoMode ? "#16A34A" : "rgba(255,255,255,0.15)"}`, color: autoMode ? "#4ADE80" : "rgba(255,255,255,0.6)", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {autoMode ? "● Auto-refresh ON" : "○ Auto-refresh OFF"}
            </button>
            <button onClick={fetchDiag} disabled={loading} style={{ padding: "0.45rem 0.9rem", background: GOLD, border: "none", color: DARK, borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? "⏳" : "↻ Refresh"}
            </button>
            <Link href="/admin/escalations" style={{ padding: "0.45rem 0.9rem", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#F87171", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              🚨 Escalations
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        {/* Big health score */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${healthColor}30`, borderTop: `3px solid ${healthColor}`, borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Health Score</div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: healthColor, lineHeight: 1 }}>{latest?.healthScore ?? "--"}%</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Updated {loading ? "now" : latest ? new Date(latest.ts).toLocaleTimeString() : "–"}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(22,163,74,0.3)", borderTop: "3px solid #16A34A", borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>AI Self-Healed</div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#4ADE80", lineHeight: 1 }}>{autoHealCount}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>This run</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${escalatedCount > 0 ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.1)"}`, borderTop: `3px solid ${escalatedCount > 0 ? "#DC2626" : "#374151"}`, borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Escalated</div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: escalatedCount > 0 ? "#F87171" : "rgba(255,255,255,0.3)", lineHeight: 1 }}>{escalatedCount}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Human required</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(196,148,58,0.2)", borderTop: `3px solid ${GOLD}`, borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Avg Health</div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: GOLD, lineHeight: 1 }}>{avgHealth ?? "--"}%</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Last {history.length} runs</div>
          </div>
        </div>

        {/* Summary */}
        {latest?.summary && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
            🤖 <strong style={{ color: WHITE }}>AI Summary:</strong> {latest.summary}
          </div>
        )}

        {/* Check results */}
        {latest && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Live Checks</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem" }}>
              {latest.results.map((r) => (
                <div key={r.name} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${r.healthy ? "rgba(22,163,74,0.25)" : r.escalated ? "rgba(220,38,38,0.35)" : "rgba(217,119,6,0.35)"}`, borderRadius: 8, padding: "0.9rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: WHITE }}>{r.name}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.healthy ? "#4ADE80" : r.escalated ? "#F87171" : "#FDE68A", display: "inline-block" }} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{r.detail}</div>
                  {r.latencyMs != null && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{r.latencyMs}ms</div>}
                  {r.remediated && !r.escalated && <div style={{ marginTop: 4, fontSize: "0.7rem", color: "#4ADE80" }}>✓ AI self-healed</div>}
                  {r.escalated && <div style={{ marginTop: 4, fontSize: "0.7rem", color: "#F87171" }}>⬆ Escalated to human</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Health history */}
        {history.length > 1 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Health History</h2>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "1rem", display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
              {history.slice().reverse().map((h, i) => {
                const barColor = h.healthScore >= 90 ? "#4ADE80" : h.healthScore >= 70 ? "#FDE68A" : "#F87171";
                return (
                  <div key={i} title={`${h.healthScore}% @ ${new Date(h.ts).toLocaleTimeString()}`} style={{ flex: 1, background: barColor, height: `${h.healthScore}%`, borderRadius: "3px 3px 0 0", minHeight: 2, opacity: i === history.length - 1 ? 1 : 0.5 + (i / history.length) * 0.5 }} />
                );
              })}
            </div>
          </section>
        )}

        {/* Responsibility Matrix */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>AI vs Human — Responsibility Matrix</h2>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Function", "AI", "Human", "Notes"].map((h) => (
                    <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESPONSIBILITY_MATRIX.map((row, i) => (
                  <tr key={row.func} style={{ borderBottom: i < RESPONSIBILITY_MATRIX.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <td style={{ padding: "0.6rem 1rem", fontWeight: 600, color: WHITE }}>{row.func}</td>
                    <td style={{ padding: "0.6rem 1rem", color: row.ai === true ? "#4ADE80" : row.ai === false ? "rgba(255,255,255,0.2)" : GOLD }}>
                      {row.ai === true ? "✅ AI" : row.ai === false ? "—" : `⚠️ ${row.ai}`}
                    </td>
                    <td style={{ padding: "0.6rem 1rem", color: row.human === true ? "#F87171" : row.human === false ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)" }}>
                      {row.human === true ? "✅ Required" : row.human === false ? "❌ Not needed" : `⚠️ ${row.human}`}
                    </td>
                    <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Link href="/admin/escalations" style={{ padding: "0.55rem 1rem", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#F87171", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🚨 Escalation Queue</Link>
          <Link href="/admin/sop" style={{ padding: "0.55rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>📋 SOPs</Link>
          <Link href="/admin/diagnostics" style={{ padding: "0.55rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🔬 Diagnostics</Link>
        </div>
      </div>
    </div>
  );
}
