'use client';
import { useState, useEffect } from 'react';

interface Metrics {
  activeCases: number;
  aiAccuracy: number;
  apiCalls: number;
  cost: string;
  uptime: number;
  memoryMB: number;
  timestamp: string;
  batchUsage: { total: number; used: number; percentage: number };
  sopInstructions: string;
  pillarsActive: Record<string, boolean>;
}

const PILLAR_LABELS: Record<string, string> = {
  evidenceHub: 'Multimedia Evidence Hub',
  forensicPatterns: '37 Forensic Patterns',
  audioSummaries: 'Audio Case Summaries',
  slideDecks: 'Slide Deck Generator',
  deadlineTracker: 'Deadline Tracker',
  documentDrafter: 'Document Drafter',
  evidenceVault: 'Evidence Vault',
  piiProtection: 'PII Protection',
  adminDashboard: 'Admin Dashboard',
  selfImprovingAI: 'Self-Improving AI',
};

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function BatchWarning({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const level = pct >= 90 ? 90 : pct >= 75 ? 75 : pct >= 50 ? 50 : 0;
  const styles: Record<number, { bg: string; color: string; action: string }> = {
    90: { bg: '#fee2e2', color: '#991b1b', action: 'CRITICAL: Throttle or upgrade plan immediately' },
    75: { bg: '#fef3c7', color: '#92400e', action: 'WARNING: Usage approaching limit — review heavy users' },
    50: { bg: '#fef9c3', color: '#713f12', action: 'NOTICE: Usage above 50% — monitor growth rate' },
    0:  { bg: '#d1fae5', color: '#065f46', action: 'Normal usage — no action required' },
  };
  const s = styles[level];

  return (
    <div style={{ padding: '1rem', background: s.bg, borderRadius: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 700, color: s.color }}>API Batch Usage</span>
        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: s.color }}>{pct}%</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#E63946' : pct >= 75 ? '#D97706' : pct >= 50 ? '#EAB308' : '#10B981', borderRadius: '999px', transition: 'width 0.5s' }} />
      </div>
      <p style={{ margin: 0, fontSize: '0.82rem', color: s.color }}>{s.action}</p>
      <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: s.color, opacity: 0.8 }}>{used.toLocaleString()} / {total.toLocaleString()} calls used</p>
    </div>
  );
}

export default function UJRISAdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sopAcknowledged, setSopAcknowledged] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const pillars = metrics?.pillarsActive ?? {};
  const activeCount = Object.values(pillars).filter(Boolean).length;
  const totalCount = Object.keys(PILLAR_LABELS).length;
  const score = Math.round((activeCount / totalCount) * 95);

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>UJRIS Admin Dashboard</h1>
          <p style={subtitleStyle}>
            Autonomous Litigation Intelligence Engine — Real-time monitoring
            {lastRefresh && ` · Refreshed ${lastRefresh.toLocaleTimeString()}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={scoreBadgeStyle}>{score}/100</div>
          <button onClick={fetchMetrics} disabled={loading} style={refreshBtnStyle} type="button">
            {loading ? 'Loading...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div style={kpiGridStyle}>
          <KPICard label="Active Cases" value={metrics.activeCases} unit="" />
          <KPICard label="AI Accuracy" value={metrics.aiAccuracy} unit="%" />
          <KPICard label="API Calls" value={metrics.apiCalls} unit="" />
          <KPICard label="Cost Today" value={`$${metrics.cost}`} unit="" isString />
          <KPICard label="Uptime" value={formatUptime(metrics.uptime)} unit="" isString />
          <KPICard label="Memory" value={metrics.memoryMB} unit=" MB" />
        </div>
      )}

      <div style={twoColStyle}>
        {/* Left Column */}
        <div>
          {/* Batch Warnings */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Batch Usage Warnings</h2>
            {metrics ? (
              <>
                <BatchWarning used={metrics.batchUsage.used} total={metrics.batchUsage.total} />
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF' }}>
                  Thresholds: 50% (notice) → 75% (warning) → 90% (critical). Auto-refreshes every 30s.
                </p>
              </>
            ) : (
              <p style={{ color: '#9CA3AF' }}>Loading...</p>
            )}
          </div>

          {/* AI SOP */}
          {metrics && !sopAcknowledged && (
            <div style={sopCardStyle}>
              <h2 style={{ ...cardTitleStyle, color: '#1B4D3E' }}>AI-Generated SOP Instructions</h2>
              <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {metrics.sopInstructions}
              </p>
              <button onClick={() => setSopAcknowledged(true)} style={ackBtnStyle} type="button">
                Acknowledge
              </button>
            </div>
          )}
          {sopAcknowledged && (
            <div style={{ ...sopCardStyle, background: '#d1fae5', borderColor: 'rgba(16,185,129,0.3)' }}>
              <p style={{ margin: 0, color: '#065f46', fontWeight: 600 }}>SOP instructions acknowledged.</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* 10 Pillars Status */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              10 Pillars Status — {activeCount}/{totalCount} Active ({score}/100)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(PILLAR_LABELS).map(([key, label], i) => {
                const active = pillars[key] ?? false;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF', width: '16px' }}>P{i + 1}</span>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: active ? '#10B981' : '#E63946', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: active ? '#0A1C2E' : '#9CA3AF', flex: 1 }}>{label}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: active ? '#065f46' : '#991b1b' }}>
                      {active ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p style={disclaimerStyle}>Super Admin access only. Do not share this URL.</p>
    </div>
  );
}

function KPICard({ label, value, unit, isString }: { label: string; value: number | string; unit: string; isString?: boolean }) {
  return (
    <div style={kpiCardStyle}>
      <p style={kpiLabelStyle}>{label}</p>
      <p style={kpiValueStyle}>{isString ? value : `${value}${unit}`}</p>
    </div>
  );
}

const pageStyle: React.CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 5rem', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#0A1C2E' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #1B4D3E' };
const titleStyle: React.CSSProperties = { margin: '0 0 0.35rem', fontSize: '1.75rem', fontWeight: 800 };
const subtitleStyle: React.CSSProperties = { margin: 0, color: '#4A5568', fontSize: '0.88rem' };
const scoreBadgeStyle: React.CSSProperties = { padding: '0.4rem 1rem', background: '#1B4D3E', color: '#D4AF37', borderRadius: '999px', fontWeight: 800, fontSize: '1.1rem' };
const refreshBtnStyle: React.CSSProperties = { padding: '0.6rem 1.25rem', background: '#F3F4F6', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' };
const kpiGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' };
const kpiCardStyle: React.CSSProperties = { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.25rem' };
const kpiLabelStyle: React.CSSProperties = { margin: '0 0 0.35rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1B4D3E' };
const kpiValueStyle: React.CSSProperties = { margin: 0, fontSize: '1.5rem', fontWeight: 800 };
const twoColStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' };
const cardStyle: React.CSSProperties = { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.25rem' };
const cardTitleStyle: React.CSSProperties = { margin: '0 0 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1B4D3E' };
const sopCardStyle: React.CSSProperties = { background: 'rgba(27,77,62,0.04)', border: '1px solid rgba(27,77,62,0.2)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.25rem' };
const ackBtnStyle: React.CSSProperties = { padding: '0.6rem 1.5rem', background: '#1B4D3E', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' };
const disclaimerStyle: React.CSSProperties = { marginTop: '3rem', textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF' };
