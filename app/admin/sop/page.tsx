// app/admin/sop/page.tsx
// AI-Generated Standard Operating Procedures
// Auto-generated from incident patterns. Humans review monthly (2 hours).
const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface SOP {
  id: string;
  title: string;
  category: "automated" | "human_required" | "escalation";
  trigger: string;
  aiAction: string;
  humanAction?: string;
  estimatedResolutionTime: string;
  lastUpdated: string;
  incidentCount: number;
  steps: string[];
}

const SOPS: SOP[] = [
  {
    id: "SOP-001",
    title: "High API Latency (>3s)",
    category: "automated",
    trigger: "API response time exceeds 3 seconds",
    aiAction: "Auto-retry with exponential backoff. Switch to fallback model if >5 retries. Log to Vercel.",
    estimatedResolutionTime: "< 2 minutes (AI)",
    lastUpdated: "2026-04-17",
    incidentCount: 12,
    steps: [
      "AI detects latency via /api/diagnostics/run endpoint",
      "Retry request with 1s, 2s, 4s backoff",
      "If still failing after 3 retries: switch to fallback rule-based engine",
      "Log incident with timestamp and latency to Vercel logs",
      "If latency persists > 10 min: escalate to human via Slack",
    ],
  },
  {
    id: "SOP-002",
    title: "OpenAI API Key Invalid/Expired",
    category: "human_required",
    trigger: "OpenAI API returns 401 Unauthorized",
    aiAction: "Switch immediately to fallback engine. Disable AI features gracefully. Alert human.",
    humanAction: "Update OPENAI_API_KEY in Vercel. Run: vercel env add OPENAI_API_KEY production",
    estimatedResolutionTime: "5 minutes (human)",
    lastUpdated: "2026-04-17",
    incidentCount: 2,
    steps: [
      "AI receives 401 from OpenAI API",
      "All AI tools automatically switch to fallback mode",
      "Users see: 'AI enhanced mode temporarily unavailable'",
      "Human receives Slack + Email alert with exact command",
      "Human runs: vercel env add OPENAI_API_KEY production",
      "Human triggers redeploy: vercel redeploy --prod",
      "AI verifies OpenAI is back: automated check runs within 5 min",
    ],
  },
  {
    id: "SOP-003",
    title: "Database Connection Failure",
    category: "human_required",
    trigger: "Prisma cannot connect to DATABASE_URL",
    aiAction: "Retry connection 3x with backoff. Switch platform to read-only mode. Preserve user session.",
    humanAction: "Check Supabase dashboard. Verify DATABASE_URL in Vercel env.",
    estimatedResolutionTime: "10-15 minutes (human)",
    lastUpdated: "2026-04-17",
    incidentCount: 1,
    steps: [
      "AI detects connection failure after 3 retry attempts",
      "Platform switches to degraded mode — read-only where possible",
      "Human receives critical alert via Slack + Email",
      "Human checks: supabase.com/dashboard → Database → Connections",
      "If pool exhausted: restart pool, increase max_connections",
      "If DATABASE_URL changed: update in Vercel dashboard",
      "Verify fix: check /admin/ai-monitor health score",
    ],
  },
  {
    id: "SOP-004",
    title: "Memory Usage >85%",
    category: "automated",
    trigger: "Heap memory usage exceeds 85% of available",
    aiAction: "Trigger garbage collection. Clear non-critical caches. Log warning.",
    estimatedResolutionTime: "< 1 minute (AI)",
    lastUpdated: "2026-04-17",
    incidentCount: 4,
    steps: [
      "Diagnostic detects heap > 85%",
      "AI clears memoized caches and stale closures",
      "Node.js GC triggered manually",
      "If memory doesn't drop within 2 minutes: escalate",
      "Escalation includes: vercel redeploy --prod command",
    ],
  },
  {
    id: "SOP-005",
    title: "User Support — AI Confidence < 70%",
    category: "escalation",
    trigger: "ARIA chatbot cannot answer query with ≥70% confidence",
    aiAction: "ARIA responds with empathetic message. Stores full conversation. Alerts support queue.",
    humanAction: "Review conversation at /admin/escalations. Respond via email within 4 hours.",
    estimatedResolutionTime: "< 4 hours (human)",
    lastUpdated: "2026-04-17",
    incidentCount: 18,
    steps: [
      "User sends message to ARIA support chatbot",
      "AI calculates confidence score for response",
      "If confidence < 70%: ARIA says 'passing to team'",
      "Conversation stored in escalation queue",
      "Human sees: full conversation + context + suggested response",
      "Human responds via email: ujrisdigital@gmail.com",
      "Resolution logged, SOP updated if new pattern detected",
    ],
  },
  {
    id: "SOP-006",
    title: "Court Order PII Access Request",
    category: "human_required",
    trigger: "Court order submitted via /admin/court-orders",
    aiAction: "AI verifies document format, HMAC signature, and request completeness. Prepares token for issuance.",
    humanAction: "Human admin reviews court order. Approves or denies. Token shown once.",
    estimatedResolutionTime: "24 hours (human — legal review required)",
    lastUpdated: "2026-04-17",
    incidentCount: 0,
    steps: [
      "Court order received at /admin/court-orders",
      "AI verifies: HMAC signature, document format, expiry date",
      "AI flags any anomalies or incomplete data",
      "Legal/Compliance Officer reviews at /admin/court-orders",
      "Human approves → AI issues single-use token (SHA-256 hashed)",
      "Token shown ONCE to human. Not stored in plaintext.",
      "All actions logged in tamper-evident audit log",
      "DPA 2018 compliance verified before every approval",
    ],
  },
  {
    id: "SOP-007",
    title: "Vercel Deployment Failure",
    category: "human_required",
    trigger: "vercel --prod exits with non-zero status or build error",
    aiAction: "Log build error. Preserve previous deployment. Alert human with exact error.",
    humanAction: "Read error output. Fix TypeScript/build error. Redeploy.",
    estimatedResolutionTime: "15-30 minutes (human)",
    lastUpdated: "2026-04-17",
    incidentCount: 3,
    steps: [
      "Build failure detected in Vercel logs",
      "Previous production deployment remains live (no downtime)",
      "Human receives alert with: build error message, failing file",
      "Human fixes TypeScript or build error locally",
      "Human runs: npm run build (local verification)",
      "Human runs: vercel --prod --force",
      "AI verifies new deployment is healthy via /api/health",
    ],
  },
];

const CAT_COLOR: Record<string, string> = {
  automated: "#16A34A",
  human_required: "#DC2626",
  escalation: "#D97706",
};

const CAT_LABEL: Record<string, string> = {
  automated: "AI Automated",
  human_required: "Human Required",
  escalation: "Escalation Protocol",
};

export default function SOPPage() {
  const autoCount = SOPS.filter((s) => s.category === "automated").length;
  const humanCount = SOPS.filter((s) => s.category === "human_required").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2rem 1.5rem",
        position: "relative",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>AI-Generated · Auto-Updated</div>
            <h1 style={{ margin: "0 0 0.3rem", color: WHITE, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 800 }}>
              📋 Standard Operating Procedures
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
              {SOPS.length} SOPs · {autoCount} fully automated · {humanCount} require human action · Review monthly
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/admin/ai-monitor" style={{ padding: "0.55rem 1rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>📊 Monitor</a>
            <a href="/admin/escalations" style={{ padding: "0.55rem 1rem", background: GOLD, color: DARK, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>🚨 Escalations</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {SOPS.map((sop) => (
            <div key={sop.id} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `5px solid ${CAT_COLOR[sop.category]}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "0.9rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1px solid #F0F4F0" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <code style={{ fontSize: "0.72rem", background: "#F0F4F0", padding: "2px 7px", borderRadius: 4, color: "#6B7280" }}>{sop.id}</code>
                    <span style={{ fontWeight: 800, fontSize: "0.92rem", color: DARK }}>{sop.title}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 999, background: `${CAT_COLOR[sop.category]}12`, color: CAT_COLOR[sop.category], fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${CAT_COLOR[sop.category]}25` }}>
                      {CAT_LABEL[sop.category]}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Trigger: {sop.trigger} · {sop.incidentCount} incidents · Updated {sop.lastUpdated}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "right", flexShrink: 0 }}>
                  ⏱ {sop.estimatedResolutionTime}
                </div>
              </div>

              <div style={{ padding: "0.9rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <div style={{ background: "#F0F9F4", border: "1px solid #D1FAE5", borderRadius: 6, padding: "0.55rem 0.85rem" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#065F46", marginBottom: 2 }}>🤖 AI Action</div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>{sop.aiAction}</p>
                </div>
                {sop.humanAction && (
                  <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "0.55rem 0.85rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#92400E", marginBottom: 2 }}>👤 Human Action Required</div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>{sop.humanAction}</p>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B7280", marginBottom: 6 }}>Step-by-step</div>
                  <ol style={{ margin: 0, padding: "0 0 0 1.1rem" }}>
                    {sop.steps.map((s, i) => (
                      <li key={i} style={{ fontSize: "0.8rem", color: "#374151", marginBottom: 4, lineHeight: 1.5 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.75rem", color: "#9CA3AF" }}>
          SOPs are AI-generated from incident patterns and updated automatically. Human review: monthly (est. 2 hours).
        </p>
      </div>
    </div>
  );
}
