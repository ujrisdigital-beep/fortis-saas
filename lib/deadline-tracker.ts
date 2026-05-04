export interface TrackedDeadline {
  id: string;
  type: 'tribunal_claim' | 'appeal' | 'response' | 'disclosure' | 'hearing' | 'grievance' | 'earlyconciliation' | 'limitation' | 'other';
  label: string;
  date: Date;
  daysLeft: number;
  urgency: 'overdue' | 'critical' | 'warning' | 'normal';
  source: string;
  alertSent: boolean;
}

export interface DeadlineAlert {
  deadlineId: string;
  message: string;
  urgency: TrackedDeadline['urgency'];
  daysLeft: number;
}

const DEADLINE_PATTERNS: Array<{ regex: RegExp; type: TrackedDeadline['type']; label: string }> = [
  { regex: /ET1|Employment\s+Tribunal\s+claim|claim\s+form/i, type: 'tribunal_claim', label: 'ET1 Claim Deadline' },
  { regex: /early\s+conciliation|ACAS/i, type: 'earlyconciliation', label: 'ACAS Early Conciliation' },
  { regex: /respond\s+by|response\s+due|reply\s+by|response\s+required/i, type: 'response', label: 'Response Required' },
  { regex: /disclose|disclosure|bundle|list\s+of\s+documents/i, type: 'disclosure', label: 'Disclosure Deadline' },
  { regex: /hearing\s+date|listed\s+for|case\s+management.*order/i, type: 'hearing', label: 'Hearing Date' },
  { regex: /grievance|formal\s+complaint/i, type: 'grievance', label: 'Grievance Response Deadline' },
  { regex: /appeal/i, type: 'appeal', label: 'Appeal Deadline' },
  { regex: /limitation\s+period|time\s+limit|3\s+months|three\s+months/i, type: 'limitation', label: 'Limitation Period' },
];

const DATE_PATTERNS = [
  /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi,
  /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g,
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b/gi,
];

export function extractDeadlinesFromText(content: string, sourceLabel = 'Document'): TrackedDeadline[] {
  const found: TrackedDeadline[] = [];
  const today = new Date();

  for (const dp of DEADLINE_PATTERNS) {
    if (!dp.regex.test(content)) continue;

    const surrounding = content.match(new RegExp(`.{0,150}${dp.regex.source}.{0,150}`, 'gi')) ?? [];

    for (const ctx of surrounding) {
      for (const datePattern of DATE_PATTERNS) {
        datePattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = datePattern.exec(ctx)) !== null) {
          const parsed = parseDate(match[0]);
          if (!parsed) continue;

          const daysLeft = Math.ceil((parsed.getTime() - today.getTime()) / 86400000);
          const urgency: TrackedDeadline['urgency'] =
            daysLeft < 0 ? 'overdue' :
            daysLeft <= 3 ? 'critical' :
            daysLeft <= 14 ? 'warning' : 'normal';

          found.push({
            id: `${dp.type}-${parsed.toISOString()}`,
            type: dp.type,
            label: dp.label,
            date: parsed,
            daysLeft,
            urgency,
            source: sourceLabel,
            alertSent: false,
          });
        }
      }
    }
  }

  return deduplicateDeadlines(found);
}

function parseDate(str: string): Date | null {
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  const wordMonth = str.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
  if (wordMonth) {
    const d = new Date(Number(wordMonth[3]), months[wordMonth[2].toLowerCase()], Number(wordMonth[1]));
    return isNaN(d.getTime()) ? null : d;
  }

  const wordMonthAlt = str.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (wordMonthAlt) {
    const d = new Date(Number(wordMonthAlt[3]), months[wordMonthAlt[1].toLowerCase()], Number(wordMonthAlt[2]));
    return isNaN(d.getTime()) ? null : d;
  }

  const numeric = str.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (numeric) {
    const year = numeric[3].length === 2 ? 2000 + Number(numeric[3]) : Number(numeric[3]);
    const d = new Date(year, Number(numeric[2]) - 1, Number(numeric[1]));
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function deduplicateDeadlines(deadlines: TrackedDeadline[]): TrackedDeadline[] {
  const seen = new Set<string>();
  return deadlines.filter(d => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });
}

export function checkDeadlineAlerts(deadlines: TrackedDeadline[]): DeadlineAlert[] {
  const alerts: DeadlineAlert[] = [];

  for (const d of deadlines) {
    if (d.urgency === 'overdue') {
      alerts.push({
        deadlineId: d.id,
        message: `OVERDUE: "${d.label}" was due ${Math.abs(d.daysLeft)} day(s) ago. Take immediate action.`,
        urgency: 'overdue',
        daysLeft: d.daysLeft,
      });
    } else if (d.urgency === 'critical') {
      alerts.push({
        deadlineId: d.id,
        message: `CRITICAL: "${d.label}" is due in ${d.daysLeft} day(s). Act now.`,
        urgency: 'critical',
        daysLeft: d.daysLeft,
      });
    } else if (d.urgency === 'warning') {
      alerts.push({
        deadlineId: d.id,
        message: `WARNING: "${d.label}" is due in ${d.daysLeft} day(s). Prepare now.`,
        urgency: 'warning',
        daysLeft: d.daysLeft,
      });
    }
  }

  return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function sortDeadlinesByUrgency(deadlines: TrackedDeadline[]): TrackedDeadline[] {
  const order = { overdue: 0, critical: 1, warning: 2, normal: 3 };
  return [...deadlines].sort((a, b) => order[a.urgency] - order[b.urgency] || a.daysLeft - b.daysLeft);
}
