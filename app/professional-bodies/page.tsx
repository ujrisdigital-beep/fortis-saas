"use client";

import { useState } from "react";
import {
  PROFESSIONAL_BODIES,
  getBodiesByType,
  searchBodies,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type ProfessionalBody,
} from "../../lib/professional-bodies";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Bodies", icon: "🏛️" },
  { id: "chamber_of_commerce", label: "Chamber of Commerce", icon: "💼" },
  { id: "bar_association", label: "Legal", icon: "⚖️" },
  { id: "medical_council", label: "Medical", icon: "🏥" },
  { id: "health_council", label: "Health & Pharmacy", icon: "💊" },
  { id: "engineering_council", label: "Engineering", icon: "⚙️" },
  { id: "accounting_body", label: "Accounting & Finance", icon: "📊" },
  { id: "teachers_union", label: "Teachers Union", icon: "📚" },
  { id: "trade_union", label: "Trade Unions", icon: "🤝" },
  { id: "press_union",    label: "Media & Press",  icon: "📰" },
  { id: "ict_association", label: "ICT & Technology", icon: "🖥️" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  chamber_of_commerce: { bg: "#1B4D3E", label: "Chamber of Commerce" },
  bar_association:     { bg: "#1E3A5F", label: "Legal" },
  medical_council:     { bg: "#991b1b", label: "Medical Council" },
  health_council:      { bg: "#7c3aed", label: "Health Council" },
  engineering_council: { bg: "#065f46", label: "Engineering" },
  accounting_body:     { bg: "#92400e", label: "Accounting" },
  teachers_union:      { bg: "#1e40af", label: "Teachers Union" },
  trade_union:         { bg: "#374151", label: "Trade Union" },
  press_union:         { bg: "#4B0082", label: "Press Union" },
  finance_body:        { bg: "#0C7B7A", label: "Finance" },
  agriculture_body:    { bg: "#14532d", label: "Agriculture" },
  cooperative:         { bg: "#78350f", label: "Cooperative" },
  ict_association:     { bg: "#1A3A5F", label: "ICT Association" },
};

export default function ProfessionalBodiesPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapBody, setMapBody] = useState<ProfessionalBody | null>(null);

  const list: ProfessionalBody[] = search
    ? searchBodies(search)
    : typeFilter === "all"
    ? PROFESSIONAL_BODIES
    : getBodiesByType(typeFilter as ProfessionalBody["type"]);

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
            Professional Bodies & Trade Unions
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            12+ professional associations, regulatory councils, trade unions, and industry bodies in The Gambia — with membership requirements, services, and international affiliations.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["💼 Chamber of Commerce", "⚖️ Bar Association", "🏥 Medical Council", "📚 Teachers Union", "🤝 Trade Unions"].map((t, i) => (
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
              placeholder="🔍 Search by name, acronym, services, or affiliation…"
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
          {list.length} professional bod{list.length !== 1 ? "ies" : "y"} found
        </p>

        {/* Inline map panel */}
        {mapBody && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapBody.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapBody.address}</div>
              </div>
              <button onClick={() => setMapBody(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe
                src={getMapEmbedUrl(mapBody.lat, mapBody.lng)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                loading="lazy"
                title={`Map — ${mapBody.name}`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(body => {
            const badge = TYPE_BADGE[body.type] ?? { bg: "#666", label: body.type };
            const isExpanded = expanded === body.id;

            return (
              <div
                key={body.id}
                style={{
                  background: "#fff", borderRadius: 16, padding: "22px 24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${GOLD}`,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{body.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {badge.label}
                      </span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {body.acronym}
                      </span>
                      {body.yearEstablished && (
                        <span style={{ background: `${GOLD}20`, color: "#92400e", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                          Est. {body.yearEstablished}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {body.address}</div>
                    {body.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {body.phone}</div>}
                    {body.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {body.email}</div>}
                    {body.memberCount && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>👥 {body.memberCount}</div>}

                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 10px" }}>{body.description}</p>

                    {/* Service tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {body.services.slice(0, 4).map((s, i) => (
                        <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                      {body.services.length > 4 && (
                        <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>
                          +{body.services.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Expanded: membership + affiliations */}
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        {body.services.length > 4 && (
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>All Services</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {body.services.map((s, i) => (
                                <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Membership Requirements</div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{body.membershipRequirements}</p>
                        </div>
                        {body.internationalAffiliations.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>International Affiliations</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {body.internationalAffiliations.map((a, i) => (
                                <span key={i} style={{ background: `${GOLD}15`, color: "#92400e", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{a}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setExpanded(isExpanded ? null : body.id)}
                      style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}
                    >
                      {isExpanded ? "▲ Show less" : "▼ Membership requirements & affiliations"}
                    </button>
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a
                      href={getStreetViewUrl(body.lat, body.lng)}
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
                    {body.website && (
                      <a
                        href={body.website}
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
                      onClick={() => { setMapBody(body); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🗺️ Map
                    </button>
                    <a
                      href={getDirectionsUrl(body.lat, body.lng)}
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

        {/* CTA */}
        <div style={{
          marginTop: 40, background: `linear-gradient(135deg, ${GOLD}10, ${GOLD}20)`,
          border: `1.5px solid ${GOLD}40`, borderRadius: 20, padding: 28, textAlign: "center",
        }}>
          <h3 style={{ color: DARK, fontWeight: 800, marginBottom: 8, fontSize: 18 }}>🏛️ Is your organisation missing?</h3>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 16px" }}>
            This directory is continuously updated. Professional bodies, trade unions, and cooperatives can request listing updates.
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-block", padding: "10px 24px", background: GOLD,
              color: DARK, borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none",
            }}
          >
            Contact Us to Update Listing →
          </a>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Listings are for informational purposes. Verify current membership requirements directly with each organisation.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
