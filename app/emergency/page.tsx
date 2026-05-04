"use client";

import { useState } from "react";
import {
  EMERGENCY_SERVICES,
  getEmergencyByType,
  searchEmergency,
  getStreetViewUrl,
  getDirectionsUrl,
  type EmergencyService,
} from "@/lib/emergency-services";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";
const RED = "#DC2626";

const TYPE_FILTERS = [
  { id: "all",      label: "All Services",    icon: "🚨" },
  { id: "hospital", label: "Hospitals",        icon: "🏥" },
  { id: "police",   label: "Police Stations",  icon: "👮" },
  { id: "fire",     label: "Fire Stations",    icon: "🔥" },
];

const REGIONS = ["all", "Banjul", "Kanifing", "West Coast", "North Bank", "Lower River", "Central River", "Upper River"];

const TYPE_COLOR: Record<string, string> = {
  hospital: "#1E3A5F",
  police:   "#065f46",
  fire:     RED,
};

const TYPE_LABEL: Record<string, string> = {
  hospital: "🏥 Hospital",
  police:   "👮 Police",
  fire:     "🔥 Fire Station",
};

export default function EmergencyPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const list: EmergencyService[] = (() => {
    let base = search
      ? searchEmergency(search)
      : getEmergencyByType(typeFilter);
    if (regionFilter !== "all") base = base.filter(s => s.region === regionFilter);
    return base;
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, #7f1d1d 0%, ${RED} 55%, #dc2626 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🚨</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Emergency Services — The Gambia
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.9, maxWidth: 600, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Hospitals • Police Stations • Fire Stations — 360° Street View, directions, and contact info across all 7 regions.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {["🏥 14 Hospitals", "👮 11 Police Stations", "🔥 7 Fire Stations"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.18)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          {/* Emergency numbers banner */}
          <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 12, padding: "12px 20px", display: "inline-block", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>
            🚓 Police: <strong>117</strong> &nbsp;·&nbsp; 🔥 Fire: <strong>118</strong> &nbsp;·&nbsp; 🚑 Ambulance: <strong>116</strong> &nbsp;·&nbsp; 🏥 EFSTH: <strong>+220 422 7222</strong>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, region, or address…"
              style={{ width: "100%", padding: "10px 18px", borderRadius: 30, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = RED)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {TYPE_FILTERS.map(f => (
              <button key={f.id} onClick={() => { setTypeFilter(f.id); setSearch(""); }}
                style={{ padding: "7px 16px", borderRadius: 30, border: typeFilter === f.id && !search ? `2px solid ${RED}` : "2px solid #E5E7EB", background: typeFilter === f.id && !search ? RED : "#fff", color: typeFilter === f.id && !search ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegionFilter(r)}
                style={{ padding: "5px 12px", borderRadius: 20, border: regionFilter === r ? `1.5px solid ${G}` : "1.5px solid #E5E7EB", background: regionFilter === r ? G : "#fff", color: regionFilter === r ? "#fff" : "#374151", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {r === "all" ? "📍 All Regions" : r}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>{list.length} service{list.length !== 1 ? "s" : ""} found</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18, marginBottom: 32 }}>
          {list.map(service => (
            <div key={service.id} style={{
              background: "#fff", borderRadius: 16, padding: "20px 22px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderTop: `4px solid ${TYPE_COLOR[service.type] ?? G}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK, lineHeight: 1.3 }}>{service.name}</h3>
                <span style={{ background: TYPE_COLOR[service.type] ?? G, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {TYPE_LABEL[service.type]}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {service.address}, {service.region}</div>
              <div style={{ fontSize: 12, color: "#374151", marginBottom: 3, fontWeight: 600 }}>📞 {service.phone}</div>
              {service.emergencyPhone && (
                <div style={{ fontSize: 12, color: RED, fontWeight: 800, marginBottom: 3 }}>🚨 Emergency: {service.emergencyPhone}</div>
              )}
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 14 }}>⏰ {service.hours}</div>

              {service.services && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                  {service.services.map((s, i) => (
                    <span key={i} style={{ background: `${TYPE_COLOR[service.type] ?? G}12`, color: TYPE_COLOR[service.type] ?? G, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={getStreetViewUrl(service.lat, service.lng)} target="_blank" rel="noopener noreferrer"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🏙️ 360° View
                </a>
                <a href={getDirectionsUrl(service.lat, service.lng)} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#F3F4F6", color: "#374151", padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🧭 Directions
                </a>
                {service.phone && (
                  <a href={`tel:${service.phone}`}
                    style={{ background: "#F3F4F6", color: "#374151", padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    📞 Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency contacts box */}
        <div style={{ background: `linear-gradient(135deg, rgba(220,38,38,0.07), rgba(220,38,38,0.12))`, border: `1.5px solid ${RED}40`, borderRadius: 16, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontWeight: 900, color: RED, fontSize: 16, marginBottom: 12 }}>🆘 National Emergency Numbers</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", fontSize: 14 }}>
            <div><span style={{ color: "#374151" }}>🚓 Police: </span><strong style={{ color: RED, fontSize: 18 }}>117</strong></div>
            <div><span style={{ color: "#374151" }}>🔥 Fire & Rescue: </span><strong style={{ color: RED, fontSize: 18 }}>118</strong></div>
            <div><span style={{ color: "#374151" }}>🚑 Ambulance: </span><strong style={{ color: RED, fontSize: 18 }}>116</strong></div>
            <div><span style={{ color: "#374151" }}>🏥 EFSTH: </span><strong style={{ color: RED, fontSize: 18 }}>+220 422 7222</strong></div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Emergency service data sourced from MoH, Gambia Police Force, and Gambia Fire & Rescue Service. Verify contacts before use.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
