'use client'
import { useEffect, useState } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

interface CensusEntry { year: number; population: number; growthRate: number | null; source: string; notes?: string }
interface LGAEntry { year: number; lga: string; population: number; urbanShare?: number }
interface UrbanEntry { year: number; urbanShare: number }
interface ColonialEntry { year: number; area: string; population: number; qualityFlag: string; source: string }
interface HistoricalEntry { period: string; populationLow: number; populationMid: number; populationHigh: number; evidenceType: string; notes?: string }
interface Summary { firstModernCensus: { year: number; population: number }; latestCensus: { year: number; population: number }; totalGrowth1963to2024: string; averageDecadalGrowth: number }

type View = 'national' | 'lga' | 'urban' | 'colonial' | 'historical'

function fmt(n: number) { return n.toLocaleString() }
function fmtM(n: number) { return `${(n / 1000000).toFixed(2)}M` }

// Simple bar chart component (no external charting lib needed)
function BarChart({ data, keyX, keyY, color = GOLD }: { data: Record<string, number | string>[]; keyX: string; keyY: string; color?: string }) {
  const max = Math.max(...data.map(d => Number(d[keyY])))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 220, padding: '0 0 1rem' }}>
      {data.map((d, i) => {
        const val = Number(d[keyY])
        const height = (val / max) * 180
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#999', marginBottom: 3, writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)', maxHeight: 60, overflow: 'hidden' }}>{fmtM(val)}</div>
            <div style={{ width: '100%', background: color, borderRadius: '4px 4px 0 0', height, transition: 'height 0.5s', minHeight: 2 }} />
            <div style={{ fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' }}>{d[keyX]}</div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data, keyX, keyY, color = G, unit = '' }: { data: Record<string, number | string>[]; keyX: string; keyY: string; color?: string; unit?: string }) {
  const vals = data.map(d => Number(d[keyY]))
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const range = max - min || 1
  const w = 100 / (data.length - 1)

  const points = data.map((d, i) => {
    const x = i * w
    const y = 100 - ((Number(d[keyY]) - min) / range) * 85
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ position: 'relative', height: 200 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 160 }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = i * w
          const y = 100 - ((Number(d[keyY]) - min) / range) * 85
          return <circle key={i} cx={x} cy={y} r={1.5} fill={color} vectorEffect="non-scaling-stroke" />
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666' }}>
        {data.map((d, i) => <span key={i}>{d[keyX]}</span>)}
      </div>
    </div>
  )
}

export default function CensusDashboard() {
  const [data, setData] = useState<{ national: CensusEntry[]; lga: LGAEntry[]; colonial: ColonialEntry[]; historical: HistoricalEntry[]; urbanisation: UrbanEntry[]; summary: Summary } | null>(null)
  const [view, setView] = useState<View>('national')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gbos/census-data')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const views: { id: View; label: string }[] = [
    { id: 'national', label: '📈 National' },
    { id: 'lga', label: '🗺️ By LGA' },
    { id: 'urban', label: '🏙️ Urbanisation' },
    { id: 'colonial', label: '🏛️ Colonial Era' },
    { id: 'historical', label: '📜 Pre-Colonial' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '2rem 1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(196,148,58,0.18)', border: '1px solid rgba(196,148,58,0.35)', borderRadius: 999, padding: '4px 12px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>GBOS — Sovereign Data</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>📊 Gambia Population Census Data</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>Complete demographic history from pre-colonial estimates to the 2024 Digital Census</p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Summary Cards */}
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {[
              { label: 'First Modern Census', val: '1963', sub: `${fmt(315486)} people`, bg: G },
              { label: 'Latest Census (2024)', val: '2,422,712', sub: 'Preliminary', bg: '#2E7D64' },
              { label: 'Total Growth (61 yrs)', val: data.summary.totalGrowth1963to2024, sub: '1963 → 2024', bg: DARK },
              { label: 'Avg Decadal Growth', val: `${data.summary.averageDecadalGrowth}%`, sub: 'per decade', bg: '#5D4037' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: '1rem 1.25rem', color: '#fff' }}>
                <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: GOLD }}>{c.val}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', borderBottom: '2px solid #e5e7eb', overflowX: 'auto' }}>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: view === v.id ? GOLD : '#6b7280',
              borderBottom: view === v.id ? `2px solid ${GOLD}` : '2px solid transparent',
              fontSize: 14, fontWeight: 600, marginBottom: -2,
            }}>{v.label}</button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading census data...</div>}

        {!loading && data && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.5rem' }}>
            {view === 'national' && (
              <>
                <h2 style={{ color: G, fontWeight: 800, margin: '0 0 1rem' }}>National Population Growth (1963–2024)</h2>
                <BarChart data={data.national as unknown as Record<string, number | string>[]} keyX="year" keyY="population" />
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.national.map(row => (
                    <div key={row.year} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 80px 1fr', gap: 8, fontSize: 13, padding: '8px 12px', background: '#f9fafb', borderRadius: 8 }}>
                      <span style={{ fontWeight: 700, color: G }}>{row.year}</span>
                      <span style={{ fontWeight: 600 }}>{fmt(row.population)}</span>
                      <span style={{ color: row.growthRate ? '#16a34a' : '#9ca3af' }}>{row.growthRate ? `+${row.growthRate}%` : '—'}</span>
                      <span style={{ color: '#6b7280', fontSize: 11 }}>{row.source}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {view === 'lga' && (
              <>
                <h2 style={{ color: G, fontWeight: 800, margin: '0 0 1rem' }}>LGA Population — 1993 Census</h2>
                {data.lga.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                    <p>LGA data not yet seeded.</p>
                    <p style={{ fontSize: 12 }}>Run: <code>node prisma/seed-census.js</code></p>
                  </div>
                ) : (
                  <>
                    <BarChart data={data.lga.filter(d => d.year === 1993) as unknown as Record<string, number | string>[]} keyX="lga" keyY="population" color={G} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginTop: '1rem' }}>
                      {data.lga.filter(d => d.year === 1993).map(row => (
                        <div key={row.lga} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{row.lga}</div>
                          <div style={{ fontWeight: 800, color: G }}>{fmt(row.population)}</div>
                          {row.urbanShare !== undefined && <div style={{ fontSize: 11, color: '#9ca3af' }}>Urban: {row.urbanShare}%</div>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {view === 'urban' && (
              <>
                <h2 style={{ color: G, fontWeight: 800, margin: '0 0 1rem' }}>Urbanisation Trend (1973–2024)</h2>
                <LineChart data={data.urbanisation as unknown as Record<string, number | string>[]} keyX="year" keyY="urbanShare" unit="%" color={GOLD} />
                <div style={{ background: '#f0f9ff', borderRadius: 10, padding: '1rem', marginTop: '1rem', fontSize: 13 }}>
                  <p style={{ margin: '0 0 4px' }}>Urban share rose from <strong>22.8% (1973)</strong> to <strong>58.7% (2024 est.)</strong></p>
                  <p style={{ margin: 0, color: '#555' }}>Greater Banjul Area (Banjul + Kanifing) accounts for ~40% of national population. Urbanisation driven by internal migration from rural regions.</p>
                </div>
              </>
            )}

            {view === 'colonial' && (
              <>
                <h2 style={{ color: G, fontWeight: 800, margin: '0 0 1rem' }}>Colonial Era Census (1881–1963)</h2>
                {data.colonial.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Run <code>node prisma/seed-census.js</code> to load colonial data.</div>
                ) : (
                  <>
                    <BarChart data={data.colonial as unknown as Record<string, number | string>[]} keyX="year" keyY="population" color="#8B7355" />
                    <div style={{ background: '#fffbeb', borderRadius: 10, padding: '1rem', marginTop: '1rem', fontSize: 12, color: '#92400e' }}>
                      ⚠️ Colonial-era figures are administrative estimates, not modern census counts. Quality varies significantly.
                    </div>
                  </>
                )}
              </>
            )}

            {view === 'historical' && (
              <>
                <h2 style={{ color: G, fontWeight: 800, margin: '0 0 1rem' }}>Pre-Colonial Estimates (1600–1880)</h2>
                {data.historical.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Run <code>node prisma/seed-census.js</code> to load historical data.</div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {data.historical.map(row => (
                        <div key={row.period} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 8, fontSize: 13 }}>
                          <span style={{ fontWeight: 700, color: G }}>{row.period}</span>
                          <span>Low: {fmt(row.populationLow)}</span>
                          <span style={{ fontWeight: 600 }}>Mid: {fmt(row.populationMid)}</span>
                          <span>High: {fmt(row.populationHigh)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#fef3c7', borderRadius: 10, padding: '1rem', marginTop: '1rem', fontSize: 12, color: '#92400e' }}>
                      ⚠️ Pre-colonial figures are historical reconstructions based on trade records, travellers' accounts, oral traditions, and archaeological evidence. Not official census data.
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: Gambia Bureau of Statistics (GBOS) · UNFPA 2024 Preliminary Report · Colonial Annual Reports · UN World Population Prospects<br />
          FORTIS OS™ — Sovereign Data Intelligence — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
