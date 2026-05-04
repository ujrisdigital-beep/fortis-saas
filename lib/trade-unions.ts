export interface TradeUnion {
  id: string;
  name: string;
  acronym: string;
  type: "general_union" | "sector_union" | "federation" | "professional_union";
  sector: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  website?: string;
  phone?: string;
  email?: string;
  yearEstablished?: number;
  memberCount?: string;
  description: string;
  benefits: string[];
  membershipRequirements: string;
  internationalAffiliations: string[];
}

export const TRADE_UNIONS: TradeUnion[] = [
  {
    id: "gtuc",
    name: "Gambia Trades Union Congress",
    acronym: "GTUC",
    type: "federation",
    sector: "All sectors — apex federation",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    phone: "+220 4201177",
    yearEstablished: 1958,
    memberCount: "30,000+ workers across all affiliated unions",
    description: "The apex trade union federation coordinating all registered trade unions in The Gambia. Represents workers' interests in national wage negotiations, labour law reform, and social protection policy. The primary voice of organised labour in tripartite dialogue with government and employer associations.",
    benefits: [
      "Collective bargaining representation", "Legal aid for labour disputes",
      "Wage negotiation support", "Social protection advocacy",
      "Occupational health & safety guidance", "Union capacity building training",
      "Emergency welfare assistance",
    ],
    membershipRequirements: "Individual workers join sector-specific affiliated unions. Unions apply to GTUC for affiliation. Annual affiliation fees based on membership size.",
    internationalAffiliations: [
      "International Trade Union Confederation (ITUC)",
      "Organisation of African Trade Union Unity (OATUU)",
      "ECOWAS Social Partners Forum",
      "ILO — Worker delegate representation",
    ],
  },
  {
    id: "gtu",
    name: "Gambia Teachers Union",
    acronym: "GTU",
    type: "sector_union",
    sector: "Education",
    address: "Serrekunda, Kanifing Municipality",
    area: "Serrekunda",
    lat: 13.4388,
    lng: -16.6716,
    phone: "+220 4395118",
    email: "gtu@gambianet.gm",
    yearEstablished: 1958,
    memberCount: "15,000+ teachers nationwide",
    description: "The largest and oldest trade union in The Gambia, representing teachers at all levels from primary through tertiary education. A powerful force in Gambian civil society that has successfully advocated for improved teacher salaries, housing allowances, and professional development. Active participant in national education policy reform.",
    benefits: [
      "Collective salary bargaining", "Housing allowance advocacy",
      "Professional development training", "Teacher welfare benevolent fund",
      "Legal representation in employment disputes", "Sick leave & hardship support",
      "Retirement planning guidance", "School transfer arbitration",
    ],
    membershipRequirements: "Practising teacher in any registered Gambian school (public or private). Monthly subscription deducted from salary (approx GMD 50–100/month). Application to branch school representative.",
    internationalAffiliations: [
      "Education International (EI)",
      "Africa Union of Teachers (AUT)",
      "Commonwealth Teachers Group",
      "ECOWAS Teachers Federation",
    ],
  },
  {
    id: "gfwtwu",
    name: "Gambia Fishermen & Water Transport Workers Union",
    acronym: "GFWTWU",
    type: "sector_union",
    sector: "Fisheries & Maritime",
    address: "Banjul Fishing Harbour, Banjul",
    area: "Banjul",
    lat: 13.4538,
    lng: -16.5849,
    phone: "+220 4228500",
    yearEstablished: 1965,
    memberCount: "8,000+ fishermen, fish processors, and transport workers",
    description: "Trade union representing artisanal fishermen, pirogue operators, fish smokers and processors, and river transport workers across all seven regions. Has been at the forefront of campaigns against industrial overfishing licences, protecting the livelihoods of coastal communities. Also advocates for safety standards on river transport.",
    benefits: [
      "Fishing rights & quota advocacy", "Safety at sea training & certification",
      "Emergency assistance fund (accidents, illness)", "Fish price negotiation support",
      "Boat insurance facilitation", "Legal aid for licensing disputes",
      "Equipment cooperative purchasing", "Women fish processors support",
    ],
    membershipRequirements: "Active artisanal fisherman, pirogue operator, fish processor, or river transport worker. Monthly subscription (GMD 30–50). Registration at nearest landing site branch.",
    internationalAffiliations: [
      "International Transport Workers Federation (ITF)",
      "African Fishworkers Forum",
      "ECOWAS Fisheries & Maritime Workers Coalition",
    ],
  },
  {
    id: "ggwu",
    name: "Gambia General Workers Union",
    acronym: "GGWU",
    type: "general_union",
    sector: "General / Multi-sector",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    phone: "+220 4374100",
    yearEstablished: 1959,
    memberCount: "12,000+ workers",
    description: "A general union covering workers in manufacturing, construction, retail, hospitality, and other sectors not covered by specialist unions. Key advocate for minimum wage increases, occupational safety standards, and informal sector worker protections. Important during the post-2017 period of labour law reform.",
    benefits: [
      "Minimum wage advocacy", "Safety inspection rights",
      "Unfair dismissal representation", "Sick pay & leave entitlements",
      "Workplace harassment support", "Grievance procedures",
      "Industrial action coordination",
    ],
    membershipRequirements: "Worker 18+ in any sector. Monthly subscription GMD 40–80 based on earnings. Application through workplace shop steward or head office.",
    internationalAffiliations: [
      "International Union of Food, Agricultural, Hotel, Restaurant, Catering, Tobacco and Allied Workers (IUF)",
      "OATUU — General Workers Section",
      "ITUC",
    ],
  },
  {
    id: "gnurhw",
    name: "Gambia National Union of Restaurant, Hotel & Catering Workers",
    acronym: "GNURHCW",
    type: "sector_union",
    sector: "Hospitality & Tourism",
    address: "Senegambia Strip, Kololi, Kanifing",
    area: "Kololi",
    lat: 13.4328,
    lng: -16.7259,
    yearEstablished: 1975,
    memberCount: "4,500+ workers",
    description: "Represents hotel, restaurant, tourism, and catering workers along The Gambia's tourist coast and nationally. Negotiates seasonal employment contracts, tips sharing arrangements, and health & safety in the tourism industry. Critical during tourist season (Oct–Apr) for protecting short-term contract workers.",
    benefits: [
      "Seasonal contract negotiation", "Tips & service charge rights",
      "Health & safety in hospitality", "End-of-season bonus negotiation",
      "Retraining during off-season", "Welfare support in disputes",
    ],
    membershipRequirements: "Worker in hotels, restaurants, bars, lodges, or catering services. Monthly subscription GMD 35–70. Application via hotel branch representative.",
    internationalAffiliations: [
      "IUF (International Union of Food Workers) — Hospitality Section",
      "Africa Tourism & Hospitality Workers Alliance",
    ],
  },
  {
    id: "gnucw",
    name: "Gambia National Union of Construction Workers",
    acronym: "GNUCW",
    type: "sector_union",
    sector: "Construction & Infrastructure",
    address: "Brikama, West Coast Region",
    area: "Brikama",
    lat: 13.2780,
    lng: -16.6510,
    yearEstablished: 1972,
    memberCount: "6,000+ workers",
    description: "Union for construction workers including masons, carpenters, electricians, plumbers, and general labourers. Particularly active during major infrastructure projects (Chinese-funded roads, new airport terminal, government buildings). Advocates for formal employment contracts on large-scale projects instead of casual daily labour.",
    benefits: [
      "Formal contract advocacy on projects", "Site safety enforcement",
      "Daily rate negotiation", "Accident compensation claims",
      "Skills upgrade training", "Tool insurance scheme",
    ],
    membershipRequirements: "Construction worker — skilled or unskilled. Monthly subscription GMD 30–60. Proof of trade or working on a registered construction site.",
    internationalAffiliations: [
      "Building and Wood Workers International (BWI)",
      "OATUU — Construction Workers Section",
    ],
  },
  {
    id: "gawu",
    name: "Gambia Agricultural Workers Union",
    acronym: "GAWU",
    type: "sector_union",
    sector: "Agriculture & Rural Labour",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    yearEstablished: 1963,
    memberCount: "9,000+ members",
    description: "Represents farm workers, groundnut cooperative labourers, agribusiness employees, and rural agricultural workers. Historically linked to the groundnut sector — the backbone of The Gambia's export economy. Advocates for fair farm gate prices, seasonal worker protections, and access to agricultural credit.",
    benefits: [
      "Groundnut price negotiation", "Seasonal worker contract rights",
      "Agricultural credit access facilitation", "Farm safety standards",
      "Rural welfare fund", "Women farmers support",
      "Climate adaptation training",
    ],
    membershipRequirements: "Agricultural worker, farm labourer, or cooperative member. Annual subscription GMD 200–500. Membership registration through regional agricultural office.",
    internationalAffiliations: [
      "IUF — Agricultural Workers Section",
      "ECOWAS Agricultural Workers Federation",
      "African Farmers Union (ROPPA)",
    ],
  },
  {
    id: "gnucs",
    name: "Gambia National Union of Civil Servants",
    acronym: "GNUCS",
    type: "professional_union",
    sector: "Public Sector / Civil Service",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5789,
    phone: "+220 4201190",
    yearEstablished: 1968,
    memberCount: "18,000+ civil servants",
    description: "The union for public sector employees across all government ministries, departments, and agencies. One of the most influential unions in The Gambia due to the size of the civil service. Conducts salary surveys, negotiates public service pay scales, and represents civil servants in disciplinary hearings. Post-2017 has been active in pension reform advocacy.",
    benefits: [
      "Pay scale negotiation", "Pension & retirement advocacy",
      "Disciplinary hearing representation", "Transfer dispute arbitration",
      "Study leave support", "Public service housing campaign",
      "Performance appraisal fairness monitoring",
    ],
    membershipRequirements: "Confirmed civil servant in any grade. Monthly deduction from salary (GMD 50–100). Automatic membership upon employment confirmation.",
    internationalAffiliations: [
      "Public Services International (PSI)",
      "Commonwealth Trade Union Group — Public Service",
      "OATUU — Civil Servants Section",
    ],
  },
];

export function getUnionsByType(type: TradeUnion["type"]): TradeUnion[] {
  return TRADE_UNIONS.filter(u => u.type === type);
}

export function getUnionsBySector(sector: string): TradeUnion[] {
  const q = sector.toLowerCase();
  return TRADE_UNIONS.filter(u => u.sector.toLowerCase().includes(q));
}

export function searchUnions(query: string): TradeUnion[] {
  const q = query.toLowerCase();
  return TRADE_UNIONS.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.acronym.toLowerCase().includes(q) ||
    u.sector.toLowerCase().includes(q) ||
    u.description.toLowerCase().includes(q) ||
    u.benefits.some(b => b.toLowerCase().includes(q))
  );
}

export function getStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z/data=!3m1!1e3`;
}

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir//${lat},${lng}`;
}

export function getMapEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}
