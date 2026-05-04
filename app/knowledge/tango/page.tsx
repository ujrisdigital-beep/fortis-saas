"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface TangoMember {
  id: number;
  name: string;
  region: string;
  sectors: string[];
  description: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

const REGIONS = ["All", "Banjul", "Kanifing", "Brikama", "Mansakonko", "Kerewan", "Farafenni", "Basse", "Bakoteh", "Fajara"];
const SECTORS = ["All", "Education", "Health", "Women & Youth", "Environment", "Human Rights", "Agriculture", "Livelihoods", "Disaster Relief", "Child Protection", "Advocacy", "Disability", "Research", "Media", "Youth"];

const SECTOR_COLOR: Record<string, string> = {
  Education: "#1D4ED8", Health: "#DC2626", "Women & Youth": "#9333EA",
  Environment: "#16A34A", "Human Rights": "#EA580C", Agriculture: "#65A30D",
  Livelihoods: "#CA8A04", "Disaster Relief": "#EF4444", "Child Protection": "#7C3AED",
  Advocacy: "#0891B2", Disability: "#6B7280", Research: "#0284C7",
  Media: "#B45309", Youth: "#7C3AED", WASH: "#06B6D4",
};

function getSectorColor(sector: string): string {
  return SECTOR_COLOR[sector] ?? "#6B7280";
}

export default function TangoPage() {
  const [members, setMembers] = useState<TangoMember[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sector, setSector] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (region !== "All") params.set("region", region);
    if (sector !== "All") params.set("sector", sector);
    try {
      const res = await fetch(`/api/tango/members?${params}`);
      const data = await res.json();
      setMembers(data.members ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [search, region, sector]);

  useEffect(() => {
    const t = setTimeout(fetchMembers, 300);
    return () => clearTimeout(t);
  }, [fetchMembers]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2.5rem 1.5rem 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Civil Society · NGOs</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800 }}>
            🤝 TANGO NGO Directory — The Gambia
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: "62ch" }}>
            The Association of NGOs (TANGO) is the umbrella body for civil society organisations in The Gambia.
            Search member organisations by name, region, or sector.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 520 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NGO name or description…"
              style={{
                width: "100%", padding: "0.75rem 1rem 0.75rem 2.4rem",
                border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10,
                background: "rgba(255,255,255,0.12)", color: WHITE, fontSize: "0.9rem",
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Filters + count */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ padding: "0.55rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.82rem", fontFamily: "inherit", background: WHITE, color: DARK, fontWeight: 600, cursor: "pointer" }}
          >
            {REGIONS.map((r) => <option key={r} value={r}>{r === "All" ? "All Regions" : r}</option>)}
          </select>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ padding: "0.55rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.82rem", fontFamily: "inherit", background: WHITE, color: DARK, fontWeight: 600, cursor: "pointer" }}
          >
            {SECTORS.map((s) => <option key={s} value={s}>{s === "All" ? "All Sectors" : s}</option>)}
          </select>
          {(search || region !== "All" || sector !== "All") && (
            <button
              onClick={() => { setSearch(""); setRegion("All"); setSector("All"); }}
              style={{ padding: "0.5rem 0.85rem", border: "1.5px solid #E2E8F0", borderRadius: 8, background: WHITE, color: "#6B7280", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              ✕ Clear filters
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#6B7280", fontWeight: 600 }}>
            {loading ? "Loading…" : `${total} organisation${total !== 1 ? "s" : ""} found`}
          </span>
        </div>

        {/* Results grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", animation: "pulse 1.5s ease-in-out infinite" }}>
                <div style={{ height: 18, background: "#E2E8F0", borderRadius: 4, marginBottom: 10, width: "70%" }} />
                <div style={{ height: 12, background: "#E2E8F0", borderRadius: 4, marginBottom: 8, width: "40%" }} />
                <div style={{ height: 12, background: "#E2E8F0", borderRadius: 4, width: "90%" }} />
                <div style={{ height: 12, background: "#E2E8F0", borderRadius: 4, width: "80%", marginTop: 6 }} />
              </div>
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          </div>
        ) : members.length === 0 ? (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontWeight: 700, color: DARK, margin: "0 0 0.5rem" }}>No organisations found</p>
            <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {members.map((m) => {
              const expanded = expandedId === m.id;
              return (
                <div
                  key={m.id}
                  style={{
                    background: WHITE,
                    border: `1.5px solid ${expanded ? PRIMARY : "#E2E8F0"}`,
                    borderRadius: 12,
                    padding: "1.25rem",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxShadow: expanded ? "0 4px 20px rgba(27,77,62,0.12)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedId(expanded ? null : m.id)}
                >
                  {/* Name + region */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: DARK, lineHeight: 1.3, flex: 1 }}>{m.name}</div>
                    <span style={{ flexShrink: 0, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "#E8F5EF", color: PRIMARY, border: `1px solid ${PRIMARY}20`, whiteSpace: "nowrap" }}>
                      📍 {m.region}
                    </span>
                  </div>

                  {/* Sectors */}
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                    {m.sectors.slice(0, 3).map((s) => {
                      const c = getSectorColor(s);
                      return (
                        <span key={s} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: `${c}12`, color: c, border: `1px solid ${c}25` }}>
                          {s}
                        </span>
                      );
                    })}
                    {m.sectors.length > 3 && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#F3F4F6", color: "#6B7280" }}>+{m.sectors.length - 3}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.55 }}>
                    {expanded ? m.description : m.description.length > 100 ? m.description.substring(0, 100) + "…" : m.description}
                  </p>

                  {/* Expanded contact */}
                  {expanded && (
                    <div style={{ borderTop: "1px solid #F0F4F0", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <a href={`mailto:${m.contactEmail}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: "0.75rem", color: PRIMARY, textDecoration: "none", fontWeight: 600 }}>
                        ✉ {m.contactEmail}
                      </a>
                      <a href={`tel:${m.contactPhone}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: "0.75rem", color: "#374151", textDecoration: "none", fontWeight: 600 }}>
                        📞 {m.contactPhone}
                      </a>
                      <a href={m.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: "0.75rem", color: "#0891B2", textDecoration: "none", fontWeight: 600 }}>
                        🌐 {m.website.replace("https://", "")}
                      </a>
                      <a
                        href={`mailto:partnerships@fortisos.cloud?subject=Partnership Enquiry — ${encodeURIComponent(m.name)}&body=Hello,%0A%0AWe are interested in partnering with ${encodeURIComponent(m.name)} through FORTIS OS.%0A%0AOrganisation: ${encodeURIComponent(m.name)}%0ARegion: ${m.region}%0A%0APlease connect us. Thank you.`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          marginTop: "0.5rem", display: "block", textAlign: "center",
                          padding: "0.55rem", borderRadius: 8, background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`,
                          color: WHITE, fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                        }}
                      >
                        🤝 Partner With Us
                      </a>
                    </div>
                  )}

                  <div style={{ fontSize: "0.7rem", color: "#9CA3AF", textAlign: "right", marginTop: expanded ? 0 : "0.25rem" }}>
                    {expanded ? "▲ Less" : "▼ Contact & Partner"}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TANGO info box */}
        <div style={{
          marginTop: "2.5rem",
          background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`,
          borderRadius: 14, padding: "1.75rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem",
        }}>
          <div>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: "1rem", marginBottom: "0.25rem" }}>
              About TANGO
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", maxWidth: "55ch", lineHeight: 1.6 }}>
              The Association of NGOs in The Gambia (TANGO) is the national umbrella body for non-governmental organisations.
              It provides coordination, capacity building, advocacy and networking services to its members.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a href="mailto:tango@tango.gm" style={{ padding: "0.65rem 1.25rem", background: GOLD, color: DARK, borderRadius: 10, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", whiteSpace: "nowrap" }}>
              ✉ Contact TANGO
            </a>
            <Link href="/knowledge" style={{ padding: "0.65rem 1.25rem", border: "1.5px solid rgba(255,255,255,0.3)", color: WHITE, borderRadius: 10, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", whiteSpace: "nowrap" }}>
              ← Knowledge Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
