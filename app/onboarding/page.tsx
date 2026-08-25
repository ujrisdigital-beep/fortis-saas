export const metadata = { title: "Onboarding — FORTIS" };

const STEPS = [
  { id: "account", label: "Create account with organisation", href: "/auth/register" },
  { id: "verify", label: "Verify email", href: "/auth/verify" },
  { id: "signin", label: "Sign in", href: "/auth/login" },
  { id: "grow", label: "Run a GROW preview (advisory only)", href: "/grow/workspace" },
  { id: "academy", label: "Browse approved courses", href: "/training/hub" },
  { id: "status", label: "Check service status", href: "/status" },
];

export default function OnboardingPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ color: "#C4943A", letterSpacing: "0.08em", fontSize: 12 }}>REAL USER ONBOARDING · PILOT</p>
      <h1>Get started on FORTIS</h1>
      <p>Marketplace checkout, fleet escrow and live card capture stay unavailable until a licensed provider is signed.</p>
      <ol>
        {STEPS.map((s) => (
          <li key={s.id} style={{ margin: "0.6rem 0" }}>
            <a href={s.href}>{s.label}</a>
          </li>
        ))}
      </ol>
    </main>
  );
}
