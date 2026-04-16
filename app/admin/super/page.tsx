"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

interface SystemHealth {
  status: string;
  uptime: { formatted: string };
  memory: { heapUsedMB: number; heapTotalMB: number };
  configuration: Record<string, boolean>;
}

interface LearningMetrics {
  summary: { totalEvents: number; averageRating: number | null; needsImprovement: boolean; improvementsApplied: number };
  promptVersions: Record<string, { version: string; avgRating: number; sampleCount: number }>;
  qualityDistribution: Record<string, number>;
}

// Anonymized aggregate stats — NO PII
const MOCK_AGGREGATES = {
  users: { total: 2847, activeThisMonth: 1203, newThisWeek: 87 },
  marketplace: { activeListings: 1842, ordersThisMonth: 437, escrowHolding: 182400 },
  documents: { composedThisMonth: 312, sentThisMonth: 298, avgAiScore: 4.3 },
  apiCalls: { today: 14820, thisMonth: 312400, topEndpoint: "/api/ask-ujris" },
  revenue: { subscriptionMRR_GMD: 842000, marketplaceCommissionMTD_GMD: 129500 },
};

const COMPONENT_ROUTES = [
  { name: "Marketplace", path: "/marketplace", icon: "🛒" },
  { name: "Trust Dashboard", path: "/marketplace/dashboard", icon: "📊" },
  { name: "Tax Calculator", path: "/calculators/tax-import", icon: "🧮" },
  { name: "Logistics", path: "/services/logistics", icon: "🚢" },
  { name: "Equipment Hire", path: "/services/equipment-hire", icon: "🏭" },
  { name: "Professionals", path: "/services/professionals", icon: "👥" },
  { name: "Car Hire", path: "/services/car-hire", icon: "🚗" },
  { name: "NAWEC Map", path: "/resources/nawec", icon: "⚡" },
  { name: "Waste Map", path: "/resources/waste", icon: "♻️" },
  { name: "Document Composer", path: "/documents/compose", icon: "✍️" },
  { name: "Email Outbox", path: "/my-emails", icon: "📬" },
  { name: "Ask UJRIS", path: "/ask-ujris", icon: "🤖" },
  { name: "Currency Exchange", path: "/marketplace/currency-exchange", icon: "💱" },
];

const API_ENDPOINTS = [
  { path: "/api/health", desc: "System health" },
  { path: "/api/gbos/census", desc: "Census data" },
  { path: "/api/gbos/gdp", desc: "GDP data" },
  { path: "/api/gbos/inflation", desc: "Inflation data" },
  { path: "/api/learning/metrics", desc: "AI learning metrics" },
  { path: "/api/translate", desc: "Translation engine" },
  { path: "/api/marketplace/products", desc: "Products" },
  { path: "/api/marketplace/currency-rates", desc: "FX rates" },
  { path: "/api/marketplace/dashboard", desc: "Trust metrics" },
  { path: "/api/audio/summary", desc: "TTS audio" },
];

type Tab = "overview" | "health" | "learning" | "apis" | "pages";

export default function SuperAdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [learning, setLearning] = useState<LearningMetrics | null>(null);
  const [apiStatuses, setApiStatuses] = useState<Record<string, "ok" | "error" | "checking">>({});
  const [checking, setChecking] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const r = await fetch("/api/health");
      const d = await r.json();
      setHealth(d);
    } catch {}
  }, []);

  const fetchLearning = useCallback(async () => {
    try {
      const r = await fetch("/api/learning/metrics");
      const d = await r.json();
      setLearning(d);
    } catch {}
  }, []);

  const checkAllAPIs = async () => {
    setChecking(true);
    const statuses: Record<string, "ok" | "error" | "checking"> = {};
    API_ENDPOINTS.forEach(e => { statuses[e.path] = "checking"; });
    setApiStatuses({ ...statuses });

    for (const ep of API_ENDPOINTS) {
      try {
        const r = await fetch(ep.path, { signal: AbortSignal.timeout(5000) });
        statuses[ep.path] = r.ok ? "ok" : "error";
      } catch {
        statuses[ep.path] = "error";
      }
      setApiStatuses({ ...statuses });
    }
    setChecking(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchHealth();
    fetchLearning();
    setLastRefresh(new Date());
  }, []);

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 20 };
  const tabBtn = (a: boolean): React.CSSProperties => ({ padding: "11px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: a ? G : MUT, borderBottom: `3px solid ${a ? G : "transparent"}` });
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg });

  const configOk = health?.configuration
    ? Object.values(health.configuration).filter(Boolean).length
    : 0;
  const configTotal = health?.configuration
    ? Object.keys(health.configuration).length
    : 0;

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "40px 24px 32px" }}>
        <div style={container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: GOLD, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 10 }}>
                🔐 SUPER ADMIN — ANONYMIZED VIEW
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>FORTIS OS Control Centre</h1>
              <p style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>
                All metrics anonymized · No PII displayed · Last refresh: {lastRefresh?.toLocaleTimeString() ?? "–"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ padding: "10px 20px", background: GOLD, color: NAVY, border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                onClick={() => { fetchHealth(); fetchLearning(); setLastRefresh(new Date()); }}
              >
                🔄 Refresh
              </button>
              <Link href="/admin/diagnostics" style={{ padding: "10px 20px", background: "rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                ⚙️ Diagnostics →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: "2px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {(["overview", "health", "learning", "apis", "pages"] as Tab[]).map(t => (
            <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>
              {{ overview: "📊 Overview", health: "🏥 System Health", learning: "🧠 AI Learning", apis: "🔌 API Status", pages: "📄 All Pages" }[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={container}>
        {tab === "overview" && (
          <div style={{ padding: "28px 0" }}>
            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Total Users", value: MOCK_AGGREGATES.users.total.toLocaleString(), sub: `+${MOCK_AGGREGATES.users.newThisWeek} this week`, color: G },
                { label: "Active Users (MTD)", value: MOCK_AGGREGATES.users.activeThisMonth.toLocaleString(), sub: `${Math.round(MOCK_AGGREGATES.users.activeThisMonth / MOCK_AGGREGATES.users.total * 100)}% activation`, color: G },
                { label: "Active Listings", value: MOCK_AGGREGATES.marketplace.activeListings.toLocaleString(), sub: "marketplace products", color: NAVY },
                { label: "Orders (MTD)", value: MOCK_AGGREGATES.marketplace.ordersThisMonth.toLocaleString(), sub: "marketplace orders", color: NAVY },
                { label: "Escrow Held", value: `D${(MOCK_AGGREGATES.marketplace.escrowHolding / 1000).toFixed(0)}K`, sub: "pending release", color: GOLD },
                { label: "Docs Composed", value: MOCK_AGGREGATES.documents.composedThisMonth.toLocaleString(), sub: "this month", color: G },
                { label: "Subscription MRR", value: `D${(MOCK_AGGREGATES.revenue.subscriptionMRR_GMD / 1000).toFixed(0)}K`, sub: "monthly recurring", color: G },
                { label: "API Calls Today", value: MOCK_AGGREGATES.apiCalls.today.toLocaleString(), sub: MOCK_AGGREGATES.apiCalls.topEndpoint, color: NAVY },
              ].map(m => (
                <div key={m.label} style={card}>
                  <div style={{ fontSize: 11, color: MUT, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* System status summary */}
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: NAVY, marginBottom: 14, fontSize: 16 }}>System Status</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { label: "Server Status", value: health?.status === "healthy" ? "✅ Healthy" : "⚠️ Check Required", ok: health?.status === "healthy" },
                  { label: "Configuration", value: `${configOk}/${configTotal} env vars set`, ok: configOk === configTotal },
                  { label: "Memory Usage", value: health ? `${health.memory.heapUsedMB}/${health.memory.heapTotalMB} MB` : "Loading...", ok: health ? health.memory.heapUsedMB < health.memory.heapTotalMB * 0.85 : true },
                  { label: "Learning Engine", value: learning ? `Avg ${learning.summary.averageRating?.toFixed(1) ?? "N/A"}★` : "Loading...", ok: !learning?.summary.needsImprovement },
                  { label: "AI Improvements", value: learning ? `${learning.summary.improvementsApplied} applied` : "–", ok: true },
                  { label: "Uptime", value: health?.uptime.formatted ?? "–", ok: true },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: MUT }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginTop: 2 }}>{s.value}</div>
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.ok ? "#10B981" : "#E63946", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "health" && (
          <div style={{ padding: "28px 0" }}>
            {health ? (
              <>
                <div style={{ ...card, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: NAVY }}>System Health</div>
                    <span style={badge(health.status === "healthy" ? "#065F46" : "#991B1B", health.status === "healthy" ? "#D1FAE5" : "#FEE2E2")}>
                      {health.status}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, color: MUT }}>Uptime</div>
                      <div style={{ fontWeight: 700, color: NAVY }}>{health.uptime.formatted}</div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, color: MUT }}>Heap Used</div>
                      <div style={{ fontWeight: 700, color: NAVY }}>{health.memory.heapUsedMB} MB / {health.memory.heapTotalMB} MB</div>
                    </div>
                  </div>
                </div>

                <div style={card}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: NAVY, marginBottom: 14 }}>Environment Configuration</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Object.entries(health.configuration).map(([key, ok]) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F8FAFC", borderRadius: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{key}</span>
                        <span style={badge(ok ? "#065F46" : "#92400E", ok ? "#D1FAE5" : "#FEF3C7")}>{ok ? "✓ Configured" : "⚠ Missing"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: MUT }}>Loading health data...</div>
            )}
          </div>
        )}

        {tab === "learning" && (
          <div style={{ padding: "28px 0" }}>
            {learning ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
                  {[
                    { label: "Total Feedback Events", value: learning.summary.totalEvents.toString() },
                    { label: "Average Rating", value: learning.summary.averageRating ? `${learning.summary.averageRating}★` : "No data" },
                    { label: "Improvements Applied", value: learning.summary.improvementsApplied.toString() },
                    { label: "Needs Attention", value: learning.summary.needsImprovement ? "⚠️ Yes" : "✅ No" },
                  ].map(m => (
                    <div key={m.label} style={card}>
                      <div style={{ fontSize: 11, color: MUT }}>{m.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: G, marginTop: 4 }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={card}>
                    <div style={{ fontWeight: 800, color: NAVY, marginBottom: 14 }}>Prompt Versions</div>
                    {Object.entries(learning.promptVersions).map(([tool, data]) => (
                      <div key={tool} style={{ padding: "10px 0", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontWeight: 600, color: NAVY, fontSize: 13 }}>{tool}</div>
                          <div style={{ fontSize: 11, color: MUT }}>{data.sampleCount} samples</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={badge("#0369A1", "#DBEAFE")}>{data.version}</span>
                          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginTop: 4 }}>{data.avgRating}★</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <div style={{ fontWeight: 800, color: NAVY, marginBottom: 14 }}>Output Quality Distribution</div>
                    {Object.entries(learning.qualityDistribution).map(([quality, count]) => (
                      <div key={quality} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                          <span style={{ textTransform: "capitalize", color: NAVY, fontWeight: 600 }}>{quality}</span>
                          <span style={{ color: MUT }}>{count}</span>
                        </div>
                        <div style={{ background: "#E2E8F0", borderRadius: 4, height: 6 }}>
                          <div style={{ height: "100%", borderRadius: 4, background: quality === "excellent" ? G : quality === "good" ? "#0EA5E9" : quality === "acceptable" ? GOLD : "#E63946", width: `${learning.summary.totalEvents > 0 ? (count / learning.summary.totalEvents) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: MUT }}>Loading learning metrics...</div>
            )}
          </div>
        )}

        {tab === "apis" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ color: MUT, fontSize: 14, margin: 0 }}>Test all API endpoints for availability</p>
              <button
                style={{ padding: "10px 20px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: checking ? "default" : "pointer", opacity: checking ? 0.7 : 1 }}
                onClick={checkAllAPIs}
                disabled={checking}
              >
                {checking ? "Checking..." : "▶ Run All Checks"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {API_ENDPOINTS.map(ep => {
                const status = apiStatuses[ep.path];
                return (
                  <div key={ep.path} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{ep.desc}</div>
                      <div style={{ fontSize: 11, color: MUT, fontFamily: "monospace" }}>{ep.path}</div>
                    </div>
                    <span style={badge(
                      status === "ok" ? "#065F46" : status === "error" ? "#991B1B" : status === "checking" ? "#0369A1" : MUT,
                      status === "ok" ? "#D1FAE5" : status === "error" ? "#FEE2E2" : status === "checking" ? "#DBEAFE" : "#F1F5F9"
                    )}>
                      {status === "ok" ? "✓ OK" : status === "error" ? "✗ Error" : status === "checking" ? "..." : "Not tested"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "pages" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {COMPONENT_ROUTES.map(r => (
                <Link
                  key={r.path}
                  href={r.path}
                  target="_blank"
                  style={{ ...card, textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{r.icon} {r.name}</div>
                    <div style={{ fontSize: 11, color: MUT, fontFamily: "monospace", marginTop: 2 }}>{r.path}</div>
                  </div>
                  <span style={{ color: MUT, fontSize: 16 }}>↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
