"use client";

import { useState } from "react";
import {
  MEDIA_INSTITUTIONS,
  getMediaByType,
  searchMedia,
  getStreetViewUrl,
  getDirectionsUrl,
  type MediaInstitution,
} from "@/lib/media-institutions";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all",       label: "All Media",       icon: "📡" },
  { id: "radio",     label: "Radio",           icon: "📻" },
  { id: "tv",        label: "TV Stations",     icon: "📺" },
  { id: "cable",     label: "Cable/Satellite", icon: "🛰️" },
  { id: "newspaper", label: "Newspapers",      icon: "📰" },
  { id: "magazine",  label: "Magazines",       icon: "📖" },
  { id: "online",    label: "Online Media",    icon: "🌐" },
];

const TYPE_COLOR: Record<string, string> = {
  radio:     "#1E3A5F",
  tv:        "#065f46",
  cable:     "#374151",
  newspaper: "#92400e",
  magazine:  "#7c3aed",
  online:    "#0C7B7A",
};

const TYPE_LABEL: Record<string, string> = {
  radio:     "📻 Radio",
  tv:        "📺 TV",
  cable:     "🛰️ Cable/Satellite",
  newspaper: "📰 Newspaper",
  magazine:  "📖 Magazine",
  online:    "🌐 Online",
};

export default function MediaPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const list: MediaInstitution[] = search
    ? searchMedia(search)
    : getMediaByType(typeFilter);

  const counts = {
    radio:     MEDIA_INSTITUTIONS.filter(m => m.type === "radio").length,
    tv:        MEDIA_INSTITUTIONS.filter(m => m.type === "tv").length,
    cable:     MEDIA_INSTITUTIONS.filter(m => m.type === "cable").length,
    newspaper: MEDIA_INSTITUTIONS.filter(m => m.type === "newspaper").length,
    magazine:  MEDIA_INSTITUTIONS.filter(m => m.type === "magazine").length,
    online:    MEDIA_INSTITUTIONS.filter(m => m.type === "online").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1a2a4a 55%, #0C7B7A 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>📡</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Mass Media of The Gambia
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Radio stations, TV networks, newspapers, magazines, and online media — with website links, 360° Street View, and contact info.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              `📻 ${counts.radio} Radio Stations`,
              `📺 ${counts.tv} TV Stations`,
              `🛰️ ${counts.cable} Cable/Satellite`,
              `📰 ${counts.newspaper} Newspapers`,
              `📖 ${counts.magazine} Magazines`,
              `🌐 ${counts.online} Online Media`,
            ].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
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
              placeholder="🔍 Search by name, frequency, or area…"
              style={{ width: "100%", padding: "10px 18px", borderRadius: 30, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TYPE_FILTERS.map(f => (
              <button key={f.id} onClick={() => { setTypeFilter(f.id); setSearch(""); }}
                style={{ padding: "7px 16px", borderRadius: 30, border: typeFilter === f.id && !search ? `2px solid ${G}` : "2px solid #E5E7EB", background: typeFilter === f.id && !search ? G : "#fff", color: typeFilter === f.id && !search ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>{list.length} institution{list.length !== 1 ? "s" : ""} found</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18, marginBottom: 32 }}>
          {list.map(media => (
            <div key={media.id} style={{
              background: "#fff", borderRadius: 16, padding: "20px 22px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${TYPE_COLOR[media.type] ?? G}`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK, lineHeight: 1.3 }}>{media.name}</h3>
                  {media.frequency && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: TYPE_COLOR[media.type], marginTop: 2 }}>📶 {media.frequency}</div>
                  )}
                  {media.channel && !media.frequency && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: TYPE_COLOR[media.type], marginTop: 2 }}>📺 {media.channel}</div>
                  )}
                </div>
                <span style={{ background: TYPE_COLOR[media.type] ?? G, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {TYPE_LABEL[media.type]}
                </span>
              </div>

              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>📍 {media.address}, {media.area}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>📞 {media.phone}</div>
              {media.email && <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>✉️ {media.email}</div>}
              {media.founded && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>📅 Est. {media.founded}</div>}

              <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: "0 0 14px" }}>{media.description}</p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={media.website} target="_blank" rel="noopener noreferrer"
                  style={{ background: `linear-gradient(135deg, ${G}, #2A6B52)`, color: "#fff", padding: "7px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🌐 Website
                </a>
                <a href={getStreetViewUrl(media.lat, media.lng)} target="_blank" rel="noopener noreferrer"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "7px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🏙️ 360° View
                </a>
                <a href={getDirectionsUrl(media.lat, media.lng)} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#F3F4F6", color: "#374151", padding: "7px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🧭 Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 12, lineHeight: 1.7 }}>
          Media data sourced from PURA, GPA, and public records. Website URLs are indicative — verify with each institution directly.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
