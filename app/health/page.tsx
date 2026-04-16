"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type Condition = { name: string; match: string[] };

const CONDITIONS: Condition[] = [
  { name: "Malaria", match: ["fever", "chills", "headache", "sweating", "fatigue", "nausea", "vomiting", "muscle"] },
  { name: "Typhoid Fever", match: ["fever", "stomach", "abdominal", "diarrhea", "constipation", "rash", "weakness"] },
  { name: "Upper Respiratory Infection", match: ["cough", "cold", "runny", "sore throat", "sneeze", "congestion", "blocked"] },
  { name: "Hypertension", match: ["headache", "dizziness", "blurred", "chest", "palpitation", "shortness"] },
  { name: "Gastroenteritis", match: ["diarrhea", "vomiting", "stomach", "abdominal", "nausea", "cramps"] },
  { name: "Anaemia", match: ["fatigue", "weakness", "pale", "tired", "dizzy", "breathless", "shortness"] },
  { name: "Diabetes (Unmanaged)", match: ["thirst", "frequent urination", "blurred", "fatigue", "weight loss", "hunger"] },
  { name: "Skin Infection", match: ["rash", "itching", "swelling", "redness", "skin", "lesion", "blisters"] },
];

function matchConditions(symptoms: string): string[] {
  const lower = symptoms.toLowerCase();
  const scored = CONDITIONS.map((c) => {
    const score = c.match.filter((kw) => lower.includes(kw)).length;
    return { name: c.name, score };
  }).filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((c) => c.name);
}

type HealthResult = {
  conditions: string[];
  urgency: "Low" | "Medium" | "High";
  action: string;
  urgencyColor: string;
  urgencyBg: string;
};

export default function HealthPage() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(5);
  const [result, setResult] = useState<HealthResult | null>(null);

  function assess(e: React.FormEvent) {
    e.preventDefault();
    const days = Number(duration);
    const conditions = matchConditions(symptoms);

    let urgency: "Low" | "Medium" | "High" = "Low";
    let urgencyColor = "#10B981";
    let urgencyBg = "#f0fdf4";
    let action = "Monitor your symptoms at home. Stay hydrated and rest. Visit a clinic if symptoms worsen.";

    if (severity >= 7 || days >= 7) {
      urgency = "High";
      urgencyColor = "#E63946";
      urgencyBg = "#fff1f2";
      action = "Seek medical attention today. High severity or prolonged symptoms require professional evaluation. Go to your nearest health facility.";
    } else if (severity >= 4 || days >= 3) {
      urgency = "Medium";
      urgencyColor = "#D4AF37";
      urgencyBg = "#fffbeb";
      action = "Schedule a clinic visit within 24–48 hours. Do not ignore these symptoms — early treatment is important.";
    }

    if (!conditions.length) conditions.push("No specific condition matched — general wellness review recommended");

    setResult({ conditions, urgency, urgencyColor, urgencyBg, action });
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>🏥 HEALTH SECTOR</span>
            <h1 style={pageTitleStyle}>Symptom Checker</h1>
            <p style={pageSubStyle}>
              Describe your symptoms to get a preliminary assessment, urgency level, and recommended next steps. This is not a medical diagnosis.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Symptom Details</h2>
              <form onSubmit={assess} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Describe Your Symptoms <span style={{ color: "#E63946" }}>*</span></label>
                  <textarea
                    className="fortis-textarea"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. I have a fever, headache, and body aches for the past 2 days. Also feeling nauseous..."
                    rows={4}
                    required
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Duration (days)</label>
                  <input type="number" className="fortis-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3" min="1" required />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Severity (1 = Mild, 10 = Severe): <strong style={{ color: "#1B4D3E" }}>{severity}/10</strong></label>
                  <input
                    type="range" min="1" max="10" value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#1B4D3E", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748B" }}>
                    <span>1 — Mild</span><span>5 — Moderate</span><span>10 — Severe</span>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  🏥 Assess Symptoms
                </button>
              </form>
              <div style={disclaimerBoxStyle}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B", lineHeight: 1.6 }}>
                  <strong>Disclaimer:</strong> This tool provides general guidance only. Always consult a qualified doctor for medical diagnosis and treatment.
                </p>
              </div>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🩺</p>
                  <p style={emptyTextStyle}>Describe your symptoms to get an assessment</p>
                </div>
              )}
              {result && (
                <>
                  {/* Urgency Banner */}
                  <div style={{ background: result.urgencyBg, border: `2px solid ${result.urgencyColor}`, borderRadius: "0.85rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "2rem" }}>{result.urgency === "High" ? "🚨" : result.urgency === "Medium" ? "⚠️" : "✅"}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: result.urgencyColor }}>URGENCY LEVEL</p>
                      <p style={{ margin: "0.2rem 0 0", fontWeight: 800, fontSize: "1.4rem", color: result.urgencyColor }}>{result.urgency}</p>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Possible Conditions (based on symptoms)</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {result.conditions.map((cond, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.85rem", background: "#F8FAFC", borderRadius: "0.5rem", border: "1px solid #E2E8F0" }}>
                          <span style={{ background: "#1B4D3E", color: "#FFFFFF", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0A1C2E" }}>{cond}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div style={{ ...sectionCardStyle, background: "rgba(27,77,62,0.05)", borderColor: "rgba(27,77,62,0.2)" }}>
                    <p style={sectionLabelStyle}>Recommended Action</p>
                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#0A1C2E", lineHeight: 1.7 }}>{result.action}</p>
                  </div>

                  <div style={nearbyStyle}>
                    <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.88rem", color: "#1B4D3E" }}>Nearby Health Facilities in The Gambia</p>
                    {["Edward Francis Small Teaching Hospital — Banjul", "Serrekunda General Hospital — Kanifing", "Bansang Hospital — Central River Region"].map((f) => (
                      <p key={f} style={{ margin: "0.2rem 0", fontSize: "0.85rem", color: "#0A1C2E" }}>📍 {f}</p>
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
const disclaimerBoxStyle: React.CSSProperties = { marginTop: "1.25rem", padding: "0.85rem", background: "#FFF7ED", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "0.5rem" };
const emptyCardStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", padding: "4rem 2rem", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const emptyTextStyle: React.CSSProperties = { color: "#64748B", fontSize: "0.95rem", margin: 0 };
const sectionCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#1B4D3E" };
const nearbyStyle: React.CSSProperties = { padding: "1rem 1.25rem", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "0.6rem" };
