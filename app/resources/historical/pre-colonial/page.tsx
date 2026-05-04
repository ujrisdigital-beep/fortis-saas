'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

const KINGDOMS = [
  { name: 'Kombo Kingdom', period: 'c. 1500–1820', location: 'Western Gambia (Kombo region)', icon: '👑', desc: 'One of the most powerful pre-colonial kingdoms. Controlled lucrative trade routes to the Atlantic coast. Interacted with Portuguese and later British traders from the 1500s. Capital believed to be near present-day Brikama.', legacy: 'Present-day Kombo North, South, East, and Central districts.', color: '#7c3aed' },
  { name: 'Niumi Kingdom', period: 'c. 1400–1820', location: 'North Bank Region', icon: '🏰', desc: "Strategic kingdom controlling the northern mouth of the River Gambia. A major hub for trade in slaves, gold, ivory, and beeswax with Europeans. The 'alkalo' (chiefs) of Niumi exercised considerable authority over river trade.", legacy: 'Lower and Upper Niumi districts, North Bank Region.', color: '#0e7490' },
  { name: 'Badibu State', period: 'c. 1500–1820', location: 'North Bank Region', icon: '🛡️', desc: "Federation of Mandinka states known for resistance to the slave trade in the 18th century. The Soninke-Marabout Wars (1850–1901) heavily impacted Badibu.", legacy: 'Lower, Central, and Upper Badibu districts.', color: '#be185d' },
  { name: 'Wuli Kingdom', period: 'c. 1500–1820', location: 'Upper River Region (East)', icon: '⛰️', desc: "One of the easternmost Gambian kingdoms, controlling gold trade routes from the interior of Mali and Guinea. Connected to the Bambuk goldfields via Futa Jallon.", legacy: 'Wuli West and East districts, Upper River Region.', color: '#166534' },
  { name: 'Jimara Kingdom', period: 'c. 1500–1820', location: 'Upper River Region', icon: '⚒️', desc: 'Known for iron smelting and trade. Controlled access routes connecting the River Gambia to the Sudanese interior. Iron weapons and tools were major commodities.', legacy: 'Jimara district maintains the historical name.', color: '#92400e' },
  { name: 'Kantora Kingdom', period: 'c. 1500–1820', location: 'Upper River Region', icon: '🏺', desc: "Major trading state controlling the river crossing points to the north. Connected Gambia's trade to Futa Tooro (Senegal) and the Saharan routes.", legacy: 'Kantora district, Upper River Region.', color: '#1e40af' },
  { name: 'Kaabu Empire (overlord)', period: 'c. 1250–1867', location: 'Greater Senegambia', icon: '🏯', desc: "The dominant Mandinka empire that controlled much of the Senegambia region, including Gambia. Founded by Tiramakhan Traore, a general of Sundiata Keita of the Mali Empire. Collapsed after the Battle of Kansala in 1867.", legacy: 'Cultural influence across all Mandinka communities in Gambia.', color: '#a16207' },
]

const EVIDENCE_TYPES = [
  { type: 'Griot Oral Tradition', icon: '🗣️', desc: "Professional oral historians ('Jeliba' or 'Griot') preserved royal genealogies, battle histories, and migration routes across generations.", examples: ['Kouyate family records', 'Diabaté oral histories', 'Migration narratives from Mali'] },
  { type: 'Portuguese Accounts', icon: '📜', desc: "Portuguese explorers Cadamosto (1455) and Diogo Gomes (1456) recorded first European descriptions of Gambian kingdoms and peoples.", examples: ["Ca' da Mosto: 'Travels in West Africa' (1455)", 'Valentim Fernandes chronicles (1508)', 'Portuguese factor accounts from Cacheu'] },
  { type: 'British / French Records', icon: '🗒️', desc: 'From the 17th century onwards, British Royal African Company and French Compagnie du Sénégal left trade logs describing kingdoms, populations, and governance.', examples: ['RAC factor journals (1670s–1750s)', "Richard Jobson: 'The Golden Trade' (1620)", 'Francis Moore: Inland Travels (1738)'] },
  { type: 'Archaeological Evidence', icon: '🏺', desc: 'The Senegambian Stone Circles (UNESCO) and burial mounds provide material evidence of complex pre-colonial social organisation and trade networks.', examples: ['Wassu stone circles (c. 300 BC)', 'Niani excavations (Mali capital)', 'Iron smelting sites, Jimara'] },
]

const GOVERNANCE = [
  { role: 'Mansa', desc: 'Supreme ruler. Combined judicial, military, religious, and economic authority. Selected by council of nobles or hereditary succession.' },
  { role: 'Alkalo', desc: 'Village chief, appointed by the Mansa or elected by elders. Responsible for tax collection, dispute resolution, and local security.' },
  { role: 'Council of Elders (Kabilo)', desc: 'Advisory council composed of senior nobles, religious leaders (Marabouts), and trade guild heads. Balanced the Mansa\'s authority.' },
  { role: 'Griot (Jali)', desc: 'Court historian, musician, and diplomat. Preserved lineage records, conducted royal ceremonies, and mediated between kingdoms.' },
  { role: 'Marabout (Islamic Scholar)', desc: 'Religious leader who provided Quranic education, conducted Islamic law, and legitimised royal authority from the 11th century onwards.' },
]

export default function PreColonialPage() {
  const [openKingdom, setOpenKingdom] = useState<string | null>(null)

  return (
    <main style={{ minHeight: '100vh', background: '#FDF8F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, #3D1F00 0%, #92400e 60%, #B45309 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Back to Discover</Link>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '0.5rem 0 0.4rem' }}>📜 Pre-Colonial Gambia Records</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
            Kingdoms, oral histories, trade networks and governance before British colonisation (pre-1820)
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {/* Disclaimer */}
        <div style={{ background: '#fef9c3', border: '1px solid #f59e0b', borderRadius: 10, padding: '0.9rem 1.25rem', marginBottom: '1.5rem', fontSize: 13, color: '#92400e' }}>
          <strong>📜 Historical Note:</strong> Pre-colonial records are compiled from oral traditions, European explorer accounts, archaeological evidence, and scholarly reconstructions. These are not official census data. Treat as qualitative historical context.
        </div>

        {/* Overview */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ color: DARK, fontWeight: 800, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>🌍 Overview: Pre-Colonial Senegambia</h2>
          <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            The Gambia River basin was home to sophisticated kingdoms from at least the 13th century. These states were part of the wider Kaabu Empire (successor to the Mali Empire) and participated in trans-Saharan and Atlantic trade networks. The Mandinka people were dominant, alongside Wolof, Fula, Jola, and Serahule communities. Islamic influence arrived via the Saharan trade routes from the 11th century, becoming culturally dominant by the 17th century. The transatlantic slave trade (1500–1800s) severely disrupted population and political structures before British colonisation formalized control in 1820.
          </p>
        </div>

        {/* Kingdoms */}
        <h2 style={{ color: DARK, fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>👑 Pre-Colonial Kingdoms</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
          {KINGDOMS.map((k, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${openKingdom === k.name ? k.color : '#e5e7eb'}`, overflow: 'hidden' }}>
              <div onClick={() => setOpenKingdom(openKingdom === k.name ? null : k.name)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.9rem 1.25rem', cursor: 'pointer' }}>
                <span style={{ fontSize: 28 }}>{k.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>{k.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{k.period} · {k.location}</div>
                </div>
                <span style={{ color: '#9ca3af', fontSize: 14 }}>{openKingdom === k.name ? '▲' : '▼'}</span>
              </div>
              {openKingdom === k.name && (
                <div style={{ padding: '0 1.25rem 1.1rem', borderTop: `1px solid #f3f4f6` }}>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: '0.75rem 0 0.5rem' }}>{k.desc}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}><strong>Legacy:</strong> {k.legacy}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Evidence Types */}
        <h2 style={{ color: DARK, fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>🔍 Evidence Types</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: '2rem' }}>
          {EVIDENCE_TYPES.map((e, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{e.icon}</div>
              <h3 style={{ fontWeight: 700, color: DARK, fontSize: 13, marginBottom: 6 }}>{e.type}</h3>
              <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, marginBottom: 8 }}>{e.desc}</p>
              <ul style={{ margin: 0, paddingLeft: 14 }}>
                {e.examples.map(ex => <li key={ex} style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{ex}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Governance */}
        <h2 style={{ color: DARK, fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>⚖️ Traditional Governance Structure</h2>
        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden', marginBottom: '1.5rem' }}>
          {GOVERNANCE.map((g, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, padding: '10px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <span style={{ fontWeight: 700, color: GOLD, fontSize: 13 }}>{g.role}</span>
              <span style={{ fontSize: 13, color: '#555' }}>{g.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/resources/historical/colonial-census" style={{ display: 'inline-block', padding: '10px 22px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Continue → Colonial Census (1881–1951)
          </Link>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '1.5rem' }}>
          Sources: Ca' da Mosto (1455) · Richard Jobson (1620) · Philip Curtin (1975) · Boubacar Barry (1998) · NCAC Gambia · UNESCO Senegambia · FORTIS OS™ — © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
