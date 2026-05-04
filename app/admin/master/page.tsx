'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const G    = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'
const RED  = '#DC2626'
const AMBER = '#D97706'
const BLUE  = '#2563EB'
const TEAL  = '#0C7B7A'

// ── TYPES ─────────────────────────────────────────────────────────────────────
type AlarmLevel = 1 | 2 | 3
type AlarmStatus = 'active' | 'resolving' | 'resolved'
type ModuleStatus = 'healthy' | 'degraded' | 'critical'
type Tab = 'overview' | 'metrics' | 'alarms' | 'credit' | 'intelligence' | 'runbook'

interface ModuleMetric {
  name: string; icon: string; requests: number; errors: number
  latency: number; users: number; uptime: number; status: ModuleStatus
  revenue: number
}

interface AlarmRecord {
  id: string; level: AlarmLevel; module: string; trigger: string
  ts: string; status: AlarmStatus; aiAction: string; sop?: string
}

interface CreditFactor {
  source: string; label: string; score: number; weight: number; available: boolean
}

interface PromptTemplate {
  id: string; query: string; context: string[]; successRate: number; uses: number
}

interface Pattern {
  id: string; condition: string; probability: number; recommendation: string
}

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const MODULES_BASE: ModuleMetric[] = [
  { name:'UJU Cycle™',     icon:'🔄', requests:4821, errors:12,  latency:312, users:234,  uptime:99.8, status:'healthy',  revenue:0 },
  { name:'IKENGA™',        icon:'🎨', requests:3290, errors:8,   latency:287, users:189,  uptime:99.9, status:'healthy',  revenue:147000 },
  { name:'ASK UJRIS™',     icon:'⚖️', requests:2104, errors:31,  latency:541, users:98,   uptime:98.6, status:'degraded', revenue:52500 },
  { name:'Marketplace',    icon:'🛍️', requests:8430, errors:19,  latency:198, users:612,  uptime:99.7, status:'healthy',  revenue:892400 },
  { name:'Financial Map',  icon:'🗺️', requests:1876, errors:4,   latency:145, users:443,  uptime:99.9, status:'healthy',  revenue:0 },
  { name:'Training Hub',   icon:'🎓', requests:921,  errors:2,   latency:167, users:78,   uptime:100,  status:'healthy',  revenue:16000 },
  { name:'Legal Intel',    icon:'🏛️', requests:640,  errors:7,   latency:389, users:55,   uptime:99.1, status:'healthy',  revenue:22400 },
  { name:'Agriculture',    icon:'🌾', requests:412,  errors:1,   latency:132, users:34,   uptime:100,  status:'healthy',  revenue:0 },
  { name:'Airport Intel',  icon:'✈️', requests:298,  errors:0,   latency:109, users:28,   uptime:100,  status:'healthy',  revenue:0 },
  { name:'Carbon Credits', icon:'🌿', requests:187,  errors:3,   latency:223, users:19,   uptime:99.4, status:'healthy',  revenue:8200 },
]

const ALARMS_INIT: AlarmRecord[] = [
  { id:'AL-001', level:1, module:'ASK UJRIS™',  trigger:'Latency > 500ms on /api/ask-ujris',        ts:'09:41',  status:'resolving', aiAction:'Auto-routing to secondary instance',         },
  { id:'AL-002', level:2, module:'Marketplace', trigger:'Error rate 3.2% on /api/marketplace/cart', ts:'09:38',  status:'resolving', aiAction:'Circuit breaker engaged, fallback active',   },
  { id:'AL-003', level:1, module:'IKENGA™',     trigger:'CPU 74% on generate endpoint',             ts:'09:35',  status:'resolved',  aiAction:'Auto-scaled +1 worker',                     },
  { id:'AL-004', level:3, module:'Database',    trigger:'Slow query > 8s on user_corrections table',ts:'09:22',  status:'active',    aiAction:'Human required — see Runbook DB-001',
    sop:'1. STOP writes to user_corrections\n2. Run EXPLAIN ANALYZE on slow query\n3. Add index: CREATE INDEX CONCURRENTLY idx_uc_user_id ON user_corrections(user_id)\n4. Monitor for 5 min\n5. Resume writes' },
  { id:'AL-005', level:2, module:'Auth',        trigger:'Unusual login pattern — 47 fails/min',     ts:'09:18',  status:'resolving', aiAction:'Rate limiter tightened to 5 req/min/IP',    },
]

const CREDIT_FACTORS: CreditFactor[] = [
  { source:'TANGO Directory',        label:'Business Registration Age',  score:820, weight:0.20, available:true  },
  { source:'Marketplace',            label:'Revenue Consistency',         score:740, weight:0.18, available:true  },
  { source:'UJU Cycle',              label:'Management Capability',       score:680, weight:0.15, available:true  },
  { source:'UJRIS Contract Score',   label:'Legal Risk Score',            score:810, weight:0.15, available:true  },
  { source:'Financial Map',          label:'Banking Relationship Depth',  score:620, weight:0.12, available:true  },
  { source:'Training Hub',           label:'Workforce Capability',        score:760, weight:0.10, available:false },
  { source:'IKENGA Brand Score',     label:'Market Position',             score:710, weight:0.10, available:true  },
]

const PROMPTS: PromptTemplate[] = [
  { id:'PT-01', query:'help me grow my business', context:['sector','employees','biggest challenge'], successRate:89, uses:412 },
  { id:'PT-02', query:'i need a loan',             context:['business age','revenue','collateral'],   successRate:94, uses:287 },
  { id:'PT-03', query:'check this contract',       context:['contract type','parties','amount'],      successRate:97, uses:1840 },
  { id:'PT-04', query:'improve my brand',          context:['target audience','platforms','budget'],  successRate:82, uses:631 },
]

const PATTERNS: Pattern[] = [
  { id:'P1', condition:'Low UJU digitise + Low IKENGA + No TANGO', probability:0.84, recommendation:'Complete TANGO verification → +15% credit score' },
  { id:'P2', condition:'Marketplace GMV > D50k + Training cert', probability:0.91, recommendation:'Eligible for Standard tier loan — notify Financial Map partners' },
  { id:'P3', condition:'UJRIS red flags > 3 + Legal score < 500', probability:0.79, recommendation:'Flag for human compliance review before credit decision' },
  { id:'P4', condition:'Knowledge Hub > 10 articles read + UJU complete', probability:0.88, recommendation:'High retention probability — offer subscription upgrade' },
]

// ── HELPERS ───────────────────────────────────────────────────────────────────
function jitter(val: number, pct = 0.04) {
  return Math.round(val * (1 + (Math.random() - 0.5) * pct))
}
function fmtN(n: number) { return n.toLocaleString() }
function fmtD(n: number) { return `D${(n/1000).toFixed(0)}k` }
function creditTier(s: number): { tier: string; color: string } {
  if (s >= 800) return { tier: 'Prime',     color: '#10B981' }
  if (s >= 600) return { tier: 'Standard',  color: GOLD }
  if (s >= 400) return { tier: 'Subprime',  color: AMBER }
  return              { tier: 'High Risk',  color: RED }
}
function alarmColor(l: AlarmLevel) { return l === 3 ? RED : l === 2 ? AMBER : BLUE }
function alarmLabel(l: AlarmLevel) { return l === 3 ? 'LEVEL 3 — CRITICAL' : l === 2 ? 'LEVEL 2 — WARNING' : 'LEVEL 1 — INFO' }

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function MetricChip({ label, value, sub, color = G }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', textAlign: 'center', minWidth: 120 }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: GOLD, fontWeight: 700 }}>{sub}</div>}
      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function StatusDot({ status }: { status: ModuleStatus }) {
  const c = status === 'healthy' ? '#10B981' : status === 'degraded' ? AMBER : RED
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c, marginRight: 6, boxShadow: `0 0 6px ${c}` }} />
}

function AlarmBadge({ level }: { level: AlarmLevel }) {
  const c = alarmColor(level)
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: `${c}18`, color: c, border: `1px solid ${c}40`, whiteSpace: 'nowrap' }}>
      L{level}
    </span>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MasterDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [modules, setModules] = useState<ModuleMetric[]>(MODULES_BASE)
  const [alarms, setAlarms] = useState<AlarmRecord[]>(ALARMS_INIT)
  const [selectedModule, setSelectedModule] = useState(0)
  const [creditId, setCreditId] = useState('TANGO-12345')
  const [creditResult, setCreditResult] = useState<null | { score: number; ci: number; factors: CreditFactor[] }>(null)
  const [creditLoading, setCreditLoading] = useState(false)
  const [tick, setTick] = useState(0)
  const [selfImprove, setSelfImprove] = useState({ successRate: 84.2, corrections: 1204, calibration: 78.1, retrain: '2026-05-01 02:00' })

  // Real-time metric simulation
  useEffect(() => {
    const id = setInterval(() => {
      setModules(prev => prev.map(m => ({
        ...m,
        requests: jitter(m.requests, 0.06),
        errors:   Math.max(0, jitter(m.errors, 0.15)),
        latency:  Math.max(80, jitter(m.latency, 0.08)),
        users:    jitter(m.users, 0.03),
      })))
      setSelfImprove(prev => ({ ...prev, successRate: +(prev.successRate + (Math.random() - 0.48) * 0.1).toFixed(1) }))
      setTick(t => t + 1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const runCreditScore = useCallback(async () => {
    setCreditLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const weighted = CREDIT_FACTORS.reduce((acc, f) => acc + (f.available ? f.score * f.weight : 500 * f.weight), 0)
    const score = Math.round(weighted)
    const ci = Math.round(Math.random() * 20 + 10)
    setCreditResult({ score, ci, factors: CREDIT_FACTORS })
    setCreditLoading(false)
  }, [])

  const totalRequests = modules.reduce((a, m) => a + m.requests, 0)
  const totalUsers    = modules.reduce((a, m) => a + m.users, 0)
  const totalRevenue  = modules.reduce((a, m) => a + m.revenue, 0)
  const avgUptime     = (modules.reduce((a, m) => a + m.uptime, 0) / modules.length).toFixed(2)
  const activeAlarms  = alarms.filter(a => a.status === 'active')
  const l3Alarms      = alarms.filter(a => a.level === 3 && a.status === 'active')
  const mod = modules[selectedModule]

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',     label: '⚡ Overview'     },
    { key: 'metrics',      label: '📊 Metrics'      },
    { key: 'alarms',       label: `🚨 Alarms${l3Alarms.length ? ` (${l3Alarms.length}🔴)` : ''}` },
    { key: 'credit',       label: '💳 Credit Engine' },
    { key: 'intelligence', label: '🧠 Intelligence'  },
    { key: 'runbook',      label: '📋 Runbook'       },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── TOP HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`, padding: '1.5rem 2rem', borderBottom: `2px solid ${GOLD}40` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>FORTIS OS — MASTER DASHBOARD</h1>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: `${GOLD}CC` }}>10-AI UJU Cycle + Tyler Wise Protocol · Sovereign Intelligence Platform</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {l3Alarms.length > 0 && (
                <div style={{ background: `${RED}25`, border: `1px solid ${RED}60`, borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, animation: 'pulse 1s infinite', display: 'inline-block' }} />
                  <span style={{ color: RED, fontWeight: 800, fontSize: '0.8rem' }}>{l3Alarms.length} LEVEL 3 — HUMAN REQUIRED</span>
                </div>
              )}
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                🟢 Live · tick #{tick}
              </div>
            </div>
          </div>

          {/* KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: '1.25rem' }}>
            {[
              { label: 'Total Requests/min', value: fmtN(totalRequests), color: '#fff' },
              { label: 'Concurrent Users',   value: fmtN(totalUsers),    color: '#fff' },
              { label: 'Platform Revenue',   value: fmtD(totalRevenue),  color: GOLD   },
              { label: 'Avg Uptime',         value: `${avgUptime}%`,     color: '#10B981' },
              { label: 'Active Alarms',      value: String(activeAlarms.length), color: activeAlarms.length ? AMBER : '#10B981' },
              { label: 'AI Actions Today',   value: '47',                color: '#60A5FA' },
              { label: 'Credit Queries',     value: '23',                color: GOLD   },
              { label: 'Self-Improve Score', value: `${selfImprove.successRate}%`, color: '#A78BFA' },
            ].map(k => (
              <div key={k.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '13px 18px', fontSize: '0.82rem', fontWeight: 700, background: 'none', border: 'none',
              borderBottom: tab === t.key ? `3px solid ${GOLD}` : '3px solid transparent',
              color: tab === t.key ? G : '#64748b', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {tab === 'overview' && (
          <div>
            {/* Module Health Grid */}
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>Module Health — All Systems</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {modules.map((m, i) => (
                <div key={m.name} onClick={() => { setSelectedModule(i); setTab('metrics') }} style={{
                  background: '#fff', border: `1.5px solid ${m.status === 'critical' ? RED : m.status === 'degraded' ? AMBER : '#e2e8f0'}`,
                  borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer',
                  boxShadow: m.status !== 'healthy' ? `0 0 12px ${m.status === 'critical' ? RED : AMBER}25` : 'none',
                  transition: 'transform 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a' }}>{m.name}</span>
                    </div>
                    <StatusDot status={m.status} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '0.75rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Req/min </span><strong>{fmtN(m.requests)}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Errors </span><strong style={{ color: m.errors > 20 ? RED : m.errors > 8 ? AMBER : '#10B981' }}>{m.errors}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>p95 lat </span><strong style={{ color: m.latency > 500 ? RED : m.latency > 300 ? AMBER : '#10B981' }}>{m.latency}ms</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Uptime </span><strong style={{ color: m.uptime < 99 ? AMBER : '#10B981' }}>{m.uptime}%</strong></div>
                  </div>
                  <div style={{ marginTop: 8, height: 3, background: '#f1f5f9', borderRadius: 2 }}>
                    <div style={{ height: 3, width: `${m.uptime}%`, background: m.uptime >= 99.5 ? '#10B981' : m.uptime >= 98 ? GOLD : RED, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Alarm + AI Action Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: G }}>🚨 Alarm Summary</h3>
                {[1,2,3].map(l => {
                  const count = alarms.filter(a => a.level === l as AlarmLevel).length
                  const active = alarms.filter(a => a.level === l as AlarmLevel && a.status === 'active').length
                  const c = alarmColor(l as AlarmLevel)
                  return (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: l < 3 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: c }}>Level {l} — {l===3?'Critical':l===2?'Warning':'Info'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total: {count}</span>
                        {active > 0 && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c, background: `${c}15`, padding: '1px 8px', borderRadius: 999 }}>{active} active</span>}
                      </div>
                    </div>
                  )
                })}
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.75rem', color: '#475569' }}>
                  ✅ AI resolved 44 alarms autonomously today. 0 false escalations.
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: G }}>🤖 Self-Improvement Loop</h3>
                {[
                  { label: 'Task success rate', value: `${selfImprove.successRate}%`, color: '#10B981' },
                  { label: 'User corrections logged', value: fmtN(selfImprove.corrections), color: G },
                  { label: 'Model calibration accuracy', value: `${selfImprove.calibration}%`, color: BLUE },
                  { label: 'Next retraining', value: selfImprove.retrain, color: '#8B5CF6' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.label}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '8px 12px', background: `${G}08`, borderRadius: 8, fontSize: '0.75rem', color: G }}>
                  📈 Bayesian posterior updated. 1,204 corrections → model drift: 0.3%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ METRICS TAB ══════════════ */}
        {tab === 'metrics' && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {modules.map((m, i) => (
                <button key={m.name} onClick={() => setSelectedModule(i)} style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  background: selectedModule === i ? G : '#fff',
                  color: selectedModule === i ? '#fff' : G,
                  border: `1.5px solid ${selectedModule === i ? G : '#e2e8f0'}`,
                }}>{m.icon} {m.name}</button>
              ))}
            </div>

            {mod && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{mod.icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: G }}>{mod.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StatusDot status={mod.status} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>{mod.status}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <MetricChip label="Requests / min"    value={fmtN(mod.requests)} color={G} />
                  <MetricChip label="Error count"       value={String(mod.errors)} color={mod.errors > 20 ? RED : mod.errors > 8 ? AMBER : '#10B981'} />
                  <MetricChip label="p95 Latency"       value={`${mod.latency}ms`} color={mod.latency > 500 ? RED : mod.latency > 300 ? AMBER : '#10B981'} />
                  <MetricChip label="Active users"      value={fmtN(mod.users)} color={BLUE} />
                  <MetricChip label="Uptime"            value={`${mod.uptime}%`} color={mod.uptime >= 99.5 ? '#10B981' : AMBER} />
                  {mod.revenue > 0 && <MetricChip label="Revenue (est.)" value={fmtD(mod.revenue)} color={GOLD} />}
                </div>

                {/* Latency distribution */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: G }}>Latency Percentiles</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {[['p50', 0.6], ['p75', 0.8], ['p95', 1.0], ['p99', 1.3]].map(([label, mult]) => {
                      const val = Math.round(mod.latency * (mult as number) * 0.85)
                      const pct = Math.min(100, Math.round(val / 10))
                      const c = val > 500 ? RED : val > 300 ? AMBER : '#10B981'
                      return (
                        <div key={label as string}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                            <span style={{ color: '#64748b', fontWeight: 700 }}>{label as string}</span>
                            <span style={{ fontWeight: 800, color: c }}>{val}ms</span>
                          </div>
                          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                            <div style={{ height: 6, width: `${pct}%`, background: c, borderRadius: 3, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Module-specific metrics */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: G }}>Module Intelligence</h3>
                  {mod.name === 'UJU Cycle™' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {[['Sessions started','234'],['Sessions completed','189'],['Avg Digitise score','62/100'],['Avg Scale score','48/100'],['Top constraint','Capital access'],['Completion rate','80.8%']].map(([k,v])=>(
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'#f8fafc', borderRadius:8, fontSize:'0.8rem' }}>
                          <span style={{ color:'#64748b' }}>{k}</span><strong style={{ color:G }}>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {mod.name === 'IKENGA™' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {[['Brand scores avg','67/100'],['Top platform','Instagram'],['Top angle','Authority'],['Audits today','23'],['Avg score lift','+14pts'],['Revenue','D147k']].map(([k,v])=>(
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'#f8fafc', borderRadius:8, fontSize:'0.8rem' }}>
                          <span style={{ color:'#64748b' }}>{k}</span><strong style={{ color:G }}>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {mod.name === 'ASK UJRIS™' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {[['Docs analysed today','98'],['Red flags found','312'],['Avg integrity score','74/100'],['Anchor detections','47'],['Contradictions','89'],['Revenue','D52.5k']].map(([k,v])=>(
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'#f8fafc', borderRadius:8, fontSize:'0.8rem' }}>
                          <span style={{ color:'#64748b' }}>{k}</span><strong style={{ color:G }}>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {mod.name === 'Marketplace' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {[['GMV today','D892k'],['Avg transaction','D1,458'],['Conversion rate','3.2%'],['Top category','Agriculture'],['Active sellers','47'],['Disputes open','3']].map(([k,v])=>(
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'#f8fafc', borderRadius:8, fontSize:'0.8rem' }}>
                          <span style={{ color:'#64748b' }}>{k}</span><strong style={{ color:G }}>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {!['UJU Cycle™','IKENGA™','ASK UJRIS™','Marketplace'].includes(mod.name) && (
                    <p style={{ color:'#94a3b8', fontSize:'0.85rem', margin:0 }}>Module-specific analytics loading from data warehouse…</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ ALARMS TAB ══════════════ */}
        {tab === 'alarms' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[1,2,3].map(l => {
                const c = alarmColor(l as AlarmLevel)
                const desc = l===1 ? 'AI handles autonomously. No human needed.' : l===2 ? 'AI attempts fix + logs. No human unless unresolved 15 min.' : 'HUMAN INTERVENTION REQUIRED. SOP triggered.'
                const items = l===1 ? ['CPU > 70% → auto-scale','Error rate > 1% → retry','Latency > 500ms → re-route'] : l===2 ? ['CPU > 85% for 5 min → notify','Error rate > 5% → circuit breaker','API key expiry → auto-rotate'] : ['DB corruption → STOP writes + alert','Security breach → freeze + rotate keys','System outage → escalate on-call']
                return (
                  <div key={l} style={{ background: '#fff', border: `2px solid ${c}40`, borderRadius: 12, padding: '1.25rem', borderTop: `4px solid ${c}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: c }}>LEVEL {l}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: c === RED ? '#fff' : c, background: c, padding: '1px 6px', borderRadius: 999, marginLeft: 'auto' }}>
                        {alarms.filter(a=>a.level===l).length}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 10px' }}>{desc}</p>
                    <ul style={{ margin: 0, padding: '0 0 0 14px' }}>
                      {items.map(it => <li key={it} style={{ fontSize: '0.75rem', color: '#374151', marginBottom: 4 }}>{it}</li>)}
                    </ul>
                  </div>
                )
              })}
            </div>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>Active & Recent Alarms</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alarms.map(al => {
                const c = alarmColor(al.level)
                return (
                  <div key={al.id} style={{ background: '#fff', border: `1.5px solid ${al.status==='active'?c:'#e2e8f0'}`, borderRadius: 12, padding: '1rem 1.25rem', borderLeft: `4px solid ${c}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <AlarmBadge level={al.level} />
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{al.module}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{al.ts}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '1px 8px', borderRadius: 999, marginLeft: 'auto',
                            background: al.status==='active'?`${RED}15`:al.status==='resolving'?`${AMBER}15`:'#D1FAE5',
                            color: al.status==='active'?RED:al.status==='resolving'?AMBER:'#065F46'
                          }}>{al.status}</span>
                        </div>
                        <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#374151' }}>⚠️ {al.trigger}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>🤖 {al.aiAction}</p>
                        {al.sop && (
                          <div style={{ marginTop: 10, background: `${RED}08`, border: `1px solid ${RED}25`, borderRadius: 8, padding: '10px 14px' }}>
                            <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 800, color: RED }}>📋 SOP — Human Action Required:</p>
                            <pre style={{ margin: 0, fontSize: '0.72rem', color: '#374151', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>{al.sop}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══════════════ CREDIT ENGINE TAB ══════════════ */}
        {tab === 'credit' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>💳 Sovereign Credit Scoring Engine</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem' }}>
                Independent, sovereign credit scoring using 10 FORTIS OS data sources. Benchmarked against Experian methodology.
              </p>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: G, marginBottom: 6 }}>Business ID (TANGO Registry)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={creditId} onChange={e => setCreditId(e.target.value)} placeholder="TANGO-12345"
                    style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.88rem', fontFamily: 'monospace' }} />
                  <button onClick={runCreditScore} disabled={creditLoading} style={{
                    padding: '10px 20px', background: creditLoading ? '#94a3b8' : G, color: '#fff', border: 'none',
                    borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: creditLoading ? 'not-allowed' : 'pointer',
                  }}>{creditLoading ? 'Scoring…' : 'Run Score'}</button>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  POST /api/v2/credit-score · {"{ \"business_id\": \"TANGO-12345\" }"}
                </p>
              </div>

              {creditResult && (() => {
                const { tier, color } = creditTier(creditResult.score)
                return (
                  <div style={{ background: '#fff', border: `2px solid ${color}40`, borderRadius: 12, padding: '1.5rem', borderTop: `4px solid ${color}` }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '3.5rem', fontWeight: 900, color }}>
                        {creditResult.score}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>± {creditResult.ci} (90% CI)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color, marginTop: 4 }}>{tier}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                        {tier === 'Prime' ? '✅ Recommend loan approval' : tier === 'Standard' ? '⚠️ Conditional approval — verify collateral' : tier === 'Subprime' ? '🔶 Require collateral + guarantor' : '🔴 Refer to microfinance partner'}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: G, margin: '0 0 10px' }}>Factor Breakdown</h4>
                    {creditResult.factors.map(f => (
                      <div key={f.source} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                          <span style={{ color: '#374151' }}>{f.label}</span>
                          <span style={{ fontWeight: 700, color: f.available ? G : '#94a3b8' }}>{f.available ? f.score : 'N/A'}</span>
                        </div>
                        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 2 }}>
                          <div style={{ height: 5, width: f.available ? `${f.score/10}%` : '10%', background: f.available ? color : '#cbd5e1', borderRadius: 2, transition: 'width 0.5s' }} />
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 1 }}>Source: {f.source} · Weight: {Math.round(f.weight*100)}%{!f.available ? ' · ⚠️ Data unavailable' : ''}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>Score Tiers</h3>
              {[['800–1000','Prime','Recommend loan','#10B981'],['600–799','Standard','Conditional approval',GOLD],['400–599','Subprime','Require collateral',AMBER],['0–399','High Risk','Refer to microfinance',RED]].map(([range,tier,action,c])=>(
                <div key={tier} style={{ background:'#fff', border:`1px solid ${c}30`, borderRadius:10, padding:'12px 16px', marginBottom:10, borderLeft:`4px solid ${c}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div><span style={{ fontWeight:800, fontSize:'0.85rem', color:c }}>{range} — {tier}</span><br/><span style={{ fontSize:'0.75rem', color:'#64748b' }}>{action}</span></div>
                    <span style={{ fontSize:'1.5rem' }}>{c===RED?'🔴':c===AMBER?'🟡':c===GOLD?'🟠':'🟢'}</span>
                  </div>
                </div>
              ))}

              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: G, margin: '1.5rem 0 1rem' }}>API Documentation</h3>
              <div style={{ background: DARK, borderRadius: 10, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a3e635' }}>
                <div style={{ color: '#60A5FA', marginBottom: 8 }}>POST /api/v2/credit-score</div>
                <div style={{ color: '#94a3b8' }}>Authorization: Bearer {'<api_key>'}</div>
                <div style={{ color: '#94a3b8', marginBottom: 12 }}>Content-Type: application/json</div>
                <div style={{ color: '#fbbf24' }}>{'{'}</div>
                <div style={{ paddingLeft: 16, color: '#a3e635' }}>  "business_id": "TANGO-12345"</div>
                <div style={{ color: '#fbbf24', marginBottom: 12 }}>{'}'}</div>
                <div style={{ color: '#94a3b8', marginBottom: 4 }}>// Response:</div>
                <div style={{ color: '#fbbf24' }}>{'{'}</div>
                <div style={{ paddingLeft: 16, color: '#a3e635' }}>
                  <div>  "score": 742,</div>
                  <div>  "tier": "Standard",</div>
                  <div>  "ci_90": 15,</div>
                  <div>  "recommendation": "Conditional",</div>
                  <div>  "factors": [...]</div>
                </div>
                <div style={{ color: '#fbbf24' }}>{'}'}</div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ INTELLIGENCE TAB ══════════════ */}
        {tab === 'intelligence' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>🧠 Cross-Module Pattern Detection</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1.25rem' }}>Causal inference across UJU Cycle, IKENGA, UJRIS, Marketplace, and Credit Engine.</p>
                {PATTERNS.map(p => (
                  <div key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem', borderLeft: `3px solid ${G}` }}>
                    <div style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600, marginBottom: 6 }}>🔗 {p.condition}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Probability:</span>
                      <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 2 }}>
                        <div style={{ height: 5, width: `${p.probability * 100}%`, background: p.probability > 0.85 ? '#10B981' : GOLD, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: G }}>{Math.round(p.probability * 100)}%</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: G, background: `${G}08`, padding: '6px 10px', borderRadius: 6, fontWeight: 600 }}>
                      💡 {p.recommendation}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: G, margin: '0 0 1rem' }}>🎯 Autosuggest Prompt Library</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1.25rem' }}>Prompts that elicit best context. Ranked by success rate. Learns from every query.</p>
                {PROMPTS.map(pt => (
                  <div key={pt.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a' }}>"{pt.query}"</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', background: '#D1FAE5', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 8 }}>{pt.successRate}%</span>
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#64748b', marginBottom: 8 }}>Context elicited: {pt.context.join(' · ')}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                      <span>Used {fmtN(pt.uses)} times</span>
                      <span>ID: {pt.id}</span>
                    </div>
                  </div>
                ))}

                <div style={{ background: `${G}06`, border: `1px solid ${G}20`, borderRadius: 10, padding: '1rem', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 800, color: G }}>🔬 Uncertainty Quantification</h4>
                  <div style={{ fontSize: '0.78rem', color: '#374151' }}>
                    <p style={{ margin: '0 0 6px' }}>Calibration: When model says 80% confident → correct <strong>78.1%</strong> of time</p>
                    <p style={{ margin: '0 0 6px' }}>All credit scores show <strong>90% credible intervals</strong></p>
                    <p style={{ margin: 0 }}>Low-confidence flag triggered when CI &gt; ±30 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ RUNBOOK TAB ══════════════ */}
        {tab === 'runbook' && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: G, margin: '0 0 0.5rem' }}>📋 Level 3 Runbooks — SOP Library</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1.5rem' }}>Click-to-execute scripts for every critical alarm scenario. Embedded Tyler Wise pre-mortem recommendations.</p>
            {[
              {
                id: 'DB-001', title: 'Database Corruption', trigger: 'Data integrity check fails or replica divergence > 0',
                steps: ['STOP all write operations immediately (emergency flag)', 'Snapshot current database state: pg_dump fortis_os > /backup/$(date).sql', 'Alert: SMS + Email → cadjatu@fortisos.gm + on-call engineer', 'Run: /scripts/db-recover.sh --restore-latest', 'Verify data integrity: SELECT COUNT(*) mismatches across replicas', 'Get human confirmation before resuming writes', 'Resume operations + monitor for 30 min'],
                premortem: 'Gamed by fake transactions? Add anomaly detection on insert volume.',
              },
              {
                id: 'SEC-001', title: 'Security Breach Detected', trigger: 'Unusual data access pattern or failed auth spike > 100/min',
                steps: ['Immediate: Freeze all API keys (rotate within 60 seconds)', 'Block suspicious IPs at edge (Vercel firewall rules)', 'Snapshot audit logs: immutable export to cold storage', 'Alert security team + notify affected users', 'Run forensic analysis: which data was accessed?', 'Issue new API keys to all partners', 'Post-incident report within 24 hours'],
                premortem: 'False alarms cause alarm fatigue. Require 3 consecutive checks before Level 3.',
              },
              {
                id: 'OUT-001', title: 'Complete System Outage', trigger: 'All health checks failing for > 2 minutes',
                steps: ['Check Vercel status page (vercel.com/status)', 'Verify DNS: dig fortisos.cloud', 'Check database connection: psql $DATABASE_URL -c "SELECT 1"', 'Check OpenAI API status if AI features down', 'Enable maintenance mode: set MAINTENANCE_MODE=true in Vercel', 'Page on-call engineer via PagerDuty', 'Communicate status to users via status page'],
                premortem: 'Gambian data sovereignty: verify no data crossed jurisdiction during incident.',
              },
              {
                id: 'FRAUD-001', title: 'Fraud Detection Triggered', trigger: 'Credit score gaming attempt or marketplace escrow anomaly',
                steps: ['FREEZE the flagged business account (read-only mode)', 'Export all transactions for manual review', 'Cross-check with TANGO directory for registration validity', 'Review UJRIS contract integrity score for anomalies', 'Human review: compliance team must approve or reject within 4 hours', 'If confirmed: permanent ban + notify Financial Map partners', 'Document pattern for model retraining'],
                premortem: 'Model drift: economy changes make old fraud patterns obsolete. Weekly retraining required.',
              },
            ].map(rb => (
              <div key={rb.id} style={{ background: '#fff', border: `1.5px solid ${RED}30`, borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem', borderTop: `4px solid ${RED}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', background: `${RED}15`, color: RED, padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>{rb.id}</span>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1a1a1a' }}>{rb.title}</h3>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Trigger: {rb.trigger}</p>
                  </div>
                  <button style={{ padding: '6px 14px', background: RED, color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    🚀 Execute
                  </button>
                </div>
                <ol style={{ margin: '12px 0', padding: '0 0 0 18px' }}>
                  {rb.steps.map((s, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: '#374151', marginBottom: 6, lineHeight: 1.5 }}>{s}</li>
                  ))}
                </ol>
                <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 8, padding: '8px 12px', fontSize: '0.75rem', color: '#92400E' }}>
                  <strong>Tyler Wise Pre-mortem:</strong> {rb.premortem}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @media (max-width: 768px) {
          .master-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
