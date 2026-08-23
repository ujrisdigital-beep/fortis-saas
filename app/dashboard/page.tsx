"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const QUICK_ACTIONS = [
  { icon: "🚀", label: "Onboarding", desc: "Pilot checklist", href: "/onboarding", color: "#1B4D3E" },
  { icon: "📈", label: "GROW workspace", desc: "Advisory diagnostic", href: "/grow/workspace", color: "#0F766E" },
  { icon: "⚖️", label: "Ask UJRIS™", desc: "Document & legal analysis", href: "/ask-ujris", color: "#3B82F6" },
  { icon: "🎨", label: "IKENGA™", desc: "Generate social content", href: "/ikenga", color: "#8B5CF6" },
  { icon: "🗺️", label: "Tourism Map", desc: "Explore The Gambia", href: "/tourism/discover", color: "#10B981" },
  { icon: "🌍", label: "Tourism Explorer", desc: "Google Earth 3D view", href: "/tourism/explore", color: "#059669" },
  { icon: "🌱", label: "Soil & Crops", desc: "Crop suitability tool", href: "/soil-mapping", color: "#F59E0B" },
  { icon: "✈️", label: "Airport Live", desc: "Flight status", href: "/admin/airport-dashboard", color: "#06B6D4" },
  { icon: "🚨", label: "Emergency", desc: "Hospitals, police, fire", href: "/emergency", color: "#EF4444" },
  { icon: "🎓", label: "Training Hub", desc: "Free digital courses", href: "/training/hub", color: "#8B5CF6" },
  { icon: "🛍️", label: "Marketplace", desc: "Buy Gambia products", href: "/marketplace", color: "#EC4899" },
  { icon: "📊", label: "Data Portal", desc: "GBoS statistics", href: "/resources/gbos", color: "#6366F1" },
  { icon: "🏛️", label: "Government", desc: "Ministries & agencies", href: "/government", color: "#1E3A5F" },
  { icon: "🎓", label: "Verify Certificate", desc: "Check certificate ID", href: "/certificate/verify", color: "#C4943A" },
];

const STATS = [
  { icon: "📚", label: "Courses Started", value: "0" },
  { icon: "🏅", label: "Certificates", value: "0" },
  { icon: "🗺️", label: "Maps Explored", value: "0" },
  { icon: "🔄", label: "UJU Sessions", value: "0" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Open access — no redirect for unauthenticated users
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#F0F4F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
          <p style={{ color: G, fontWeight: 700, fontSize: 15 }}>Loading FORTIS OS…</p>
        </div>
      </div>
    );
  }

  // Show guest view for unauthenticated users — never return null
  const isAuthenticated = !!session?.user;
  const user = (session?.user ?? {}) as { name?: string; email?: string; role?: string };
  const userEmail = user.email ?? "guest@fortisos.cloud";
  const displayName = user.name ?? userEmail.split("@")[0];
  const initials = (displayName.charAt(0) || "G").toUpperCase();
  const roleLabel = user.role ?? (isAuthenticated ? "PUBLIC" : "GUEST");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Hero banner ────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 55%, #2A6B52 100%)`,
        padding: "2.5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(196,148,58,0.07)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>

            {/* Greeting */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 900, color: DARK, flexShrink: 0,
                boxShadow: "0 4px 16px rgba(196,148,58,0.35)",
              }}>
                {initials}
              </div>
              <div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500 }}>
                  {greeting} 👋
                </p>
                <h1 style={{ margin: "2px 0 0", color: "#fff", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
                  {displayName}
                </h1>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{userEmail}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(196,148,58,0.25)", color: GOLD, padding: "2px 7px", borderRadius: 999, letterSpacing: "0.08em" }}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" style={{ padding: "8px 18px", borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                  Sign in →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "-1.25rem auto 0", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12,
              padding: "1rem", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: G, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Quick access */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: DARK, margin: "0 0 1rem" }}>Quick Access</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12,
                  padding: "1rem", display: "flex", alignItems: "flex-start", gap: 10,
                  transition: "box-shadow 0.15s",
                  cursor: "pointer",
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{a.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: DARK, lineHeight: 1.2 }}>{a.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: 2, lineHeight: 1.4 }}>{a.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2-col: Recommended + Admin (if applicable) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>

          {/* Continue learning */}
          <section style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: DARK }}>🎓 Continue Learning</h2>
              <Link href="/training/hub" style={{ fontSize: 12, color: G, fontWeight: 600, textDecoration: "none" }}>View all courses →</Link>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 13 }}>
                You haven&apos;t started any courses yet.
              </p>
              <Link href="/training/hub" style={{
                display: "inline-block", marginTop: "0.75rem", padding: "0.55rem 1.25rem",
                background: `linear-gradient(135deg, ${G}, #2A6B52)`, color: "#fff",
                borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}>
                Browse free courses →
              </Link>
            </div>
          </section>

          {/* Admin links — CEO/SUPER_ADMIN only */}
          {(roleLabel === "CEO" || roleLabel === "SUPER_ADMIN") && (
            <section style={{ background: "#fff", border: `1.5px solid ${GOLD}40`, borderRadius: 16, padding: "1.5rem" }}>
              <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 800, color: DARK }}>🔐 Admin Panel</h2>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {[
                  { label: "AI Monitor", href: "/admin/ai-monitor" },
                  { label: "Airport Dashboard", href: "/admin/airport-dashboard" },
                  { label: "Escalations", href: "/admin/escalations" },
                  { label: "Data Sources", href: "/admin/data-sources" },
                  { label: "Training Hub", href: "/admin/training-hub" },
                  { label: "Legal Compliance", href: "/admin/legal" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} style={{
                    padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                    background: `${GOLD}12`, color: G, border: `1px solid ${GOLD}30`, textDecoration: "none",
                  }}>{l.label}</Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom CTA */}
        <section style={{
          marginTop: "2rem",
          background: `linear-gradient(135deg, ${DARK}, ${G})`,
          borderRadius: 16, padding: "1.75rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h3 style={{ margin: "0 0 0.25rem", color: "#fff", fontSize: "1.1rem", fontWeight: 800 }}>
              🇬🇲 Powered by FORTIS OS
            </h3>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              The national digital operating platform for The Gambia
            </p>
          </div>
          <Link href="/discover" style={{
            padding: "0.65rem 1.5rem", borderRadius: 9,
            background: `linear-gradient(135deg, ${GOLD}, #D4A855)`,
            color: DARK, fontWeight: 800, fontSize: 13, textDecoration: "none",
          }}>
            🌟 Discover Gambia →
          </Link>
        </section>

      </div>
    </div>
  );
}
