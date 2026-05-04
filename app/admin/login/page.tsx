'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const G    = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'

const ADMIN_CREDENTIALS = [
  { email: 'admin@fortisos.gm',   password: 'Admin@2026',   role: 'Super Admin',  name: 'Administrator' },
  { email: 'ceo@fortisos.gm',     password: 'CEO@2026',     role: 'CEO',          name: 'Chief Executive' },
  { email: 'support@fortisos.gm', password: 'Support@2026', role: 'Support',      name: 'Support Team' },
]

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const match = ADMIN_CREDENTIALS.find(
        c => c.email === email.trim().toLowerCase() && c.password === password
      )
      if (match) {
        sessionStorage.setItem('adminSession', JSON.stringify({
          email: match.email,
          role: match.role,
          name: match.name,
          loginAt: new Date().toISOString(),
        }))
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: '20px',
    }}>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, boxShadow: '0 40px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, padding: '32px 36px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Admin Portal</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>FORTIS OS™ — Restricted Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: '32px 36px' }}>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              required
              placeholder="admin@fortisos.gm"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB',
                fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                required
                placeholder="••••••••••"
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB',
                  fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = G)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9CA3AF' }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? '#9CA3AF' : `linear-gradient(135deg, ${DARK}, ${G})`,
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'opacity 0.15s',
            }}
          >
            {loading ? '🔐 Verifying…' : '🔐 Access Admin Portal'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ padding: '0 36px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
            This portal is restricted to authorised FORTIS OS staff.<br />
            All access is logged and monitored. Unauthorised access is prohibited.<br />
            <a href="/" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}>← Return to FORTIS OS</a>
          </p>
        </div>
      </div>
    </div>
  )
}
