"use client";

import { useState } from "react";
import ContactForm from "../../components/ContactForm";
import {
  DEVELOPMENT_PARTNERS,
  getPartnersByType,
  searchPartners,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type DevelopmentPartner,
} from "../../lib/development-partners";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Partners", icon: "🌐" },
  { id: "un_agency", label: "UN Agencies", icon: "🇺🇳" },
  { id: "multilateral_bank", label: "Multilateral Banks", icon: "🏦" },
  { id: "bilateral_donor", label: "Bilateral Donors", icon: "🤝" },
  { id: "regional_body", label: "Regional Bodies", icon: "🌍" },
  { id: "ingo", label: "INGOs", icon: "❤️" },
  { id: "foundation", label: "Foundations", icon: "🏛️" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  un_agency:        { bg: "#1E3A5F", label: "UN Agency" },
  multilateral_bank: { bg: "#065f46", label: "Multilateral Bank" },
  bilateral_donor:  { bg: "#4B0082", label: "Bilateral Donor" },
  regional_body:    { bg: "#92400e", label: "Regional Body" },
  ingo:             { bg: "#991b1b", label: "INGO" },
  foundation:       { bg: "#1e40af", label: "Foundation" },
};

export default function PartnersPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mapPartner, setMapPartner] = useState<DevelopmentPartner | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  let list = search
    ? searchPartners(search)
    : typeFilter === "all"
    ? DEVELOPMENT_PARTNERS
    : getPartnersByType(typeFilter as DevelopmentPartner["type"]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🤝</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Development Partners Directory
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            50+ UN agencies, multilateral banks, bilateral donors, INGOs, and foundations operating in The Gambia — with 360° Street View, official websites, and direct contact details.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🇺🇳 13 UN Agencies", "🏦 6 Development Banks", "🤝 9 Bilateral Donors", "❤️ 10 INGOs", "🏛️ 5 Foundations"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px" }}>

        {/* Search + Filters */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, acronym, or focus area…"
              style={{
                width: "100%", padding: "10px 18px", borderRadius: 30,
                border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TYPE_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => { setTypeFilter(f.id); setSearch(""); }}
                style={{
                  padding: "7px 16px", borderRadius: 30,
                  border: typeFilter === f.id ? `2px solid ${G}` : "2px solid #E5E7EB",
                  background: typeFilter === f.id ? G : "#fff",
                  color: typeFilter === f.id ? "#fff" : "#374151",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>
          {list.length} development partners found
        </p>

        {/* Map panel */}
        {mapPartner && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapPartner.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapPartner.address}</div>
              </div>
              <button onClick={() => setMapPartner(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe
                src={getMapEmbedUrl(mapPartner.lat, mapPartner.lng)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                loading="lazy"
                title={`Map — ${mapPartner.name}`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Partner list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map(p => {
            const badge = TYPE_BADGE[p.type] ?? { bg: "#666", label: p.type };
            const isExpanded = expanded === p.id;
            return (
              <div
                key={p.id}
                style={{
                  background: "#fff", borderRadius: 16, padding: "20px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.15s",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{p.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {badge.label}
                      </span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {p.acronym}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>📍 {p.address}</div>
                    {p.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {p.phone}</div>}
                    {p.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {p.email}</div>}
                    {p.localRep && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>👤 {p.localRep}</div>}
                    {p.description && (
                      <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: "6px 0 0" }}>{p.description}</p>
                    )}

                    {/* Focus areas */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                      {p.focusAreas.map((f, i) => (
                        <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{f}</span>
                      ))}
                    </div>

                    {/* Expanded: programmes + funding windows */}
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        {p.programmes && p.programmes.length > 0 && (
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Programmes</div>
                            <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                              {p.programmes.map((prog, i) => (
                                <li key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>{prog}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {p.fundingWindows && p.fundingWindows.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Funding Windows</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {p.fundingWindows.map((fw, i) => (
                                <span key={i} style={{ background: `${GOLD}20`, color: "#92400e", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{fw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setExpanded(isExpanded ? null : p.id)}
                      style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}
                    >
                      {isExpanded ? "▲ Show less" : "▼ Show programmes & funding windows"}
                    </button>
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a
                      href={getStreetViewUrl(p.lat, p.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
                        color: DARK, padding: "9px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: 12, fontWeight: 800,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🏙️ 360° View
                    </a>
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${DARK}, ${G})`,
                        color: "#fff", padding: "9px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: 12, fontWeight: 700,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🌐 Website
                    </a>
                    <button
                      onClick={() => { setMapPartner(p); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🗺️ Map
                    </button>
                    <a
                      href={getDirectionsUrl(p.lat, p.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: 12, fontWeight: 600,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🧭 Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partnership CTA */}
        <div style={{
          marginTop: 40, background: `linear-gradient(135deg, ${GOLD}10, ${GOLD}20)`,
          border: `1.5px solid ${GOLD}40`, borderRadius: 20, padding: 32,
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h3 style={{ color: DARK, fontWeight: 800, marginBottom: 8, fontSize: 18 }}>🌐 Partner with FORTIS OS</h3>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
              FORTIS OS welcomes all development partners, NGOs, and government bodies aligned with digital transformation, justice, and SDG implementation in The Gambia.
            </p>
          </div>
          <ContactForm
            type="partnership"
            buttonText="Request Partnership Meeting"
            inline={true}
          />
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Partner listings are for informational purposes. Verify current programmes directly with each organisation.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
