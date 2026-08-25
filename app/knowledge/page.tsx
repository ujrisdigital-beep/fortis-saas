"use client";
// app/knowledge/page.tsx
// FORTIS OS — Knowledge Hub: Business guides, sector intel, compliance, platform tutorials
import { useState, useMemo } from "react";

const PRIMARY  = "#1B4D3E";
const GOLD     = "#D4AF37";
const TEXT     = "#0A1C2E";
const BG       = "#F8F9FA";
const WHITE    = "#FFFFFF";
const BORDER   = "#E2E8F0";
const MUTED    = "#6B7280";

// ─── Article data ──────────────────────────────────────────────────────────────
interface Article {
  id: string;
  title: string;
  summary: string;
  category: Category;
  tags: string[];
  readTime: number; // minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
  content: Section[];
}

interface Section {
  heading?: string;
  body: string;
  list?: string[];
  callout?: { type: "info" | "warning" | "tip"; text: string };
  table?: { headers: string[]; rows: string[][] };
}

type Category =
  | "Business Setup"
  | "Sectors"
  | "Compliance & Legal"
  | "Finance"
  | "Platform Guides"
  | "Digital Tools";

const CATEGORIES: Category[] = [
  "Business Setup",
  "Sectors",
  "Compliance & Legal",
  "Finance",
  "Platform Guides",
  "Digital Tools",
];

const CAT_ICONS: Record<Category, string> = {
  "Business Setup":    "🏢",
  "Sectors":           "🌍",
  "Compliance & Legal":"⚖️",
  "Finance":           "💰",
  "Platform Guides":   "🖥️",
  "Digital Tools":     "🛠️",
};

const CAT_COLORS: Record<Category, string> = {
  "Business Setup":    "#3B82F6",
  "Sectors":           "#10B981",
  "Compliance & Legal":"#8B5CF6",
  "Finance":           "#F59E0B",
  "Platform Guides":   "#1B4D3E",
  "Digital Tools":     "#EF4444",
};

const ARTICLES: Article[] = [
  // ── BUSINESS SETUP ──────────────────────────────────────────────────────────
  {
    id: "biz-register-gambia",
    title: "How to Register a Business in Gambia",
    summary: "Step-by-step guide to registering your company with GIEPA, the Registrar General, and the Gambia Revenue Authority.",
    category: "Business Setup",
    tags: ["GIEPA", "Registration", "Legal", "Startup"],
    readTime: 8,
    difficulty: "Beginner",
    featured: true,
    content: [
      {
        heading: "Overview",
        body: "Starting a business in The Gambia requires registration with several government bodies. The process has been streamlined through the Gambia Investment and Export Promotion Agency (GIEPA), which now offers a one-stop-shop for investors and entrepreneurs.",
      },
      {
        heading: "Step 1: Choose Your Business Structure",
        body: "The Gambia recognises four main business structures:",
        list: [
          "Sole Proprietorship — simplest form, owner is personally liable",
          "Partnership — two or more persons, shared liability",
          "Private Limited Company (Ltd) — separate legal entity, limited liability, minimum 2 shareholders",
          "Public Limited Company (PLC) — for larger enterprises planning public fundraising",
        ],
        callout: { type: "tip", text: "Most SMEs and startups register as a Private Limited Company. It offers liability protection and is more credible to investors and banks." },
      },
      {
        heading: "Step 2: Reserve Your Company Name",
        body: "Submit a name reservation form to the Registrar General's Department (RGD) at the Ministry of Justice. The RGD will confirm whether your proposed name is available within 3–5 working days. Cost: D100–D250.",
      },
      {
        heading: "Step 3: Prepare Incorporation Documents",
        body: "You will need:",
        list: [
          "Memorandum of Association (MOA) — company objectives and structure",
          "Articles of Association (AOA) — internal governance rules",
          "Form A1 — notice of registered office address",
          "Form A2 — details of first directors and secretary",
          "Statutory Declaration of compliance",
          "Passport copies and proof of address for all directors",
        ],
      },
      {
        heading: "Step 4: Register with the Registrar General",
        body: "Submit all documents to the RGD. A Certificate of Incorporation will be issued within 5–10 working days. Registration fees are based on authorised share capital.",
        table: {
          headers: ["Share Capital", "Registration Fee"],
          rows: [
            ["Up to D500,000", "D1,500"],
            ["D500,001 – D1,000,000", "D2,500"],
            ["D1,000,001 – D5,000,000", "D5,000"],
            ["Above D5,000,000", "D10,000"],
          ],
        },
      },
      {
        heading: "Step 5: Obtain a Tax Identification Number (TIN)",
        body: "Register with the Gambia Revenue Authority (GRA) to obtain a TIN. This is mandatory for all businesses and required to open a business bank account. The GRA office is located in Banjul and regional offices are in all major towns. Registration is free.",
        callout: { type: "info", text: "As of 2024, GRA offers online TIN registration at gra.gm. The process takes 1–3 working days." },
      },
      {
        heading: "Step 6: Register with GIEPA (for investors)",
        body: "Foreign investors and businesses seeking investment incentives must register with GIEPA. Benefits include tax holidays (up to 5 years), import duty exemptions on capital equipment, and work permit facilitation for key staff.",
      },
      {
        heading: "Step 7: Sector-Specific Licences",
        body: "Depending on your sector, additional licences may be required:",
        list: [
          "Financial services: Central Bank of Gambia (CBG) licence",
          "Food & beverage: Gambia Standards Authority (TGSB) certification",
          "Health services: Ministry of Health registration",
          "Tourism: Gambia Tourism Authority (GTA) classification",
          "Telecommunications: Public Utilities Regulatory Authority (PURA) licence",
          "Media: Gambia Press Union / PURA broadcast licence",
        ],
      },
      {
        heading: "Timeline Summary",
        body: "From start to finish, a typical company registration takes 3–6 weeks.",
        callout: { type: "tip", text: "FORTIS OS UJU Cycle tool includes a Digitise phase that guides you through setting up business systems once incorporated. Use it to build your operational foundation." },
      },
    ],
  },
  {
    id: "biz-entities-comparison",
    title: "Sole Trader vs Ltd vs PLC: Which Structure Is Right for You?",
    summary: "A practical comparison of the three main business entities in The Gambia to help you choose the right legal structure.",
    category: "Business Setup",
    tags: ["Structure", "Legal", "Decision"],
    readTime: 5,
    difficulty: "Beginner",
    content: [
      {
        heading: "The Three Main Structures",
        body: "Choosing the right business entity affects your tax obligations, personal liability, ability to raise funding, and operational complexity. Here is a direct comparison.",
        table: {
          headers: ["Factor", "Sole Proprietorship", "Private Ltd (Ltd)", "Public Ltd (PLC)"],
          rows: [
            ["Personal liability", "Unlimited", "Limited", "Limited"],
            ["Minimum shareholders", "1 (owner)", "2", "7"],
            ["Minimum directors", "1", "2", "3"],
            ["Registration cost", "~D500", "~D1,500–5,000", "~D10,000+"],
            ["Can raise equity", "No", "Yes (private)", "Yes (public)"],
            ["Audit required", "No", "No (under D5m)", "Yes"],
            ["Annual returns", "No", "Yes", "Yes"],
            ["Bank credibility", "Low", "High", "Very High"],
          ],
        },
      },
      {
        heading: "When to Choose Sole Proprietorship",
        body: "Choose this if you are a freelancer, consultant, or running a low-risk small trade. Setup is fast and cheap. However, your personal assets are at risk if the business has debts or is sued.",
        callout: { type: "warning", text: "Sole proprietors cannot issue shares, bring in equity investors, or easily separate personal and business finances. This can cap your growth ceiling." },
      },
      {
        heading: "When to Choose Private Limited Company",
        body: "This is the recommended structure for most growing businesses. Your personal assets are protected, you can bring in partners as shareholders, and you are more credible to banks, clients, and grant bodies like GIEPA.",
      },
      {
        heading: "When to Choose PLC",
        body: "Only relevant when you intend to list on a stock exchange or raise capital from the general public. Given The Gambia's current market size, most businesses should start as a Private Ltd and convert later if needed.",
      },
    ],
  },
  {
    id: "employer-obligations",
    title: "Employer Obligations in The Gambia",
    summary: "What every employer must know: employment contracts, SSHFC contributions, leave entitlements, and the Labour Act.",
    category: "Business Setup",
    tags: ["HR", "Labour", "Compliance", "SSHFC"],
    readTime: 7,
    difficulty: "Intermediate",
    content: [
      {
        heading: "The Labour Act 2007",
        body: "The Gambia's Labour Act 2007 governs all employment relationships. All employers must comply regardless of business size. Key provisions cover hiring, working hours, termination, leave, and dispute resolution.",
      },
      {
        heading: "Employment Contracts",
        body: "Written contracts are mandatory for all employees. Contracts must specify:",
        list: [
          "Job title and description",
          "Place of work",
          "Salary and payment frequency",
          "Working hours",
          "Leave entitlements",
          "Notice period",
          "Probation period (max 6 months)",
        ],
        callout: { type: "info", text: "Verbal contracts are legally valid in Gambia but highly inadvisable. Always document employment terms in writing." },
      },
      {
        heading: "SSHFC Contributions",
        body: "The Social Security and Housing Finance Corporation (SSHFC) requires all formal employers to register and make monthly contributions:",
        table: {
          headers: ["Contribution Type", "Employer", "Employee"],
          rows: [
            ["Social Security (NAPSSS)", "10% of gross salary", "5% of gross salary"],
            ["Industrial Injury Fund", "1% of gross salary", "0%"],
            ["Housing Fund (HFC)", "Optional", "Optional"],
          ],
        },
        callout: { type: "warning", text: "Failure to register or remit SSHFC contributions is a criminal offence. Penalties include fines and imprisonment for company directors." },
      },
      {
        heading: "Leave Entitlements",
        body: "Mandatory leave under the Labour Act:",
        list: [
          "Annual leave: 21 days per year (after 12 months of continuous service)",
          "Sick leave: Up to 90 days per year (first 30 days full pay, next 60 days half pay)",
          "Maternity leave: 12 weeks (fully paid for first 3 children)",
          "Public holidays: All gazetted national holidays (currently 14 per year)",
        ],
      },
      {
        heading: "Minimum Wage",
        body: "The national minimum wage is reviewed periodically by the Department of Labour. As of 2024, it stands at D50 per day for most sectors, though many skilled roles pay significantly above this floor.",
      },
      {
        heading: "Termination",
        body: "Termination must follow due process. Minimum notice periods: 1 week (under 1 year), 1 month (1–5 years), 3 months (over 5 years). Wrongful dismissal claims can be brought to the Department of Labour or Industrial Tribunal.",
      },
    ],
  },

  // ── SECTORS ─────────────────────────────────────────────────────────────────
  {
    id: "sector-energy",
    title: "Gambia's Energy Sector: Opportunities and Challenges",
    summary: "The energy landscape in The Gambia: NAWEC's infrastructure, solar potential, off-grid solutions, and investment opportunities.",
    category: "Sectors",
    tags: ["Energy", "Solar", "NAWEC", "Investment"],
    readTime: 7,
    difficulty: "Intermediate",
    featured: true,
    content: [
      {
        heading: "Current Landscape",
        body: "The National Water and Electricity Company (NAWEC) supplies electricity to approximately 60% of the population, primarily in urban and peri-urban areas. Rural electrification remains below 30%. The grid is heavily dependent on imported diesel, making electricity both expensive and unreliable.",
        callout: { type: "info", text: "Average power outages in The Gambia range from 6–12 hours per day in peak periods. This creates massive demand for off-grid and backup power solutions." },
      },
      {
        heading: "Solar Potential",
        body: "The Gambia receives an average of 6–7 peak sun hours per day — among the highest in West Africa. Solar irradiance averages 5.8 kWh/m²/day, making solar PV one of the most cost-effective energy sources in the country. The levelised cost of solar electricity now rivals diesel generation at scale.",
      },
      {
        heading: "Key Opportunity Areas",
        body: "Investment opportunities exist across the energy value chain:",
        list: [
          "Solar home systems — portable units for rural households (market: 200,000+ homes)",
          "Solar microgrids — community-scale generation for rural towns",
          "Commercial & industrial solar — rooftop installations for businesses",
          "Battery storage — complement intermittent generation",
          "Solar water pumping — for agriculture and community water supply",
          "Energy efficiency — LED retrofits, smart meters, building insulation",
          "Clean cooking — biogas, LPG, improved cookstoves",
        ],
      },
      {
        heading: "Regulatory Framework",
        body: "PURA (Public Utilities Regulatory Authority) regulates the energy sector. Independent Power Producers (IPPs) must obtain a generation licence from PURA. Feed-in tariffs and net metering policies are under development as of 2024.",
      },
      {
        heading: "Financing",
        body: "Key financing sources for energy projects in The Gambia include:",
        list: [
          "ECOWAS Renewable Energy Facility (EREF)",
          "African Development Bank's Sustainable Energy Fund",
          "EU-Gambia Partnership fund",
          "World Bank SREP programme",
          "GIEPA investment incentives for energy investors",
          "IFC performance standards compliance for international private equity",
        ],
      },
      {
        heading: "FORTIS OS Integration",
        body: "Use the FORTIS OS Energy Calculator at /energy to model solar savings for your business or project. The NAWEC resource hub at /resources/nawec provides region-by-region energy access data.",
      },
    ],
  },
  {
    id: "sector-agritech",
    title: "AgriTech in The Gambia: Feeding the Digital Revolution",
    summary: "How technology is transforming Gambian agriculture — from soil monitoring to commodity trading platforms.",
    category: "Sectors",
    tags: ["Agriculture", "AgriTech", "Food Security", "Technology"],
    readTime: 6,
    difficulty: "Beginner",
    content: [
      {
        heading: "Agriculture's Role in the Economy",
        body: "Agriculture contributes approximately 20–25% of GDP and employs over 70% of the rural population in The Gambia. Key crops include groundnuts (the primary export), millet, sorghum, maize, rice, and sesame. Despite this scale, agricultural productivity remains low due to lack of modern inputs, finance, and market access.",
      },
      {
        heading: "Major Challenges",
        body: "",
        list: [
          "Post-harvest losses — estimated at 30–40% for perishables",
          "Limited access to credit for smallholder farmers",
          "No real-time commodity price information for farmers",
          "Climate vulnerability — irregular rainfall, soil degradation",
          "Lack of cold chain and storage infrastructure",
          "Limited irrigation coverage — less than 8% of arable land irrigated",
        ],
      },
      {
        heading: "Key Opportunities",
        body: "",
        list: [
          "Farm management apps in local languages (Mandinka, Wolof, Fula)",
          "Drone-based crop monitoring and precision agriculture",
          "Digital commodity marketplaces connecting farmers to buyers",
          "Mobile-based weather and advisory services via SMS",
          "Off-grid cold storage using solar refrigeration",
          "Agri-finance platforms linking farmers to micro-credit",
          "Traceability solutions for export produce (EU compliance)",
        ],
        callout: { type: "tip", text: "FORTIS OS's IKENGA tool can help agricultural businesses build their social media presence to reach buyers across West Africa." },
      },
      {
        heading: "Key Bodies",
        body: "",
        list: [
          "National Agricultural Research Institute (NARI)",
          "Gambia National Farmers Platform (GNFP)",
          "Ministry of Agriculture",
          "IFAD — major agricultural finance partner",
          "FAO Gambia Country Office",
        ],
      },
    ],
  },
  {
    id: "sector-fintech",
    title: "Fintech Regulation in The Gambia: A Practical Guide",
    summary: "What fintech startups need to know about CBG licences, mobile money rules, and the MSME finance landscape.",
    category: "Sectors",
    tags: ["Fintech", "CBG", "Mobile Money", "Regulation"],
    readTime: 8,
    difficulty: "Advanced",
    content: [
      {
        heading: "The CBG's Role",
        body: "The Central Bank of The Gambia (CBG) regulates all financial services, including banks, microfinance institutions, insurance companies, and payment service providers. Any business processing or holding customer funds requires CBG authorisation.",
      },
      {
        heading: "Payment Service Provider (PSP) Licence",
        body: "Companies operating mobile money, payment gateways, or remittance platforms must obtain a PSP licence from the CBG. Requirements include:",
        list: [
          "Minimum paid-up capital of D5 million",
          "Detailed business plan and risk assessment",
          "AML/CFT (Anti-Money Laundering / Counter Financing of Terrorism) policy",
          "KYC (Know Your Customer) procedures",
          "Qualified technical infrastructure assessment",
          "Fit and proper checks on directors",
          "Escrow account arrangement for customer float",
        ],
      },
      {
        heading: "Mobile Money Landscape",
        body: "The two dominant mobile money platforms in The Gambia are Africell Money and Qmoney (Gamcel). Combined, they serve over 1 million registered accounts. CBG has issued interoperability guidelines requiring all PSPs to support cross-network transfers.",
        callout: { type: "info", text: "The CBG issued its National Fintech Policy in 2022, creating a regulatory sandbox for innovative financial products. Startups can apply to test products before full licensing." },
      },
      {
        heading: "MSME Finance Gap",
        body: "Less than 15% of SMEs in The Gambia have access to formal credit. The average bank lending rate is 22–28% per annum. This creates major opportunities for:",
        list: [
          "Invoice financing platforms",
          "Savings groups (susu) digitisation",
          "Buy-now-pay-later for productive assets",
          "Credit scoring using alternative data (mobile usage, utility payments)",
          "Peer-to-peer lending platforms",
        ],
      },
      {
        heading: "Remittance Market",
        body: "The Gambia receives remittances equivalent to approximately 25% of GDP — one of the highest ratios in the world. Diaspora in the UK, US, Sweden, and Germany send over $600 million annually. Platforms reducing the cost of remittances (current average: 8–12%) have significant addressable market.",
      },
      {
        heading: "FORTIS OS Fintech Calculator",
        body: "Use the finance readiness checklist at /fintech (not a credit score). GROW at /grow/workspace remains the paid diagnostic SKU.",
      },
    ],
  },
  {
    id: "sector-tourism",
    title: "Gambia's Tourism Sector: The Smiling Coast Opportunity",
    summary: "Tourism contributes 20%+ of GDP. Here's how to tap into the sector, from hospitality to eco-tourism to digital marketing.",
    category: "Sectors",
    tags: ["Tourism", "GTA", "Hospitality", "Digital"],
    readTime: 5,
    difficulty: "Beginner",
    content: [
      {
        heading: "The Tourism Opportunity",
        body: "The Gambia — known as 'The Smiling Coast of Africa' — welcomed 500,000+ tourists pre-COVID, primarily from the UK, Germany, Netherlands, and Scandinavia. The sector contributes approximately 20% of GDP when including indirect effects. Post-pandemic recovery and direct UK flight routes have renewed momentum.",
      },
      {
        heading: "GTA Classification Requirements",
        body: "All tourism enterprises (hotels, guesthouses, tour operators, beach bars) must register with the Gambia Tourism Authority (GTA). Classifications affect pricing permissions, marketing support, and access to government tourism development funds.",
        list: [
          "Hotels: 1–5 star classification based on facilities and service standards",
          "Guesthouses: Non-star rated, basic comfort and hygiene requirements",
          "Tour operators: Must hold GTA operator licence and guide certification",
          "Ground handlers: Airport and logistics operators require separate GTA registration",
        ],
      },
      {
        heading: "Eco-Tourism and Niche Segments",
        body: "High-growth niches within Gambian tourism:",
        list: [
          "Bird watching — The Gambia is one of Africa's top birding destinations (600+ species)",
          "Community-based tourism — village stays, cultural experiences",
          "Medical tourism — private healthcare attracting West African patients",
          "MICE (Meetings, Incentives, Conferences, Events) — conference facilities needed",
          "Sports tourism — football academies, golf, water sports",
        ],
      },
      {
        heading: "Digital Marketing for Tourism",
        body: "Most Gambian tourism businesses are not digitally visible. Opportunities include:",
        list: [
          "Google Business profiles (free, high impact for local search)",
          "TripAdvisor listing management",
          "Instagram and Facebook content for visual destinations",
          "Online booking systems (Booking.com, Expedia partnerships)",
          "Influencer partnerships with African and European travel creators",
        ],
        callout: { type: "tip", text: "FORTIS OS IKENGA tool helps tourism businesses manage content across 18 platforms simultaneously. Use the Tourism Predictor calculator at /tourism to forecast visitor volumes." },
      },
    ],
  },

  // ── COMPLIANCE & LEGAL ───────────────────────────────────────────────────────
  {
    id: "dpa-gambia-guide",
    title: "The Gambia Data Protection Act: What Businesses Must Know",
    summary: "A practical guide to complying with the Gambia Data Protection Act — data handling, consent, and the consequences of non-compliance.",
    category: "Compliance & Legal",
    tags: ["DPA", "Data Protection", "Privacy", "Compliance"],
    readTime: 9,
    difficulty: "Intermediate",
    featured: true,
    content: [
      {
        heading: "Overview of the Act",
        body: "The Gambia Data Protection Act (DPA) regulates the collection, processing, storage, and sharing of personal data. It applies to all organisations — public and private — that handle personal data of Gambian residents. The Act aligns broadly with international standards including the GDPR.",
        callout: { type: "warning", text: "Non-compliance with the DPA can result in criminal prosecution, fines, and reputational damage. Directors and senior managers can be held personally liable." },
      },
      {
        heading: "Key Definitions",
        body: "",
        list: [
          "Personal Data: Any information that can identify a living individual (name, phone, location, biometric data)",
          "Sensitive Personal Data: Health data, biometric data, financial data, political opinions, religious beliefs",
          "Data Controller: The organisation that decides how personal data is processed",
          "Data Processor: An organisation processing data on behalf of a controller",
          "Data Subject: The individual whose data is being processed",
        ],
      },
      {
        heading: "Six Lawful Bases for Processing",
        body: "You must have at least one lawful basis to process personal data:",
        list: [
          "Consent — freely given, specific, informed, and unambiguous",
          "Contract — processing is necessary to fulfil a contract",
          "Legal obligation — required by Gambian law",
          "Vital interests — protecting life",
          "Public task — exercising official authority",
          "Legitimate interests — balanced against individual rights",
        ],
      },
      {
        heading: "Rights of Data Subjects",
        body: "Individuals have the following rights which businesses must facilitate:",
        list: [
          "Right of access — to obtain copies of their personal data",
          "Right to rectification — to correct inaccurate data",
          "Right to erasure — 'right to be forgotten'",
          "Right to restrict processing",
          "Right to data portability",
          "Right to object to processing",
          "Rights related to automated decision-making",
        ],
      },
      {
        heading: "What Businesses Must Do",
        body: "",
        list: [
          "Appoint a Data Protection Officer (DPO) if processing large volumes of sensitive data",
          "Register data processing activities with the Data Protection Commissioner",
          "Maintain a Record of Processing Activities (ROPA)",
          "Implement appropriate technical and organisational security measures",
          "Conduct Data Protection Impact Assessments (DPIAs) for high-risk processing",
          "Report data breaches within 72 hours of discovery",
          "Obtain valid consent before sending marketing communications",
        ],
      },
      {
        heading: "Special Case: Court Orders and PII Access",
        body: "Law enforcement and government bodies may access personal data under a valid court order. Organisations receiving such requests must log the request, verify the order's authenticity, limit access to what is strictly necessary, and maintain an immutable audit trail.",
        callout: { type: "info", text: "FORTIS OS includes a built-in Court Order PII Access system at /admin/court-orders that implements HMAC-signed audit logs and time-limited access tokens — designed specifically for DPA compliance." },
      },
      {
        heading: "Penalties",
        body: "",
        table: {
          headers: ["Offence", "Penalty"],
          rows: [
            ["Failure to register", "Up to D500,000 fine"],
            ["Processing without lawful basis", "Up to D1,000,000 or 2 years imprisonment"],
            ["Failure to report a breach", "Up to D500,000"],
            ["Obstruction of Commissioner", "Up to D250,000 or 1 year imprisonment"],
          ],
        },
      },
    ],
  },
  {
    id: "gra-tax-guide",
    title: "Gambia Revenue Authority: Tax Obligations for Businesses",
    summary: "Corporate income tax, VAT, withholding tax, and filing deadlines — everything your business needs to stay compliant with the GRA.",
    category: "Compliance & Legal",
    tags: ["Tax", "GRA", "VAT", "Compliance"],
    readTime: 8,
    difficulty: "Intermediate",
    content: [
      {
        heading: "Key Tax Types for Businesses",
        body: "Businesses in The Gambia are subject to several taxes administered by the Gambia Revenue Authority (GRA):",
        table: {
          headers: ["Tax Type", "Rate", "Who Pays"],
          rows: [
            ["Corporate Income Tax (CIT)", "27%", "All registered companies"],
            ["VAT (Value Added Tax)", "15%", "Businesses with turnover > D1m"],
            ["Withholding Tax (WHT)", "10–15%", "Payer on dividends/interest/rent/services"],
            ["Pay As You Earn (PAYE)", "0–35%", "Employer deducts from employees"],
            ["Capital Gains Tax (CGT)", "10%", "On disposal of capital assets"],
            ["Goods & Services Tax (GST)", "15%", "Hospitality sector only"],
          ],
        },
      },
      {
        heading: "Corporate Income Tax",
        body: "CIT is charged at 27% on taxable profits. Small businesses with annual turnover below D2 million may qualify for a Turnover Tax at a flat 2% rate instead of CIT, which simplifies compliance significantly.",
        callout: { type: "tip", text: "Newly incorporated companies that register with GIEPA as investors may qualify for a CIT holiday of 3–5 years, depending on sector and investment size." },
      },
      {
        heading: "VAT Registration",
        body: "Businesses with annual taxable turnover exceeding D1 million must register for VAT. VAT returns are filed monthly by the 21st of the following month. Input VAT on business purchases can be reclaimed against output VAT collected.",
        list: [
          "Standard rate: 15%",
          "Zero-rated: exports, certain food staples, medicines",
          "Exempt: financial services, education, healthcare",
        ],
      },
      {
        heading: "PAYE Filing",
        body: "Employers must deduct PAYE from employees' salaries and remit to GRA by the 15th of each month. Annual PAYE reconciliations must be filed by 31 March of the following year. The PAYE tax bands are:",
        table: {
          headers: ["Annual Income (GMD)", "Rate"],
          rows: [
            ["0 – 18,000", "0% (personal allowance)"],
            ["18,001 – 36,000", "15%"],
            ["36,001 – 72,000", "20%"],
            ["72,001 – 120,000", "25%"],
            ["Above 120,000", "35%"],
          ],
        },
      },
      {
        heading: "Key Filing Deadlines",
        body: "",
        list: [
          "Monthly VAT return: 21st of following month",
          "Monthly PAYE: 15th of following month",
          "Quarterly CIT instalment: 15th April, July, October, January",
          "Annual CIT return: 30 June (6 months after financial year end for Dec year-end)",
          "Annual PAYE reconciliation: 31 March",
          "WHT return: 21st of following month",
        ],
        callout: { type: "warning", text: "Late filing incurs interest at 2% per month on outstanding amounts. Persistent non-compliance can result in account seizure or business closure." },
      },
    ],
  },

  // ── FINANCE ──────────────────────────────────────────────────────────────────
  {
    id: "sme-finance-gambia",
    title: "SME Financing Options in The Gambia",
    summary: "A comprehensive guide to finding capital for your Gambian business — from bank loans and grants to diaspora bonds and impact investors.",
    category: "Finance",
    tags: ["Finance", "SME", "Grants", "Investment"],
    readTime: 8,
    difficulty: "Intermediate",
    featured: true,
    content: [
      {
        heading: "The SME Finance Gap",
        body: "Over 80% of Gambian SMEs cite lack of access to finance as their primary growth constraint. Commercial bank lending rates average 22–28% per annum, and most banks require collateral worth 2–3x the loan amount. This has driven the growth of alternative financing models.",
      },
      {
        heading: "Commercial Bank Loans",
        body: "The Gambia has 16 commercial banks. The major lenders to SMEs include:",
        list: [
          "Standard Chartered Bank Gambia — SME and trade finance",
          "EcoBank Gambia — SME lending and trade finance",
          "Guaranty Trust Bank (GTB) — retail and SME",
          "Access Bank Gambia — SME focus",
          "FBN Bank Gambia",
        ],
        callout: { type: "tip", text: "To improve your loan approval chances: maintain at least 12 months of bank statements, register for VAT, have audited accounts, and use FORTIS OS Ask UJRIS to audit your business proposal for weaknesses before submitting to a bank." },
      },
      {
        heading: "Microfinance Institutions",
        body: "For businesses needing smaller amounts (D10,000 – D500,000), microfinance institutions (MFIs) offer more accessible but higher-rate credit:",
        list: [
          "GAMSAVI — savings and credit union",
          "Reliance Financial Services",
          "Gambia Microfinance Association members",
          "Village Savings and Loan Associations (VSLAs) — grassroots model",
        ],
      },
      {
        heading: "Grant Funding",
        body: "Non-repayable grants are available through several channels:",
        list: [
          "GIEPA Investment Incentives — up to 5-year tax holiday, duty waivers",
          "EU-Gambia Development Fund — agri, energy, youth employment",
          "IFAD Rural Finance — agricultural SMEs",
          "African Development Bank — infrastructure and energy projects",
          "USAID — economic growth and food security grants",
          "World Bank SME support programmes",
          "Youth Empowerment Project (YEP) — Government of Gambia",
        ],
        callout: { type: "info", text: "Use FORTIS OS Grants Engine at /funding to search available grants, check your eligibility score, and generate a professional grant application using AI." },
      },
      {
        heading: "Impact Investment",
        body: "Gambia is increasingly on the map for impact investors seeking ESG-aligned opportunities in West Africa:",
        list: [
          "Lundin Foundation — rural development focus",
          "Bamboo Capital Partners — financial inclusion",
          "Acumen Fund — energy access and agriculture",
          "Lion's Head Global Partners — financial sector",
          "AfricInvest — SME private equity",
        ],
      },
      {
        heading: "Diaspora Financing",
        body: "With remittances equal to ~25% of GDP, Gambia's diaspora is a significant untapped source of business investment. Diaspora bond structures and crowdfunding platforms (using international platforms accessible to diaspora) are emerging options. GIEPA is developing a Diaspora Investment Programme.",
      },
    ],
  },
  {
    id: "gmd-currency-guide",
    title: "Understanding the Gambian Dalasi: Exchange Rates and Monetary Policy",
    summary: "How the GMD exchange rate works, CBG monetary policy, and practical guidance for businesses transacting in multiple currencies.",
    category: "Finance",
    tags: ["GMD", "Currency", "CBG", "FX"],
    readTime: 6,
    difficulty: "Beginner",
    content: [
      {
        heading: "The Gambian Dalasi (GMD)",
        body: "The Dalasi (D or GMD) has been The Gambia's currency since 1971, replacing the Gambian pound at independence. The CBG manages monetary policy and the exchange rate regime. The Dalasi is a managed float — it trades against major currencies but the CBG intervenes to limit volatility.",
      },
      {
        heading: "Current Exchange Rate Context",
        body: "The GMD has experienced significant depreciation against major currencies over the past decade. Key exchange rate relationships as of 2024:",
        table: {
          headers: ["Currency", "Approx Rate (GMD)", "Notes"],
          rows: [
            ["1 USD", "~D65–68", "Fluctuates daily"],
            ["1 GBP", "~D82–86", "Major diaspora currency"],
            ["1 EUR", "~D72–76", "EU trade partner"],
            ["1 CFA Franc", "~D0.10–0.12", "Senegal border trade"],
          ],
        },
        callout: { type: "info", text: "FORTIS OS includes a live currency converter at /marketplace/currency-exchange. Always check live rates before quoting international contracts." },
      },
      {
        heading: "For Businesses: Managing FX Risk",
        body: "Businesses operating in multiple currencies face foreign exchange risk. Practical management strategies:",
        list: [
          "Invoice in USD or GBP where possible for exports — stronger currencies protect revenue",
          "Match currency of revenue and expenses where possible (natural hedge)",
          "Open a foreign currency account at a Gambian commercial bank",
          "Use forward contracts through EcoBank or Standard Chartered for large FX transactions",
          "Price imported goods with a depreciation buffer of 5–10%",
          "Review and update USD/GMD pricing quarterly",
        ],
      },
      {
        heading: "CBG Monetary Policy",
        body: "The CBG's Monetary Policy Committee (MPC) meets quarterly to set the Monetary Policy Rate (MPR), which influences commercial bank lending rates. Key tools include:",
        list: [
          "MPR — the benchmark rate (currently 16%)",
          "Reserve requirements — banks must hold 14% of deposits at CBG",
          "Open market operations — CBG treasury bills and bonds",
          "Foreign exchange interventions — USD sales/purchases to stabilise GMD",
        ],
      },
    ],
  },

  // ── PLATFORM GUIDES ───────────────────────────────────────────────────────────
  {
    id: "guide-uju-cycle",
    title: "How to Use the UJU Cycle: Business Transformation in 4 Phases",
    summary: "A complete walkthrough of the UJU Cycle AI tool — Digitise, Optimise, Scale, and Dominate phases explained with real examples.",
    category: "Platform Guides",
    tags: ["UJU Cycle", "AI", "Tutorial", "Business"],
    readTime: 6,
    difficulty: "Beginner",
    featured: true,
    content: [
      {
        heading: "What Is the UJU Cycle?",
        body: "The UJU Cycle is an AI-powered business transformation framework developed by UJU GROUP LIMITED for Gambian and West African businesses. It guides businesses through four phases of growth: Digitise → Optimise → Scale → Dominate.",
      },
      {
        heading: "Phase 1: Digitise",
        body: "The Digitise phase helps businesses with no or minimal digital infrastructure establish their foundation. The AI analyses your current business and recommends:",
        list: [
          "Digital presence: website, Google Business profile, social media accounts",
          "Core business tools: accounting software, CRM, inventory management",
          "Communication: professional email, messaging, document management",
          "Legal compliance: business registration, TIN, contracts",
          "Payment systems: mobile money integration, point-of-sale",
        ],
        callout: { type: "tip", text: "Even if you already have some digital tools, run through the Digitise phase. The AI often identifies gaps that aren't obvious — like missing Google Business profile or unsigned supplier agreements." },
      },
      {
        heading: "Phase 2: Optimise",
        body: "Once digital foundations are in place, Optimise focuses on improving efficiency and reducing waste. Key areas:",
        list: [
          "Process automation — removing manual, repetitive tasks",
          "Cost reduction — identifying overheads that can be cut",
          "Staff productivity — tools and training recommendations",
          "Customer experience — removing friction from the buying journey",
          "Data collection — setting up analytics and reporting",
        ],
      },
      {
        heading: "Phase 3: Scale",
        body: "Scale is about growth — increasing revenue, customers, and market reach. The AI generates:",
        list: [
          "Marketing strategy recommendations for your sector",
          "Pricing strategies based on market position",
          "Partnership and distribution opportunities",
          "Product/service expansion ideas",
          "Hiring plan for growth phase",
          "Funding requirements and suitable sources",
        ],
      },
      {
        heading: "Phase 4: Dominate",
        body: "Dominate is the final phase — becoming the market leader in your category. This phase covers:",
        list: [
          "Competitive moat building — proprietary advantages",
          "Brand equity development",
          "Export and regional expansion strategy",
          "Investor-ready positioning",
          "Leadership and culture at scale",
          "Exit or succession planning",
        ],
      },
      {
        heading: "How to Get the Best Results",
        body: "Tips for maximising UJU Cycle output quality:",
        list: [
          "Be specific about your sector and business model",
          "Include your approximate revenue range",
          "Mention your biggest constraint (capital, customers, team, or technology)",
          "State your 12-month goal explicitly",
          "Use the 🔊 Listen button to hear the analysis — good for reflection during commutes",
        ],
      },
    ],
  },
  {
    id: "guide-ikenga",
    title: "IKENGA V2: Master Your Social Media Across 18 Platforms",
    summary: "How to use IKENGA to generate a full weekly content calendar, preview posts, and publish across all major social platforms.",
    category: "Platform Guides",
    tags: ["IKENGA", "Social Media", "Content", "Tutorial"],
    readTime: 7,
    difficulty: "Beginner",
    content: [
      {
        heading: "What Is IKENGA?",
        body: "IKENGA (named after the Igbo deity of achievement and industry) is the FORTIS OS social media command centre. It generates AI-powered weekly content schedules across up to 18 platforms, with platform-specific optimisation for each post.",
        callout: { type: "info", text: "IKENGA is named after the Igbo concept of personal achievement and striving. Every post it creates is engineered to maximise your brand's impact on that specific platform." },
      },
      {
        heading: "Step 1: Select Your Platforms",
        body: "Choose which of the 18 platforms you want to publish to. Available platforms:",
        list: [
          "Instagram, Facebook, Twitter/X, LinkedIn, TikTok, YouTube",
          "Threads, Pinterest, Telegram, Discord, Slack",
          "Bluesky, Mastodon, Substack, Medium, Circle, Snapchat, WhatsApp",
        ],
        callout: { type: "tip", text: "Start with 3–4 platforms where your target audience is most active. For Gambian businesses: Facebook, Instagram, and WhatsApp are the top 3." },
      },
      {
        heading: "Step 2: Fill Your Brand Profile",
        body: "The AI needs to understand your brand to generate relevant content. Fill in:",
        list: [
          "Brand/Business Name",
          "Industry or Niche",
          "Voice Tone (Professional / Conversational / Inspirational / Educational)",
          "Primary Goal (Brand Awareness / Lead Generation / Sales / Community / Thought Leadership)",
          "Content Type (Educational / Entertainment / Promotional / Behind-the-Scenes / Mixed)",
        ],
      },
      {
        heading: "Step 3: Generate Your Content Calendar",
        body: "Click Generate and IKENGA will create a full 7-day content calendar. Each post includes:",
        list: [
          "Platform-specific caption optimised for that platform's algorithm",
          "Hook — the opening line designed to stop the scroll",
          "3–8 relevant hashtags",
          "Call to action (CTA)",
          "Optimal posting time for that platform",
          "Preview HTML showing how the post will appear",
        ],
      },
      {
        heading: "Step 4: Preview and Edit",
        body: "Click any post in the calendar to open the preview modal. You can read the full caption, copy it to clipboard, or listen to it via ElevenLabs audio (available in 5 languages including Wolof and Mandinka).",
      },
      {
        heading: "Step 5: Publish",
        body: "Each post has a Publish button. If you've connected your platform credentials at /settings/platforms, it publishes directly. Otherwise, it queues the post for manual publishing with a copied-to-clipboard caption.",
      },
      {
        heading: "Pro Tips",
        body: "",
        list: [
          "Run IKENGA weekly — content freshness is key to algorithm performance",
          "Use the 'Educational' content type for LinkedIn and Substack",
          "Use 'Entertainment + Promotional' for Instagram and TikTok",
          "Connect real platform credentials for one-click publishing",
          "The optimal post times per platform are baked in — trust them",
        ],
      },
    ],
  },
  {
    id: "guide-ask-ujris",
    title: "Ask UJRIS: Forensic Document Analysis Explained",
    summary: "How to get the most out of the Ask UJRIS AI tool — upload contracts, business proposals, or documents for a full integrity analysis.",
    category: "Platform Guides",
    tags: ["Ask UJRIS", "Documents", "Analysis", "Tutorial"],
    readTime: 5,
    difficulty: "Beginner",
    content: [
      {
        heading: "What Is Ask UJRIS?",
        body: "Ask UJRIS is the FORTIS OS document intelligence tool. It performs forensic analysis on any business document — contracts, proposals, financial statements, grant applications, partnership agreements — and returns a detailed integrity score with red flags, risk ratings, and recommendations.",
        callout: { type: "tip", text: "UJRIS stands for UJU Relational Intelligence System. It draws on the same AI that powers the UJU Cycle but is specialised for document-level analysis." },
      },
      {
        heading: "What Documents Can I Analyse?",
        body: "You can paste or upload any of the following:",
        list: [
          "Business contracts and partnership agreements",
          "Investment proposals and pitch decks",
          "Grant applications and funding bids",
          "Business plans and feasibility studies",
          "Financial statements and audit reports",
          "Employment contracts",
          "Supplier agreements and procurement documents",
          "Government tender responses",
        ],
      },
      {
        heading: "Understanding the Integrity Score",
        body: "UJRIS returns a score from 0–100. Score interpretation:",
        table: {
          headers: ["Score Range", "Interpretation", "Action"],
          rows: [
            ["80–100", "High integrity — proceed with confidence", "Minor checks only"],
            ["60–79", "Moderate integrity — some concerns", "Address red flags before signing"],
            ["40–59", "Significant issues found", "Seek legal review before proceeding"],
            ["0–39", "High risk document", "Do not sign without specialist legal advice"],
          ],
        },
      },
      {
        heading: "Red Flags by Severity",
        body: "UJRIS categorises each issue by severity:",
        list: [
          "🔴 Critical — potential fraud, illegal clauses, or fundamental misrepresentation",
          "🟡 Warning — unusual terms that may disadvantage you",
          "🟢 Advisory — areas to clarify or negotiate",
        ],
      },
      {
        heading: "Using the Audio Summary",
        body: "After analysis, click '🔊 Listen to Analysis' to hear the UJRIS report read aloud. Choose from 5 languages: English, French, Wolof, Mandinka, or Fula. This is particularly useful for sharing the analysis verbally with team members or clients.",
      },
      {
        heading: "Tips for Best Results",
        body: "",
        list: [
          "Paste the full document text — partial submissions give partial results",
          "Include context: 'This is a supplier contract for importing solar panels' helps the AI calibrate expectations",
          "Run proposals through UJRIS before submitting to banks or investors — it spots weaknesses before they do",
          "Use UJRIS on competitor documents (e.g. public tender submissions) to understand their strengths",
        ],
      },
    ],
  },

  // ── DIGITAL TOOLS ─────────────────────────────────────────────────────────────
  {
    id: "digital-marketing-gambia",
    title: "Digital Marketing in The Gambia: What Works and What Doesn't",
    summary: "Practical digital marketing strategy for Gambian businesses — the platforms that matter, budgets that make sense, and the tactics that drive results.",
    category: "Digital Tools",
    tags: ["Marketing", "Social Media", "SEO", "Gambia"],
    readTime: 8,
    difficulty: "Beginner",
    content: [
      {
        heading: "The Gambian Digital Landscape",
        body: "Gambia has 2.4 million people with approximately 1.4 million internet users (60% penetration). Mobile internet dominates — over 90% of users access the internet via mobile. Data is relatively expensive, which affects content consumption habits (short video > long articles).",
        table: {
          headers: ["Platform", "Gambia Users (est.)", "Primary Age Group", "Best For"],
          rows: [
            ["Facebook", "800,000+", "25–45", "Business discovery, events, community"],
            ["WhatsApp", "1,200,000+", "18–55", "Customer service, groups, broadcasts"],
            ["Instagram", "300,000+", "18–35", "Visual products, lifestyle, tourism"],
            ["TikTok", "200,000+", "16–28", "Entertainment, viral content"],
            ["LinkedIn", "50,000+", "25–45", "B2B, professional services"],
            ["YouTube", "400,000+", "18–40", "How-to content, entertainment"],
          ],
        },
      },
      {
        heading: "WhatsApp: The #1 Business Tool in Gambia",
        body: "WhatsApp is by far the most important digital business tool in The Gambia. Key use cases:",
        list: [
          "WhatsApp Business — free tool with catalogue, auto-replies, labels",
          "Broadcast lists — send updates to up to 256 contacts",
          "WhatsApp Groups — community building and customer support",
          "Status updates — free advertising to all contacts daily",
          "WhatsApp Business API — for larger businesses, automated messaging",
        ],
        callout: { type: "tip", text: "Every Gambian business should have a WhatsApp Business account. It's free, customers expect it, and it's the fastest way to close a sale." },
      },
      {
        heading: "Facebook: Still Essential for Discovery",
        body: "Facebook remains the primary platform for finding and evaluating businesses in Gambia. Priorities:",
        list: [
          "Business Page with complete information (hours, location, contact)",
          "Regular posts: 3–5 per week minimum",
          "Facebook Ads: even D100/day can drive significant reach in Gambia",
          "Facebook Marketplace: free listing for products",
          "Facebook Groups: join and participate in relevant Gambian business groups",
        ],
      },
      {
        heading: "SEO: Getting Found on Google",
        body: "Most Gambian businesses have no SEO strategy. Even basic SEO can generate significant organic traffic:",
        list: [
          "Google Business Profile — free, critical for local search",
          "NAP consistency — Name, Address, Phone identical across all platforms",
          "Website with basic on-page SEO (title tags, meta descriptions)",
          "Local keywords: include 'in The Gambia', 'Banjul', 'Serrekunda' in content",
          "Review generation — ask satisfied customers for Google reviews",
        ],
      },
      {
        heading: "Budget Guidance",
        body: "Realistic digital marketing budgets for Gambian SMEs:",
        table: {
          headers: ["Business Size", "Monthly Budget (GMD)", "Recommended Allocation"],
          rows: [
            ["Micro (1–5 staff)", "D500–D2,000", "80% WhatsApp/Facebook organic, 20% boosted posts"],
            ["Small (6–20 staff)", "D2,000–D8,000", "50% Facebook Ads, 30% content creation, 20% SEO"],
            ["Medium (21–50 staff)", "D8,000–D25,000", "40% paid social, 30% content, 20% SEO, 10% influencer"],
            ["Large (50+ staff)", "D25,000+", "Multi-channel mix including Google Ads and PR"],
          ],
        },
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function KnowledgeHub() {
  const [search,      setSearch]      = useState("");
  const [activeTab,   setActiveTab]   = useState<Category | "All">("All");
  const [difficulty,  setDifficulty]  = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const featured = useMemo(() => ARTICLES.filter(a => a.featured), []);

  const filtered = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchCat   = activeTab === "All" || a.category === activeTab;
      const matchDiff  = difficulty === "All" || a.difficulty === difficulty;
      const matchSearch = !search || [a.title, a.summary, ...a.tags]
        .join(" ").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [search, activeTab, difficulty]);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, #0D3B2E 100%)`,
        padding: "3rem 2rem",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
        <h1 style={{ color: WHITE, fontSize: 32, fontWeight: 800, margin: "0 0 0.5rem" }}>
          FORTIS Knowledge Hub
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, margin: "0 0 1.5rem", maxWidth: 560, marginInline: "auto" }}>
          Practical guides on doing business in The Gambia — sector intelligence, compliance, finance, and platform tutorials.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search articles, topics, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "0.8rem 1rem 0.8rem 2.8rem",
              borderRadius: 10, border: "none", fontSize: 15,
              color: TEXT, outline: "none", boxSizing: "border-box",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: "1.5rem" }}>
          {[
            { n: ARTICLES.length, label: "Articles" },
            { n: CATEGORIES.length, label: "Categories" },
            { n: ARTICLES.reduce((s, a) => s + a.readTime, 0), label: "Minutes of content" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 22 }}>{s.n}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Featured — only shown when no search/filter */}
        {!search && activeTab === "All" && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: TEXT, marginBottom: "1rem" }}>
              ⭐ Featured Articles
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {featured.map(a => (
                <ArticleCard key={a.id} article={a} onOpen={setOpenArticle} featured />
              ))}
            </div>
          </div>
        )}

        {/* Filters row */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["All", ...CATEGORIES] as (Category | "All")[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: "0.4rem 0.9rem", borderRadius: 20, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: activeTab === cat ? 700 : 400,
                  background: activeTab === cat
                    ? (cat === "All" ? PRIMARY : CAT_COLORS[cat as Category])
                    : BORDER,
                  color: activeTab === cat ? WHITE : MUTED,
                }}
              >
                {cat !== "All" && CAT_ICONS[cat as Category] + " "}{cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: "0.35rem 0.75rem", borderRadius: 20,
                  border: `1.5px solid ${difficulty === d ? PRIMARY : BORDER}`,
                  background: difficulty === d ? `${PRIMARY}10` : WHITE,
                  color: difficulty === d ? PRIMARY : MUTED,
                  fontSize: 12, fontWeight: difficulty === d ? 700 : 400, cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: MUTED, marginBottom: "1rem" }}>
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {activeTab !== "All" && ` in ${activeTab}`}
        </div>

        {/* Article grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: MUTED }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16 }}>No articles match your search.</div>
            <button
              onClick={() => { setSearch(""); setActiveTab("All"); setDifficulty("All"); }}
              style={{ marginTop: 16, padding: "0.5rem 1.2rem", background: PRIMARY, color: WHITE, border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {filtered.map(a => (
              <ArticleCard key={a.id} article={a} onOpen={setOpenArticle} />
            ))}
          </div>
        )}
      </div>

      {/* Article modal */}
      {openArticle && (
        <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      )}
    </div>
  );
}

// ─── ArticleCard ──────────────────────────────────────────────────────────────
function ArticleCard({
  article, onOpen, featured = false,
}: {
  article: Article;
  onOpen: (a: Article) => void;
  featured?: boolean;
}) {
  const catColor = CAT_COLORS[article.category];
  const diffColor = article.difficulty === "Beginner" ? "#10B981"
    : article.difficulty === "Intermediate" ? "#F59E0B" : "#EF4444";

  return (
    <div
      onClick={() => onOpen(article)}
      style={{
        background: WHITE,
        border: `1.5px solid ${featured ? GOLD : BORDER}`,
        borderRadius: 12, padding: "1.25rem",
        cursor: "pointer", transition: "box-shadow 0.15s",
        boxShadow: featured ? `0 2px 12px ${GOLD}30` : "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", gap: 10,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = featured ? `0 2px 12px ${GOLD}30` : "0 1px 4px rgba(0,0,0,0.06)")}
    >
      {/* Category + difficulty row */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: WHITE,
          background: catColor, borderRadius: 10, padding: "2px 8px",
        }}>
          {CAT_ICONS[article.category]} {article.category}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: diffColor, border: `1px solid ${diffColor}40`,
          borderRadius: 10, padding: "2px 7px",
        }}>
          {article.difficulty}
        </span>
        {featured && (
          <span style={{ fontSize: 11, color: GOLD, marginLeft: "auto" }}>⭐ Featured</span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, lineHeight: 1.4 }}>
        {article.title}
      </div>

      {/* Summary */}
      <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.5, flexGrow: 1 }}>
        {article.summary}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontSize: 11, color: MUTED,
            background: BG, border: `1px solid ${BORDER}`,
            borderRadius: 8, padding: "2px 7px",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 12, color: MUTED }}>⏱ {article.readTime} min read</span>
        <span style={{ fontSize: 12, color: PRIMARY, fontWeight: 600 }}>Read →</span>
      </div>
    </div>
  );
}

// ─── ArticleModal ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const [copied,   setCopied]   = useState(false);

  function handleCopy() {
    const text = article.content.map(s =>
      [s.heading ? `## ${s.heading}` : "", s.body, ...(s.list ?? []).map(i => `• ${i}`)].filter(Boolean).join("\n")
    ).join("\n\n");
    navigator.clipboard.writeText(`${article.title}\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(10,28,46,0.6)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        zIndex: 1000, padding: "2rem 1rem", overflowY: "auto",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: WHITE, borderRadius: 14, width: "100%", maxWidth: 740,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "1.5rem 1.75rem",
          borderBottom: `1px solid ${BORDER}`,
          position: "sticky", top: 0, background: WHITE, zIndex: 10,
        }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 12, fontWeight: 700, color: WHITE,
              background: CAT_COLORS[article.category], borderRadius: 10, padding: "3px 10px",
            }}>
              {CAT_ICONS[article.category]} {article.category}
            </span>
            <span style={{ fontSize: 12, color: MUTED, padding: "3px 0" }}>
              ⏱ {article.readTime} min read · {article.difficulty}
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, color: TEXT, lineHeight: 1.3 }}>
            {article.title}
          </div>
          <div style={{ color: MUTED, fontSize: 14, marginTop: 6 }}>{article.summary}</div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleCopy} style={{
              padding: "0.4rem 0.9rem", background: copied ? "#10B981" : BG,
              color: copied ? WHITE : TEXT, border: `1px solid ${BORDER}`,
              borderRadius: 7, fontSize: 13, cursor: "pointer", fontWeight: 600,
            }}>
              {copied ? "✓ Copied" : "📋 Copy Article"}
            </button>
            <button onClick={onClose} style={{
              marginLeft: "auto", padding: "0.4rem 0.9rem", background: "transparent",
              color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 13, cursor: "pointer",
            }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: "1.75rem" }}>
          {article.content.map((section, i) => (
            <div key={i} style={{ marginBottom: "1.75rem" }}>
              {section.heading && (
                <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "0 0 0.75rem", paddingBottom: 6, borderBottom: `2px solid ${PRIMARY}20` }}>
                  {section.heading}
                </h2>
              )}

              {section.body && (
                <p style={{ color: TEXT, fontSize: 15, lineHeight: 1.8, margin: "0 0 0.75rem" }}>
                  {section.body}
                </p>
              )}

              {section.list && (
                <ul style={{ margin: "0 0 0.75rem", paddingLeft: "1.25rem" }}>
                  {section.list.map((item, j) => (
                    <li key={j} style={{ color: TEXT, fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div style={{
                  background: section.callout.type === "warning" ? "#FEF3C7"
                    : section.callout.type === "tip" ? "#ECFDF5" : "#EFF6FF",
                  border: `1px solid ${section.callout.type === "warning" ? "#FCD34D"
                    : section.callout.type === "tip" ? "#6EE7B7" : "#BFDBFE"}`,
                  borderRadius: 8, padding: "0.85rem 1rem", marginBottom: "0.75rem",
                  fontSize: 14, lineHeight: 1.7,
                  color: section.callout.type === "warning" ? "#92400E"
                    : section.callout.type === "tip" ? "#065F46" : "#1E40AF",
                }}>
                  {section.callout.type === "warning" ? "⚠️" : section.callout.type === "tip" ? "💡" : "ℹ️"}
                  {" "}{section.callout.text}
                </div>
              )}

              {section.table && (
                <div style={{ overflowX: "auto", marginBottom: "0.75rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        {section.table.headers.map(h => (
                          <th key={h} style={{
                            background: PRIMARY, color: WHITE, padding: "0.6rem 0.85rem",
                            textAlign: "left", fontWeight: 700,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? WHITE : BG }}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{
                              padding: "0.55rem 0.85rem", color: TEXT,
                              borderBottom: `1px solid ${BORDER}`,
                              fontWeight: ci === 0 ? 600 : 400,
                            }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Article footer */}
          <div style={{
            marginTop: "2rem", padding: "1rem",
            background: `${PRIMARY}08`, borderRadius: 8,
            border: `1px solid ${PRIMARY}20`, fontSize: 13, color: MUTED,
          }}>
            📌 Part of the FORTIS OS Knowledge Hub. Built for Gambian entrepreneurs by UJU GROUP LIMITED.
            <br />Tags: {article.tags.join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
