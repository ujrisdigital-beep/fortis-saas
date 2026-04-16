"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HealthData = {
  status: string;
  version: string;
  timestamp: string;
  uptime: { seconds: number; formatted: string };
  memory: { heapUsedMB: number; heapTotalMB: number; rssMB: number };
  env: { node: string; platform: string };
  configuration: Record<string, boolean>;
  fullyConfigured: boolean;
};

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: ok ? "#10B981" : "#E63946",
        flexShrink: 0,
      }}
    />
  );
}

const CONFIG_LABELS: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  ujuPrompt: "UJU_PROMPT",
  ikengaPrompt: "IKENGA_PROMPT",
  ujrisPrompt: "UJRIS_PROMPT",
  bankVerification: "BANK_VERIFICATION_METHOD",
};

export default function DiagnosticsPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  async function fetchHealth() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to fetch health data. Ensure the app is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <Link href="/" style={backLinkStyle}>← Back to FORTIS OS</Link>
          <h1 style={titleStyle}>System Diagnostics</h1>
          <p style={subtitleStyle}>
            Super Admin Dashboard · Auto-refreshes every 30s
            {lastRefresh && ` · Last: ${lastRefresh.toLocaleTimeString()}`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchHealth}
          disabled={loading}
          style={refreshBtnStyle}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}

      {health && (
        <div style={gridStyle}>
          {/* Status Card */}
          <div style={cardStyle}>
            <p style={cardLabelStyle}>System Status</p>
            <div style={statusRowStyle}>
              <StatusDot ok={health.status === "ok"} />
              <span style={statusTextStyle}>{health.status === "ok" ? "All Systems Operational" : "Degraded"}</span>
            </div>
            <div style={metaGridStyle}>
              <div style={metaItemStyle}>
                <span style={metaLabelStyle}>Version</span>
                <span style={metaValueStyle}>{health.version}</span>
              </div>
              <div style={metaItemStyle}>
                <span style={metaLabelStyle}>Uptime</span>
                <span style={metaValueStyle}>{health.uptime.formatted}</span>
              </div>
              <div style={metaItemStyle}>
                <span style={metaLabelStyle}>Node.js</span>
                <span style={metaValueStyle}>{health.env.node}</span>
              </div>
              <div style={metaItemStyle}>
                <span style={metaLabelStyle}>Platform</span>
                <span style={metaValueStyle}>{health.env.platform}</span>
              </div>
            </div>
          </div>

          {/* Memory Card */}
          <div style={cardStyle}>
            <p style={cardLabelStyle}>Memory Usage</p>
            <div style={memGridStyle}>
              <MemBar label="Heap Used" used={health.memory.heapUsedMB} total={health.memory.heapTotalMB} unit="MB" />
              <MemBar label="RSS" used={health.memory.rssMB} total={512} unit="MB" />
            </div>
          </div>

          {/* Configuration Card */}
          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <div style={configHeaderStyle}>
              <p style={cardLabelStyle}>Environment Configuration</p>
              <span style={health.fullyConfigured ? fullyConfigBadgeStyle : partialConfigBadgeStyle}>
                {health.fullyConfigured ? "✓ Fully Configured" : "⚠ Partially Configured"}
              </span>
            </div>
            <div style={configGridStyle}>
              {Object.entries(health.configuration).map(([key, ok]) => (
                <div key={key} style={configItemStyle}>
                  <StatusDot ok={ok} />
                  <div>
                    <p style={configKeyStyle}>{CONFIG_LABELS[key] ?? key}</p>
                    <p style={configStatusStyle}>{ok ? "Set" : "Missing — add to .env.local"}</p>
                  </div>
                </div>
              ))}
            </div>
            {!health.fullyConfigured && (
              <div style={configHintStyle}>
                <p style={configHintTextStyle}>
                  Missing environment variables will cause API tools to fall back to the built-in rule-based engine instead of GPT-4. Add them to your <code>.env.local</code> file and restart the server.
                </p>
              </div>
            )}
          </div>

          {/* API Endpoints Card */}
          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <p style={cardLabelStyle}>API Endpoints</p>
            <div style={endpointGridStyle}>
              {endpoints.map((ep) => (
                <div key={ep.path} style={endpointItemStyle}>
                  <code style={endpointPathStyle}>{ep.path}</code>
                  <span style={endpointDescStyle}>{ep.description}</span>
                  <a href={ep.path} target="_blank" rel="noreferrer" style={testLinkStyle}>Test GET →</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!health && !loading && !error && (
        <p style={{ color: "#999", textAlign: "center" }}>No health data available.</p>
      )}

      <p style={disclaimerStyle}>This page is for super administrators only. Do not share the URL.</p>
    </div>
  );
}

function MemBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const color = pct > 80 ? "#E63946" : pct > 60 ? "#D4AF37" : "#10B981";
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.35rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.82rem", color: "#666" }}>{label}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{used}{unit} / {total}{unit}</span>
      </div>
      <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

const endpoints = [
  { path: "/api/uju-cycle", description: "UJU CYCLE — Business transformation analysis" },
  { path: "/api/ikenga", description: "IKENGA — Brand intelligence assessment" },
  { path: "/api/ask-ujris", description: "ASK UJRIS — Forensic document analysis" },
  { path: "/api/verify-payment", description: "Payment verification endpoint" },
  { path: "/api/health", description: "System health endpoint" },
];

/* Styles */
const pageStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "2rem 1.25rem 5rem",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#0A1C2E",
  background: "#FFFFFF",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "2px solid #1B4D3E",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "0.75rem",
  color: "#1B4D3E",
  fontWeight: 600,
  fontSize: "0.88rem",
  textDecoration: "none",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 0.35rem",
  fontSize: "2rem",
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#4A5568",
  fontSize: "0.88rem",
};

const refreshBtnStyle: React.CSSProperties = {
  padding: "0.65rem 1.25rem",
  background: "#1B4D3E",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "0.88rem",
};

const errorBoxStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  background: "rgba(230,57,70,0.08)",
  border: "1px solid rgba(230,57,70,0.25)",
  borderRadius: "0.5rem",
  color: "#991b1b",
  marginBottom: "1.5rem",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.25rem",
};

const cardStyle: React.CSSProperties = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "0.75rem",
  padding: "1.5rem",
};

const cardLabelStyle: React.CSSProperties = {
  margin: "0 0 1rem",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "#1B4D3E",
};

const statusRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  marginBottom: "1.25rem",
};

const statusTextStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.1rem",
};

const metaGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.75rem",
};

const metaItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.15rem",
};

const metaLabelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "#4A5568",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

const metaValueStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "0.92rem",
  fontFamily: "monospace",
};

const memGridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem",
};

const configHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1rem",
};

const fullyConfigBadgeStyle: React.CSSProperties = {
  padding: "0.25rem 0.75rem",
  borderRadius: "999px",
  background: "#d1fae5",
  color: "#065f46",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const partialConfigBadgeStyle: React.CSSProperties = {
  padding: "0.25rem 0.75rem",
  borderRadius: "999px",
  background: "#fef3c7",
  color: "#92400e",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const configGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "0.75rem",
};

const configItemStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.6rem",
  alignItems: "flex-start",
};

const configKeyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "monospace",
  fontSize: "0.82rem",
  fontWeight: 700,
  color: "#0A1C2E",
};

const configStatusStyle: React.CSSProperties = {
  margin: "0.1rem 0 0",
  fontSize: "0.75rem",
  color: "#4A5568",
};

const configHintStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.75rem 1rem",
  background: "rgba(212,175,55,0.1)",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "0.5rem",
};

const configHintTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.85rem",
  color: "#92400e",
  lineHeight: 1.65,
};

const endpointGridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0",
};

const endpointItemStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "200px 1fr auto",
  gap: "1rem",
  alignItems: "center",
  padding: "0.65rem 0",
  borderBottom: "1px solid #E2E8F0",
};

const endpointPathStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 700,
  color: "#1B4D3E",
  background: "rgba(27,77,62,0.08)",
  padding: "0.2rem 0.5rem",
  borderRadius: "0.3rem",
};

const endpointDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#4A5568",
};

const testLinkStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#1B4D3E",
  fontWeight: 600,
  textDecoration: "none",
};

const disclaimerStyle: React.CSSProperties = {
  marginTop: "3rem",
  textAlign: "center" as const,
  fontSize: "0.78rem",
  color: "#9CA3AF",
};
