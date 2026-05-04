export interface Cooperative {
  id: string;
  name: string;
  acronym?: string;
  type: "federation" | "farmers" | "women" | "youth" | "financial" | "fishing" | "transport" | "consumer";
  sector: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  website?: string;
  phone?: string;
  email?: string;
  yearEstablished?: number;
  memberCount?: string;
  description: string;
  services: string[];
  membershipRequirements: string;
  internationalAffiliations: string[];
}

export const COOPERATIVES: Cooperative[] = [
  // ── APEX / FEDERATION ────────────────────────────────────────────────────
  {
    id: "gncf",
    name: "Gambia National Cooperative Federation",
    acronym: "GNCF",
    type: "federation",
    sector: "Apex — all cooperative sectors",
    address: "Kanifing, Kanifing Municipality",
    region: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    phone: "+220 4374200",
    email: "gncf@gambianet.gm",
    yearEstablished: 1960,
    memberCount: "500+ primary cooperatives, 80,000+ individual members",
    description: "The apex body for all cooperative societies in The Gambia, established under the Cooperative Societies Act. Coordinates national cooperative policy, provides training, and represents cooperative interests with government and international partners. Historically rooted in the groundnut trade, now diversified across agriculture, women's groups, and financial cooperatives.",
    services: [
      "Cooperative registration facilitation", "Member education & training",
      "Audit & financial compliance support", "Bulk input procurement",
      "Market linkage facilitation", "Government policy advocacy",
      "International cooperative partnerships", "Cooperative development loans",
    ],
    membershipRequirements: "Primary cooperatives (10+ founding members, registered under Cooperative Societies Act). Annual affiliation fee. Submission of audited accounts.",
    internationalAffiliations: [
      "International Cooperative Alliance (ICA)",
      "ECOWAS Cooperative Union",
      "African Cooperative Alliance (ACA)",
      "ILO Cooperative Unit — COOP",
    ],
  },

  // ── FARMERS COOPERATIVES ─────────────────────────────────────────────────
  {
    id: "gcgu",
    name: "Gambia Cooperative & Groundnut Union",
    acronym: "GCGU",
    type: "farmers",
    sector: "Groundnut & Agriculture",
    address: "Banjul, Capital City",
    region: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    phone: "+220 4228300",
    yearEstablished: 1958,
    memberCount: "25,000+ groundnut farmers",
    description: "The oldest and largest agricultural cooperative in The Gambia, historically linked to the groundnut export trade. Now evolving to support diversified crop marketing, collective bargaining for farm-gate prices, and input supply. Coordinates seasonal groundnut purchases across all seven regions through a network of village-level cooperatives.",
    services: [
      "Collective groundnut marketing", "Input supply (seeds, fertiliser)",
      "Farm-gate price negotiation", "Storage silo access",
      "Transport coordination to processing plants",
      "Crop loans & advance payments", "Quality grading training",
    ],
    membershipRequirements: "Smallholder groundnut farmer. Annual membership fee GMD 200. Registration through village cooperative society.",
    internationalAffiliations: [
      "ICA — Agricultural Cooperatives Section",
      "West Africa Groundnut Coalition",
      "ECOWAS Agricultural Marketing Cooperative",
    ],
  },
  {
    id: "nafico",
    name: "National Farmers Inputs & Credit Organisation",
    acronym: "NAFICO",
    type: "farmers",
    sector: "Agricultural Inputs & Credit",
    address: "Brikama, West Coast Region",
    region: "West Coast",
    lat: 13.2780,
    lng: -16.6510,
    website: "https://www.nafico.gov.gm",
    phone: "+220 4484300",
    yearEstablished: 1981,
    memberCount: "30,000+ farmer members",
    description: "Government-backed cooperative providing subsidised agricultural inputs (certified seeds, fertilisers, pesticides) and seasonal credit to smallholder farmers. Operates through district depots and village supply points. Partnered with NARI for improved seed varieties and with the Central Bank for farmer credit schemes.",
    services: [
      "Subsidised certified seed supply", "Fertiliser & pesticide supply",
      "Seasonal crop credit (6–9 months)", "Farm mechanisation hire",
      "Irrigation equipment access", "Post-harvest handling tools",
      "Agribusiness advisory services",
    ],
    membershipRequirements: "Registered smallholder farmer with landholding or lease. Annual membership GMD 300. Land certificate or village head letter required.",
    internationalAffiliations: [
      "AGRA (Alliance for a Green Revolution in Africa)",
      "CORAF/WECARD West Africa Inputs Network",
      "FAO West Africa Farmer Organisation Platform",
    ],
  },
  {
    id: "rice-coop-central",
    name: "Central River Rice Farmers Cooperative Society",
    acronym: "CRRFCS",
    type: "farmers",
    sector: "Rice & Flood-Recession Agriculture",
    address: "Georgetown (Janjanbureh), Central River Region",
    region: "Central River",
    lat: 13.5241,
    lng: -14.7680,
    yearEstablished: 1975,
    memberCount: "5,000+ rice farmers",
    description: "Cooperative managing collective rice cultivation across the tidal floodplains of the Central River Region — the most productive rice-growing area of The Gambia. Coordinates group irrigation schemes, shared threshing and milling machinery, and collective rice marketing. Partners with NARI on ISRIZ-7 salt-tolerant rice varieties.",
    services: [
      "Collective irrigation scheme management", "Shared thresher & mill hire",
      "Rice seed bank (ISRIZ-7, mangrove rice)",
      "Group marketing to Gambia Produce Marketing Board",
      "Women rice group technical support",
      "Flood recession farming coordination",
    ],
    membershipRequirements: "Rice farmer in Central River Region. Annual membership GMD 250. Plot registration in cooperative irrigation scheme required.",
    internationalAffiliations: [
      "West Africa Rice Development Association (WARDA/AfricaRice)",
      "ICA Agricultural Section",
    ],
  },
  {
    id: "horticulture-coop",
    name: "Gambia Horticultural Cooperative Society",
    acronym: "GHCS",
    type: "farmers",
    sector: "Horticulture & Vegetable Export",
    address: "Yundum, West Coast Region",
    region: "West Coast",
    lat: 13.3300,
    lng: -16.6450,
    phone: "+220 4484450",
    yearEstablished: 1986,
    memberCount: "2,500 horticulture farmers",
    description: "Collective for vegetable and fruit farmers supplying local markets, hotels/restaurants, and increasingly the EU export market (via Banjul airport cargo). Manages a cold chain facility at Yundum and coordinates phytosanitary certification. Key partnership with GIEPA for export readiness training.",
    services: [
      "Cold chain storage at Yundum", "EU phytosanitary certification support",
      "Hotel & resort supply contracts", "Export logistics coordination",
      "Irrigation water user group management", "Pest & disease scouting",
      "Market price information service",
    ],
    membershipRequirements: "Horticultural farmer with at least 0.5 hectare under production. Annual membership GMD 400. Phytosanitary good agricultural practices training required.",
    internationalAffiliations: [
      "COLEACP (Europe–Africa–Caribbean–Pacific Horticulture Network)",
      "GlobalG.A.P. affiliate group",
    ],
  },

  // ── WOMEN'S COOPERATIVES ─────────────────────────────────────────────────
  {
    id: "nawfa",
    name: "National Women Farmers Association",
    acronym: "NAWFA",
    type: "women",
    sector: "Women in Agriculture",
    address: "Banjul, Capital City",
    region: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    phone: "+220 4201205",
    yearEstablished: 1987,
    memberCount: "20,000+ women farmers",
    description: "The apex association for women farmers across The Gambia. Advocates for women's land rights, access to inputs and credit, and participation in agricultural policy. Coordinates women's kafo (traditional communal work group) networks and market garden cooperatives. Close partner of the Women's Bureau and FAO.",
    services: [
      "Women's land rights advocacy", "Input credit for women's groups",
      "Market garden technical training", "Kafo group registration & support",
      "Women's economic empowerment training",
      "Gender-responsive agricultural policy advocacy",
      "Micro-finance linkages",
    ],
    membershipRequirements: "Women farmer or women's farming group (kafo). Annual membership GMD 150. No land ownership requirement — tenant farmers welcome.",
    internationalAffiliations: [
      "ECOWAS Women Farmers Network",
      "FAO — Women in Agrifood Systems",
      "African Women in Agriculture, Research & Development (AWARD)",
    ],
  },
  {
    id: "women-fish-processors",
    name: "National Association of Women Fish Processors",
    acronym: "NAWFP",
    type: "women",
    sector: "Fisheries — Post-Harvest",
    address: "Tanji Fishing Village, West Coast Region",
    region: "West Coast",
    lat: 13.3716,
    lng: -16.7483,
    yearEstablished: 1993,
    memberCount: "3,500 women",
    description: "Collective for women who smoke, dry, and process fish at landing sites from Tanji to Gunjur. Controls a significant part of the domestic fish marketing chain. Campaigns for improved smoking ovens, clean processing facilities, and fair access to beach landing areas. Also runs savings groups (osusus) for capital accumulation.",
    services: [
      "Improved smoking oven access", "Bulk fish purchase arrangements",
      "Processing facility lobbying", "Osusu savings group coordination",
      "Market stall access facilitation", "Hygiene & food safety training",
    ],
    membershipRequirements: "Woman fish processor at any landing site. Annual fee GMD 100. Active processing operation required.",
    internationalAffiliations: [
      "African Fishworkers Forum — Women's Section",
      "FAO WIFIP (Women in Fisheries Programme)",
    ],
  },

  // ── YOUTH COOPERATIVES ───────────────────────────────────────────────────
  {
    id: "gyca",
    name: "Gambia Youth Cooperative & Agribusiness Association",
    acronym: "GYCAA",
    type: "youth",
    sector: "Youth Agribusiness & Enterprise",
    address: "Serrekunda, Kanifing Municipality",
    region: "Kanifing",
    lat: 13.4388,
    lng: -16.6716,
    yearEstablished: 2005,
    memberCount: "8,000+ youth members (18–35)",
    description: "Youth-led cooperative focused on reversing rural-urban youth migration by making farming and agribusiness economically viable for young people. Runs incubator farms, links youth to GIEPA export programmes, and provides mentorship from experienced agripreneurs. Key partner of MOTIE for youth employment initiatives.",
    services: [
      "Incubator farm access (subsidised land lease)", "Agribusiness startup training",
      "Youth-to-youth mentorship programme", "GIEPA export pathway support",
      "Cooperative group savings schemes", "Equipment hire at reduced rates",
      "Market linkages & buyer connections",
    ],
    membershipRequirements: "Youth aged 18–35. Annual membership GMD 200. Commitment to farming or agribusiness project required.",
    internationalAffiliations: [
      "African Youth Agripreneurs Forum",
      "ECOWAS Youth Agricultural Platform",
      "IFAD Rural Youth Cooperative Network",
    ],
  },

  // ── FINANCIAL COOPERATIVES ───────────────────────────────────────────────
  {
    id: "gaccu",
    name: "Gambia Cooperative Credit Union",
    acronym: "GACCU",
    type: "financial",
    sector: "Financial Services — Savings & Credit",
    address: "Kanifing, Kanifing Municipality",
    region: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    phone: "+220 4374350",
    yearEstablished: 1977,
    memberCount: "15,000+ depositors across 40+ credit unions",
    description: "The apex cooperative credit union federating community-based savings and credit cooperatives (SACCOs) across The Gambia. Provides supervised savings, low-interest loans, and financial literacy to rural and peri-urban communities underserved by commercial banks. An important financial inclusion tool for farmers, market traders, and informal workers.",
    services: [
      "Savings accounts (member dividends)", "Low-interest loans (collateral-light)",
      "Business startup loans", "Agricultural seasonal credit",
      "School fees & medical emergency loans",
      "Mobile money integration", "Financial literacy training",
    ],
    membershipRequirements: "Any adult Gambian. Minimum monthly savings GMD 100. Membership share purchase GMD 500 (one-time). No formal employment required.",
    internationalAffiliations: [
      "World Council of Credit Unions (WOCCU)",
      "African Confederation of Cooperative Savings & Credit Associations (ACCOSCA)",
    ],
  },
];

export function getCooperativesByType(type: Cooperative["type"]): Cooperative[] {
  return COOPERATIVES.filter(c => c.type === type);
}

export function getCooperativesByRegion(region: string): Cooperative[] {
  const q = region.toLowerCase();
  return COOPERATIVES.filter(c => c.region.toLowerCase().includes(q));
}

export function searchCooperatives(query: string): Cooperative[] {
  const q = query.toLowerCase();
  return COOPERATIVES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.acronym ?? "").toLowerCase().includes(q) ||
    c.sector.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.services.some(s => s.toLowerCase().includes(q))
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
