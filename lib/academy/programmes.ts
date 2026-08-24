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
