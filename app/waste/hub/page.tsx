'use client'
import { useState } from 'react'

const WASTE_STREAMS = [
  { type: 'Organic / Food Waste', percent: 62, color: '#4ADE80', value: 'GMD 2.8M/yr' },
  { type: 'Plastic Waste', percent: 18, color: '#60A5FA', value: 'GMD 1.1M/yr' },
  { type: 'Metal & E-waste', percent: 8, color: '#FCD34D', value: 'GMD 0.9M/yr' },
  { type: 'Glass & Ceramics', percent: 6, color: '#C4943A', value: 'GMD 0.4M/yr' },
  { type: 'Paper & Cardboard', percent: 4, color: '#A78BFA', value: 'GMD 0.2M/yr' },
  { type: 'Other', percent: 2, color: '#6B7280', value: 'GMD 0.1M/yr' },
]

export default function WasteHubPage() {
  const [tonnage, setTonnage] = useState(10)
  const co2Saved = (tonnage * 0.84).toFixed(1)
  const revenueEst = Math.round(tonnage * 4200)

  return (
    <div style={{ minHeight: '100vh', background: '#0A1F0F', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ background: '#0F3D21', padding: '48px 24px', borderBottom: '1px solid #C4943A' }}>
        <h1 style={{ fontSize: 40, fontWeight: 600, margin: 0 }}>♻️ Waste Valorisation Hub</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Turn Gambia's waste into economic opportunity</p>
      </div>
      <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
            <h2>Waste Composition</h2>
            {WASTE_STREAMS.map(s => (
              <div key={s.type} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{s.type}</span>
                  <span style={{ color: s.color }}>{s.percent}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                  <div style={{ width: `${s.percent}%`, height: '100%', background: s.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
            <h2>Carbon Calculator</h2>
            <label>Monthly waste diverted: {tonnage} tonnes</label>
            <input type="range" min={1} max={200} value={tonnage} onChange={e => setTonnage(Number(e.target.value))} style={{ width: '100%', margin: '16px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(74,222,128,0.1)', borderRadius: 12, padding: 16 }}>
                <div>CO₂ SAVED</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#4ADE80' }}>{co2Saved}T</div>
                <div>per month</div>
              </div>
              <div style={{ background: 'rgba(196,148,58,0.1)', borderRadius: 12, padding: 16 }}>
                <div>EST. REVENUE</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#C4943A' }}>GMD {revenueEst.toLocaleString()}</div>
                <div>per month</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32, textAlign: 'center', padding: 32, background: 'rgba(196,148,58,0.1)', borderRadius: 16 }}>
          <h2>Investment Opportunities</h2>
          <p>Composting | BSF Larvae | Pyrolysis | Waste-to-Energy | Plastic Recycling</p>
          <a href="/grants" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#C4943A', color: '#0F3D21', textDecoration: 'none', borderRadius: 8 }}>🎯 Find Waste Grants</a>
        </div>
      </div>
    </div>
  )
}