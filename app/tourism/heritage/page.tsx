'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const SITES = [
  {
    name: 'Kunta Kinteh Island (James Island)',
    location: 'Juffureh / Albreda, North Bank',
    type: 'UNESCO World Heritage',
    era: 'Colonial / Slave Trade (16th–19th c.)',
    desc: 'Former slave trading post declared a UNESCO World Heritage Site in 2003. Memorial to the transatlantic slave trade and African diaspora heritage. The site includes Fort James ruins and the village of Albreda.',
    icon: '🏝️',
    badge: 'UNESCO',
    badgeColor: '#1e40af',
    coords: '13.3172° N, 16.3619° W',
  },
  {
    name: 'Stone Circles of Senegambia',
    location: 'Wassu, Central River Region',
    type: 'UNESCO World Heritage',
    era: 'Pre-Colonial (c. 300 BC – 1600 AD)',
    desc: 'The largest concentration of stone circles in the world — over 1,000 circles spanning Gambia and Senegal. Built as burial monuments, each circle contains upright laterite pillars. UNESCO listed in 2006.',
    icon: '🪨',
    badge: 'UNESCO',
    badgeColor: '#1e40af',
    coords: '13.6911° N, 14.8760° W',
  },
  {
    name: 'Fort Bullen',
    location: 'Barra, North Bank Region',
    type: 'Military Fort',
    era: 'Colonial (1826)',
    desc: "Built by the British to enforce the Slavery Abolition Act. Stands opposite Fort James at the mouth of the River Gambia. Key strategic position in 19th century anti-slave trade patrols.",
    icon: '🏰',
    badge: 'Colonial',
    badgeColor: '#92400e',
    coords: '13.4875° N, 16.5467° W',
  },
  {
    name: 'Kachikally Crocodile Pool',
    location: 'Bakau, Greater Banjul Area',
    type: 'Sacred Site',
    era: 'Pre-Colonial (traditional)',
    desc: 'Sacred pool housing over 100 Nile crocodiles, revered as protectors and fertility symbols. Managed by the Bojang family for generations. Visitors may touch the crocodiles under guide supervision.',
    icon: '🐊',
    badge: 'Sacred',
    badgeColor: '#166534',
    coords: '13.4778° N, 16.6583° W',
  },
  {
    name: 'Arch 22',
    location: 'Banjul, Western Region',
    type: 'National Monument',
    era: 'Post-Independence (1996)',
    desc: "Iconic triumphal arch marking the Gambia's 1994 military transition. Houses a museum on the second floor. Gateway to Banjul from the north — visible from across the city.",
    icon: '🚪',
    badge: 'Monument',
    badgeColor: '#065f46',
    coords: '13.4579° N, 16.5812° W',
  },
  {
    name: 'Banjul State House',
    location: 'Banjul, Western Region',
    type: 'Government Heritage',
    era: 'Colonial / Post-Independence',
    desc: "Official residence of the President of The Gambia. Originally the British Governor's residence, built in 1816. Remains a symbol of governance continuity.",
    icon: '🏛️',
    badge: 'Government',
    badgeColor: '#1e40af',
    coords: '13.4549° N, 16.5775° W',
  },
  {
    name: 'Abuko Nature Reserve',
    location: 'Abuko, Western Region',
    type: 'Nature Reserve',
    era: 'Est. 1916 (oldest reserve)',
    desc: "Gambia's oldest and smallest nature reserve — 105 hectares of rare pristine gallery forest. Home to 270+ bird species, crocodiles, monkeys, and monitor lizards. Established 1916.",
    icon: '🌳',
    badge: 'Nature',
    badgeColor: '#166534',
    coords: '13.4000° N, 16.6500° W',
  },
  {
    name: 'Bijilo Forest Park',
    location: 'Kololi, Western Region',
    type: 'Forest Park',
    era: 'Est. 1952',
    desc: "55-hectare coastal forest park known for green vervet monkeys and red colobus monkeys. Excellent birdwatching trails through dense coastal vegetation.",
    icon: '🐒',
    badge: 'Nature',
    badgeColor: '#166534',
    coords: '13.4300° N, 16.7090° W',
  },
  {
    name: 'National Museum of The Gambia',
    location: 'Banjul, Independence Drive',
    type: 'Museum',
    era: 'Est. 1982',
    desc: "The national museum covering Gambian history, culture, and art. Houses artefacts from pre-colonial kingdoms, colonial era items, and traditional crafts. Free on national holidays.",
    icon: '🏺',
    badge: 'Museum',
    badgeColor: '#7c3aed',
    coords: '13.4540° N, 16.5760° W',
  },
]

export default function HeritageSitesPage() {
  const [filter, setFilter] = useState('All')

  const shown = filter === 'All' ? SITES : SITES.filter(s => s.type === filter)

  return (
    <main style={{ minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, #3D1F00 0%, #92400e 60%, #B45309 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Back to Discover</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>🏛️ Gambia Heritage Sites Explorer</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            UNESCO sites, colonial landmarks, sacred places — {SITES.length} curated heritage destinations
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Filter Strip */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['All', 'UNESCO World Heritage', 'Sacred Site', 'Nature Reserve', 'Museum', 'Military Fort'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: filter === f ? GOLD : '#fff',
              color: filter === f ? DARK : '#555',
              border: `1px solid ${filter === f ? GOLD : '#d1d5db'}`,
            }}>{f}</button>
          ))}
        </div>

        {/* Sites Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {shown.map((site, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ height: 110, background: `linear-gradient(135deg, #92400e, #B45309)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 52 }}>{site.icon}</span>
              </div>
              <div style={{ padding: '1rem 1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0, lineHeight: 1.3 }}>{site.name}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, background: site.badgeColor, color: '#fff', padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>{site.badge}</span>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>📍 {site.location}</div>
                <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, marginBottom: 8 }}>{site.era}</div>
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, margin: '0 0 10px' }}>{site.desc}</p>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 10, fontFamily: 'monospace' }}>{site.coords}</div>
                <Link href={`/tourism/discover`} style={{ fontSize: 12, fontWeight: 600, color: '#92400e', textDecoration: 'none' }}>
                  View on Map →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '2rem', background: `linear-gradient(135deg, ${G}, #2A6B52)`, borderRadius: 14, padding: '1.75rem', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.5rem' }}>Plan Your Heritage Journey</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 1rem', fontSize: 14 }}>
            Open the interactive map — all sites pinned with fare calculator for transfers
          </p>
          <Link href="/tourism/discover" style={{ display: 'inline-block', padding: '10px 24px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Launch Interactive Map
          </Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: NCAC Gambia · UNESCO World Heritage List · National Tourism Authority · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
