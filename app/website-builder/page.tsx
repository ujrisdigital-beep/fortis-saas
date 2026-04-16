"use client";

import { useState, useRef } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

const INDUSTRIES = ["Retail", "Services", "Food & Restaurant", "Technology", "Agriculture", "Healthcare", "Education", "Construction", "Tourism", "Other"];

const PALETTES = [
  { name: "Gambia Green/Gold", primary: "#1B4D3E", secondary: "#D4AF37", text: "#0A1C2E" },
  { name: "Gambia Flag", primary: "#3A7D44", secondary: "#E8B84B", text: "#1A1A2E" },
  { name: "Professional Navy", primary: "#1E3A5F", secondary: "#4A90D9", text: "#0D1B2A" },
  { name: "Sunset", primary: "#C0392B", secondary: "#E67E22", text: "#1A0A00" },
];

const TEMPLATES = [
  { id: "modern", name: "Modern", desc: "Clean, minimal design with plenty of white space", icon: "✦" },
  { id: "bold", name: "Bold", desc: "High contrast, strong typography, impactful", icon: "◆" },
  { id: "traditional", name: "Traditional", desc: "Serif fonts, classic layout, professional trust", icon: "❧" },
];

type SiteData = {
  businessName: string;
  description: string;
  industry: string;
  phone: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  template: string;
  logoDataUrl: string;
  facebook: string;
  instagram: string;
  twitter: string;
};

function generateHTML(d: SiteData): string {
  const year = new Date().getFullYear();
  const wa = d.phone.replace(/\D/g, "");
  const isModern = d.template === "modern" || d.template === "";
  const isBold = d.template === "bold";
  const isTraditional = d.template === "traditional";
  const headingFont = isTraditional ? "Georgia, 'Times New Roman', serif" : isModern ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" : "'Arial Black', Arial, sans-serif";
  const bodyFont = isTraditional ? "Georgia, 'Times New Roman', serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const heroFontSize = isBold ? "clamp(2.5rem,7vw,5rem)" : "clamp(2rem,5vw,3.5rem)";
  const logoImg = d.logoDataUrl ? `<img src="${d.logoDataUrl}" alt="${d.businessName} logo" style="height:40px;width:auto;object-fit:contain;" />` : "";
  const socialLinks = (d.facebook || d.instagram || d.twitter) ? `
  <section style="background:${d.primaryColor};padding:3rem 1.5rem;text-align:center;">
    <h2 style="color:#fff;font-size:1.4rem;margin:0 0 1.25rem;font-family:${headingFont};">Follow Us</h2>
    <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">
      ${d.facebook ? `<a href="${d.facebook}" target="_blank" style="background:rgba(255,255,255,0.15);color:#fff;padding:.6rem 1.25rem;border-radius:.5rem;text-decoration:none;font-weight:700;font-size:.9rem;">📘 Facebook</a>` : ""}
      ${d.instagram ? `<a href="${d.instagram}" target="_blank" style="background:rgba(255,255,255,0.15);color:#fff;padding:.6rem 1.25rem;border-radius:.5rem;text-decoration:none;font-weight:700;font-size:.9rem;">📸 Instagram</a>` : ""}
      ${d.twitter ? `<a href="${d.twitter}" target="_blank" style="background:rgba(255,255,255,0.15);color:#fff;padding:.6rem 1.25rem;border-radius:.5rem;text-decoration:none;font-weight:700;font-size:.9rem;">🐦 Twitter/X</a>` : ""}
    </div>
  </section>` : "";

  const mapsSection = d.address ? `
  <section style="padding:3.5rem 1.5rem;background:#F8FAFC;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="font-size:1.6rem;font-weight:800;color:${d.primaryColor};margin:0 0 1.25rem;font-family:${headingFont};">Find Us</h2>
      <p style="color:${d.textColor};margin:0 0 1.25rem;">📍 ${d.address}</p>
      <div style="width:100%;height:300px;border-radius:.75rem;background:linear-gradient(135deg,#e2e8f0,#cbd5e1);display:flex;align-items:center;justify-content:center;border:2px solid #E2E8F0;overflow:hidden;">
        <div style="text-align:center;padding:2rem;">
          <p style="font-size:2rem;margin:0;">📍</p>
          <p style="font-weight:700;color:#475569;margin:.5rem 0 .25rem;">${d.businessName}</p>
          <p style="color:#64748B;font-size:.9rem;margin:0;">${d.address}</p>
          <a href="https://maps.google.com?q=${encodeURIComponent(d.address)}" target="_blank" style="display:inline-block;margin-top:1rem;background:${d.primaryColor};color:#fff;padding:.55rem 1.25rem;border-radius:.45rem;text-decoration:none;font-weight:700;font-size:.85rem;">Open in Google Maps →</a>
        </div>
      </div>
    </div>
  </section>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${d.businessName}</title>
  <meta name="description" content="${d.description}" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --primary: ${d.primaryColor}; --secondary: ${d.secondaryColor}; --text: ${d.textColor}; }
    body { font-family: ${bodyFont}; color: var(--text); background: #fff; line-height: 1.6; }
    nav { background: var(--primary); padding: 0 1.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
    .logo-wrap { display: flex; align-items: center; gap: .65rem; }
    .logo { color: #fff; font-weight: 800; font-size: 1.1rem; letter-spacing: .04em; font-family: ${headingFont}; }
    nav .links { display: flex; align-items: center; gap: .25rem; }
    nav a { color: rgba(255,255,255,.85); text-decoration: none; font-weight: 600; font-size: .9rem; padding: .4rem .75rem; border-radius: .35rem; }
    nav a:hover { background: rgba(255,255,255,.15); }
    nav .cta { background: var(--secondary); color: ${isBold ? "#fff" : "var(--text)"} !important; padding: .45rem 1.1rem; border-radius: .45rem; font-weight: 800; }
    .hero { background: ${isBold ? `var(--primary)` : `linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, black) 100%)`}; color: #fff; padding: ${isBold ? "7rem" : "5rem"} 1.5rem 4rem; text-align: center; ${isBold ? `border-bottom: 6px solid var(--secondary);` : ""} }
    .hero h1 { font-size: ${heroFontSize}; font-weight: 800; line-height: 1.1; margin-bottom: 1rem; font-family: ${headingFont}; ${isBold ? "text-transform: uppercase; letter-spacing: .04em;" : ""} }
    .hero p { font-size: 1.1rem; opacity: .87; max-width: 55ch; margin: 0 auto 2rem; line-height: 1.7; }
    .hero-btn { display: inline-block; background: var(--secondary); color: ${isBold ? "#fff" : "var(--text)"}; padding: ${isBold ? "1rem 2.5rem" : ".9rem 2rem"}; border-radius: .6rem; font-weight: 800; text-decoration: none; font-size: 1rem; font-family: ${headingFont}; ${isBold ? "text-transform: uppercase; letter-spacing: .06em;" : ""} }
    .section { padding: 4rem 1.5rem; max-width: 1100px; margin: 0 auto; }
    .section h2 { font-size: ${isTraditional ? "2rem" : "1.75rem"}; font-weight: 800; color: var(--primary); margin-bottom: 1rem; font-family: ${headingFont}; }
    .section p { color: #475569; font-size: 1rem; line-height: 1.75; max-width: 68ch; }
    .services-wrap { background: #F8FAFC; padding: 4rem 1.5rem; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-top: 1.5rem; max-width: 1100px; margin-left: auto; margin-right: auto; }
    .service-card { padding: 1.5rem; border: 1.5px solid #E2E8F0; border-radius: .75rem; background: #fff; ${isBold ? "border-top: 4px solid var(--secondary);" : ""} }
    .service-card .icon { font-size: 1.75rem; margin-bottom: .75rem; }
    .service-card h3 { font-weight: 700; margin-bottom: .5rem; color: var(--text); font-family: ${headingFont}; }
    .service-card p { font-size: .9rem; color: #64748B; line-height: 1.6; }
    .contact-section { background: var(--primary); color: #fff; padding: 4rem 1.5rem; text-align: center; }
    .contact-section h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; font-family: ${headingFont}; }
    .contact-section p { opacity: .85; font-size: 1rem; margin-bottom: .4rem; }
    .contact-section a { color: var(--secondary); }
    footer { background: #0A1C2E; color: rgba(255,255,255,.6); padding: 1.5rem; text-align: center; font-size: .82rem; }
    .wa-fab { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 1000; background: #25D366; color: #fff; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; text-decoration: none; box-shadow: 0 6px 20px rgba(37,211,102,.45); transition: transform .2s; }
    .wa-fab:hover { transform: scale(1.1); }
    @media (max-width: 640px) { nav .links { display: none; } .hero { padding: 3rem 1rem 2.5rem; } }
  </style>
</head>
<body>
  <nav>
    <div class="logo-wrap">
      ${logoImg}
      <span class="logo">${d.businessName}</span>
    </div>
    <div class="links">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      ${d.address ? `<a href="#location">Location</a>` : ""}
      <a href="#contact">Contact</a>
      ${wa ? `<a href="https://wa.me/220${wa}" class="cta" target="_blank">WhatsApp Us</a>` : ""}
    </div>
  </nav>

  <section class="hero">
    ${logoImg ? `<div style="margin-bottom:1.5rem;">${logoImg.replace('style="height:40px', 'style="height:70px')}</div>` : ""}
    <h1>${d.businessName}</h1>
    <p>${d.description}</p>
    <a href="#contact" class="hero-btn">Get In Touch →</a>
  </section>

  <section class="section" id="about">
    <h2>About ${d.businessName}</h2>
    <p>Welcome to ${d.businessName} — a ${d.industry.toLowerCase()} business proudly serving customers${d.address ? ` in ${d.address}` : " in The Gambia"}. We are committed to quality, reliability, and exceptional service that puts our customers first.</p>
    <p style="margin-top:.75rem;">${d.description}</p>
  </section>

  <div class="services-wrap">
    <div class="section" style="padding:0;" id="services">
      <h2>Our Services</h2>
      <div class="services-grid">
        <div class="service-card"><div class="icon">⭐</div><h3>Quality Products</h3><p>Premium quality products and services tailored to your specific needs.</p></div>
        <div class="service-card"><div class="icon">🤝</div><h3>Trusted Service</h3><p>Building lasting relationships with every customer we serve.</p></div>
        <div class="service-card"><div class="icon">🚀</div><h3>Fast Delivery</h3><p>Prompt and reliable delivery across The Gambia.</p></div>
        <div class="service-card"><div class="icon">💬</div><h3>24/7 WhatsApp</h3><p>Reach us anytime on WhatsApp for orders and enquiries.</p></div>
      </div>
    </div>
  </div>

  ${mapsSection}
  ${socialLinks}

  <section class="contact-section" id="contact">
    <h2>Contact Us</h2>
    ${d.phone ? `<p>📞 <a href="tel:${d.phone}">${d.phone}</a></p>` : ""}
    ${d.address ? `<p>📍 ${d.address}</p>` : ""}
    ${wa ? `<p style="margin-top:1.5rem;"><a href="https://wa.me/220${wa}" style="display:inline-block;background:#25D366;color:#fff;padding:.85rem 2rem;border-radius:.6rem;font-weight:800;text-decoration:none;">💬 Chat on WhatsApp</a></p>` : ""}
  </section>

  <footer>
    <p>© ${year} ${d.businessName}. All rights reserved. | Built with FORTIS OS™ Website Builder by UJU GROUP LIMITED</p>
  </footer>

  ${wa ? `<a href="https://wa.me/220${wa}" class="wa-fab" target="_blank" title="Chat on WhatsApp">💬</a>` : ""}
</body>
</html>`;
}

export default function WebsiteBuilderPage() {
  const [form, setForm] = useState<SiteData>({
    businessName: "", description: "", industry: "Retail", phone: "", address: "",
    primaryColor: "#1B4D3E", secondaryColor: "#D4AF37", textColor: "#0A1C2E",
    template: "modern", logoDataUrl: "", facebook: "", instagram: "", twitter: "",
  });
  const [preview, setPreview] = useState("");
  const [generated, setGenerated] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function f(field: keyof SiteData, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (generated) setPreview(generateHTML(next));
  }

  function applyPalette(p: typeof PALETTES[0]) {
    const next = { ...form, primaryColor: p.primary, secondaryColor: p.secondary, textColor: p.text };
    setForm(next);
    if (generated) setPreview(generateHTML(next));
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
      alert("Please upload a PNG, JPG, or SVG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoPreview(dataUrl);
      const next = { ...form, logoDataUrl: dataUrl };
      setForm(next);
      if (generated) setPreview(generateHTML(next));
    };
    reader.readAsDataURL(file);
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.description) return;
    setPreview(generateHTML(form));
    setGenerated(true);
  }

  function handleDownload() {
    const blob = new Blob([preview], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.businessName.replace(/\s+/g, "-").toLowerCase()}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={eyebrowStyle}>WEBSITE BUILDER</p>
          <h1 style={pageTitleStyle}>Build Your Business Website</h1>
          <p style={pageSubStyle}>Fill in your details, choose your style, and download a complete mobile-responsive website. No coding required.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Form Panel */}
          <div className="fortis-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Template */}
            <div>
              <h3 style={sectionHeadStyle}>Template Style</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {TEMPLATES.map((t) => (
                  <button key={t.id} type="button" onClick={() => f("template", t.id)}
                    style={{
                      border: `2px solid ${form.template === t.id ? "#1B4D3E" : "#E2E8F0"}`,
                      background: form.template === t.id ? "#1B4D3E" : "#FFFFFF",
                      color: form.template === t.id ? "#FFFFFF" : "#0A1C2E",
                      borderRadius: "0.6rem", padding: "0.6rem 0.4rem", cursor: "pointer",
                      fontFamily: "inherit", textAlign: "center",
                    }}>
                    <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>{t.icon}</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <h3 style={sectionHeadStyle}>Logo Upload</h3>
              <div
                style={{ border: "2px dashed #E2E8F0", borderRadius: "0.75rem", padding: "1rem", cursor: "pointer", textAlign: "center", background: "#F8FAFC" }}
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img src={logoPreview} alt="Logo preview" style={{ height: "48px", width: "auto", objectFit: "contain", borderRadius: "6px" }} />
                    <div style={{ textAlign: "left" }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#1B4D3E" }}>Logo uploaded ✓</p>
                      <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#64748B" }}>Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ margin: 0, fontSize: "1.5rem" }}>🖼️</p>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", fontWeight: 600, color: "#0A1C2E" }}>Click to upload logo</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#64748B" }}>PNG, JPG, or SVG</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogoFile} style={{ display: "none" }} />
              </div>
            </div>

            {/* Color Palettes */}
            <div>
              <h3 style={sectionHeadStyle}>Colour Palette</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {PALETTES.map((p) => (
                  <button key={p.name} type="button" onClick={() => applyPalette(p)}
                    style={{
                      border: `2px solid ${form.primaryColor === p.primary && form.secondaryColor === p.secondary ? "#0A1C2E" : "#E2E8F0"}`,
                      background: "#FFFFFF", borderRadius: "0.5rem", padding: "0.5rem 0.65rem",
                      cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "0.5rem",
                    }}>
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: p.primary, border: "1px solid rgba(0,0,0,0.15)" }} />
                      <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: p.secondary, border: "1px solid rgba(0,0,0,0.15)" }} />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0A1C2E", textAlign: "left" as const }}>{p.name}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {[
                  { label: "Primary", field: "primaryColor" as keyof SiteData },
                  { label: "Secondary", field: "secondaryColor" as keyof SiteData },
                  { label: "Text", field: "textColor" as keyof SiteData },
                ].map(({ label, field }) => (
                  <div key={field} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{label}</label>
                    <input type="color" value={form[field] as string} onChange={(e) => f(field, e.target.value)}
                      style={{ width: "100%", height: "36px", borderRadius: "0.45rem", border: "1.5px solid #E2E8F0", cursor: "pointer", padding: "2px" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Info Form */}
            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h3 style={{ ...sectionHeadStyle, marginBottom: 0 }}>Business Details</h3>
              <SimpleField label="Business Name *" value={form.businessName} onChange={(v) => f("businessName", v)} placeholder="e.g. Jallow Trading Co." />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={labelStyle}>Description *</label>
                <textarea className="fortis-textarea" rows={3} value={form.description} onChange={(e) => f("description", e.target.value)} placeholder="What does your business do?" required style={{ minHeight: "80px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={labelStyle}>Industry</label>
                <select className="fortis-input" value={form.industry} onChange={(e) => f("industry", e.target.value)}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <SimpleField label="WhatsApp / Phone" value={form.phone} onChange={(v) => f("phone", v)} placeholder="e.g. 7012345" />
              <SimpleField label="Address" value={form.address} onChange={(v) => f("address", v)} placeholder="e.g. Serrekunda, Gambia" />

              {/* Social Links Toggle */}
              <button type="button" onClick={() => setShowAdvanced((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 700, color: "#1B4D3E", textAlign: "left", padding: 0 }}>
                {showAdvanced ? "▲" : "▶"} Social Media Links (optional)
              </button>
              {showAdvanced && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", padding: "0.75rem", background: "#F8FAFC", borderRadius: "0.6rem", border: "1px solid #E2E8F0" }}>
                  <SimpleField label="📘 Facebook URL" value={form.facebook} onChange={(v) => f("facebook", v)} placeholder="https://facebook.com/..." />
                  <SimpleField label="📸 Instagram URL" value={form.instagram} onChange={(v) => f("instagram", v)} placeholder="https://instagram.com/..." />
                  <SimpleField label="🐦 Twitter/X URL" value={form.twitter} onChange={(v) => f("twitter", v)} placeholder="https://x.com/..." />
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={!form.businessName || !form.description} style={{ width: "100%" }}>
                {generated ? "🔄 Regenerate Website" : "⚡ Generate Website"}
              </button>
              {generated && (
                <button type="button" onClick={handleDownload} style={downloadBtnStyle}>
                  ⬇️ Download as HTML
                </button>
              )}
            </form>
          </div>

          {/* Preview Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "sticky", top: "70px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0A1C2E" }}>Live Preview</h2>
              {generated && (
                <button type="button" onClick={handleDownload} style={downloadBtnStyle}>⬇️ Download HTML</button>
              )}
            </div>
            <div style={previewFrameStyle}>
              {generated ? (
                <iframe srcDoc={preview} title="Website Preview" style={{ width: "100%", height: "100%", border: "none", borderRadius: "0.6rem" }} sandbox="allow-same-origin" />
              ) : (
                <div style={previewEmptyStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🌐</p>
                  <p style={{ margin: "0.5rem 0 0", color: "#64748B", fontSize: "0.95rem" }}>
                    Fill in your details and click Generate to see your website
                  </p>
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {["Logo in header", "WhatsApp button", "Google Maps", "Social links", "3 templates"].map((f) => (
                      <span key={f} style={{ padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#E8F5EF", color: "#1B4D3E", fontSize: "0.75rem", fontWeight: 600 }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SimpleField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={labelStyle}>{label}</label>
      <input type="text" className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

const eyebrowStyle: React.CSSProperties = { margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.14em", color: "var(--color-primary)" };
const pageTitleStyle: React.CSSProperties = { margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "var(--color-text)" };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "var(--color-text-muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "64ch" };
const sectionHeadStyle: React.CSSProperties = { margin: "0 0 0.75rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase" as const, letterSpacing: "0.08em" };
const labelStyle: React.CSSProperties = { fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" };
const downloadBtnStyle: React.CSSProperties = { border: "1.5px solid var(--color-primary)", background: "#FFFFFF", color: "var(--color-primary)", padding: "0.65rem 1.1rem", borderRadius: "0.55rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit", width: "100%" };
const previewFrameStyle: React.CSSProperties = { border: "1.5px solid var(--color-border)", borderRadius: "0.75rem", height: "720px", overflow: "hidden", background: "#F8FAFC" };
const previewEmptyStyle: React.CSSProperties = { height: "100%", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, padding: "2rem" };
