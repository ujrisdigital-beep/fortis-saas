'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const FESTIVALS = [
  { name: 'Roots Homecoming Festival', month: 'May', dates: 'May 22–25, 2026', location: 'Juffureh / Albreda', type: 'Cultural/Heritage', icon: '🥁', color: '#7c3aed', desc: "Celebrates the African diaspora's roots in Gambia. Draws thousands of visitors of African descent from the US, UK, and the Caribbean. Music, dance, storytelling and boat trips to Kunta Kinteh Island." },
  { name: 'Kanilai International Festival', month: 'January', dates: 'Jan 15–20, 2026', location: 'Kanilai, West Kiang', type: 'Music/Arts', icon: '🎸', color: '#0e7490', desc: 'International music and arts festival featuring African and global artists. Named after President Jammeh\'s home village. Known for wrestling, music, and cultural performances.' },
  { name: 'Banjul Demba Cultural Festival', month: 'February', dates: 'Feb 10–12, 2026', location: 'Banjul', type: 'Traditional', icon: '🪘', color: '#166534', desc: 'Traditional Gambian music, dance, and cuisine. Showcases Mandinka, Wolof, Fula, and Jola cultural traditions in the capital.' },
  { name: 'Koriteh (Eid al-Fitr)', month: 'April', dates: 'Apr 20, 2026', location: 'National', type: 'Religious', icon: '🌙', color: '#1e3a5f', desc: 'End of Ramadan celebration. Morning prayers at mosques nationwide, followed by family feasts, new clothes, and visits. Public holiday.' },
  { name: 'Independence Day', month: 'February', dates: 'Feb 18, 2026', location: 'National (Banjul)', type: 'National Holiday', icon: '🇬🇲', color: G, desc: "Celebrates The Gambia's independence from Britain (February 18, 1965). Military parade at Independence Drive, flag-raising ceremony, fireworks at night." },
  { name: 'International Women\'s Day', month: 'March', dates: 'Mar 8, 2026', location: 'National', type: 'Awareness', icon: '♀️', color: '#be185d', desc: 'Major national celebration recognising women\'s contributions to Gambian society. Large processions in Banjul, regional events, government ceremonies.' },
  { name: 'Tobaski (Eid al-Adha)', month: 'June', dates: 'Jun 27, 2026', location: 'National', type: 'Religious', icon: '🐑', color: '#92400e', desc: 'Festival of sacrifice — the most significant Islamic holiday in Gambia. Morning prayers, sacrifice of animals, sharing meat with neighbours, family gatherings.' },
  { name: 'Janjangbureh Cultural Festival', month: 'March', dates: 'Mar 5–7, 2026', location: 'Janjangbureh, CRR', type: 'Traditional', icon: '🏮', color: '#065f46', desc: 'Island city of Janjangbureh (Georgetown) celebrates its heritage as a freed slaves colony. Cultural heritage, colonial-era architecture tours, and traditional music.' },
  { name: 'Futampaf End-of-Year Festival', month: 'December', dates: 'Dec 27–31, 2026', location: 'Banjul / Senegambia', type: 'Music/Cultural', icon: '🎆', color: '#4c1d95', desc: 'End-of-year music and arts festival. Popular entertainment hub at the Senegambia Strip. Street food, live bands, and fireworks to ring in the new year.' },
  { name: 'NAWEC Day (Energy Awareness)', month: 'November', dates: 'Nov 2026', location: 'National', type: 'Awareness', icon: '⚡', color: '#a16207', desc: 'Annual awareness day on energy conservation and renewable energy in Gambia. Exhibitions by NAWEC, green energy startups, and school competitions.' },
  { name: 'National Youth Day', month: 'July', dates: 'Jul 23, 2026', location: 'National', type: 'National Holiday', icon: '🌟', color: '#0369a1', desc: "Celebrating Gambia's youth. Sports competitions, talent shows, and youth-led initiatives. July 22 marks the anniversary of the 1994 military transition." },
  { name: 'African Liberation Day', month: 'May', dates: 'May 25, 2026', location: 'National', type: 'Pan-African', icon: '✊', color: '#1B4D3E', desc: 'Pan-African celebration of African independence movements. Speeches, cultural events, and displays of African solidarity. Public holiday.' },
]

const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'November', 'December']
const TYPES = ['All', 'Cultural/Heritage', 'Music/Arts', 'Traditional', 'Religious', 'National Holiday', 'Awareness', 'Pan-African']

export default function FestivalsPage() {
  const [month, setMonth] = useState('All')
  const [type, setType] = useState('All')

  const shown = FESTIVALS.filter(f =>
    (month === 'All' || f.month === month) &&
    (type === 'All' || f.type === type)
  )

  return (
    <main style={{ minHeight: '100vh', background: '#F5F2FF', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 60%, #8b5cf6 100%)', padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Back to Discover</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>🎉 Gambia Festivals & Events 2026</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            Cultural celebrations, religious holidays, music festivals — {FESTIVALS.length} events across The Gambia
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1.5px solid #e5e7eb', fontSize: 13 }}>
              {MONTHS.map(m => <option key={m} value={m}>{m === 'All' ? 'All Months' : m}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1.5px solid #e5e7eb', fontSize: 13 }}>
              {TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', paddingTop: 16 }}>{shown.length} events shown</div>
        </div>

        {/* Festival Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {shown.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
              <div style={{ height: 90, background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 48 }}>{f.icon}</span>
              </div>
              <div style={{ padding: '1rem 1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0, lineHeight: 1.3 }}>{f.name}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, background: f.color, color: '#fff', padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {f.type.split('/')[0]}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 3 }}>📅 {f.dates}</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>📍 {f.location}</div>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5, margin: '0 0 10px' }}>{f.desc}</p>
                <Link href="/tourism/discover" style={{ fontSize: 12, fontWeight: 600, color: f.color, textDecoration: 'none' }}>
                  View on Map →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {shown.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No events match this filter combination.</div>
        )}

        <div style={{ marginTop: '2rem', background: `linear-gradient(135deg, #4c1d95, #6d28d9)`, borderRadius: 14, padding: '1.75rem', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.5rem' }}>Plan Your Festival Journey</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 1rem', fontSize: 14 }}>Use the interactive tourism map to find festival locations and nearby accommodation</p>
          <Link href="/tourism/discover" style={{ display: 'inline-block', padding: '10px 24px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Launch Festival Map
          </Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: GTBoard · Ministry of Tourism · Islamic calendar 2026 · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
