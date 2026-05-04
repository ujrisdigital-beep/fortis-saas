'use client'
import { useState } from 'react'

type Region = {
  id: string
  name: string
  label: string
  electricAccess: number
  waterAccess: number
  peakDemand: number
  availableCapacity: number
  solarPotential: string
  population: number
  notes: string
}

const REGIONS: Region[] = [
  { id: 'banjul', name: 'Banjul', label: 'Capital District', electricAccess: 94, waterAccess: 89, peakDemand: 48, availableCapacity: 52, solarPotential: 'High', population: 31300, notes: 'National grid hub. CEB substation. Reliable supply.' },
  { id: 'kanifing', name: 'Kanifing', label: 'Greater Banjul', electricAccess: 88, waterAccess: 82, peakDemand: 62, availableCapacity: 58, solarPotential: 'High', population: 435000, notes: 'Most urbanised. High commercial load. Expansion needed.' },
  { id: 'brikama', name: 'Brikama', label: 'West Coast Region', electricAccess: 71, waterAccess: 64, peakDemand: 38, availableCapacity: 31, solarPotential: 'Very High', population: 740000, notes: 'Largest region. Solar investment opportunity. Grid gaps.' },
  { id: 'bwiam', name: 'Bwiam', label: 'Central River West', electricAccess: 42, waterAccess: 51, peakDemand: 12, availableCapacity: 9, solarPotential: 'Very High', population: 182000, notes: 'Critical underserved zone. Off-grid solar critical.' },
  { id: 'farafenni', name: 'Farafenni', label: 'North Bank Region', electricAccess: 55, waterAccess: 58, peakDemand: 18, availableCapacity: 14, solarPotential: 'High', population: 203000, notes: 'Northern corridor. Border trade zone. Mini-grid viable.' },
  { id: 'basse', name: 'Basse', label: 'Upper River Region', electricAccess: 31, waterAccess: 44, peakDemand: 8, availableCapacity: 6, solarPotential: 'Exceptional', population: 258000, notes: 'Furthest from grid. Solar + battery storage urgent.' },
]

export default function NawecMapPage() {
  const [selected, setSelected] = useState<Region | null>(null)
  const [view, setView] = useState('electricity')

  return (
    <div style={{ minHeight: '100vh', background: '#0A1F0F', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ background: '#0F3D21', padding: '48px 24px', borderBottom: '1px solid #C4943A' }}>
        <h1 style={{ fontSize: 40, fontWeight: 600, margin: 0 }}>🗺️ NAWEC Energy & Water Map</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Electricity access, water coverage, and solar potential across Gambia's 6 regions</p>
      </div>
      <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['electricity', 'water', 'solar'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '8px 18px', borderRadius: 6, background: view === v ? '#C4943A' : 'rgba(255,255,255,0.1)', color: view === v ? '#0F3D21' : '#fff', border: 'none', cursor: 'pointer' }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {REGIONS.map(r => (
            <div key={r.id} onClick={() => setSelected(r)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,148,58,0.2)', borderRadius: 12, padding: 20, cursor: 'pointer' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#C4943A' }}>{r.name}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{r.label}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span>⚡ {r.electricAccess}%</span>
                <span>💧 {r.waterAccess}%</span>
                <span>☀️ {r.solarPotential}</span>
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelected(null)}>
            <div style={{ background: '#0F3D21', borderRadius: 16, padding: 32, maxWidth: 500 }} onClick={e => e.stopPropagation()}>
              <h2>{selected.name}</h2>
              <p>⚡ Electricity: {selected.electricAccess}%</p>
              <p>💧 Water: {selected.waterAccess}%</p>
              <p>📈 Peak Demand: {selected.peakDemand} MW</p>
              <p>⚙️ Capacity: {selected.availableCapacity} MW</p>
              <p>☀️ Solar: {selected.solarPotential}</p>
              <p>👥 Population: {selected.population.toLocaleString()}</p>
              <p>{selected.notes}</p>
              <button onClick={() => setSelected(null)} style={{ padding: '8px 16px', background: '#C4943A', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}