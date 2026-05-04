"use client";

import { useState } from "react";
import {
  EDUCATIONAL_INSTITUTIONS,
  getInstitutionsByType,
  searchInstitutions,
  getStreetViewUrl,
  getDirectionsUrl,
  getMapEmbedUrl,
  type EducationalInstitution,
} from "../../lib/educational-institutions";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const TYPE_FILTERS = [
  { id: "all", label: "All Institutions", icon: "🎓" },
  { id: "public_university", label: "Public Universities", icon: "🏛️" },
  { id: "private_university", label: "Private Universities", icon: "🎖️" },
  { id: "vocational", label: "TVET / Vocational", icon: "🔧" },
  { id: "monotechnic", label: "Polytechnics", icon: "⚙️" },
  { id: "nursing", label: "Nursing & Health", icon: "🏥" },
  { id: "military", label: "Military & Para", icon: "🎖️" },
  { id: "teacher_training", label: "Teacher Training", icon: "📚" },
  { id: "research", label: "Research", icon: "🔬" },
];

const TYPE_BADGE: Record<string, { bg: string; label: string }> = {
  public_university:  { bg: "#1B4D3E", label: "Public University" },
  private_university: { bg: "#1E3A5F", label: "Private University" },
  vocational:         { bg: "#92400e", label: "TVET / Vocational" },
  monotechnic:        { bg: "#065f46", label: "Polytechnic" },
  military:           { bg: "#374151", label: "Military" },
  paramilitary:       { bg: "#4B0082", label: "Paramilitary" },
  nursing:            { bg: "#991b1b", label: "Nursing & Health" },
  teacher_training:   { bg: "#1e40af", label: "Teacher Training" },
  research:           { bg: "#5b21b6", label: "Research" },
};

export default function EducationPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapInstitution, setMapInstitution] = useState<EducationalInstitution | null>(null);

  const list: EducationalInstitution[] = search
    ? searchInstitutions(search)
    : typeFilter === "all"
    ? EDUCATIONAL_INSTITUTIONS
    : getInstitutionsByType(typeFilter as EducationalInstitution["type"]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎓</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Educational Institutions Directory
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            40+ public universities, private universities, TVET centres, nursing schools, military academies, and research institutions in The Gambia — with 360° Street View, admission requirements, and scholarship information.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🏛️ 4 Public Universities", "🎖️ 4 Private Universities", "🔧 6 TVET Centres", "🏥 2 Health Schools", "🔬 2 Research Institutes"].map((t, i) => (
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
              placeholder="🔍 Search by institution name, programme, or area…"
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
          {list.length} institution{list.length !== 1 ? "s" : ""} found
        </p>

        {/* Inline map panel */}
        {mapInstitution && (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>{mapInstitution.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{mapInstitution.address}</div>
              </div>
              <button onClick={() => setMapInstitution(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "40%", height: 0 }}>
              <iframe
                src={getMapEmbedUrl(mapInstitution.lat, mapInstitution.lng)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                loading="lazy"
                title={`Map — ${mapInstitution.name}`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Institution cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(inst => {
            const badge = TYPE_BADGE[inst.type] ?? { bg: "#666", label: inst.type };
            const isExpanded = expanded === inst.id;

            return (
              <div
                key={inst.id}
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
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>{inst.name}</h3>
                      <span style={{ background: badge.bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {badge.label}
                      </span>
                      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {inst.acronym}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📍 {inst.address}</div>
                    {inst.phone && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>📞 {inst.phone}</div>}
                    {inst.email && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>✉️ {inst.email}</div>}
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>🏆 {inst.accreditation}</div>

                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 10px" }}>{inst.description}</p>

                    {/* Programme tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {inst.programmes.slice(0, 5).map((p, i) => (
                        <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
                          {p}
                        </span>
                      ))}
                      {inst.programmes.length > 5 && (
                        <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>
                          +{inst.programmes.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Expanded: all programmes + admission + scholarship */}
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                        {inst.programmes.length > 5 && (
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>All Programmes</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {inst.programmes.map((p, i) => (
                                <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Admission Requirements</div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{inst.admissionRequirements}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Scholarships & Funding</div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, margin: 0 }}>{inst.scholarshipInfo}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setExpanded(isExpanded ? null : inst.id)}
                      style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}
                    >
                      {isExpanded ? "▲ Show less" : "▼ Admission requirements & scholarships"}
                    </button>
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                    <a
                      href={getStreetViewUrl(inst.lat, inst.lng)}
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
                    {inst.website && (
                      <a
                        href={inst.website}
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
                      onClick={() => { setMapInstitution(inst); window.scrollTo({ top: 320, behavior: "smooth" }); }}
                      style={{
                        background: "#F3F4F6", color: "#374151", padding: "9px 16px", borderRadius: 10,
                        border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      🗺️ Map
                    </button>
                    <a
                      href={getDirectionsUrl(inst.lat, inst.lng)}
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
          <h3 style={{ color: DARK, fontWeight: 800, marginBottom: 8, fontSize: 18 }}>🎓 Is your institution missing?</h3>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 16px" }}>
            We are continuously expanding this directory. Contact us to add or update your institution&apos;s listing.
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
          Institution listings are for informational purposes. Verify current programmes and requirements directly with each institution.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
