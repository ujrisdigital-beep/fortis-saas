export type PatternSeverity = "critical" | "high" | "medium" | "low";

export interface PatternResult {
  detected: boolean;
  severity?: PatternSeverity;
  ruleId?: string;
  label?: string;
  explanation?: string;
  counterAction?: string;
  metadata?: Record<string, unknown>;
}

export interface ForensicPattern {
  id: string;
  category: "ET" | "PT" | "ST" | "PPT" | "FA" | "CS";
  label: string;
  description: string;
  detect: (ctx: ForensicContext) => PatternResult;
  reference?: string;
}

export interface ForensicContext {
  documents?: DocumentMeta[];
  timeline?: TimelineEvent[];
  communications?: Communication[];
  employmentTerms?: EmploymentTerms;
  evidenceItems?: EvidenceItem[];
  witnessStatements?: WitnessStatement[];
  financialRecords?: FinancialRecord[];
  emails?: Email[];
  letters?: Letter[];
  incidents?: IncidentReport[];
}

export interface DocumentMeta {
  type: string;
  date?: string;
  issuer?: string;
  content?: string;
  redactions?: string[];
  url?: string;
}

export interface TimelineEvent {
  date: string;
  description: string;
  category?: string;
  actor?: string;
}

export interface Communication {
  from: string;
  to: string;
  date: string;
  subject: string;
  content: string;
  attachmentCount?: number;
}

export interface EmploymentTerms {
  noticePeriod?: number;
  salary?: number;
  role?: string;
  startDate?: string;
  contractType?: string;
}

export interface EvidenceItem {
  id: string;
  type: string;
  date: string;
  description: string;
  preserved: boolean;
}

export interface WitnessStatement {
  name: string;
  date: string;
  relationshipToParties: string;
  keyAssertions: string[];
}

export interface FinancialRecord {
  date: string;
  type: string;
  amount: number;
  description: string;
  source: string;
}

export interface Email {
  from: string;
  to: string;
  date: string;
  subject: string;
  body: string;
  hasAttachments: boolean;
  readReceipt: boolean;
}

export interface Letter {
  sentDate: string;
  receivedDate?: string;
  type: string;
  sender: string;
  recipient: string;
  subject: string;
  signed: boolean;
  tracked: boolean;
}

export interface IncidentReport {
  incidentDate: string;
  reportDate: string;
  reportedTo: string;
  description: string;
  outcome: string;
}

function daysDiff(a: string | Date, b: string | Date): number {
  const d = new Date(a).getTime() - new Date(b).getTime();
  return Math.abs(Math.round(d / (1000 * 60 * 60 * 24)));
}

function extractAnchor(str: string): string {
  return str.replace(/^(i think|i believe|i recall|approximately|near|around|maybe|perhaps|probably|might have|not sure|i'm not certain|i'm not sure)\s*/i, "").trim().slice(0, 120);
}

function hasAnchor(str: string): boolean {
  return /^(i think|i believe|i recall|approximately|around|maybe|perhaps|probably|might have|not sure|i'm not certain|i'm not sure)/i.test(str.trim());
}

function isRedacted(str: string): boolean {
  return /\[[\w\s]*redacted[\w\s]*\]|\bxxx+\b|\b[a-z]{3,}\.\.\./i.test(str) || (str.match(/\b[A-Z][a-z]+\s+\*+\s*[A-Z][a-z]+\b/g) || []).length > 0;
}

function countWords(str: string): number {
  return str.split(/\s+/).filter(Boolean).length;
}

// ─── CATEGORY ET: EVIDENTIAL TRICKS ───────────────────────────────────────────────────────

function anchorLie(ctx: ForensicContext): PatternResult {
  const texts = [
    ...(ctx.communications?.map((c) => c.content) || []),
  ];
  let anchors = 0;
  for (const t of texts) {
    if (hasAnchor(t)) anchors++;
  }
  return {
    detected: anchors >= 2,
    severity: anchors >= 4 ? "critical" : anchors >= 2 ? "high" : undefined,
    ruleId: "ET-01",
    label: "ET-01 Anchor Lie Detected",
    explanation: anchors >= 4
      ? `${anchors} statements use anchoring phrases (hedged qualifiers). Likely dishonest recollection or coached testimony.`
      : anchors >= 2
      ? `${anchors} statements use hedging anchors like "I think", "I believe", "around", "approximately".`
      : undefined,
    counterAction: "Flag each anchor. Challenge recollection date. Request contemporaneous records. Ask open-ended questions to break pattern.",
  };
}

function retroactiveDoc(ctx: ForensicContext): PatternResult {
  const inc = ctx.incidents?.[0];
  if (!inc) return { detected: false };
  const earliestDoc = ctx.documents?.reduce((min: string | undefined, d) => (!min || (d.date && d.date < min)) ? d.date : min, undefined);
  if (!earliestDoc) return { detected: false };
  const diff = daysDiff(inc.incidentDate, earliestDoc);
  return {
    detected: diff > 14,
    severity: diff > 60 ? "high" : diff > 14 ? "medium" : undefined,
    ruleId: "ET-02",
    label: "ET-02 Retroactive Documentation",
    explanation: diff > 14 ? `Earliest document is ${diff} days after incident (threshold 14).` : undefined,
    counterAction: diff > 14 ? "Challenge delay. Ask why it took so long. Request all drafts and working versions." : undefined,
  };
}

function selectivePreservation(ctx: ForensicContext): PatternResult {
  const ev = ctx.evidenceItems || [];
  const missingTypes = ev.filter((e) => !e.preserved).map((e) => e.type);
  return {
    detected: missingTypes.length > 0,
    severity: missingTypes.length > 2 ? "high" : missingTypes.length > 0 ? "medium" : undefined,
    ruleId: "ET-03",
    label: "ET-03 Selective Evidence Preservation",
    explanation: missingTypes.length > 0 ? `Missing evidence: ${missingTypes.join(", ")}.` : undefined,
    counterAction: missingTypes.length > 0 ? "Formally request preservation via Section 161 Criminal Procedure Code. Cite spoliation risk." : undefined,
  };
}

function blurredExculpatory(ctx: ForensicContext): PatternResult {
  const redacted = (ctx.documents || []).filter((d) => d.redactions && d.redactions.length > 0);
  return {
    detected: redacted.length > 0,
    severity: redacted.length > 2 ? "medium" : undefined,
    ruleId: "ET-04",
    label: "ET-04 Blurred Exculpatory Content",
    explanation: redacted.length > 2 ? `${redacted.length} documents contain redactions — possible concealment.` : undefined,
    counterAction: redacted.length > 0 ? "Apply for disclosure order. Request unredacted originals. File Section 254 application." : undefined,
  };
}

function alteredTimeline(ctx: ForensicContext): PatternResult {
  const ev = ctx.timeline || [];
  if (ev.length < 3) return { detected: false };
  const dates = ev.map((e) => new Date(e.date).getTime()).filter(Boolean);
  let reversals = 0;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] < dates[i - 1]) reversals++;
  }
  return {
    detected: reversals > 0,
    severity: reversals > 1 ? "high" : reversals > 0 ? "medium" : undefined,
    ruleId: "ET-05",
    label: "ET-05 Altered Timeline",
    explanation: reversals > 0 ? `${ reversals } date reversal(s) in narrative timeline.` : undefined,
    counterAction: reversals > 0 ? "Plot events chronologically. Identify who altered the record. Request metadata." : undefined,
  };
}

function fabricatedWitness(ctx: ForensicContext): PatternResult {
  const ws = ctx.witnessStatements || [];
  const suspicious = ws.filter((w) => {
    const assertions = w.keyAssertions.join(" ");
    return hasAnchor(assertions) || countWords(assertions) < 15;
  });
  return {
    detected: suspicious.length > 0,
    severity: suspicious.length > 2 ? "high" : suspicious.length > 0 ? "medium" : undefined,
    ruleId: "ET-06",
    label: "ET-06 Fabricated Witness Statements",
    explanation: suspicious.length > 0 ? `${suspicious.length} statements appear coached or rehearsed.` : undefined,
    counterAction: suspicious.length > 0 ? "Cross-examine each witness. Demand proof of attendance. Request CCTV/phone records." : undefined,
  };
}

function digitalTimestampAnomaly(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents || [];
  const anomaly = docs.filter((d) => {
    if (!d.content) return false;
    const words = d.content.split(/\s+/);
    for (const w of words) {
      if (/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?\s*,?\s*\d{4}/i.test(w)) return false;
    }
    return d.content.match(/\b\d{4}-\d{2}-\d{2}\b/) && d.date && d.content.includes(d.date);
  });
  return {
    detected: anomaly.length > 0,
    severity: "medium",
    ruleId: "ET-07",
    label: "ET-07 Digital Timestamp Anomaly",
    explanation: "Some documents may have manipulated metadata.",
    counterAction: "Request IT forensics audit. File disclosure for all metadata fields.",
  };
}

function alteredFinancials(ctx: ForensicContext): PatternResult {
  const fr = ctx.financialRecords || [];
  if (fr.length < 2) return { detected: false };
  const total = fr.reduce((s, r) => s + r.amount, 0);
  const amounts = fr.map((r) => r.amount);
  const rounds = amounts.filter((a) => a % 100 === 0).length;
  return {
    detected: rounds > amounts.length * 0.6,
    severity: rounds > amounts.length * 0.8 ? "high" : "medium",
    ruleId: "ET-08",
    label: "ET-08 Altered Financial Records",
    explanation: "Many rounded figures detected — possible manual adjustment.",
    counterAction: "Request bank statements directly. File spoliation notice. Cite false accounting.",
  };
}

// ─── CATEGORY PT: PROCEDURAL TRAPS ─────────────────────────────────────────

function impossibleDeadline(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents || [];
  const complex = docs.length > 5;
  const deadline = ctx.incidents?.[0];
  if (!deadline) return { detected: false };
  const days = daysDiff(deadline.incidentDate, new Date().toISOString());
  return {
    detected: days < 14 && complex,
    severity: days < 7 ? "critical" : days < 14 ? "high" : undefined,
    ruleId: "PT-01",
    label: "PT-01 Impossible Deadline",
    explanation: days < 14 ? `${days}-day deadline given for ${docs.length} documents.` : undefined,
    counterAction: days < 14 ? "Apply for extension citing complexity. File interlocutory injunction." : undefined,
  };
}

function extensionCreep(ctx: ForensicContext): PatternResult {
  const tl = ctx.timeline?.filter((e) => /deadline|extension|adjourn/i.test(e.description)) || [];
  return {
    detected: tl.length > 3,
    severity: tl.length > 5 ? "high" : tl.length > 3 ? "medium" : undefined,
    ruleId: "PT-02",
    label: "PT-02 Extension Creep",
    explanation: tl.length > 3 ? `${tl.length} extensions/adjournments detected.` : undefined,
    counterAction: tl.length > 3 ? "Oppose next adjournment citing prejudice. Cite delay as abuse of process." : undefined,
  };
}

function costsWarningIntimidation(ctx: ForensicContext): PatternResult {
  const comms = ctx.communications?.filter((c) =>
    /costs|legal fees|you will pay|your liability|unlawful dismissal|damages/i.test(c.content)
  ) || [];
  return {
    detected: comms.length >= 2,
    severity: comms.length >= 3 ? "high" : comms.length >= 2 ? "medium" : undefined,
    ruleId: "PT-03",
    label: "PT-03 Costs Warning Intimidation",
    explanation: comms.length >= 2 ? `${comms.length} costs/legal fee warnings detected.` : undefined,
    counterAction: comms.length >= 2 ? "Respond formally citing costs jurisdiction. Request Itemised bill. File Section 31 offer." : undefined,
  };
}

function inadequateDisclosure(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents || [];
  return {
    detected: docs.length === 0,
    severity: "high",
    ruleId: "PT-04",
    label: "PT-04 Inadequate Disclosure",
    explanation: "No documents disclosed — possible suppression of evidence.",
    counterAction: "File Schedule 1 notice. Cite non-compliance. Apply for unless order.",
  };
}

function proceduralDelayAbuse(ctx: ForensicContext): PatternResult {
  const tl = ctx.timeline || [];
  const delays = tl.filter((e) => /adjourn|postpone|delay|wait/i.test(e.description));
  return {
    detected: delays.length > 4,
    severity: delays.length > 6 ? "high" : delays.length > 4 ? "medium" : undefined,
    ruleId: "PT-05",
    label: "PT-05 Procedural Delay Abuse",
    explanation: delays.length > 4 ? `${delays.length} procedural delays/adjournments.` : undefined,
    counterAction: delays.length > 4 ? "Oppose adjournment. File formal complaint. Cite Employment Act S.79." : undefined,
  };
}

function jurisdictionConfusion(ctx: ForensicContext): PatternResult {
  const terms = ctx.employmentTerms;
  if (!terms) return { detected: false };
  const isUKRelated = /\b(uk|european|eu|gateway|solicitors regulation authority|sra)\b/i.test(JSON.stringify(ctx));
  return {
    detected: isUKRelated,
    severity: isUKRelated ? "high" : undefined,
    ruleId: "PT-06",
    label: "PT-06 Jurisdiction Confusion (UK Law Reference)",
    explanation: isUKRelated ? "Contract references UK law instead of Gambian Labour Act 2007." : undefined,
    counterAction: isUKRelated ? "Object to jurisdiction. Cite Labour Act 2007 S.2 and Evidence Act 2019 S.4." : undefined,
  };
}

// ─── CATEGORY ST: SOLICITOR TACTICS ────────────────────────────────────────────────

function settlementSuppression(ctx: ForensicContext): PatternResult {
  const ltrs = ctx.letters?.filter((l) => /without|prejudice|off record|settle/i.test(l.subject)) || [];
  return {
    detected: ltrs.length > 0,
    severity: "medium",
    ruleId: "ST-01",
    label: "ST-01 Settlement Suppression",
    explanation: ltrs.length > 0 ? `${ltrs.length} WP/strictly confidential letters detected.` : undefined,
    counterAction: ltrs.length > 0 ? "Respond under Section 31. Preserve WP privilege. Seek legal advice." : undefined,
  };
}

function gaslighting(ctx: ForensicContext): PatternResult {
  const em = ctx.emails?.filter((e) =>
    /not a grievance|minor|isolated|one-off|unusual|no pattern|doesn't reflect/i.test(e.body)
  ) || [];
  return {
    detected: em.length > 0,
    severity: em.length > 2 ? "high" : "medium",
    ruleId: "ST-02",
    label: "ST-02 Gaslighting — Minimisation",
    explanation: em.length > 0 ? `${em.length} minimising/normalising emails detected.` : undefined,
    counterAction: em.length > 0 ? "Document all minimisation. Preserve originals. File counterstatement." : undefined,
  };
}

function counterclaims(ctx: ForensicContext): PatternResult {
  const em = ctx.emails?.filter((e) =>
    /counterclaim|cross-claim|we reserve the right|claim against you|defamation/i.test(e.body)
  ) || [];
  return {
    detected: em.length > 0,
    severity: "high",
    ruleId: "ST-03",
    label: "ST-03 Counterclaim Intimidation",
    explanation: em.length > 0 ? `${em.length} counterclaim/reserve rights threats.` : undefined,
    counterAction: em.length > 0 ? "Respond formally. Apply for strike-out. Seek injunction." : undefined,
  };
}

function legalComplexityObfuscation(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents || [];
  const long = docs.filter((d) => d.content && countWords(d.content) > 3000);
  return {
    detected: long.length > 3,
    severity: "medium",
    ruleId: "ST-04",
    label: "ST-04 Legal Complexity Obfuscation",
    explanation: long.length > 3 ? `${long.length} documents exceed 3000 words — possible deliberate complexity.` : undefined,
    counterAction: long.length > 3 ? "Request plain language summary. Apply for disclosure timetable." : undefined,
  };
}

function reputationDamageThreat(ctx: ForensicContext): PatternResult {
  const em = ctx.emails?.filter((e) =>
    /reputation|defamation|public|social media|press|media|retainer|withdraw|resign/i.test(e.body)
  ) || [];
  return {
    detected: em.length > 0,
    severity: "medium",
    ruleId: "ST-05",
    label: "ST-05 Reputation Damage Threat",
    explanation: em.length > 0 ? `${em.length} reputation/media threat communications.` : undefined,
    counterAction: em.length > 0 ? "Document threats. Seek emergency injunction. File defamation counterclaim." : undefined,
  };
}

// ─── CATEGORY PPT: POLICE/PSD TACTICS ─────────────────────────────────────────

function misdirectionWitness(ctx: ForensicContext): PatternResult {
  const ws = ctx.witnessStatements || [];
  const named = ws.filter((w) => /^(line manager|hr|director|senior manager|police|psd|investigator)/i.test(w.relationshipToParties));
  return {
    detected: named.length > 0,
    severity: "high",
    ruleId: "PPT-01",
    label: "PPT-01 Witness Misdirection (Employer-Aligned)",
    explanation: named.length > 0 ? `${named.length} witnesses in senior/employer-adjacent roles.` : undefined,
    counterAction: named.length > 0 ? "Challenge conflict of interest. Request their full statements under disclosure." : undefined,
  };
}

function psdInconsistentFindings(ctx: ForensicContext): PatternResult {
  const inc = ctx.incidents || [];
  if (inc.length < 2) return { detected: false };
  return {
    detected: false,
    severity: undefined,
    ruleId: "PPT-02",
    label: "PPT-02 PSD Inconsistent Findings",
    explanation: undefined,
    counterAction: undefined,
  };
}

function interviewCoaching(ctx: ForensicContext): PatternResult {
  const ws = ctx.witnessStatements || [];
  const rehearsed = ws.filter((w) =>
    w.keyAssertions.some((a) => countWords(a) > 100 && !hasAnchor(a))
  );
  return {
    detected: rehearsed.length > 0,
    severity: "medium",
    ruleId: "PPT-03",
    label: "PPT-03 Interview Coaching",
    explanation: rehearsed.length > 0 ? `${rehearsed.length} statements appear rehearsed (>100 words, no hedging).` : undefined,
    counterAction: rehearsed.length > 0 ? "Apply for Section 9 witness interview transcript. Challenge accuracy." : undefined,
  };
}

function investigativeTunnelVision(ctx: ForensicContext): PatternResult {
  const inc = ctx.incidents || [];
  return {
    detected: inc.length === 1,
    severity: "low",
    ruleId: "PPT-04",
    label: "PPT-04 Investigative Tunnel Vision",
    explanation: "Only one incident investigated — possible single-incident bias.",
    counterAction: "Request full investigation scope. File for bias in investigation.",
  };
}

function withheldExonerating(ctx: ForensicContext): PatternResult {
  const ev = ctx.evidenceItems || [];
  const ex = ev.filter((e) => /exonerat|not involved|cleared|innocent|no responsib/i.test(e.description));
  return {
    detected: ex.length === 0 && ev.length > 2,
    severity: "high",
    ruleId: "PPT-05",
    label: "PPT-05 Withheld Exonerating Evidence",
    explanation: ev.length > 2 ? "All evidence points one direction — possible suppression." : undefined,
    counterAction: ev.length > 2 ? "File for full disclosure. Apply for witness summons. Cite spoliation." : undefined,
  };
}

function investigationLeak(ctx: ForensicContext): PatternResult {
  const em = ctx.emails?.filter((e) =>
    /leak|confidential|off record|not for circulation|do not share/i.test(e.body)
  ) || [];
  return {
    detected: em.length > 0,
    severity: "medium",
    ruleId: "PPT-06",
    label: "PPT-06 Investigation Leak / Confidentiality Breach",
    explanation: em.length > 0 ? `${em.length} emails contain confidentiality instructions.` : undefined,
    counterAction: em.length > 0 ? "File ethics complaint. Preserve email chain. Seek confidentiality injunction." : undefined,
  };
}

// ─── CATEGORY FA: FORENSIC AUDIT RULES ��─────────────────────────────────────

function salaryReconciliation(ctx: ForensicContext): PatternResult {
  const terms = ctx.employmentTerms;
  const fr = ctx.financialRecords || [];
  if (!terms?.salary || fr.length === 0) return { detected: false };
  const monthly = terms.salary / 12;
  const recordsMatch = fr.some((r) => Math.abs(r.amount - monthly) < 10);
  return {
    detected: !recordsMatch,
    severity: !recordsMatch ? "high" : undefined,
    ruleId: "FA-01",
    label: "FA-01 Salary Reconciliation",
    explanation: !recordsMatch ? "Salary records do not match contract terms." : undefined,
    counterAction: !recordsMatch ? "Request full pay history. File underpayment claim. Cite Labour Act S.17." : undefined,
  };
}

function overtimeAnomaly(ctx: ForensicContext): PatternResult {
  const fr = ctx.financialRecords || [];
  const ot = fr.filter((r) => /overtime|bonus|allowance|extra/i.test(r.description));
  return {
    detected: ot.length === 0,
    severity: "medium",
    ruleId: "FA-02",
    label: "FA-02 Overtime Anomaly",
    explanation: "No overtime records found despite long hours.",
    counterAction: "Request timesheets. File underpayment of wages claim. Cite Labour Act S.18.",
  };
}

function documentAuthenticity(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents?.filter((d) => d.content && isRedacted(d.content)) || [];
  return {
    detected: docs.length > 0,
    severity: docs.length > 2 ? "high" : docs.length > 0 ? "medium" : undefined,
    ruleId: "FA-03",
    label: "FA-03 Document Authenticity — Redaction",
    explanation: docs.length > 0 ? `${docs.length} documents contain visible redactions.` : undefined,
    counterAction: docs.length > 0 ? "Apply for unredacted originals. Challenge authenticity. File disclosure order." : undefined,
  };
}

function emailMetadataAudit(ctx: ForensicContext): PatternResult {
  const em = ctx.emails || [];
  const noMeta = em.filter((e) => !e.hasAttachments && !e.readReceipt);
  return {
    detected: noMeta.length > 5,
    severity: "low",
    ruleId: "FA-04",
    label: "FA-04 Email Metadata Audit",
    explanation: noMeta.length > 5 ? `${noMeta.length} emails with minimal metadata — possible deletion.` : undefined,
    counterAction: noMeta.length > 5 ? "Request email forensics. File for recovery of deleted emails." : undefined,
  };
}

function legalFeesScrutiny(ctx: ForensicContext): PatternResult {
  const em = ctx.emails?.filter((e) =>
    /solicitor|counsel|fees|disbursements|vat|chambers/i.test(e.body)
  ) || [];
  return {
    detected: em.length > 3,
    severity: "medium",
    ruleId: "FA-05",
    label: "FA-05 Legal Fees Scrutiny",
    explanation: em.length > 3 ? `${em.length} solicitor fee references detected.` : undefined,
    counterAction: em.length > 3 ? "Request itemised bill. Challenge excessive fees. File costs assessment." : undefined,
  };
}

// ─── CATEGORY CS: COUNTER-STRATEGIES ──────────────────────────────────────

function caseStrengthCounter(ctx: ForensicContext): PatternResult {
  const strong = (ctx.evidenceItems?.filter((e) => e.preserved).length || 0) >= 3;
  const hasTimeline = (ctx.timeline?.length || 0) >= 3;
  const hasWitness = (ctx.witnessStatements?.length || 0) >= 2;
  return {
    detected: strong && hasTimeline && hasWitness,
    severity: "high",
    ruleId: "CS-01",
    label: "CS-01 Strong Case Indicators",
    explanation: strong && hasTimeline && hasWitness
      ? "Strong case indicators present: 3+ preserved items, timeline, 2+ witnesses."
      : undefined,
    counterAction: strong && hasTimeline && hasWitness
      ? "Proceed to Industrial Court. File IC-1 complaint. Cite evidence preservation."
      : undefined,
  };
}

function mediationEligibility(ctx: ForensicContext): PatternResult {
  const terms = ctx.employmentTerms;
  const eligible = terms ? daysDiff(terms.startDate || "", new Date().toISOString()) > 0 : false;
  return {
    detected: eligible,
    severity: eligible ? "high" : undefined,
    ruleId: "CS-02",
    label: "CS-02 Mediation Eligibility",
    explanation: eligible ? "Employee eligible for labour mediation." : undefined,
    counterAction: eligible ? "File for Labour Mediation. Cite Labour Act S.74." : undefined,
  };
}

function timeBarCheck(ctx: ForensicContext): PatternResult {
  const inc = ctx.incidents?.[0];
  if (!inc) return { detected: false };
  const days = daysDiff(inc.incidentDate, new Date().toISOString());
  const withinStatutory = days <= 30;
  const withinDiscretionary = days <= 90;
  return {
    detected: true,
    severity: !withinStatutory && !withinDiscretionary ? "critical" : withinStatutory ? "low" : "medium",
    ruleId: "CS-03",
    label: "CS-03 Time-Bar Check (Gambia Labour Act)",
    explanation: `Incident ${days} days ago. Statutory limit: 30 days. Discretionary: 90 days.`,
    counterAction: !withinStatutory && !withinDiscretionary
      ? "URGENT: File extension application citing exceptional circumstances."
      : !withinStatutory
      ? "File immediately under discretionary extension."
      : "File within statutory 30-day window.",
  };
}

function witnessCorroboration(ctx: ForensicContext): PatternResult {
  const ws = ctx.witnessStatements || [];
  const corroborated = ws.filter((w) => {
    const others = ws.filter((ow) => ow.name !== w.name);
    return w.keyAssertions.some((a) => others.some((ow) => ow.keyAssertions.some((oa) => a === oa)));
  });
  return {
    detected: corroborated.length > 0,
    severity: corroborated.length > 1 ? "high" : undefined,
    ruleId: "CS-04",
    label: "CS-04 Witness Corroboration",
    explanation: corroborated.length > 0 ? `${corroborated.length} corroborating witnesses found.` : undefined,
    counterAction: corroborated.length > 0 ? "Compile corroboration bundle. File as primary evidence. Cite Evidence Act S.9." : undefined,
  };
}

function precedentPreservation(ctx: ForensicContext): PatternResult {
  const docs = ctx.documents || [];
  return {
    detected: docs.length > 0,
    severity: "medium",
    ruleId: "CS-05",
    label: "CS-05 Precedent Preservation",
    explanation: docs.length > 0 ? `${docs.length} documents preserved for precedent.` : undefined,
    counterAction: docs.length > 0 ? "Compile precedent bundle. File at Industrial Court registry. Cite IC procedure." : undefined,
  };
}

function industrialCourtJurisdiction(ctx: ForensicContext): PatternResult {
  return {
    detected: true,
    severity: "high",
    ruleId: "CS-06",
    label: "CS-06 Industrial Court Jurisdiction",
    explanation: "Employment disputes filed under Labour Act 2007. Industrial Court Banjul has jurisdiction.",
    counterAction: "File IC-1 form at Industrial Court, Banjul. Cite Labour Act S.65. Engage qualified counsel.",
  };
}

function costsEstimateExposure(ctx: ForensicContext): PatternResult {
  const fr = ctx.financialRecords || [];
  const total = fr.reduce((s, r) => s + r.amount, 0);
  return {
    detected: total > 0,
    severity: total > 50000 ? "high" : total > 0 ? "medium" : undefined,
    ruleId: "CS-07",
    label: "CS-07 Costs Estimate Exposure",
    explanation: total > 50000 ? `Total financial exposure: GMD ${total.toLocaleString()}.` : undefined,
    counterAction: total > 0 ? "Obtain costs estimate. Apply for cost capping order. File Section 31 offer." : undefined,
  };
}

// ─── MASTER REGISTRY ───────────────────────────────────────────────────────

export const allPatterns: ForensicPattern[] = [
  { id: "ET-01", category: "ET", label: "Anchor Lie", description: "Hedged qualifier statements suggest dishonest recollection.", detect: anchorLie },
  { id: "ET-02", category: "ET", label: "Retroactive Documentation", description: "Document created significantly after incident.", detect: retroactiveDoc },
  { id: "ET-03", category: "ET", label: "Selective Evidence Preservation", description: "Key evidence not preserved.", detect: selectivePreservation },
  { id: "ET-04", category: "ET", label: "Blurred Exculpatory Content", description: "Redactions conceal potentially exonerating material.", detect: blurredExculpatory },
  { id: "ET-05", category: "ET", label: "Altered Timeline", description: "Date reversals in event sequence.", detect: alteredTimeline },
  { id: "ET-06", category: "ET", label: "Fabricated Witness Statements", description: "Coached or rehearsed witness accounts.", detect: fabricatedWitness },
  { id: "ET-07", category: "ET", label: "Digital Timestamp Anomaly", description: "Metadata inconsistencies in digital records.", detect: digitalTimestampAnomaly },
  { id: "ET-08", category: "ET", label: "Altered Financial Records", description: "Manual adjustments to financial evidence.", detect: alteredFinancials },
  { id: "PT-01", category: "PT", label: "Impossible Deadline", description: "Unrealistic response window given.", detect: impossibleDeadline },
  { id: "PT-02", category: "PT", label: "Extension Creep", description: "Deliberate timeline extension pattern.", detect: extensionCreep },
  { id: "PT-03", category: "PT", label: "Costs Warning / Intimidation", description: "Legal cost threats to discourage claims.", detect: costsWarningIntimidation },
  { id: "PT-04", category: "PT", label: "Inadequate Disclosure", description: "Insufficient evidence produced.", detect: inadequateDisclosure },
  { id: "PT-05", category: "PT", label: "Procedural Delay / Abuse", description: "Repeated adjournments to wear down claimant.", detect: proceduralDelayAbuse },
  { id: "PT-06", category: "PT", label: "Jurisdiction Confusion", description: "UK law referenced instead of Gambian law.", detect: jurisdictionConfusion },
  { id: "ST-01", category: "ST", label: "Settlement Suppression", description: "Without-prejudice letters to suppress claims.", detect: settlementSuppression },
  { id: "ST-02", category: "ST", label: "Gaslighting / Minimisation", description: "Behaviour normalised or minimised.", detect: gaslighting },
  { id: "ST-03", category: "ST", label: "Counterclaim Intimidation", description: "Cross-claim threats to frighten claimant.", detect: counterclaims },
  { id: "ST-04", category: "ST", label: "Legal Complexity Obfuscation", description: "Excessive legal complexity to confuse.", detect: legalComplexityObfuscation },
  { id: "ST-05", category: "ST", label: "Reputation Damage Threat", description: "Defamation/media threats to silence claimant.", detect: reputationDamageThreat },
  { id: "PPT-01", category: "PPT", label: "Witness Misdirection", description: "Employer-aligned witnesses presented as neutral.", detect: misdirectionWitness },
  { id: "PPT-02", category: "PPT", label: "PSD Inconsistent Findings", description: "Investigative findings contradict each other.", detect: psdInconsistentFindings },
  { id: "PPT-03", category: "PPT", label: "Interview Coaching", description: "Witness prepared/coached before statement.", detect: interviewCoaching },
  { id: "PPT-04", category: "PPT", label: "Investigative Tunnel Vision", description: "Investigation only explores one narrative.", detect: investigativeTunnelVision },
  { id: "PPT-05", category: "PPT", label: "Withheld Exonerating Evidence", description: "Clearance/exculpation records not disclosed.", detect: withheldExonerating },
  { id: "PPT-06", category: "PPT", label: "Investigation Leak / Confidentiality Breach", description: "Investigation details leaked to pressure claimant.", detect: investigationLeak },
  { id: "FA-01", category: "FA", label: "Salary Reconciliation", description: "Contract salary does not match payslips.", detect: salaryReconciliation },
  { id: "FA-02", category: "FA", label: "Overtime Anomaly", description: "No overtime records despite long working hours.", detect: overtimeAnomaly },
  { id: "FA-03", category: "FA", label: "Document Authenticity — Redaction", description: "Documents contain visible redactions.", detect: documentAuthenticity },
  { id: "FA-04", category: "FA", label: "Email Metadata Audit", description: "Emails with minimal metadata — possible deletion.", detect: emailMetadataAudit },
  { id: "FA-05", category: "FA", label: "Legal Fees Scrutiny", description: "Excessive solicitor fees detected.", detect: legalFeesScrutiny },
  { id: "CS-01", category: "CS", label: "Strong Case Indicators", description: "Multiple corroborating indicators present.", detect: caseStrengthCounter },
  { id: "CS-02", category: "CS", label: "Mediation Eligibility", description: "Employee qualifies for labour mediation.", detect: mediationEligibility },
  { id: "CS-03", category: "CS", label: "Time-Bar Check", description: "Limitation period assessment (30/90-day rule).", detect: timeBarCheck },
  { id: "CS-04", category: "CS", label: "Witness Corroboration", description: "Multiple witnesses corroborate account.", detect: witnessCorroboration },
  { id: "CS-05", category: "CS", label: "Precedent Preservation", description: "Evidence preserved for future cases.", detect: precedentPreservation },
  { id: "CS-06", category: "CS", label: "Industrial Court Jurisdiction", description: "Jurisdiction confirmed for Industrial Court.", detect: industrialCourtJurisdiction },
  { id: "CS-07", category: "CS", label: "Costs Estimate Exposure", description: "Financial risk quantified.", detect: costsEstimateExposure },
];

export function runForensicAnalysis(ctx: ForensicContext): ForensicPattern[] {
  return allPatterns.filter((p) => p.detect(ctx).detected);
}

export function getCaseStrengthScore(ctx: ForensicContext): number {
  const detected = runForensicAnalysis(ctx);
  const weights: Record<PatternSeverity, number> = { critical: 30, high: 20, medium: 10, low: 5 };
  const total = detected.reduce((s, p) => {
    const r = p.detect(ctx);
    return s + (weights[r.severity || "low"] || 5);
  }, 0);
  return Math.min(100, total);
}

export function getAlertsByCategory(ctx: ForensicContext): Record<string, ForensicPattern[]> {
  const detected = runForensicAnalysis(ctx);
  return detected.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, ForensicPattern[]>);
}