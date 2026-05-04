'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NationalAssetBadge from '@/components/NationalAssetBadge'
import { NDP_PRIORITIES, DEVELOPMENT_PARTNERS } from '@/lib/gambia-regions'
import { PLATFORM_STATS, PARTNERSHIP_TIERS } from '@/lib/national-asset-data'

const G = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'

export default function NationalAssetPage() {
  const [stats, setStats] = useState(PLATFORM_STATS)
  const [activeTab, setActiveTab] = useState<'overview' | 'ndp' | 'partners' | 'framework'>('overview')

  useEffect(() => {
    fetch('/api/national-stats')
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, totalCases: d.total, regionsActive: d.regionsActive, avgResolutionDays: d.avgResolutionDays })))
      .catch(() => {})
  }, [])

  const TABS = [
    { id: 'overview', label: '📊 Impact Overview' },
    { id: 'ndp', label: '🇬🇲 NDP Alignment' },
    { id: 'partners', label: '🤝 Dev Partners' },
    { id: 'framework', label: '📋 PPP Framework' },
  ] as const

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Hero */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #0C7B7A 100%)`, padding: '3rem 1.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <NationalAssetBadge variant="compact" />
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, margin: '1rem 0 0.75rem', lineHeight: 1.15 }}>
            The Gambia&apos;s<br />Justice Operating System
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: '55ch', margin: '0 auto 1.75rem' }}>
            Making justice accessible, affordable, and accountable — for every Gambian citizen.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/docs/national-asset-proposal.pdf" style={{ display: 'inline-block', padding: '11px 22px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              📥 Download Proposal
            </a>
            <Link href="/admin/gambia-dashboard" style={{ display: 'inline-block', padding: '11px 22px', background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              📊 Impact Dashboard
            </Link>
            <Link href="/contact" style={{ display: 'inline-block', padding: '11px 22px', background: 'transparent', color: 'rgba(255,255,255,0.75)', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              📧 Request Briefing
            </Link>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { v: `${stats.totalCases}+`, l: 'Cases Processed', sub: 'across all regions' },
            { v: `${stats.successRate}%`, l: 'Success Rate', sub: '+5% improvement' },
            { v: `${stats.regionsActive}/7`, l: 'Regions Active', sub: 'Gambia-wide' },
            { v: `${stats.avgResolutionDays} days`, l: 'Avg Resolution', sub: `vs ${stats.traditionalAvgDays}+ traditional` },
            { v: `£${stats.costToUser}`, l: 'Cost to Citizen', sub: `vs £${stats.traditionalLegalCost.min}–£${stats.traditionalLegalCost.max} legal` },
          ].map(({ v, l, sub }) => (
            <div key={l} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>{v}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: DARK, marginTop: 2 }}>{l}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tab nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1rem', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '12px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
              background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `3px solid ${GOLD}` : '3px solid transparent',
              color: activeTab === tab.id ? GOLD : '#555', transition: 'all 0.15s',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.75rem 1.5rem' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(196,148,58,0.2)' }}>
              <h2 style={{ fontWeight: 800, color: DARK, fontSize: '1.15rem', margin: '0 0 0.75rem' }}>🇬🇲 Why Fortis OS is a National Asset</h2>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, margin: 0 }}>
                Fortis OS is the first AI-powered justice infrastructure platform built specifically for The Gambia. It reduces the cost of legal access by over 95%, cuts resolution time from months to days, and creates a real-time, anonymised window into access-to-justice metrics across all seven regions — giving government officials, development partners, and the public a measurable, accountable infrastructure for the rule of law.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { icon: '⚖️', title: 'Access to Justice', desc: 'AI-generated appeals, evidence organisation, and dispute resolution for every Gambian — regardless of income or location.' },
                { icon: '📡', title: 'National Data Infrastructure', desc: 'Real-time anonymised dashboards for Ministry officials. Open APIs for court integration. GDPA 2018 compliant by design.' },
                { icon: '🎓', title: 'Digital Skills Pipeline', desc: 'Free training hub with certifications. Built by Gambian developers. Employer partnerships creating local tech jobs.' },
                { icon: '🌍', title: 'SDG 16 Alignment', desc: 'Directly measurable progress on SDG 16.3 (Access to Justice) and 16.6 (Effective, Accountable Institutions).' },
              ].map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, color: DARK, fontSize: 14, marginBottom: 6 }}>{c.title}</div>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NDP ALIGNMENT */}
        {activeTab === 'ndp' && (
          <div>
            <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: 13, color: '#92400e' }}>
              <strong>🇬🇲 National Development Plan 2023-2027</strong> — Fortis OS directly addresses four priority areas, providing measurable impact data for each.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {NDP_PRIORITIES.map((p, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', borderLeft: `5px solid ${GOLD}`, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ background: DARK, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>Priority {p.ref}</span>
                    <span style={{ background: 'rgba(27,77,62,0.1)', color: G, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>{p.sdg}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: DARK, fontSize: 15, marginBottom: 6 }}>{p.title}</div>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEVELOPMENT PARTNERS */}
        {activeTab === 'partners' && (
          <div>
            <p style={{ fontSize: 14, color: '#555', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Fortis OS is positioned for co-funding, technical partnership, and aligned implementation with major development partners active in The Gambia.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
              {DEVELOPMENT_PARTNERS.map((p, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 30 }}>{p.logo}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.focus}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: 999 }}>{p.status}</span>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(135deg, rgba(196,148,58,0.08), rgba(27,77,62,0.06))`, borderRadius: 12, border: `1.5px solid rgba(196,148,58,0.25)`, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: DARK, fontSize: 14, marginBottom: 6 }}>Not seeing your organisation?</div>
              <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px' }}>Fortis OS welcomes all development partners aligned with justice, digital transformation, and SDG 16.</p>
              <Link href="/contact" style={{ display: 'inline-block', padding: '9px 20px', background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                Contact Us Directly →
              </Link>
            </div>
          </div>
        )}

        {/* PPP FRAMEWORK */}
        {activeTab === 'framework' && (
          <div>
            <p style={{ fontSize: 14, color: '#555', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Three partnership tiers are available — from zero-cost recognition to full public-private co-investment. Ministries can enter at any level and scale up.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {PARTNERSHIP_TIERS.map((tier, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, border: i === 2 ? `2px solid ${GOLD}` : '1.5px solid #e5e7eb', padding: '1.5rem', position: 'relative' }}>
                  {i === 2 && <div style={{ position: 'absolute', top: -10, left: 20, background: GOLD, color: DARK, fontSize: 10, fontWeight: 800, padding: '2px 10px', borderRadius: 999 }}>RECOMMENDED</div>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', marginBottom: 4 }}>TIER {tier.tier}</div>
                  <div style={{ fontWeight: 800, color: DARK, fontSize: 16, marginBottom: 4 }}>{tier.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>{tier.cost}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tier.items.map((item, j) => (
                      <li key={j} style={{ fontSize: 12, color: '#444', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                        <span style={{ color: G, fontWeight: 800, flexShrink: 0 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" style={{ display: 'block', textAlign: 'center', marginTop: 16, padding: '9px', background: i === 2 ? GOLD : G, color: i === 2 ? DARK : '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                    Request Discussion →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '2rem' }}>
          Fortis OS · fortisos.cloud · fortisos.co.uk · ceo@fortisos.co.uk · © FORTIS INVICTA LTD {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}
