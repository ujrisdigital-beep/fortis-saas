'use client'
import { useState } from 'react'
import type { ForensicContext } from '@/lib/ujris/forensic-patterns'

const SEVERITY_COLOR = {
  critical: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800', badge: 'bg-red-600 text-white' },
  high: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', badge: 'bg-orange-500 text-white' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', badge: 'bg-amber-500 text-white' },
  low: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', badge: 'bg-blue-500 text-white' },
}

const CATEGORY_LABELS: Record<string, string> = {
  ET: 'Evidential Tricks',
  PT: 'Procedural Traps',
  ST: 'Solicitor Tactics',
  PPT: 'Police/PSD Tactics',
  FA: 'Forensic Audit',
  CS: 'Counter-Strategies',
}

type Alert = {
  ruleId: string
  category: string
  label: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  explanation?: string
  counterAction?: string
}

type AnalysisResult = {
  alerts: Alert[]
  alertCount: number
  caseStrength: number
  categorySummary: { category: string; count: number; patterns: string[] }[]
  recommendation: string
}

type Step = 'context' | 'incidents' | 'evidence' | 'comms' | 'analyze'

export default function CaseDashboard() {
  const [step, setStep] = useState<Step>('context')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Form state
  const [caseRef, setCaseRef] = useState('')
  const [claimType, setClaimType] = useState('unfairDismissal')
  const [role, setRole] = useState('')
  const [startDate, setStartDate] = useState('')
  const [salary, setSalary] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentDesc, setIncidentDesc] = useState('')
  const [incidentOutcome, setIncidentOutcome] = useState('')
  const [evidenceRows, setEvidenceRows] = useState([
    { id: '1', type: 'Contract', date: '', description: 'Employment contract', preserved: true },
  ])
  const [emailRows, setEmailRows] = useState([
    { from: '', to: '', date: '', subject: '', body: '', readReceipt: false, hasAttachments: false },
  ])
  const [timelineRows, setTimelineRows] = useState([
    { date: '', description: '', actor: '' },
  ])

  const buildContext = (): ForensicContext => ({
    employmentTerms: role ? {
      role,
      startDate,
      salary: salary ? parseFloat(salary) : undefined,
      contractType: 'permanent',
    } : undefined,
    incidents: incidentDate ? [{
      incidentDate,
      reportDate: incidentDate,
      reportedTo: 'Employer',
      description: incidentDesc,
      outcome: incidentOutcome,
    }] : [],
    evidenceItems: evidenceRows.filter(r => r.description).map(r => ({
      id: r.id,
      type: r.type,
      date: r.date,
      description: r.description,
      preserved: r.preserved,
    })),
    emails: emailRows.filter(r => r.subject || r.body).map(r => ({
      from: r.from,
      to: r.to,
      date: r.date,
      subject: r.subject,
      body: r.body,
      readReceipt: r.readReceipt,
      hasAttachments: r.hasAttachments,
    })),
    timeline: timelineRows.filter(r => r.description).map(r => ({
      date: r.date,
      description: r.description,
      actor: r.actor,
    })),
    communications: [],
    documents: [],
    witnessStatements: [],
    financialRecords: [],
    letters: [],
  })

  const runAnalysis = async () => {
    setLoading(true)
    setResult(null)
    try {
      const ctx = buildContext()
      const res = await fetch('/api/forensic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      })
      const data = await res.json()
      setResult(data)
      setStep('analyze')
    } catch {
      setResult({ alerts: [], alertCount: 0, caseStrength: 0, categorySummary: [], recommendation: 'Analysis failed. Please try again.' })
    }
    setLoading(false)
  }

  const copyAction = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const strengthColor = (s: number) =>
    s >= 70 ? 'text-green-600' : s >= 40 ? 'text-amber-600' : 'text-red-600'

  const strengthLabel = (s: number) =>
    s >= 70 ? 'Strong' : s >= 40 ? 'Moderate' : 'Weak'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-900 text-white py-8">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-2xl font-bold">UJRIS Forensic Case Dashboard</h1>
          </div>
          <p className="text-amber-200 text-sm ml-12">37-Pattern Autonomous Litigation Intelligence — Gambia Labour Act 2007</p>
          {caseRef && <p className="text-amber-300 text-xs ml-12 mt-1">Case Ref: {caseRef}</p>}
        </div>
      </div>

      {/* Step Nav */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex gap-0 overflow-x-auto">
            {(['context', 'incidents', 'evidence', 'comms', 'analyze'] as Step[]).map((s, i) => {
              const labels: Record<Step, string> = {
                context: '1. Employment', incidents: '2. Incidents', evidence: '3. Evidence',
                comms: '4. Communications', analyze: '5. Forensic Report',
              }
              const active = step === s
              return (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                    active ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {labels[s]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* STEP 1: Employment Context */}
        {step === 'context' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-bold">Employment Context</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Case Reference (optional)</label>
                <input value={caseRef} onChange={e => setCaseRef(e.target.value)}
                  placeholder="e.g. IC-2026-0042"
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Claim Type</label>
                <select value={claimType} onChange={e => setClaimType(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-sm">
                  <option value="unfairDismissal">Unfair Dismissal</option>
                  <option value="wrongfulDismissal">Wrongful Dismissal</option>
                  <option value="discrimination">Discrimination</option>
                  <option value="unpaidWages">Unpaid Wages</option>
                  <option value="harassment">Harassment</option>
                  <option value="redundancy">Redundancy</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Job Role</label>
                <input value={role} onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Senior Accountant"
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Employment Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Monthly Salary (GMD)</label>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setStep('incidents')}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 text-sm">
                Next: Incidents →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Incidents */}
        {step === 'incidents' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-bold">Incident Details</h2>
            <p className="text-sm text-gray-500">Describe the key incident(s) — dismissal, discrimination, harassment, etc.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Incident Date</label>
                <input type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Outcome / What Happened</label>
                <input value={incidentOutcome} onChange={e => setIncidentOutcome(e.target.value)}
                  placeholder="e.g. Dismissed without notice"
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Full Description</label>
                <textarea value={incidentDesc} onChange={e => setIncidentDesc(e.target.value)}
                  rows={4} placeholder="Describe what happened in your own words..."
                  className="w-full mt-1 p-2 border rounded-lg text-sm" />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm">Case Timeline</h3>
                <button onClick={() => setTimelineRows(r => [...r, { date: '', description: '', actor: '' }])}
                  className="text-xs text-amber-600 hover:underline">+ Add Event</button>
              </div>
              <div className="space-y-2">
                {timelineRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <input type="date" value={row.date} onChange={e => setTimelineRows(r => r.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                      className="col-span-3 p-2 border rounded text-sm" />
                    <input value={row.description} onChange={e => setTimelineRows(r => r.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                      placeholder="What happened"
                      className="col-span-6 p-2 border rounded text-sm" />
                    <input value={row.actor} onChange={e => setTimelineRows(r => r.map((x, j) => j === i ? { ...x, actor: e.target.value } : x))}
                      placeholder="Who"
                      className="col-span-2 p-2 border rounded text-sm" />
                    <button onClick={() => setTimelineRows(r => r.filter((_, j) => j !== i))}
                      className="col-span-1 text-red-400 hover:text-red-600 text-sm">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep('context')} className="px-4 py-2 text-gray-600 text-sm">← Back</button>
              <button onClick={() => setStep('evidence')}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 text-sm">
                Next: Evidence →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Evidence */}
        {step === 'evidence' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-bold">Evidence Inventory</h2>
            <p className="text-sm text-gray-500">List every piece of evidence — both what you have and what should exist but is missing.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-2 font-medium">Type</th>
                    <th className="p-2 font-medium">Date</th>
                    <th className="p-2 font-medium">Description</th>
                    <th className="p-2 font-medium text-center">Preserved?</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceRows.map((row, i) => (
                    <tr key={row.id} className="border-t">
                      <td className="p-1">
                        <select value={row.type} onChange={e => setEvidenceRows(r => r.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}
                          className="p-1 border rounded text-sm w-full">
                          <option>Contract</option>
                          <option>Email</option>
                          <option>Payslip</option>
                          <option>CCTV</option>
                          <option>Witness Statement</option>
                          <option>Letter</option>
                          <option>Policy Document</option>
                          <option>Meeting Notes</option>
                          <option>Text Message</option>
                          <option>Other</option>
                        </select>
                      </td>
                      <td className="p-1">
                        <input type="date" value={row.date} onChange={e => setEvidenceRows(r => r.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                          className="p-1 border rounded text-sm w-full" />
                      </td>
                      <td className="p-1">
                        <input value={row.description} onChange={e => setEvidenceRows(r => r.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                          placeholder="Brief description"
                          className="p-1 border rounded text-sm w-full" />
                      </td>
                      <td className="p-1 text-center">
                        <input type="checkbox" checked={row.preserved}
                          onChange={e => setEvidenceRows(r => r.map((x, j) => j === i ? { ...x, preserved: e.target.checked } : x))} />
                      </td>
                      <td className="p-1">
                        <button onClick={() => setEvidenceRows(r => r.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setEvidenceRows(r => [...r, { id: String(Date.now()), type: 'Email', date: '', description: '', preserved: true }])}
                className="mt-2 text-xs text-amber-600 hover:underline">+ Add Evidence Item</button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Tip:</strong> Add evidence items that should exist but are marked as NOT preserved — the Forensic Audit will flag these as evidence gaps.
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep('incidents')} className="px-4 py-2 text-gray-600 text-sm">← Back</button>
              <button onClick={() => setStep('comms')}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 text-sm">
                Next: Communications →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Communications */}
        {step === 'comms' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-bold">Email & Correspondence Log</h2>
            <p className="text-sm text-gray-500">Log all relevant emails. The forensic engine will detect gaslighting, costs threats, counterclaims, and more.</p>

            <div className="space-y-3">
              {emailRows.map((row, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500">Email {i + 1}</span>
                    <button onClick={() => setEmailRows(r => r.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input value={row.from} onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, from: e.target.value } : x))}
                      placeholder="From" className="p-2 border rounded text-sm" />
                    <input value={row.to} onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, to: e.target.value } : x))}
                      placeholder="To" className="p-2 border rounded text-sm" />
                    <input type="date" value={row.date} onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                      className="p-2 border rounded text-sm" />
                    <input value={row.subject} onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, subject: e.target.value } : x))}
                      placeholder="Subject" className="p-2 border rounded text-sm" />
                  </div>
                  <textarea value={row.body} onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, body: e.target.value } : x))}
                    rows={2} placeholder="Paste key content or summary of email..."
                    className="w-full p-2 border rounded text-sm" />
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={row.readReceipt}
                        onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, readReceipt: e.target.checked } : x))} />
                      Read receipt
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={row.hasAttachments}
                        onChange={e => setEmailRows(r => r.map((x, j) => j === i ? { ...x, hasAttachments: e.target.checked } : x))} />
                      Has attachments
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEmailRows(r => [...r, { from: '', to: '', date: '', subject: '', body: '', readReceipt: false, hasAttachments: false }])}
              className="text-xs text-amber-600 hover:underline">+ Add Email</button>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep('evidence')} className="px-4 py-2 text-gray-600 text-sm">← Back</button>
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 text-sm"
              >
                {loading ? 'Running 37-Pattern Analysis...' : 'Run Forensic Analysis →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Forensic Report */}
        {step === 'analyze' && result && (
          <div className="space-y-6">
            {/* Summary Banner */}
            <div className={`rounded-xl p-6 ${result.alerts.some(a => a.severity === 'critical') ? 'bg-red-50 border-2 border-red-400' : result.alerts.some(a => a.severity === 'high') ? 'bg-orange-50 border-2 border-orange-400' : 'bg-green-50 border-2 border-green-400'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Forensic Analysis Report</h2>
                  {caseRef && <p className="text-sm text-gray-600">Case: {caseRef}</p>}
                  <p className="text-sm mt-1">{result.recommendation}</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-black ${strengthColor(result.caseStrength)}`}>{result.caseStrength}</div>
                  <div className="text-xs text-gray-500">Case Strength / 100</div>
                  <div className={`text-sm font-bold ${strengthColor(result.caseStrength)}`}>{strengthLabel(result.caseStrength)}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">{result.alerts.filter(a => a.severity === 'critical').length} Critical</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">{result.alerts.filter(a => a.severity === 'high').length} High</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">{result.alerts.filter(a => a.severity === 'medium').length} Medium</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">{result.alerts.filter(a => a.severity === 'low').length} Low / CS</span>
              </div>
            </div>

            {/* Category Summary */}
            {result.categorySummary.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-3">Pattern Category Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {result.categorySummary.map(cat => (
                    <div key={cat.category} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{CATEGORY_LABELS[cat.category] || cat.category}</div>
                      <div className="text-2xl font-black text-amber-700 mt-1">{cat.count}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.patterns.slice(0, 2).join(', ')}{cat.patterns.length > 2 ? ` +${cat.patterns.length - 2}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {result.alerts.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-4">Forensic Alerts — {result.alertCount} Detected</h3>
                <div className="space-y-3">
                  {result.alerts.map(alert => {
                    const colors = SEVERITY_COLOR[alert.severity] || SEVERITY_COLOR.low
                    const expanded = expandedAlert === alert.ruleId
                    return (
                      <div key={alert.ruleId} className={`rounded-lg border-l-4 ${colors.bg} ${colors.border} overflow-hidden`}>
                        <button
                          className="w-full p-4 text-left flex items-start justify-between gap-3"
                          onClick={() => setExpandedAlert(expanded ? null : alert.ruleId)}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-mono font-bold ${colors.badge}`}>{alert.ruleId}</span>
                            <div>
                              <div className={`font-semibold text-sm ${colors.text}`}>{alert.label}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{CATEGORY_LABELS[alert.category] || alert.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${colors.badge}`}>{alert.severity}</span>
                            <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
                          </div>
                        </button>

                        {expanded && (
                          <div className="px-4 pb-4 border-t border-white/50 pt-3 space-y-3">
                            {alert.explanation && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">What was detected</div>
                                <p className="text-sm text-gray-700">{alert.explanation}</p>
                              </div>
                            )}
                            {alert.counterAction && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Counter-Action</div>
                                <p className="text-sm text-gray-700">{alert.counterAction}</p>
                                <button
                                  onClick={() => copyAction(alert.counterAction!, alert.ruleId)}
                                  className="mt-2 px-3 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
                                >
                                  {copied === alert.ruleId ? '✓ Copied' : 'Copy to clipboard'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-bold text-green-700">No Forensic Patterns Detected</h3>
                <p className="text-sm text-gray-500 mt-1">Based on the information provided, no tactical patterns were identified. Add more details to improve accuracy.</p>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep('comms')} className="px-4 py-2 text-gray-600 text-sm">← Edit Inputs</button>
              <button onClick={runAnalysis} disabled={loading}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 text-sm">
                {loading ? 'Re-analysing...' : 'Re-run Analysis'}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-400 text-center pb-4">
              UJRIS forensic analysis is for informational purposes only and does not constitute legal advice.
              Consult a qualified Gambian lawyer. FORTIS OS™ — Industrial Court Banjul | Labour Act 2007
            </div>
          </div>
        )}

        {/* Prompt to run if on analyze tab with no result */}
        {step === 'analyze' && !result && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2">Ready to Analyse</h3>
            <p className="text-sm text-gray-500 mb-4">Complete the previous steps and run the 37-pattern forensic engine.</p>
            <button onClick={() => setStep('context')}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 text-sm">
              Start Case Entry →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
