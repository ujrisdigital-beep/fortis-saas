'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

interface EscrowData {
  id: string
  currentBalance: number
  minimumBalance: number
  available: number
  requiredEscrow: number
  status: string
  transactions: { id: string; amount: number; txType: string; description: string; createdAt: string }[]
}

interface OwnerData {
  id: string
  businessName: string
  phone: string
  isVerified: boolean
}

interface VehicleData {
  id: string
  make: string
  model: string
  requiresEscrow: number
  status: string
}

const ESCROW_TIERS = [
  { label: 'Economy Vehicles', min: 5000, max: 10000, color: '#065f46' },
  { label: 'Standard / Saloon', min: 7500, max: 15000, color: '#0e7490' },
  { label: 'Premium / Luxury', min: 15000, max: 30000, color: '#4c1d95' },
  { label: 'Commercial / Van', min: 10000, max: 20000, color: '#92400e' },
]

const TX_COLORS: Record<string, string> = {
  DEPOSIT: '#16a34a',
  REPLENISHMENT: '#16a34a',
  CLAIM_DEDUCTION: '#dc2626',
  RELEASE: '#0e7490',
}

export default function EscrowDashboardPage() {
  useSession()
  const [, setOwnerData] = useState<OwnerData | null>(null)
  const [escrow, setEscrow] = useState<EscrowData | null>(null)
  const [vehicles, setVehicles] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [depositAmt, setDepositAmt] = useState(5000)
  const [depositing, setDepositing] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'transactions' | 'guide'>('overview')

  // For demo: use a mock ownerId — in production, fetch from session
  const ownerId = 'demo-owner-id'

  useEffect(() => {
    fetch(`/api/car-hire/escrow?ownerId=${ownerId}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setOwnerData(d.owner)
          setEscrow(d.escrow)
          setVehicles(d.vehicles || [])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleDeposit() {
    setDepositing(true)
    setMsg('')
    try {
      const r = await fetch('/api/car-hire/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deposit', ownerId, amount: depositAmt }),
      })
      const d = await r.json()
      if (d.ok) {
        setMsg(`✅ ${d.message}`)
        if (escrow) setEscrow({ ...escrow, currentBalance: d.newBalance, status: d.status })
      } else {
        setMsg(`❌ ${d.error}`)
      }
    } catch {
      setMsg('❌ Deposit failed')
    }
    setDepositing(false)
  }

  const pct = escrow ? Math.min(100, (escrow.currentBalance / Math.max(escrow.minimumBalance * 2, 10000)) * 100) : 0
  const statusColors: Record<string, string> = {
    ACTIVE: '#16a34a',
    PENDING_DEPOSIT: '#d97706',
    DEPLETED: '#dc2626',
    FROZEN: '#7c3aed',
    RELEASING: '#0e7490',
    RELEASED: '#6b7280',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F0F4F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '2rem 1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
              <Link href="/services/car-hire" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Car Hire</Link>
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, margin: 0 }}>🔐 Owner Escrow Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 13 }}>Manage your escrow account — zero deposit for renters, protection for you</p>
          </div>
          {escrow && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '0.75rem 1.25rem', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Escrow Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: GOLD }}>D{escrow.currentBalance.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: statusColors[escrow.status] || '#fff', fontWeight: 700 }}>{escrow.status.replace(/_/g, ' ')}</div>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading your dashboard...</div>}

        {!loading && !escrow && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
            <h2 style={{ fontWeight: 800, color: DARK, margin: '0 0 0.5rem' }}>No Escrow Account Found</h2>
            <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: 14 }}>You need to register as a vehicle owner and create an escrow account to list vehicles on FORTIS OS Car Hire.</p>
            <Link href="/services/car-hire" style={{ display: 'inline-block', padding: '10px 22px', background: G, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Register as Owner →
            </Link>
          </div>
        )}

        {!loading && escrow && (
          <>
            {/* Alert for low balance */}
            {escrow.status === 'DEPLETED' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.9rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#991b1b' }}>⚠️ Escrow Below Minimum</strong>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#b91c1c' }}>
                    Balance D{escrow.currentBalance.toLocaleString()} is below minimum D{escrow.minimumBalance.toLocaleString()}. Your vehicles are suspended. Replenish within 14 days.
                  </p>
                </div>
                <button onClick={() => setActiveTab('overview')} style={{ padding: '6px 14px', background: '#dc2626', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>
                  Replenish Now
                </button>
              </div>
            )}

            {msg && (
              <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.startsWith('✅') ? '#86efac' : '#fca5a5'}`, borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: msg.startsWith('✅') ? '#166534' : '#991b1b' }}>
                {msg}
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e5e7eb', marginBottom: '1.25rem', overflowX: 'auto' }}>
              {[['overview', '💰 Overview'], ['vehicles', '🚗 My Vehicles'], ['transactions', '📋 Transactions'], ['guide', '📖 Owner Guide']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id as 'overview' | 'vehicles' | 'transactions' | 'guide')} style={{
                  padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: activeTab === id ? GOLD : '#6b7280',
                  borderBottom: activeTab === id ? `2px solid ${GOLD}` : '2px solid transparent',
                  fontSize: 13, fontWeight: 600, marginBottom: -2,
                }}>{label}</button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Balance Card */}
                <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, borderRadius: 14, padding: '1.5rem 2rem', color: '#fff', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                    {[
                      { label: 'Current Balance', val: `D${escrow.currentBalance.toLocaleString()}`, sub: 'Total escrow held' },
                      { label: 'Minimum Required', val: `D${escrow.minimumBalance.toLocaleString()}`, sub: 'To keep listings active' },
                      { label: 'Available to Withdraw', val: `D${escrow.available.toLocaleString()}`, sub: 'After 45-day hold' },
                      { label: 'Vehicle Escrow', val: `D${escrow.requiredEscrow.toLocaleString()}`, sub: `For ${vehicles.length} vehicle(s)` },
                    ].map(c => (
                      <div key={c.label}>
                        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: GOLD }}>{c.val}</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginBottom: 4 }}>
                      <span>Balance health</span>
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 60 ? '#4ade80' : pct >= 30 ? GOLD : '#f87171', borderRadius: 999, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                </div>

                {/* Deposit Form */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, color: DARK, margin: '0 0 1rem', fontSize: '0.95rem' }}>💳 Add to Escrow</h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select value={depositAmt} onChange={e => setDepositAmt(Number(e.target.value))}
                      style={{ padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13 }}>
                      {[1000, 2500, 5000, 7500, 10000, 15000, 20000].map(a => (
                        <option key={a} value={a}>D{a.toLocaleString()}</option>
                      ))}
                    </select>
                    <button onClick={handleDeposit} disabled={depositing}
                      style={{ padding: '9px 20px', background: G, color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: depositing ? 'not-allowed' : 'pointer', opacity: depositing ? 0.6 : 1 }}>
                      {depositing ? 'Processing...' : 'Deposit to Escrow'}
                    </button>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>Payment via GamSwitch / Mobile Money / Card</div>
                  </div>
                </div>

                {/* How it works */}
                <div style={{ background: '#f0f9f0', borderRadius: 12, border: '1px solid #bbf7d0', padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, color: G, margin: '0 0 0.75rem', fontSize: '0.95rem' }}>✅ How the Zero-Deposit Model Works</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {[
                      ['🔐', 'You deposit escrow upfront', 'D5,000+ serves as quality guarantee'],
                      ['🎯', 'Renters pay zero deposit', 'No barrier to booking — more customers'],
                      ['🛡️', 'Insurance covers damage', 'Third-party insurer + your escrow backs claims'],
                      ['💰', 'You earn 75% of rental', '25% platform fee. Escrow returned when you delist'],
                    ].map(([ic, title, sub]) => (
                      <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 20 }}>{ic}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: DARK, fontSize: 13 }}>{title}</div>
                          <div style={{ fontSize: 11, color: '#555' }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, color: DARK, margin: 0, fontSize: '0.95rem' }}>My Listed Vehicles</h3>
                  <Link href="/services/car-hire" style={{ fontSize: 12, fontWeight: 600, color: G, textDecoration: 'none', padding: '6px 12px', background: '#f0f9f0', borderRadius: 6, border: `1px solid ${G}` }}>
                    + Add Vehicle
                  </Link>
                </div>
                {vehicles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
                    <p>No vehicles listed yet.</p>
                    <Link href="/services/car-hire" style={{ fontSize: 13, fontWeight: 600, color: G, textDecoration: 'none' }}>List your first vehicle →</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {vehicles.map(v => (
                      <div key={v.id} style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #e5e7eb', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>🚗 {v.make} {v.model}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>Escrow required: D{v.requiresEscrow.toLocaleString()}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, background: v.status === 'ACTIVE' ? '#d1fae5' : '#fef9c3', color: v.status === 'ACTIVE' ? '#065f46' : '#92400e', padding: '3px 10px', borderRadius: 999 }}>
                          {v.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ background: G, color: '#fff', padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: 13 }}>Transaction History</div>
                {escrow.transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: 13 }}>No transactions yet.</div>
                ) : (
                  escrow.transactions.map((tx, i) => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{tx.description}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(tx.createdAt).toLocaleDateString()} · {tx.txType}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: TX_COLORS[tx.txType] || '#555' }}>
                        {tx.amount > 0 ? '+' : ''}D{Math.abs(tx.amount).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, color: DARK, margin: '0 0 1rem', fontSize: '1rem' }}>📋 Escrow Requirements by Vehicle Type</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {ESCROW_TIERS.map(t => (
                      <div key={t.label} style={{ borderRadius: 10, border: `2px solid ${t.color}`, padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: t.color, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: DARK }}>D{t.min.toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>up to D{t.max.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fffbeb', borderRadius: 12, border: '1px solid #f59e0b', padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>⚠️ What Happens When Escrow is Depleted</h3>
                  <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#555', lineHeight: 1.8 }}>
                    <li>Balance falls below minimum → status becomes DEPLETED</li>
                    <li>All vehicle listings are suspended immediately</li>
                    <li>SMS / email reminder sent — 14 days to replenish</li>
                    <li>If not replenished in 21 days → owner account flagged</li>
                    <li>Replenish to reactivate listings instantly</li>
                  </ol>
                </div>
                <div style={{ background: '#f0f9f0', borderRadius: 12, border: '1px solid #86efac', padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, color: G, margin: '0 0 0.75rem', fontSize: '0.95rem' }}>💰 Revenue & Commission Structure</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: '#555' }}>
                    <div>Platform commission: <strong>25%</strong></div>
                    <div>Owner payout: <strong>75%</strong></div>
                    <div>Insurance surcharge: <strong>Passed to renter</strong></div>
                    <div>Escrow release hold: <strong>45 days</strong></div>
                    <div>Claim resolution: <strong>max 24 hours</strong></div>
                    <div>Renter deposit: <strong>D0 always</strong></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: '2rem' }}>
          FORTIS OS Car Hire Escrow System™ — Owner-backed quality assurance · © FORTIS INVICTA LTD
        </p>
      </div>
    </main>
  )
}
