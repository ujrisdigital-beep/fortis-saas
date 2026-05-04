// Top-level re-export of UJRIS forensic engine + convenience analyzeCase function
export * from './ujris/forensic-patterns';
export { runForensicAnalysis, getCaseStrengthScore, getAlertsByCategory } from './ujris/forensic-patterns';

import {
  runForensicAnalysis,
  getCaseStrengthScore,
  type ForensicContext,
} from './ujris/forensic-patterns';

export interface CaseAnalysisResult {
  alerts: Array<{
    ruleId: string;
    label: string;
    severity: string;
    explanation: string;
    counterAction: string;
  }>;
  caseStrength: number;
  timeline: Array<{ date: string; description: string; category?: string }>;
  patternCount: { critical: number; high: number; medium: number; low: number };
  recommendation: string;
}

export function analyzeCase(ctx: ForensicContext): CaseAnalysisResult {
  const detected = runForensicAnalysis(ctx);
  const strength = getCaseStrengthScore(ctx);

  const alerts = detected
    .map(p => {
      const result = p.detect(ctx);
      if (!result.detected) return null;
      return {
        ruleId: p.id,
        label: result.label ?? p.label,
        severity: result.severity ?? 'low',
        explanation: result.explanation ?? p.description,
        counterAction: result.counterAction ?? '',
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const patternCount = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const a of alerts) {
    if (a.severity in patternCount) patternCount[a.severity as keyof typeof patternCount]++;
  }

  const timeline = (ctx.timeline ?? []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let recommendation = 'Your case has a reasonable foundation.';
  if (patternCount.critical >= 2) {
    recommendation = 'URGENT: Multiple critical patterns detected. Seek immediate legal advice and secure all evidence.';
  } else if (patternCount.critical === 1) {
    recommendation = 'A critical legal pattern has been detected. Prioritise addressing it before your next deadline.';
  } else if (patternCount.high >= 2) {
    recommendation = 'Several high-severity patterns detected. Strengthen your evidence bundle and draft formal responses.';
  } else if (strength >= 75) {
    recommendation = 'Strong case. Focus on procedural compliance and document every communication.';
  }

  return { alerts, caseStrength: strength, timeline, patternCount, recommendation };
}
