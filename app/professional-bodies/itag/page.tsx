"use client";

import { useState } from "react";
import Link from "next/link";

const T = {
  navy:      "#0D1B2A",
  navyLight: "#1A3A5F",
  gold:      "#C9A84C",
  goldLight: "rgba(201,168,76,0.15)",
  teal:      "#0C7B7A",
  white:     "#EEF2F7",
  muted:     "#7A8FA6",
  border:    "rgba(255,255,255,0.08)",
  green:     "#1B4D3E",
};

const ITAG = {
  name:        "Information Technology Association of The Gambia",
  shortName:   "ITAG",
  founded:     2004,
  website:     "https://itag.gm/",
  email:       "info@itag.gm",
  phone:       "+220 2184824",
  altPhone:    "+220 3984824",
  president:   "Beran Dondeh",
  members:     "200+ companies",
  keyEvent:    "ITAG ICT Expo (October)",
  description: "The official professional body for the ICT sector in The Gambia, recognised by the Ministry of Information and Communication Infrastructure (MoICI). ITAG promotes ICT growth, advocates for IT professionals, organises the annual ITAG ICT Expo, and facilitates collaboration between government, telcos, ISPs, universities, and international partners.",
  address:     "Senegambia, Kololi, Kanifing Municipality, The Gambia",
  lat:         13.4540,
  lng:         -16.7140,
};

// Free embed — no API key required
const mapFreeUrl = (q: string, z = 16) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`;

const streetViewUrl =
  `https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1s` +
  `CAoSLEFGMVFpcFBsYWNlaG9sZGVy!2m2!1d${ITAG.lat}!2d${ITAG.lng}` +
  `!3f210!4f10!5f0.7820865974627469`;

type View = "map" | "satellite" | "streetview";

export default function ITAGPage() {
  const [view, setView]           = useState<View>("map");
  const [origin, setOrigin]       = useState("");
  const [copied, setCopied]       = useState(false);

  const embedSrc =
    view === "map"
      ? mapFreeUrl(ITAG.address, 16)
      : view === "satellite"
      ? mapFreeUrl(`${ITAG.lat},${ITAG.lng}`, 18)
      : streetViewUrl;

  function getDirections() {
    if (!origin.trim()) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(ITAG.address)}`;
    window.open(url, "_blank");
  }

  function copyAddress() {
    navigator.clipboard.writeText(ITAG.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const infoCards = [
    { icon: "📅", label: "Founded",   value: String(ITAG.founded) },
    { icon: "👥", label: "Members",   value: ITAG.members },
    { icon: "🎯", label: "Key Event", value: ITAG.keyEvent },
    { icon: "👨‍💼", label: "President", value: ITAG.president },
  ];

  const views: { id: View; label: string }[] = [
    { id: "map",        label: "🗺️ Map View" },
    { id: "satellite",  label: "🛰️ Satellite" },
    { id: "streetview", label: "🎥 360° Street View" },
  ];

  return (
    <div style={{ padding: "24px", background: T.navy, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "20px", fontSize: "13px", color: T.muted }}>
          <Link href="/" style={{ color: T.muted, textDecoration: "none" }}>FORTIS OS</Link>
          {" / "}
          <Link href="/professional-bodies" style={{ color: T.muted, textDecoration: "none" }}>Professional Bodies</Link>
          {" / "}
          <span style={{ color: T.gold }}>ITAG</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", lineHeight: 1 }}>🖥️</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ color: T.gold, fontSize: "26px", margin: 0, fontWeight: 800 }}>
                {ITAG.name}
              </h1>
              <span style={{
                background: T.goldLight,
                color: T.gold,
                border: `1px solid ${T.gold}`,
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}>
                43rd INSTITUTION
              </span>
            </div>
            <p style={{ color: T.muted, margin: "6px 0 0", fontSize: "14px" }}>
              Official ICT professional body · Recognised by MoICI · Est. {ITAG.founded}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}>
          {infoCards.map(c => (
            <div key={c.label} style={{
              background: T.navyLight,
              padding: "16px",
              borderRadius: "12px",
              border: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ color: T.white, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
              <div style={{ color: T.gold, fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          background: T.navyLight,
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: `1px solid ${T.border}`,
        }}>
          <p style={{ color: T.muted, lineHeight: 1.75, margin: 0, fontSize: "15px" }}>
            {ITAG.description}
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: "10px 20px",
                background: view === v.id ? T.gold : "transparent",
                color:      view === v.id ? T.navy : T.white,
                border:     `1px solid ${view === v.id ? T.gold : T.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: view === v.id ? 700 : 400,
                fontSize: "14px",
                transition: "all 0.15s",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Map Iframe */}
        <div style={{
          background: T.navyLight,
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "24px",
          border: `1px solid ${T.border}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}>
          <iframe
            title="ITAG Location"
            src={embedSrc}
            width="100%"
            height="440"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Directions + Address */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

          {/* Directions */}
          <div style={{ background: T.navyLight, padding: "20px", borderRadius: "16px", border: `1px solid ${T.border}` }}>
            <h3 style={{ color: T.gold, margin: "0 0 14px", fontSize: "16px" }}>📍 Get Directions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                onKeyDown={e => e.key === "Enter" && getDirections()}
                placeholder="Enter your starting location"
                style={{
                  padding: "12px 14px",
                  background: T.navy,
                  border: `1px solid ${T.border}`,
                  borderRadius: "8px",
                  color: T.white,
                  fontSize: "14px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={getDirections}
                disabled={!origin.trim()}
                style={{
                  padding: "12px",
                  background: origin.trim() ? T.teal : T.muted,
                  color: T.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: origin.trim() ? "pointer" : "not-allowed",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Get Directions via Google Maps →
              </button>
            </div>
          </div>

          {/* Address */}
          <div style={{ background: T.navyLight, padding: "20px", borderRadius: "16px", border: `1px solid ${T.border}` }}>
            <h3 style={{ color: T.gold, margin: "0 0 14px", fontSize: "16px" }}>📋 Address & Contact</h3>
            <div style={{ color: T.muted, fontSize: "14px", lineHeight: 1.8, marginBottom: "14px" }}>
              <div>📍 {ITAG.address}</div>
              <div>📞 {ITAG.phone}</div>
              <div>📞 {ITAG.altPhone}</div>
              <div>📧 {ITAG.email}</div>
              <div>🌐 <a href={ITAG.website} target="_blank" rel="noopener noreferrer" style={{ color: T.gold }}>{ITAG.website}</a></div>
            </div>
            <button
              onClick={copyAddress}
              style={{
                padding: "8px 16px",
                background: T.goldLight,
                color: T.gold,
                border: `1px solid ${T.gold}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy Address"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
          <a
            href={ITAG.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, minWidth: "180px",
              background: T.gold,
              color: T.navy,
              padding: "14px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            🌐 Visit ITAG Website →
          </a>
          <a
            href={`mailto:${ITAG.email}`}
            style={{
              flex: 1, minWidth: "180px",
              background: T.navyLight,
              color: T.white,
              padding: "14px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              border: `1px solid ${T.border}`,
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            📧 Email ITAG
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ITAG.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, minWidth: "180px",
              background: "transparent",
              color: T.gold,
              padding: "14px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              border: `1px solid ${T.gold}`,
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            🗺️ Open in Google Maps
          </a>
        </div>

        {/* Back Link */}
        <div style={{ paddingBottom: "16px" }}>
          <Link
            href="/professional-bodies"
            style={{ color: T.muted, textDecoration: "none", fontSize: "14px" }}
          >
            ← Back to All Professional Bodies
          </Link>
        </div>

        {/* Ecosystem Footer */}
        <div style={{
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {[
            { href: "https://fortisos.cloud",          label: "⚙️ FORTIS OS" },
            { href: "https://discover.fortisos.cloud", label: "🇬🇲 Discover Gambia" },
            { href: "https://fortisinvicta.com",       label: "🏢 FORTIS CORPORATE" },
            { href: "https://itag.gm",                 label: "🖥️ ITAG Website" },
          ].map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
               style={{ color: T.gold, textDecoration: "none", fontSize: "14px" }}>
              {l.label}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
