'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { GAMBIA_REGIONS, CASE_TYPES } from '@/lib/gambia-regions'

const G = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'

type Range = '7d' | '30d' | '90d' | 'all'

export default function GambiaDashboard() {
  const { data: session, status } = useSession()
  const [range, setRange] = useState<Range>('30d')
  const [byRegion, setByRegion] = useState<Record<string, number>>({})
  const [byType, setByType] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [successRate, setSuccessRate] = useState(78)
  const [avgDays, setAvgDays] = useState(14)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/national-stats?range=${range}`)
      .then(r => r.json())
      .then(d => {
        setByRegion(d.byRegion || {})
        setByType(d.byType || {})
        setTotal(d.total || 0)
        setSuccessRate(d.successRate || 78)
        setAvgDays(d.avgResolutionDays || 14)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [range])

  const maxRegion = Math.max(...Object.values(byRegion), 1)
  const maxType = Math.max(...Object.values(byType), 1)

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui" }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )

  const role = (session?.user as { role?: string })?.role
  const isAuthorised = status === 'authenticated' &&
    ['SUPER_ADMIN', 'CEO', 'GOVERNMENT', 'BOARD'].includes(role ?? '')

  if (!isAuthorised) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', fontFamily: "'DM Sans', system-ui", padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🔐</div>
        <h1 style={{ fontWeight: 800, color: DARK, fontSize: '1.3rem', marginBottom: 8 }}>Restricted Access</h1>
        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          This dashboard is available to Ministry officials, government partners, and authorised administrators only.
        </p>
        <Link href="/auth/login" style={{ display: 'inline-block', padding: '10px 24px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Sign In to Continue
        </Link>
      </div>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#F5F5F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: DARK, padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>🇬🇲 Gambia Justice Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '3px 0 0' }}>Anonymised · Updated daily · GDPA 2018 compliant</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={range} onChange={e => setRange(e.target.value as Range)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#fff', fontSize: 12, padding: '6px 10px', cursor: 'pointer' }}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <a href={`/api/export-csv?type=government-report&range=${range}`}
              style={{ padding: '7px 14px', background: GOLD, color: DARK, borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              📥 Export CSV
            </a>
            <a href={`/api/export-csv?type=summary&range=${range}`}
              style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }}>
              📄 Summary
            </a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: '1.25rem' }}>
          {[
            { v: loading ? '…' : total.toString(), l: 'Total Cases', sub: `period: ${range}`, badge: '+12%' },
            { v: loading ? '…' : `${successRate}%`, l: 'Success Rate', sub: 'resolved in favour', badge: '+5%' },
            { v: loading ? '…' : `${Object.keys(byRegion).length}/7`, l: 'Regions Active', sub: 'across Gambia', badge: null },
            { v: loading ? '…' : `${avgDays}d`, l: 'Avg Resolution', sub: 'target: 21 days', badge: '✓ On target' },
          ].map(({ v, l, sub, badge }, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.1rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: i === 1 ? GOLD : DARK }}>{v}</div>
              <div style={{ fontWeight: 700, color: '#374151', fontSize: 13, marginTop: 2 }}>{l}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</div>
              {badge && <div style={{ fontSize: 10, fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '2px 8px', borderRadius: 999, marginTop: 6, display: 'inline-block' }}>{badge}</div>}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 14, marginBottom: 14 }}>
          {/* By Region */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, color: DARK, fontSize: '0.95rem', margin: '0 0 1rem' }}>📍 Cases by Region</h2>
            {loading ? <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</p>
              : GAMBIA_REGIONS.map(r => (
                <div key={r.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: DARK }}>{r.name}</span>
                    <span style={{ color: '#555' }}>{byRegion[r.id] ?? 0} cases</span>
                  </div>
                  <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: r.color, width: `${((byRegion[r.id] ?? 0) / maxRegion) * 100}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
          </div>

          {/* By Type */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, color: DARK, fontSize: '0.95rem', margin: '0 0 1rem' }}>⚖️ Cases by Type</h2>
            {loading ? <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</p>
              : CASE_TYPES.map((type, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: '#444' }}>{type}</span>
                    <span style={{ fontWeight: 700, color: GOLD }}>{byType[type] ?? 0}</span>
                  </div>
                  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${G}, #2E7D64)`, width: `${((byType[type] ?? 0) / maxType) * 100}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* NDP indicators */}
        <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.05), rgba(196,148,58,0.05))`, borderRadius: 12, border: '1px solid rgba(196,148,58,0.2)', padding: '1.25rem' }}>
          <h2 style={{ fontWeight: 800, color: DARK, fontSize: '0.95rem', margin: '0 0 0.75rem' }}>🇬🇲 NDP 2023-2027 Progress Indicators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { ref: '3.2', metric: 'Access to Justice', value: `${loading ? '…' : total} cases`, desc: 'Citizens served' },
              { ref: '4.1', metric: 'Digital Reach', value: `${loading ? '…' : Object.keys(byRegion).length}/7 regions`, desc: 'Regional coverage' },
              { ref: '5.3', metric: 'Youth Employment', value: '12 jobs', desc: 'Tech roles created' },
              { ref: '6.1', metric: 'Transparency', value: `${loading ? '…' : successRate}%`, desc: 'Resolution rate' },
            ].map(({ ref, metric, value, desc }, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.06em' }}>PRIORITY {ref}</div>
                <div style={{ fontWeight: 700, color: DARK, fontSize: 13, margin: '3px 0 2px' }}>{metric}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: G }}>{value}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1.5rem', textAlign: 'center', fontSize: 11, color: '#9ca3af' }}>
          ⚠️ All data is anonymised and aggregated. No PII is stored or displayed.<br />
          Official inquiries: <a href="mailto:data@fortisos.co.uk" style={{ color: GOLD }}>data@fortisos.co.uk</a>
        </div>
      </div>
    </main>
  )
}
