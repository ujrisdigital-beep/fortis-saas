import Link from 'next/link'

export const metadata = {
  title: 'Compliance Centre — FORTIS OS',
  description: 'FORTIS OS regulatory compliance status: GDPA 2018, UK GDPR, ISO 27001, data residency, and platform integrity.',
}

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0A2E1A'

type StatusType = 'live' | 'pursuing' | 'planned' | 'partial'

const STATUS: Record<StatusType, { label: string; bg: string; color: string; border: string }> = {
  live:      { label: 'Live',      bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
  pursuing:  { label: 'Pursuing',  bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' },
  planned:   { label: 'Planned',   bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD' },
  partial:   { label: 'Partial',   bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
}

interface Claim {
  claim: string
  status: StatusType
  evidence: string
  target?: string
}

const COMPLIANCE_ITEMS: { category: string; items: Claim[] }[] = [
  {
    category: 'Data Protection & Privacy',
    items: [
      {
        claim: 'Gambia Data Protection Act 2018 (GDPA 2018)',
        status: 'live',
        evidence: 'Privacy Policy published at /privacy. Data categories, legal bases, user rights, and retention schedule documented. Cross-border transfer notifications to GDPC as required by GDPA 2018 Part VI.',
      },
      {
        claim: 'UK General Data Protection Regulation (UK GDPR)',
        status: 'live',
        evidence: 'UK GDPR Article 13/14 disclosures in Privacy Policy. UJU GROUP LIMITED designated as UK Data Controller. ICO escalation path provided. SCCs with Vercel for international transfers.',
      },
      {
        claim: 'ECOWAS Supplementary Act on Personal Data Protection',
        status: 'partial',
        evidence: 'Core principles (proportionality, purpose limitation, data subject rights) implemented. Formal ECOWAS notification procedure to be completed Q3 2026.',
        target: 'Q3 2026',
      },
      {
        claim: 'Cookie Consent (GDPA 2018 Art. 14)',
        status: 'planned',
        evidence: 'Cookie inventory documented in Privacy Policy. Consent banner implementation scheduled.',
        target: '1 July 2026',
      },
    ],
  },
  {
    category: 'Information Security',
    items: [
      {
        claim: 'ISO/IEC 27001:2022 Certification',
        status: 'pursuing',
        evidence: 'Information Security Management System (ISMS) design in progress. Gap analysis underway. No formal certification yet — we do not claim compliance. Target: formal audit and certification.',
        target: 'Q4 2026',
      },
      {
        claim: 'TLS 1.3 Encryption (all connections)',
        status: 'live',
        evidence: 'Vercel Edge Network enforces HTTPS / TLS 1.3 on all platform endpoints. HTTP requests are redirected.',
      },
      {
        claim: 'HTTP Security Headers',
        status: 'live',
        evidence: 'X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection, Content-Security-Policy, Referrer-Policy, Permissions-Policy — configured in next.config.js.',
      },
      {
        claim: 'Password Security (bcrypt cost-12)',
        status: 'live',
        evidence: 'All user passwords hashed with bcrypt cost factor 12. Plain-text passwords are never stored or transmitted.',
      },
      {
        claim: 'DDoS Protection',
        status: 'live',
        evidence: 'Vercel Edge Network provides layer-3/4 and layer-7 DDoS mitigation globally.',
      },
    ],
  },
  {
    category: 'Platform Integrity',
    items: [
      {
        claim: '26 modules live on platform',
        status: 'partial',
        evidence: 'Current live module count: 20+ pages and tools live (UJU Cycle, IKENGA, Ask UJRIS, Training Hub, Knowledge Hub, TANGO Directory, Agriculture, Airport, Car Hire, Marketplace, Funding, Legal Centre, Documents, Forensic, Carbon Credits, Produce Map, Financial Map, Status, Admin Dashboard, Master Dashboard). Additional modules (Gambia Dashboard, Airport Dashboard, Data Sources) in internal beta. We are updating all public-facing claims to reflect verified count.',
      },
      {
        claim: 'Credit Scoring Engine — advisory outputs only',
        status: 'live',
        evidence: 'API endpoint /api/v2/credit-score includes disclaimer on every response: "Score is advisory. Final lending decision rests with the financial institution." Beta status declared in Terms of Service Section 2.',
      },
      {
        claim: 'Carbon Credit Origination',
        status: 'planned',
        evidence: 'Module in specification phase. Not yet live. Declared as Beta/Pilot in Terms of Service. No carbon credits have been originated or sold through the platform.',
        target: 'Q3 2026',
      },
      {
        claim: 'Sovereign Digital Infrastructure',
        status: 'partial',
        evidence: 'Platform serves Gambian public and private sector data needs on cloud infrastructure. "Sovereign Digital Infrastructure" refers to our roadmap goal of Gambia-resident data hosting. Current infrastructure: Vercel (US edge, iad1 region) + PostgreSQL via Neon. Gambia-resident infrastructure under active evaluation.',
      },
      {
        claim: 'National Digital Asset designation',
        status: 'planned',
        evidence: 'This designation is aspirational and proposed — not yet officially conferred by the Government of The Gambia. We are engaged in dialogue with relevant ministries. We do not claim formal government endorsement.',
      },
    ],
  },
  {
    category: 'AI Output Safety',
    items: [
      {
        claim: 'ASK UJRIS™ legal disclaimer on all outputs',
        status: 'live',
        evidence: 'Every ASK UJRIS API response includes: "This analysis is for informational purposes only and does not constitute legal advice." Displayed prominently in the UI and documented in Terms of Service Section 4.',
      },
      {
        claim: 'UJU Cycle™ — diagnostic tool disclaimer',
        status: 'live',
        evidence: 'UJU Cycle outputs are labelled as diagnostic tools only, not accounting or financial advice. Confidence indicators shown where available.',
      },
      {
        claim: 'IKENGA™ — content suggestion disclaimer',
        status: 'live',
        evidence: 'IKENGA brand outputs are labelled as AI-generated suggestions. Brand positioning decisions should involve qualified marketing professionals — stated in UI and Terms.',
      },
      {
        claim: 'Low-confidence output flagging',
        status: 'partial',
        evidence: 'Credit scoring engine flags LOW / MEDIUM / HIGH confidence based on data availability. Systematic confidence flagging across all AI tools is in progress.',
        target: 'Q2 2026',
      },
    ],
  },
  {
    category: 'Trademarks & Intellectual Property',
    items: [
      {
        claim: 'FORTIS OS™ trademark',
        status: 'pursuing',
        evidence: 'Trademark application in progress for FORTIS OS™ in Class 42 (software-as-a-service). UJU GROUP LIMITED is the applicant. Not yet registered.',
        target: 'H2 2026',
      },
      {
        claim: 'IKENGA™, UJU Cycle™, ASK UJRIS™, UJU GROUP™',
        status: 'pursuing',
        evidence: 'All brand names are claimed as unregistered trademarks of UJU GROUP LIMITED. Formal trademark applications pending.',
        target: 'H2 2026',
      },
      {
        claim: 'AI model training — no user data used without consent',
        status: 'live',
        evidence: "OpenAI's data processing agreement prohibits use of API inputs for training. FORTIS OS does not use user business data for AI model training. Documented in Privacy Policy Section 4.",
      },
    ],
  },
]

function StatusBadge({ status }: { status: StatusType }) {
  const s = STATUS[status]
  return (
    <span style={{
      display: 'inline-block',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 999, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

export default function CompliancePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, padding: '3rem 1.5rem 2.5rem', borderBottom: `2px solid ${GOLD}40` }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}20`, border: `1px solid ${GOLD}50`, borderRadius: 999, padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Compliance Centre
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff' }}>
            Platform Compliance & Integrity
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: '60ch' }}>
            Transparent record of FORTIS OS regulatory compliance status, platform claims, and our commitments to users and regulators. Last reviewed: 3 May 2026.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {(Object.keys(STATUS) as StatusType[]).map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StatusBadge status={s} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>

        <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: '#1E40AF' }}>
          <strong>Our commitment to transparency:</strong> We list every major claim this platform makes and evidence it — including items we are still working toward. &ldquo;Pursuing&rdquo; means work is underway but certification or status is not yet achieved. We will never state compliance we have not earned.
        </div>

        {COMPLIANCE_ITEMS.map(section => (
          <div key={section.category} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: G, margin: '0 0 1rem', paddingBottom: 8, borderBottom: '2px solid #e2e8f0' }}>
              {section.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              {section.items.map(item => (
                <div key={item.claim} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <StatusBadge status={item.status} />
                    <strong style={{ fontSize: '0.9rem', color: '#1a1a1a', flex: 1 }}>{item.claim}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.83rem', color: '#4b5563', lineHeight: 1.65 }}>{item.evidence}</p>
                  {item.target && (
                    <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Target: {item.target}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: '#fff', border: `1px solid ${G}30`, borderRadius: 12, padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: G }}>Platform SLA &amp; Uptime</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: '0.85rem' }}>
            {[
              { label: 'Target Uptime', value: '99.5%', note: 'Monthly rolling average' },
              { label: 'Hosting Provider', value: 'Vercel Inc.', note: 'Edge network, global CDN' },
              { label: 'Database', value: 'Neon (PostgreSQL)', note: 'Serverless, auto-failover' },
              { label: 'AI Provider', value: 'OpenAI API', note: 'GPT-4 with fallback engine' },
              { label: 'Incident Response', value: '< 4 hours', note: 'For P0 incidents' },
              { label: 'Maintenance Window', value: 'Sundays 02:00–04:00 UTC', note: 'Announced 48h in advance' },
            ].map(m => (
              <div key={m.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontWeight: 800, color: G, fontSize: '0.95rem', margin: '2px 0' }}>{m.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{m.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: `1px solid ${G}30`, borderRadius: 12, padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: G }}>Contact &amp; Regulatory Enquiries</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, fontSize: '0.85rem' }}>
            {[
              { label: 'Privacy / Data Rights', email: 'privacy@fortisos.gm', note: 'GDPA 2018 + UK GDPR requests' },
              { label: 'Legal Inquiries', email: 'legal@fortisos.gm', note: 'Contracts, IP, court orders' },
              { label: 'Security Reports', email: 'security@fortisos.gm', note: 'Responsible disclosure' },
              { label: 'Enterprise / API', email: 'enterprise@fortisos.gm', note: 'Institutional access & SLA' },
            ].map(c => (
              <div key={c.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.75rem 1rem' }}>
                <div style={{ fontWeight: 700, color: '#374151', marginBottom: 2 }}>{c.label}</div>
                <a href={`mailto:${c.email}`} style={{ color: G, fontWeight: 600, fontSize: '0.83rem', textDecoration: 'none' }}>{c.email}</a>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>{c.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.83rem', color: '#6b7280' }}>
            <strong>Gambia regulator:</strong> Gambia Data Protection Commission (GDPC) — gdpc.gov.gm &nbsp;|&nbsp;
            <strong>UK regulator:</strong> Information Commissioner&apos;s Office — <a href="https://ico.org.uk" style={{ color: G }} target="_blank" rel="noopener noreferrer">ico.org.uk</a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', flexWrap: 'wrap' as const, gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2026 UJU GROUP LIMITED · FORTIS OS™</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ fontSize: '0.8rem', color: G }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: '0.8rem', color: G }}>Terms of Service</Link>
            <Link href="/legal/inquiries" style={{ fontSize: '0.8rem', color: G }}>Legal Inquiries</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
