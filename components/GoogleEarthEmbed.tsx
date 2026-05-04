"use client";

import { useState } from "react";

interface GoogleEarthEmbedProps {
  lat: number;
  lng: number;
  name: string;
  zoom?: number;
  height?: string;
  alt?: number;   // altitude in metres for Google Earth URL
}

export default function GoogleEarthEmbed({
  lat,
  lng,
  name,
  zoom = 18,
  height = "400px",
  alt = 500,
}: GoogleEarthEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  // No-API-key satellite embed (t=k = satellite/terrain)
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed`;

  // Google Earth web link (full 3D — opens in new tab)
  const earthWebUrl = `https://earth.google.com/web/@${lat},${lng},${alt}a,500d,35y,0h,45t,0r`;

  // Street-level 360° link
  const streetViewUrl = `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z/data=!3m1!1e3`;

  // Directions
  const directionsUrl = `https://www.google.com/maps/dir//${lat},${lng}`;

  const GOLD = "#C4943A";
  const DARK = "#0A2E1A";

  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: 0, overflow: "hidden" }}>
      {isLoading && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0D1117 0%, #1a1f2e 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1,
        }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
            <p style={{ fontSize: 14, opacity: 0.7 }}>Loading satellite view…</p>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        style={{ width: "100%", height: "100%", border: 0 }}
        allowFullScreen
        loading="lazy"
        title={`Satellite view — ${name}`}
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
      />

      {/* Action overlay */}
      <div style={{
        position: "absolute", bottom: 12, left: 12, right: 12,
        display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
      }}>
        <a href={earthWebUrl} target="_blank" rel="noopener noreferrer"
          style={{ background: "rgba(0,0,0,0.75)", color: "#fff", padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none", backdropFilter: "blur(4px)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          🌍 Open in Google Earth 3D
        </a>
        <a href={streetViewUrl} target="_blank" rel="noopener noreferrer"
          style={{ background: `rgba(196,148,58,0.9)`, color: DARK, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none", backdropFilter: "blur(4px)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          🏙️ 360° Street View
        </a>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
          style={{ background: "rgba(0,0,0,0.75)", color: "#fff", padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          🧭 Directions
        </a>
      </div>
    </div>
  );
}
