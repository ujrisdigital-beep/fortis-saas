"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface SimTask {
  id: number;
  title: string;
  description: string;
  tool: string;
  toolUrl: string;
  toolIcon: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  points: number;
}

const INDUSTRY_CONFIG: Record<string, {
  label: string;
  icon: string;
  color: string;
  intro: string;
  tasks: SimTask[];
}> = {
  banking_finance: {
    label: "Banking & Finance",
    icon: "🏦",
    color: "#1D4ED8",
    intro: "Simulate real banking workflows — credit analysis, compliance, fraud detection, and digital payments using FORTIS OS intelligence tools.",
    tasks: [
      { id: 1, title: "Loan Application Analysis", description: "Review a simulated SME loan application. Assess creditworthiness, identify risk factors, and generate a decision memo.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=loan-analysis", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "KYC / AML Compliance Check", description: "Run a compliance screening on a new corporate client. Flag PEP matches, sanctions risks, and beneficial ownership gaps.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=compliance", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
      { id: 3, title: "Fraud Pattern Detection", description: "Analyse a dataset of 50 transactions. Identify anomalies using AI-assisted pattern recognition.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Advanced", points: 200 },
      { id: 4, title: "Customer Dispute Resolution", description: "A customer disputes a mobile money transfer. Follow the CBG dispute resolution protocol and draft a resolution letter.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=dispute-resolution", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 5, title: "Digital Payments Audit", description: "Audit a branch's mobile money reconciliation for a full month. Identify discrepancies and report findings.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=audit", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
    ],
  },
  telecommunications: {
    label: "Telecommunications",
    icon: "📡",
    color: "#7C3AED",
    intro: "Practice telecom regulatory compliance, network security assessments, and mobile money operations using live FORTIS OS tools.",
    tasks: [
      { id: 1, title: "PURA Regulatory Submission", description: "Draft a quarterly QoS compliance report for PURA. Use CBG and PURA guidelines.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=pura-compliance", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "Network Security Assessment", description: "Conduct a vulnerability checklist for a simulated core network segment. Rate risks and propose mitigations.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=security", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
      { id: 3, title: "Mobile Money Onboarding Audit", description: "Review a mobile money agent onboarding process against CBG's e-money regulations.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Basic", points: 100 },
      { id: 4, title: "Customer Data Protection Review", description: "Map data flows for a new subscriber management system against GDPA 2018 requirements.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=data-protection", toolIcon: "🤖", difficulty: "Advanced", points: 200 },
      { id: 5, title: "Spectrum Licence Application", description: "Prepare a spectrum licence renewal application for a new frequency band. Complete all PURA forms.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=licensing", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
    ],
  },
  agriculture: {
    label: "Agriculture",
    icon: "🌾",
    color: "#15803D",
    intro: "Apply digital tools to precision agriculture, market access, and supply chain traceability for Gambian farming operations.",
    tasks: [
      { id: 1, title: "Crop Yield Forecast", description: "Using climate data and soil reports, generate a groundnut yield forecast for the North Bank Region.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=crop-forecast", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "Supply Chain Trace — Export Audit", description: "Trace a groundnut export consignment from farm to port. Document chain of custody.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=supply-chain", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
      { id: 3, title: "Digital Market Access", description: "List a farm cooperative's products on the FORTIS OS marketplace. Optimise pricing using IKENGA.", tool: "IKENGA Identity", toolUrl: "/ikenga/identity", toolIcon: "🪪", difficulty: "Basic", points: 100 },
      { id: 4, title: "Climate Adaptation Plan", description: "Draft a 3-year climate adaptation plan for a vegetable farmer in the West Coast Region.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=climate-adaptation", toolIcon: "🤖", difficulty: "Advanced", points: 200 },
      { id: 5, title: "AgriFinance Application", description: "Prepare a financing application for an irrigation project. Use financial modelling tools.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=finance", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
    ],
  },
  energy: {
    label: "Energy & Utilities",
    icon: "⚡",
    color: "#CA8A04",
    intro: "Simulate NAWEC and renewable energy workflows — grid management, tariff analysis, solar project development, and regulatory reporting.",
    tasks: [
      { id: 1, title: "Load Forecasting Report", description: "Generate a 12-month electricity demand forecast for the Greater Banjul Area using historical data.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=load-forecast", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "Solar Project Feasibility", description: "Assess feasibility of a 500kW solar installation for a rural school. Calculate payback period.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=feasibility", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
      { id: 3, title: "PURA Tariff Review", description: "Analyse NAWEC's current tariff structure and model impact of a 15% increase on low-income consumers.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Advanced", points: 200 },
      { id: 4, title: "Energy Audit — Commercial Building", description: "Conduct a virtual energy audit for a 3-storey office building. Recommend efficiency measures.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=energy-audit", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 5, title: "Grid Outage Incident Report", description: "Document a simulated grid fault event. Follow NAWEC incident reporting procedures.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=incident", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
    ],
  },
  health: {
    label: "Healthcare",
    icon: "🏥",
    color: "#DC2626",
    intro: "Apply health informatics, patient data governance, and digital health tools in simulated Gambian healthcare scenarios.",
    tasks: [
      { id: 1, title: "Patient Data Privacy Audit", description: "Review a health records system against GDPA 2018. Identify 5 compliance gaps and propose fixes.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=health-privacy", toolIcon: "🤖", difficulty: "Advanced", points: 200 },
      { id: 2, title: "Disease Surveillance Report", description: "Analyse weekly epidemiological data from DHIS2. Identify anomalies and draft a public health alert.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=surveillance", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
      { id: 3, title: "Telemedicine Protocol Design", description: "Design a teleconsultation workflow for a rural health post. Define consent, data, and referral procedures.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=telemedicine", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 4, title: "Medical Supply Chain Audit", description: "Trace essential medicines from central store to health centre. Flag shortfalls and cold-chain breaks.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Advanced", points: 200 },
      { id: 5, title: "Health Analytics Dashboard", description: "Configure key indicators for a district health dashboard. Define KPIs and data sources.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=analytics", toolIcon: "🔄", difficulty: "Basic", points: 100 },
    ],
  },
  government: {
    label: "Government & Civil Service",
    icon: "🏛️",
    color: "#1D4ED8",
    intro: "Simulate public sector digital transformation — e-government services, open data, compliance, and policy development.",
    tasks: [
      { id: 1, title: "E-Government Service Design", description: "Design a digital birth registration service. Map user journey, data fields, and interoperability with GRTS.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=service-design", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "Open Data Publication", description: "Prepare a dataset for open data publication. Apply GDPA anonymisation and metadata standards.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=open-data", toolIcon: "🤖", difficulty: "Advanced", points: 200 },
      { id: 3, title: "Procurement Compliance Audit", description: "Review a simulated procurement process against GPPA regulations. Identify irregularities.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Advanced", points: 200 },
      { id: 4, title: "Policy Impact Analysis", description: "Analyse the potential economic impact of a proposed SME tax incentive using FORTIS OS data.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=policy-analysis", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 5, title: "Digital Transformation Roadmap", description: "Draft a 2-year digital transformation roadmap for a government ministry. Define milestones and budget.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=roadmap", toolIcon: "🔄", difficulty: "Basic", points: 100 },
    ],
  },
  education: {
    label: "Education",
    icon: "🎓",
    color: "#7C3AED",
    intro: "Practice digital learning design, student data governance, and EdTech integration in Gambian educational contexts.",
    tasks: [
      { id: 1, title: "Online Course Design", description: "Design a 4-week online module on digital literacy. Define learning outcomes, content structure, and assessments.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=course-design", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 2, title: "Student Data Privacy Policy", description: "Draft a student data privacy policy for a university. Align with GDPA 2018 and best practice.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=policy", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
      { id: 3, title: "EdTech Platform Evaluation", description: "Evaluate 3 LMS options for a secondary school. Score against Gambian curriculum requirements.", tool: "IKENGA Deep Search", toolUrl: "/ikenga/identity?tab=deep-search", toolIcon: "🔍", difficulty: "Intermediate", points: 150 },
      { id: 4, title: "Educational Analytics Dashboard", description: "Define KPIs for a school attendance and performance dashboard. Identify data sources.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=edu-analytics", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 5, title: "Digital Skills Assessment", description: "Design a baseline digital skills assessment for teachers. Cover 5 competency domains.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=assessment", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
    ],
  },
  sme_entrepreneurship: {
    label: "SME & Entrepreneurship",
    icon: "🚀",
    color: "#EA580C",
    intro: "Build your business using FORTIS OS tools — brand identity, digital marketing, e-commerce, and financial management.",
    tasks: [
      { id: 1, title: "Business Brand Identity", description: "Create a brand identity for a new Gambian SME. Use IKENGA to generate a logo and brand kit.", tool: "IKENGA Identity", toolUrl: "/ikenga/identity", toolIcon: "🪪", difficulty: "Basic", points: 100 },
      { id: 2, title: "Digital Marketing Strategy", description: "Develop a 3-month social media strategy for a retail business. Define content calendar and KPIs.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=digital-marketing", toolIcon: "🤖", difficulty: "Intermediate", points: 150 },
      { id: 3, title: "E-Commerce Launch Plan", description: "Plan the launch of an online shop. Cover product listings, payment integration, and logistics.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=ecommerce", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
      { id: 4, title: "Financial Compliance Check", description: "Review a business's tax obligations under Gambia's Income & Corporate Tax Act. Identify gaps.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=tax-compliance", toolIcon: "🤖", difficulty: "Advanced", points: 200 },
      { id: 5, title: "Funding Application — GIEPA Grant", description: "Prepare a GIEPA investment grant application for a food processing business.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=funding", toolIcon: "🔄", difficulty: "Advanced", points: 200 },
    ],
  },
  general: {
    label: "Digital Literacy",
    icon: "💻",
    color: "#0891B2",
    intro: "Build core digital skills — internet safety, AI tools, data analysis, and professional online communication.",
    tasks: [
      { id: 1, title: "Internet Safety Assessment", description: "Identify phishing attempts, insecure Wi-Fi risks, and password vulnerabilities in 5 simulated scenarios.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=internet-safety", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 2, title: "AI Tools Introduction", description: "Complete 3 practical tasks using Ask UJRIS — summarise a report, draft an email, and analyse a dataset.", tool: "Ask UJRIS", toolUrl: "/ask-ujris", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 3, title: "Data Analysis Basics", description: "Analyse a sample dataset using the FORTIS OS intelligence dashboard. Identify 3 trends.", tool: "UJU Cycle", toolUrl: "/uju-cycle?stage=data", toolIcon: "🔄", difficulty: "Intermediate", points: 150 },
      { id: 4, title: "Professional Digital Communication", description: "Draft a professional email, LinkedIn profile, and project proposal using AI assistance.", tool: "Ask UJRIS", toolUrl: "/ask-ujris?context=professional-writing", toolIcon: "🤖", difficulty: "Basic", points: 100 },
      { id: 5, title: "Brand Presence Setup", description: "Create a basic digital brand presence using IKENGA — profile, platform search, and website brief.", tool: "IKENGA Identity", toolUrl: "/ikenga/identity", toolIcon: "🪪", difficulty: "Intermediate", points: 150 },
    ],
  },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Basic: "#16A34A",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function SimulatePage() {
  const params = useParams();
  const industry = (params?.industry as string) ?? "general";
  const cfg = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.general;

  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`sim_${industry}`);
    if (saved) {
      const ids: number[] = JSON.parse(saved);
      setCompleted(new Set(ids));
      setTotalPoints(ids.reduce((sum, id) => {
        const task = cfg.tasks.find((t) => t.id === id);
        return sum + (task?.points ?? 0);
      }, 0));
    }
  }, [industry, cfg.tasks]);

  function markComplete(task: SimTask) {
    if (completed.has(task.id)) return;
    const next = new Set(completed);
    next.add(task.id);
    setCompleted(next);
    setTotalPoints((p) => p + task.points);
    localStorage.setItem(`sim_${industry}`, JSON.stringify(Array.from(next)));
  }

  const maxPoints = cfg.tasks.reduce((s, t) => s + t.points, 0);
  const pct = Math.round((totalPoints / maxPoints) * 100);
  const allDone = completed.size === cfg.tasks.length;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2.5rem 1.5rem 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
            <Link href="/training/my-learning" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>← My Learning</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
            <span style={{ fontSize: "0.8rem", color: GOLD }}>Simulation</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ fontSize: 40 }}>{cfg.icon}</div>
            <div>
              <h1 style={{ margin: 0, color: WHITE, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800 }}>
                {cfg.label} Simulation
              </h1>
              <p style={{ margin: "0.3rem 0 0", color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", maxWidth: "60ch" }}>{cfg.intro}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "1.5rem", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                {completed.size} / {cfg.tasks.length} tasks · {totalPoints} pts
              </span>
              <span style={{ fontSize: "0.85rem", color: GOLD, fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 999, height: 8 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: allDone ? "#22C55E" : GOLD, borderRadius: 999, transition: "width 0.5s ease" }} />
            </div>
            {allDone && (
              <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                <span style={{ background: "#22C55E", color: WHITE, padding: "0.35rem 1rem", borderRadius: 999, fontSize: "0.8rem", fontWeight: 700 }}>
                  🏆 Simulation Complete — {totalPoints} points earned!
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tasks */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cfg.tasks.map((task, idx) => {
            const done = completed.has(task.id);
            return (
              <div
                key={task.id}
                style={{
                  background: WHITE,
                  border: `1.5px solid ${done ? "#BBF7D0" : "#E2E8F0"}`,
                  borderLeft: `5px solid ${done ? "#22C55E" : cfg.color}`,
                  borderRadius: 10,
                  padding: "1.25rem 1.5rem",
                  opacity: done ? 0.85 : 1,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  {/* Step number */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: done ? "#22C55E" : `${cfg.color}15`,
                    border: `2px solid ${done ? "#22C55E" : cfg.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? "1.1rem" : "0.9rem", fontWeight: 800,
                    color: done ? WHITE : cfg.color,
                  }}>
                    {done ? "✓" : idx + 1}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.95rem", color: DARK }}>{task.title}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 999, fontSize: "0.68rem", fontWeight: 700,
                        background: `${DIFFICULTY_COLOR[task.difficulty]}15`,
                        color: DIFFICULTY_COLOR[task.difficulty],
                        border: `1px solid ${DIFFICULTY_COLOR[task.difficulty]}30`,
                      }}>{task.difficulty}</span>
                      <span style={{ fontSize: "0.72rem", color: "#9CA3AF", fontWeight: 600 }}>+{task.points} pts</span>
                    </div>
                    <p style={{ margin: "0 0 0.75rem", fontSize: "0.83rem", color: "#6B7280", lineHeight: 1.6 }}>{task.description}</p>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                      <Link
                        href={task.toolUrl}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "0.5rem 1rem", borderRadius: 8,
                          background: done ? "#F3F4F6" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`,
                          color: done ? "#9CA3AF" : WHITE,
                          fontSize: "0.8rem", fontWeight: 700, textDecoration: "none",
                          pointerEvents: done ? "none" : "auto",
                        }}
                      >
                        {task.toolIcon} Open {task.tool}
                      </Link>
                      {!done && (
                        <button
                          onClick={() => markComplete(task)}
                          style={{
                            padding: "0.5rem 1rem", borderRadius: 8, border: `1.5px solid #22C55E`,
                            background: "transparent", color: "#16A34A", fontSize: "0.8rem", fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                      {done && <span style={{ fontSize: "0.78rem", color: "#16A34A", fontWeight: 600 }}>✅ Completed</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other simulations */}
        <div style={{ marginTop: "2.5rem" }}>
          <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}>Other Simulations</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Object.entries(INDUSTRY_CONFIG).filter(([key]) => key !== industry).map(([key, c]) => (
              <Link
                key={key}
                href={`/training/simulate/${key}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.45rem 0.9rem", borderRadius: 8, border: "1.5px solid #E2E8F0", background: WHITE, textDecoration: "none", fontSize: "0.78rem", color: DARK, fontWeight: 600 }}
              >
                {c.icon} {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
