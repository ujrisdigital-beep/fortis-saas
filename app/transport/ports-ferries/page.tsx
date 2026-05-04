"use client";

import { useState } from "react";
import {
  MARITIME_LOCATIONS,
  getLocationsByType,
  searchLocations,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type MaritimeLocation,
} from "../../../lib/ports-ferries";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Locations", icon: "⚓" },
  { id: "international_port", label: "International Port", icon: "🚢" },
  { id: "vehicle_ferry", label: "Vehicle Ferries", icon: "🚗" },
  { id: "passenger_boat", label: "Passenger Boats", icon: "⛵" },
  { id: "fishing_port", label: "Fishing Ports", icon: "🐟" },
  { id: "marina", label: "Marinas", icon: "⛵" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  international_port: { bg: "#1B4D3E", label: "International Port" },
  vehicle_ferry:      { bg: "#1E3A5F", label: "Vehicle Ferry" },
  passenger_boat:     { bg: "#065f46", label: "Passenger Boat" },
  fishing_port:       { bg: "#92400e", label: "Fishing Port" },
  marina:             { bg: "#1e40af", label: "Marina" },
};

export default function PortsFerriesPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapLocation, setMapLocation] = useState<MaritimeLocation | null>(null);

  const list: MaritimeLocation[] = search
    ? searchLocations(search)
    : typeFilter === "all"
    ? MARITIME_LOCATIONS
    : getLocationsByType(typeFilter as MaritimeLocation["type"]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1a3a5c 60%, #0C7B7A 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>⚓</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Ports, Ferries & Maritime Directory
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            16 maritime locations across The Gambia — from the Port of Banjul to river ferries, artisanal fishing ports, tourist pirogues, and leisure marinas. With 360° Street View, schedules, and directions.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🚢 1 International Port", "🚗 5 Vehicle Ferries", "⛵ 5 Passenger Boats", "🐟 3 Fishing Ports", "⛵ 2 Marinas"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Search + Filters */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, type, region, or service…"
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
          {list.length} maritime location{list.length !== 1 ? "s" : ""} found
        </p>

        {/* Inline map panel */}
        {mapLocation && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapLocation.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapLocation.address}</div>
              </div>
              <button onClick={() => setMapLocation(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
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

        {/* Location cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(loc => {
            const badge = TYPE_BADGE[loc.type] ?? { bg: "#666", label: loc.type };
            const isExpanded = expanded === loc.id;

            return (
              <div
                key={loc.id}
                style={{
                  background: "#fff", borderRadius: 16, padding: "22px 24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid #0C7B7A`,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{loc.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {badge.label}
                      </span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                        {loc.region}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {loc.address}</div>
                    {loc.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {loc.phone}</div>}
                    {loc.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {loc.email}</div>}
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>🏢 {loc.operator}</div>

                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "8px 0 10px" }}>{loc.description}</p>

                    {/* Service tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {loc.services.slice(0, 4).map((s, i) => (
                        <span key={i} style={{ background: "rgba(12,123,122,0.08)", color: "#0C7B7A", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                      {loc.services.length > 4 && (
                        <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>
                          +{loc.services.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Expanded: schedule + fares + capacity */}
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        {loc.services.length > 4 && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>All Services</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {loc.services.map((s, i) => (
                                <span key={i} style={{ background: "rgba(12,123,122,0.08)", color: "#0C7B7A", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                          {loc.schedule && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Schedule</div>
                              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{loc.schedule}</p>
                            </div>
                          )}
                          {loc.crossingTime && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Crossing Time</div>
                              <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{loc.crossingTime}</p>
                            </div>
                          )}
                          {loc.fare && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Fares</div>
                              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{loc.fare}</p>
                            </div>
                          )}
                          {loc.capacity && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Capacity</div>
                              <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{loc.capacity}</p>
                            </div>
                          )}
                          {loc.vesselCount && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Vessels</div>
                              <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{loc.vesselCount} vessels</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setExpanded(isExpanded ? null : loc.id)}
                      style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}
                    >
                      {isExpanded ? "▲ Show less" : "▼ Schedule, fares & capacity"}
                    </button>
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
                      🏙️ 360° View
                    </a>
                    {loc.website && (
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
                        🌐 Website
                      </a>
                    )}
                    <button
                      onClick={() => { setMapLocation(loc); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🗺️ Map
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

        {/* Disclaimer */}
        <div style={{
          marginTop: 40, background: "rgba(196,148,58,0.06)",
          border: "1.5px solid rgba(196,148,58,0.25)", borderRadius: 14, padding: 20,
        }}>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: DARK }}>⚠️ Important:</strong> Ferry schedules and fares are subject to change, seasonal variation, and weather closures. Always verify current schedules with the Gambia Ports Authority or local operators before travel. River levels during dry season (Dec–Apr) may affect service frequency.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
