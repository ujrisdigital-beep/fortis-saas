"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

const BUSINESS_TYPES = ["Retail Shop", "Restaurant / Food", "Logistics / Delivery", "Agriculture", "Healthcare", "Education / Training", "Professional Services", "Construction", "Tourism / Hospitality", "Other"];

const TOOL_RECS: Record<string, { name: string; purpose: string; icon: string; free: boolean }[]> = {
  low: [
    { name: "WhatsApp Business", purpose: "Customer communication & catalogue", icon: "💬", free: true },
    { name: "Google Sheets", purpose: "Basic inventory & records", icon: "📊", free: true },
    { name: "Wave (Mobile Money)", purpose: "Payments & basic bookkeeping", icon: "💳", free: true },
  ],
  mid: [
    { name: "FORTIS OS Website Builder", purpose: "Professional online presence", icon: "🌐", free: true },
    { name: "Canva", purpose: "Marketing materials & social media", icon: "🎨", free: true },
    { name: "Google Forms", purpose: "Customer orders & feedback", icon: "📋", free: true },
    { name: "Trello / Notion", purpose: "Team task management", icon: "✅", free: true },
  ],
  high: [
    { name: "QuickBooks / Wave Accounting", purpose: "Full accounting & invoicing", icon: "🧾", free: false },
    { name: "Shopify / WooCommerce", purpose: "E-commerce store", icon: "🛒", free: false },
    { name: "HubSpot CRM (Free Tier)", purpose: "Customer relationship management", icon: "🤝", free: true },
    { name: "Zoho Suite", purpose: "All-in-one business management", icon: "⚙️", free: false },
  ],
};

type DigiResult = {
  score: number;
  level: string;
  levelColor: string;
  levelBg: string;
  tools: typeof TOOL_RECS.low;
  timeToImplement: string;
  nextSteps: string[];
};

export default function SaasPage() {
  const [bizType, setBizType] = useState("Retail Shop");
  const [employees, setEmployees] = useState("");
  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [result, setResult] = useState<DigiResult | null>(null);

  function toggleTool(tool: string) {
    setCurrentTools((prev) => prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]);
  }

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const emp = Number(employees);
    if (!emp) return;

    let score = 0;
    if (currentTools.includes("WhatsApp")) score += 20;
    if (currentTools.includes("Excel")) score += 25;
    if (currentTools.includes("Accounting Software")) score += 30;
    if (currentTools.includes("Website")) score += 35;
    if (currentTools.includes("Paper Only")) score = Math.min(score, 15);

    // Add points for size/readiness
    if (emp >= 5) score += 10;
    if (emp >= 20) score += 15;
    score = Math.min(100, score);

    let level = "Starting Out";
    let levelColor = "#E63946";
    let levelBg = "#fff1f2";
    let tools = TOOL_RECS.low;
    let timeToImplement = "4–6 weeks";
    let nextSteps = ["Set up WhatsApp Business with catalogue", "Create Google Sheets for inventory tracking", "Register for mobile money business account"];

    if (score >= 65) {
      level = "Advanced"; levelColor = "#10B981"; levelBg = "#f0fdf4";
      tools = [...TOOL_RECS.mid, ...TOOL_RECS.high];
      timeToImplement = "8–12 weeks";
      nextSteps = ["Implement e-commerce or online ordering", "Set up full accounting software", "Deploy CRM for customer retention", "Build data dashboards for decision-making"];
    } else if (score >= 35) {
      level = "Developing"; levelColor = "#D4AF37"; levelBg = "#fffbeb";
      tools = [...TOOL_RECS.low, ...TOOL_RECS.mid];
      timeToImplement = "6–10 weeks";
      nextSteps = ["Build a professional website using FORTIS OS", "Migrate to digital accounting", "Set up structured customer database", "Train staff on digital tools"];
    }

    setResult({ score, level, levelColor, levelBg, tools, timeToImplement, nextSteps });
  }

  const toolOptions = ["Paper Only", "WhatsApp", "Excel", "Accounting Software", "Website"];

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>💻 SAAS SECTOR</span>
            <h1 style={pageTitleStyle}>Business Digitisation Planner</h1>
            <p style={pageSubStyle}>
              Assess your current digitisation level and get a personalised technology roadmap for your Gambian business.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Your Business Profile</h2>
              <form onSubmit={calculate} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Business Type</label>
                  <select className="fortis-input" value={bizType} onChange={(e) => setBizType(e.target.value)}>
                    {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Number of Employees</label>
                  <input type="number" className="fortis-input" value={employees} onChange={(e) => setEmployees(e.target.value)} placeholder="e.g. 5" min="1" required />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Current Tools Used <span style={{ fontWeight: 400, color: "#64748B", fontSize: "0.78rem" }}>(select all that apply)</span></label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.25rem" }}>
                    {toolOptions.map((tool) => (
                      <button key={tool} type="button"
                        onClick={() => toggleTool(tool)}
                        style={{
                          padding: "0.45rem 0.85rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600,
                          border: `1.5px solid ${currentTools.includes(tool) ? "#1B4D3E" : "#E2E8F0"}`,
                          background: currentTools.includes(tool) ? "#1B4D3E" : "#FFFFFF",
                          color: currentTools.includes(tool) ? "#FFFFFF" : "#0A1C2E",
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >{tool}</button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                  💻 Generate Digital Roadmap
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🚀</p>
                  <p style={emptyTextStyle}>Fill in your business details to get a digitisation plan</p>
                </div>
              )}
              {result && (
                <>
                  <div style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.5rem 2rem", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" as const }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: 800, color: "#D4AF37", lineHeight: 1 }}>{result.score}</p>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>Digitisation Score</p>
                    </div>
                    <div>
                      <div style={{ display: "inline-block", padding: "0.3rem 0.9rem", borderRadius: "999px", background: result.levelBg, color: result.levelColor, fontWeight: 800, fontSize: "1rem", marginBottom: "0.4rem" }}>
                        {result.level}
                      </div>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                        ⏱️ Time to implement: <strong style={{ color: "#D4AF37" }}>{result.timeToImplement}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Recommended Tools */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Recommended Tools for {bizType}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      {result.tools.map((tool) => (
                        <div key={tool.name} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "0.6rem", padding: "0.85rem 1rem", display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{tool.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0A1C2E" }}>{tool.name}</p>
                            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#64748B" }}>{tool.purpose}</p>
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: tool.free ? "#10B981" : "#D4AF37", textTransform: "uppercase" as const }}>{tool.free ? "Free" : "Paid"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div style={{ background: "rgba(27,77,62,0.05)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
                    <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" }}>Next Steps</p>
                    {result.nextSteps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <span style={{ background: "#1B4D3E", color: "#FFFFFF", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#0A1C2E", lineHeight: 1.55 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh" };
const headerBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const headerInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const sectorTagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const pageTitleStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem", alignItems: "start" };
const formCardStyle: React.CSSProperties = { padding: "1.75rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 700, color: "#0A1C2E" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const emptyCardStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", padding: "4rem 2rem", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const emptyTextStyle: React.CSSProperties = { color: "#64748B", fontSize: "0.95rem", margin: 0 };
const sectionCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#1B4D3E" };
