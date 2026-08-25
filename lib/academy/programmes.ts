import { CC_BY_SA_NOTICE, MEDIA_BODIES, PHOTO_BODIES } from "./briefs/photography-media";

export type ProgrammeStatus = "approved_outline" | "external_link_only";
export type ProgrammeLevel = "beginner" | "intermediate";

export interface ProgrammeSource {
  name: string;
  url: string;
  licence: string;
  use: "adapt" | "cite_link";
}

export interface ProgrammeLesson {
  id: string;
  title: string;
  minutes: number;
  brief: string;
  /** Longer CC-attributed body when the lesson is an OER adaptation. */
  body?: string;
  shareAlike?: string;
}

export interface AcademyProgramme {
  id: string;
  title: string;
  sector: string;
  level: ProgrammeLevel;
  status: ProgrammeStatus;
  youthFit: string;
  summary: string;
  lessons: ProgrammeLesson[];
  sources: ProgrammeSource[];
  assessmentProgramId: string;
}

/**
 * Approved vocational catalogue for young Gambians.
 * Outlines are FORTIS-authored. Lessons cite OER — they are not ingested copies
 * of Google Digital Garage, Meta, or other non-remixable products.
 */
export const ACADEMY_PROGRAMMES: AcademyProgramme[] = [
  {
    id: "digital-literacy",
    title: "Digital literacy fundamentals",
    sector: "Foundation",
    level: "beginner",
    status: "approved_outline",
    youthFit: "First phone or first job — internet, safety, mobile money.",
    summary: "Access, evaluate, create and communicate online. Mapped to DigComp 2.2.",
    assessmentProgramId: "digital-literacy",
    lessons: [
      { id: "dl-1", title: "What digital literacy is", minutes: 25, brief: "Find, judge, make and share information with a phone or shared PC." },
      { id: "dl-2", title: "Getting online in The Gambia", minutes: 25, brief: "Data costs, public Wi-Fi risks, WhatsApp as a work tool." },
      { id: "dl-3", title: "Passwords, OTP and SIM-swap", minutes: 30, brief: "Never share OTP. Mobile-money fraud is the local threat model." },
      { id: "dl-4", title: "Judging sources", minutes: 25, brief: "Forwarded messages, fake job ads, and checking a URL." },
    ],
    sources: [
      { name: "GSMA MISTT", url: "https://www.gsma.com/mobilefordevelopment/mistt/", licence: "CC BY 4.0", use: "adapt" },
      { name: "DigComp 2.2 (JRC)", url: "https://publications.jrc.ec.europa.eu/repository/handle/JRC128415", licence: "EU public", use: "cite_link" },
      { name: "Mozilla Web Literacy", url: "https://mozilla.github.io/curriculum-final/", licence: "CC BY-SA", use: "adapt" },
    ],
  },
  {
    id: "mobile-money",
    title: "Mobile money & digital payments",
    sector: "Fintech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Agents, market traders, family remitters.",
    summary: "Send, receive and record Wave / QMoney / Afrimoney safely. Not a payments licence.",
    assessmentProgramId: "mobile-money",
    lessons: [
      { id: "mm-1", title: "Wallets vs bank accounts", minutes: 20, brief: "What a wallet can and cannot do under Gambian practice." },
      { id: "mm-2", title: "Agent etiquette and receipts", minutes: 25, brief: "Confirm name, amount and reference before you tap confirm." },
      { id: "mm-3", title: "Fraud patterns", minutes: 30, brief: "Wrong-number send, fake support, SIM-swap." },
      { id: "mm-4", title: "Keeping a cashbook", minutes: 25, brief: "Daily float, personal vs business money." },
    ],
    sources: [
      { name: "GSMA MISTT — Mobile Money", url: "https://www.gsma.com/mobilefordevelopment/mistt/", licence: "CC BY 4.0", use: "adapt" },
    ],
  },
  {
    id: "cyber-essentials",
    title: "Cyber safety essentials",
    sector: "Security",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Anyone with WhatsApp, email or a shop POS.",
    summary: "Phishing, device hygiene, privacy. Not a professional security cert.",
    assessmentProgramId: "cyber-essentials",
    lessons: [
      { id: "cy-1", title: "Threats you will actually see", minutes: 25, brief: "SMS phishing, fake CBG/GRA pages, romance-job scams." },
      { id: "cy-2", title: "Device hygiene", minutes: 20, brief: "Updates, app stores, shared family phones." },
      { id: "cy-3", title: "Accounts and 2FA", minutes: 25, brief: "Email as the master key." },
      { id: "cy-4", title: "When something goes wrong", minutes: 20, brief: "Freeze the wallet, change passwords, tell the operator." },
    ],
    sources: [
      { name: "GSMA MISTT — Online Safety", url: "https://www.gsma.com/mobilefordevelopment/mistt/", licence: "CC BY 4.0", use: "adapt" },
      { name: "CyBOK (NCSC)", url: "https://www.cybok.org/", licence: "OGL v3.0", use: "cite_link" },
    ],
  },
  {
    id: "phone-photography",
    title: "Phone photography for work",
    sector: "Media",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Market sellers, events, tourism, personal brand.",
    summary: "Light, frame, consent and a simple edit — using the phone you already have.",
    assessmentProgramId: "phone-photography",
    lessons: [
      { id: "ph-1", title: "Light before gadgets", minutes: 40, brief: "Face the light. Avoid noon harshness. Clean the lens.", body: PHOTO_BODIES["ph-1"], shareAlike: CC_BY_SA_NOTICE },
      { id: "ph-2", title: "Frame and story", minutes: 40, brief: "Subject, background clutter, one idea per frame.", body: PHOTO_BODIES["ph-2"], shareAlike: CC_BY_SA_NOTICE },
      { id: "ph-3", title: "Consent and dignity", minutes: 30, brief: "Ask before faces, children, ceremonies. Credit when you reuse.", body: PHOTO_BODIES["ph-3"], shareAlike: CC_BY_SA_NOTICE },
      { id: "ph-4", title: "Edit and deliver", minutes: 35, brief: "Crop, exposure, export size for WhatsApp vs print.", body: PHOTO_BODIES["ph-4"], shareAlike: CC_BY_SA_NOTICE },
    ],
    sources: [
      { name: "Wikibooks — Digital Photography", url: "https://en.wikibooks.org/wiki/Digital_Photography", licence: "CC BY-SA", use: "adapt" },
      { name: "Wikibooks — Modern Photography / Light", url: "https://en.wikibooks.org/wiki/Modern_Photography/Light", licence: "CC BY-SA", use: "adapt" },
      { name: "Wikibooks — Modern Photography / Composition", url: "https://en.wikibooks.org/wiki/Modern_Photography/Composition", licence: "CC BY-SA", use: "adapt" },
      { name: "Wikimedia Commons — Photography", url: "https://commons.wikimedia.org/wiki/Commons:Photography", licence: "CC mix", use: "cite_link" },
    ],
  },
  {
    id: "digital-media",
    title: "Digital media & short video",
    sector: "Media",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Creators, school clubs, SME promo clips.",
    summary: "Plan a 30–60s clip, record clean audio, cut, caption, publish with rights.",
    assessmentProgramId: "digital-media",
    lessons: [
      { id: "dm-1", title: "A brief, not a vibe", minutes: 30, brief: "Audience, one message, call to action.", body: MEDIA_BODIES["dm-1"], shareAlike: CC_BY_SA_NOTICE },
      { id: "dm-2", title: "Record", minutes: 40, brief: "Stable phone, quiet room, mic distance, B-roll.", body: MEDIA_BODIES["dm-2"], shareAlike: CC_BY_SA_NOTICE },
      { id: "dm-3", title: "Edit and caption", minutes: 35, brief: "Cut silence, burn captions, keep under data-friendly size.", body: MEDIA_BODIES["dm-3"], shareAlike: CC_BY_SA_NOTICE },
      { id: "dm-4", title: "Rights and music", minutes: 25, brief: "No stolen tracks. Credit stills. Disclose ads.", body: MEDIA_BODIES["dm-4"], shareAlike: CC_BY_SA_NOTICE },
    ],
    sources: [
      { name: "Wikibooks — Movie Making Manual / Lighting", url: "https://en.wikibooks.org/wiki/Movie_Making_Manual/Lighting", licence: "CC BY-SA", use: "adapt" },
      { name: "Wikibooks — Movie Making Manual / Cinematography", url: "https://en.wikibooks.org/wiki/Movie_Making_Manual/Cinematography", licence: "CC BY-SA", use: "adapt" },
      { name: "Wikibooks — Modern Photography / Composition", url: "https://en.wikibooks.org/wiki/Modern_Photography/Composition", licence: "CC BY-SA", use: "adapt" },
      { name: "Mozilla Web Literacy — create", url: "https://mozilla.github.io/curriculum-final/", licence: "CC BY-SA", use: "cite_link" },
      { name: "UNESCO MIL", url: "https://www.unesco.org/en/media-information-literacy", licence: "UNESCO terms", use: "cite_link" },
    ],
  },
  {
    id: "graphic-basics",
    title: "Graphic basics with free tools",
    sector: "Media",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Posters, menus, flyers, social tiles.",
    summary: "Contrast, type, logo-safe area. Prefer Inkscape/GIMP/Photopea over pirated Adobe.",
    assessmentProgramId: "graphic-basics",
    lessons: [
      { id: "gr-1", title: "What the eye reads first", minutes: 20, brief: "Hierarchy, contrast, one typeface family." },
      { id: "gr-2", title: "Free tool chain", minutes: 25, brief: "Inkscape vectors, GIMP rasters, export PNG/PDF." },
      { id: "gr-3", title: "A one-page flyer", minutes: 35, brief: "Event, price, WhatsApp, venue — in Wolof/English if needed." },
      { id: "gr-4", title: "Brand files you can hand over", minutes: 20, brief: "Logo on transparent PNG + colour notes." },
    ],
    sources: [
      { name: "Inkscape documentation", url: "https://inkscape.org/learn/", licence: "GPL / CC", use: "cite_link" },
      { name: "GIMP user manual", url: "https://docs.gimp.org/", licence: "GFDL / CC", use: "cite_link" },
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital marketing for SMEs",
    sector: "Marketing",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Family shops, creators selling a service, campus hustles.",
    summary: "Offer, audience, channel, measure. OpenStax marketing + local WhatsApp/Facebook practice.",
    assessmentProgramId: "digital-marketing",
    lessons: [
      { id: "mk-1", title: "The offer in one sentence", minutes: 20, brief: "Who it is for, what changes, what it costs." },
      { id: "mk-2", title: "Channels that actually reach Banjul/Serekunda", minutes: 25, brief: "WhatsApp status, Facebook, walk-in, radio — not every platform." },
      { id: "mk-3", title: "Content calendar", minutes: 25, brief: "Three posts a week you can keep." },
      { id: "mk-4", title: "Honest ads and measurement", minutes: 25, brief: "Price truth, no fake scarcity. Count enquiries not likes." },
    ],
    sources: [
      { name: "OpenStax Principles of Marketing", url: "https://openstax.org/details/books/principles-marketing", licence: "CC BY 4.0", use: "adapt" },
      { name: "OER Commons — Marketing", url: "https://oercommons.org/", licence: "varies CC", use: "cite_link" },
    ],
  },
  {
    id: "web-fundamentals",
    title: "Web fundamentals",
    sector: "Digital & Tech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "First site for a shop or NGO.",
    summary: "HTML, CSS, one page that works on a slow phone. MDN is the syllabus.",
    assessmentProgramId: "web-fundamentals",
    lessons: [
      { id: "web-1", title: "How a page is built", minutes: 30, brief: "HTML structure, headings, links, images with alt text." },
      { id: "web-2", title: "Make it readable on mobile", minutes: 30, brief: "Viewport, contrast, tap targets." },
      { id: "web-3", title: "Ship a one-page profile", minutes: 40, brief: "Name, offer, map pin, WhatsApp link." },
    ],
    sources: [
      { name: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn", licence: "CC BY-SA", use: "cite_link" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/", licence: "BSD-3", use: "cite_link" },
    ],
  },
  {
    id: "data-sheets",
    title: "Data for small business",
    sector: "Digital & Tech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Keep a stock and sales sheet without a degree.",
    summary: "Tables, totals, a simple chart. Google Sheets or LibreOffice Calc.",
    assessmentProgramId: "data-sheets",
    lessons: [
      { id: "da-1", title: "Rows are facts", minutes: 20, brief: "One sale per row. Date, item, qty, dalasi." },
      { id: "da-2", title: "Formulas you need", minutes: 30, brief: "SUM, average, a basic IF for low stock." },
      { id: "da-3", title: "A chart you can show an uncle", minutes: 20, brief: "This week vs last week. No 3D pie." },
    ],
    sources: [
      { name: "GCFGlobal — Spreadsheets", url: "https://edu.gcfglobal.org/", licence: "free access, not remix", use: "cite_link" },
      { name: "LibreOffice Calc guide", url: "https://documentation.libreoffice.org/", licence: "CC / public docs", use: "cite_link" },
    ],
  },
  {
    id: "customer-digital",
    title: "Digital customer service",
    sector: "Work readiness",
    level: "beginner",
    status: "approved_outline",
    youthFit: "First paid role in a shop, hotel, call desk or NGO.",
    summary: "Reply times, tone, privacy, when to escalate.",
    assessmentProgramId: "customer-digital",
    lessons: [
      { id: "cs-1", title: "A written first reply", minutes: 20, brief: "Name, issue, next step, time." },
      { id: "cs-2", title: "Angry chat", minutes: 20, brief: "Do not match heat. Offer a human." },
      { id: "cs-3", title: "Data you must not leak", minutes: 20, brief: "IDs, OTPs, medical or school records." },
    ],
    sources: [
      { name: "COL Commons short skills", url: "https://colcommons.org/", licence: "COL OER", use: "cite_link" },
    ],
  },
  {
    id: "agritech-lite",
    title: "Digital tools for farms & gardens",
    sector: "Agriculture",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Family plots, cooperatives, market gardeners.",
    summary: "Weather check, record keeping, market prices. Not a drone licence.",
    assessmentProgramId: "agritech-lite",
    lessons: [
      { id: "ag-1", title: "A field notebook that is digital", minutes: 20, brief: "Date, plot, input, yield." },
      { id: "ag-2", title: "Weather as a decision", minutes: 20, brief: "Use a dated forecast; do not invent rain." },
      { id: "ag-3", title: "Finding a buyer", minutes: 20, brief: "WhatsApp groups, market days, honest photos of produce." },
    ],
    sources: [
      { name: "FAO elearning Academy", url: "https://elearning.fao.org/", licence: "FAO free access", use: "cite_link" },
      { name: "OER Africa — agriculture", url: "https://www.oerafrica.org/", licence: "OER mix", use: "cite_link" },
    ],
  },
  {
    id: "solar-basics",
    title: "Solar & energy literacy (intro)",
    sector: "Energy",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Households and kiosks considering a panel.",
    summary: "What a panel, battery and inverter do. Safety. Not an electrician ticket.",
    assessmentProgramId: "solar-basics",
    lessons: [
      { id: "so-1", title: "The energy chain", minutes: 25, brief: "Sun → panel → charge controller → battery → load." },
      { id: "so-2", title: "Loads you can run", minutes: 25, brief: "Lights and phone charge vs fridge and welder." },
      { id: "so-3", title: "Safety", minutes: 20, brief: "Do not wire mains yourself. Licensed electrician for AC." },
    ],
    sources: [
      { name: "UNESCO-UNEVOC TVET OER list", url: "https://unevoc.unesco.org/home/OER+for+TVET", licence: "varies", use: "cite_link" },
    ],
  },
  {
    id: "entrepreneur-lite",
    title: "Youth enterprise basics",
    sector: "Work readiness",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Side hustle to a named offer.",
    summary: "Cost, price, record, tax awareness. Ties into GROW later.",
    assessmentProgramId: "entrepreneur-lite",
    lessons: [
      { id: "en-1", title: "Price covers cost", minutes: 20, brief: "Materials, data, transport, your time." },
      { id: "en-2", title: "A simple offer sheet", minutes: 25, brief: "What, for whom, dalasi, delivery." },
      { id: "en-3", title: "Keep it legal enough", minutes: 20, brief: "Receipts, GRA awareness, no fake licences." },
    ],
    sources: [
      { name: "OpenStax Principles of Marketing", url: "https://openstax.org/details/books/principles-marketing", licence: "CC BY 4.0", use: "cite_link" },
      { name: "COL OAsis", url: "https://oasis.col.org/", licence: "COL OER", use: "cite_link" },
    ],
  },
  {
    id: "workplace-english-numeracy",
    title: "Workplace English & numeracy",
    sector: "Foundation",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Hotel, site, shop and office starters who never got five WASSCE credits.",
    summary: "Job English and money maths. Not a WAEC substitute. World Bank HCR: very few candidates meet university entry English/maths.",
    assessmentProgramId: "workplace-english-numeracy",
    lessons: [
      { id: "we-1", title: "A clear spoken sentence at work", minutes: 25, brief: "Name the task, the time, and the person. Slow is better than slang." },
      { id: "we-2", title: "Read a short instruction", minutes: 25, brief: "Menus, safety signs, WhatsApp job notes, a delivery slip." },
      { id: "we-3", title: "Money maths you cannot skip", minutes: 30, brief: "Change, unit price, a 10% service, hours × rate." },
      { id: "we-4", title: "Write a three-line work message", minutes: 20, brief: "What happened, what you did, what you need." },
    ],
    sources: [
      { name: "World Bank — Human capital / Gambian youth", url: "https://blogs.worldbank.org/en/nasikiliza/stop-solving-only-half-problem-human-capital-through-eyes-gambian-youth", licence: "WB terms", use: "cite_link" },
      { name: "ILO State of Skills — The Gambia", url: "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_emp/@ifp_skills/documents/genericdocument/wcms_742224.pdf", licence: "ILO", use: "cite_link" },
      { name: "GCFGlobal — reading & math", url: "https://edu.gcfglobal.org/", licence: "free access, not remix", use: "cite_link" },
    ],
  },
  {
    id: "hospitality-ops",
    title: "Hospitality & tourism operations",
    sector: "Tourism",
    level: "beginner",
    status: "approved_outline",
    youthFit: "First hotel, lodge, restaurant or tour-desk role.",
    summary: "Guest cycle, hygiene, complaints, WhatsApp booking. Not a chef or tour-guide licence. ITC and employer surveys list tourism as a shortage sector.",
    assessmentProgramId: "hospitality-ops",
    lessons: [
      { id: "ho-1", title: "The guest cycle", minutes: 25, brief: "Arrive, stay, pay, leave. Your job is one clean hand-off." },
      { id: "ho-2", title: "Hygiene you can see", minutes: 25, brief: "Hands, ice, toilets, food temperature talk — escalate if unsure." },
      { id: "ho-3", title: "Complaints without heat", minutes: 20, brief: "Listen, repeat, offer a next step, tell a supervisor." },
      { id: "ho-4", title: "A WhatsApp booking note", minutes: 20, brief: "Dates, names, price, what is included. No fake rooms." },
    ],
    sources: [
      { name: "ITC Youth and Trade — Gambia tourism", url: "https://www.intracen.org/news-and-events/news/the-gambia-invests-in-jobs-for-youth-through-national-trade-roadmap", licence: "ITC", use: "cite_link" },
      { name: "COL Commons", url: "https://colcommons.org/", licence: "COL OER", use: "cite_link" },
    ],
  },
  {
    id: "agro-processing",
    title: "Agro-processing & food hygiene",
    sector: "Agriculture",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Co-ops, nut/fruit processors, market packers.",
    summary: "Hygiene, packing, labels, cold-chain ideas. Not a food-factory ticket. RISE TVET and ITC name agro-processing as a priority.",
    assessmentProgramId: "agro-processing",
    lessons: [
      { id: "ap-1", title: "Clean enough to sell", minutes: 25, brief: "Wash, dry hands, keep raw and packed apart." },
      { id: "ap-2", title: "A label that tells the truth", minutes: 20, brief: "What it is, weight, date, who packed it." },
      { id: "ap-3", title: "Heat, ice and time", minutes: 25, brief: "Spoilage is money lost. Do not invent shelf life." },
      { id: "ap-4", title: "A batch record", minutes: 20, brief: "Date, input kg, output kg, waste. One row per batch." },
    ],
    sources: [
      { name: "World Bank RISE project", url: "https://www.worldbank.org/en/news/press-release/2024/03/11/world-bank-provides-92-71-million-through-the-gambia-rise-project-to-enhance-economic-and-educational-outcomes", licence: "WB", use: "cite_link" },
      { name: "FAO elearning Academy", url: "https://elearning.fao.org/", licence: "FAO free access", use: "cite_link" },
      { name: "UNESCO-UNEVOC SSC — agro-processing", url: "https://atlas.unevoc.unesco.org/africa-identification-case-study", licence: "UNESCO", use: "cite_link" },
    ],
  },
  {
    id: "fisheries-postharvest",
    title: "Fisheries post-harvest (lite)",
    sector: "Agriculture",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Landing sites, smokers, market sellers — not skippers.",
    summary: "Ice, quality, spoilage, honest buyer photos. Not a fishing or skipper licence. RISE funds fisheries TVET centres.",
    assessmentProgramId: "fisheries-postharvest",
    lessons: [
      { id: "fi-1", title: "From boat to ice", minutes: 25, brief: "Time and temperature beat a fancy crate." },
      { id: "fi-2", title: "See spoilage early", minutes: 20, brief: "Smell, eyes, gills — do not sell what you would not eat." },
      { id: "fi-3", title: "A photo a buyer can trust", minutes: 20, brief: "Daylight, whole fish, no stolen hotel pictures." },
    ],
    sources: [
      { name: "RISE / fisheries TVET centres", url: "https://www.ecofinagency.com/news-services/1007-57269-gambia-approves-13-million-tvet-investment-to-boost-youth-employment", licence: "news cite", use: "cite_link" },
      { name: "FAO elearning — fisheries", url: "https://elearning.fao.org/", licence: "FAO free access", use: "cite_link" },
    ],
  },
  {
    id: "construction-literacy",
    title: "Construction site literacy",
    sector: "Construction",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Helpers who want to last a week on a site without injury.",
    summary: "Measure, PPE, read a simple sketch. Not a NAQAA trade or electrician ticket. Construction is an official Sector Skills Council.",
    assessmentProgramId: "construction-literacy",
    lessons: [
      { id: "co-1", title: "PPE is not decoration", minutes: 20, brief: "Eyes, feet, head. Say no to unsafe shortcuts." },
      { id: "co-2", title: "Measure twice", minutes: 25, brief: "Metres, a square, a level. Write the number down." },
      { id: "co-3", title: "Read a simple drawing", minutes: 25, brief: "Wall, opening, dimension. Ask if it is missing." },
      { id: "co-4", title: "When to stop", minutes: 15, brief: "Live cables, deep trenches, night work without light — call a ticketed person." },
    ],
    sources: [
      { name: "UNESCO-UNEVOC — Gambia SSCs (construction)", url: "https://atlas.unevoc.unesco.org/africa-identification-case-study", licence: "UNESCO", use: "cite_link" },
      { name: "World Bank youth / GTTI trades", url: "https://blogs.worldbank.org/en/nasikiliza/stop-solving-only-half-problem-human-capital-through-eyes-gambian-youth", licence: "WB", use: "cite_link" },
    ],
  },
  {
    id: "device-repair",
    title: "Phone & PC repair (theory + safety)",
    sector: "Digital & Tech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Serekunda bench repair and family IT help.",
    summary: "Diagnosis, ESD, honest parts. Not a manufacturer warranty ticket. AfDB: computing/phone-repair skills are rare.",
    assessmentProgramId: "device-repair",
    lessons: [
      { id: "rp-1", title: "Ask before you open", minutes: 20, brief: "What failed, when, liquid, last update." },
      { id: "rp-2", title: "Power and static", minutes: 25, brief: "Unplug, battery, ESD mat or at least a metal tap. No mains experiments." },
      { id: "rp-3", title: "Name the part honestly", minutes: 20, brief: "Screen vs board vs software. Do not invent a 'virus clean' fee." },
      { id: "rp-4", title: "Data you must not keep", minutes: 20, brief: "Wipe only with consent. Never copy photos." },
    ],
    sources: [
      { name: "AfDB / MoCDE digital literacy feasibility", url: "https://mocde.gov.gm/wp-content/uploads/2023/10/Feasibility-Study-on-Digital-Literacy-in-Gambia_Final-Report-1.pdf", licence: "GoTG/AfDB", use: "cite_link" },
      { name: "iFixit repair guides (link)", url: "https://www.ifixit.com/Guide", licence: "CC BY-NC-SA — link only", use: "cite_link" },
    ],
  },
  {
    id: "bookkeeping-gra",
    title: "Bookkeeping & GRA-aware records",
    sector: "Work readiness",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Shops, agents, small contractors.",
    summary: "Cashbook, receipts, what GRA language means. Not a tax-agent or GRA licence.",
    assessmentProgramId: "bookkeeping-gra",
    lessons: [
      { id: "bk-1", title: "Every dalasi has a line", minutes: 25, brief: "Date, in/out, what, who. Same day." },
      { id: "bk-2", title: "A receipt someone can audit", minutes: 20, brief: "Name, amount, date, your mark." },
      { id: "bk-3", title: "Personal vs business", minutes: 20, brief: "Do not eat the float. Transfer a wage to yourself on paper." },
      { id: "bk-4", title: "When to ask a real accountant", minutes: 15, brief: "VAT, staff, imports — stop guessing." },
    ],
    sources: [
      { name: "Gambia Digital Economy Master Plan", url: "https://mocde.gov.gm/wp-content/uploads/2023/10/Final-The-Gambia-Digital-Economy-Master-Plan-2023-20233.pdf", licence: "GoTG", use: "cite_link" },
      { name: "LibreOffice Calc guide", url: "https://documentation.libreoffice.org/", licence: "CC / public docs", use: "cite_link" },
    ],
  },
  {
    id: "teamwork-problems",
    title: "Teamwork & problem-solving at work",
    sector: "Work readiness",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Every first job. Employers score this lowest.",
    summary: "Name the problem, offer one option, do not hide a mistake. 2026 employer survey: weak problem-solving and teamwork.",
    assessmentProgramId: "teamwork-problems",
    lessons: [
      { id: "tw-1", title: "Say the problem, not the person", minutes: 20, brief: "The ice melted / the guest waited — not 'Lamin is lazy'." },
      { id: "tw-2", title: "One option plus a ask", minutes: 20, brief: "I can do A by 4pm if you approve B." },
      { id: "tw-3", title: "Mistakes surface early", minutes: 20, brief: "A late truth is cheaper than a cover-up." },
    ],
    sources: [
      { name: "Employer TVET satisfaction survey (Gambia, 2026)", url: "https://www.researchpublish.com/upload/book/The%20Alignment%20of%20Technical%20and%20Vocational-28022026-1.pdf", licence: "journal", use: "cite_link" },
    ],
  },
  {
    id: "fashion-digital",
    title: "Fashion, tailoring & digital sales",
    sector: "Creative trades",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Tailors and cloth sellers adding WhatsApp orders.",
    summary: "Measure, deposit, photo the cloth, deliver. Not a fashion-school diploma. Youth named tailoring as reliable work.",
    assessmentProgramId: "fashion-digital",
    lessons: [
      { id: "fa-1", title: "A measure you can repeat", minutes: 25, brief: "Write the numbers. Do not guess from a photo only." },
      { id: "fa-2", title: "Deposit and date", minutes: 20, brief: "Half up front, collection day, alteration window." },
      { id: "fa-3", title: "Sell the actual cloth", minutes: 20, brief: "Daylight photo of the client's fabric, not a stolen lookbook." },
    ],
    sources: [
      { name: "World Bank youth — tailors as reliable trades", url: "https://blogs.worldbank.org/en/nasikiliza/stop-solving-only-half-problem-human-capital-through-eyes-gambian-youth", licence: "WB", use: "cite_link" },
      { name: "Employer survey — fashion & tailoring", url: "https://www.researchpublish.com/upload/book/The%20Alignment%20of%20Technical%20and%20Vocational-28022026-1.pdf", licence: "journal", use: "cite_link" },
    ],
  },
  {
    id: "women-digital",
    title: "Women’s digital inclusion",
    sector: "Foundation",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Women sharing a phone, returning to work, or starting a stall.",
    summary: "Device access, safety, money, time. World Bank documents a gender digital-skills divide that includes The Gambia.",
    assessmentProgramId: "women-digital",
    lessons: [
      { id: "wd-1", title: "A phone you can actually use", minutes: 20, brief: "Your PIN, your SIM if possible, a charging plan." },
      { id: "wd-2", title: "Safety first", minutes: 25, brief: "OTP, stalking, sharing location, blocking." },
      { id: "wd-3", title: "Money without a middleman", minutes: 25, brief: "Your own wallet name. Family float is not yours to hide — write it." },
    ],
    sources: [
      { name: "World Bank — gender digital skills divide SSA", url: "https://thedocs.worldbank.org/en/doc/a607bb6e3b76d2be0f3db8db34dcf73e-0140022025/related/7EDU-WP-16-Analyzing-the-gender-digital-skills-divide-in-SSA.pdf", licence: "WB", use: "cite_link" },
      { name: "GSMA MISTT", url: "https://www.gsma.com/mobilefordevelopment/mistt/", licence: "CC BY 4.0", use: "cite_link" },
    ],
  },
  {
    id: "remittances-family",
    title: "Remittances & family finance",
    sector: "Fintech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Households living on diaspora sends.",
    summary: "Compare fees, record the receive, do not give OTP. Not a money-transfer licence.",
    assessmentProgramId: "remittances-family",
    lessons: [
      { id: "re-1", title: "Fee before you send", minutes: 20, brief: "Ask the corridor cost. A 'free' send is often in the rate." },
      { id: "re-2", title: "Receive like a bookkeeper", minutes: 20, brief: "Date, sender, dalasi, what it is for." },
      { id: "re-3", title: "Scams on the corridor", minutes: 20, brief: "Nobody from Western Union needs your PIN." },
    ],
    sources: [
      { name: "Gambia Digital Economy Master Plan", url: "https://mocde.gov.gm/wp-content/uploads/2023/10/Final-The-Gambia-Digital-Economy-Master-Plan-2023-20233.pdf", licence: "GoTG", use: "cite_link" },
      { name: "GSMA MISTT — Mobile Money", url: "https://www.gsma.com/mobilefordevelopment/mistt/", licence: "CC BY 4.0", use: "cite_link" },
    ],
  },
  {
    id: "tourism-product-photo",
    title: "Tourism product photography",
    sector: "Tourism",
    level: "beginner",
    status: "approved_outline",
    youthFit: "Lodges, tours, craft stalls adding a listing photo.",
    summary: "Add-on to phone photography: rooms, plates, craft — honest and consented.",
    assessmentProgramId: "tourism-product-photo",
    lessons: [
      { id: "tp-1", title: "The room as the guest will get it", minutes: 20, brief: "Shoot the actual room. No borrowed villa." },
      { id: "tp-2", title: "Food that still exists", minutes: 20, brief: "Today's plate, daylight, no stolen hotel stock." },
      { id: "tp-3", title: "People on tours", minutes: 15, brief: "Guests can refuse. Guides are workers, not props." },
    ],
    sources: [
      { name: "Wikibooks — Modern Photography / Composition", url: "https://en.wikibooks.org/wiki/Modern_Photography/Composition", licence: "CC BY-SA", use: "cite_link" },
      { name: "ITC Gambia tourism roadmap", url: "https://www.intracen.org/news-and-events/news/the-gambia-invests-in-jobs-for-youth-through-national-trade-roadmap", licence: "ITC", use: "cite_link" },
    ],
  },
  {
    id: "helpdesk-tester",
    title: "Helpdesk & app testing",
    sector: "Digital & Tech",
    level: "beginner",
    status: "approved_outline",
    youthFit: "More hireable locally than 'full stack' for many MSMEs.",
    summary: "Reproduce a bug, write steps, reset with consent. AfDB lists testers and web techs among needed ICT occupations.",
    assessmentProgramId: "helpdesk-tester",
    lessons: [
      { id: "ht-1", title: "Reproduce before you guess", minutes: 25, brief: "Device, steps, what you expected, what happened." },
      { id: "ht-2", title: "A ticket someone can act on", minutes: 20, brief: "One problem per note. Screenshot with no passwords." },
      { id: "ht-3", title: "Reset is a privilege", minutes: 20, brief: "Identity check. Never ask for OTP." },
    ],
    sources: [
      { name: "AfDB digital literacy feasibility — needed ICT occupations", url: "https://mocde.gov.gm/wp-content/uploads/2023/10/Feasibility-Study-on-Digital-Literacy-in-Gambia_Final-Report-1.pdf", licence: "GoTG/AfDB", use: "cite_link" },
    ],
  },
  {
    id: "google-digital-marketing",
    title: "Google Digital Garage (external)",
    sector: "Marketing",
    level: "beginner",
    status: "external_link_only",
    youthFit: "If you want Google’s own marketing certificate.",
    summary: "Free to take on Google’s site. Not OER. FORTIS will not copy it or re-issue their badge.",
    assessmentProgramId: "digital-marketing",
    lessons: [],
    sources: [
      { name: "Google Digital Garage / Skillshop", url: "https://skillshop.exceedlms.com/student/catalog", licence: "Google terms — link only", use: "cite_link" },
    ],
  },
];

export function programmeById(id: string): AcademyProgramme | undefined {
  return ACADEMY_PROGRAMMES.find((p) => p.id === id);
}

export function publicProgrammes() {
  return ACADEMY_PROGRAMMES.map((p) => ({
    id: p.id,
    title: p.title,
    sector: p.sector,
    level: p.level,
    status: p.status,
    youthFit: p.youthFit,
    summary: p.summary,
    lessonCount: p.lessons.length,
    sources: p.sources,
    assessmentProgramId: p.assessmentProgramId,
  }));
}

export function sectors(): string[] {
  return [...new Set(ACADEMY_PROGRAMMES.map((p) => p.sector))];
}
