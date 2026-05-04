'use client'
import { useState } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

interface QuoteResult {
  from: string
  to: string
  vehicle: string
  distanceKm: number
  totalGMD: number
  totalUSD: number
  breakdown: { baseRate: number; distanceCost: number; waitingCost: number }
}

const LOCATIONS = [
  { key: 'banjul_airport', label: 'Banjul International Airport' },
  { key: 'banjul_city', label: 'Banjul City Centre' },
  { key: 'serrekunda', label: 'Serrekunda' },
  { key: 'kololi', label: 'Kololi' },
  { key: 'bakau', label: 'Bakau' },
  { key: 'fajara', label: 'Fajara' },
  { key: 'kotu', label: 'Kotu' },
  { key: 'senegambia', label: 'Senegambia Strip' },
  { key: 'brikama', label: 'Brikama' },
  { key: 'farafenni', label: 'Farafenni' },
  { key: 'basse', label: 'Basse Santa Su' },
  { key: 'janjanbureh', label: 'Janjanbureh' },
  { key: 'soma', label: 'Soma' },
  { key: 'kaolack', label: 'Kaolack, Senegal' },
  { key: 'dakar', label: 'Dakar, Senegal' },
]

const VEHICLES = [
  { key: 'economy', label: 'Economy' },
  { key: 'saloon', label: 'Saloon / Sedan' },
  { key: 'suv', label: 'SUV / 4x4' },
  { key: 'minivan', label: 'Minivan (7-seater)' },
  { key: 'luxury', label: 'Luxury / Executive' },
  { key: 'bus', label: 'Mini-Bus (14-seater)' },
]

export default function DistanceCalculator() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [vehicle, setVehicle] = useState('saloon')
  const [returnTrip, setReturnTrip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [error, setError] = useState('')

  async function calculate() {
    if (!from || !to) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/car-hire/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, vehicleType: vehicle, returnTrip }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed')
      setResult(data.quote)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed')
    }
    setLoading(false)
  }

  const select = (val: string, setter: (v: string) => void) => ({
    value: val,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setter(e.target.value),
    style: { width: '100%', padding: '9px 12px', borderRadius: 8, background: '#f9fafb', border: '1.5px solid #e5e7eb', color: '#111', fontSize: 13 },
  })

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
      <h3 style={{ fontWeight: 800, color: G, margin: '0 0 1rem', fontSize: '1rem' }}>🚗 Distance & Fare Calculator</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>From</label>
          <select {...select(from, setFrom)}>
            <option value="">Select pickup...</option>
            {LOCATIONS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>To</label>
          <select {...select(to, setTo)}>
            <option value="">Select destination...</option>
            {LOCATIONS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>Vehicle Type</label>
        <select {...select(vehicle, setVehicle)}>
          {VEHICLES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
        </select>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555', marginBottom: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={returnTrip} onChange={e => setReturnTrip(e.target.checked)} />
        Return trip (round trip)
      </label>

      <button
        onClick={calculate}
        disabled={loading || !from || !to}
        style={{ width: '100%', padding: '10px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (!from || !to) ? 0.5 : 1 }}
      >
        {loading ? 'Calculating...' : 'Calculate Fare'}
      </button>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 12, background: '#f9fafb', borderRadius: 10, padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#555', fontSize: 13 }}>Distance:</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{result.distanceKm} km{returnTrip ? ' (return)' : ''}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#555', fontSize: 13 }}>Vehicle:</span>
            <span style={{ fontSize: 13 }}>{result.vehicle}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#555', fontSize: 13 }}>Base rate:</span>
            <span style={{ fontSize: 13 }}>D{result.breakdown.baseRate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#555', fontSize: 13 }}>Distance cost:</span>
            <span style={{ fontSize: 13 }}>D{result.breakdown.distanceCost}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: 700, color: G }}>Total Fare:</span>
            <span style={{ fontWeight: 800, color: GOLD, fontSize: '1.1rem' }}>D{result.totalGMD.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>≈ ${result.totalUSD} USD · Includes driver · Fuel surcharge may apply &gt;150km</p>
          <a
            href="/services/car-hire"
            style={{ display: 'block', marginTop: 10, textAlign: 'center', padding: '8px', borderRadius: 8, background: G, color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
          >
            Book This Transfer →
          </a>
        </div>
      )}
    </div>
  )
}
