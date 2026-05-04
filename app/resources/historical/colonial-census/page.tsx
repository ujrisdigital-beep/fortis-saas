'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const CENSUS_ROWS = [
  { year: '1881', pop: 40000, quality: 'LOW', notes: 'First British colonial census — Bathurst (Banjul) only. Tax register + headman count.' },
  { year: '1891', pop: 45000, quality: 'LOW', notes: 'Expanded to include Kombo region. Door-to-door in Bathurst only.' },
  { year: '1901', pop: 90000, quality: 'MEDIUM', notes: 'Protectorate areas included. Headman submission + tax rolls. Significant undercounting likely.' },
  { year: '1911', pop: 101000, quality: 'MEDIUM', notes: 'More comprehensive enumeration via District Commissioner returns.' },
  { year: '1921', pop: 201520, quality: 'MEDIUM', notes: 'House-to-house in major settlements. Major scope expansion — reflects improved methodology.' },
  { year: '1931', pop: 199520, quality: 'MEDIUM', notes: 'Slight apparent decline reflects enumeration gaps, not population decline.' },
  { year: '1941', pop: 214000, quality: 'LOW', notes: 'Wartime estimate only — no field enumeration during WWII. Extrapolated from 1931.' },
  { year: '1951', pop: 274000, quality: 'HIGH', notes: 'Most systematic colonial census. Used for post-independence planning. First to classify by ethnicity.' },
  { year: '1963', pop: 315486, quality: 'OFFICIAL', notes: 'First post-independence national census. Sets modern demographic baseline.' },
]

const ETHNIC_1951 = [
  { g: 'Mandinka', pct: 38, color: G },
  { g: 'Fula', pct: 32, color: GOLD },
  { g: 'Wolof', pct: 12, color: '#0e7490' },
  { g: 'Jola', pct: 8, color: '#7c3aed' },
  { g: 'Serahule', pct: 6, color: '#be185d' },
  { g: 'Other', pct: 4, color: '#9ca3af' },
]

function QBadge({ q }: { q: string }) {
  const m: Record<string, [string, string]> = {
    LOW: ['#fee2e2', '#991b1b'],
    MEDIUM: ['#fef9c3', '#92400e'],
    HIGH: ['#d1fae5', '#065f46'],
    OFFICIAL: ['#dbeafe', '#1e40af'],
  }
  const [bg, txt] = m[q] || m.LOW
  return <span style={{ fontSize: 10, fontWeight: 700, background: bg, color: txt, padding: '2px 8px', borderRadius: 999 }}>{q}</span>
}

const maxPop = Math.max(...CENSUS_ROWS.map(r => r.pop))

export default function ColonialCensusPage() {
  const [view, setView] = useState<'table' | 'chart' | 'ethnic'>('chart')
  const [showMethod, setShowMethod] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: '#F5F5F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)', padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/resources/historical/pre-colonial" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Pre-Colonial Records</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>📋 Colonial Census Records (1881–1963)</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>British colonial population data — medium/low reliability, use with historical context</p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: '#fef9c3', border: '1px solid #f59e0b', borderRadius: 10, padding: '0.9rem 1.25rem', marginBottom: '1.5rem', fontSize: 13, color: '#92400e' }}>
          <strong>⚠️ Colonial-era figures are historical records only.</strong> These counts use inconsistent geography and methods across census years, often exclude parts of the population, and are <strong>NOT directly comparable</strong> with post-independence GBOS censuses. Quality flags indicate relative reliability.
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {[['chart', '📊 Population Chart'], ['table', '📋 Full Table'], ['ethnic', '👥 Ethnic 1951']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id as 'table' | 'chart' | 'ethnic')} style={{
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12,
              background: view === id ? '#334155' : '#fff', color: view === id ? '#fff' : '#555',
              border: `1.5px solid ${view === id ? '#334155' : '#e5e7eb'}`,
            }}>{label}</button>
          ))}
        </div>

        {view === 'chart' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, color: DARK, margin: '0 0 1.25rem', fontSize: '1rem' }}>Population Growth 1881–1963</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CENSUS_ROWS.map((r, i) => {
                const barColor = r.quality === 'OFFICIAL' ? GOLD : r.quality === 'HIGH' ? G : r.quality === 'MEDIUM' ? '#0e7490' : '#9ca3af'
                const w = (r.pop / maxPop) * 100
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{r.year}</span>
                      <span style={{ fontSize: 13, color: '#555' }}>{r.pop.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 20, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${w}%`, height: '100%', background: barColor, borderRadius: 999, transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{r.notes}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              {[['#9ca3af', 'LOW'], ['#0e7490', 'MEDIUM'], [G, 'HIGH'], [GOLD, 'OFFICIAL']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#555' }}>
                  <div style={{ width: 12, height: 12, background: c, borderRadius: 2 }} />{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'table' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#334155', color: '#fff' }}>
                    {['Year', 'Population', 'Quality', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CENSUS_ROWS.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 700, color: DARK, fontSize: 13 }}>{r.year}</td>
                      <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600 }}>{r.pop.toLocaleString()}</td>
                      <td style={{ padding: '9px 14px' }}><QBadge q={r.quality} /></td>
                      <td style={{ padding: '9px 14px', fontSize: 11, color: '#9ca3af' }}>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'ethnic' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, color: DARK, margin: '0 0 0.5rem', fontSize: '1rem' }}>Ethnic Composition — 1951 Colonial Census</h2>
            <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 1.25rem' }}>First census to formally classify by ethnic group. Uses colonial administrative categories.</p>
            {ETHNIC_1951.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: DARK, fontSize: 13 }}>{e.g}</span>
                  <span style={{ fontWeight: 700, color: e.color, fontSize: 13 }}>{e.pct}%</span>
                </div>
                <div style={{ height: 14, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${e.pct}%`, background: e.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>⚠️ Ethnic identity is complex and fluid. 2024 GBOS census uses a different classification framework.</p>
          </div>
        )}

        {/* Methodology */}
        <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <button onClick={() => setShowMethod(!showMethod)} style={{
            width: '100%', padding: '0.9rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 600, color: DARK,
          }}>
            <span>📖 Methodology & Source Notes</span>
            <span style={{ color: '#9ca3af' }}>{showMethod ? '▲' : '▼'}</span>
          </button>
          {showMethod && (
            <div style={{ padding: '0 1.25rem 1.25rem', fontSize: 13, color: '#555', lineHeight: 1.6, borderTop: '1px solid #f3f4f6' }}>
              <p>Colonial census data compiled from British Colonial Annual Reports, Blue Books, and census summaries held at the British National Archives.</p>
              <p><strong>Quality Flags:</strong> HIGH = systematic enumeration with documented methodology; MEDIUM = partial coverage or inconsistent method; LOW = administrative estimate only; OFFICIAL = GBOS national census.</p>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>Sources: British Colonial Annual Reports (1881–1951) · GBOS Historical Collection · Philip Curtin, Economic Change in Precolonial Africa (1975)</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/resources/historical/pre-colonial" style={{ display: 'inline-block', padding: '9px 18px', background: '#334155', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            ← Pre-Colonial Records
          </Link>
          <Link href="/resources/census" style={{ display: 'inline-block', padding: '9px 18px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            Modern Census Dashboard (1963–2024) →
          </Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: British National Archives · GBOS · Curtin (1975) · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
