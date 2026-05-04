"use client";

import { useState } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";
const RED = "#DC2626";
const AMBER = "#D97706";
const GREEN = "#16A34A";

const THREAT_LEVELS = [
  { id: "critical", label: "CRITICAL", count: 0, color: RED, desc: "Active attacks on critical infrastructure" },
  { id: "high", label: "HIGH", count: 2, color: "#EA580C", desc: "Elevated phishing & malware campaigns" },
  { id: "medium", label: "MEDIUM", count: 7, color: AMBER, desc: "Vulnerability disclosures requiring patching" },
  { id: "low", label: "LOW", count: 12, color: GREEN, desc: "Routine security advisories" },
];

const CRITICAL_SECTORS = [
  { name: "Energy & Power (NAWEC)", status: "protected", icon: "⚡", risk: "Low", lastAudit: "Jan 2026" },
  { name: "Banking & Finance (CBG)", status: "protected", icon: "🏦", risk: "Low", lastAudit: "Feb 2026" },
  { name: "Telecommunications (PURA)", status: "monitoring", icon: "📡", risk: "Medium", lastAudit: "Dec 2025" },
  { name: "Aviation (GCAA/BIA)", status: "protected", icon: "✈️", risk: "Low", lastAudit: "Mar 2026" },
  { name: "Port & Maritime (GPA)", status: "monitoring", icon: "⚓", risk: "Medium", lastAudit: "Nov 2025" },
  { name: "Water Supply (NAWEC Water)", status: "monitoring", icon: "💧", risk: "Medium", lastAudit: "Dec 2025" },
  { name: "Health Sector (MoH/EFSTH)", status: "review", icon: "🏥", risk: "High", lastAudit: "Oct 2025" },
  { name: "Justice System (MoJ/Courts)", status: "protected", icon: "⚖️", risk: "Low", lastAudit: "Apr 2026" },
];

const COMPLIANCE_CHECKLIST = [
  { item: "Gambia Data Protection Act 2018 (GDPA)", status: "compliant", ref: "GDPA §12–§18" },
  { item: "ECOWAS Cybersecurity Policy Framework", status: "compliant", ref: "ECOWAS Dec. A/SA.5/01/22" },
  { item: "AU Convention on Cybersecurity & Data", status: "in_progress", ref: "Malabo Convention 2014" },
  { item: "ITU National Cybersecurity Strategy", status: "compliant", ref: "ITU GCI 2024" },
  { item: "ISO/IEC 27001 ISMS Alignment", status: "in_progress", ref: "ISO 27001:2022" },
  { item: "NIST Cybersecurity Framework Adoption", status: "review", ref: "NIST CSF 2.0" },
  { item: "Critical Information Infrastructure Protection Plan", status: "in_progress", ref: "CIIP National Plan 2025" },
  { item: "Government PKI & Digital Signature Framework", status: "review", ref: "eGovernment Policy 2022" },
];

const RECENT_ADVISORIES = [
  { date: "Apr 2026", severity: "HIGH", title: "Phishing campaign targeting Gambian banking sector customers", tlp: "WHITE" },
  { date: "Apr 2026", severity: "MEDIUM", title: "Unpatched vulnerabilities in widely-used web server software (CVE-2025-XXXX)", tlp: "WHITE" },
  { date: "Mar 2026", severity: "MEDIUM", title: "Social engineering attempts targeting government email accounts", tlp: "GREEN" },
  { date: "Mar 2026", severity: "LOW", title: "Routine advisory: TLS 1.0/1.1 deprecation deadline reminder", tlp: "WHITE" },
  { date: "Feb 2026", severity: "HIGH", title: "Ransomware actor TTPs relevant to West African healthcare sector", tlp: "GREEN" },
];

const SEV_COLOR: Record<string, string> = {
  CRITICAL: RED, HIGH: "#EA580C", MEDIUM: AMBER, LOW: GREEN,
};

export default function CIIPPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "sectors" | "compliance" | "advisories">("overview");

  const statusIcon = (s: string) =>
    s === "protected" ? "🟢" : s === "monitoring" ? "🟡" : s === "review" ? "🔴" : "⚪";
  const complianceIcon = (s: string) =>
    s === "compliant" ? "✅" : s === "in_progress" ? "🔄" : "⚠️";

  return (
    <div style={{ minHeight: "100vh", background: "#0D1117", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0D1117 0%, #1a1f2e 60%, #0D1117 100%)", padding: "52px 24px 40px", textAlign: "center", borderBottom: "1px solid #21262D" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 30, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#FCA5A5", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE MONITORING ACTIVE</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", color: "#F0F6FF", letterSpacing: "-0.02em" }}>
            🛡️ Critical Information Infrastructure Protection
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "#8B949E", maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            The Gambia CIIP Dashboard — monitoring 8 critical sectors, tracking compliance with national and international cybersecurity frameworks, and publishing security advisories.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {THREAT_LEVELS.map(t => (
              <div key={t.id} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${t.color}40`, borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: t.color }}>{t.count}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.color, letterSpacing: "0.08em" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: "#161B22", borderBottom: "1px solid #21262D", position: "sticky", top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem", display: "flex", gap: 4 }}>
          {[
            { id: "overview", label: "📊 Threat Overview" },
            { id: "sectors", label: "🏭 Critical Sectors" },
            { id: "compliance", label: "📋 Compliance" },
            { id: "advisories", label: "🚨 Advisories" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", background: "none", border: "none", borderBottom: activeTab === tab.id ? `3px solid ${GOLD}` : "3px solid transparent", color: activeTab === tab.id ? GOLD : "#8B949E" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.75rem 1.5rem" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { icon: "🛡️", v: "8", label: "Critical Sectors Monitored", color: "#58A6FF" },
                { icon: "⚠️", v: "21", label: "Active Advisories", color: AMBER },
                { icon: "✅", v: "5/8", label: "Compliance Items Met", color: GREEN },
                { icon: "🔍", v: "99.9%", label: "FORTIS OS Uptime", color: GREEN },
              ].map(({ icon, v, label, color }) => (
                <div key={label} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color, margin: "6px 0 4px" }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#8B949E" }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 14, padding: "1.5rem", marginBottom: 20 }}>
              <h2 style={{ color: "#F0F6FF", fontSize: "1rem", fontWeight: 800, margin: "0 0 12px" }}>🇬🇲 National CIIP Framework</h2>
              <p style={{ fontSize: 13, color: "#8B949E", lineHeight: 1.7, margin: 0 }}>
                The Gambia&apos;s Critical Information Infrastructure Protection (CIIP) plan identifies 8 critical sectors whose disruption would have severe national impact. The framework aligns with the <strong style={{ color: "#F0F6FF" }}>ECOWAS Cybersecurity Policy Framework (2022)</strong>, the <strong style={{ color: "#F0F6FF" }}>AU Malabo Convention</strong>, and the <strong style={{ color: "#F0F6FF" }}>Gambia Data Protection Act 2018 (GDPA)</strong>.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {[
                { icon: "🔒", title: "Confidentiality", desc: "GDPA 2018 requires data minimisation, consent, and secure processing. All FORTIS OS data encrypted at rest and in transit." },
                { icon: "🔄", title: "Integrity", desc: "Immutable audit logs, digital signatures on legal documents, and tamper-evident case records." },
                { icon: "⚡", title: "Availability", desc: "99.9% uptime SLA. Distributed infrastructure across Vercel edge network. DDoS mitigation active." },
                { icon: "📋", title: "Accountability", desc: "Data breach notification within 72 hours per GDPA. Incident response plan updated quarterly." },
              ].map((c, i) => (
                <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, color: "#F0F6FF", fontSize: 14, marginBottom: 6 }}>{c.title}</div>
                  <p style={{ fontSize: 12, color: "#8B949E", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTORS TAB */}
        {activeTab === "sectors" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CRITICAL_SECTORS.map((s, i) => (
              <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#F0F6FF", fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#8B949E", marginTop: 2 }}>Last audit: {s.lastAudit}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.risk === "Low" ? GREEN : s.risk === "Medium" ? AMBER : RED, background: `${s.risk === "Low" ? GREEN : s.risk === "Medium" ? AMBER : RED}20`, padding: "3px 10px", borderRadius: 999 }}>
                    {s.risk} Risk
                  </span>
                  <span style={{ fontSize: 16 }}>{statusIcon(s.status)}</span>
                  <span style={{ fontSize: 11, color: "#8B949E", fontWeight: 600, textTransform: "capitalize" }}>{s.status}</span>
                </div>
              </div>
            ))}
            <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "1rem", marginTop: 8 }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#8B949E" }}>
                <span>🟢 Protected — active monitoring + hardened</span>
                <span>🟡 Monitoring — baseline security, audit pending</span>
                <span>🔴 Under Review — gaps identified</span>
              </div>
            </div>
          </div>
        )}

        {/* COMPLIANCE TAB */}
        {activeTab === "compliance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPLIANCE_CHECKLIST.map((c, i) => (
              <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{complianceIcon(c.status)}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F6FF" }}>{c.item}</div>
                    <div style={{ fontSize: 11, color: "#8B949E" }}>{c.ref}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  background: c.status === "compliant" ? `${GREEN}20` : c.status === "in_progress" ? `${AMBER}20` : "rgba(220,38,38,0.15)",
                  color: c.status === "compliant" ? GREEN : c.status === "in_progress" ? AMBER : RED,
                }}>
                  {c.status === "compliant" ? "COMPLIANT" : c.status === "in_progress" ? "IN PROGRESS" : "UNDER REVIEW"}
                </span>
              </div>
            ))}
            <div style={{ background: "rgba(196,148,58,0.08)", border: "1px solid rgba(196,148,58,0.25)", borderRadius: 12, padding: "1rem 1.25rem", marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "#8B949E", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: GOLD }}>Data Protection Authority:</strong> All FORTIS OS user data is processed in accordance with the Gambia Data Protection Act 2018. Data subjects may exercise access, rectification, and erasure rights via the <Link href="/contact" style={{ color: GOLD }}>contact page</Link>.
              </p>
            </div>
          </div>
        )}

        {/* ADVISORIES TAB */}
        {activeTab === "advisories" && (
          <div>
            <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 20, fontSize: 13, color: "#FCA5A5" }}>
              <strong>🚨 Advisory Protocol:</strong> Advisories are published under the Traffic Light Protocol (TLP). WHITE = public, GREEN = community, AMBER = restricted, RED = private. FORTIS OS shares all WHITE and GREEN advisories publicly.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {RECENT_ADVISORIES.map((a, i) => (
                <div key={i} style={{ background: "#161B22", border: "1px solid #21262D", borderLeft: `4px solid ${SEV_COLOR[a.severity] ?? "#666"}`, borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${SEV_COLOR[a.severity] ?? "#666"}20`, color: SEV_COLOR[a.severity] ?? "#666" }}>{a.severity}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#8B949E", background: "#21262D", padding: "2px 8px", borderRadius: 999 }}>TLP:{a.tlp}</span>
                    <span style={{ fontSize: 11, color: "#8B949E", marginLeft: "auto" }}>{a.date}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#F0F6FF", fontWeight: 600 }}>{a.title}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "1.5rem", marginTop: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F0F6FF", marginBottom: 8 }}>🛡️ Report a Cybersecurity Incident</div>
              <p style={{ fontSize: 12, color: "#8B949E", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 14px" }}>
                Report suspected cyber incidents targeting Gambian infrastructure, government systems, or the FORTIS OS platform to our security team.
              </p>
              <Link href="/contact" style={{ display: "inline-block", padding: "9px 22px", background: RED, color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                🚨 Report Incident →
              </Link>
            </div>
          </div>
        )}

        <p style={{ color: "#8B949E", fontSize: 11, textAlign: "center", marginTop: "2rem" }}>
          FORTIS OS CIIP Dashboard · Data as of April 2026 · fortisos.cloud · © FORTIS INVICTA LTD
        </p>
      </div>
    </div>
  );
}
