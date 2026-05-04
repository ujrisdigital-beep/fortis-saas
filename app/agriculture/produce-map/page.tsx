'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const REGIONS: Record<string, {
  color: string
  districts: string[]
  crops: { name: string; season: string; yield: string; icon: string }[]
  summary: string
}> = {
  'Brikama (WCR)': {
    color: '#065f46',
    districts: ['Kombo North', 'Kombo South', 'Kombo Central', 'Kombo East', 'Foni Bintang', 'Foni Berefet', 'Foni Jarrol', 'Foni Kansala'],
    crops: [
      { name: 'Vegetables (Tomato, Pepper, Onion)', season: 'Year-round (irrigated)', yield: 'High', icon: '🍅' },
      { name: 'Fruits (Mango, Orange, Citrus)', season: 'Mar–Jul', yield: 'High', icon: '🥭' },
      { name: 'Groundnuts', season: 'Jun–Oct', yield: 'Medium', icon: '🥜' },
      { name: 'Cashews', season: 'Apr–Jun', yield: 'Medium', icon: '🌰' },
      { name: 'Poultry & Eggs', season: 'Year-round', yield: 'High', icon: '🐔' },
    ],
    summary: 'Most densely populated LGA (47.5% of national). Urban agriculture dominant in Kombo areas. Foni districts grow groundnuts and cashews.',
  },
  'Kanifing (KMC)': {
    color: '#1e40af',
    districts: ['Bakau', 'Serrekunda', 'Latrikunda', 'Manjai', 'Talinding', 'Abuko'],
    crops: [
      { name: 'Urban Market Gardens', season: 'Year-round', yield: 'High', icon: '🥬' },
      { name: 'Fish & Seafood Processing', season: 'Year-round', yield: 'High', icon: '🐟' },
      { name: 'Poultry (commercial)', season: 'Year-round', yield: 'High', icon: '🐣' },
    ],
    summary: 'Highly urbanised — production mainly urban gardens, fish landing (Bakau), and commercial poultry. Major food distribution hub.',
  },
  'Banjul': {
    color: '#0369a1',
    districts: ['Banjul North', 'Banjul Central', 'Banjul South'],
    crops: [
      { name: 'Fish & Seafood (Tanji Landing)', season: 'Year-round', yield: 'High', icon: '🐠' },
      { name: 'Processed Food Products', season: 'Year-round', yield: 'Medium', icon: '🏭' },
    ],
    summary: 'Capital city, largely commercial. Tanji fishing beach is one of the largest fish landing sites in West Africa.',
  },
  'Kerewan (NBR)': {
    color: '#7c3aed',
    districts: ['Lower Niumi', 'Upper Niumi', 'Jokadu', 'Lower Badibu', 'Central Badibu', 'Upper Badibu'],
    crops: [
      { name: 'Groundnuts', season: 'Jun–Oct', yield: 'High', icon: '🥜' },
      { name: 'Millet', season: 'Jul–Nov', yield: 'Medium', icon: '🌾' },
      { name: 'Rice (lowland)', season: 'Jul–Dec', yield: 'Medium', icon: '🍚' },
      { name: 'Sorghum', season: 'Jun–Oct', yield: 'Medium', icon: '🌽' },
      { name: 'Cowpeas', season: 'Aug–Nov', yield: 'Low', icon: '🫘' },
    ],
    summary: 'North Bank Region — groundnuts are the dominant cash crop. Lowland rice cultivation along the Gambia River tributaries.',
  },
  'Mansakonko (LRR)': {
    color: '#be185d',
    districts: ['Jarra West', 'Jarra Central', 'Jarra East', 'Kiang West', 'Kiang Central', 'Kiang East'],
    crops: [
      { name: 'Rice (tidal swamp)', season: 'Jul–Dec', yield: 'Medium', icon: '🍚' },
      { name: 'Groundnuts', season: 'Jun–Oct', yield: 'Medium', icon: '🥜' },
      { name: 'Maize', season: 'Jun–Oct', yield: 'Medium', icon: '🌽' },
      { name: 'Cassava', season: 'Year-round', yield: 'Medium', icon: '🍠' },
      { name: 'Cotton (limited)', season: 'Jul–Dec', yield: 'Low', icon: '🌿' },
    ],
    summary: 'Lower River Region. Tidal swamp rice cultivation (bolong areas). Groundnuts remain the principal cash crop.',
  },
  'Janjanbureh (CRR)': {
    color: '#92400e',
    districts: ['Niani', 'Sami', 'Lower Fulladu East', 'Upper Fulladu East', 'Niamina West', 'Niamina East', 'Niamina Dankunku'],
    crops: [
      { name: 'Rice', season: 'Jul–Dec', yield: 'High', icon: '🍚' },
      { name: 'Maize', season: 'Jun–Oct', yield: 'High', icon: '🌽' },
      { name: 'Groundnuts', season: 'Jun–Oct', yield: 'Medium', icon: '🥜' },
      { name: 'Sesame', season: 'Jul–Nov', yield: 'Medium', icon: '🌱' },
      { name: 'Cassava', season: 'Year-round', yield: 'Medium', icon: '🍠' },
    ],
    summary: 'Central River Region. Rice is the staple food crop. Maize increasingly important. Agricultural marketing at Janjanbureh market.',
  },
  'Basse (URR)': {
    color: '#166534',
    districts: ['Basse', 'Jimara', 'Tumana', 'Kantora', 'Sandu', 'Wuli West', 'Wuli East'],
    crops: [
      { name: 'Groundnuts', season: 'Jun–Oct', yield: 'High', icon: '🥜' },
      { name: 'Cotton', season: 'Jul–Dec', yield: 'Medium', icon: '🌿' },
      { name: 'Cowpeas', season: 'Aug–Nov', yield: 'Medium', icon: '🫘' },
      { name: 'Sorghum', season: 'Jun–Oct', yield: 'High', icon: '🌽' },
      { name: 'Sesame', season: 'Jul–Nov', yield: 'Medium', icon: '🌱' },
      { name: 'Millet', season: 'Jul–Nov', yield: 'Medium', icon: '🌾' },
    ],
    summary: 'Upper River Region — strongest groundnut and sorghum belt. Cotton grown in Jimara and Kantora. Subsistence farming dominant.',
  },
}

const CALENDAR = [
  { month: 'Jan–Feb', activity: 'Dry Season', crops: ['Irrigated vegetables', 'Horticulture', 'Groundnut processing'], color: '#f59e0b' },
  { month: 'Mar–May', activity: 'Pre-Rains / Hot Season', crops: ['Fruit harvest (mango, cashew)', 'Land clearing', 'Seed preparation'], color: '#d97706' },
  { month: 'Jun–Jul', activity: 'Rains Begin / Planting', crops: ['Groundnuts planted', 'Maize', 'Millet', 'Sorghum', 'Sesame'], color: '#059669' },
  { month: 'Aug–Sep', activity: 'Peak Growing Season', crops: ['Cowpeas', 'Rice (transplanting)', 'Cassava', 'Cotton'], color: '#047857' },
  { month: 'Oct–Nov', activity: 'Early Harvest', crops: ['Groundnuts', 'Maize', 'Sorghum', 'Millet'], color: '#065f46' },
  { month: 'Nov–Dec', activity: 'Main Harvest', crops: ['Rice', 'Cotton', 'Cowpeas', 'Cassava'], color: '#064e3b' },
]

export default function ProduceMapPage() {
  const [region, setRegion] = useState<string | null>(null)
  const [view, setView] = useState<'regions' | 'calendar'>('regions')

  return (
    <main style={{ minHeight: '100vh', background: '#F0F9F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Back to Discover</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>🌾 Gambia Produce Mapping</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            Agricultural crops by LGA/Region, seasonal calendar, and yield data — 7 regions covered
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          {[['7', 'Regions / LGAs'], ['20+', 'Crop Types'], ['70%', 'Labour in Ag.'], ['Jan–Dec', 'Coverage']].map(([v, l]) => (
            <div key={l} style={{ background: G, borderRadius: 10, padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: GOLD }}>{v}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {[['regions', '🗺️ By Region'], ['calendar', '📅 Seasonal Calendar']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id as 'regions' | 'calendar')} style={{
              padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: view === id ? G : '#fff', color: view === id ? '#fff' : '#555',
              border: `1.5px solid ${view === id ? G : '#e5e7eb'}`,
            }}>{label}</button>
          ))}
        </div>

        {view === 'regions' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: '1.5rem' }}>
              {Object.entries(REGIONS).map(([name, data]) => (
                <div key={name} onClick={() => setRegion(region === name ? null : name)}
                  style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${region === name ? data.color : '#e5e7eb'}`, padding: '1rem', cursor: 'pointer', boxShadow: region === name ? `0 0 0 2px ${data.color}` : 'none' }}>
                  <div style={{ width: 36, height: 36, background: data.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 8 }}>🌾</div>
                  <div style={{ fontWeight: 700, color: DARK, fontSize: 13, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>{data.districts.length} districts</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {data.crops.slice(0, 2).map(c => (
                      <span key={c.name} style={{ fontSize: 9, background: '#f0fdf4', color: data.color, padding: '2px 6px', borderRadius: 999, fontWeight: 600 }}>{c.icon} {c.name.split(' ')[0]}</span>
                    ))}
                    {data.crops.length > 2 && <span style={{ fontSize: 9, color: '#9ca3af', padding: '2px 4px' }}>+{data.crops.length - 2}</span>}
                  </div>
                </div>
              ))}
            </div>

            {region && REGIONS[region] && (
              <div style={{ background: '#fff', borderRadius: 14, border: `2px solid ${REGIONS[region].color}`, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontWeight: 800, color: DARK, margin: 0, fontSize: '1.1rem' }}>{region}</h2>
                  <button onClick={() => setRegion(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16 }}>✕</button>
                </div>
                <p style={{ color: '#555', fontSize: 13, marginBottom: '1rem' }}>{REGIONS[region].summary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: G, fontSize: 13, marginBottom: 8 }}>Crops & Yield</h3>
                    {REGIONS[region].crops.map(c => (
                      <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#f9fafb', borderRadius: 6, marginBottom: 4 }}>
                        <div>
                          <span style={{ fontSize: 14 }}>{c.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: DARK, marginLeft: 6 }}>{c.name}</span>
                          <span style={{ fontSize: 10, color: '#9ca3af', display: 'block', marginLeft: 20 }}>Season: {c.season}</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, background: c.yield === 'High' ? '#d1fae5' : c.yield === 'Medium' ? '#fef9c3' : '#fee2e2', color: c.yield === 'High' ? '#065f46' : c.yield === 'Medium' ? '#92400e' : '#991b1b', padding: '2px 7px', borderRadius: 999 }}>{c.yield}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: G, fontSize: 13, marginBottom: 8 }}>Districts</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {REGIONS[region].districts.map(d => (
                        <span key={d} style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: 999 }}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'calendar' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ background: G, color: '#fff', padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: 14 }}>📅 Agricultural Seasonal Calendar — Gambia</div>
            {CALENDAR.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 160px 1fr', gap: 12, padding: '12px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#f9fafb', alignItems: 'start' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: row.color }}>{row.month}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{row.activity}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {row.crops.map(c => (
                    <span key={c} style={{ fontSize: 11, background: '#f0fdf4', color: G, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/agriculture/rice-fish" style={{ display: 'inline-block', padding: '10px 18px', background: G, color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>🐟 Rice-Fish Systems →</Link>
          <Link href="/resources/forest" style={{ display: 'inline-block', padding: '10px 18px', background: '#fff', color: G, borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: `1.5px solid ${G}` }}>🌳 Forest Data →</Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: Ministry of Agriculture · GBoS Agricultural Survey · FAO Gambia · IFAD · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
