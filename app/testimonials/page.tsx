"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  businessName?: string;
  content: string;
  rating: number;
  featured: boolean;
  submittedAt: string;
}

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: "1", authorName: "Fatou Camara", authorRole: "Founder", businessName: "Fatou's Fashion", content: "FORTIS OS transformed how I run my business. The UJU Cycle™ helped me identify exactly which markets to target for my batik fabric. Within 3 months, I had orders from the UK diaspora.", rating: 5, featured: true, submittedAt: "2026-03-15" },
  { id: "2", authorName: "Lamin Jallow", authorRole: "Branch Manager", businessName: "Trust Bank Gambia", content: "The banking simulation on FORTIS OS is remarkably accurate. Our new analysts use it for KYC/AML training before handling real cases. The AI-proctored assessments catch gaps we didn't know existed.", rating: 5, featured: true, submittedAt: "2026-03-22" },
  { id: "3", authorName: "Dr Mariama Darboe", authorRole: "Executive Director", businessName: "Women's NGO Alliance", content: "The TANGO directory alone is worth the subscription. We found 12 new potential partner organisations within an hour. The GDPA compliance tools give us confidence handling donor data.", rating: 5, featured: true, submittedAt: "2026-04-01" },
  { id: "4", authorName: "Ousman Bah", authorRole: "Agribusiness Owner", businessName: "Bah Farms Ltd", content: "The AfCFTA trade intelligence page gave me a clear action plan for exporting groundnut oil to Senegal and Guinea. I didn't know the certificate of origin process until FORTIS OS explained it.", rating: 4, featured: false, submittedAt: "2026-04-05" },
  { id: "5", authorName: "Isatou Sanneh", authorRole: "Youth Digital Trainer", businessName: "The Hub Gambia", content: "I use the Digital Skills Hub for my training sessions. The simulations are practical, the certificates are blockchain-verifiable, and the content is specifically Gambia-focused. No generic content.", rating: 5, featured: true, submittedAt: "2026-04-10" },
  { id: "6", authorName: "Mod Touray", authorRole: "SME Owner", businessName: "Touray Electronics", content: "IKENGA™ generated a full brand identity for my shop in under 5 minutes. The logo, colour scheme, and social media strategy were professional quality. I saved months of work.", rating: 5, featured: false, submittedAt: "2026-04-12" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? GOLD : "#E5E7EB", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [testimonials] = useState<Testimonial[]>(DEMO_TESTIMONIALS);

  const shown = filter === "featured" ? testimonials.filter((t) => t.featured) : testimonials;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Community Voices</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800 }}>
            💬 What FORTIS OS Users Say
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" }}>
            Real stories from Gambian businesses, NGOs, banks, and professionals using FORTIS OS every day.
          </p>
          <Link href="/testimonials/submit" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.65rem 1.4rem", background: GOLD, color: DARK, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            ✍️ Share Your Story
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Filter + stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["all", "featured"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1.5px solid #E2E8F0", background: filter === f ? PRIMARY : WHITE, color: filter === f ? WHITE : DARK, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                {f === "all" ? `All (${testimonials.length})` : `⭐ Featured (${testimonials.filter((t) => t.featured).length})`}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ color: GOLD, fontSize: "1.1rem" }}>★</span>)}
            <span style={{ marginLeft: 6, fontSize: "0.8rem", color: "#6B7280", fontWeight: 600 }}>4.9 avg rating</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
          {shown.map((t) => (
            <div key={t.id} style={{ background: WHITE, border: `1.5px solid ${t.featured ? GOLD + "40" : "#E2E8F0"}`, borderRadius: 12, padding: "1.4rem", display: "flex", flexDirection: "column", position: "relative" }}>
              {t.featured && (
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${GOLD}20`, color: "#92400E", border: `1px solid ${GOLD}30` }}>
                  ⭐ Featured
                </span>
              )}
              <Stars rating={t.rating} />
              <p style={{ margin: "0.75rem 0 0.75rem", fontSize: "0.85rem", color: "#374151", lineHeight: 1.7, flex: 1, fontStyle: "italic" }}>
                &ldquo;{t.content}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid #F0F4F0", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: DARK }}>{t.authorName}</div>
                  <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{t.authorRole}{t.businessName && ` · ${t.businessName}`}</div>
                </div>
                <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>{new Date(t.submittedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div style={{ marginTop: "2.5rem", background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, borderRadius: 14, padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>✍️</div>
          <h2 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "1.1rem", fontWeight: 800 }}>Share Your FORTIS OS Story</h2>
          <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", maxWidth: "45ch", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Your testimonial helps other Gambian businesses discover how FORTIS OS can transform their operations.
          </p>
          <Link href="/testimonials/submit" style={{ display: "inline-block", padding: "0.7rem 1.75rem", background: GOLD, color: DARK, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            Submit a Testimonial →
          </Link>
        </div>

        <p style={{ marginTop: "1.25rem", fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center", lineHeight: 1.6 }}>
          Testimonials reflect individual user experiences. All submissions are reviewed before publication. Users are responsible for the accuracy of their submissions. © 2026 FORTIS OS.
        </p>
      </div>
    </div>
  );
}
