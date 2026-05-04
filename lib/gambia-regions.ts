export const GAMBIA_REGIONS = [
  { id: 'banjul',       name: 'Banjul',        population: 31000,  color: '#C4943A', lga: 'Banjul City Council' },
  { id: 'kanifing',     name: 'Kanifing',      population: 382000, color: '#1B4D3E', lga: 'Kanifing Municipal Council' },
  { id: 'brikama',      name: 'Brikama (WCR)', population: 710000, color: '#0e7490', lga: 'West Coast Region' },
  { id: 'kerewan',      name: 'Kerewan (NBR)', population: 294000, color: '#7c3aed', lga: 'North Bank Region' },
  { id: 'mansakonko',   name: 'Mansakonko (LRR)', population: 83000, color: '#be185d', lga: 'Lower River Region' },
  { id: 'janjangbureh', name: 'Janjangbureh (CRR)', population: 200000, color: '#0A2E1A', lga: 'Central River Region' },
  { id: 'basse',        name: 'Basse (URR)',   population: 260000, color: '#92400e', lga: 'Upper River Region' },
]

export const CASE_TYPES = [
  'Employment Dispute',
  'Benefit Appeal',
  'Land Dispute',
  'Debt Claim',
  'Consumer Rights',
  'Business Licensing',
  'Agricultural Subsidy',
  'Other',
]

export const NDP_PRIORITIES = [
  {
    ref: '3.2',
    title: 'Access to Justice & Legal Empowerment',
    desc: 'Fortis OS provides affordable appeal generation and evidence organisation for all Gambians — reducing average resolution time from 60+ days to 14 days.',
    sdg: 'SDG 16.3',
  },
  {
    ref: '4.1',
    title: 'Digital Transformation of Public Services',
    desc: 'First justice-sector digital public infrastructure in The Gambia. Open APIs enable integration with courts, tribunals, and government agencies.',
    sdg: 'SDG 9.c',
  },
  {
    ref: '5.3',
    title: 'Youth Employment & Entrepreneurship',
    desc: 'Built by Gambian talent. Creates tech jobs and legal-tech entrepreneurship pathways. Training hub provides free digital skills certifications.',
    sdg: 'SDG 8.6',
  },
  {
    ref: '6.1',
    title: 'Governance, Transparency & Accountability',
    desc: 'Anonymised case dashboards give government officials real-time visibility into access-to-justice metrics without exposing personal data.',
    sdg: 'SDG 16.6',
  },
]

export const DEVELOPMENT_PARTNERS = [
  { name: 'World Bank', logo: '🌍', focus: 'Digital Economy for Africa (DE4A)', status: 'Engaged', color: '#1B4D3E' },
  { name: 'UNDP', logo: '🇺🇳', focus: 'Access to Justice · SDG 16', status: 'Proposal Submitted', color: '#0e7490' },
  { name: 'European Union', logo: '🇪🇺', focus: 'Rule of Law · Digital Transformation', status: 'Exploring', color: '#1e40af' },
  { name: 'FCDO (UK)', logo: '🇬🇧', focus: 'Governance & Anti-Corruption', status: 'Initial Dialogue', color: '#7c3aed' },
  { name: 'USAID', logo: '🇺🇸', focus: 'Democracy, Rights & Governance', status: 'Monitoring', color: '#be185d' },
]
