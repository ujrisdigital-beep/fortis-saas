export interface LegalMapping {
  ukReference: string
  gambiaEquivalent: string
  section?: string
  notes: string
}

export const UK_TO_GAMBIA_MAPPING: LegalMapping[] = [
  {
    ukReference: 'Employment Rights Act 1996',
    gambiaEquivalent: 'Labour Act 2007',
    section: 'Part III - Termination',
    notes: 'Primary employment legislation in Gambia'
  },
  {
    ukReference: 'Employment Tribunal',
    gambiaEquivalent: 'Industrial Court',
    section: 'Banjul',
    notes: 'Employment disputes body'
  },
  {
    ukReference: 'Equality Act 2010',
    gambiaEquivalent: 'Constitution 1997, Ch. III',
    section: 'Fundamental Rights',
    notes: 'Anti-discrimination under Bill of Rights'
  },
  {
    ukReference: 'GDPR',
    gambiaEquivalent: 'Data Protection Act 2024',
    section: 'Part I-III',
    notes: 'Personal data protection'
  },
  {
    ukReference: 'ACAS',
    gambiaEquivalent: 'Department of Labour',
    section: 'Mediation',
    notes: 'Conciliation before Industrial Court'
  }
]

export const INDUSTRIAL_COURT = {
  location: 'Industrial Court, Banjul',
  jurisdiction: 'Employment disputes, unfair dismissal, severance',
  filingFee: 'D100',
  statutoryDeadline: 30,
  discretionaryDeadline: 90
}

export const CLAIM_TYPES = [
  { type: 'unfairDismissal', label: 'Unfair Dismissal', deadline: '30 days statutory' },
  { type: 'wrongfulDismissal', label: 'Wrongful Dismissal', deadline: '30 days' },
  { type: 'redundancy', label: 'Severance/Redundancy', deadline: '30 days' },
  { type: 'discrimination', label: 'Discrimination', deadline: '60 days' },
  { type: 'unpaidWages', label: 'Unpaid Wages', deadline: '2 years backpay' },
  { type: 'harassment', label: 'Harassment', deadline: '30 days' }
]