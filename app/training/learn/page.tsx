"use client";
// app/training/learn/page.tsx
// Token-gated learner portal — module progression + AI assessment
import { useState, useEffect, useRef } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  durationMin: number;
  quiz: QuizQuestion[];
}

const DEMO_MODULES: Module[] = [
  {
    id: "M01",
    title: "Introduction to Digital Literacy",
    content: `Welcome to the FORTIS Digital Skills Hub. In this module, you will learn what digital literacy means in the context of The Gambia's growing digital economy.

Digital literacy is the ability to use information and communication technologies to find, evaluate, create, and communicate information. In today's Gambia, this skill is essential — from mobile money agents in Serrekunda to civil servants in Banjul, digital skills open doors.

**Why does it matter?**
The Gambia has over 3.2 million mobile subscribers and 54% internet penetration. Businesses are moving online. Government services are going digital. If you can navigate digital tools confidently, you are ahead of the curve.

**Key concepts covered:**
- What is digital literacy and why it matters in Gambia
- The four pillars: Access, Evaluate, Create, Communicate
- Common digital tools used in Gambian workplaces
- How to stay safe online (cybersecurity basics)
- Your digital footprint and reputation

**Practical exercise:**
By the end of this module, you should be able to explain to a colleague what digital literacy means and give three examples of how it applies to your daily work or studies.`,
    videoUrl: null,
    durationMin: 30,
    quiz: [
      { q: "What is digital literacy?", options: ["Ability to use ICT tools effectively", "Knowing how to type fast", "Having a smartphone", "Programming skill"], correct: 0, explanation: "Digital literacy means using ICT tools to find, evaluate, create and communicate information." },
      { q: "What percentage of Gambians have internet access?", options: ["About 54%", "About 12%", "About 90%", "About 30%"], correct: 0, explanation: "The Gambia has approximately 54% internet penetration as of recent data." },
      { q: "Which is NOT one of the four pillars of digital literacy?", options: ["Speed", "Access", "Evaluate", "Create"], correct: 0, explanation: "The four pillars are Access, Evaluate, Create, and Communicate — Speed is not a pillar." },
    ],
  },
  {
    id: "M02",
    title: "Internet Safety & Cybersecurity",
    content: `In this module, we cover how to protect yourself and your data online. Cyber threats are real in Gambia — from phishing SMS messages to compromised social media accounts.

**Common threats to know:**
1. **Phishing** — fake emails/SMS tricking you into giving passwords
2. **SIM Swap fraud** — criminals use your phone number to steal mobile money
3. **Social engineering** — people pretending to be officials to get your data
4. **Malware** — harmful software hidden in downloads

**How to protect yourself:**
- Use strong, unique passwords (minimum 12 characters, mix of letters/numbers/symbols)
- Enable two-factor authentication (2FA) on all important accounts
- Never share OTP codes — no bank or telecoms agent will ever ask for your OTP
- Update your software and apps regularly
- Only download apps from official stores (Google Play, App Store)

**Gambia-specific risks:**
Mobile money fraud is the most common digital crime in The Gambia. Always verify the sender before sending money. If someone claims to be from Wave, Africell, or a government agency, call the official number to confirm.

**Your action plan:**
After this module, update your most important password and enable 2FA on your email and mobile money account.`,
    videoUrl: null,
    durationMin: 35,
    quiz: [
      { q: "What is a phishing attack?", options: ["Fake messages tricking you into sharing passwords", "A type of fishing", "Hacking your WiFi", "Deleting your files"], correct: 0, explanation: "Phishing uses fake messages (email, SMS) to trick people into revealing passwords or financial details." },
      { q: "What should you NEVER share with anyone?", options: ["Your OTP code", "Your name", "Your job title", "Your email address"], correct: 0, explanation: "OTP (One-Time Password) codes must never be shared. Legitimate services will never ask for them." },
      { q: "What is the most common digital crime in The Gambia?", options: ["Mobile money fraud", "Email hacking", "Website defacement", "Ransomware"], correct: 0, explanation: "Mobile money fraud (especially SIM swap and social engineering) is the most prevalent digital crime in The Gambia." },
    ],
  },
];

type View = "modules" | "learn" | "quiz" | "result";

export default function LearnerPortalPage() {
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [view, setView] = useState<View>("modules");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const [assessResult, setAssessResult] = useState<{ score: number; passed: boolean; message: string } | null>(null);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  const module = DEMO_MODULES[currentModuleIdx];
  const totalModules = DEMO_MODULES.length;
  const progress = Math.round((completed.length / totalModules) * 100);

  // Tab-switch detection
  useEffect(() => {
    if (view !== "quiz") return;
    const onBlur = () => setTabSwitches((n) => n + 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [view]);

  function openModule(idx: number) {
    setCurrentModuleIdx(idx);
    setView("learn");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  }

  function startQuiz() {
    setView("quiz");
    startTimeRef.current = Date.now();
    setTabSwitches(0);
  }

  function submitQuiz() {
    const q = module.quiz;
    let correct = 0;
    q.forEach((item, i) => {
      if (quizAnswers[i] === item.correct) correct++;
    });
    const score = Math.round((correct / q.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 70) {
      setCompleted((prev) => prev.includes(module.id) ? prev : [...prev, module.id]);
    }
  }

  async function submitFinalAssessment() {
    setSubmittingFinal(true);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const answers = Object.entries(quizAnswers).map(([qi, sel]) => ({
      moduleId: module.id,
      questionIndex: Number(qi),
      selectedOption: sel,
    }));
    try {
      const res = await fetch("/api/training/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          programId: "demo-program",
          modules: DEMO_MODULES,
          answers,
          tabSwitches,
          timeSpentSeconds: timeSpent,
        }),
      });
      const data = await res.json();
      setAssessResult({ score: data.score, passed: data.passed, message: data.message });
      setView("result");
    } catch {
      setAssessResult({ score: 0, passed: false, message: "Assessment submission failed. Please retry." });
      setView("result");
    } finally {
      setSubmittingFinal(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.25rem 1.5rem", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>FORTIS Digital Skills Hub</div>
            <h1 style={{ margin: "0.2rem 0 0", color: WHITE, fontSize: "1.1rem", fontWeight: 800 }}>Digital Literacy Fundamentals</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Progress</div>
              <div style={{ fontWeight: 800, color: GOLD, fontSize: "1.1rem" }}>{progress}%</div>
            </div>
            <div style={{ width: 60, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: GOLD, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem" }}>

        {/* Sidebar */}
        <aside>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden", position: "sticky", top: 80 }}>
            <div style={{ background: PRIMARY, padding: "0.75rem 1rem" }}>
              <div style={{ color: GOLD, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Course Modules</div>
            </div>
            {DEMO_MODULES.map((m, i) => {
              const done = completed.includes(m.id);
              const active = currentModuleIdx === i && view !== "modules";
              return (
                <button
                  key={m.id}
                  onClick={() => openModule(i)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
                    padding: "0.85rem 1rem", background: active ? "#EFF6FF" : "transparent",
                    border: "none", borderBottom: "1px solid #F0F4F0", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{done ? "✅" : "⭕"}</span>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: active ? 700 : 500, color: active ? PRIMARY : DARK }}>{m.title}</div>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>⏱ {m.durationMin} min</div>
                  </div>
                </button>
              );
            })}
            <div style={{ padding: "1rem" }}>
              {completed.length === totalModules ? (
                <a href="/training/hub" style={{ display: "block", textAlign: "center", padding: "0.6rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
                  🏅 Get Certificate
                </a>
              ) : (
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center" }}>
                  Complete all modules to unlock your certificate
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {view === "modules" && (
            <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>📚</div>
              <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.2rem", fontWeight: 800 }}>Welcome to Your Course</h2>
              <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                This course has {totalModules} modules. Click any module in the sidebar to begin. Complete all modules and pass the quiz to earn your FORTIS certificate.
              </p>
              <button onClick={() => openModule(0)} style={{ padding: "0.75rem 2rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Start Learning →
              </button>
            </div>
          )}

          {view === "learn" && (
            <div>
              <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.25rem 1.5rem" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginBottom: 4 }}>Module {currentModuleIdx + 1} of {totalModules}</div>
                  <h2 style={{ margin: 0, color: WHITE, fontSize: "1.1rem", fontWeight: 800 }}>{module.title}</h2>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                    {module.content}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                {currentModuleIdx > 0 && (
                  <button onClick={() => openModule(currentModuleIdx - 1)} style={{ padding: "0.65rem 1.25rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    ← Previous
                  </button>
                )}
                <button onClick={startQuiz} style={{ padding: "0.65rem 1.5rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Take Quiz →
                </button>
              </div>
            </div>
          )}

          {view === "quiz" && (
            <div>
              {tabSwitches > 0 && (
                <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "0.65rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#92400E" }}>
                  ⚠️ Tab switch detected ({tabSwitches}x). Excessive switching may flag your assessment for review.
                </div>
              )}
              <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
                <h2 style={{ margin: "0 0 1.25rem", color: DARK, fontSize: "1rem", fontWeight: 800 }}>📝 Quiz: {module.title}</h2>
                {module.quiz.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: DARK, marginBottom: "0.65rem" }}>
                      {qi + 1}. {q.q}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {q.options.map((opt, oi) => {
                        const selected = quizAnswers[qi] === oi;
                        const showResult = quizSubmitted;
                        const isCorrect = oi === q.correct;
                        let bg = selected ? "#EFF6FF" : WHITE;
                        let border = selected ? `2px solid ${PRIMARY}` : "1.5px solid #E2E8F0";
                        if (showResult && isCorrect) { bg = "#D1FAE5"; border = "2px solid #16A34A"; }
                        if (showResult && selected && !isCorrect) { bg = "#FEE2E2"; border = "2px solid #DC2626"; }
                        return (
                          <button
                            key={oi}
                            disabled={quizSubmitted}
                            onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [qi]: oi }))}
                            style={{ background: bg, border, borderRadius: 8, padding: "0.65rem 1rem", textAlign: "left", cursor: quizSubmitted ? "default" : "pointer", fontSize: "0.85rem", color: DARK, fontFamily: "inherit" }}
                          >
                            {String.fromCharCode(65 + oi)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#065F46", background: "#D1FAE5", borderRadius: 6, padding: "0.4rem 0.75rem" }}>
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < module.quiz.length}
                    style={{ padding: "0.7rem 1.75rem", background: Object.keys(quizAnswers).length < module.quiz.length ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, cursor: Object.keys(quizAnswers).length < module.quiz.length ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div style={{ background: quizScore! >= 70 ? "#D1FAE5" : "#FEE2E2", border: `1px solid ${quizScore! >= 70 ? "#6EE7B7" : "#FECACA"}`, borderRadius: 10, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: quizScore! >= 70 ? "#065F46" : "#991B1B" }}>
                      {quizScore! >= 70 ? "✅ Passed!" : "❌ Not yet"} — {quizScore}%
                    </div>
                    <div style={{ fontSize: "0.82rem", color: quizScore! >= 70 ? "#065F46" : "#991B1B" }}>
                      {quizScore! >= 70 ? "Module complete. Well done!" : "Review the material and try again."}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {quizScore! < 70 && (
                      <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setView("learn"); }} style={{ padding: "0.6rem 1.25rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Review Module
                      </button>
                    )}
                    {quizScore! >= 70 && currentModuleIdx < totalModules - 1 && (
                      <button onClick={() => openModule(currentModuleIdx + 1)} style={{ padding: "0.6rem 1.25rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Next Module →
                      </button>
                    )}
                    {quizScore! >= 70 && currentModuleIdx === totalModules - 1 && (
                      <button onClick={submitFinalAssessment} disabled={submittingFinal} style={{ padding: "0.6rem 1.25rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, border: "none", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, cursor: submittingFinal ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                        {submittingFinal ? "⏳ Submitting…" : "🏅 Submit for Certificate"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === "result" && assessResult && (
            <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: "1rem" }}>{assessResult.passed ? "🏅" : "📚"}</div>
              <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.3rem", fontWeight: 800 }}>
                {assessResult.passed ? "Congratulations!" : "Keep Going!"}
              </h2>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: assessResult.passed ? "#16A34A" : "#D97706", marginBottom: "0.75rem" }}>
                {assessResult.score}%
              </div>
              <p style={{ color: "#4B5563", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                {assessResult.message}
              </p>
              {assessResult.passed ? (
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/training/verify" style={{ padding: "0.7rem 1.5rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 800, textDecoration: "none" }}>
                    View Certificate
                  </a>
                  <a href="/training/hub" style={{ padding: "0.7rem 1.5rem", background: WHITE, border: "1.5px solid #E2E8F0", color: DARK, borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
                    More Courses
                  </a>
                </div>
              ) : (
                <button onClick={() => { setView("modules"); setCompleted([]); }} style={{ padding: "0.7rem 1.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Restart Course
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
