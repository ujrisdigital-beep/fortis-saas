'use client'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const ECOLOGIES = [
  { name: 'Upland (Rainfed)', yield: '0.9–1.2 t/ha', area: '~30,000 ha', risk: 'Drought, erratic rainfall', fishPotential: 'Low', color: '#92400e' },
  { name: 'Lowland Rainfed', yield: '1.5–2.5 t/ha', area: '~120,000 ha', risk: 'Flood, moderate salinity', fishPotential: 'High', color: G },
  { name: 'Tidal / Mangrove Swamp', yield: '1–2 t/ha', area: '~50,000 ha', risk: 'Salinity intrusion, acid sulfate soils', fishPotential: 'Very High', color: '#0e7490' },
  { name: 'Irrigated Lowland', yield: '4–6.5 t/ha', area: '~5,000 ha', risk: 'Low (managed systems)', fishPotential: 'High', color: '#4c1d95' },
]

const BENEFITS = [
  { b: 'Rice yields stable or +5–10%', icon: '🌾' },
  { b: 'Fish yield: 0.75–2.25 t/ha', icon: '🐟' },
  { b: 'Income uplift: 28–64%', icon: '💰' },
  { b: 'Reduced pesticides (fish eat pests)', icon: '🌿' },
  { b: 'Improved soil fertility', icon: '🌱' },
  { b: 'Climate resilience', icon: '🌤️' },
]

const FISHERIES = [
  { type: 'Artisanal Coastal', desc: 'Atlantic coast — bonga shad, barracuda, grouper, shrimp. ~40,000 fishers.', sites: 'Tanji, Kartong, Gunjur, Bakau', icon: '⚓' },
  { type: 'Riverine / Estuarine', desc: 'Gambia River — tilapia, catfish, carp, perch. Women-dominated processing.', sites: 'Banjul Jetty, Farafenni, Basse', icon: '🚣' },
  { type: 'Aquaculture Ponds', desc: 'Catfish, tilapia, oyster nurseries. Climate-smart alternative to wild capture.', sites: 'North Bank, LRR, WCR ponds', icon: '🐠' },
  { type: 'Mangrove / Oyster', desc: 'Women-led oyster harvesting from restored mangrove zones.', sites: 'Tanbi Wetland Complex, Kartong', icon: '🦪' },
]

const AGRO_TOURISM = [
  { icon: '🎣', title: 'Catch-Your-Own Fish', desc: 'Guided fishing experiences in rice paddies and fish ponds' },
  { icon: '🍚', title: 'Farm-to-Table Rice Meals', desc: 'Traditional benachin and domoda made from local rice varieties' },
  { icon: '📖', title: 'Women-Led Rice Tours', desc: 'Cultural storytelling of lowland rice cultivation traditions' },
  { icon: '🦩', title: 'Bird Watching', desc: 'Over 400 species spotted in and around Gambia rice ecologies' },
  { icon: '🌊', title: 'Mangrove Restoration Walks', desc: 'Guided tours of blue-carbon mangrove restoration zones' },
  { icon: '🦪', title: 'Oyster Harvesting', desc: 'Join women harvesters in mangrove oyster nurseries' },
]

const INVESTMENT = [
  { opp: 'Tidal Rice Schemes', detail: 'Pump/tidal irrigation on ~50,000 ha. GIEPA priority — 5-8yr tax holiday.', return: 'High' },
  { opp: 'Aquaculture Commercial Scale', detail: 'Catfish/tilapia ponds. Feed production. 1.1% annual growth to 2028.', return: 'High' },
  { opp: 'Fish Processing Plant', detail: 'Cold storage, smoking, canning, export (≥80% = full EPZ relief).', return: 'High' },
  { opp: 'Salt-Tolerant Seed Production', detail: 'R&D + multiplication of climate-adapted rice varieties.', return: 'Medium' },
  { opp: 'Agro-Tourism Farm Stays', detail: 'Eco-lodges at rice farms. Link to tourism/discovery modules.', return: 'Medium' },
  { opp: 'Cold-Chain Logistics', detail: 'Refrigerated transport for fish. Integration with car hire escrow model.', return: 'Medium' },
]

export default function RiceFishPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F0F9F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/agriculture/produce-map" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Produce Map</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>🐟🌾 Rice-Fish Systems & Fisheries</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            Integrated rice-aquaculture · Climate-smart farming · Fisheries integration · Agro-tourism
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          {[['~200k ha', 'Rice Lands'], ['50–57k MT', 'Artisanal Catch/yr'], ['5–12%', 'GDP Contribution'], ['75–81%', 'Rice Import Dependence']].map(([v, l]) => (
            <div key={l} style={{ background: G, borderRadius: 10, padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: GOLD }}>{v}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Rice Ecologies */}
        <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 1rem', fontSize: '1.05rem' }}>🌾 Rice Ecologies in Gambia</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
          {ECOLOGIES.map((e, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem', borderTop: `4px solid ${e.color}` }}>
              <div style={{ fontWeight: 700, color: DARK, fontSize: 14, marginBottom: 6 }}>{e.name}</div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 3 }}>Yield: <strong>{e.yield}</strong></div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Area: {e.area}</div>
              <div style={{ fontSize: 11, color: '#dc2626', marginBottom: 6 }}>⚠️ {e.risk}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: e.color }}>🐟 Fish Potential: {e.fishPotential}</div>
            </div>
          ))}
        </div>

        {/* Climate Projections */}
        <div style={{ background: '#fffbeb', borderRadius: 12, border: '1px solid #f59e0b', padding: '1.1rem 1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>📈 Climate Impact Projections (2040–2050)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            <div style={{ color: '#991b1b' }}>❌ Without adaptation: <strong>8–15% yield decline</strong></div>
            <div style={{ color: '#991b1b' }}>❌ Salinity could affect <strong>up to 30% of tidal fields</strong></div>
            <div style={{ color: '#065f46' }}>✅ With CSA: <strong>7–40% yield increase</strong> vs baseline</div>
            <div style={{ color: '#065f46' }}>✅ Combined CCA + irrigation: <strong>+51% production by 2050</strong></div>
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0' }}>Source: IMF/IFAD modelling, NRDS II, GNAIP II, National Adaptation Plans (2024)</p>
        </div>

        {/* Rice-Fish Integration Benefits */}
        <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 1rem', fontSize: '1.05rem' }}>✅ Rice-Fish Integration Benefits</h2>
        <div style={{ background: `linear-gradient(135deg, #d1fae5, #a7f3d0)`, borderRadius: 12, padding: '1.1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: DARK }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{b.icon}</div>
                {b.b}
              </div>
            ))}
          </div>
        </div>

        {/* Fisheries Integration */}
        <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 1rem', fontSize: '1.05rem' }}>🐟 Fisheries & Aquaculture Zones</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
          {FISHERIES.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: DARK, fontSize: 13, marginBottom: 4 }}>{f.type}</div>
              <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, margin: '0 0 6px' }}>{f.desc}</p>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>📍 {f.sites}</div>
            </div>
          ))}
        </div>

        {/* Agro-Tourism */}
        <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 1rem', fontSize: '1.05rem' }}>🌾 Agro-Tourism Synergies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          {AGRO_TOURISM.map((t, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #e5e7eb', padding: '0.9rem' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, color: DARK, fontSize: 12, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Investment Opportunities */}
        <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 1rem', fontSize: '1.05rem' }}>💰 GIEPA-Aligned Investment Opportunities</h2>
        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ background: G, color: '#fff', padding: '0.7rem 1.25rem', fontWeight: 700, fontSize: 13 }}>
            Priority Sectors — Tax Holiday 5–8 Years · Import Duty Exemptions · EPZ for Export Plants
          </div>
          {INVESTMENT.map((inv, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 70px', gap: 12, padding: '10px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#f9fafb', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{inv.opp}</span>
              <span style={{ fontSize: 12, color: '#555' }}>{inv.detail}</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: inv.return === 'High' ? '#d1fae5' : '#fef9c3', color: inv.return === 'High' ? '#065f46' : '#92400e', padding: '3px 8px', borderRadius: 999, textAlign: 'center' }}>
                {inv.return}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/agriculture/produce-map" style={{ display: 'inline-block', padding: '10px 20px', background: G, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            🌾 Explore Produce Map
          </Link>
          <Link href="/tourism/discover" style={{ display: 'inline-block', padding: '10px 20px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            🗺️ Agro-Tourism Map
          </Link>
          <Link href="/resources/forest" style={{ display: 'inline-block', padding: '10px 20px', background: '#fff', color: G, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: `1.5px solid ${G}` }}>
            🌳 Forest & Mangrove Data
          </Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: Ministry of Agriculture · NRDS II · GNAIP II · GBOS 2024 · IMF/IFAD Climate Models · GIEPA · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
