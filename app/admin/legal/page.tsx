"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface GambianLaw {
  id: string;
  title: string;
  shortTitle: string;
  actNumber?: string;
  year: number;
  category: string;
  summary: string;
  keywords: string[];
  status: string;
}

interface ComplianceLog {
  id: string;
  toolName: string;
  userId: string;
  query: string;
  complianceStatus: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  compliant:  { bg: "#D1FAE5", text: "#065F46" },
  warning:    { bg: "#FEF3C7", text: "#92400E" },
  violation:  { bg: "#FEE2E2", text: "#991B1B" },
};

export default function LegalCompliancePage() {
  const [laws, setLaws] = useState<GambianLaw[]>([]);
  const [logs, setLogs] = useState<ComplianceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/legal/laws").then(r => r.json()),
      fetch("/api/legal/compliance-logs").then(r => r.json()),
    ]).then(([lawsData, logsData]) => {
      setLaws(lawsData.laws ?? []);
      setLogs(logsData.logs ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: logs.length,
    compliant: logs.filter(l => l.complianceStatus === "compliant").length,
    warnings: logs.filter(l => l.complianceStatus === "warning").length,
    violations: logs.filter(l => l.complianceStatus === "violation").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "2.5rem 1.5rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Link href="/admin/diagnostics" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "inline-block", marginBottom: "0.5rem" }}>← Admin</Link>
          <h1 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800 }}>
            ⚖️ Legal Compliance Dashboard
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>
            Gambian laws embedded into FORTIS OS core — real-time compliance monitoring
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
          {[
            { label: "Laws Embedded", value: laws.length, color: PRIMARY, icon: "📜" },
            { label: "Total Checks", value: stats.total, color: "#6366F1", icon: "🔍" },
            { label: "Compliant", value: stats.compliant, color: "#16A34A", icon: "✅" },
            { label: "Warnings", value: stats.warnings, color: "#D97706", icon: "⚠️" },
            { label: "Violations", value: stats.violations, color: "#DC2626", icon: "🚨" },
          ].map(s => (
            <div key={s.label} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: "0.3rem" }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "1.6rem", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Embedded Laws Grid */}
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "1.5rem", marginBottom: "1.75rem" }}>
          <h2 style={{ margin: "0 0 1.25rem", fontWeight: 800, color: DARK, fontSize: "1rem" }}>📜 Embedded Gambian Laws</h2>
          {loading ? (
            <p style={{ color: "#9CA3AF", textAlign: "center" }}>Loading…</p>
          ) : laws.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#6B7280", marginBottom: "0.75rem" }}>No laws seeded yet.</p>
              <code style={{ fontSize: "0.8rem", background: "#F3F4F6", padding: "0.3rem 0.7rem", borderRadius: 6 }}>
                node prisma/seed-laws.js
              </code>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.85rem" }}>
              {laws.map(law => (
                <div key={law.id} style={{ border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.88rem", color: DARK }}>{law.shortTitle}</span>
                    <span style={{ fontSize: "0.7rem", background: "#E8F5EF", color: PRIMARY, padding: "1px 7px", borderRadius: 999, fontWeight: 700 }}>{law.category}</span>
                  </div>
                  <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "#6B7280" }}>{law.actNumber ?? law.title} · {law.year}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#374151", lineHeight: 1.5 }}>{law.summary.slice(0, 120)}…</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compliance Logs */}
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1.5px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontWeight: 800, color: DARK, fontSize: "1rem" }}>🔍 Recent Compliance Checks</h2>
            <Link href="/legal/inquiries" style={{ fontSize: "0.8rem", color: GOLD, textDecoration: "none", fontWeight: 700 }}>
              Legal Inquiries →
            </Link>
          </div>
          {logs.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>No compliance checks recorded yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Tool", "Status", "Query", "Time"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 30).map(log => {
                    const sc = STATUS_COLORS[log.complianceStatus] ?? { bg: "#F3F4F6", text: "#374151" };
                    return (
                      <tr key={log.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "0.7rem 1rem", fontSize: "0.82rem", fontWeight: 700, color: DARK }}>{log.toolName}</td>
                        <td style={{ padding: "0.7rem 1rem" }}>
                          <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 999, background: sc.bg, color: sc.text, fontWeight: 700, textTransform: "capitalize" }}>
                            {log.complianceStatus}
                          </span>
                        </td>
                        <td style={{ padding: "0.7rem 1rem", fontSize: "0.78rem", color: "#6B7280", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.query}
                        </td>
                        <td style={{ padding: "0.7rem 1rem", fontSize: "0.75rem", color: "#9CA3AF" }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
