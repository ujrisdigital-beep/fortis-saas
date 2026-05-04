"use client";

import ContactForm from "../../components/ContactForm";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A7A5E 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📧</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Contact FORTIS OS
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", opacity: 0.85, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Partnership enquiries, investment briefings, technical questions — we respond within 24 hours.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <ContactForm
          type="general"
          buttonText="Send Message"
          subtitle="Partnership enquiries, investment briefings, or general questions — we respond within 24 hours."
        />

        {/* Contact details */}
        <div style={{
          marginTop: 32, background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: "0 0 16px" }}>Other Ways to Reach Us</h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 20, fontSize: 13, color: "#6B7280" }}>
            <div>
              <div style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>🌐 Platform</div>
              <div>fortisos.cloud</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>🏢 Company</div>
              <div>FORTIS INVICTA LTD</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>🇬🇲 Country</div>
              <div>The Gambia, West Africa</div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "🤝 Development Partners", href: "/partners" },
            { label: "🏛️ National Asset", href: "/national-asset" },
            { label: "💼 Grants Portal", href: "/funding" },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              background: "#fff", color: DARK, padding: "9px 18px", borderRadius: 30,
              textDecoration: "none", fontSize: 12, fontWeight: 700,
              border: "1.5px solid #E5E7EB",
            }}>
              {link.label}
            </a>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
