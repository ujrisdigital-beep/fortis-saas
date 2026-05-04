export interface GovernmentAgency {
  id: string;
  name: string;
  acronym: string;
  type: "ministry" | "regulatory_body" | "parastatal" | "revenue_authority" | "security" | "judiciary" | "independent_body";
  mandate: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  website?: string;
  phone?: string;
  email?: string;
  minister?: string;
  description: string;
  keyFunctions: string[];
  servicesForPublic: string[];
}

export const GOVERNMENT_AGENCIES: GovernmentAgency[] = [
  // ── MINISTRIES ───────────────────────────────────────────────────────────
  {
    id: "moj",
    name: "Ministry of Justice",
    acronym: "MoJ",
    type: "ministry",
    mandate: "Legal governance, law reform, prosecution services, public defenders",
    address: "Marina Parade, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.moj.gov.gm",
    phone: "+220 4201144",
    email: "info@moj.gov.gm",
    description: "The Ministry responsible for the administration of justice, law reform, prosecution of criminal cases, and legal advice to government. Houses the Director of Public Prosecutions (DPP), the Law Reform Commission, and the National Agency Against Trafficking in Persons. Oversees the legal aid programme and court administration.",
    keyFunctions: [
      "Criminal prosecution (DPP)", "Law reform & legislation drafting",
      "Public defender / legal aid", "International legal cooperation",
      "Anti-trafficking in persons (NATIP)", "Treaty negotiation & ratification",
      "Court administration oversight",
    ],
    servicesForPublic: [
      "Legal aid application", "Criminal record checks (for employment)",
      "Notary services", "Powers of attorney", "Affidavit witnessing",
    ],
  },
  {
    id: "motie",
    name: "Ministry of Trade, Industry, Regional Integration & Employment",
    acronym: "MOTIE",
    type: "ministry",
    mandate: "Trade policy, industrial development, investment promotion, employment",
    address: "Independence Drive, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    website: "https://www.motie.gov.gm",
    phone: "+220 4228858",
    description: "Coordinates national trade, industry, and investment policy. Oversees GIEPA, the Gambia Investment & Export Promotion Agency. Responsible for AfCFTA implementation, consumer protection, and employment creation programmes. Key ministry for private sector development and economic diversification.",
    keyFunctions: [
      "Trade policy & WTO representation", "Industrial licensing",
      "GIEPA oversight", "Consumer protection", "AfCFTA implementation",
      "Employment policy & labour market monitoring",
      "Regional integration (ECOWAS, AU)",
    ],
    servicesForPublic: [
      "Business registration (via OBRT)", "Import/export licence",
      "Consumer complaints", "Investment incentive applications",
      "Trade certificate of origin",
    ],
  },
  {
    id: "moa",
    name: "Ministry of Agriculture",
    acronym: "MoA",
    type: "ministry",
    mandate: "Agricultural policy, food security, land use, fisheries",
    address: "The Quadrangle, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5789,
    website: "https://www.moa.gov.gm",
    phone: "+220 4227039",
    description: "Responsible for agriculture, livestock, fisheries, and food security policy. Oversees NARI (research), NAFICO (inputs), the Gambia Livestock Marketing Agency, and coastal fisheries management. A central ministry given that ~70% of the population depends on agriculture for livelihood.",
    keyFunctions: [
      "National food security strategy", "NARI & NAFICO oversight",
      "Land use & soil conservation", "Livestock health & production",
      "Fisheries licensing & management", "Agricultural extension services",
      "Climate-smart agriculture programme",
    ],
    servicesForPublic: [
      "Agricultural extension visits", "Seed & fertiliser subsidy programme",
      "Livestock vaccination campaigns", "Fishing licence applications",
      "Land use permit (agricultural)",
    ],
  },
  {
    id: "moh",
    name: "Ministry of Health",
    acronym: "MoH",
    type: "ministry",
    mandate: "Public health, healthcare delivery, health regulation",
    address: "The Quadrangle, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    website: "https://www.moh.gov.gm",
    phone: "+220 4228832",
    description: "Responsible for the national health system including 7 regional health teams, hospitals, health centres, and community health workers. Oversees health regulation, national disease surveillance, pharmaceutical regulation, and health worker training. Works closely with WHO, UNICEF, and USAID on disease prevention programmes.",
    keyFunctions: [
      "National health policy", "Hospital & health centre management",
      "Disease surveillance (national immunisation)", "Pharmaceutical regulation",
      "Health worker training & deployment", "Mental health programme",
      "EFSTH (national teaching hospital) oversight",
    ],
    servicesForPublic: [
      "Health facility finder", "Immunisation schedule",
      "Birth certificate registration (via CHWs)", "HIV/TB testing referral",
      "Maternal health services",
    ],
  },
  {
    id: "mofe",
    name: "Ministry of Finance & Economic Affairs",
    acronym: "MoFEA",
    type: "ministry",
    mandate: "National budget, fiscal policy, public debt, economic planning",
    address: "The Quadrangle, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5789,
    website: "https://www.mofea.gov.gm",
    phone: "+220 4228291",
    description: "Manages the national budget, fiscal policy, public debt, and economic planning. Oversees GRA (revenue collection), GBOS (statistics), the Central Bank of The Gambia, and the National Development Plan implementation. Key ministry for IMF/World Bank programme coordination.",
    keyFunctions: [
      "National budget preparation & execution", "Public debt management",
      "GRA & GBOS oversight", "NDP implementation monitoring",
      "IMF/World Bank programme management", "Investment & development financing",
    ],
    servicesForPublic: [
      "Budget documents (public access)", "Treasury single account queries",
      "Development partner grant coordination",
    ],
  },

  // ── REGULATORY BODIES ────────────────────────────────────────────────────
  {
    id: "pura",
    name: "Public Utilities Regulatory Authority",
    acronym: "PURA",
    type: "regulatory_body",
    mandate: "Regulate electricity, water, telecommunications, and postal services",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    website: "https://www.pura.gov.gm",
    phone: "+220 4204690",
    email: "info@pura.gov.gm",
    description: "Independent regulator for utilities and telecommunications in The Gambia. Sets tariffs for NAWEC electricity and water, licenses telecom operators (Africell, QCell, Gamcel), and manages frequency spectrum. Investigates consumer complaints against utility providers and ensures service quality standards.",
    keyFunctions: [
      "Electricity & water tariff setting", "Telecom operator licensing",
      "Frequency spectrum management", "Postal services regulation",
      "Consumer complaint investigation", "Market competition oversight",
      "Quality of service monitoring",
    ],
    servicesForPublic: [
      "Utility bill complaint registration", "Telecom consumer dispute",
      "Frequency licence application", "ISP licence queries",
    ],
  },
  {
    id: "naqaa",
    name: "National Accreditation & Quality Assurance Authority",
    acronym: "NAQAA",
    type: "regulatory_body",
    mandate: "Regulate, accredit, and quality-assure education and training institutions",
    address: "Bertil Harding Highway, Kanifing",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.naqaa.gm",
    phone: "+220 4374880",
    description: "The statutory body responsible for quality assurance and accreditation of all educational institutions in The Gambia from basic through tertiary level. Develops national qualification frameworks, accredits programmes and institutions, and works with ECOWAS to harmonise West African qualifications. Sets standards for TVET and higher education.",
    keyFunctions: [
      "Institution & programme accreditation", "National Qualifications Framework (NQF)",
      "Educational standards setting", "TVET quality assurance",
      "Qualification recognition (domestic & foreign)", "Institutional audit & inspection",
    ],
    servicesForPublic: [
      "Qualification verification", "Institution accreditation status check",
      "Foreign qualification recognition", "Appeals on accreditation decisions",
    ],
  },
  {
    id: "mca-pharma",
    name: "Medicines Control Agency",
    acronym: "MCA",
    type: "regulatory_body",
    mandate: "Regulate medicines, vaccines, medical devices for safety, efficacy, quality",
    address: "Kairaba Avenue, Serrekunda",
    area: "Serrekunda",
    lat: 13.4388,
    lng: -16.6716,
    phone: "+220 4396200",
    description: "Responsible for the regulation of pharmaceutical products, medical devices, and herbal medicines in The Gambia. Licenses pharmacies, wholesale medicine distributors, and pharmaceutical manufacturers. Combats counterfeit medicines — a major public health concern. Works with WHO and NAFDAC (Nigeria) on post-market surveillance.",
    keyFunctions: [
      "Medicine product registration", "Pharmacy & distributor licensing",
      "Counterfeit medicine detection", "Post-market surveillance",
      "Adverse drug reaction monitoring", "Herbal medicine regulation",
      "Import permit for pharmaceuticals",
    ],
    servicesForPublic: [
      "Report a counterfeit medicine", "Check medicine registration status",
      "Pharmacy licence verification", "Import permit application",
    ],
  },
  {
    id: "gfsc",
    name: "Gambia Financial Services Commission",
    acronym: "GFSC",
    type: "regulatory_body",
    mandate: "Regulate non-bank financial institutions, insurance, capital markets",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.gfsc.gov.gm",
    phone: "+220 4201500",
    description: "Regulates insurance companies, microfinance institutions, capital markets, pension funds, and other non-bank financial entities. Protects consumers of financial services. Works alongside the Central Bank of The Gambia which supervises banks and mobile money operators.",
    keyFunctions: [
      "Insurance company licensing & supervision", "Microfinance regulation",
      "Pension fund oversight", "Capital market development",
      "Anti-money laundering (AML) enforcement", "Consumer financial protection",
    ],
    servicesForPublic: [
      "Insurance company complaint", "Microfinance institution lookup",
      "Licence verification for financial firms",
    ],
  },

  // ── PARASTATALS ──────────────────────────────────────────────────────────
  {
    id: "nawec",
    name: "National Water & Electricity Company",
    acronym: "NAWEC",
    type: "parastatal",
    mandate: "Electricity generation, transmission, distribution; piped water supply",
    address: "53 Mamadi Maniyang Highway, Banjul",
    area: "Banjul",
    lat: 13.4538,
    lng: -16.5849,
    website: "https://www.nawec.gm",
    phone: "+220 4374050",
    email: "info@nawec.gm",
    description: "The national utility company responsible for electricity and water supply across The Gambia. Operates power plants at Kotu and Brikama, a national grid, and water treatment & distribution networks. Currently transitioning to include solar and renewable energy sources under the NREP programme.",
    keyFunctions: [
      "Electricity generation & distribution", "Piped water supply",
      "Renewable energy development (solar)", "Infrastructure maintenance",
      "New connection management", "Meter reading & billing",
    ],
    servicesForPublic: [
      "New electricity/water connection", "Bill payment & account queries",
      "Power cut reporting", "Meter dispute resolution", "Street light fault reporting",
    ],
  },
  {
    id: "gpa",
    name: "Gambia Ports Authority",
    acronym: "GPA",
    type: "parastatal",
    mandate: "Manage Port of Banjul and all ferry services; regulate maritime transport",
    address: "Liberation Avenue, Banjul",
    area: "Banjul",
    lat: 13.4606,
    lng: -16.5817,
    website: "https://www.gambiaports.gm",
    phone: "+220 4227266",
    email: "info@gambiaports.gm",
    description: "State-owned enterprise managing the Port of Banjul (the country's only deep-water port) and the national ferry services across the River Gambia. Provides port services to international shipping, manages container handling, and operates the Banjul–Barra vehicle ferry. Critical to The Gambia's trade competitiveness.",
    keyFunctions: [
      "Port operations & cargo handling", "Ferry services management",
      "Maritime safety regulation", "Pilotage & towage services",
      "Container terminal operation", "Bonded warehouse management",
      "Port security (ISPS Code)",
    ],
    servicesForPublic: [
      "Ferry ticket purchase", "Cargo tracking", "Shipping agent registration",
      "Port user fees", "Vessel registration",
    ],
  },
  {
    id: "gcaa",
    name: "Gambia Civil Aviation Authority",
    acronym: "GCAA",
    type: "parastatal",
    mandate: "Regulate civil aviation; operate Banjul International Airport",
    address: "Banjul International Airport, Yundum",
    area: "Yundum",
    lat: 13.3380,
    lng: -16.6522,
    website: "https://www.gcaa.aero",
    phone: "+220 4473600",
    description: "The civil aviation regulatory authority responsible for aviation safety oversight, airport management at Banjul International Airport, and air navigation services. Licenses airlines, aircraft, and aviation personnel. Responsible for The Gambia's compliance with ICAO standards and bilateral air service agreements.",
    keyFunctions: [
      "Aviation safety regulation", "Airport operations (BIA)",
      "Air navigation services (ATC)", "Aircraft & airline licensing",
      "Bilateral air service agreements", "ICAO standards compliance",
      "Accident investigation coordination",
    ],
    servicesForPublic: [
      "Pilot licence application", "Aircraft registration",
      "Drone flying permit", "Airport parking & facilities",
    ],
  },
  {
    id: "giepa",
    name: "Gambia Investment & Export Promotion Agency",
    acronym: "GIEPA",
    type: "parastatal",
    mandate: "Attract foreign investment; promote Gambian exports",
    address: "Kairaba Avenue, Kanifing",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.giepa.gm",
    phone: "+220 4378082",
    email: "info@giepa.gm",
    description: "The national investment promotion and export facilitation agency. Provides one-stop-shop services for foreign investors, facilitates business registration, and promotes Gambian exports in international markets. Manages special economic zones and industrial parks. Key partner for AfCFTA implementation.",
    keyFunctions: [
      "Foreign direct investment attraction", "Export development & promotion",
      "Investment incentive administration", "One-stop-shop for investors",
      "SME export readiness programme", "Special economic zone management",
    ],
    servicesForPublic: [
      "Business investment consultation", "Export certificate issuance",
      "Investment incentive application", "TVET employer partnership",
      "Market research reports",
    ],
  },
  {
    id: "gra",
    name: "Gambia Revenue Authority",
    acronym: "GRA",
    type: "revenue_authority",
    mandate: "Collect all government taxes, customs duties, and non-tax revenues",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.gra.gov.gm",
    phone: "+220 4229501",
    email: "info@gra.gov.gm",
    description: "The unified revenue collection authority collecting income tax, VAT, corporate tax, import/export duties, and excise duties. Manages customs at all border posts including Banjul International Airport, Port of Banjul, and land borders. Post-2017 has significantly digitalised compliance and expanded the tax base.",
    keyFunctions: [
      "Income tax administration", "VAT collection & returns",
      "Customs & excise management", "TIN (Tax Identification Number) issuance",
      "Tax audit & investigation", "Anti-smuggling operations",
      "Revenue statistics",
    ],
    servicesForPublic: [
      "TIN registration", "Tax return filing", "Import duty calculation",
      "Customs declaration", "Tax clearance certificate",
      "Penalty appeal", "Duty exemption application",
    ],
  },
  {
    id: "nea",
    name: "National Environment Agency",
    acronym: "NEA",
    type: "regulatory_body",
    mandate: "Environmental regulation, EIA, climate change, biodiversity protection",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    website: "https://www.nea.gov.gm",
    phone: "+220 4377994",
    description: "The national environmental regulatory authority. Conducts Environmental Impact Assessments (EIAs) for development projects, enforces environmental legislation, manages national parks, and coordinates The Gambia's climate change adaptation and mitigation programmes. Reports to the National Assembly on the state of the environment.",
    keyFunctions: [
      "Environmental Impact Assessment (EIA)", "National parks management",
      "Climate change policy coordination", "Pollution control & enforcement",
      "Biodiversity conservation", "Chemicals & hazardous waste regulation",
      "UNFCCC & CBD compliance (national focal point)",
    ],
    servicesForPublic: [
      "EIA application", "Environmental compliance certificate",
      "Pollution complaint reporting", "National park entry permits",
    ],
  },
  {
    id: "girav",
    name: "Gambia Investment & Real Estate Agency",
    acronym: "GIRAV",
    type: "parastatal",
    mandate: "Investment promotion, real estate development, land administration",
    address: "Kairaba Avenue, Opposite Fajara Police Station",
    area: "Fajara",
    lat: 13.4525,
    lng: -16.6790,
    website: "https://giragm.com",
    phone: "+220 449 5515",
    email: "info@giragm.com",
    description: "Government agency responsible for investment promotion, real estate development, and land administration in The Gambia. Promotes The Gambia as an investment destination, facilitates business registration for investors, manages state-owned land, and oversees real estate development projects.",
    keyFunctions: [
      "Investment promotion & facilitation", "Business relocation assistance",
      "Land acquisition & administration", "Real estate development oversight",
      "Investment incentive processing", "Property title registration",
    ],
    servicesForPublic: [
      "Investment inquiry & facilitation", "Land lease applications",
      "Property title verification", "Investment incentive applications",
    ],
  },
  {
    id: "nari",
    name: "National Agricultural Research Institute",
    acronym: "NARI",
    type: "parastatal",
    mandate: "Agricultural research, technology development, seed systems",
    address: "Yundum, West Coast Region",
    area: "Yundum",
    lat: 13.3300,
    lng: -16.6450,
    website: "https://www.nari.gm",
    phone: "+220 4484416",
    email: "nari@nari.gm",
    description: "The Gambia's national agricultural research centre. Develops improved crop varieties (including ISRIZ salt-tolerant rice series), sustainable farming systems, and post-harvest technologies. Partners with CORAF/WECARD, AfricaRice, CGIAR, and international research institutions. Key resource for climate-smart agriculture.",
    keyFunctions: [
      "Crop variety development (ISRIZ rice, groundnut)", "Soil fertility research",
      "Pest & disease management research", "Post-harvest technology",
      "Fisheries & aquaculture research", "On-farm trials & extension support",
    ],
    servicesForPublic: [
      "Seed certification & supply", "On-farm trial hosting",
      "Agricultural technology demonstration", "Graduate research placement",
    ],
  },
  {
    id: "gbos",
    name: "Gambia Bureau of Statistics",
    acronym: "GBoS",
    type: "independent_body",
    mandate: "Produce, disseminate, and safeguard official national statistics",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.gbos.gov.gm",
    phone: "+220 4375028",
    description: "The national statistics office responsible for The Gambia's official data including the Population & Housing Census, GDP & national accounts, inflation (CPI), agricultural surveys, and health surveys (GDHS). An independent body that provides the evidence base for government policy, donor programmes, and research.",
    keyFunctions: [
      "Population & Housing Census", "GDP & national accounts",
      "Consumer Price Index (CPI)", "Gambia Demographic & Health Survey (GDHS)",
      "Agricultural surveys", "Labour force survey",
      "International statistical standards compliance",
    ],
    servicesForPublic: [
      "Data download portal", "Statistical reports & publications",
      "Custom data requests (fee-based)", "Research partnership",
    ],
  },
];

export function getAgenciesByType(type: GovernmentAgency["type"]): GovernmentAgency[] {
  return GOVERNMENT_AGENCIES.filter(a => a.type === type);
}

export function searchAgencies(query: string): GovernmentAgency[] {
  const q = query.toLowerCase();
  return GOVERNMENT_AGENCIES.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.acronym.toLowerCase().includes(q) ||
    a.mandate.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.keyFunctions.some(f => f.toLowerCase().includes(q)) ||
    a.servicesForPublic.some(s => s.toLowerCase().includes(q))
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
