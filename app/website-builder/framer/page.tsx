"use client";
// app/website-builder/framer/page.tsx
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const TIPS = [
  {
    icon: "🇬🇲",
    title: "Gambia Colors",
    body: "Use Gambia Green (#1B4D3E) and Gold (#C4943A) to build instant brand trust with local and diaspora audiences.",
  },
  {
    icon: "📱",
    title: "Mobile-First",
    body: "Over 85% of Gambians browse on mobile. Framer auto-optimises every layout for small screens — no extra work needed.",
  },
  {
    icon: "🚀",
    title: "Free Hosting",
    body: "Framer includes free hosting on a `.framer.app` subdomain. Upgrade to connect your custom `.gm` or `.com` domain.",
  },
  {
    icon: "🌐",
    title: "Custom Domain",
    body: "Connect `yourbrand.com` or `yourbrand.gm` in minutes. Framer handles SSL certificates automatically.",
  },
];

function FramerPageInner() {
  const params   = useSearchParams();
  const brand    = params.get("brand")   ?? "Your Brand";
  const tagline  = params.get("tagline") ?? "Built with FORTIS OS · Powered by Framer";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2rem 1.5rem 1.75rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Gambia flag stripe */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>

        {/* Gold decorative ring */}
        <div style={{
          position: "absolute", right: -48, top: -48,
          width: 220, height: 220, borderRadius: "50%",
          border: `2px solid rgba(196,148,58,0.18)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: -20, top: -20,
          width: 140, height: 140, borderRadius: "50%",
          border: `1.5px solid rgba(196,148,58,0.28)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Back link */}
          <a href="/website-builder" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,0.65)", fontSize: 13, textDecoration: "none",
            marginBottom: "1rem",
          }}>
            ← Back to Website Builder
          </a>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(196,148,58,0.18)", border: "1px solid rgba(196,148,58,0.35)",
                borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem",
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Professional Builder
                </span>
              </div>
              <h1 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>
                {brand}
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>
                {tagline}
              </p>
            </div>

            {/* FI emblem */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", border: `2px solid ${GOLD}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700, fontSize: 18, color: GOLD, flexShrink: 0,
            }}>
              FI
            </div>
          </div>
        </div>
      </header>

      {/* AI Tips Banner */}
      <div style={{
        background: `linear-gradient(90deg, ${PRIMARY} 0%, #2A6B52 100%)`,
        padding: "0.65rem 1.5rem",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: 13 }}>
            <strong style={{ color: WHITE }}>AI Tip:</strong> Use your brand name &ldquo;<strong style={{ color: GOLD }}>{brand}</strong>&rdquo; as your Framer project title. Add your logo and Gambia Green palette for instant brand consistency.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>

        {/* Open fullscreen link */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <a
            href="https://www.framer.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "0.45rem 0.9rem",
              background: WHITE, border: `1.5px solid #E2E8F0`,
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              color: PRIMARY, textDecoration: "none",
            }}
          >
            ↗ Open Framer Full Screen
          </a>
        </div>

        {/* Framer Launch Panel — iframe blocked by Framer's X-Frame-Options policy */}
        <div style={{
          background: "linear-gradient(135deg, #0F1A0F 0%, #1B3020 100%)",
          borderRadius: 16,
          border: "1.5px solid rgba(196,148,58,0.25)",
          padding: "3rem 2rem",
          textAlign: "center",
          marginBottom: "2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background rings */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(196,148,58,0.08)" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(196,148,58,0.12)" }} />
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 52, marginBottom: "1rem" }}>⚡</div>
            <h2 style={{ color: WHITE, fontWeight: 800, fontSize: "1.4rem", margin: "0 0 0.75rem" }}>
              Launch Framer Builder
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Framer&apos;s professional builder opens in its own tab for the best experience.
              Start from 1,000+ templates and publish your Gambian business site in minutes.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://www.framer.com/templates/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "0.75rem 1.75rem",
                  background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
                  color: DARK, borderRadius: 10, fontWeight: 800, fontSize: "0.95rem",
                  textDecoration: "none", boxShadow: "0 4px 16px rgba(196,148,58,0.35)",
                }}
              >
                🚀 Open Framer Builder
              </a>
              <a
                href="https://www.framer.com/templates/?tag=business"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "0.75rem 1.75rem",
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  color: WHITE, borderRadius: 10, fontWeight: 700, fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Browse Templates
              </a>
            </div>
          </div>
        </div>

        {/* Quick Tips Grid */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY,
          }}>
            Quick Tips for Gambian Businesses
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}>
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                style={{
                  background: WHITE,
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "1rem 1.1rem",
                  transition: "box-shadow 0.18s",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: "0.5rem" }}>{tip.icon}</div>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "0.9rem", fontWeight: 700, color: PRIMARY }}>
                  {tip.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#4B5563", lineHeight: 1.6 }}>
                  {tip.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`,
          borderRadius: 12,
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div>
            <p style={{ margin: "0 0 0.2rem", color: WHITE, fontWeight: 700, fontSize: "1rem" }}>
              Need a fully custom website?
            </p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
              Our team at FORTIS INVICTA LTD can build it for you — end-to-end.
            </p>
          </div>
          <a
            href="mailto:legal@fortisos.gm?subject=Custom Website Enquiry"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.2rem",
              background: GOLD,
              color: DARK,
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.88rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Contact FORTIS INVICTA LTD →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FramerPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F0F4F0", fontFamily: "system-ui, sans-serif",
      }}>
        <p style={{ color: "#1B4D3E", fontWeight: 600 }}>Loading…</p>
      </div>
    }>
      <FramerPageInner />
    </Suspense>
  );
}
