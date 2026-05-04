'use client'
import { useState, useEffect, useCallback } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'
const BG = '#0A1A0F'

interface DataSource {
  id: string
  name: string
  type: string
  url: string | null
  category: string
  isActive: boolean
  lastFetched: string | null
  fetchInterval: number
  _count: { contents: number; updateLogs: number }
}

interface PendingItem {
  id: string
  title: string
  summary: string
  url: string | null
  qualityScore: number
  createdAt: string
  source: { name: string; category: string }
}

interface Alert {
  id: string
  type: string
  title: string
  message: string
  priority: string
  createdAt: string
}

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [pending, setPending] = useState<PendingItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sources' | 'pending' | 'alerts'>('sources')
  const [fetching, setFetching] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newSource, setNewSource] = useState({ name: '', type: 'rss', url: '', category: 'news' })

  const load = useCallback(async () => {
    setLoading(true)
    const [s, p, a] = await Promise.all([
      fetch('/api/admin/data-sources').then(r => r.json()).catch(() => ({ sources: [] })),
      fetch('/api/admin/pending-content').then(r => r.json()).catch(() => ({ items: [] })),
      fetch('/api/admin/alerts').then(r => r.json()).catch(() => ({ alerts: [] })),
    ])
    setSources(s.sources || [])
    setPending(p.items || [])
    setAlerts(a.alerts || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function runCron() {
    setFetching(true)
    await fetch('/api/cron/fetch-sources').catch(() => null)
    await load()
    setFetching(false)
  }

  async function approveItem(id: string, action: 'approve' | 'reject') {
    await fetch('/api/admin/approve-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    setPending(p => p.filter(i => i.id !== id))
  }

  async function dismissAlert(id: string) {
    await fetch('/api/admin/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setAlerts(a => a.filter(i => i.id !== id))
  }

  async function addSource() {
    if (!newSource.name || !newSource.category) return
    await fetch('/api/admin/data-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSource),
    })
    setShowAdd(false)
    setNewSource({ name: '', type: 'rss', url: '', category: 'news' })
    load()
  }

  const priorityColor = (p: string) =>
    p === 'critical' ? '#FF4444' : p === 'high' ? '#FF8C00' : p === 'medium' ? GOLD : '#666'

  const scoreColor = (s: number) =>
    s >= 80 ? '#22C55E' : s >= 60 ? GOLD : '#FF6B6B'

  return (
    <main style={{ background: BG, minHeight: '100vh', padding: '2rem', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: GOLD, fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>📡 Data Source Management</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '4px 0 0' }}>
              FORTIS OS™ Automated Intelligence Network — {sources.filter(s => s.isActive).length} active sources
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowAdd(true)}
              style={{ padding: '8px 16px', borderRadius: 8, background: `rgba(${GOLD},0.1)`, border: `1px solid ${GOLD}`, color: GOLD, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
            >
              + Add Source
            </button>
            <button
              onClick={runCron}
              disabled={fetching}
              style={{ padding: '8px 16px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontSize: 13, cursor: 'pointer', fontWeight: 700 }}
            >
              {fetching ? '⟳ Fetching...' : '▶ Run Fetch Now'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: 'Active Sources', value: sources.filter(s => s.isActive).length, icon: '📡' },
            { label: 'Pending Review', value: pending.length, icon: '⏳', highlight: pending.length > 0 },
            { label: 'Unread Alerts', value: alerts.length, icon: '🚨', highlight: alerts.length > 0 },
            { label: 'Total Content', value: sources.reduce((s, src) => s + src._count.contents, 0), icon: '📄' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.highlight ? `rgba(196,148,58,0.08)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${stat.highlight ? 'rgba(196,148,58,0.4)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '1rem',
            }}>
              <div style={{ fontSize: 22 }}>{stat.icon}</div>
              <div style={{ color: stat.highlight ? GOLD : '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0 }}>
          {(['sources', 'pending', 'alerts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? GOLD : 'rgba(255,255,255,0.5)',
                borderBottom: activeTab === tab ? `2px solid ${GOLD}` : '2px solid transparent',
                fontSize: 14, fontWeight: 600, textTransform: 'capitalize',
              }}
            >
              {tab === 'pending' ? `Pending (${pending.length})` : tab === 'alerts' ? `Alerts (${alerts.length})` : 'Sources'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : (
          <>
            {/* Sources Tab */}
            {activeTab === 'sources' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sources.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                    No data sources yet. Add one or run the seed script.
                  </div>
                ) : sources.map(src => (
                  <div key={src.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: src.isActive ? `rgba(34,197,94,0.12)` : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                    }}>
                      {src.type === 'rss' ? '📰' : src.type === 'api' ? '🔌' : '🌐'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{src.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {src.url || 'No URL'} • {src.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#fff', fontWeight: 700 }}>{src._count.contents}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>items</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                          {src.lastFetched ? new Date(src.lastFetched).toLocaleDateString() : 'Never'}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>last fetch</div>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: src.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                        color: src.isActive ? '#22C55E' : 'rgba(255,255,255,0.4)',
                      }}>
                        {src.isActive ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending Content Tab */}
            {activeTab === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pending.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                    No pending content for review.
                  </div>
                ) : pending.map(item => (
                  <div key={item.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '1rem 1.25rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, background: 'rgba(255,255,255,0.07)', padding: '2px 8px', borderRadius: 4 }}>
                            {item.source.name}
                          </span>
                          <span style={{ color: scoreColor(item.qualityScore), fontSize: 12, fontWeight: 700 }}>
                            Q: {item.qualityScore}
                          </span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.summary}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => approveItem(item.id, 'approve')}
                          style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => approveItem(item.id, 'reject')}
                          style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                    No unread alerts.
                  </div>
                ) : alerts.map(alert => (
                  <div key={alert.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${priorityColor(alert.priority)}33`,
                    borderLeft: `3px solid ${priorityColor(alert.priority)}`,
                    borderRadius: 12, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ color: priorityColor(alert.priority), fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                          {alert.priority}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{alert.type}</span>
                      </div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{alert.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{alert.message}</div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      style={{ padding: '5px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add Source Modal */}
        {showAdd && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#0F1F14', border: `1px solid rgba(196,148,58,0.3)`, borderRadius: 16, padding: '2rem', width: 480, maxWidth: '95vw' }}>
              <h2 style={{ color: GOLD, margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 800 }}>Add Data Source</h2>
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'e.g. Standard Newspaper' },
                { label: 'URL (RSS/API)', key: 'url', type: 'url', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={newSource[f.key as 'name' | 'url']}
                    onChange={e => setNewSource(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 4 }}>Type</label>
                  <select value={newSource.type} onChange={e => setNewSource(p => ({ ...p, type: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}>
                    <option value="rss">RSS Feed</option>
                    <option value="api">API</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 4 }}>Category</label>
                  <select value={newSource.category} onChange={e => setNewSource(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}>
                    <option value="news">News</option>
                    <option value="statistics">Statistics</option>
                    <option value="environment">Environment</option>
                    <option value="energy">Energy</option>
                    <option value="agriculture">Agriculture</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowAdd(false)}
                  style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={addSource}
                  style={{ padding: '9px 20px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, border: 'none', color: DARK, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Add Source
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
