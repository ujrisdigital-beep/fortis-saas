"use client";

import { useState } from "react";
import {
  EMBASSY_LOCATIONS,
  getEmbassiesByType,
  searchEmbassies,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type EmbassyLocation,
} from "../../lib/embassy-locations";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Missions", icon: "🌍" },
  { id: "embassy", label: "Embassies", icon: "🏛️" },
  { id: "high_commission", label: "High Commissions", icon: "👑" },
  { id: "international_agency", label: "UN & International", icon: "🇺🇳" },
  { id: "honorary_consulate", label: "Honorary Consulates", icon: "📜" },
];

const AREAS = ["All Areas", "Fajara", "Banjul", "Bijilo", "Bakau"];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  embassy: { bg: "#1E3A5F", label: "Embassy" },
  high_commission: { bg: G, label: "High Commission" },
  international_agency: { bg: "#4B0082", label: "UN Agency" },
  honorary_consulate: { bg: "#8B4513", label: "Hon. Consulate" },
};

export default function EmbassiesPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [mapLocation, setMapLocation] = useState<EmbassyLocation | null>(null);

  let list = search
    ? searchEmbassies(search)
    : typeFilter === "all"
    ? EMBASSY_LOCATIONS
    : getEmbassiesByType(typeFilter as EmbassyLocation["type"]);

  if (areaFilter !== "All Areas") {
    list = list.filter(l => l.area === areaFilter);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🏛️</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Embassies &amp; International Missions
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 600, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Complete directory of diplomatic missions in The Gambia — 360° Street View, official websites, and directions for every location.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🏛️ 10+ Embassies", "🇺🇳 10+ UN Agencies", "📍 360° Street View", "🌐 Official Website Links"].map((t, i) => (
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by country, embassy name, or address…"
              style={{
                flex: 1, minWidth: 200, padding: "10px 18px", borderRadius: 30,
                border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              style={{
                padding: "10px 16px", borderRadius: 30, border: "1.5px solid #E5E7EB",
                fontSize: 13, background: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
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
          {list.length} diplomatic missions found
        </p>

        {/* Map panel (shown when a location is selected) */}
        {mapLocation && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapLocation.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapLocation.address}</div>
              </div>
              <button
                onClick={() => setMapLocation(null)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}
              >
                ✕
              </button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe
                src={getMapEmbedUrl(mapLocation.lat, mapLocation.lng)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                loading="lazy"
                title={`Map — ${mapLocation.name}`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Embassy list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map(loc => {
            const badge = TYPE_BADGE[loc.type] ?? { bg: "#666", label: loc.type };
            return (
              <div
                key={loc.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "20px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{loc.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 4 }}>{loc.country}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {loc.address}, {loc.area}</div>
                    {loc.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {loc.phone}</div>}
                    {loc.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {loc.email}</div>}
                    {loc.hours && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>⏰ {loc.hours}</div>}
                    {loc.services && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                        {loc.services.map((s, i) => (
                          <span key={i} style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a
                      href={getStreetViewUrl(loc.lat, loc.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
                        color: DARK, padding: "9px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: 12, fontWeight: 800,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🏙️ 360° Street View
                    </a>
                    <a
                      href={loc.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${DARK}, ${G})`,
                        color: "#fff", padding: "9px 16px", borderRadius: 10,
                        textDecoration: "none", fontSize: 12, fontWeight: 700,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🌐 Visit Website
                    </a>
                    <button
                      onClick={() => { setMapLocation(loc); window.scrollTo({ top: 340, behavior: "smooth" }); }}
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🗺️ Show Map
                    </button>
                    <a
                      href={getDirectionsUrl(loc.lat, loc.lng)}
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

        {/* Emergency info */}
        <div style={{
          marginTop: 40, background: `linear-gradient(135deg, ${GOLD}10, ${GOLD}20)`,
          border: `1.5px solid ${GOLD}40`, borderRadius: 16, padding: 24, textAlign: "center",
        }}>
          <h3 style={{ color: DARK, fontWeight: 800, marginBottom: 10, fontSize: 16 }}>🆘 Emergency Consular Assistance</h3>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 10, lineHeight: 1.6 }}>
            Foreign nationals in distress should contact their country's embassy directly using the 360° Street View links to locate them.
          </p>
          <p style={{ fontSize: 13, color: "#374151" }}>
            <strong>Gambia Ministry of Foreign Affairs:</strong>{" "}
            <a href="tel:+2204223578" style={{ color: G, textDecoration: "none", fontWeight: 700 }}>+220 422 3578</a>
            {" · "}
            <a href="mailto:info@mofa.gov.gm" style={{ color: G, textDecoration: "none" }}>info@mofa.gov.gm</a>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Diplomatic listings can change. Verify with the Ministry of Foreign Affairs or specific mission.<br />
          Street View opens Google Maps 360°. Some locations may have limited coverage in remote areas.<br />
          © FORTIS INVICTA LTD — FORTIS OS™
        </p>
      </div>
    </div>
  );
}
