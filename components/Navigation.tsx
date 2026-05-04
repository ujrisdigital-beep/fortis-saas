'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import FortisLogo from './FortisLogo'
import GambianFlag from './GambianFlag'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const NAV_BG = '#0A2E1A'

// ─── NAV DATA ────────────────────────────────────────────────────────────────

type NavItem = {
  name: string
  href: string
  icon?: string
  desc?: string
  indent?: boolean
  featured?: boolean
  isSectionHeader?: boolean
  isDivider?: boolean
  highlight?: boolean
}

const RESOURCES: NavItem[] = [
  { name: '🇬🇲 DISCOVER GAMBIA', href: '/discover', isSectionHeader: true, icon: '🌟' },
  { name: '🗺️ Interactive Tourism Map', href: '/tourism/discover', desc: '15+ sites · distance calculator', indent: true, featured: true },
  { name: '🌍 Tourism Explorer (3D)', href: '/tourism/explore', desc: 'UNESCO · Parks · Heritage · Beaches · Google Earth', indent: true, featured: true },
  { name: '🏛️ Heritage Sites Explorer', href: '/tourism/heritage', desc: 'UNESCO & historical landmarks', indent: true },
  { name: '🎉 Festival Calendar 2026', href: '/festivals', desc: 'Roots, Kanilai & more', indent: true },
  { name: '🇬🇲 Gambian Culture Hub', href: '/gambian-culture', desc: '45+ assets — music, food, masquerades, folklore', indent: true, featured: true },
  { name: '🌾 Agriculture & Environment', href: '/discover#agriculture', desc: 'Indigenous crops, livestock, aquaculture' },
  { name: '🌾 Produce Mapping', href: '/agriculture/produce-map', desc: 'Crops by region & season', indent: true },
  { name: '🌱 Soil & Crop Map', href: '/soil-mapping', desc: 'Suitability, ISRIZ-7, salt zones', indent: true, featured: true },
  { name: '🐟 Rice-Fish Systems', href: '/agriculture/rice-fish', desc: 'Integrated farming + agro-tourism', indent: true },
  { name: '🧮 Smart Agriculture', href: '/smart-agriculture', desc: 'Regenerative farming ROI calculator' },
  { name: '🧮 Smart Livestock', href: '/smart-livestock', desc: 'Indigenous breeds + BSFL ROI calculator' },
  { name: '', href: '#', isDivider: true },
  { name: '📚 Knowledge Hub', href: '/knowledge', desc: 'Research & case studies' },
  { name: '📊 GBoS Data Portal', href: '/resources/gbos', desc: 'Census, GDP, inflation trends' },
  { name: '📈 Census Dashboard', href: '/resources/census', desc: 'Interactive population data' },
  { name: '📜 Pre-Colonial Records', href: '/resources/historical/pre-colonial', desc: 'Kingdoms & oral histories' },
  { name: '📋 Colonial Census', href: '/resources/historical/colonial-census', desc: '1881–1951 data' },
  { name: '👥 Population Data', href: '/resources/population-data', desc: 'Tiered reference spine' },
  { name: '', href: '#', isDivider: true },
  { name: '💡 Digital Economy', href: '/resources/digital-economy', desc: 'E-commerce, digital payments' },
  { name: '💳 Fintech Guide', href: '/resources/fintech', desc: 'Mobile money, banking' },
  { name: '🗺️ Financial Map', href: '/financial-map', desc: '42+ institutions · GPS · all categories', indent: true, featured: true },
  { name: '🌍 AfCFTA Trade Portal', href: '/resources/afcfta', desc: 'Continental trade agreements' },
  { name: '🎓 Digital Skills Hub', href: '/training/hub', desc: 'Free courses & certifications' },
  { name: '🔒 Cybersecurity Hub', href: '/resources/cybersecurity', desc: 'Threats & best practices' },
  { name: '🌳 Forest Data', href: '/resources/forest', desc: 'Tree cover, deforestation' },
  { name: '📡 Telecom Map', href: '/resources/telecom', desc: 'Network coverage' },
  { name: '', href: '#', isDivider: true },
  { name: '🤝 TANGO Directory', href: '/knowledge/tango', desc: 'NGOs & civil society' },
  { name: '💼 Grants Portal', href: '/funding', desc: 'Funding opportunities' },
  { name: '💬 Testimonials', href: '/testimonials', desc: 'User experiences' },
  { name: '✈️ Airport Live', href: '/resources/airport', desc: 'Real-time flight status' },
  { name: '🗑️ Waste Data', href: '/resources/waste', desc: 'GBoS & World Bank' },
  { name: '', href: '#', isDivider: true },
  { name: '🏛️ National Asset', href: '/national-asset', desc: 'Government briefing & PPP framework' },
  { name: '🤝 Dev Partners', href: '/partners', desc: '50+ UN agencies, banks, INGOs · 360° Street View', featured: true },
  { name: '🏢 GIEPA', href: '/resources/giepa', desc: 'Investment offices · 360° virtual tour', featured: true },
  { name: '🌍 Embassies & Missions', href: '/embassies', desc: '360° Street View · websites · directions', featured: true },
  { name: '🎓 Education Institutions', href: '/education', desc: '40+ institutions · 360° Street View · admission info', featured: true },
  { name: '⚓ Ports & Ferries', href: '/transport/ports-ferries', desc: '16 maritime locations · schedules · fares', featured: true },
  { name: '🏛️ Professional Bodies', href: '/professional-bodies', desc: 'Bar, Medical, Engineering, Unions & more' },
  { name: '🖥️ ITAG — ICT Association', href: '/professional-bodies/itag', desc: 'Annual ICT Expo · GPS map · 43rd institution', indent: true, featured: true },
  { name: '👥 Trade Unions', href: '/unions', desc: 'GTU, GTUC, GFWTWU & more · 8 unions' },
  { name: '🤝 Cooperatives', href: '/cooperatives', desc: 'Farmers, women, youth & financial coops' },
  { name: '🏛️ Government Agencies', href: '/government', desc: 'Ministries, regulators, parastatals', featured: true },
  { name: '🛡️ CIIP Security', href: '/cybersecurity/ciip', desc: 'Critical infrastructure protection dashboard' },
  { name: '🌾 Brumen Village', href: '/villages/brumen', desc: 'Foni Jarrol · Health Centre · Rice Cooperative' },
  { name: '🚨 Emergency Services', href: '/emergency', desc: 'Hospitals · Police · Fire — all 7 regions', featured: true },
  { name: '🐄 Livestock Census', href: '/livestock', desc: 'GBoS cattle, goats, sheep, poultry by region' },
  { name: '📡 Mass Media', href: '/media', desc: 'Radio · TV · Newspapers · Online media', featured: true },
  { name: '', href: '#', isDivider: true },
  { name: '🧂 Salt Investment Calculator', href: '/soil-mapping/salt-investment', desc: 'ROI, payback & GIEPA incentives' },
  { name: '🌾 Crop Suitability Tool', href: '/soil-mapping/crop-suitability', desc: 'AI-powered soil × crop analysis' },
  { name: '', href: '#', isDivider: true },
  { name: '🎓 Verify Certificate', href: '/certificate/verify', desc: 'Check FORTIS OS certificate authenticity', featured: true },
]

const SERVICES: NavItem[] = [
  { name: '🚗 Car Hire', href: '/services/car-hire', desc: 'Zero deposit, insurance included' },
  { name: '🔧 Equipment Hire', href: '/services/equipment-hire', desc: 'Tools & machinery' },
  { name: '🚚 Logistics', href: '/services/logistics', desc: 'Delivery & transport' },
  { name: '👔 Professionals', href: '/services/professionals', desc: 'Find verified experts' },
  { name: '💰 Owner Escrow', href: '/owner/escrow-dashboard', desc: 'Vehicle owner dashboard' },
]

const AI_TOOLS: NavItem[] = [
  { name: '🎨 IKENGA™', href: '/ikenga', desc: 'Social media content generation' },
  { name: '🔄 UJU Cycle™', href: '/uju-cycle', desc: 'Business transformation' },
  { name: '🛍️ Marketplace', href: '/marketplace', desc: 'Buy Gambia — local products' },
  { name: '🌐 Website Builder', href: '/website-builder', desc: 'Build your online presence' },
  { name: '📋 Free Builder Guide', href: '/website-builder/guides', desc: 'Wix, Webador, GoDaddy compared', featured: true },
  { name: '📝 Documents', href: '/documents/compose', desc: 'Compose & send documents' },
  { name: '🪪 Identity Suite', href: '/ikenga/identity', desc: 'Digital identity tools' },
  { name: '⚖️ UJRIS Gambia', href: '/ujris/gambia', desc: 'Legal intelligence — Labour Act 2007', featured: true },
]

const ADMIN: NavItem[] = [
  { name: '🔐 Admin Login', href: '/admin/login', desc: 'Staff portal — restricted access', featured: true },
  { name: '🛡️ Admin Dashboard', href: '/admin/dashboard', desc: 'Diagnostics · SOPs · KPIs', featured: true },
  { name: '', href: '#', isDivider: true },
  { name: '🤖 AI Monitor', href: '/admin/ai-monitor' },
  { name: '⚠️ Escalations', href: '/admin/escalations' },
  { name: '📋 SOPs', href: '/admin/sop' },
  { name: '🔍 Diagnostics', href: '/admin/diagnostics' },
  { name: '💰 Billing Control', href: '/admin/billing', desc: 'Usage thresholds · cost alerts' },
  { name: '⚖️ Court Orders', href: '/admin/court-orders' },
  { name: '👑 Super Admin', href: '/admin/super' },
  { name: '🎓 Training Admin', href: '/admin/training-hub' },
  { name: '⚖️ Legal Compliance', href: '/admin/legal' },
  { name: '📡 Data Sources', href: '/admin/data-sources' },
  { name: '📚 Content Curation', href: '/admin/curation' },
  { name: '🇬🇲 Gambia Dashboard', href: '/admin/gambia-dashboard' },
  { name: '✈️ Airport Dashboard', href: '/admin/airport-dashboard' },
]

// ─── DROPDOWN ────────────────────────────────────────────────────────────────

function Dropdown({ label, items, isAdmin }: { label: string; items: NavItem[]; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 180)
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        style={{
          padding: '7px 13px',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          color: isAdmin ? GOLD : open ? GOLD : '#FFFFFF',
          background: isAdmin ? 'rgba(196,148,58,0.12)' : open ? 'rgba(196,148,58,0.1)' : 'transparent',
          border: isAdmin ? '1px solid rgba(196,148,58,0.3)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
        <span style={{ fontSize: 9, display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {open && (
        <div className="nav-dropdown" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '6px 0',
          minWidth: 280,
          maxWidth: 320,
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          zIndex: 9999,
        }}>
          {items.map((item, i) => {
            if (item.isDivider) return <div key={i} style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />

            if (item.isSectionHeader) return (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${G}, #2E7D64)`,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: 13, letterSpacing: '0.04em' }}>{item.name}</span>
              </div>
            )

            return (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: `8px ${item.indent ? '28px' : '16px'}`,
                  textDecoration: 'none',
                  background: item.featured ? 'rgba(196,148,58,0.06)' : 'transparent',
                  transition: 'background 0.12s',
                }}
                className="nav-dd-link"
              >
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.name.split(' ')[0]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: item.featured ? GOLD : '#1a1a1a', lineHeight: 1.3 }}>
                    {item.name.replace(/^[\p{Emoji}\s]+/u, '').trim()}
                  </div>
                  {item.desc && (
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{item.desc}</div>
                  )}
                </div>
                {item.featured && (
                  <span style={{ fontSize: 9, fontWeight: 700, background: GOLD, color: G, padding: '2px 6px', borderRadius: 999, flexShrink: 0, alignSelf: 'center' }}>NEW</span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── MAIN NAVIGATION ─────────────────────────────────────────────────────────

export default function Navigation() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const role = (session?.user as { role?: string } | undefined)?.role
  const canViewAdmin = ['SUPER_ADMIN', 'CEO', 'BOARD'].includes(role ?? '')

  const mobileSections: { label: string; items: NavItem[] }[] = [
    { label: 'Resources', items: RESOURCES },
    { label: 'Services', items: SERVICES },
    { label: 'AI Tools', items: AI_TOOLS },
    ...(canViewAdmin ? [{ label: '🔐 Admin', items: ADMIN }] : []),
  ]

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: NAV_BG,
        borderBottom: '1px solid rgba(196,148,58,0.25)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {/* ── Desktop bar ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', height: 64, gap: 6 }}>

          {/* Logo */}
          <div style={{ flexShrink: 0, marginRight: 8 }}>
            <FortisLogo variant="full" white />
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="nav-desktop">
            <Link href="/" style={{ padding: '7px 13px', fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', borderRadius: 6 }} className="nav-top-link">
              Home
            </Link>
            <Link href="/discover" style={{ padding: '7px 13px', fontSize: 14, fontWeight: 700, color: GOLD, background: 'rgba(196,148,58,0.1)', borderRadius: 6, textDecoration: 'none', border: '1px solid rgba(196,148,58,0.3)' }}>
              🌟 Discover
            </Link>
            <Dropdown label="Resources" items={RESOURCES} />
            <Dropdown label="Services" items={SERVICES} />
            <Dropdown label="AI Tools" items={AI_TOOLS} />
            {canViewAdmin && <Dropdown label="🔐 Admin" items={ADMIN} isAdmin />}
            <Link href="/contact" style={{ padding: '7px 13px', fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', borderRadius: 6 }} className="nav-top-link">
              📧 Contact
            </Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }} className="nav-desktop">
            <GambianFlag size="sm" showText={false} />
            {status === 'loading' ? null : status === 'authenticated' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/dashboard" style={{
                  display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none',
                  background: 'rgba(196,148,58,0.12)', border: '1px solid rgba(196,148,58,0.25)',
                  borderRadius: 20, padding: '5px 12px',
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: G, flexShrink: 0 }}>
                    {(session.user?.name ?? session.user?.email ?? 'U').charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user?.name ?? (session.user?.email ?? '').split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, background: 'rgba(220,38,38,0.12)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 6, cursor: 'pointer' }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: G, textDecoration: 'none' }}>
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="nav-mobile-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#fff', fontSize: 22, display: 'none' }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div style={{ background: NAV_BG, borderTop: '1px solid rgba(196,148,58,0.2)', maxHeight: '85vh', overflowY: 'auto' }}>
            {/* Mobile logo */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(196,148,58,0.15)' }}>
              <FortisLogo variant="mobile" white />
            </div>

            {/* Home & Discover */}
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 20px', color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              🏠 Home
            </Link>
            <Link href="/discover" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 20px', color: GOLD, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'rgba(196,148,58,0.08)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              🌟 Discover Gambia
            </Link>

            {/* Collapsible sections */}
            {mobileSections.map(({ label, items }) => (
              <div key={label}>
                <button
                  onClick={() => setMobileSection(mobileSection === label ? null : label)}
                  style={{ width: '100%', textAlign: 'left', padding: '11px 20px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {label}
                  <span style={{ fontSize: 9, transform: mobileSection === label ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {mobileSection === label && (
                  <div style={{ background: 'rgba(0,0,0,0.15)' }}>
                    {items.filter(it => !it.isDivider && !it.isSectionHeader).map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'block',
                          padding: `10px ${item.indent ? '40px' : '28px'}`,
                          color: item.featured ? GOLD : 'rgba(255,255,255,0.75)',
                          fontSize: 13,
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Auth */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(196,148,58,0.15)' }}>
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, textDecoration: 'none' }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: G }}>
                      {(session.user?.name ?? session.user?.email ?? 'U').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{session.user?.name ?? (session.user?.email ?? '').split('@')[0]}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{session.user?.email}</div>
                    </div>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(220,38,38,0.12)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.25)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 8, background: GOLD, color: G, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Sign in to FORTIS OS
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
        .nav-top-link:hover { background: rgba(196,148,58,0.1) !important; color: #C4943A !important; }
        .nav-dd-link:hover { background: rgba(196,148,58,0.08) !important; }
        /* Ensure dropdowns are never clipped by ancestor overflow */
        nav { overflow: visible !important; }
        /* Gold scrollbar for dropdowns */
        .nav-dropdown::-webkit-scrollbar { width: 5px; }
        .nav-dropdown::-webkit-scrollbar-track { background: #f9fafb; border-radius: 3px; }
        .nav-dropdown::-webkit-scrollbar-thumb { background: #C4943A; border-radius: 3px; }
      `}</style>
    </>
  )
}
