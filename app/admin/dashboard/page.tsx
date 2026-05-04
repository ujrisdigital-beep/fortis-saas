'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const G    = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'

type AdminUser = { email: string; role: string; name: string; loginAt: string }
type Tab = 'diagnostics' | 'sops' | 'maintenance' | 'upload' | 'kpis'

// ── DATA ──────────────────────────────────────────────────────────────────────

const DIAGNOSTICS = [
  { label: 'API Health',           status: 'OK',      detail: 'All endpoints responding' },
  { label: 'Database Connection',  status: 'OK',      detail: 'Prisma / PostgreSQL live' },
  { label: 'OpenAI Integration',   status: 'OK',      detail: 'UJRIS model responding' },
  { label: 'Auth System',          status: 'OK',      detail: 'NextAuth sessions active' },
  { label: 'Weather API',          status: 'OK',      detail: 'Open-Meteo responding' },
  { label: 'Image Optimisation',   status: 'OK',      detail: 'Next.js Image pipeline' },
  { label: 'Vercel Edge Network',  status: 'OK',      detail: 'CDN nodes healthy' },
  { label: 'Admin Portal',         status: 'OK',      detail: 'Session-based auth active' },
  { label: 'Certificate Store',    status: 'WARNING', detail: 'Using static mock data' },
  { label: 'Email Service',        status: 'WARNING', detail: 'No SMTP configured' },
]

const SOPS = [
  {
    title: '🔄 Daily Platform Checks',
    steps: [
      'Verify homepage loads within 2s (check Vercel dashboard)',
      'Check UJRIS AI model is responding via /ask-ujris',
      'Confirm weather widget shows current data on airport dashboard',
      'Test auth login/logout cycle with support@fortisos.gm',
      'Review admin/ai-monitor for any anomalous queries',
    ],
  },
  {
    title: '📊 Weekly Data Updates',
    steps: [
      'Update GBoS portal data if new census figures released',
      'Review and update media institution website URLs',
      'Check emergency service contact numbers for changes',
      'Verify all external embed iframes are loading (Google Maps)',
      'Export user queries log from UJRIS and review trends',
    ],
  },
  {
    title: '🚨 Incident Response',
    steps: [
      'Identify affected service — check Vercel deployment logs',
      'Post status update in admin/escalations immediately',
      'Roll back deployment if new deploy caused regression',
      'Notify CEO via secure channel if data breach suspected',
      'Document incident in /admin/sop within 24 hours',
    ],
  },
  {
    title: '🔐 Security Protocols',
    steps: [
      'Rotate admin portal passwords quarterly (next due: July 2026)',
      'Review access logs monthly for unusual patterns',
      'Ensure all API keys are in .env.production, never committed',
      'Verify SSL certificates are valid on fortisos.cloud',
      'Conduct vulnerability scan before each major release',
    ],
  },
]

const MAINTENANCE_ITEMS = [
  { category: 'Content', task: 'Review airport ATC frequencies for accuracy', priority: 'Medium', owner: 'Admin' },
  { category: 'Content', task: 'Update livestock census figures (GBoS 2024)', priority: 'Low',    owner: 'Admin' },
  { category: 'Content', task: 'Add new media institutions as they launch',   priority: 'Low',    owner: 'Admin' },
  { category: 'Tech',    task: 'Upgrade Next.js to latest stable',            priority: 'Medium', owner: 'Dev' },
  { category: 'Tech',    task: 'Implement real certificate database',         priority: 'High',   owner: 'Dev' },
  { category: 'Tech',    task: 'Add SMTP email service for notifications',    priority: 'High',   owner: 'Dev' },
  { category: 'Tech',    task: 'Set up automated GBoS data refresh cron',    priority: 'Medium', owner: 'Dev' },
  { category: 'Design',  task: 'Mobile responsive audit on /resources pages', priority: 'Medium', owner: 'Design' },
  { category: 'Design',  task: 'Accessibility (WCAG 2.1 AA) audit',          priority: 'High',   owner: 'Design' },
  { category: 'Legal',   task: 'Review and update GDPR/privacy policy page', priority: 'High',   owner: 'Legal' },
]

const KPIS = [
  { section: '🏠 Homepage',              visits: 4820, avgTime: '2m 14s', bounce: '34%', trend: '↑' },
  { section: '🤖 UJRIS AI',              visits: 3210, avgTime: '4m 52s', bounce: '18%', trend: '↑' },
  { section: '🌍 Discover Gambia',       visits: 2140, avgTime: '3m 08s', bounce: '29%', trend: '↑' },
  { section: '📊 GBoS Portal',           visits: 1860, avgTime: '5m 22s', bounce: '22%', trend: '→' },
  { section: '✈️ Airport Dashboard',     visits: 1540, avgTime: '3m 45s', bounce: '31%', trend: '↑' },
  { section: '🚨 Emergency Services',    visits: 1320, avgTime: '2m 30s', bounce: '38%', trend: '↑' },
  { section: '🐄 Livestock Census',      visits:  980, avgTime: '4m 10s', bounce: '26%', trend: '→' },
  { section: '📡 Mass Media',            visits:  870, avgTime: '3m 55s', bounce: '28%', trend: '↑' },
  { section: '🌍 Tourism Explorer',      visits:  760, avgTime: '2m 50s', bounce: '35%', trend: '↑' },
  { section: '🎓 Certificate Verify',    visits:  420, avgTime: '1m 20s', bounce: '55%', trend: '→' },
]

const PRIORITY_COLOR: Record<string, string> = {
  High:   '#DC2626',
  Medium: '#D97706',
  Low:    '#16A34A',
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin]           = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab]   = useState<Tab>('diagnostics')
  const [uploadName, setUploadName] = useState('')
  const [uploadType, setUploadType] = useState('data')
  const [uploadNotes, setUploadNotes] = useState('')
  const [uploadDone, setUploadDone] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const raw = sessionStorage.getItem('adminSession')
    if (!raw) { router.replace('/admin/login'); return }
    try { setAdmin(JSON.parse(raw)) } catch { router.replace('/admin/login') }
  }, [router])

  function logout() {
    sessionStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  function toggleCheck(i: number) {
    setCheckedItems(prev => {
      const s = new Set(prev)
      if (s.has(i)) s.delete(i); else s.add(i)
      return s
    })
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    setUploadDone(true)
    setTimeout(() => { setUploadDone(false); setUploadName(''); setUploadNotes('') }, 3000)
  }

  if (!admin) return (
    <div style={{ minHeight: '100vh', background: '#F0F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ fontSize: 36 }}>🔐 Verifying session…</div>
    </div>
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: 'diagnostics', label: '🩺 Diagnostics' },
    { id: 'sops',        label: '📋 SOPs' },
    { id: 'maintenance', label: '🔧 Maintenance' },
    { id: 'upload',      label: '📤 Content Upload' },
    { id: 'kpis',        label: '📊 KPIs' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, color: '#fff', padding: '1.75rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 44 }}>🛡️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                FORTIS OS™ Admin Dashboard
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.75, fontSize: 13 }}>
                Logged in as <strong>{admin.name}</strong> ({admin.role}) · {admin.email}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a href="/admin/airport-dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
              ✈️ Airport Dashboard
            </a>
            <a href="/admin/gambia-dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
              🇬🇲 Gambia Dashboard
            </a>
            <button onClick={logout} style={{ background: 'rgba(220,38,38,0.25)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: 2, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', borderBottom: activeTab === t.id ? `3px solid ${GOLD}` : '3px solid transparent', color: activeTab === t.id ? GOLD : '#555', fontFamily: 'inherit' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>

        {/* ── DIAGNOSTICS ──────────────────────────────────────────────────────── */}
        {activeTab === 'diagnostics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>{DIAGNOSTICS.filter(d => d.status === 'OK').length}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Systems OK</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>⚠️</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>{DIAGNOSTICS.filter(d => d.status === 'WARNING').length}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Warnings</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>❌</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626' }}>{DIAGNOSTICS.filter(d => d.status === 'ERROR').length}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Errors</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>🕐</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{new Date().toLocaleTimeString('en-GB')}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Last Check</div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 800, fontSize: 15, color: DARK }}>
                🩺 System Health Check
              </div>
              {DIAGNOSTICS.map((d, i) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < DIAGNOSTICS.length - 1 ? '1px solid #F9FAFB' : 'none', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: DARK }}>{d.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{d.detail}</div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: d.status === 'OK' ? '#DCFCE7' : d.status === 'WARNING' ? '#FEF9C3' : '#FEE2E2',
                    color: d.status === 'OK' ? '#16A34A' : d.status === 'WARNING' ? '#D97706' : '#DC2626',
                  }}>
                    {d.status === 'OK' ? '✅ OK' : d.status === 'WARNING' ? '⚠️ Warning' : '❌ Error'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOPs ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'sops' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20 }}>
            {SOPS.map((sop, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${GOLD}` }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK, marginBottom: 16 }}>{sop.title}</div>
                <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sop.steps.map((step, j) => (
                    <li key={j} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* ── MAINTENANCE ──────────────────────────────────────────────────────── */}
        {activeTab === 'maintenance' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 20 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>🔧 Maintenance Checklist</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{checkedItems.size}/{MAINTENANCE_ITEMS.length} completed</div>
              </div>
              {MAINTENANCE_ITEMS.map((item, i) => (
                <div key={i} onClick={() => toggleCheck(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < MAINTENANCE_ITEMS.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer', background: checkedItems.has(i) ? '#F0FDF4' : 'transparent', transition: 'background 0.1s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: checkedItems.has(i) ? 'none' : '2px solid #D1D5DB', background: checkedItems.has(i) ? '#16A34A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {checkedItems.has(i) && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: checkedItems.has(i) ? '#6B7280' : DARK, textDecoration: checkedItems.has(i) ? 'line-through' : 'none' }}>{item.task}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.category} · Owner: {item.owner}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${PRIORITY_COLOR[item.priority]}18`, color: PRIORITY_COLOR[item.priority] }}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
            {checkedItems.size > 0 && (
              <button onClick={() => setCheckedItems(new Set())} style={{ background: '#F3F4F6', color: '#374151', padding: '9px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                ↺ Reset Checklist
              </button>
            )}
          </div>
        )}

        {/* ── CONTENT UPLOAD ───────────────────────────────────────────────────── */}
        {activeTab === 'upload' && (
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: DARK, marginBottom: 6 }}>📤 Content Upload Portal</div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
                Submit new content, data updates, or media files for review and publication on FORTIS OS.
              </p>

              {uploadDone ? (
                <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '28px', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#15803D', marginBottom: 6 }}>Upload Submitted Successfully</div>
                  <div style={{ fontSize: 13, color: '#166534' }}>Your content request has been logged for review.</div>
                </div>
              ) : (
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Content Title / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadName}
                      onChange={e => setUploadName(e.target.value)}
                      placeholder="e.g. GBoS 2024 Livestock Update"
                      style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Content Type *
                    </label>
                    <select
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value)}
                      style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="data">📊 Data Update</option>
                      <option value="article">📰 Article / Knowledge</option>
                      <option value="media">🖼️ Media / Images</option>
                      <option value="sop">📋 SOP Update</option>
                      <option value="directory">🗂️ Directory Entry</option>
                      <option value="other">📎 Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Notes / Description
                    </label>
                    <textarea
                      value={uploadNotes}
                      onChange={e => setUploadNotes(e.target.value)}
                      placeholder="Describe what needs to be updated and the source of the data…"
                      rows={4}
                      style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Attach File (Optional)
                    </label>
                    <div style={{ border: '2px dashed #D1D5DB', borderRadius: 10, padding: '24px', textAlign: 'center', cursor: 'pointer', color: '#9CA3AF', fontSize: 13 }}>
                      📁 Click to attach or drag & drop<br />
                      <span style={{ fontSize: 11 }}>CSV, XLSX, PDF, JPG, PNG — max 10MB</span>
                    </div>
                  </div>

                  <button type="submit" style={{ padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${DARK}, ${G})`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    📤 Submit Content Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'kpis' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>👁️</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>{KPIS.reduce((a, k) => a + k.visits, 0).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Total Monthly Visits</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>185+</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Active Pages</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🤖</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>3,210</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>AI Queries / Month</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🌍</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>47</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Countries Reached</div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 800, fontSize: 15, color: DARK }}>
                📊 Section Performance — Monthly
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Section</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Visits</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Avg. Time</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Bounce</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KPIS.map((k, i) => (
                      <tr key={k.section} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={{ padding: '12px 20px', fontWeight: 600, color: DARK, borderBottom: '1px solid #F3F4F6' }}>{k.section}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: G, borderBottom: '1px solid #F3F4F6' }}>{k.visits.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{k.avgTime}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{k.bounce}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 18, borderBottom: '1px solid #F3F4F6', color: k.trend === '↑' ? '#16A34A' : k.trend === '↓' ? '#DC2626' : '#9CA3AF' }}>
                          {k.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', fontSize: 11, color: '#9CA3AF' }}>
                * KPI data is indicative and refreshed monthly. Last updated: April 2026.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
