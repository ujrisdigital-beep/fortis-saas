export interface AnchorDetection {
  id: string
  category: string
  detectors: Detector[]
}

export interface Detector {
  id: string
  name: string
  pattern: RegExp
  weighting: number
  explanation: string
  gambiaContext: string
}

export interface AnalysisResult {
  anchorId: string
  detected: boolean
  confidence: number
  matchedText: string
  severity: 'high' | 'medium' | 'low'
}

const ANCHOR_CATEGORIES: AnchorDetection[] = [
  {
    id: 'timeline',
    category: 'Timeline Inconsistencies',
    detectors: [
      {
        id: 't1', name: 'Date Contradiction',
        pattern: /(?:date|when|day|month|year)[\s:]*(?:is|was|were)?\s*.*\d{4}/i,
        weighting: 0.85, explanation: 'Different dates mentioned for same event',
        gambiaContext: 'Evidence Act 2019 s.24 - contradiction must be proved beyond reasonable doubt'
      },
      {
        id: 't2', name: 'Sequence Reversal',
        pattern: /(?:after|before|then|next|previously|followed)/i,
        weighting: 0.7, explanation: 'Events described in wrong order',
        gambiaContext: 'Sequence matters for establishing causation'
      }
    ]
  },
  {
    id: 'specificity',
    category: 'Over-Specificity',
    detectors: [
      {
        id: 's1', name: 'Unnecessary Detail',
        pattern: /\b(?:exactly|precisely|specifically|verbatim|word for word)\b/i,
        weighting: 0.6, explanation: 'Too many exact quotes suggests fabrication',
        gambiaContext: 'Genuine memories are fuzzy on details'
      },
      {
        id: 's2', name: 'Unusual Precision',
        pattern: /\d{1,2}:\d{2}\s*(?:am|pm)?/i,
        weighting: 0.7, explanation: 'Exact times remembered too precisely',
        gambiaContext: 'Courts expect approximate times'
      }
    ]
  },
  {
    id: 'emotion',
    category: 'Emotional Manipulation',
    detectors: [
      {
        id: 'e1', name: 'Victim Amplification',
        pattern: /\b(?:crying|sobbing|devastated|traumatized|heartbroken)/i,
        weighting: 0.65, explanation: 'Excessive emotion may indicate coaching',
        gambiaContext: 'Genuine distress is often understated'
      },
      {
        id: 'e2', name: 'Anger Indicators',
        pattern: /\b(?:furious|enraged|失控|hit|murder)/i,
        weighting: 0.8, explanation: 'Extreme anger claims may be embellished',
        gambiaContext: 'Industrial Court considers proportionality'
      }
    ]
  },
  {
    id: 'contradiction',
    category: 'Direct Contradictions',
    detectors: [
      {
        id: 'c1', name: 'Self Contradiction',
        pattern: /(.+)\s+(?:but|however|although|yet)\s+(?!but|however)(.+)/i,
        weighting: 0.95, explanation: 'Statement contradicts itself',
        gambiaContext: 'Evidence Act 2019 s.9 - inconsistent evidence damages credibility'
      }
    ]
  },
  {
    id: 'omission',
    category: 'Suspicious Omissions',
    detectors: [
      {
        id: 'o1', name: 'No Witness',
        pattern: /\b(?:nobody|no one|no-?one|none)\s+(?:saw?|heard?|knew?)/i,
        weighting: 0.7, explanation: 'No independent witness to major events',
        gambiaContext: 'Ask why no one else saw/heard'
      },
      {
        id: 'o2', name: 'Memory Gap',
        pattern: /\b(?:cannot remember|cant remember|do not remember|dont remember|cannot recall|dont recall)\s+(?:the|that|what)/i,
        weighting: 0.6, explanation: 'Unable to recall key events',
        gambiaContext: 'May indicate incomplete disclosure'
      }
    ]
  },
  {
    id: 'legal',
    category: 'Legal Language',
    detectors: [
      {
        id: 'l1', name: 'Legal Terminology',
        pattern: /\b(?:constructive dismissal|harassment|discrimination|breach of contract|unfair dismissal)\b/i,
        weighting: 0.8, explanation: 'Using legal terms may indicate coaching',
        gambiaContext: 'Genuine claimants use plain language'
      }
    ]
  }
]

export function analyzeText(text: string): AnalysisResult[] {
  const results: AnalysisResult[] = []
  for (const category of ANCHOR_CATEGORIES) {
    for (const detector of category.detectors) {
      if (detector.pattern.test(text)) {
        const match = text.match(detector.pattern)
        results.push({
          anchorId: detector.id,
          detected: true,
          confidence: detector.weighting,
          matchedText: match?.[0] || '',
          severity: detector.weighting > 0.8 ? 'high' : detector.weighting > 0.6 ? 'medium' : 'low'
        })
      }
    }
  }
  return results.sort((a, b) => b.confidence - a.confidence)
}

export function calculateStrengthScore(results: AnalysisResult[]): number {
  if (results.length === 0) return 100
  const highSeverity = results.filter(r => r.severity === 'high').length
  const mediumSeverity = results.filter(r => r.severity === 'medium').length
  const lowSeverity = results.filter(r => r.severity === 'low').length
  const deductions = (highSeverity * 25) + (mediumSeverity * 15) + (lowSeverity * 5)
  return Math.max(0, 100 - deductions)
}

export function generateWarnings(results: AnalysisResult[]): string[] {
  return results.map(r => {
    const detector = getDetectorById(r.anchorId)
    return `[${r.severity.toUpperCase()}] ${detector?.name || r.anchorId}: ${detector?.explanation || ''}`
  })
}

function getDetectorById(id: string): Detector | undefined {
  for (const category of ANCHOR_CATEGORIES) {
    const detector = category.detectors.find(d => d.id === id)
    if (detector) return detector
  }
  return undefined
}

export function getCategorySummary(results: AnalysisResult[]): { category: string; count: number; avgConfidence: number }[] {
  const summary: Record<string, { count: number; total: number }> = {}
  for (const result of results) {
    const detector = getDetectorById(result.anchorId)
    if (detector) {
      const categoryName = ANCHOR_CATEGORIES.find(c => c.detectors.some(d => d.id === result.anchorId))?.category || 'Unknown'
      if (!summary[categoryName]) summary[categoryName] = { count: 0, total: 0 }
      summary[categoryName].count++
      summary[categoryName].total += result.confidence
    }
  }
  return Object.entries(summary).map(([category, data]) => ({
    category, count: data.count, avgConfidence: data.total / data.count
  }))
}

export function getAllAnchors(): AnchorDetection[] {
  return ANCHOR_CATEGORIES
}