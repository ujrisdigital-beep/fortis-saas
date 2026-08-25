import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — FORTIS OS', description: 'FORTIS OS Privacy Policy — GDPA 2018 and UK GDPR compliant.' }

const G = '#1B4D3E'
const GOLD = '#C4943A'
const LAST_UPDATED = '24 August 2026'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #0A2E1A, ${G})`, padding: '3rem 1.5rem 2.5rem', borderBottom: `2px solid ${GOLD}40` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}20`, border: `1px solid ${GOLD}50`, borderRadius: 999, padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal Document
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff' }}>Privacy Policy</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Last updated: {LAST_UPDATED} · Effective: 1 January 2025 · Jurisdiction: The Gambia + United Kingdom
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Compliance badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '2.5rem' }}>
          {[
            { label: 'GDPA 2018', note: 'Gambia Data Protection Act' },
            { label: 'UK GDPR', note: 'UK General Data Protection Regulation' },
            { label: 'ECOWAS Data Policy', note: 'Regional framework' },
          ].map(b => (
            <div key={b.label} style={{ background: '#fff', border: `1px solid ${G}30`, borderRadius: 8, padding: '8px 14px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G }}>{b.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{b.note}</div>
            </div>
          ))}
        </div>

        <Section title="1. Who We Are">
          <p>FORTIS OS is a product of <strong>UJU GROUP LIMITED</strong>, a company registered in England and Wales (Company No. [registration pending]).</p>
          <ul>
            <li><strong>Trading name:</strong> FORTIS OS™ / FORTIS INVICTA LTD</li>
            <li><strong>Platform:</strong> https://fortisos.cloud</li>
            <li><strong>Data Controller (UK):</strong> UJU GROUP LIMITED</li>
            <li><strong>Data Controller (Gambia):</strong> FORTIS INVICTA LTD (operating entity)</li>
            <li><strong>Contact:</strong> <a href="mailto:legal@fortisos.gm" style={{ color: G }}>legal@fortisos.gm</a></li>
            <li><strong>Data Protection queries:</strong> <a href="mailto:privacy@fortisos.gm" style={{ color: G }}>privacy@fortisos.gm</a></li>
          </ul>
        </Section>

        <Section title="2. Data We Collect">
          <p>We collect the following categories of personal data:</p>
          <Table rows={[
            ['Account data','Name, email, password (hashed with bcrypt)','Account creation'],
            ['Usage data','Pages visited, tools used, session duration','Analytics & improvement'],
            ['Business data','Business name, sector, employee count, revenue inputs','AI tool functionality'],
            ['Document data','Text of uploaded/pasted documents (UJRIS)','Forensic analysis — not stored permanently'],
            ['Payment data','Transfer reference, declared amount, payer name, proof note — no card PAN','Bank/wallet transfer rail'],
            ['Technical data','IP address, browser type, device type, referring URL','Security & analytics'],
            ['Communications','Emails sent via legal@fortisos.gm','Legal response tracking'],
          ]} headers={['Category', 'What we collect', 'Why']} />
        </Section>

        <Section title="3. Legal Basis for Processing (GDPA 2018 + UK GDPR)">
          <Table rows={[
            ['Contract performance','Providing AI tools when you use the platform','Account usage, tool delivery'],
            ['Legitimate interests','Platform security, fraud prevention, improvement','Analytics, security headers, audit logs'],
            ['Consent','Marketing communications (if opted in)','Email marketing'],
            ['Legal obligation','Responding to court orders or regulatory demands','Court Order / Legal Process category'],
          ]} headers={['Basis', 'Explanation', 'Applied to']} />
        </Section>

        <Section title="4. How We Use Your Data">
          <ul>
            <li>Deliver diagnostics (GROW / UJU Cycle™) and optional Gemini narrative</li>
            <li>Generate business transformation reports and brand intelligence assessments</li>
            <li>Maintain platform security and prevent fraudulent use</li>
            <li>Improve AI model accuracy (anonymised, aggregated only)</li>
            <li>Send transactional emails (account verification, password reset)</li>
            <li>Respond to legal inquiries and court orders</li>
          </ul>
          <p><strong>We do not:</strong> sell your data to third parties, use your data for advertising profiling, or share identifiable business data with financial institutions without your explicit consent.</p>
        </Section>

        <Section title="5. Data Residency & Transfers">
          <p>Your data is processed on infrastructure hosted by <strong>Vercel Inc.</strong> (US-based, with edge nodes in Washington DC — iad1 region). Vercel is certified under the EU-US Data Privacy Framework.</p>
          <p>Our database is hosted by <strong>Supabase / Neon (PostgreSQL)</strong>. We are actively evaluating Gambia-resident infrastructure options as part of our Sovereign Digital Infrastructure roadmap.</p>
          <p>International transfers to the UK and EU are covered by Vercel's Standard Contractual Clauses (SCCs). We notify the Gambia Data Protection Commission (GDPC) of cross-border transfers as required by GDPA 2018 Part VI.</p>
        </Section>

        <Section title="6. Retention">
          <Table rows={[
            ['Account data','Duration of account + 2 years','Legal obligation'],
            ['Business analysis outputs','90 days (deletable on request)','Service delivery'],
            ['Document analysis inputs','Deleted after analysis — not stored','Privacy by design'],
            ['Audit logs','7 years','Regulatory / legal compliance'],
            ['Marketing consent records','Until withdrawn + 3 years','Evidence of consent'],
          ]} headers={['Data type', 'Retention period', 'Reason']} />
        </Section>

        <Section title="7. Your Rights">
          <p>Under GDPA 2018 and UK GDPR, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of your personal data</li>
            <li><strong>Rectification</strong> — correct inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion ("right to be forgotten")</li>
            <li><strong>Restriction</strong> — limit how we process your data</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong>Object</strong> — object to processing based on legitimate interests</li>
            <li><strong>Withdraw consent</strong> — at any time for consent-based processing</li>
          </ul>
          <p>To exercise any right: email <a href="mailto:privacy@fortisos.gm" style={{ color: G }}>privacy@fortisos.gm</a> with subject line "Data Rights Request — [your right]". We respond within <strong>30 days</strong> (GDPA 2018) / <strong>30 days</strong> (UK GDPR).</p>
          <p>To escalate: Contact the <strong>Gambia Data Protection Commission (GDPC)</strong> at gdpc.gov.gm, or the <strong>UK ICO</strong> at ico.org.uk.</p>
        </Section>

        <Section title="8. Cookies">
          <p>We use the following cookies:</p>
          <Table rows={[
            ['next-auth.session-token','Authentication session','Session','Strictly necessary'],
            ['__vercel_live_token','Vercel deployment preview','Session','Technical'],
            ['_ga / _gid','Google Analytics (if enabled)','2 years / 24h','Analytics — consent required'],
          ]} headers={['Cookie', 'Purpose', 'Duration', 'Category']} />
          <p>We do not currently use advertising or tracking cookies. A cookie consent banner will be implemented by 1 July 2026 to meet GDPA 2018 requirements fully.</p>
        </Section>

        <Section title="9. Security">
          <p>We implement the following technical and organisational measures:</p>
          <ul>
            <li>HTTPS / TLS 1.3 on all connections</li>
            <li>HTTP security headers: X-Frame-Options: DENY, X-XSS-Protection, Content-Security-Policy, Referrer-Policy</li>
            <li>Passwords hashed with bcrypt (cost factor 12)</li>
            <li>API keys stored as environment variables (never in code)</li>
            <li>Vercel Edge Network DDoS protection</li>
            <li>Access control: admin routes protected by session-based authentication</li>
          </ul>
          <p><em>Note: We are currently pursuing ISO 27001 certification. Our target certification date is Q4 2026. Until certification is achieved, we do not formally claim ISO 27001 compliance.</em></p>
        </Section>

        <Section title="10. Third-Party Services">
          <Table rows={[
            ['Gemini (optional BYOK)','Optional GROW narrative if GEMINI_API_KEY is set','Off by default; deterministic report otherwise'],
            ['Vercel','Hosting & CDN','Your data transits Vercel infrastructure'],
            ['Prisma / PostgreSQL','Database ORM','On-infrastructure database'],
            ['Resend','Transactional email','Your email address is passed to Resend for delivery'],
          ]} headers={['Service', 'Purpose', 'Data handling']} />
        </Section>

        <Section title="11. Children">
          <p>FORTIS OS is not directed at persons under 18. We do not knowingly collect data from minors. If you believe a minor has submitted data, contact privacy@fortisos.gm immediately.</p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>We will notify registered users of material changes by email and update the "Last updated" date above. Continued use of the platform after notification constitutes acceptance.</p>
        </Section>

        <Section title="13. Contact & Complaints">
          <ul>
            <li><strong>Privacy queries:</strong> <a href="mailto:privacy@fortisos.gm" style={{ color: G }}>privacy@fortisos.gm</a></li>
            <li><strong>Legal inquiries:</strong> <a href="mailto:legal@fortisos.gm" style={{ color: G }}>legal@fortisos.gm</a></li>
            <li><strong>Gambia regulator:</strong> Gambia Data Protection Commission (GDPC)</li>
            <li><strong>UK regulator:</strong> Information Commissioner's Office — <a href="https://ico.org.uk" style={{ color: G }} target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
          </ul>
        </Section>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2026 UJU GROUP LIMITED · FORTIS OS™ · All rights reserved</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/terms" style={{ fontSize: '0.8rem', color: G }}>Terms of Service</Link>
            <Link href="/compliance" style={{ fontSize: '0.8rem', color: G }}>Compliance Centre</Link>
            <Link href="/legal/inquiries" style={{ fontSize: '0.8rem', color: G }}>Legal Inquiries</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: G, margin: '0 0 1rem', paddingBottom: 8, borderBottom: '2px solid #e2e8f0' }}>{title}</h2>
      <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

function Table({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={{ background: G, color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', color: j === 0 ? '#1a1a1a' : '#374151', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
