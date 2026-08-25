import Link from 'next/link'

export const metadata = {
  title: 'Pricing — FORTIS OS',
  description: 'FORTIS OS access tiers: Free, Standard, and Enterprise. AI-powered business intelligence for Gambia.',
}

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0A2E1A'

const TIERS = [
  {
    name: 'Free',
    price: null,
    priceNote: 'Always free',
    description: 'Full access to public intelligence resources. No card required.',
    cta: 'Start Free',
    ctaHref: '/auth/register',
    highlight: false,
    features: [
      { label: 'Knowledge Hub — all 6 categories', included: true },
      { label: 'TANGO Business Directory', included: true },
      { label: 'Agriculture & Produce Map', included: true },
      { label: 'Forest, Telecom & Digital Economy data', included: true },
      { label: 'Training Hub — browse all courses', included: true },
      { label: 'Public sector data & national statistics', included: true },
      { label: 'Platform status & API docs (read-only)', included: true },
      { label: 'UJU Cycle™ AI analysis', included: false },
      { label: 'IKENGA™ brand intelligence', included: false },
      { label: 'ASK UJRIS™ document forensics', included: false },
      { label: 'Credit Scoring Engine', included: false },
    ],
  },
  {
    name: 'Standard',
    price: 'D2,500',
    priceNote: 'per month · catalogue price_grow_diagnostic_gmd_v1 (GMD 250.00 one-off diagnostic) · or D22,500/yr',
    description: 'Full AI tool suite for entrepreneurs, SMEs, and professionals.',
    cta: 'Get Started',
    ctaHref: '/payment',
    highlight: true,
    features: [
      { label: 'Everything in Free', included: true },
      { label: 'UJU Cycle™ — unlimited business analyses', included: true },
      { label: 'IKENGA™ — brand identity & logo generation', included: true },
      { label: 'ASK UJRIS™ — document forensic analysis', included: true },
      { label: 'Credit Scoring Engine (advisory)', included: true },
      { label: 'Training Hub — enrol & earn certificates', included: true },
      { label: 'Analysis history — 90-day retention', included: true },
      { label: 'Export reports (PDF / CSV)', included: true },
      { label: 'Email support (48h response)', included: true },
      { label: 'API access', included: false },
      { label: 'Custom SLA / uptime guarantee', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceNote: 'Volume + SLA — contact us',
    description: 'For banks, telecoms, government agencies, and institutional partners.',
    cta: 'Contact Sales',
    ctaHref: '/enterprise',
    highlight: false,
    features: [
      { label: 'Everything in Standard', included: true },
      { label: 'API access — all endpoints', included: true },
      { label: 'Bulk business ID scoring (CSV upload)', included: true },
      { label: 'Custom SLA with 99.5% uptime guarantee', included: true },
      { label: 'Dedicated account manager', included: true },
      { label: 'White-label options (licensed)', included: true },
      { label: 'Data residency preferences', included: true },
      { label: 'Audit log exports', included: true },
      { label: 'Priority support (4h response)', included: true },
      { label: 'Training cohort licence (bulk enrolment)', included: true },
      { label: 'Co-branded deployment available', included: true },
    ],
  },
]

const FAQ = [
  {
    q: 'What currency are the prices in?',
    a: 'Prices shown in Gambian Dalasi (D). USD pricing: Standard ≈ $40/mo or $360/yr. Enterprise pricing is negotiated in your preferred currency.',
  },
  {
    q: 'How do I pay?',
    a: 'Cards via Stripe (Visa, Mastercard). Mobile money and bank transfer available for Enterprise. Card data is never stored on our servers.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'Yes — if AI tools produce no usable output within 14 days of your first payment, contact legal@fortisos.gm for a full refund.',
  },
  {
    q: 'Can I use FORTIS OS as a government or donor-funded organisation?',
    a: 'Yes. We offer institutional access with procurement-compatible invoicing, data processing agreements, and co-branding options. Contact enterprise@fortisos.gm.',
  },
  {
    q: 'Are AI outputs suitable for final business or legal decisions?',
    a: 'No. All AI outputs are advisory indicators. Credit scores, legal flag analysis, and business diagnostics should inform but not replace professional advice. See our Terms of Service for full disclaimers.',
  },
  {
    q: 'Is the platform GDPA 2018 and UK GDPR compliant?',
    a: 'Yes. See our Compliance Centre and Privacy Policy for the full breakdown of data handling, retention, and your rights.',
  },
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, padding: '3rem 1.5rem 2.5rem', borderBottom: `2px solid ${GOLD}40`, textAlign: 'center' as const }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}20`, border: `1px solid ${GOLD}50`, borderRadius: 999, padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Pricing
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#fff' }}>
            Simple, transparent access
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.65 }}>
            Public data is always free. AI tools require a Standard subscription. Enterprise pricing is negotiated.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: '4rem' }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{
              background: '#fff',
              borderRadius: 14,
              border: tier.highlight ? `2px solid ${G}` : '1px solid #e2e8f0',
              padding: '1.75rem',
              position: 'relative' as const,
              boxShadow: tier.highlight ? `0 8px 32px ${G}20` : undefined,
            }}>
              {tier.highlight && (
                <div style={{ position: 'absolute' as const, top: -12, left: '50%', transform: 'translateX(-50%)', background: G, color: '#fff', borderRadius: 999, padding: '3px 14px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', whiteSpace: 'nowrap' as const }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: GOLD, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 4 }}>{tier.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: DARK }}>{tier.price ?? 'Free'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 8 }}>{tier.priceNote}</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>{tier.description}</p>
              </div>

              <Link href={tier.ctaHref} style={{
                display: 'block', textAlign: 'center' as const, textDecoration: 'none',
                background: tier.highlight ? `linear-gradient(135deg, ${DARK}, ${G})` : '#fff',
                color: tier.highlight ? '#fff' : G,
                border: `2px solid ${G}`,
                borderRadius: 10, padding: '0.65rem 1rem',
                fontSize: '0.88rem', fontWeight: 700,
                marginBottom: '1.25rem',
              }}>
                {tier.cta} →
              </Link>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                {tier.features.map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: f.included ? '#16a34a' : '#d1d5db', flexShrink: 0, fontSize: '0.95rem', marginTop: 1 }}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: f.included ? '#374151' : '#9ca3af', lineHeight: 1.5 }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: DARK, margin: '0 0 1.5rem', textAlign: 'center' as const }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {FAQ.map(faq => (
              <div key={faq.q} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: DARK, marginBottom: 6 }}>{faq.q}</div>
                <div style={{ fontSize: '0.83rem', color: '#6b7280', lineHeight: 1.65 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, borderRadius: 16, padding: '2.5rem', textAlign: 'center' as const, color: '#fff' }}>
          <h2 style={{ margin: '0 0 10px', fontWeight: 900, fontSize: '1.4rem' }}>Building at scale for The Gambia?</h2>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem' }}>Banks, government agencies, telecoms, and development partners — contact us for institutional access.</p>
          <Link href="/enterprise" style={{
            display: 'inline-block', textDecoration: 'none',
            background: GOLD, color: DARK,
            borderRadius: 10, padding: '0.8rem 2rem',
            fontSize: '0.9rem', fontWeight: 800,
          }}>
            Talk to Enterprise Sales →
          </Link>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' as const, fontSize: '0.78rem', color: '#9ca3af' }}>
          All prices include VAT where applicable. By subscribing you agree to our{' '}
          <Link href="/terms" style={{ color: G }}>Terms of Service</Link> and{' '}
          <Link href="/privacy" style={{ color: G }}>Privacy Policy</Link>.{' '}
          Payment processed by Stripe — card data never stored on our servers.
        </div>
      </div>
    </div>
  )
}
