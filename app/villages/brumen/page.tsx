"use client";

import Link from "next/link";
import { brumenVillage } from "../../../lib/villages/brumen";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

export default function BrumenVillagePage() {
  const v = brumenVillage;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff", padding: "52px 24px 40px", position: "relative", overflow: "hidden",
      }}>
        {/* Gambia flag stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: "#fff" }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌾</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>🇬🇲 {v.region}</span>
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📍 {v.district} District</span>
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>👥 {v.population}</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 46px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            {v.name}
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", opacity: 0.85, maxWidth: 520, margin: "0 auto 20px", lineHeight: 1.6 }}>
            {v.distanceFromBanjul} · Home of the Foni Jarrol Health Centre · Rice farming & groundnut cooperative community
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={v.streetViewUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", padding: "11px 22px", background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              🏙️ 360° Street View
            </a>
            <a href={v.directionsUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", padding: "11px 22px", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)" }}>
              🧭 Get Directions
            </a>
            <Link href="/contact"
              style={{ display: "inline-block", padding: "11px 22px", background: "transparent", color: "rgba(255,255,255,0.75)", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.2)" }}>
              📧 Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>

        {/* Embedded map */}
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: DARK }}>📍 Brumen Village Map</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{v.district} District, {v.region}</div>
            </div>
            <a href={v.streetViewUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: GOLD, color: DARK, padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
              🏙️ Open in Maps
            </a>
          </div>
          <div style={{ position: "relative", paddingBottom: "45%", height: 0 }}>
            <iframe
              src={v.mapEmbedUrl}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              loading="lazy"
              title="Brumen Village Map"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Key landmark */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `5px solid ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 32 }}>🏥</span>
            <div>
              <div style={{ fontWeight: 800, color: DARK, fontSize: 16 }}>{v.landmark.name}</div>
              <span style={{ background: "rgba(27,77,62,0.1)", color: G, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Primary Healthcare Facility</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>{v.landmark.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={`https://www.google.com/maps/place/${v.landmark.lat},${v.landmark.lng}/@${v.landmark.lat},${v.landmark.lng},17z/data=!3m1!1e3`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 800 }}>
              🏙️ 360° View
            </a>
            {v.landmark.phone && (
              <a href={`tel:${v.landmark.phone}`}
                style={{ background: "#F3F4F6", color: "#374151", padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                📞 {v.landmark.phone}
              </a>
            )}
          </div>
        </div>

        {/* Schools, Agriculture, Roads */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>

          {/* Schools */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid #1e40af` }}>
            <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 12 }}>📚 Schools</div>
            {v.schools.map((s, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{s.type}</div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>{s.description}</p>
                <a href={`https://www.google.com/maps/place/${s.lat},${s.lng}/@${s.lat},${s.lng},17z/data=!3m1!1e3`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: GOLD, fontWeight: 700, textDecoration: "none" }}>
                  🏙️ View Location →
                </a>
              </div>
            ))}
          </div>

          {/* Agriculture */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid #14532d` }}>
            <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 12 }}>🌾 Agriculture</div>
            {v.agriculture.map((a, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{a.type}</div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>{a.description}</p>
                <a href={`https://www.google.com/maps/place/${a.lat},${a.lng}/@${a.lat},${a.lng},17z/data=!3m1!1e3`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: GOLD, fontWeight: 700, textDecoration: "none" }}>
                  🏙️ View Location →
                </a>
              </div>
            ))}
          </div>

          {/* Infrastructure */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid #0C7B7A` }}>
            <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 12 }}>🛣️ Roads & Infrastructure</div>
            {v.roads.map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{r.type}</div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: 0 }}>{r.description}</p>
              </div>
            ))}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, color: DARK, fontSize: 13, marginBottom: 6 }}>🏘️ Nearby Villages</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {v.nearbyVillages.map((nv, i) => (
                  <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{nv}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Map CTA */}
        <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, border: "1.5px solid rgba(196,148,58,0.2)", borderRadius: 14, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: DARK, fontSize: 15, marginBottom: 8 }}>🗺️ Explore More of The Gambia</div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.6 }}>
            Brumen is one of hundreds of villages in The Gambia. Use the FORTIS OS discover map to explore communities, infrastructure, and services across all seven regions.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tourism/discover"
              style={{ display: "inline-block", padding: "9px 20px", background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              🗺️ Open Discover Map →
            </Link>
            <Link href="/contact"
              style={{ display: "inline-block", padding: "9px 20px", background: "transparent", color: DARK, borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none", border: `1.5px solid ${GOLD}` }}>
              📧 Add Your Village
            </Link>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Village data sourced from GBoS, MoH, and OpenStreetMap. For updates or corrections, <Link href="/contact" style={{ color: GOLD }}>contact us</Link>.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
