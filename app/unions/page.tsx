"use client";

import { useState } from "react";
import {
  TRADE_UNIONS,
  getUnionsByType,
  searchUnions,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type TradeUnion,
} from "../../lib/trade-unions";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Unions", icon: "👥" },
  { id: "federation", label: "Apex Federation", icon: "🏛️" },
  { id: "sector_union", label: "Sector Unions", icon: "⚙️" },
  { id: "general_union", label: "General Unions", icon: "🤝" },
  { id: "professional_union", label: "Professional Unions", icon: "👔" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  federation:         { bg: "#1B4D3E", label: "Apex Federation" },
  sector_union:       { bg: "#1E3A5F", label: "Sector Union" },
  general_union:      { bg: "#065f46", label: "General Union" },
  professional_union: { bg: "#7c3aed", label: "Professional Union" },
};

export default function UnionsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapUnion, setMapUnion] = useState<TradeUnion | null>(null);

  const list: TradeUnion[] = search
    ? searchUnions(search)
    : typeFilter === "all"
    ? TRADE_UNIONS
    : getUnionsByType(typeFilter as TradeUnion["type"]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1a3a5c 60%, ${G} 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>👥</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Trade Unions Directory
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            8 registered trade unions and federations representing 80,000+ workers across The Gambia — from teachers and fishermen to civil servants and construction workers.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🏛️ 1 Apex Federation", "⚙️ 6 Sector Unions", "🤝 1 General Union"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, sector, or benefits…"
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

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>{list.length} union{list.length !== 1 ? "s" : ""} found</p>

        {mapUnion && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapUnion.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapUnion.address}</div>
              </div>
              <button onClick={() => setMapUnion(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe src={getMapEmbedUrl(mapUnion.lat, mapUnion.lng)} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} loading="lazy" title={`Map — ${mapUnion.name}`} referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(union => {
            const badge = TYPE_BADGE[union.type] ?? { bg: "#666", label: union.type };
            const isExpanded = expanded === union.id;
            return (
              <div key={union.id} style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${GOLD}` }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{union.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{badge.label}</span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{union.acronym}</span>
                      {union.yearEstablished && <span style={{ background: `${GOLD}20`, color: "#92400e", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>Est. {union.yearEstablished}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {union.address}</div>
                    {union.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {union.phone}</div>}
                    {union.memberCount && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>👥 {union.memberCount}</div>}
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>⚙️ {union.sector}</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 10px" }}>{union.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {union.benefits.slice(0, 4).map((b, i) => (
                        <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{b}</span>
                      ))}
                      {union.benefits.length > 4 && <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>+{union.benefits.length - 4} more</span>}
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        {union.benefits.length > 4 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>All Member Benefits</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {union.benefits.map((b, i) => <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{b}</span>)}
                            </div>
                          </div>
                        )}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Membership Requirements</div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{union.membershipRequirements}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>International Affiliations</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {union.internationalAffiliations.map((a, i) => <span key={i} style={{ background: `${GOLD}15`, color: "#92400e", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{a}</span>)}
                          </div>
                        </div>
                      </div>
                    )}
                    <button onClick={() => setExpanded(isExpanded ? null : union.id)} style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}>
                      {isExpanded ? "▲ Show less" : "▼ Membership & affiliations"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a href={getStreetViewUrl(union.lat, union.lng)} target="_blank" rel="noopener noreferrer"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🏙️ 360° View
                    </a>
                    {union.website && <a href={union.website} target="_blank" rel="noopener noreferrer"
                      style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, color: "#fff", padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🌐 Website
                    </a>}
                    <button onClick={() => { setMapUnion(union); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{ background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🗺️ Map
                    </button>
                    <a href={getDirectionsUrl(union.lat, union.lng)} target="_blank" rel="noopener noreferrer"
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
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
