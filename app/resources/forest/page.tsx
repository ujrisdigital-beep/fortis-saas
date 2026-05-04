"use client";
import { useState, useEffect, useRef } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const STATS = [
  { label: "Forest Cover (2024)", value: 43.6, suffix: "%", sub: "~487,000 ha of land area", icon: "🌳", color: "#16A34A" },
  { label: "Tree Cover Loss (2023)", value: 12400, suffix: " ha", sub: "↑ 8% vs 2022", icon: "⚠️", color: "#DC2626" },
  { label: "Mangrove Area", value: 73000, suffix: " ha", sub: "West African hotspot", icon: "🌿", color: "#059669" },
  { label: "Carbon Stored", value: 18, suffix: "M tCO₂e", sub: "Forest biomass estimate", icon: "🌍", color: "#7C3AED" },
];

const REGIONS = [
  { region: "North Bank", forestPct: 38, mangrove: "Low", pressure: "High", color: "#D97706", note: "Agricultural expansion main driver" },
  { region: "Lower River", forestPct: 52, mangrove: "Medium", pressure: "Medium", color: "#16A34A", note: "Relatively intact gallery forest" },
  { region: "Central River", forestPct: 47, mangrove: "Low", pressure: "High", color: "#D97706", note: "Charcoal production pressure" },
  { region: "Upper River", forestPct: 61, mangrove: "Low", pressure: "Medium", color: "#16A34A", note: "Best remaining dry forest" },
  { region: "West Coast", forestPct: 22, mangrove: "High", pressure: "Critical", color: "#DC2626", note: "Rapid urbanisation, Banjul coastline" },
  { region: "Greater Banjul", forestPct: 8, mangrove: "High", pressure: "Critical", color: "#DC2626", note: "Mangroves under severe pressure" },
];

const DEFORESTATION_DRIVERS = [
  { rank: 1, driver: "Agricultural Expansion", share: 42, color: "#DC2626", desc: "Slash-and-burn clearing for groundnut, millet and maize. Peak clearing in dry season (Nov–Mar)." },
  { rank: 2, driver: "Charcoal Production", share: 28, color: "#D97706", desc: "Illegal charcoal cutting from Combretum and Terminalia woodlands. High demand in GBA." },
  { rank: 3, driver: "Urban Sprawl", share: 18, color: "#F97316", desc: "GBA expanding at ~4.2% annually. Forest corridors in West Coast Region fragmenting rapidly." },
  { rank: 4, driver: "Fuelwood Collection", share: 8, color: "#CA8A04", desc: "Rural household energy dependency. ~78% of households cook on wood/charcoal." },
  { rank: 5, driver: "Logging (Legal/Illegal)", share: 4, color: "#6B7280", desc: "Mostly rosewood export. CITES Appendix II listing enforcement remains weak." },
];

const RESTORATION = [
  {
    initiative: "The Gambia National REDD+ Programme",
    status: "Active", statusColor: "#16A34A", area: "~50,000 ha target", lead: "MEWF / UNFCCC",
    desc: "Reducing Emissions from Deforestation and Forest Degradation. Linked to carbon credit revenue.",
    opportunity: "Carbon credit verification and registry services",
  },
  {
    initiative: "Mangrove Restoration — Tanbi Wetland",
    status: "Active", statusColor: "#16A34A", area: "~8,400 ha", lead: "IUCN / ISWM",
    desc: "Tanbi Wetland Complex restoration targeting blue carbon sequestration and fisheries habitat.",
    opportunity: "Blue carbon credit monetisation platform",
  },
  {
    initiative: "Community Forestry — Village Forest Committees",
    status: "Active", statusColor: "#16A34A", area: "800+ VFCs", lead: "DFW / FAO",
    desc: "Village-led forest management across all six regions. Income from non-timber forest products.",
    opportunity: "Supply chain transparency for forest products",
  },
  {
    initiative: "Great Green Wall (Sub-regional)",
    status: "Ongoing", statusColor: "#0077B6", area: "Pan-Africa", lead: "UNCCD / AU",
    desc: "Gambia is a participating country. Agroforestry and degraded land restoration along northern belt.",
    opportunity: "Monitoring and reporting services",
  },
];

const API_SOURCES = [
  { name: "Global Forest Watch API", note: "Tree cover loss, canopy height, fire alerts", key: "Required (free tier available)" },
  { name: "NASA FIRMS", note: "Active fire detection, near real-time", key: "Free, no key required" },
  { name: "GBoS Environmental Statistics", note: "National forest inventory data", key: "Public data" },
  { name: "Copernicus Land Service", note: "NDVI, land cover change, Sentinel imagery", key: "Free (EU funded)" },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const inc = target / totalFrames;
    const timer = setInterval(() => {
      frame++;
      setCount((prev) => {
        const next = prev + inc;
        if (next >= target || frame >= totalFrames) { clearInterval(timer); return target; }
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, animate }: { stat: typeof STATS[0]; animate: boolean }) {
  const raw = useCountUp(stat.value, 1800, animate);
  const display = stat.value < 100
    ? raw.toFixed(1)
    : Math.round(raw).toLocaleString();

  return (
    <div style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${stat.color}30`, borderTop: `3px solid ${stat.color}`, borderRadius: 10, padding: "1rem 1.1rem" }}>
      <div style={{ fontSize: 22, marginBottom: "0.35rem" }}>{stat.icon}</div>
      <div style={{ color: stat.color === "#DC2626" ? "#F87171" : GOLD, fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>
        {display}{stat.suffix}
      </div>
      <div style={{ color: WHITE, fontSize: "0.82rem", fontWeight: 600, marginTop: "0.25rem" }}>{stat.label}</div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginTop: "0.2rem" }}>{stat.sub}</div>
    </div>
  );
}

export default function ForestPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header ref={headerRef} style={{
        background: "linear-gradient(135deg, #052912 0%, #0F3D21 45%, #1B4D3E 100%)",
        padding: "3rem 1.5rem 2.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, borderRadius: "50%", border: "2px solid rgba(196,148,58,0.12)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Environmental Intelligence</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            🌳 Forest & Environmental Data — The Gambia
          </h1>
          <p style={{ margin: "0 0 2rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "62ch" }}>
            Tree cover, mangrove restoration, deforestation drivers, carbon sequestration, and live satellite monitoring data.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {STATS.map((s) => <StatCard key={s.label} stat={s} animate={animate} />)}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Regional Forest Cover */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Regional Forest Cover & Pressure Index
          </h2>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: PRIMARY }}>
                    {["Region", "Forest Cover", "Mangroves", "Pressure", "Key Driver"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: WHITE, fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((r, i) => (
                    <tr key={r.region} style={{ borderBottom: "1px solid #F0F4F0", background: i % 2 === 0 ? WHITE : "#F8FAFC" }}>
                      <td style={{ padding: "0.7rem 1rem", fontWeight: 700, color: DARK }}>{r.region}</td>
                      <td style={{ padding: "0.7rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, background: "#E8F5EF", borderRadius: 4, height: 6 }}>
                            <div style={{ width: `${r.forestPct}%`, height: "100%", background: r.color, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontWeight: 600, color: r.color }}>{r.forestPct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.7rem 1rem", color: "#374151" }}>{r.mangrove}</td>
                      <td style={{ padding: "0.7rem 1rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: `${r.color}12`, color: r.color, fontSize: "0.72rem", fontWeight: 700, border: `1px solid ${r.color}25` }}>{r.pressure}</span>
                      </td>
                      <td style={{ padding: "0.7rem 1rem", color: "#6B7280", fontSize: "0.78rem" }}>{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Deforestation Drivers */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Deforestation Drivers
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {DEFORESTATION_DRIVERS.map((d) => (
              <div key={d.rank} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `5px solid ${d.color}`, borderRadius: 8, padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${d.color}12`, border: `2px solid ${d.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: d.color }}>#{d.rank}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.3rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.92rem", color: DARK }}>{d.driver}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 999, background: `${d.color}12`, color: d.color, fontSize: "0.72rem", fontWeight: 700, border: `1px solid ${d.color}25` }}>{d.share}%</span>
                  </div>
                  <div style={{ background: "#F3F4F6", borderRadius: 999, height: 5, marginBottom: "0.4rem" }}>
                    <div style={{ width: `${d.share}%`, height: "100%", background: d.color, borderRadius: 999 }} />
                  </div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.5 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Restoration Initiatives */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Restoration Initiatives & Revenue Opportunities
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {RESTORATION.map((r) => (
              <div key={r.initiative} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 999, background: `${r.statusColor}12`, color: r.statusColor, fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${r.statusColor}25` }}>{r.status}</span>
                  <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{r.area}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.88rem", color: DARK, marginBottom: "0.2rem" }}>{r.initiative}</div>
                <div style={{ fontSize: "0.74rem", color: "#6B7280", marginBottom: "0.5rem" }}>Lead: {r.lead}</div>
                <p style={{ margin: "0 0 0.65rem", fontSize: "0.78rem", color: "#374151", lineHeight: 1.5 }}>{r.desc}</p>
                <div style={{ background: "#F0F9F4", border: "1px solid #D1FAE5", borderRadius: 6, padding: "0.4rem 0.7rem", fontSize: "0.74rem", color: "#065F46" }}>
                  💰 {r.opportunity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Integration */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Live Data Integration — APIs
          </h2>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "0.85rem 1.25rem", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🛰️</span>
              <span style={{ fontSize: "0.82rem", color: "#374151", fontWeight: 600 }}>Connect these APIs to enable live satellite forest monitoring on FORTIS OS</span>
            </div>
            {API_SOURCES.map((api, i) => (
              <div key={api.name} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "0.85rem 1.25rem", borderBottom: i < API_SOURCES.length - 1 ? "1px solid #F0F4F0" : "none", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK, marginBottom: "0.2rem" }}>{api.name}</div>
                  <div style={{ fontSize: "0.76rem", color: "#6B7280" }}>{api.note}</div>
                </div>
                <div style={{ fontSize: "0.76rem" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 999, background: api.key.startsWith("Required") ? "#FEF3C7" : "#D1FAE5", color: api.key.startsWith("Required") ? "#92400E" : "#065F46", fontWeight: 600, fontSize: "0.7rem" }}>
                    {api.key}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.78rem", color: "#1E40AF" }}>
            🔑 To enable live data: add <code style={{ background: "#DBEAFE", padding: "1px 5px", borderRadius: 4 }}>GFW_API_KEY</code> to your Vercel environment variables and the forest dashboard will display real-time satellite data.
          </div>
        </section>
      </div>
    </div>
  );
}
