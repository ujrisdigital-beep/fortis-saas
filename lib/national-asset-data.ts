// Platform-wide impact metrics for government/partner presentations
// In production these would be fetched from the database

export const PLATFORM_STATS = {
  totalCases: 247,
  successRate: 78,
  regionsActive: 5,
  avgResolutionDays: 14,
  traditionalAvgDays: 60,
  costToUser: 29, // GBP
  traditionalLegalCost: { min: 500, max: 2000 }, // GBP
  totalUsers: 1840,
  documentsGenerated: 312,
  lastUpdated: '2026-04-19',
}

export const PARTNERSHIP_TIERS = [
  {
    tier: 1,
    name: 'Recognition',
    cost: 'No funding required',
    items: [
      'Formal letter recognising Fortis OS as national digital asset',
      'Permission to display Ministry co-branding on platform',
      'Referral pathway from government websites',
      'Annual impact report to Ministry',
    ],
  },
  {
    tier: 2,
    name: 'Integration',
    cost: 'Technical partnership',
    items: [
      'API integration with courts and tribunals',
      'Anonymised data sharing agreement',
      'Joint public awareness campaigns',
      'Priority escalation pathway for citizens',
      'Government staff training programme',
    ],
  },
  {
    tier: 3,
    name: 'Co-Funding (PPP)',
    cost: 'Co-investment',
    items: [
      'Government co-investment for national scaling',
      'Integration with legal aid budget system',
      'Long-term PPP agreement (5-year)',
      'Dedicated government portal',
      'National rollout across all 7 regions',
      'Real-time Ministry dashboard access',
    ],
  },
]

export const MINISTRY_CONTACTS = [
  { ministry: 'Ministry of Justice', email: 'info@moj.gov.gm', relevance: 'Access to Justice, Legal Aid' },
  { ministry: 'Ministry of ICT', email: 'info@moict.gov.gm', relevance: 'Digital Infrastructure, DE4A' },
  { ministry: 'Ministry of Finance', email: 'info@mof.gov.gm', relevance: 'PPP Framework, Co-funding' },
  { ministry: 'Ministry of Trade', email: 'info@motie.gov.gm', relevance: 'GIEPA, Business Licensing' },
]
