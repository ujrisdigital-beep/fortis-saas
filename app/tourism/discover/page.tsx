'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { TourismSite } from '../../../components/TourismMap'
import DistanceCalculator from '../../../components/DistanceCalculator'

const GoogleMapsProvider = dynamic(() => import('../../../components/GoogleMapsProvider'), { ssr: false })
const TourismMap = dynamic(() => import('../../../components/TourismMap'), { ssr: false })

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const TOURISM_SITES: TourismSite[] = [
  { id: 1, name: 'Kunta Kinteh Island', lat: 13.3175, lng: -16.3614, category: 'heritage', description: 'UNESCO World Heritage site — Roots tourism landmark on the Gambia River.', accessibility: 'Boat access from Barra or Banjul', entryFee: 'D100–200', openingHours: 'Guided tours only' },
  { id: 2, name: 'Wassu Stone Circles', lat: 13.6915, lng: -14.8731, category: 'heritage', description: 'UNESCO World Heritage — ancient laterite megaliths dating to 750 AD.', accessibility: 'Central River Region', entryFee: 'D200', openingHours: '8am–6pm' },
  { id: 3, name: 'Kerr Batch Stone Circles', lat: 13.7546, lng: -15.0681, category: 'heritage', description: 'UNESCO World Heritage site — megalithic stone circles cluster.', accessibility: 'North Bank Region', entryFee: 'D200', openingHours: '8am–6pm' },
  { id: 4, name: 'Abuko Nature Reserve', lat: 13.396, lng: -16.646, category: 'nature', description: 'Monkeys, crocodiles, 300+ bird species. Most accessible wildlife reserve.', accessibility: 'Near coastal resorts', entryFee: 'D150', openingHours: '8am–6pm' },
  { id: 5, name: 'Bijilo Forest Park', lat: 13.40, lng: -16.72, category: 'nature', description: 'Red colobus monkeys and green vervet monkeys on forest walks.', accessibility: 'Near Kololi', entryFee: 'D100', openingHours: '8am–6pm' },
  { id: 6, name: 'River Gambia National Park', lat: 13.55, lng: -15.10, category: 'nature', description: 'Chimpanzees, hippos, baboons. Accessible by boat safari.', accessibility: 'Boat from Janjanbureh', entryFee: 'D500+', openingHours: 'Guided tours' },
  { id: 7, name: 'Kiang West National Park', lat: 13.30, lng: -16.10, category: 'nature', description: 'Largest national park — savanna, waterbucks, warthogs, 300+ bird species.', accessibility: 'South bank road', entryFee: 'D200', openingHours: 'Daylight hours' },
  { id: 8, name: 'Tanji Bird Reserve', lat: 13.35, lng: -16.75, category: 'nature', description: 'Critical migratory bird stopover — flamingos, pelicans, herons.', accessibility: 'Coastal road', entryFee: 'D100', openingHours: '8am–6pm' },
  { id: 9, name: 'Kotu Beach', lat: 13.45, lng: -16.70, category: 'beach', description: 'Popular beach with restaurants, water sports and beach bars.', accessibility: 'Coastal road', entryFee: 'Free', openingHours: '24/7' },
  { id: 10, name: 'Senegambia Beach', lat: 13.45, lng: -16.71, category: 'beach', description: 'Lively tourist hub with hotels, restaurants and nightlife strip.', accessibility: 'Coastal road', entryFee: 'Free', openingHours: '24/7' },
  { id: 11, name: 'Sanyang Beach', lat: 13.29, lng: -16.74, category: 'beach', description: 'Quiet pristine beach — fishing village, untouched shoreline.', accessibility: 'South coast road', entryFee: 'Free', openingHours: '24/7' },
  { id: 12, name: 'Kachikally Crocodile Pool', lat: 13.48, lng: -16.68, category: 'cultural', description: 'Sacred crocodile pool with over 100 live crocodiles. Fertility shrine.', accessibility: 'Bakau', entryFee: 'D100', openingHours: '9am–6pm' },
  { id: 13, name: 'Gambia National Museum', lat: 13.455, lng: -16.578, category: 'cultural', description: 'History, ethnography, and natural history collections.', accessibility: 'Banjul city centre', entryFee: 'D50', openingHours: '10am–6pm Mon–Sat' },
  { id: 14, name: 'Arch 22', lat: 13.454, lng: -16.579, category: 'cultural', description: 'Banjul independence monument — observation deck with panoramic views.', accessibility: 'Banjul', entryFee: 'D20', openingHours: '10am–6pm' },
  { id: 15, name: 'Albert Market', lat: 13.455, lng: -16.577, category: 'cultural', description: 'Banjul\'s main market — textiles, crafts, fresh produce since 1885.', accessibility: 'Banjul', entryFee: 'Free', openingHours: '8am–6pm' },
  { id: 16, name: 'GCCI', lat: 13.41, lng: -16.71, category: 'business', description: 'Gambia Chamber of Commerce — business advisory, trade networking.', accessibility: 'Bijilo, Bertil Harding Highway', contact: 'info@gcci.gm', openingHours: '9am–5pm Mon–Fri' },
  { id: 17, name: 'GIEPA', lat: 13.45, lng: -16.66, category: 'government', description: 'Gambia Investment & Export Promotion Agency — investment incentives.', accessibility: '48 Kairaba Avenue, Pipeline', contact: 'info@giepa.gm', openingHours: '9am–5pm Mon–Fri' },
]

const FESTIVALS = [
  { id: 1, name: 'Janjanbureh Kankurang Festival', date: '23–25 Jan 2026', description: 'Masquerades, traditional music and cultural heritage celebration.' },
  { id: 2, name: 'International Kora Festival', date: '17 Jan 2026', description: 'Celebration of the kora — West Africa\'s premier string instrument.' },
  { id: 3, name: 'Bansang Cultural Festival', date: '6–8 Feb 2026', description: 'Music, heritage, community gathering in Upper River Region.' },
  { id: 4, name: 'Galloya Cultural Festival', date: '7–9 Feb 2026', description: 'Culture, rhythm, and community festival in eastern Gambia.' },
  { id: 5, name: 'Amplified: The Gambia', date: '20–23 Nov 2026', description: 'Modern music and arts festival — coastal resort area.' },
]

const LEGEND = [
  { color: '#8B4513', label: 'Heritage' },
  { color: '#2E7D32', label: 'Nature' },
  { color: '#1565C0', label: 'Beach' },
  { color: '#6A1B9A', label: 'Cultural' },
  { color: '#F57F17', label: 'Business' },
  { color: '#B71C1C', label: 'Government' },
]

type Tab = 'map' | 'calculator' | 'festivals' | 'business'

export default function DiscoverGambiaPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedSite, setSelectedSite] = useState<TourismSite | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('map')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos =>
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      )
    }
  }, [])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'map', label: '🗺️ Interactive Map' },
    { id: 'calculator', label: '🚗 Fare Calculator' },
    { id: 'festivals', label: '🎉 Festivals 2026' },
    { id: 'business', label: '🏢 Business Services' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '2rem 1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <a href="/tourism" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>← Tourism Hub</a>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(196,148,58,0.18)', border: '1px solid rgba(196,148,58,0.35)', borderRadius: 999, padding: '4px 12px', marginBottom: '0.75rem', marginLeft: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Interactive Tourism Map</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>🌍 Discover The Gambia</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>UNESCO heritage sites · National parks · Cultural festivals · Business services</p>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', borderBottom: '2px solid #e5e7eb', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 18px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: activeTab === tab.id ? GOLD : '#6b7280',
              borderBottom: activeTab === tab.id ? `2px solid ${GOLD}` : '2px solid transparent',
              fontSize: 14, fontWeight: 600, marginBottom: -2,
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>
            <div>
              <GoogleMapsProvider>
                <TourismMap sites={TOURISM_SITES} onSiteSelect={setSelectedSite} userLocation={userLocation} />
              </GoogleMapsProvider>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                {LEGEND.map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />{l.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedSite ? (
                <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
                  <h3 style={{ color: G, fontWeight: 800, margin: '0 0 8px', fontSize: 15 }}>{selectedSite.name}</h3>
                  <p style={{ color: '#555', fontSize: 13, margin: '0 0 10px' }}>{selectedSite.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                    {selectedSite.entryFee && <span>💰 Entry: {selectedSite.entryFee}</span>}
                    {selectedSite.openingHours && <span>🕐 Hours: {selectedSite.openingHours}</span>}
                    {selectedSite.accessibility && <span>🚗 Access: {selectedSite.accessibility}</span>}
                    {selectedSite.contact && <span>📧 {selectedSite.contact}</span>}
                  </div>
                  <button onClick={() => setActiveTab('calculator')} style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Get Fare to This Site →
                  </button>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 12, border: '1.5px dashed #e5e7eb', padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
                  <p style={{ margin: 0 }}>Click any map pin to see site details</p>
                </div>
              )}
              <DistanceCalculator />
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}><DistanceCalculator /></div>
        )}

        {activeTab === 'festivals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
            {FESTIVALS.map(f => (
              <div key={f.id} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎭</div>
                <h3 style={{ color: G, fontWeight: 800, margin: '0 0 4px', fontSize: 14 }}>{f.name}</h3>
                <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>{f.date}</p>
                <p style={{ color: '#555', fontSize: 13, margin: '0 0 12px' }}>{f.description}</p>
                <a href="/services/car-hire" style={{ display: 'block', textAlign: 'center', padding: '8px', borderRadius: 8, background: G, color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Book Transport →</a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'business' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🏢', title: 'GCCI', sub: 'Gambia Chamber of Commerce & Industry', loc: 'Kerr Jula, Bertil Harding Highway, Bijilo', tel: '+220 3795505', email: 'info@gcci.gm', link: 'https://gcci.gm' },
              { icon: '📈', title: 'GIEPA', sub: 'Gambia Investment & Export Promotion Agency', loc: '48 Kairaba Avenue, Pipeline, Kanifing', tel: '+220 4377377', email: 'info@giepa.gm', link: 'https://giepa.gm' },
              { icon: '🤝', title: 'TANGO', sub: 'Association of NGOs in The Gambia', loc: 'Kanifing, The Gambia', tel: '', email: 'tango@tango.gm', link: '/knowledge/tango' },
            ].map(org => (
              <div key={org.title} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{org.icon}</div>
                <h3 style={{ color: G, fontWeight: 800, margin: '0 0 4px' }}>{org.title}</h3>
                <p style={{ color: '#555', fontSize: 13, margin: '0 0 12px' }}>{org.sub}</p>
                <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span>📍 {org.loc}</span>
                  {org.tel && <span>📞 {org.tel}</span>}
                  <span>📧 {org.email}</span>
                </div>
                <a href={org.link} target={org.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'block', marginTop: 12, textAlign: 'center', padding: '8px', borderRadius: 8, background: G, color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  Visit {org.title} →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
