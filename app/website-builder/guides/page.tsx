"use client";

import Link from "next/link";

const DARK = "#0A2E1A";
const G = "#1B4D3E";
const GOLD = "#C4943A";

const BUILDERS = [
  {
    rank: 1,
    name: "Wix",
    badge: "🥇 Best Overall",
    badgeColor: "#D4AF37",
    url: "https://www.wix.com",
    logo: "🌐",
    tagline: "900+ templates · AI site generator · Industry-leading editor",
    rating: 4.5,
    free: {
      storage: "500MB",
      bandwidth: "500MB",
      pages: "Unlimited",
      ads: true,
      customDomain: false,
    },
    paid: "~$17/month",
    bestFor: "Small businesses, portfolios, restaurants",
    gambiaSuitability: 5,
    pros: ["900+ professional templates", "AI text & image generation", "Excellent mobile editor", "App marketplace (hundreds of widgets)", "SEO toolkit + Google Search Console"],
    cons: ["Free plan shows Wix ads", "No custom domain (free)", "500MB bandwidth (~500 visitors/month)"],
    aiFeatures: "ADI (Artificial Design Intelligence) — generates complete site in 2 minutes",
    steps: [
      "Go to wix.com — click Get Started",
      "Sign up (no credit card required)",
      "Select 'Let AI create your site'",
      "Enter business name + description",
      "Set colours to Gambia Green (#1B4D3E) + Gold (#C4943A)",
      "Publish — live in under 10 minutes",
    ],
  },
  {
    rank: 2,
    name: "Webador",
    badge: "🏅 Best Unlimited Free",
    badgeColor: "#6B7280",
    url: "https://www.webador.com",
    logo: "🔵",
    tagline: "Unlimited storage · Unlimited traffic · Fast AI generator",
    rating: 4.2,
    free: {
      storage: "Unlimited",
      bandwidth: "Unlimited",
      pages: "Unlimited",
      ads: true,
      customDomain: false,
    },
    paid: "~$8/month",
    bestFor: "NGOs, community groups, growing businesses",
    gambiaSuitability: 5,
    pros: ["Truly unlimited storage & traffic", "No page limits", "Fast AI site generator", "Clean templates", "4.5/5 Trustpilot (11,000+ reviews)"],
    cons: ["Webador footer branding (small)", "No custom domain on free tier", "Limited app integrations"],
    aiFeatures: "AI site builder generates full structure from business description",
    steps: [
      "Go to webador.com — click Start for free",
      "Sign up with email",
      "Choose template category",
      "AI generates site structure",
      "Edit content, add unlimited pages",
      "Publish → yourname.webador.com",
    ],
  },
  {
    rank: 3,
    name: "GoDaddy Websites",
    badge: "🥉 Best for Marketing",
    badgeColor: "#CD7F32",
    url: "https://www.godaddy.com/websites/website-builder",
    logo: "🟢",
    tagline: "Unlimited storage + bandwidth · Advanced SEO · Marketing tools",
    rating: 4.0,
    free: {
      storage: "Unlimited",
      bandwidth: "Unlimited",
      pages: "Unlimited",
      ads: true,
      customDomain: false,
    },
    paid: "~$10/month",
    bestFor: "Service businesses, marketing-focused sites",
    gambiaSuitability: 4,
    pros: ["Unlimited storage & bandwidth even free", "Built-in email marketing (200/mo)", "Social media scheduling", "Strong SEO tools", "Airo AI for content creation"],
    cons: ["Footer ad on free tier", "Templates less flexible than Wix", "GoDaddy domain required"],
    aiFeatures: "Airo AI — domain name generation, content creation, marketing copy",
    steps: [
      "Go to godaddy.com/websites/website-builder",
      "Click Get Started Free",
      "Sign up or use Google account",
      "Choose industry + business name",
      "Airo AI generates site content",
      "Customise + publish",
    ],
  },
  {
    rank: 4,
    name: "Webflow",
    badge: "🎨 Best for Designers",
    badgeColor: "#4F46E5",
    url: "https://webflow.com",
    logo: "🔷",
    tagline: "Pixel-perfect design · CMS built-in · Advanced animations",
    rating: 3.5,
    free: {
      storage: "N/A",
      bandwidth: "Limited",
      pages: "2 pages",
      ads: false,
      customDomain: false,
    },
    paid: "~$15/month",
    bestFor: "Designers, creative agencies, portfolios",
    gambiaSuitability: 3,
    pros: ["Pixel-perfect design control", "3D transforms + scroll animations", "Built-in CMS", "Strong designer community", "No ads on free plan"],
    cons: ["Only 2 pages on free tier", "Steep learning curve", "Not suitable for beginners"],
    aiFeatures: "Webflow App Gen for custom app creation",
    steps: [
      "Go to webflow.com — Get started free",
      "Sign up (no credit card)",
      "Choose a template",
      "Use the visual editor (drag-and-drop)",
      "Build up to 2 pages free",
      "Upgrade for more pages + domain",
    ],
  },
];

const COMPARISON = [
  { feature: "Free Storage", wix: "500MB", webador: "Unlimited", godaddy: "Unlimited", webflow: "N/A" },
  { feature: "Free Bandwidth", wix: "500MB", webador: "Unlimited", godaddy: "Unlimited", webflow: "Limited" },
  { feature: "Free Pages", wix: "Unlimited", webador: "Unlimited", godaddy: "Unlimited", webflow: "2 only" },
  { feature: "Ads on Free", wix: "Yes", webador: "Small", godaddy: "Small", webflow: "No" },
  { feature: "AI Site Builder", wix: "✓ Excellent", webador: "✓ Good", godaddy: "✓ Good", webflow: "✓ Basic" },
  { feature: "Mobile Editor", wix: "✓ Excellent", webador: "✓ Good", godaddy: "✓ Good", webflow: "✓ Advanced" },
  { feature: "SEO Tools", wix: "✓ Advanced", webador: "✓ Basic", godaddy: "✓ Advanced", webflow: "✓ Advanced" },
  { feature: "E-commerce", wix: "Paid only", webador: "Paid only", godaddy: "Paid only", webflow: "Paid only" },
  { feature: "Templates", wix: "900+", webador: "50+", godaddy: "100+", webflow: "100+" },
  { feature: "Gambia Suitability", wix: "⭐⭐⭐⭐⭐", webador: "⭐⭐⭐⭐⭐", godaddy: "⭐⭐⭐⭐", webflow: "⭐⭐⭐" },
];

const USER_MATRIX = [
  { type: "Small Business Owner", rec1: "Wix", rec2: "GoDaddy", icon: "🏪" },
  { type: "Freelancer / Portfolio", rec1: "Wix", rec2: "Webflow", icon: "💼" },
  { type: "NGO / Community Group", rec1: "Webador", rec2: "GoDaddy", icon: "🤝" },
  { type: "Restaurant / Café", rec1: "Wix", rec2: "GoDaddy", icon: "🍽️" },
  { type: "Creative Agency", rec1: "Webflow", rec2: "Wix", icon: "🎨" },
  { type: "Unlimited Pages Needed", rec1: "Webador", rec2: "GoDaddy", icon: "📄" },
];

export default function WebsiteBuilderGuidesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2E7D64 100%)`, padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link href="/website-builder" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Website Builder</Link>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, margin: "8px 0 4px" }}>
            🌐 Free Website Builders for Gambian Businesses
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "0 0 1.25rem" }}>
            Tyler Wise 10-AI Protocol · Ranked by professional quality, free tier value, and Gambia suitability
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(196,148,58,0.2)", border: "1px solid rgba(196,148,58,0.4)", borderRadius: 999, padding: "4px 14px" }}>
            <span style={{ fontSize: 12 }}>🏆</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>Recommended: Wix (Most) · Webador (Unlimited)</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem" }}>

        {/* Tyler Wise verdict */}
        <div style={{ background: `linear-gradient(135deg, rgba(196,148,58,0.08), rgba(27,77,62,0.06))`, border: "1px solid rgba(196,148,58,0.3)", borderRadius: 16, padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 4 }}>Tyler Wise — 10-AI Protocol Verdict</div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: 0 }}>
                "Wix is the undisputed king of free website builders. Its 900+ templates, AI tools, and intuitive interface make it accessible to anyone. For Gambian businesses, the mobile optimisation and local customisation options are excellent. However, for organisations needing unlimited pages and traffic, Webador offers a truly generous free tier. Start with Wix for professional quality — migrate to paid when you outgrow the limits."
              </p>
            </div>
          </div>
        </div>

        {/* Builder cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "1.5rem" }}>
          {BUILDERS.map((b) => (
            <div key={b.name} style={{ background: "#fff", borderRadius: 16, border: `2px solid ${b.rank === 1 ? GOLD : "#e5e7eb"}`, overflow: "hidden" }}>
              {b.rank === 1 && <div style={{ background: `linear-gradient(90deg, ${GOLD}, #D4A855)`, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: DARK }}>★ TOP RECOMMENDATION FOR GAMBIAN BUSINESSES</div>}
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{b.logo}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <h2 style={{ fontWeight: 900, color: DARK, fontSize: 18, margin: 0 }}>{b.name}</h2>
                        <span style={{ background: b.badgeColor + "20", color: b.badgeColor, borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 800 }}>{b.badge}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#555", margin: 0 }}>{b.tagline}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Cheapest paid</div>
                    <div style={{ fontWeight: 800, color: DARK }}>{b.paid}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Gambia fit: {"⭐".repeat(b.gambiaSuitability)}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: "1rem" }}>
                  {/* Free tier */}
                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 }}>Free Tier</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                      {[
                        { k: "Storage", v: b.free.storage },
                        { k: "Bandwidth", v: b.free.bandwidth },
                        { k: "Pages", v: b.free.pages },
                        { k: "Ads", v: b.free.ads ? "Yes (removable paid)" : "No ads" },
                        { k: "Custom Domain", v: b.free.customDomain ? "Included" : "Paid only" },
                      ].map(({ k, v }) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#9ca3af" }}>{k}</span>
                          <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pros */}
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#065f46", textTransform: "uppercase", marginBottom: 8 }}>Pros</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      {b.pros.map(p => (
                        <li key={p} style={{ fontSize: 12, color: "#555", display: "flex", gap: 6 }}>
                          <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Setup steps */}
                  <div style={{ background: "rgba(27,77,62,0.04)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", marginBottom: 8 }}>Setup Steps</div>
                    <ol style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                      {b.steps.map((s, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#555" }}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    <strong style={{ color: DARK }}>AI Feature:</strong> {b.aiFeatures}
                  </div>
                  <a href={b.url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "9px 20px", background: b.rank === 1 ? GOLD : G, color: b.rank === 1 ? DARK : "#fff", borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                    Open {b.name} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6" }}>
            <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0 }}>📊 Side-by-Side Comparison</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Feature", "Wix", "Webador", "GoDaddy", "Webflow"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: i === 0 ? "left" : "center", fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 600, color: DARK }}>{row.feature}</td>
                    {[row.wix, row.webador, row.godaddy, row.webflow].map((v, j) => (
                      <td key={j} style={{ padding: "9px 14px", textAlign: "center", color: "#555", fontSize: 12 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User matrix */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 1rem" }}>👤 Which Builder for Your Business Type?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {USER_MATRIX.map(({ type, rec1, rec2, icon }) => (
              <div key={type} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontWeight: 700, color: DARK, fontSize: 13, marginBottom: 6 }}>{type}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ background: GOLD + "20", color: DARK, borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 800 }}>🥇 {rec1}</span>
                  <span style={{ background: "#f3f4f6", color: "#555", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>Alt: {rec2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, borderRadius: 16, padding: "2rem", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
          <h2 style={{ fontWeight: 900, fontSize: "1.4rem", margin: "0 0 8px" }}>Want FORTIS OS to Build It For You?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginBottom: "1.5rem", maxWidth: "50ch", margin: "0 auto 1.5rem" }}>
            Our Website Builder tool auto-generates a professional website with Gambia Green branding, WhatsApp integration, and FORTIS OS embeds.
          </p>
          <Link href="/website-builder" style={{ display: "inline-block", padding: "12px 28px", background: GOLD, color: DARK, borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>
            Launch FORTIS Website Builder →
          </Link>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "2rem" }}>
          Tyler Wise 10-AI Protocol · Data sources: PCMag, CNET, Gizmodo, Trustpilot · © FORTIS INVICTA LTD {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
