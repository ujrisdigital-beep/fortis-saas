// UJRIS Email & Correspondence Monitor
// Extracts deadlines, detects tactical patterns, and builds case chronology from email content.
// No PII stored — only extracted dates, deadlines, and pattern flags.

export interface ExtractedDeadline {
  rawText: string
  date: Date | null
  daysUntil: number | null
  type: string
  urgency: 'overdue' | 'critical' | 'urgent' | 'normal'
}

export interface CorrespondenceFlag {
  patternId: string
  label: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  matchedText: string
}

export interface CorrespondenceAnalysis {
  deadlines: ExtractedDeadline[]
  flags: CorrespondenceFlag[]
  tribunalCopied: boolean
  hasReadReceipt: boolean
  toneIndicators: string[]
  suggestedActions: string[]
}

// ── DEADLINE EXTRACTION ──────────────────────────────────────────────────────

const DATE_PATTERNS = [
  // ISO: 2026-04-15
  { re: /\b(\d{4}-\d{2}-\d{2})\b/g, label: 'ISO date' },
  // UK: 15 April 2026 / 15th April 2026
  { re: /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi, label: 'Long date' },
  // Short UK: 15/04/2026 or 15-04-2026
  { re: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/g, label: 'Short date' },
]

const DEADLINE_SIGNALS = [
  { re: /respond(?:ing)?\s+(?:by|before|no\s+later\s+than)/i, type: 'Response deadline' },
  { re: /(?:submit|file|lodge|return)\s+(?:by|before|no\s+later\s+than)/i, type: 'Filing deadline' },
  { re: /(?:hearing|tribunal)\s+(?:is\s+)?(?:on|scheduled\s+for|fixed\s+for)/i, type: 'Hearing date' },
  { re: /(?:accept|decline)\s+(?:this\s+offer|the\s+offer|by|before)/i, type: 'Settlement deadline' },
  { re: /(?:within\s+(\d+)\s+(?:working\s+)?days?)/i, type: 'Days deadline' },
  { re: /(?:no\s+later\s+than|by\s+end\s+of)/i, type: 'Hard deadline' },
]

function parseDate(str: string): Date | null {
  const d = new Date(str)
  if (!isNaN(d.getTime())) return d
  // Try dd/mm/yyyy
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (dmy) {
    const parsed = new Date(`${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`)
    if (!isNaN(parsed.getTime())) return parsed
  }
  return null
}

function daysUntil(d: Date): number {
  return Math.ceil((d.getTime() - Date.now()) / 86400000)
}

function urgencyLevel(days: number | null): ExtractedDeadline['urgency'] {
  if (days === null) return 'normal'
  if (days < 0) return 'overdue'
  if (days <= 3) return 'critical'
  if (days <= 7) return 'urgent'
  return 'normal'
}

export function extractDeadlines(text: string): ExtractedDeadline[] {
  const deadlines: ExtractedDeadline[] = []
  const sentences = text.split(/[.\n]/).filter(s => s.trim().length > 10)

  for (const sentence of sentences) {
    const hasDeadlineSignal = DEADLINE_SIGNALS.some(s => s.re.test(sentence))
    if (!hasDeadlineSignal) continue

    const deadlineType = DEADLINE_SIGNALS.find(s => s.re.test(sentence))?.type || 'Deadline'

    for (const pattern of DATE_PATTERNS) {
      const matches = [...sentence.matchAll(pattern.re)]
      for (const match of matches) {
        const dateStr = match[1]
        const date = parseDate(dateStr)
        const days = date ? daysUntil(date) : null
        deadlines.push({
          rawText: sentence.trim().slice(0, 200),
          date,
          daysUntil: days,
          type: deadlineType,
          urgency: urgencyLevel(days),
        })
      }
    }

    // Relative deadline: "within X days"
    const relMatch = sentence.match(/within\s+(\d+)\s+(?:working\s+)?days?/i)
    if (relMatch) {
      const days = parseInt(relMatch[1])
      const date = new Date(Date.now() + days * 86400000)
      deadlines.push({
        rawText: sentence.trim().slice(0, 200),
        date,
        daysUntil: days,
        type: deadlineType,
        urgency: urgencyLevel(days),
      })
    }
  }

  return deadlines.sort((a, b) => (a.daysUntil ?? 999) - (b.daysUntil ?? 999))
}

// ── TACTIC FLAGS ─────────────────────────────────────────────────────────────

const TACTIC_RULES: Array<{
  patternId: string
  label: string
  severity: CorrespondenceFlag['severity']
  re: RegExp
}> = [
  { patternId: 'ET-05', label: 'False Certification Claim', severity: 'critical', re: /all\s+(?:relevant\s+)?documents\s+have\s+been\s+(?:disclosed|provided)|nothing\s+further\s+to\s+disclose/i },
  { patternId: 'ET-06', label: 'Non-Receipt Claim (Gaslighting)', severity: 'high', re: /did\s+not\s+receive|never\s+received|no\s+record\s+of\s+receiving|not\s+in\s+our\s+(?:system|records)/i },
  { patternId: 'ET-08', label: 'Evidence Destruction / Unavailability', severity: 'critical', re: /no\s+longer\s+available|has\s+been\s+deleted|was\s+destroyed|cannot\s+be\s+retrieved|system\s+failure.*recording|recording.*unavailable/i },
  { patternId: 'PT-03', label: 'Costs Intimidation', severity: 'medium', re: /costs\s+(?:order|warning|against\s+you|will\s+be\s+awarded)|put\s+on\s+notice\s+(?:as\s+to\s+)?costs|you\s+will\s+bear\s+(?:all\s+)?costs/i },
  { patternId: 'PT-04', label: 'Settlement Under Pressure', severity: 'medium', re: /accept\s+(?:this\s+offer\s+)?(?:by|within|before)\s+\d+|offer\s+(?:expires|lapses)\s+(?:on|in)/i },
  { patternId: 'ST-02', label: 'Gaslighting / Minimisation', severity: 'high', re: /not\s+a\s+(?:formal\s+)?grievance|isolated\s+incident|one.off\s+(?:matter|situation)|no\s+pattern\s+of|doesn.t\s+reflect\s+our\s+(?:values|culture)/i },
  { patternId: 'ST-03', label: 'Counterclaim / Cross-Claim Threat', severity: 'high', re: /we\s+reserve\s+the\s+right\s+to\s+(?:bring|file|pursue)\s+a\s+(?:counter)?claim|counterclaim\s+against\s+you|defamation\s+(?:claim|proceedings)/i },
  { patternId: 'ST-05', label: 'Character / Credibility Attack', severity: 'high', re: /your\s+(?:previous\s+)?(?:conduct|behaviour|record|history)\s+(?:shows|demonstrates|indicates)|known\s+to\s+(?:make\s+)?(?:complaints|allegations)|vexatious/i },
  { patternId: 'PPT-02', label: 'Gratitude Inversion (Dismiss + Thank)', severity: 'medium', re: /thank\s+you\s+for\s+(?:bringing|raising|your)\s+(?:this|your\s+concern)[^.]*(?:cannot\s+uphold|not\s+upheld|not\s+substantiated|no\s+further\s+action)/i },
  { patternId: 'PPT-03', label: 'Evidence Unavailable (Technical)', severity: 'critical', re: /(?:body.?worn|CCTV|camera|recording|footage|video).*(?:not\s+available|unavailable|malfunction|failed\s+to\s+(?:record|download)|system\s+(?:error|failure))/i },
  { patternId: 'PPT-04', label: 'Policy Shield (No Specific Citation)', severity: 'medium', re: /in\s+accordance\s+with\s+our\s+(?:data\s+protection\s+)?policy|policy\s+(?:prevents|does\s+not\s+permit|prohibits)\s+us/i },
]

export function detectCorrespondenceFlags(text: string): CorrespondenceFlag[] {
  const flags: CorrespondenceFlag[] = []
  for (const rule of TACTIC_RULES) {
    const match = text.match(rule.re)
    if (match) {
      flags.push({
        patternId: rule.patternId,
        label: rule.label,
        severity: rule.severity,
        matchedText: match[0].slice(0, 150),
      })
    }
  }
  return flags
}

// ── TONE INDICATORS ──────────────────────────────────────────────────────────

const TONE_RULES: Array<{ label: string; re: RegExp }> = [
  { label: 'Aggressive / threatening', re: /will\s+(?:take|pursue|initiate)\s+(?:legal\s+)?(?:action|proceedings)|we\s+will\s+not\s+hesitate/i },
  { label: 'Dismissive', re: /have\s+(?:carefully\s+)?(?:reviewed|considered)\s+your[^.]+cannot\s+(?:uphold|agree|accept)/i },
  { label: 'Conciliatory', re: /sincerely\s+apologise|regret|sorry\s+(?:to\s+hear|for\s+any)/i },
  { label: 'Evasive / vague', re: /(?:seek\s+clarification|cannot\s+comment|under\s+review|looking\s+into\s+this|will\s+(?:respond|revert)\s+in\s+due\s+course)/i },
  { label: 'Legally coached', re: /\b(?:without\s+prejudice|strictly\s+confidential|notwithstanding|in\s+consideration\s+of|hereby\s+(?:notify|confirm))\b/i },
]

export function detectTone(text: string): string[] {
  return TONE_RULES.filter(r => r.re.test(text)).map(r => r.label)
}

// ── TRIBUNAL COPY CHECK ──────────────────────────────────────────────────────

export function isTribunalCopied(toField: string, ccField: string, body: string): boolean {
  const combined = `${toField} ${ccField} ${body}`.toLowerCase()
  return (
    combined.includes('industrial court') ||
    combined.includes('tribunal') ||
    combined.includes('labour department') ||
    combined.includes('dept of labour')
  )
}

// ── SUGGESTED ACTIONS FROM FLAGS ─────────────────────────────────────────────

const SUGGESTED_ACTIONS: Record<string, string> = {
  'ET-05': 'File a Notice of False Disclosure Certification. Copy the Industrial Court.',
  'ET-06': 'Resend the email with a read receipt and registered post confirmation. Copy the Tribunal.',
  'ET-08': 'File an Adverse Inference Application citing spoliation. Document when the evidence last existed.',
  'PT-03': 'Acknowledge the costs warning. Note LiP protection applies. State you will continue the claim.',
  'PT-04': 'Request a 21-day extension to consider the settlement offer. Seek free legal advice first.',
  'ST-02': 'Document every minimisation statement. Create a Gaslighting Evidence Schedule.',
  'ST-03': 'Respond formally. Request the counterclaim be put in writing with full particulars.',
  'ST-05': 'Object in writing to irrelevant character evidence. Request the Tribunal rule on admissibility.',
  'PPT-02': 'Treat this as a formal dismissal. File a formal appeal within the appeal window.',
  'PPT-03': 'Request the incident report for the technical failure. If none exists, file a Spoliation Notice.',
  'PPT-04': 'Cite Access to Information Act 2021. Request the specific policy exemption that applies.',
}

// ── MASTER ANALYSIS ───────────────────────────────────────────────────────────

export function analyseCorrespondence(options: {
  body: string
  toField?: string
  ccField?: string
  hasReadReceipt?: boolean
}): CorrespondenceAnalysis {
  const { body, toField = '', ccField = '', hasReadReceipt = false } = options
  const deadlines = extractDeadlines(body)
  const flags = detectCorrespondenceFlags(body)
  const toneIndicators = detectTone(body)
  const tribunalCopied = isTribunalCopied(toField, ccField, body)

  const suggestedActions = [
    ...flags.map(f => SUGGESTED_ACTIONS[f.patternId]).filter(Boolean),
    ...(deadlines.some(d => d.urgency === 'critical' || d.urgency === 'overdue')
      ? ['URGENT: One or more critical deadlines detected. Act immediately.']
      : []),
    ...(!tribunalCopied && flags.some(f => ['critical', 'high'].includes(f.severity))
      ? ['Consider copying the Industrial Court on your response to critical-severity flags.']
      : []),
  ]

  return { deadlines, flags, tribunalCopied, hasReadReceipt, toneIndicators, suggestedActions }
}
