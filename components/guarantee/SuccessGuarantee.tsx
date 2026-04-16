"use client";

/**
 * SuccessGuarantee — Refund dashboard with activity tracking
 *
 * Shows a user's current compliance against their guarantee agreement:
 * - Progress ring
 * - Activity breakdown
 * - Days remaining
 * - Refund eligibility status
 */

import { useState, useEffect } from "react";
import type { ComplianceReport } from "../../lib/activity-verification";

interface Props {
  agreementId: string;
}

export default function SuccessGuarantee({ agreementId }: Props) {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/activity/verify?agreementId=${agreementId}`)
      .then((r) => r.json())
      .then((data: ComplianceReport) => { setReport(data); setLoading(false); })
      .catch(() => { setError("Failed to load compliance data."); setLoading(false); });
  }, [agreementId]);

  if (loading) return <div style={styles.card}><p style={{ color: "var(--fortis-text-secondary)" }}>Loading guarantee status…</p></div>;
  if (error || !report) return <div style={styles.card}><p style={{ color: "#ef4444" }}>{error ?? "No data found."}</p></div>;

  const pct = report.compliancePercent;
  const statusColor = pct >= 100 ? "#22c55e" : pct >= 50 ? "#C9A84C" : "#ef4444";
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.label}>SUCCESS GUARANTEE</p>
          <h2 style={styles.title}>Compliance Dashboard</h2>
          <p style={styles.subtitle}>
            Period: {new Date(report.period.start).toLocaleDateString()} –{" "}
            {new Date(report.period.end).toLocaleDateString()}
          </p>
        </div>

        {/* Ring */}
        <div style={{ textAlign: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e2d24" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={statusColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            <text x="60" y="55" textAnchor="middle" fill={statusColor} fontSize="18" fontWeight="700">
              {pct}%
            </text>
            <text x="60" y="72" textAnchor="middle" fill="#7a8f82" fontSize="11">
              compliant
            </text>
          </svg>
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <StatBox label="Actions Done" value={report.completedActions} color={statusColor} />
        <StatBox label="Required" value={report.requiredActions} color="#7a8f82" />
        <StatBox label="Days Left" value={report.daysRemaining} color="#C9A84C" />
      </div>

      {/* Status Badge */}
      <div style={{ ...styles.badge, background: `${statusColor}22`, border: `1px solid ${statusColor}` }}>
        <span style={{ color: statusColor, fontWeight: 700, fontSize: "0.8rem" }}>
          {report.status.replace("_", " ")}
        </span>
        {report.refundEligible && (
          <span style={{ marginLeft: "0.75rem", color: "#C9A84C", fontSize: "0.78rem", fontWeight: 600 }}>
            ★ REFUND ELIGIBLE
          </span>
        )}
      </div>

      {/* Gaps */}
      {report.gaps.length > 0 && (
        <div style={styles.gaps}>
          <p style={{ color: "#ef4444", fontWeight: 600, fontSize: "0.8rem", marginBottom: "0.4rem" }}>
            MISSING ACTIVITIES
          </p>
          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
            {report.gaps.map((g) => (
              <li key={g} style={{ color: "#7a8f82", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "1.6rem", fontWeight: 800, color, margin: 0 }}>{value}</p>
      <p style={{ fontSize: "0.72rem", color: "#7a8f82", margin: "0.2rem 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: "#0d1f14",
    border: "1px solid #1e3527",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    fontFamily: "system-ui, sans-serif",
    color: "#e8f0ea",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
    gap: "1rem",
  } as React.CSSProperties,
  label: {
    color: "#C9A84C",
    fontWeight: 700,
    letterSpacing: "0.08em",
    fontSize: "0.72rem",
    margin: "0 0 0.3rem",
  } as React.CSSProperties,
  title: {
    fontSize: "1.2rem",
    fontWeight: 800,
    margin: "0 0 0.2rem",
    color: "#e8f0ea",
  } as React.CSSProperties,
  subtitle: {
    fontSize: "0.8rem",
    color: "#7a8f82",
    margin: 0,
  } as React.CSSProperties,
  statsRow: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "#112419",
    borderRadius: "0.5rem",
  } as React.CSSProperties,
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.4rem",
    marginBottom: "1rem",
  } as React.CSSProperties,
  gaps: {
    borderTop: "1px solid #1e3527",
    paddingTop: "0.75rem",
    marginTop: "0.5rem",
  } as React.CSSProperties,
};
