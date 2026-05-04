'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const ALL_MODULES = [
  {
    category: '🏛️ Heritage & Tourism',
    color: '#92400e',
    items: [
      { name: 'Interactive Tourism Map', path: '/tourism/discover', desc: '17 color-coded sites with distance calculator', icon: '🗺️', badge: 'NEW' },
      { name: 'Heritage Sites Explorer', path: '/tourism/heritage', desc: 'UNESCO sites, colonial landmarks, sacred places', icon: '🏛️', badge: 'NEW' },
      { name: 'Festival Calendar 2026', path: '/festivals', desc: 'Roots Festival, Kanilai, Tobaski & more', icon: '🎉', badge: 'NEW' },
      { name: 'Banjul Airport Live Flights', path: '/resources/airport', desc: 'Real-time arrivals & departures (ICAO: GBYD)', icon: '✈️', badge: '' },
    ],
  },
  {
    category: '🌾 Agriculture & Environment',
    color: '#166534',
    items: [
      { name: 'Smart Agriculture', path: '/smart-agriculture', desc: 'Indigenous crops + regenerative farming ROI', icon: '🌱', badge: 'NEW' },
      { name: 'Smart Livestock', path: '/smart-livestock', desc: 'Indigenous breeds + BSFL insect farming', icon: '🐄', badge: 'NEW' },
      { name: 'Produce Mapping', path: '/agriculture/produce-map', desc: 'Crop distribution by region and season', icon: '🌾', badge: '' },
      { name: 'Rice-Fish Systems', path: '/agriculture/rice-fish', desc: 'Climate-smart integrated farming', icon: '🐟', badge: '' },
      { name: 'Forest Data Dashboard', path: '/resources/forest', desc: 'Tree cover loss, deforestation alerts', icon: '🌳', badge: '' },
      { name: 'Waste Hub', path: '/resources/waste', desc: 'GBoS & World Bank waste analysis', icon: '♻️', badge: '' },
    ],
  },
  {
    category: '📊 Data & Census',
    color: '#1e40af',
    items: [
      { name: 'GBOS Census Dashboard', path: '/resources/census', desc: 'Population 1963–2024 with LGA breakdown', icon: '📊', badge: 'NEW' },
      { name: 'Population Data (Tiered)', path: '/resources/population-data', desc: 'Modern → Colonial → Pre-Colonial records', icon: '📈', badge: 'NEW' },
      { name: 'Pre-Colonial Records', path: '/resources/historical/pre-colonial', desc: 'Kingdoms, oral histories, pre-1820', icon: '📜', badge: 'NEW' },
      { name: 'Colonial Census 1881–1951', path: '/resources/historical/colonial-census', desc: 'British colonial population data', icon: '📋', badge: 'NEW' },
      { name: 'GBoS Data Portal', path: '/resources/gbos', desc: 'GDP, inflation, trade statistics', icon: '🏦', badge: '' },
    ],
  },
  {
    category: '💼 Economy & Trade',
    color: '#0e7490',
    items: [
      { name: 'Digital Economy Hub', path: '/resources/digital-economy', desc: 'E-commerce, digital payments, ICT data', icon: '💻', badge: '' },
      { name: 'AfCFTA Trade Portal', path: '/resources/afcfta', desc: 'Continental trade agreements & opportunities', icon: '🌍', badge: '' },
      { name: 'Fintech Guide', path: '/resources/fintech', desc: 'Mobile money, banking, investment', icon: '💳', badge: '' },
      { name: 'Car Hire & Transfers', path: '/services/car-hire', desc: 'Fare calculator for 15 Gambian locations', icon: '🚗', badge: '' },
    ],
  },
  {
    category: '🔒 Security & Skills',
    color: '#7c3aed',
    items: [
      { name: 'Cybersecurity Hub', path: '/resources/cybersecurity', desc: 'Threats, best practices, NCC guidance', icon: '🔒', badge: '' },
      { name: 'Digital Skills Hub', path: '/resources/digital-skills', desc: 'Free courses and certifications', icon: '🎓', badge: '' },
      { name: 'Training Academy', path: '/training/learn', desc: 'AI-powered learning paths', icon: '🏫', badge: '' },
    ],
  },
  {
    category: '🤝 Community & Directory',
    color: '#be185d',
    items: [
      { name: 'TANGO Directory', path: '/knowledge/tango', desc: 'NGOs and civil society organisations', icon: '🤝', badge: '' },
      { name: 'Grants Portal', path: '/funding', desc: 'Funding opportunities for Gambians', icon: '💰', badge: '' },
      { name: 'Telecom Map', path: '/resources/telecom', desc: 'Network coverage and infrastructure', icon: '📡', badge: '' },
      { name: 'Knowledge Hub', path: '/knowledge', desc: 'Research papers, articles, case studies', icon: '📚', badge: '' },
    ],
  },
]

export default function DiscoverPage() {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? ALL_MODULES.map(cat => ({
        ...cat,
        items: cat.items.filter(m =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.desc.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.items.length > 0)
    : ALL_MODULES

  const totalModules = ALL_MODULES.reduce((s, c) => s + c.items.length, 0)

  return (
    <main style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Hero */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '3rem 1.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(196,148,58,0.18)', border: '1px solid rgba(196,148,58,0.35)', borderRadius: 999, padding: '4px 14px', marginBottom: '1rem' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FORTIS OS — Module Directory</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>🔍 Discover FORTIS OS</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 1.5rem', fontSize: 15 }}>
            {totalModules} modules · Heritage, Data, Economy, Skills — all in one place
          </p>
          <input
            type="text"
            placeholder="Search modules, e.g. census, tourism, fintech..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 480, padding: '12px 18px', borderRadius: 999, border: 'none', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </header>

      {/* Spotlight */}
      {!search && (
        <div style={{ maxWidth: 1000, margin: '1.75rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ background: `linear-gradient(135deg, #fffbeb, #fef3c7)`, border: `2px solid ${GOLD}`, borderRadius: 16, padding: '1.5rem 2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
              <h2 style={{ color: '#92400e', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>Interactive Tourism Map — NEW</h2>
              <p style={{ color: '#555', margin: '0 0 1rem', fontSize: 14 }}>
                17 heritage sites, beaches, cultural centres and business hubs pinned across Gambia.
                Fare calculator for 15 locations included.
              </p>
              <Link href="/tourism/discover" style={{ display: 'inline-block', padding: '10px 22px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                🗺️ Launch Map
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 12 }}>
              {[['🏛️', 'Heritage (5)'], ['🌳', 'Nature (4)'], ['🏖️', 'Beach (3)'], ['🎭', 'Cultural (3)'], ['🛍️', 'Business (2)'], ['🏛️', 'Govt (2)']].map(([ic, lb]) => (
                <div key={lb} style={{ background: G, color: '#fff', padding: '6px 10px', borderRadius: 6, textAlign: 'center' }}>{ic} {lb}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module Grid */}
      <div style={{ maxWidth: 1000, margin: '1.75rem auto', padding: '0 1.5rem 3rem' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No modules found for "{search}"</div>
        )}
        {filtered.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: DARK, fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', paddingLeft: 12, borderLeft: `4px solid ${cat.color}` }}>
              {cat.category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {cat.items.map((mod, mi) => (
                <Link key={mi} href={mod.path} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem 1.1rem', cursor: 'pointer', transition: 'box-shadow 0.15s', borderLeft: `4px solid ${cat.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{mod.icon}</span>
                      {mod.badge && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: GOLD, color: DARK, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.05em' }}>{mod.badge}</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: DARK, fontSize: 14, marginBottom: 4 }}>{mod.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.4 }}>{mod.desc}</div>
                    <div style={{ color: cat.color, fontSize: 12, fontWeight: 600, marginTop: 8 }}>Explore →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: G, color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '1.25rem', fontSize: 12 }}>
        FORTIS OS™ — Sovereign Digital Infrastructure — © FORTIS INVICTA LTD · {totalModules} modules live
      </div>
    </main>
  )
}
