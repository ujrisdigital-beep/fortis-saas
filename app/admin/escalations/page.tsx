"use client";
// app/admin/escalations/page.tsx
// Human Escalation Portal — humans are INVITED here, not browsing
// Only action items shown. No unnecessary context. Exact instructions for each issue.
import { useState, useEffect } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface Escalation {
  issue: string;
  detail: string;
  attemptedFix?: string;
  instructions: string;
  priority: "low" | "medium" | "high" | "critical";
  source?: string;
  timestamp?: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: "#DC2626", high: "#D97706", medium: "#0077B6", low: "#16A34A",
};

const MOCK_ESCALATIONS: Escalation[] = [
  {
    issue: "Database Connection Slow",
    detail: "Query latency 4.2s — above 2s threshold. Auto-pool recycle applied.",
    attemptedFix: "Connection pool recycled. Query optimization recommended.",
    instructions: "1. Log into Supabase dashboard\n2. Go to Settings → Database\n3. Check connection pool size (increase to 20 if <10)\n4. Check slow query log\n5. Mark resolved here when done",
    priority: "high",
    source: "Automated Diagnostic",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
  },
];

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState<number[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [runningDiag, setRunningDiag] = useState(false);
  const [diagResult, setDiagResult] = useState<{ healthScore: number; summary: string } | null>(null);

  useEffect(() => {
    // In production, this would fetch from /api/escalations
    // For demo, show mock data if no live data
    setTimeout(() => {
      setEscalations(MOCK_ESCALATIONS);
      setLoading(false);
    }, 600);
  }, []);

  function markResolved(idx: number) {
    setResolved((prev) => [...prev, idx]);
  }

  function copyInstructions(idx: number, instructions: string) {
    navigator.clipboard.writeText(instructions);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  async function triggerDiagnostics() {
    setRunningDiag(true);
    setDiagResult(null);
    try {
      const res = await fetch("/api/diagnostics/run", { method: "POST" });
      const data = await res.json();
      setDiagResult({ healthScore: data.healthScore, summary: data.summary });
      if (data.results) {
        // Refresh escalations based on new results
        const newEscs: Escalation[] = data.results
          .filter((r: { escalated: boolean; name: string; detail: string; remediationAction?: string; escalationMessage?: string }) => r.escalated)
          .map((r: { name: string; detail: string; remediationAction?: string; escalationMessage?: string }) => ({
            issue: r.name,
            detail: r.detail,
            attemptedFix: r.remediationAction,
            instructions: r.escalationMessage ?? "Check system logs for details.",
            priority: "high" as const,
            source: "Manual Diagnostic Trigger",
            timestamp: new Date().toISOString(),
          }));
        if (newEscs.length > 0) setEscalations(newEscs);
      }
    } catch {
      setDiagResult({ healthScore: 0, summary: "Diagnostic run failed. Check server logs." });
    } finally {
      setRunningDiag(false);
    }
  }

  const active = escalations.filter((_, i) => !resolved.includes(i));

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.5rem", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <Link href="/admin/diagnostics" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Diagnostics</Link>
              <h1 style={{ margin: "0.3rem 0 0.2rem", color: WHITE, fontSize: "1.3rem", fontWeight: 800 }}>
                🚨 Escalation Queue
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>
                AI has already attempted fixes. You are here because human action is required. Follow the instructions below.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={triggerDiagnostics} disabled={runningDiag} style={{ padding: "0.55rem 1rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {runningDiag ? "⏳ Running…" : "▶ Run Diagnostics"}
              </button>
              <Link href="/admin/ai-monitor" style={{ padding: "0.55rem 1rem", background: GOLD, color: DARK, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                📊 AI Monitor
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
        {/* Diagnostic result banner */}
        {diagResult && (
          <div style={{ background: diagResult.healthScore >= 80 ? "#D1FAE5" : "#FEF3C7", border: `1px solid ${diagResult.healthScore >= 80 ? "#6EE7B7" : "#FDE68A"}`, borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.85rem", color: diagResult.healthScore >= 80 ? "#065F46" : "#92400E" }}>
            {diagResult.healthScore >= 80 ? "✅" : "⚠️"} <strong>Health: {diagResult.healthScore}%</strong> — {diagResult.summary}
          </div>
        )}

        {/* Stats bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Pending", value: active.length, color: active.length > 0 ? "#DC2626" : "#16A34A" },
            { label: "Resolved", value: resolved.length, color: "#16A34A" },
            { label: "Auto-healed", value: "AI", color: PRIMARY },
          ].map((s) => (
            <div key={s.label} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0.75rem 1.25rem", flex: 1, minWidth: 100 }}>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>⏳ Loading escalations…</div>
        ) : active.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: WHITE, borderRadius: 12, border: "1.5px solid #D1FAE5" }}>
            <p style={{ fontSize: "2.5rem", margin: "0 0 0.5rem" }}>✅</p>
            <p style={{ fontWeight: 700, color: "#065F46", margin: "0 0 0.25rem" }}>No escalations pending</p>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: 0 }}>AI is handling everything. Check back if you receive a Slack alert.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {active.map((esc, i) => {
              const origIdx = escalations.indexOf(esc);
              return (
                <div key={origIdx} style={{ background: WHITE, border: `2px solid ${PRIORITY_COLOR[esc.priority]}30`, borderLeft: `5px solid ${PRIORITY_COLOR[esc.priority]}`, borderRadius: 10, overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ background: `${PRIORITY_COLOR[esc.priority]}08`, padding: "0.85rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: `${PRIORITY_COLOR[esc.priority]}15`, color: PRIORITY_COLOR[esc.priority], fontSize: "0.7rem", fontWeight: 700 }}>
                          {esc.priority.toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: DARK }}>{esc.issue}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: 4 }}>
                        {esc.source ?? "AI Diagnostic"} · {esc.timestamp ? new Date(esc.timestamp).toLocaleString() : "Just now"}
                      </div>
                    </div>
                    <button onClick={() => markResolved(origIdx)} style={{ padding: "0.45rem 0.9rem", background: "#16A34A", border: "none", color: WHITE, borderRadius: 7, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                      ✓ Mark Resolved
                    </button>
                  </div>

                  <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {/* Detail */}
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B7280", marginBottom: 3 }}>What happened</div>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>{esc.detail}</p>
                    </div>

                    {/* AI attempted fix */}
                    {esc.attemptedFix && (
                      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "0.6rem 0.85rem" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1D4ED8", marginBottom: 3 }}>AI already tried</div>
                        <p style={{ margin: 0, fontSize: "0.82rem", color: "#1D4ED8" }}>{esc.attemptedFix}</p>
                      </div>
                    )}

                    {/* Instructions — the key section */}
                    <div style={{ background: DARK, borderRadius: 8, padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD }}>Your instructions</span>
                        <button onClick={() => copyInstructions(i, esc.instructions)} style={{ padding: "3px 10px", background: "rgba(196,148,58,0.2)", border: "1px solid rgba(196,148,58,0.4)", color: GOLD, borderRadius: 5, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          {copiedIdx === i ? "✓ Copied" : "📋 Copy"}
                        </button>
                      </div>
                      <pre style={{ margin: 0, color: WHITE, fontSize: "0.82rem", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
                        {esc.instructions}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.75rem", color: "#9CA3AF" }}>
          FORTIS OS AI Supervisor · Escalations auto-clear after resolution · Alerts via Slack + Email
        </p>
      </div>
    </div>
  );
}
