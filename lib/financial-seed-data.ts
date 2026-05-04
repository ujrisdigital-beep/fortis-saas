export interface FinancialInstitution {
  name: string
  category: 'bank' | 'microfinance' | 'forex' | 'mobile_money_agent' | 'insurance' | 'savings_coop' | 'susu_group' | 'money_collector' | 'credit_union'
  sub_category?: string
  address: string
  latitude: number
  longitude: number
  phone: string
  whatsapp?: string
  website?: string
  services: string[]
  operating_hours?: string
  region?: string
}

export const BANKS: FinancialInstitution[] = [
  {
    name: 'Trust Bank Gambia Ltd',
    category: 'bank',
    address: 'Trust Bank House, 1 Ecowas Avenue, Banjul',
    latitude: 13.4549,
    longitude: -16.5775,
    phone: '+220 422 8570',
    website: 'https://trustbankgambia.com',
    services: ['loans', 'savings', 'forex', 'remittance', 'investment'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM, Sat: 9:00 AM - 1:00 PM'
  },
  {
    name: 'Ecobank Gambia',
    category: 'bank',
    address: 'Ecobank House, 48 Kairaba Avenue, Banjul',
    latitude: 13.4528,
    longitude: -16.5789,
    phone: '+220 422 1575',
    website: 'https://ecobank.com/gm',
    services: ['loans', 'savings', 'forex', 'remittance', 'mobile_money'],
    operating_hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
  },
  {
    name: 'GTBank Gambia',
    category: 'bank',
    address: 'GTBank House, 18 Kairaba Avenue, Banjul',
    latitude: 13.4532,
    longitude: -16.5723,
    phone: '+220 449 5000',
    website: 'https://gtbank.gm',
    services: ['loans', 'savings', 'forex', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Standard Chartered Bank Gambia',
    category: 'bank',
    address: '8 Ecowas Avenue, Banjul',
    latitude: 13.4555,
    longitude: -16.5768,
    phone: '+220 422 7611',
    website: 'https://sc.com/gm',
    services: ['loans', 'savings', 'forex', 'investment', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Access Bank Gambia',
    category: 'bank',
    address: 'Access Bank Building, 9 Kairaba Avenue, Banjul',
    latitude: 13.4535,
    longitude: -16.5742,
    phone: '+220 449 8300',
    website: 'https://accessbank.gm',
    services: ['loans', 'savings', 'forex', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'FirstBank Gambia',
    category: 'bank',
    address: 'FirstBank House, 56 Kairaba Avenue, Banjul',
    latitude: 13.4520,
    longitude: -16.5812,
    phone: '+220 422 8800',
    website: 'https://firstbank.gm',
    services: ['loans', 'savings', 'forex', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Bank PHB Gambia',
    category: 'bank',
    address: 'Bank PHB Building, 15 Ecowas Avenue, Banjul',
    latitude: 13.4542,
    longitude: -16.5781,
    phone: '+220 422 6644',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'CBA Gambia',
    category: 'bank',
    address: 'CBA House, 10 Liberation Avenue, Banjul',
    latitude: 13.4558,
    longitude: -16.5755,
    phone: '+220 422 9900',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Vista Bank Gambia',
    category: 'bank',
    address: 'Vista Bank Building, 22 Kairaba Avenue, Banjul',
    latitude: 13.4525,
    longitude: -16.5799,
    phone: '+220 449 7000',
    website: 'https://vistabank.gm',
    services: ['loans', 'savings', 'forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Central Bank of The Gambia',
    category: 'bank',
    address: '1 Ecowas Avenue, Banjul',
    latitude: 13.4550,
    longitude: -16.5770,
    phone: '+220 422 7731',
    website: 'https://cbg.gm',
    services: ['regulation', 'treasury', 'investment'],
    operating_hours: 'Mon-Fri: 8:00 AM - 4:00 PM'
  },
  {
    name: 'Agib Bank Gambia',
    category: 'bank',
    address: 'Agib Bank Building, Banjul',
    latitude: 13.4545,
    longitude: -16.5775,
    phone: '+220 422 8800',
    services: ['loans', 'savings', 'islamic_banking'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Zenith Bank Gambia',
    category: 'bank',
    address: 'Zenith Bank House, Kairaba Avenue, Banjul',
    latitude: 13.4535,
    longitude: -16.5780,
    phone: '+220 449 7200',
    services: ['loans', 'savings', 'forex', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  }
]

export const MICROFINANCE: FinancialInstitution[] = [
  {
    name: 'BRAC Gambia Microfinance',
    category: 'microfinance',
    address: 'BRAC House, Bertil Harding Highway, Kanifing',
    latitude: 13.4500,
    longitude: -16.6800,
    phone: '+220 449 6000',
    website: 'https://brac.net/gambia',
    services: ['loans', 'savings', 'microfinance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Reliance Financial Services',
    category: 'microfinance',
    address: 'Reliance House, 45 Kairaba Avenue, Banjul',
    latitude: 13.4522,
    longitude: -16.5799,
    phone: '+220 449 5200',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'LaaM Financial Services',
    category: 'microfinance',
    address: 'LaaM Building, 12 Garba Jahumpa Road, Banjul',
    latitude: 13.4515,
    longitude: -16.5745,
    phone: '+220 422 8855',
    services: ['loans', 'savings', 'microfinance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'CashPlus Financial Solutions',
    category: 'microfinance',
    address: 'CashPlus House, 28 Kairaba Avenue, Banjul',
    latitude: 13.4528,
    longitude: -16.5805,
    phone: '+220 449 5555',
    services: ['loans', 'remittance'],
    operating_hours: 'Mon-Fri: 8:00 AM - 6:00 PM'
  },
  {
    name: 'Vision Finance Gambia',
    category: 'microfinance',
    address: 'Vision House, 8 Dobson Street, Banjul',
    latitude: 13.4535,
    longitude: -16.5730,
    phone: '+220 422 9900',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Unity Microfinance',
    category: 'microfinance',
    address: 'Unity Building, Serrekunda Market Road, Serrekunda',
    latitude: 13.4400,
    longitude: -16.6750,
    phone: '+220 437 8000',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Future Finances Gambia',
    category: 'microfinance',
    address: 'Future House, 55 Kairaba Avenue, Banjul',
    latitude: 13.4525,
    longitude: -16.5820,
    phone: '+220 449 6300',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  }
]

export const FOREX_BUREAUX: FinancialInstitution[] = [
  {
    name: 'Africell Forex Bureau',
    category: 'forex',
    address: 'Africell Building, 15 Kairaba Avenue, Banjul',
    latitude: 13.4530,
    longitude: -16.5750,
    phone: '+220 449 5100',
    services: ['forex', 'remittance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Trust Forex Bureau',
    category: 'forex',
    address: 'Trust Bank House Ground Floor, Banjul',
    latitude: 13.4549,
    longitude: -16.5775,
    phone: '+220 422 8570',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Ecobank Forex',
    category: 'forex',
    address: 'Ecobank House, 48 Kairaba Avenue, Banjul',
    latitude: 13.4528,
    longitude: -16.5789,
    phone: '+220 422 1575',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Jules Forex Bureau',
    category: 'forex',
    address: '25 Kairaba Avenue, Banjul',
    latitude: 13.4532,
    longitude: -16.5772,
    phone: '+220 449 6800',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Samba Forex Bureau',
    category: 'forex',
    address: 'Serrekunda Market, Serrekunda',
    latitude: 13.4385,
    longitude: -16.6780,
    phone: '+220 437 2000',
    services: ['forex'],
    operating_hours: 'Mon-Sat: 8:00 AM - 6:00 PM'
  },
  {
    name: 'City Forex Bureau',
    category: 'forex',
    address: '62 Kairaba Avenue, Banjul',
    latitude: 13.4520,
    longitude: -16.5830,
    phone: '+220 449 7500',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Banjul Forex Limited',
    category: 'forex',
    address: '10 Liberation Avenue, Banjul',
    latitude: 13.4555,
    longitude: -16.5750,
    phone: '+220 422 8800',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'West Africa Forex Bureau',
    category: 'forex',
    address: '45 Kairaba Avenue, Banjul',
    latitude: 13.4528,
    longitude: -16.5800,
    phone: '+220 449 5200',
    services: ['forex'],
    operating_hours: 'Mon-Fri: 8:30 AM - 5:00 PM'
  },
  {
    name: 'Dawda Forex Bureau',
    category: 'forex',
    address: 'Banjul Ferry Terminal, Banjul',
    latitude: 13.4570,
    longitude: -16.5730,
    phone: '+220 422 6000',
    services: ['forex'],
    operating_hours: 'Mon-Sun: 7:00 AM - 7:00 PM'
  }
]

export const MOBILE_MONEY_AGENTS: FinancialInstitution[] = [
  {
    name: 'QCell Money Agent - Banjul Main',
    category: 'mobile_money_agent',
    sub_category: 'QCell',
    address: 'QCell Headquarters, 30 Kairaba Avenue, Banjul',
    latitude: 13.4525,
    longitude: -16.5790,
    phone: '+220 449 9000',
    whatsapp: '+220 449 9000',
    services: ['mobile_money', 'remittance'],
    operating_hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    region: 'Banjul'
  },
  {
    name: 'Africell Money Agent - Kairaba',
    category: 'mobile_money_agent',
    sub_category: 'Africell',
    address: 'Africell HQ, 15 Kairaba Avenue, Banjul',
    latitude: 13.4530,
    longitude: -16.5755,
    phone: '+220 449 5100',
    services: ['mobile_money', 'remittance'],
    operating_hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    region: 'Banjul'
  },
  {
    name: 'Gamcel Money Agent - Serrekunda',
    category: 'mobile_money_agent',
    sub_category: 'Gamcel',
    address: 'Gamcel Building, Serrekunda',
    latitude: 13.4400,
    longitude: -16.6770,
    phone: '+220 437 7000',
    services: ['mobile_money'],
    operating_hours: 'Mon-Sun: 8:00 AM - 6:00 PM',
    region: 'Kanifing'
  },
  {
    name: 'QCell Money - Westfield',
    category: 'mobile_money_agent',
    sub_category: 'QCell',
    address: 'Westfield Junction, Bakau',
    latitude: 13.4780,
    longitude: -16.6650,
    phone: '+220 449 9000',
    services: ['mobile_money', 'remittance'],
    operating_hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    region: 'Kanifing'
  },
  {
    name: 'Africell Money - Brusubi',
    category: 'mobile_money_agent',
    sub_category: 'Africell',
    address: 'Brusubi Turntable, Brusubi',
    latitude: 13.3900,
    longitude: -16.7200,
    phone: '+220 449 5100',
    services: ['mobile_money'],
    operating_hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    region: 'Brikama'
  }
]

export const INSURANCE_COMPANIES: FinancialInstitution[] = [
  {
    name: 'Gambia National Insurance Company (GNIC)',
    category: 'insurance',
    address: 'GNIC Building, 12 Ecowas Avenue, Banjul',
    latitude: 13.4545,
    longitude: -16.5765,
    phone: '+220 422 7289',
    website: 'https://gambianationalinsurance.gm',
    services: ['insurance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Allianz Gambia Insurance',
    category: 'insurance',
    address: 'Allianz House, 25 Kairaba Avenue, Banjul',
    latitude: 13.4530,
    longitude: -16.5780,
    phone: '+220 449 6100',
    website: 'https://allianz.gm',
    services: ['insurance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Prudential Insurance Gambia',
    category: 'insurance',
    address: 'Prudential House, 40 Kairaba Avenue, Banjul',
    latitude: 13.4525,
    longitude: -16.5805,
    phone: '+220 449 6300',
    services: ['insurance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Social Security and Housing Finance Corporation',
    category: 'insurance',
    address: '78 Kairaba Avenue, Banjul',
    latitude: 13.4522,
    longitude: -16.5810,
    phone: '+220 449 6400',
    services: ['pension', 'housing', 'insurance'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  }
]

export const CREDIT_UNIONS: FinancialInstitution[] = [
  {
    name: 'NACCUG - National Association of Cooperative Credit Unions',
    category: 'credit_union',
    address: 'NACCUG Building, Kanifing',
    latitude: 13.4490,
    longitude: -16.6810,
    phone: '+220 439 5000',
    services: ['credit_union', 'loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'GTUCCU - Gambia Teachers Union Cooperative Credit Union',
    category: 'credit_union',
    address: 'GTUCCU Building, Kanifing',
    latitude: 13.4550,
    longitude: -16.6820,
    phone: '+220 439 6000',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Police Cooperative Credit Union',
    category: 'credit_union',
    address: 'Police Headquarters, Banjul',
    latitude: 13.4560,
    longitude: -16.5740,
    phone: '+220 422 8811',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Navy Cooperative Credit Union',
    category: 'credit_union',
    address: 'Navy Headquarters, Banjul',
    latitude: 13.4570,
    longitude: -16.5720,
    phone: '+220 422 8822',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  },
  {
    name: 'Civil Servants Cooperative',
    category: 'credit_union',
    address: 'Civil Service Building, Banjul',
    latitude: 13.4538,
    longitude: -16.5760,
    phone: '+220 422 8833',
    services: ['loans', 'savings'],
    operating_hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
  }
]

export const ALL_FINANCIAL_INSTITUTIONS: FinancialInstitution[] = [
  ...BANKS,
  ...MICROFINANCE,
  ...FOREX_BUREAUX,
  ...MOBILE_MONEY_AGENTS,
  ...INSURANCE_COMPANIES,
  ...CREDIT_UNIONS
]

export const CATEGORY_CONFIG = {
  bank: { color: '#D4AF37', icon: '🏦', label: 'Bank' },
  microfinance: { color: '#10B981', icon: '💰', label: 'Microfinance' },
  forex: { color: '#3B82F6', icon: '💱', label: 'Forex Bureau' },
  mobile_money_agent: { color: '#8B5CF6', icon: '📱', label: 'Mobile Money' },
  insurance: { color: '#EF4444', icon: '🛡️', label: 'Insurance' },
  credit_union: { color: '#F59E0B', icon: '🤝', label: 'Credit Union' },
 奶SU_GROUP: { color: '#EC4899', icon: '👥', label: 'Susu Group' },
  money_collector: { color: '#14B8A6', icon: '🏪', label: 'Money Collector' }
} as const

export const FORMAL_INSTITUTIONS_COUNT = {
  banks: BANKS.length,
  microfinance: MICROFINANCE.length,
  forex: FOREX_BUREAUX.length,
  mobile_money: MOBILE_MONEY_AGENTS.length,
  insurance: INSURANCE_COMPANIES.length,
  credit_unions: CREDIT_UNIONS.length
}

export const TOTAL_FORMAL = Object.values(FORMAL_INSTITUTIONS_COUNT).reduce((a, b) => a + b, 0)