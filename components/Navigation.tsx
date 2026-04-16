'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧', localFlag: '🇬🇲' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'wo', label: 'WO', flag: '🇸🇳' },
  { code: 'mn', label: 'MN', flag: '🇬🇲' },
  { code: 'ff', label: 'FF', flag: '🇬🇲' },
]

const NAV_ITEMS = [
  {
    label: 'AI Tools',
    children: [
      { label: '⟳ UJU Cycle™', href: '/uju-cycle' },
      { label: '⚡ Ikenga™', href: '/ikenga' },
      { label: '⚖ Ask UJRIS™', href: '/ask-ujris' },
    ],
  },
  {
    label: 'Marketplace',
    children: [
      { label: '🛍️ Buy Gambia', href: '/marketplace' },
      { label: '📊 Trust Dashboard', href: '/marketplace/dashboard' },
      { label: '💱 Forex Exchange', href: '/marketplace/currency-exchange' },
      { label: '📦 My Orders', href: '/marketplace/orders' },
      { label: '⚖️ Dispute Centre', href: '/marketplace/disputes' },
      { label: '➕ Become a Seller', href: '/seller/register' },
      { label: '🌐 Website Builder', href: '/website-builder' },
      { label: '💰 Pricing', href: '/pricing' },
    ],
  },
  {
    label: 'Sectors',
    children: [
      { label: '⚡ Energy', href: '/energy' },
      { label: '🗺️ NAWEC Map', href: '/resources/nawec', indent: true },
      { label: '🌾 Agriculture', href: '/agriculture' },
      { label: '🏠 Housing', href: '/housing' },
      { label: '🏥 Health', href: '/health' },
      { label: '💳 Fintech', href: '/fintech' },
      { label: '💻 SaaS', href: '/saas' },
      { label: '♻️ Waste', href: '/waste' },
      { label: '♻️ Waste Hub', href: '/resources/waste', indent: true },
      { label: '✈️ Tourism', href: '/tourism' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: '📚 Knowledge Hub', href: '/knowledge' },
      { label: '📊 GBoS Data', href: '/resources/gbos' },
      { label: '🎯 Grants', href: '/funding' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: '🚚 Logistics & Cargo', href: '/services/logistics' },
      { label: '🔧 Equipment Hire', href: '/services/equipment-hire' },
      { label: '👨‍💼 Professionals', href: '/services/professionals' },
      { label: '🚗 Car Hire & Transfers', href: '/services/car-hire' },
      { label: '📊 Tax & Import Duty', href: '/calculators/tax-import' },
    ],
  },
  {
    label: 'Documents',
    children: [
      { label: '✍️ Compose Document', href: '/documents/compose' },
      { label: '📬 Email Outbox', href: '/my-emails' },
    ],
  },
  { label: '🔐 Admin', href: '/admin/diagnostics', topLevel: true },
]

export default function Navigation() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState('en')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(15, 61, 33, 0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(196,148,58,0.25)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 12, flexShrink: 0 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1B4D3E, #0F3D21)',
              border: '2px solid #C4943A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#C4943A', fontFamily: "'Cormorant Garamond', serif" }}>FI</span>
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ color: '#C4943A', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                FORTIS OS
                <span style={{ fontSize: 12 }}>🇬🇲</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>UJU GROUP LTD</div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="nav-desktop">
            {NAV_ITEMS.map((item) => {
              if (item.topLevel) {
                return (
                  <Link key={item.label} href={item.href} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, color: '#C4943A', textDecoration: 'none', background: 'rgba(196,148,58,0.12)', border: '1px solid rgba(196,148,58,0.3)' }}>
                    {item.label}
                  </Link>
                )
              }
              const isOpen = openMenu === item.label
              return (
                <div key={item.label} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: isOpen ? '#C4943A' : 'rgba(255,255,255,0.75)',
                      background: isOpen ? 'rgba(196,148,58,0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {item.label}
                    <span style={{ fontSize: 9, transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: 4,
                      background: '#0F3D21',
                      border: '1px solid rgba(196,148,58,0.2)',
                      borderRadius: 10,
                      padding: '6px 0',
                      minWidth: 220,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                      zIndex: 100,
                    }}>
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: 'flex',
                            padding: `7px ${child.indent ? '28px' : '16px'}`,
                            fontSize: 13,
                            color: child.indent ? '#C4943A' : 'rgba(255,255,255,0.8)',
                            textDecoration: 'none',
                            borderLeft: child.indent ? '2px solid rgba(196,148,58,0.4)' : 'none',
                            marginLeft: child.indent ? 12 : 0,
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(196,148,58,0.25)',
                borderRadius: 6,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12,
                padding: '5px 8px',
                cursor: 'pointer',
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} style={{ background: '#0F3D21' }}>
                  {l.code === 'en' ? '🇬🇲' : l.flag} {l.label}
                </option>
              ))}
            </select>

            <Link href="/admin/diagnostics" style={{ padding: '6px 10px', borderRadius: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              Admin
            </Link>

            <Link href="/auth/login" style={{ padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg, #C4943A, #D4A855)', color: '#0F3D21', textDecoration: 'none' }}>
              Get Access
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-mobile-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#fff', display: 'none' }}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: '#0A2E1A', borderTop: '1px solid rgba(196,148,58,0.2)', maxHeight: '80vh', overflowY: 'auto' }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.topLevel ? (
                  <Link href={item.href} style={{ display: 'block', padding: '12px 24px', color: '#C4943A', fontWeight: 600, fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.5)', fontSize: 11, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {item.label.toUpperCase()}
                    </div>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: 'block',
                          padding: `10px ${child.indent ? '40px' : '32px'}`,
                          color: child.indent ? '#C4943A' : 'rgba(255,255,255,0.75)',
                          fontSize: 14,
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <div style={{ padding: '16px 24px' }}>
              <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 8, background: '#C4943A', color: '#0F3D21', fontWeight: 600, textDecoration: 'none' }}>
                Get Access
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}