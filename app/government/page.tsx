"use client";

import { useState } from "react";
import {
  GOVERNMENT_AGENCIES,
  getAgenciesByType,
  searchAgencies,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type GovernmentAgency,
} from "../../lib/government-agencies";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Agencies", icon: "🏛️" },
  { id: "ministry", label: "Ministries", icon: "📋" },
  { id: "regulatory_body", label: "Regulators", icon: "⚖️" },
  { id: "parastatal", label: "Parastatals", icon: "🏢" },
  { id: "revenue_authority", label: "Revenue", icon: "💰" },
  { id: "independent_body", label: "Independent", icon: "📊" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  ministry:          { bg: "#1B4D3E", label: "Ministry" },
  regulatory_body:   { bg: "#1E3A5F", label: "Regulator" },
  parastatal:        { bg: "#065f46", label: "Parastatal" },
  revenue_authority: { bg: "#92400e", label: "Revenue Authority" },
  security:          { bg: "#374151", label: "Security" },
  judiciary:         { bg: "#7c3aed", label: "Judiciary" },
  independent_body:  { bg: "#0C7B7A", label: "Independent Body" },
};

export default function GovernmentPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapAgency, setMapAgency] = useState<GovernmentAgency | null>(null);

  const list: GovernmentAgency[] = search
    ? searchAgencies(search)
    : typeFilter === "all"
    ? GOVERNMENT_AGENCIES
    : getAgenciesByType(typeFilter as GovernmentAgency["type"]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1a2a4a 60%, #0C7B7A 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🏛️</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Government Agencies Directory
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            18 ministries, regulatory bodies, parastatals, and independent agencies — with mandates, public services, 360° Street View, and contact details.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["📋 5 Ministries", "⚖️ 4 Regulators", "🏢 7 Parastatals", "💰 1 Revenue Authority", "📊 1 Independent Body"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by ministry, mandate, or public service…"
              style={{ width: "100%", padding: "10px 18px", borderRadius: 30, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = G)} onBlur={e => (e.target.style.borderColor = "#E5E7EB")} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TYPE_FILTERS.map(f => (
              <button key={f.id} onClick={() => { setTypeFilter(f.id); setSearch(""); }}
                style={{ padding: "7px 16px", borderRadius: 30, border: typeFilter === f.id ? `2px solid ${G}` : "2px solid #E5E7EB", background: typeFilter === f.id ? G : "#fff", color: typeFilter === f.id ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>{list.length} agenc{list.length !== 1 ? "ies" : "y"} found</p>

        {mapAgency && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapAgency.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapAgency.address}</div>
              </div>
              <button onClick={() => setMapAgency(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe src={getMapEmbedUrl(mapAgency.lat, mapAgency.lng)} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} loading="lazy" title={`Map — ${mapAgency.name}`} referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(agency => {
            const badge = TYPE_BADGE[agency.type] ?? { bg: "#666", label: agency.type };
            const isExpanded = expanded === agency.id;
            return (
              <div key={agency.id} style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid #0C7B7A` }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{agency.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{badge.label}</span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{agency.acronym}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {agency.address}</div>
                    {agency.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {agency.phone}</div>}
                    {agency.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {agency.email}</div>}
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontStyle: "italic" }}>Mandate: {agency.mandate}</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 10px" }}>{agency.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {agency.servicesForPublic.slice(0, 4).map((s, i) => <span key={i} style={{ background: "rgba(12,123,122,0.08)", color: "#0C7B7A", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{s}</span>)}
                      {agency.servicesForPublic.length > 4 && <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>+{agency.servicesForPublic.length - 4} more</span>}
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Key Functions</div>
                          <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                            {agency.keyFunctions.map((f, i) => <li key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>{f}</li>)}
                          </ul>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>All Public Services</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {agency.servicesForPublic.map((s, i) => <span key={i} style={{ background: "rgba(12,123,122,0.08)", color: "#0C7B7A", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{s}</span>)}
                          </div>
                        </div>
                      </div>
                    )}
                    <button onClick={() => setExpanded(isExpanded ? null : agency.id)} style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}>
                      {isExpanded ? "▲ Show less" : "▼ Key functions & public services"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a href={getStreetViewUrl(agency.lat, agency.lng)} target="_blank" rel="noopener noreferrer"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🏙️ 360° View
                    </a>
                    {agency.website && <a href={agency.website} target="_blank" rel="noopener noreferrer"
                      style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, color: "#fff", padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🌐 Website
                    </a>}
                    <button onClick={() => { setMapAgency(agency); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{ background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🗺️ Map
                    </button>
                    <a href={getDirectionsUrl(agency.lat, agency.lng)} target="_blank" rel="noopener noreferrer"
                      style={{ background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🧭 Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 32, lineHeight: 1.7 }}>
          Government agency information is for public access guidance only. Always verify current contacts and services directly with each agency.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
