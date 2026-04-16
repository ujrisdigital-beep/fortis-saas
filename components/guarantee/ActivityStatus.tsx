"use client";

/**
 * ActivityStatus — Real-time compliance monitoring widget.
 * Compact card showing activity progress with a colour-coded status indicator.
 * Polls every 30 seconds for updates.
 */

import { useState, useEffect, useCallback } from "react";
import type { ComplianceReport } from "../../lib/activity-verification";

interface Props {
  agreementId: string;
  compact?: boolean;
}

export default function ActivityStatus({ agreementId, compact = false }: Props) {
  const [report, setReport] = useState<ComplianceReport | null>(null);

  const fetchReport = useCallback(() => {
    fetch(`/api/activity/verify?agreementId=${agreementId}`)
      .then((r) => r.json())
      .then((data: ComplianceReport) => setReport(data))
      .catch(() => null);
  }, [agreementId]);

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 30_000);
    return () => clearInterval(interval);
  }, [fetchReport]);

  if (!report) {
    return (
      <div style={{ ...styles.container, opacity: 0.5 }}>
        <div style={styles.dot("#7a8f82")} />
        <span style={styles.text}>Loading…</span>
      </div>
    );
  }

  const pct = report.compliancePercent;
  const statusColor = pct >= 100 ? "#22c55e" : pct >= 50 ? "#C9A84C" : "#ef4444";
  const statusLabel = pct >= 100 ? "COMPLIANT" : pct >= 50 ? "ON TRACK" : "AT RISK";

  if (compact) {
    return (
      <div style={styles.container}>
        <div style={styles.dot(statusColor)} />
        <span style={{ ...styles.text, color: statusColor }}>{statusLabel}</span>
        <span style={{ ...styles.text, color: "#7a8f82", marginLeft: "0.25rem" }}>
          {report.completedActions}/{report.requiredActions} actions
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...styles.card, borderColor: statusColor + "44" }}>
      <div style={styles.row}>
        <div style={styles.dot(statusColor)} />
        <span style={{ color: statusColor, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.07em" }}>
          {statusLabel}
        </span>
        <span style={{ marginLeft: "auto", color: "#7a8f82", fontSize: "0.75rem" }}>
          {report.daysRemaining}d remaining
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.min(pct, 100)}%`,
            background: statusColor,
          }}
        />
      </div>

      <div style={styles.row}>
        <span style={{ fontSize: "0.78rem", color: "#7a8f82" }}>
          {report.completedActions} / {report.requiredActions} required actions
        </span>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: statusColor }}>
          {pct}%
        </span>
      </div>

      {report.gaps.length > 0 && (
        <p style={{ fontSize: "0.72rem", color: "#ef4444", margin: "0.5rem 0 0" }}>
          Missing: {report.gaps.join(", ")}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,
  dot: (color: string) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
    boxShadow: `0 0 6px ${color}`,
  }),
  text: {
    fontSize: "0.78rem",
    fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,
  card: {
    background: "#0d1f14",
    border: "1px solid",
    borderRadius: "0.6rem",
    padding: "0.85rem 1rem",
    fontFamily: "system-ui, sans-serif",
    color: "#e8f0ea",
  } as React.CSSProperties,
  row: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  } as React.CSSProperties,
  progressTrack: {
    height: 6,
    background: "#1e3527",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: "0.4rem",
  } as React.CSSProperties,
  progressFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.4s ease",
  } as React.CSSProperties,
};
