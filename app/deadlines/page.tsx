'use client';
import { useState } from 'react';
import { extractDeadlinesFromText, checkDeadlineAlerts, sortDeadlinesByUrgency, type TrackedDeadline, type DeadlineAlert } from '@/lib/deadline-tracker';

const URGENCY_STYLES: Record<TrackedDeadline['urgency'], { bg: string; text: string; border: string; badge: string }> = {
  overdue:  { bg: 'rgba(230,57,70,0.06)',  text: '#991b1b', border: 'rgba(230,57,70,0.3)',  badge: '#fee2e2' },
  critical: { bg: 'rgba(230,57,70,0.04)',  text: '#b45309', border: 'rgba(245,158,11,0.3)', badge: '#fef3c7' },
  warning:  { bg: 'rgba(212,175,55,0.04)', text: '#92400e', border: 'rgba(212,175,55,0.3)', badge: '#fef9c3' },
  normal:   { bg: '#F8FAFC',               text: '#065f46', border: '#E2E8F0',               badge: '#d1fae5' },
};

const TYPE_ICONS: Record<TrackedDeadline['type'], string> = {
  tribunal_claim: '⚖️', appeal: '🔁', response: '📨', disclosure: '📂',
  hearing: '🏛️', grievance: '📋', earlyconciliation: '🤝', limitation: '⏰', other: '📌',
};

export default function DeadlinesPage() {
  const [inputText, setInputText] = useState('');
  const [deadlines, setDeadlines] = useState<TrackedDeadline[]>([]);
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);
  const [analysed, setAnalysed] = useState(false);

  function analyse() {
    if (!inputText.trim()) return;
    const extracted = extractDeadlinesFromText(inputText, 'Pasted correspondence');
    const sorted = sortDeadlinesByUrgency(extracted);
    const alertList = checkDeadlineAlerts(sorted);
    setDeadlines(sorted);
    setAlerts(alertList);
    setAnalysed(true);
  }

  function clearAll() {
    setInputText('');
    setDeadlines([]);
    setAlerts([]);
    setAnalysed(false);
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Deadline Tracker</h1>
        <p style={subtitleStyle}>Paste correspondence, letters, or court orders — AI extracts all deadlines automatically</p>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div style={alertsBannerStyle}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            {alerts.filter(a => a.urgency === 'overdue').length > 0 ? '🚨' : '⚠️'} {alerts.length} Deadline Alert{alerts.length !== 1 ? 's' : ''}
          </strong>
          {alerts.map((a, i) => (
            <div key={i} style={{ fontSize: '0.88rem', marginBottom: '0.25rem', paddingLeft: '1rem' }}>
              {a.urgency === 'overdue' ? '🔴' : a.urgency === 'critical' ? '🟠' : '🟡'} {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={inputCardStyle}>
        <label style={labelStyle}>Paste correspondence, emails, or legal notices:</label>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Paste the text of your letter, email, tribunal order, or any legal correspondence here..."
          style={textareaStyle}
          rows={8}
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button onClick={analyse} style={primaryBtnStyle} type="button" disabled={!inputText.trim()}>
            Extract Deadlines
          </button>
          {analysed && (
            <button onClick={clearAll} style={secondaryBtnStyle} type="button">Clear</button>
          )}
        </div>
      </div>

      {/* Results */}
      {analysed && (
        <div style={{ marginTop: '1.5rem' }}>
          {deadlines.length === 0 ? (
            <div style={emptyStyle}>
              <p style={{ margin: 0, fontWeight: 600 }}>No deadlines found in the pasted text.</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: '#6B7280' }}>
                Try pasting a letter or email that mentions specific dates and deadlines.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 700 }}>
                {deadlines.length} Deadline{deadlines.length !== 1 ? 's' : ''} Detected
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {deadlines.map(d => {
                  const s = URGENCY_STYLES[d.urgency];
                  return (
                    <div key={d.id} style={{ ...deadlineCardStyle, background: s.bg, borderColor: s.border }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[d.type]}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#0A1C2E' }}>{d.label}</p>
                            <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#4A5568' }}>
                              {d.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              {' — '}{d.source}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ padding: '0.2rem 0.75rem', borderRadius: '999px', background: s.badge, color: s.text, fontSize: '0.8rem', fontWeight: 700 }}>
                            {d.urgency === 'overdue' ? `${Math.abs(d.daysLeft)}d overdue` :
                             d.daysLeft === 0 ? 'TODAY' : `${d.daysLeft}d left`}
                          </div>
                          <div style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: s.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {d.urgency}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <p style={disclaimerStyle}>
        Deadlines shown are extracted from pasted text. Always verify with official sources. Missing a legal deadline can be fatal to your case.
      </p>
    </div>
  );
}

const pageStyle: React.CSSProperties = { maxWidth: '860px', margin: '0 auto', padding: '2rem 1.25rem 5rem', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#0A1C2E' };
const headerStyle: React.CSSProperties = { marginBottom: '1.5rem' };
const titleStyle: React.CSSProperties = { margin: '0 0 0.35rem', fontSize: '2rem', fontWeight: 800 };
const subtitleStyle: React.CSSProperties = { margin: 0, color: '#4A5568', fontSize: '1rem' };
const alertsBannerStyle: React.CSSProperties = { padding: '1rem 1.25rem', background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.25)', borderRadius: '0.75rem', marginBottom: '1.25rem', color: '#991b1b' };
const inputCardStyle: React.CSSProperties = { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.5rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical', outline: 'none', background: '#fff' };
const primaryBtnStyle: React.CSSProperties = { padding: '0.65rem 1.5rem', background: '#1B4D3E', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' };
const secondaryBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' };
const emptyStyle: React.CSSProperties = { padding: '2rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', textAlign: 'center' };
const deadlineCardStyle: React.CSSProperties = { padding: '1rem 1.25rem', border: '1px solid', borderRadius: '0.75rem' };
const disclaimerStyle: React.CSSProperties = { marginTop: '3rem', textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF', lineHeight: 1.6 };
