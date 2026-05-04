'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const MODERN = [
  { year: '1963', pop: 315486, growth: 0, source: 'GBOS First Modern Census' },
  { year: '1973', pop: 493499, growth: 4.58, source: 'Population & Housing Census' },
  { year: '1983', pop: 687817, growth: 3.38, source: 'Population & Housing Census' },
  { year: '1993', pop: 1038145, growth: 4.20, source: 'Population & Housing Census' },
  { year: '2003', pop: 1360681, growth: 2.74, source: 'Population & Housing Census' },
  { year: '2013', pop: 1882450, growth: 3.30, source: 'Population & Housing Census' },
  { year: '2024', pop: 2422712, growth: 2.32, source: 'Digital Census (Preliminary)' },
]

const COLONIAL = [
  { year: '1881', pop: 40000, quality: 'LOW', notes: 'Bathurst (Banjul) only. Tax register.' },
  { year: '1891', pop: 45000, quality: 'LOW', notes: 'Expanded to Kombo.' },
  { year: '1901', pop: 90000, quality: 'MEDIUM', notes: 'Protectorate included.' },
  { year: '1911', pop: 101000, quality: 'MEDIUM', notes: 'Improved enumeration.' },
  { year: '1921', pop: 201520, quality: 'MEDIUM', notes: 'Major scope expansion.' },
  { year: '1931', pop: 199520, quality: 'MEDIUM', notes: 'Slight apparent decline — likely methodology.' },
  { year: '1944', pop: 214000, quality: 'LOW', notes: 'Wartime estimate, no field work.' },
  { year: '1951', pop: 274000, quality: 'HIGH', notes: 'Most systematic colonial census.' },
]

const LGA_2024 = [
  { name: 'Brikama (WCR)', pop: 1095708, pct: 45.2 },
  { name: 'Kanifing (KMC)', pop: 341915, pct: 14.1 },
  { name: 'Basse (URR)', pop: 210000, pct: 8.7 },
  { name: 'Janjanbureh (CRR)', pop: 180121, pct: 7.4 },
  { name: 'Kerewan (NBR)', pop: 175000, pct: 7.2 },
  { name: 'Mansakonko (LRR)', pop: 120000, pct: 5.0 },
  { name: 'Banjul', pop: 21982, pct: 0.9 },
]

const PRECOLONIAL = [
  { era: '1300–1500 (Kaabu / Mali)', low: 60000, mid: 90000, high: 130000, evidence: 'Oral genealogies, settlement patterns' },
  { era: '1500–1650 (Atlantic Trade Begins)', low: 80000, mid: 110000, high: 160000, evidence: 'Portuguese accounts, Ca\' da Mosto (1455)' },
  { era: '1650–1750 (Kaabu Confederation)', low: 100000, mid: 150000, high: 220000, evidence: 'RAC trade logs, French factor records' },
  { era: '1750–1820 (Pre-colonial peak)', low: 130000, mid: 185000, high: 270000, evidence: 'Mungo Park (1795), abolitionist surveys' },
]

type Tab = 'modern' | 'colonial' | 'lga' | 'precolonial'

export default function PopulationDataPage() {
  const [tab, setTab] = useState<Tab>('modern')

  const maxModern = Math.max(...MODERN.map(d => d.pop))
  const maxLGA = Math.max(...LGA_2024.map(d => d.pop))

  const TABS: [Tab, string][] = [
    ['modern', '📈 Modern (1963–2024)'],
    ['colonial', '📋 Colonial (1881–1951)'],
    ['lga', '🗺️ LGA (2024)'],
    ['precolonial', '📜 Pre-Colonial'],
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, #1e40af 0%, #1B4D3E 60%, #2A6B52 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Discover</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>📊 Gambia Population Data</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            Tiered reference spine: Modern Census (1963–2024) · Colonial Records (1881–1951) · Pre-Colonial Estimates
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          {[
            { label: '2024 Population', val: '2,422,712', sub: 'Preliminary (GBOS)', color: G },
            { label: 'Growth 1963→2024', val: '+668%', sub: '61-year span', color: '#1e40af' },
            { label: 'Annual Rate', val: '~2.3%', sub: '2013–2024', color: '#0e7490' },
            { label: 'Brikama LGA', val: '45.2%', sub: 'of national pop.', color: DARK },
          ].map(c => (
            <div key={c.label} style={{ background: c.color, borderRadius: 12, padding: '0.9rem 1rem', color: '#fff' }}>
              <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: GOLD }}>{c.val}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, borderBottom: '2px solid #e5e7eb', marginBottom: '1.25rem', overflowX: 'auto' }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === id ? GOLD : '#6b7280',
              borderBottom: tab === id ? `2px solid ${GOLD}` : '2px solid transparent',
              fontSize: 12, fontWeight: 600, marginBottom: -2,
            }}>{label}</button>
          ))}
        </div>

        {/* Modern Census */}
        {tab === 'modern' && (
          <div>
            <div style={{ background: '#d1fae5', border: '1px solid #86efac', borderRadius: 10, padding: '0.75rem 1.1rem', marginBottom: '1.25rem', fontSize: 13, color: '#065f46' }}>
              <strong>✅ Tier 1: Official Modern Censuses (1963–2024) — High Reliability.</strong> 2024 is first fully digital census (CAPI + GIS). Final report expected late 2025.
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, color: DARK, margin: '0 0 1.25rem', fontSize: '1rem' }}>National Population Growth</h2>
              {MODERN.map((r, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: DARK }}>{r.year}</span>
                    <span style={{ fontWeight: 600 }}>{r.pop.toLocaleString()}</span>
                    <span style={{ color: r.growth > 0 ? '#16a34a' : '#9ca3af' }}>{r.growth > 0 ? `+${r.growth}%` : '—'}</span>
                    <span style={{ color: '#9ca3af', fontSize: 11 }}>{r.source}</span>
                  </div>
                  <div style={{ height: 18, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${(r.pop / maxModern) * 100}%`, height: '100%', background: r.year === '2024' ? GOLD : G, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: DARK, margin: '0 0 0.75rem', fontSize: '0.95rem' }}>2024 Census Highlights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, fontSize: 13, color: '#555' }}>
                {[['Total Population', '2,422,712'], ['Female', '~51% of population'], ['Male', '~49% of population'], ['Gambian citizens', '95.2%'], ['Brikama + Kanifing', '~62% of national'], ['Density', '227 persons/km²']].map(([k, v]) => (
                  <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{k}</div>
                    <div style={{ fontWeight: 700, color: DARK }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Colonial */}
        {tab === 'colonial' && (
          <div>
            <div style={{ background: '#fef9c3', border: '1px solid #f59e0b', borderRadius: 10, padding: '0.75rem 1.1rem', marginBottom: '1.25rem', fontSize: 13, color: '#92400e' }}>
              <strong>⚠️ Tier 2: Colonial-Era Counts (1881–1951) — Medium/Low Reliability.</strong> Not directly comparable with modern GBOS censuses. Use as contextual historical data only.
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    {['Year', 'Population', 'Quality', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COLONIAL.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 700, color: DARK, fontSize: 13 }}>{r.year}</td>
                      <td style={{ padding: '9px 14px', fontSize: 13 }}>{r.pop.toLocaleString()}</td>
                      <td style={{ padding: '9px 14px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, background: r.quality === 'HIGH' ? '#d1fae5' : r.quality === 'MEDIUM' ? '#fef9c3' : '#fee2e2', color: r.quality === 'HIGH' ? '#065f46' : r.quality === 'MEDIUM' ? '#92400e' : '#991b1b', padding: '2px 7px', borderRadius: 999 }}>{r.quality}</span>
                      </td>
                      <td style={{ padding: '9px 14px', fontSize: 11, color: '#9ca3af' }}>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/resources/historical/colonial-census" style={{ fontSize: 13, fontWeight: 600, color: '#334155', textDecoration: 'none' }}>
                View Full Colonial Census Page →
              </Link>
            </div>
          </div>
        )}

        {/* LGA */}
        {tab === 'lga' && (
          <div>
            <div style={{ background: '#fef9c3', border: '1px solid #f59e0b', borderRadius: 10, padding: '0.75rem 1.1rem', marginBottom: '1.25rem', fontSize: 13, color: '#92400e' }}>
              <strong>🗺️ LGA Distribution (2024 Preliminary).</strong> Brikama + Kanifing account for ~59% of national population. Figures are preliminary pending final GBOS report.
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
              {LGA_2024.map((lga, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: DARK }}>{lga.name}</span>
                    <span style={{ fontWeight: 600 }}>{lga.pop.toLocaleString()} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({lga.pct}%)</span></span>
                  </div>
                  <div style={{ height: 20, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${lga.pct}%`, height: '100%', background: lga.name === 'Brikama (WCR)' ? GOLD : G, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-Colonial */}
        {tab === 'precolonial' && (
          <div>
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '0.75rem 1.1rem', marginBottom: '1.25rem', fontSize: 13, color: '#92400e' }}>
              <strong>📜 Tier 3: Pre-Colonial Estimates — Low Reliability.</strong> No censuses existed. Estimates derived from oral traditions, explorer accounts, and archaeological surveys. Scholarly context only.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRECOLONIAL.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #e5e7eb', padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 700, color: DARK, fontSize: 14, marginBottom: 6 }}>{r.era}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                    {[['Low', r.low], ['Mid', r.mid], ['High', r.high]].map(([label, val]) => (
                      <div key={label as string} style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 8, padding: '6px 8px' }}>
                        <div style={{ fontSize: 10, color: '#9ca3af' }}>{label}</div>
                        <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{(val as number).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Evidence: {r.evidence}</div>
                </div>
              ))}
            </div>
            <Link href="/resources/historical/pre-colonial" style={{ display: 'inline-block', marginTop: '1rem', fontSize: 13, fontWeight: 600, color: '#92400e', textDecoration: 'none' }}>
              Full Pre-Colonial Records →
            </Link>
          </div>
        )}

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '2rem' }}>
          Sources: GBOS 2024 Preliminary Report · UNFPA · Colonial Blue Books · Curtin (1975) · Barry (1998) · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
