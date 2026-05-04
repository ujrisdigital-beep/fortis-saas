"use client";

import { useState } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const LOCATIONS = [
  {
    id: "headquarters",
    name: "GIEPA Headquarters",
    shortName: "Banjul HQ",
    address: "Investment House, 4 Nelson Mandela Street, Banjul",
    region: "Greater Banjul Area",
    lat: 13.4549,
    lng: -16.5775,
    hours: "Mon–Fri, 9:00 AM – 5:00 PM",
    phone: "+220 422 8888",
    email: "info@giepa.gm",
    web: "www.giepa.gm",
    description: "Main headquarters of the Gambia Investment & Export Promotion Agency. Handles all major investment inquiries, export documentation, incentive applications, and the One-Stop Shop for business registration.",
    services: ["Investment Registration", "Export Certification", "Incentive Applications", "One-Stop Shop", "PPP Advisory"],
    highlight: true,
  },
  {
    id: "serrekunda",
    name: "GIEPA Serrekunda Office",
    shortName: "Serrekunda",
    address: "Serrekunda Market Complex, Kanifing",
    region: "Kanifing Municipal Council",
    lat: 13.4385,
    lng: -16.6775,
    hours: "Mon–Fri, 9:00 AM – 5:00 PM",
    phone: "+220 422 8889",
    email: "serrekunda@giepa.gm",
    web: "www.giepa.gm",
    description: "Satellite office serving the Greater Banjul Area's largest commercial hub. Focus on SME support, export readiness, and market linkage for small businesses.",
    services: ["SME Registration", "Export Training", "Business Advisory", "Market Linkage"],
    highlight: false,
  },
  {
    id: "brikama",
    name: "GIEPA Brikama Office",
    shortName: "Brikama",
    address: "Regional Commercial Zone, Brikama",
    region: "West Coast Region",
    lat: 13.2714,
    lng: -16.6508,
    hours: "Mon–Fri, 9:00 AM – 5:00 PM",
    phone: "+220 422 8890",
    email: "brikama@giepa.gm",
    web: "www.giepa.gm",
    description: "Regional office supporting agricultural and manufacturing businesses in the West Coast Region. Key gateway for investors interested in agro-processing.",
    services: ["Agricultural Investment", "Manufacturing Support", "Export Guidance", "Agro-processing"],
    highlight: false,
  },
  {
    id: "basse",
    name: "GIEPA Basse Office",
    shortName: "Basse",
    address: "Basse Commercial Area, Upper River Region",
    region: "Upper River Region",
    lat: 13.4833,
    lng: -14.2167,
    hours: "Mon–Fri, 9:00 AM – 5:00 PM",
    phone: "+220 422 8891",
    email: "basse@giepa.gm",
    web: "www.giepa.gm",
    description: "Regional office supporting agricultural value chains and cross-border trade in The Gambia's easternmost region, bordering Senegal.",
    services: ["Agricultural Investment", "Cross-border Trade", "Farmer Cooperatives", "Agri Value Chains"],
    highlight: false,
  },
  {
    id: "janjangbureh",
    name: "GIEPA Janjangbureh Office",
    shortName: "Janjangbureh",
    address: "MacCarthy Island, Central River Region",
    region: "Central River Region",
    lat: 13.5333,
    lng: -14.7667,
    hours: "Mon–Thu, 9:00 AM – 5:00 PM",
    phone: "+220 422 8892",
    email: "janjangbureh@giepa.gm",
    web: "www.giepa.gm",
    description: "Regional office on historic MacCarthy Island, serving the Central River Region. Focus on agricultural value chains, eco-tourism investment, and river transport businesses.",
    services: ["Agribusiness Support", "Eco-tourism Investment", "Value Chain Development", "Export Readiness"],
    highlight: false,
  },
];

const INCENTIVES = [
  { icon: "🏦", title: "5-Year Tax Holiday", detail: "Full corporate tax exemption for qualifying new investments" },
  { icon: "⚙️", title: "Duty-Free Equipment", detail: "Import machinery, tools, and equipment without customs duties" },
  { icon: "💰", title: "Export Development Grant", detail: "Up to 50% of eligible export promotion costs covered" },
  { icon: "🚪", title: "One-Stop Shop", detail: "Business registration, permits, and approvals in one visit" },
  { icon: "🌱", title: "Agricultural Incentives", detail: "Subsidised land leases and input support for agri-investors" },
  { icon: "📡", title: "ICT Zone Benefits", detail: "Special incentives for tech companies and digital businesses" },
];

export default function GIEPAPage() {
  const [selected, setSelected] = useState(LOCATIONS[0]);
  const [tab, setTab] = useState<"map" | "street">("map");

  // Basic Google Maps embed — no API key required
  const mapEmbedUrl = `https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=16&output=embed`;
  // Google Maps Street View link (opens in new tab)
  const streetViewUrl = `https://www.google.com/maps/@${selected.lat},${selected.lng},3a,75y,90t/data=!3m1!1e3`;
  // Google Maps directions
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff",
        padding: "52px 24px 40px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🏢</div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            GIEPA Office Locations
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 600, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Gambia Investment &amp; Export Promotion Agency — 5 regional offices across The Gambia.
            Virtual map tour + investment incentives.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["📞 +220 422 8888", "📧 info@giepa.gm", "🌐 www.giepa.gm"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px" }}>

        {/* Location selector */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {LOCATIONS.map(loc => (
            <button
              key={loc.id}
              onClick={() => { setSelected(loc); setTab("map"); }}
              style={{
                padding: "10px 18px",
                borderRadius: 30,
                border: selected.id === loc.id ? `2px solid ${G}` : "2px solid #E5E7EB",
                background: selected.id === loc.id ? G : "#fff",
                color: selected.id === loc.id ? "#fff" : "#374151",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {loc.highlight ? "🏛️ " : "📍 "}{loc.shortName}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 40 }}>

          {/* Details panel */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>🏢</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: DARK }}>{selected.name}</h2>
                <span style={{ fontSize: 11, color: G, fontWeight: 700, background: `${G}15`, padding: "2px 8px", borderRadius: 30 }}>
                  {selected.region}
                </span>
              </div>
            </div>

            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>
              {selected.description}
            </p>

            {[
              { icon: "📍", label: selected.address },
              { icon: "⏰", label: selected.hours },
              { icon: "📞", label: selected.phone },
              { icon: "✉️", label: selected.email },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{row.label}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Services
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.services.map((s, i) => (
                  <span key={i} style={{ background: "#F3F4F6", color: "#374151", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: `linear-gradient(135deg, ${DARK}, ${G})`, color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
              >
                🗺️ Get Directions
              </a>
              <a
                href={streetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
              >
                🏙️ Street View
              </a>
            </div>
          </div>

          {/* Map panel */}
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            {/* Tab toggle */}
            <div style={{ display: "flex", borderBottom: "1px solid #F3F4F6", padding: "12px 16px", gap: 10 }}>
              {(["map", "street"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 30,
                    border: "none",
                    background: tab === t ? GOLD : "#F3F4F6",
                    color: tab === t ? DARK : "#6B7280",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {t === "map" ? "📍 Map View" : "🏙️ Street View"}
                </button>
              ))}
            </div>

            {tab === "map" ? (
              <div style={{ position: "relative", paddingBottom: "62%", height: 0 }}>
                <iframe
                  src={mapEmbedUrl}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  loading="lazy"
                  title={`Map — ${selected.name}`}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div style={{ padding: 28, textAlign: "center" }}>
                <div style={{
                  background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`,
                  borderRadius: 14,
                  padding: "40px 24px",
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🏙️</div>
                  <h3 style={{ color: "#fff", fontWeight: 800, margin: "0 0 8px", fontSize: 18 }}>
                    {selected.name}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5 }}>
                    {selected.address}
                  </p>
                  <a
                    href={streetViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: GOLD,
                      color: DARK,
                      padding: "12px 28px",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    Open 360° Street View in Google Maps ↗
                  </a>
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>
                  Street View opens Google Maps in a new tab. Drag to look around in 360°.
                  Coordinates: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* GIEPA Incentives */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 40, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: DARK, margin: "0 0 6px" }}>
            💰 GIEPA Investment Incentives
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>
            Benefits available to qualifying investors registering through any GIEPA office.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {INCENTIVES.map((inc, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${GOLD}08, ${GOLD}16)`,
                border: `1.5px solid ${GOLD}25`,
                borderRadius: 14,
                padding: "18px 16px",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{inc.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: DARK, marginBottom: 4 }}>{inc.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55 }}>{inc.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/investors" style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${DARK}, ${G})`,
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}>
              View Full Investment Guide →
            </Link>
            <Link href="/soil-mapping/salt-investment" style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
              color: DARK,
              padding: "12px 24px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}>
              🧂 Salt Investment Calculator →
            </Link>
          </div>
        </div>

        {/* All locations grid */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 18px" }}>
          🗺️ All GIEPA Offices
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
          {LOCATIONS.map(loc => (
            <div
              key={loc.id}
              onClick={() => { setSelected(loc); setTab("map"); window.scrollTo({ top: 300, behavior: "smooth" }); }}
              style={{
                background: selected.id === loc.id ? `linear-gradient(135deg, ${DARK}, ${G})` : "#fff",
                color: selected.id === loc.id ? "#fff" : DARK,
                borderRadius: 16,
                padding: "20px 18px",
                cursor: "pointer",
                border: selected.id === loc.id ? "none" : "1.5px solid #E5E7EB",
                transition: "all 0.15s",
                boxShadow: selected.id === loc.id ? "0 8px 24px rgba(10,46,26,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>🏢</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{loc.shortName}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 10 }}>{loc.region}</div>
              <div style={{ fontSize: 11, opacity: 0.6, lineHeight: 1.4 }}>{loc.address.split(",")[0]}</div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <Link href="/investors" style={{ color: GOLD, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            ← Back to Investment Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
