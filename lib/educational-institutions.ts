export interface EducationalInstitution {
  id: string;
  name: string;
  acronym: string;
  type: "public_university" | "private_university" | "vocational" | "monotechnic" | "military" | "paramilitary" | "nursing" | "teacher_training" | "research";
  category: "university" | "tvet" | "professional" | "research" | "specialised";
  address: string;
  area: string;
  lat: number;
  lng: number;
  website: string;
  phone?: string;
  email?: string;
  accreditation: string;
  programmes: string[];
  admissionRequirements: string;
  scholarshipInfo: string;
  description: string;
}

export const EDUCATIONAL_INSTITUTIONS: EducationalInstitution[] = [
  // ── PUBLIC UNIVERSITIES ──────────────────────────────────────────────────
  {
    id: "utg",
    name: "University of The Gambia",
    acronym: "UTG",
    type: "public_university",
    category: "university",
    address: "Serrekunda, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4549,
    lng: -16.6742,
    website: "https://www.utg.edu.gm",
    phone: "+220 4377870",
    email: "info@utg.edu.gm",
    accreditation: "NAQAA Accredited — Ministry of Higher Education",
    programmes: [
      "Law (LLB)", "Medicine & Surgery (MBBS)", "Pharmacy (B.Pharm)",
      "Computer Science (BSc)", "Engineering (BSc)", "Agriculture (BSc)",
      "Education (BEd)", "Business Administration (BBA)", "Nursing (BNSc)",
      "Environmental Science (BSc)", "Economics (BSc)", "Public Health (BSc)",
    ],
    admissionRequirements: "WASSCE/GABECE with 5 credits including English and Mathematics. UTGE entrance exam required for some programmes. Minimum age 17.",
    scholarshipInfo: "Government of The Gambia full scholarships available. Merit-based bursaries. World Bank and Islamic Development Bank scholarships. ECOWAS scholarship programme.",
    description: "The premier public university in The Gambia, established in 1999. Offers undergraduate and postgraduate programmes across six schools: Law, Medicine & Allied Health Sciences, Agriculture & Environmental Sciences, Business & Finance, Liberal Arts & Sciences, and Engineering.",
  },
  {
    id: "uset",
    name: "University of Science, Engineering and Technology",
    acronym: "USET",
    type: "public_university",
    category: "university",
    address: "Brikama, West Coast Region",
    area: "Brikama",
    lat: 13.2769,
    lng: -16.6517,
    website: "https://www.uset.edu.gm",
    phone: "+220 4484000",
    accreditation: "NAQAA Accredited — Ministry of Higher Education",
    programmes: [
      "Civil Engineering (BSc)", "Electrical Engineering (BSc)",
      "Mechanical Engineering (BSc)", "Computer Engineering (BSc)",
      "Information Technology (BSc)", "Renewable Energy (BSc)",
      "Architecture (BArch)", "Quantity Surveying (BSc)",
    ],
    admissionRequirements: "WASSCE with 5 credits including Mathematics, Physics, and English. Science-focused intake. Competitive entrance examination.",
    scholarshipInfo: "Government STEM scholarships. Chinese government scholarships for engineering programmes. Industry sponsorship through National Water & Electricity Company (NAWEC).",
    description: "Established to address The Gambia's critical need for STEM graduates. Focuses on science, engineering, and technology disciplines to support national infrastructure development and digital transformation.",
  },
  {
    id: "ueg",
    name: "University of Education, The Gambia",
    acronym: "UEG",
    type: "public_university",
    category: "university",
    address: "Banjul, Kombo North",
    area: "Banjul",
    lat: 13.4549,
    lng: -16.5885,
    website: "https://www.ueg.edu.gm",
    accreditation: "NAQAA Accredited — Ministry of Basic & Secondary Education",
    programmes: [
      "Bachelor of Education — Primary (BEd)", "Bachelor of Education — Secondary (BEd)",
      "Education Management (BEd)", "Educational Psychology (BEd)",
      "Curriculum Studies (BEd)", "Special Education (BEd)",
    ],
    admissionRequirements: "WASSCE with 5 credits including English. Teaching aptitude assessment. Relevant experience an advantage for mature entry.",
    scholarshipInfo: "Full government sponsorship for teacher training. Teaching Service Commission bonds graduates to 5 years of public school service.",
    description: "Dedicated teacher training university producing qualified educators for The Gambia's growing school system. Offers undergraduate and postgraduate education degrees aligned with national curriculum standards.",
  },
  {
    id: "mdi",
    name: "Management Development Institute",
    acronym: "MDI",
    type: "public_university",
    category: "university",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.mdi.edu.gm",
    phone: "+220 4374878",
    email: "info@mdi.edu.gm",
    accreditation: "NAQAA Accredited. ACCA, CIMA, CIPD affiliate centre",
    programmes: [
      "Business Administration (HND/BBA)", "Accounting & Finance (HND/BSc)",
      "Human Resource Management (HND)", "Public Administration (Diploma)",
      "Project Management (Diploma/Certificate)", "ACCA Professional Qualification",
      "CIMA Professional Qualification", "CIPD (HR) Qualification",
    ],
    admissionRequirements: "WASSCE with 5 credits or HND for degree entry. Professional programme entry via ACCA/CIMA/CIPD own requirements. Mature entry available.",
    scholarshipInfo: "Civil service bursaries for government employees. World Bank capacity building grants. UNDP public administration fellowships.",
    description: "The Gambia's leading management and professional education institution. Provides management training for public sector, NGOs, and private enterprise. ACCA, CIMA and CIPD affiliate examination centre.",
  },

  // ── PRIVATE UNIVERSITIES ─────────────────────────────────────────────────
  {
    id: "aiuwa",
    name: "American International University West Africa",
    acronym: "AIUWA",
    type: "private_university",
    category: "university",
    address: "Fajara, Kanifing Municipality",
    area: "Fajara",
    lat: 13.4694,
    lng: -16.6839,
    website: "https://www.aiuwa.edu.gm",
    phone: "+220 4496660",
    accreditation: "NAQAA Accredited. US regional accreditation recognition",
    programmes: [
      "Business Administration (BBA/MBA)", "Information Technology (BSc)",
      "Computer Science (BSc)", "International Relations (BA)",
      "Communication Studies (BA)", "Public Health (MPH)",
    ],
    admissionRequirements: "WASSCE with 5 credits or equivalent international qualifications. SAT/ACT optional. TOEFL/IELTS for non-English speakers.",
    scholarshipInfo: "Merit scholarships up to 50% tuition. Need-based financial aid. ECOWAS student exchange grants.",
    description: "American-style liberal arts university offering flexible credit-based programmes. Partners with US institutions for exchange programmes and joint degrees. Strong focus on entrepreneurship and global business.",
  },
  {
    id: "euclid",
    name: "EUCLID University",
    acronym: "EUCLID",
    type: "private_university",
    category: "university",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.euclid.int",
    email: "info@euclid.int",
    accreditation: "Inter-governmental organisation treaty-based mandate",
    programmes: [
      "International Law (LLM)", "Public Health (MPH)",
      "Diplomacy & International Affairs (MA)", "Sustainable Development (MSc)",
      "Islamic Finance (MSc)", "Global Health (DPH)",
    ],
    admissionRequirements: "Bachelor's degree for postgraduate entry. English proficiency required. Prior professional experience preferred for executive programmes.",
    scholarshipInfo: "Diplomatic and government employee fee waivers. Regional development scholarships. Online programme fee reductions.",
    description: "Inter-governmental university established by treaty, offering postgraduate-level distance and hybrid programmes in international law, public health, and sustainable development. Recognised by AU and ECOWAS.",
  },
  {
    id: "iou",
    name: "Islamic Online University",
    acronym: "IOU",
    type: "private_university",
    category: "university",
    address: "Serrekunda, Kanifing Municipality",
    area: "Serrekunda",
    lat: 13.4380,
    lng: -16.6680,
    website: "https://www.islamiconlineuniversity.com",
    accreditation: "NAQAA provisional recognition. Saudi accreditation in progress",
    programmes: [
      "Islamic Studies (BA)", "Arabic Language (BA)",
      "Psychology (BA)", "Business Administration (BBA)",
      "Education (BEd)", "Quran & Islamic Sciences (Certificate/Diploma)",
    ],
    admissionRequirements: "WASSCE or equivalent. Open entry for certificate programmes. Good character reference required.",
    scholarshipInfo: "Highly subsidised tuition ($12/semester for many programmes). Zakat-funded full scholarships for economically disadvantaged students.",
    description: "Tuition-free and low-cost Islamic university operating primarily online with a Gambian hub. One of the largest Islamic universities globally by enrolment, making higher education accessible across West Africa.",
  },
  {
    id: "alhikma",
    name: "Al-Hikma University",
    acronym: "AHU",
    type: "private_university",
    category: "university",
    address: "Latrikunda German, Kanifing",
    area: "Kanifing",
    lat: 13.4167,
    lng: -16.6533,
    website: "https://www.alhikma.edu.gm",
    accreditation: "NAQAA Accredited",
    programmes: [
      "Islamic Jurisprudence (LLB Sharia)", "Arabic & Islamic Studies (BA)",
      "Education & Islamic Studies (BEd)", "Quran Memorisation (Diploma)",
    ],
    admissionRequirements: "WASSCE with Arabic language qualification preferred. Islamic studies background recommended.",
    scholarshipInfo: "OIC scholarships. Saudi government partial sponsorships. Madrassah completion fee waivers.",
    description: "Private Islamic university providing traditional and contemporary Islamic education. Recognised by the Organisation of Islamic Cooperation (OIC) and serves the Gambian Muslim community.",
  },

  // ── VOCATIONAL / TVET ────────────────────────────────────────────────────
  {
    id: "gamtel-tvet",
    name: "Gambia Technical Training Institute",
    acronym: "GTTI",
    type: "vocational",
    category: "tvet",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4563,
    lng: -16.6697,
    website: "https://www.gtti.edu.gm",
    phone: "+220 4373561",
    accreditation: "NAQAA/TVET Authority. City & Guilds affiliate centre",
    programmes: [
      "Electrical Installation (NVQ Level 1–3)", "Plumbing & Gas Fitting",
      "Welding & Fabrication", "Motor Vehicle Technology",
      "Building & Construction", "Computer & IT Technician",
      "Air Conditioning & Refrigeration", "Electronics",
    ],
    admissionRequirements: "GABECE/WASSCE or equivalent. Basic numeracy and literacy. Physical fitness for trades. Minimum age 16.",
    scholarshipInfo: "Government TVET bursaries. EU Gambia TVET project scholarships. World Bank skills development grants.",
    description: "The Gambia's flagship technical and vocational training institute. Offers City & Guilds and NVQ-aligned programmes in construction, engineering, and technology trades. Key partner in national skills development strategy.",
  },
  {
    id: "nhia",
    name: "National Hotel & Tourism Institute of The Gambia",
    acronym: "NHTI",
    type: "vocational",
    category: "tvet",
    address: "Kotu, Kanifing Municipality",
    area: "Kotu",
    lat: 13.4433,
    lng: -16.7113,
    website: "https://www.nhti.edu.gm",
    accreditation: "NAQAA. City & Guilds Hospitality & Catering",
    programmes: [
      "Hotel Management (Diploma)", "Food & Beverage Service",
      "Culinary Arts & Catering", "Front Office Operations",
      "Housekeeping & Accommodation", "Tourism Operations",
      "Barista & Mixology (Certificate)",
    ],
    admissionRequirements: "GABECE/WASSCE or equivalent. Good command of English. Customer service aptitude test.",
    scholarshipInfo: "Tourism Board industry placement bursaries. Senegambia Hotel Partnership scholarships. EU tourism project grants.",
    description: "Specialist hospitality and tourism training institute serving The Gambia's substantial tourism industry. Graduates are highly sought by hotels, resorts, and tourism operators along the Senegambian coast.",
  },
  {
    id: "grts-media",
    name: "Gambia Radio & Television Services Media Institute",
    acronym: "GRTS-MI",
    type: "vocational",
    category: "tvet",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5806,
    website: "https://www.grts.gm",
    accreditation: "NAQAA provisional. NBC media skills certification",
    programmes: [
      "Broadcast Journalism (Diploma)", "Television Production",
      "Radio Broadcasting", "Media Studies (Certificate)",
      "Digital Media & Content Creation",
    ],
    admissionRequirements: "WASSCE with English language. Voice test for broadcasting applicants. Portfolio for media/production applicants.",
    scholarshipInfo: "GRTS staff training subsidies. UNESCO media development grants. African Union press freedom fellowships.",
    description: "Media training institute attached to the national broadcaster GRTS. Trains journalists, producers, and broadcast technicians for national and regional media organisations.",
  },
  {
    id: "gambiapolytechnic",
    name: "Gambia Polytechnic Institute",
    acronym: "GPI",
    type: "monotechnic",
    category: "tvet",
    address: "Brikama, West Coast Region",
    area: "Brikama",
    lat: 13.2805,
    lng: -16.6499,
    website: "https://www.gpi.edu.gm",
    accreditation: "NAQAA Accredited. HND validation by UTG",
    programmes: [
      "Civil & Structural Engineering (HND)", "Electrical Engineering (HND)",
      "Business Studies (HND)", "Computer Science (HND)",
      "Agricultural Technology (HND)", "Environmental Science (HND)",
    ],
    admissionRequirements: "WASSCE with 5 credits. Science-focused for engineering HNDs. 2-year programmes with mandatory industrial attachment.",
    scholarshipInfo: "TVET bursaries. AfDB technical training grants. Private sector sponsorship through GCCI.",
    description: "Polytechnic offering Higher National Diplomas validated by UTG. Strong industry links with mandatory work placement. Gateway qualification to UTG engineering and science degrees.",
  },
  {
    id: "giepa-skills",
    name: "GIEPA Skills & Enterprise Centre",
    acronym: "GIEPA-SEC",
    type: "vocational",
    category: "tvet",
    address: "Serrekunda, Kanifing Municipality",
    area: "Serrekunda",
    lat: 13.4388,
    lng: -16.6716,
    website: "https://www.giepa.gm",
    phone: "+220 4378082",
    accreditation: "GIEPA / Ministry of Trade",
    programmes: [
      "Entrepreneurship & Business Start-up", "Export Readiness Programme",
      "SME Financial Management", "Digital Business Skills",
      "Agribusiness Development", "Fashion & Textile Design",
    ],
    admissionRequirements: "No formal qualification required for most courses. Age 18+. Active business or business plan for enterprise programmes.",
    scholarshipInfo: "IFC SME programme grants. USAID enterprise development support. AfDB entrepreneurship awards.",
    description: "Gambia Investment & Export Promotion Agency's skills centre supporting SME development, export readiness, and entrepreneurship. Key pathway for micro-business owners and informal sector workers.",
  },
  {
    id: "nawec-training",
    name: "NAWEC Training Institute",
    acronym: "NAWEC-TI",
    type: "vocational",
    category: "tvet",
    address: "Bundung, Kanifing Municipality",
    area: "Bundung",
    lat: 13.4449,
    lng: -16.6550,
    website: "https://www.nawec.gm",
    phone: "+220 4374050",
    accreditation: "NAQAA. IEC electrical standards",
    programmes: [
      "Electrical Systems Technician", "Power Plant Operations",
      "Water Treatment Technology", "Solar & Renewable Energy Installation",
      "Industrial Instrumentation",
    ],
    admissionRequirements: "GTTI/Polytechnic electrical qualification or WASSCE with Physics & Mathematics. Internal NAWEC employees have priority intake.",
    scholarshipInfo: "NAWEC employee sponsorship. World Bank power sector capacity grants. GEF renewable energy training funds.",
    description: "In-house training institute of the National Water & Electricity Company. Produces qualified utility technicians and engineers for Gambia's water and power infrastructure. Open to external applicants with relevant technical background.",
  },

  // ── NURSING & ALLIED HEALTH ──────────────────────────────────────────────
  {
    id: "sns",
    name: "School of Nursing & Midwifery — Edward Francis Small Teaching Hospital",
    acronym: "SNM-EFSTH",
    type: "nursing",
    category: "specialised",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.efsth.gm",
    phone: "+220 4228223",
    accreditation: "Gambia Nurses & Midwives Council (GNMC). WHO affiliate clinical training centre",
    programmes: [
      "State Registered Nurse (SRN) — 3 years", "State Enrolled Nurse (SEN) — 2 years",
      "State Certified Midwife (SCM) — 18 months", "Community Health Nursing (Certificate)",
      "Peri-operative Nursing (Post-basic Diploma)",
    ],
    admissionRequirements: "WASSCE with Biology, Chemistry/Physics, and English at credit level. Medical fitness certificate. Minimum age 18. Competitive interview and aptitude test.",
    scholarshipInfo: "Government of The Gambia full sponsorship for all nursing students. WHO health workforce development bursaries. WHO-AFRO specialist training fellowships.",
    description: "The national nursing and midwifery school attached to EFSTH, Gambia's largest teaching hospital. Produces the majority of The Gambia's registered nurses and midwives. Clinical training integrated with hospital wards from Year 1.",
  },
  {
    id: "mrc-health-training",
    name: "MRC Unit The Gambia — Health Worker Training Programme",
    acronym: "MRCG-HTP",
    type: "research",
    category: "research",
    address: "Fajara, Kanifing Municipality",
    area: "Fajara",
    lat: 13.4694,
    lng: -16.6849,
    website: "https://www.mrc.gm",
    phone: "+220 4495442",
    email: "info@mrc.gm",
    accreditation: "London School of Hygiene & Tropical Medicine (LSHTM) — University of London",
    programmes: [
      "Clinical Trials Coordination (Certificate)", "Laboratory Sciences (HND/BSc)",
      "Field Epidemiology (Diploma)", "Data Management & Biostatistics",
      "Global Health Research Methods (MSc — LSHTM distance)", "Vaccinology",
    ],
    admissionRequirements: "Health/science background. Competitive selection. Some programmes require current employment in health sector. IELTS for LSHTM-linked programmes.",
    scholarshipInfo: "MRC/UKRI funded research training fellowships. Wellcome Trust Africa Programmes for Health. NIHR Global Health Research scholarships.",
    description: "World-renowned tropical medicine research institute operating since 1947. UK-Gambia bilateral institution conducting landmark infectious disease research. Trains Gambian and African health researchers to international standards.",
  },

  // ── MILITARY & PARAMILITARY ──────────────────────────────────────────────
  {
    id: "gaf-training",
    name: "Gambia Armed Forces Training School",
    acronym: "GAFTS",
    type: "military",
    category: "specialised",
    address: "Yundum, West Coast Region",
    area: "Yundum",
    lat: 13.3376,
    lng: -16.6521,
    website: "https://www.gaf.gov.gm",
    accreditation: "Ministry of Defence. ECOWAS security sector standards",
    programmes: [
      "Officer Cadet Training", "Non-Commissioned Officer Development",
      "Military Engineering", "Combat Medic Training",
      "Intelligence & Surveillance", "UN Peacekeeping Pre-deployment",
    ],
    admissionRequirements: "Gambian citizen. Physical fitness tests (BPFA). WASSCE for officer entry (5 credits). GCE for NCO entry. Age 18–25. Security clearance.",
    scholarshipInfo: "Military sponsorship covers all training costs. Selected officers receive foreign military training in Ghana, Senegal, UK, USA, and China. ECOWAS peacekeeping training grants.",
    description: "The training establishment of the Gambia Armed Forces. Conducts basic recruit training, officer cadet training, and specialist military skills. Prepares personnel for ECOWAS peacekeeping deployments.",
  },
  {
    id: "gps-training",
    name: "Gambia Police Force Training School",
    acronym: "GPS-TS",
    type: "paramilitary",
    category: "specialised",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    website: "https://www.police.gov.gm",
    accreditation: "Ministry of Interior. INTERPOL affiliate. ECOWAS Police Standards",
    programmes: [
      "Basic Police Training (6 months)", "Detective Training",
      "Traffic Management (Certificate)", "Community Policing",
      "Anti-corruption & Financial Crime", "Forensic Science (basic)",
      "Human Rights Policing",
    ],
    admissionRequirements: "Gambian citizen. GABECE minimum (officer entry: WASSCE). Physical fitness and medical examination. Background check and vetting. Age 18–30.",
    scholarshipInfo: "Government funding. INTERPOL specialist training fellowships. UNODC anti-corruption training grants. EU SSR programme secondments.",
    description: "Trains all recruits and serving officers of the Gambia Police Force. Curriculum includes human rights, community policing, and modern investigative techniques aligned with post-2017 security sector reform.",
  },
  {
    id: "gimmpa",
    name: "Gambia Institute of Management & Public Administration",
    acronym: "GIMPA",
    type: "public_university",
    category: "university",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4538,
    lng: -16.5789,
    website: "https://www.gimpa.edu.gm",
    phone: "+220 4201101",
    accreditation: "NAQAA Accredited. Civil Service Commission",
    programmes: [
      "Public Administration (Diploma/Degree)", "Policy Analysis & Governance",
      "Local Government Administration", "Financial Management (Public Sector)",
      "Human Resource Management (Public Sector)", "Procurement & Supply Chain",
    ],
    admissionRequirements: "Government employee or relevant private sector experience. WASSCE for direct entry. 3–5 years civil service experience for executive programmes.",
    scholarshipInfo: "Civil service training budget — most programmes fully funded for government employees. UNDP governance capacity building grants. Commonwealth Secretariat fellowships.",
    description: "The civil service training and management education institution. Builds public sector capacity for ministries, departments, and local government. Offers professional qualifications aligned with civil service career grades.",
  },

  // ── TEACHER TRAINING ─────────────────────────────────────────────────────
  {
    id: "gamcol",
    name: "Gambia College",
    acronym: "GAMCOL",
    type: "teacher_training",
    category: "specialised",
    address: "Brikama, West Coast Region",
    area: "Brikama",
    lat: 13.2780,
    lng: -16.6510,
    website: "https://www.gambiacollege.edu.gm",
    phone: "+220 4484217",
    accreditation: "NAQAA Accredited. Teaching Service Commission",
    programmes: [
      "Lower Basic Teacher Certificate (LBTC — 2 years)",
      "Upper Basic Teacher Certificate (UBTC — 2 years)",
      "Advanced Certificate in Education",
      "School of Agriculture (HND)",
      "School of Public Health & Nutrition (HND)",
      "School of Education Management",
    ],
    admissionRequirements: "WASSCE with 5 credits including English for certificate programmes. Government sponsorship normally required. Age limit 35 for initial training.",
    scholarshipInfo: "Government of The Gambia fully sponsors most GAMCOL teacher training places. UNICEF education sector support. GPE (Global Partnership for Education) grants.",
    description: "The Gambia's primary teacher training college, established 1978. Schools of Education, Agriculture, Public Health, and Nursing operate from this campus. Produces hundreds of qualified teachers annually for the national school system.",
  },

  // ── RESEARCH INSTITUTIONS ────────────────────────────────────────────────
  {
    id: "nari",
    name: "National Agricultural Research Institute",
    acronym: "NARI",
    type: "research",
    category: "research",
    address: "Yundum, West Coast Region",
    area: "Yundum",
    lat: 13.3300,
    lng: -16.6450,
    website: "https://www.nari.gm",
    phone: "+220 4484416",
    email: "nari@nari.gm",
    accreditation: "Ministry of Agriculture. CORAF/WECARD West Africa research network",
    programmes: [
      "Agricultural Research Attachment (Graduate)", "Agronomy Field Training",
      "Soil Science Research Methods", "Plant Breeding & Seed Systems",
      "Fisheries Research Placement", "Climate-smart Agriculture",
    ],
    admissionRequirements: "BSc Agriculture or related field for research placements. Graduate and postgraduate students only. UTG/GAMCOL partnerships for student placements.",
    scholarshipInfo: "CORAF/WECARD competitive research grants. FAO capacity building fellowships. IFAD agricultural innovation funds.",
    description: "The Gambia's national centre for agricultural research, development, and technology transfer. Conducts research in crop improvement, soil management, fisheries, and climate adaptation. Key partner for UTG and international agriculture research networks.",
  },
  {
    id: "gbos-training",
    name: "Gambia Bureau of Statistics — Statistical Training Centre",
    acronym: "GBOS-STC",
    type: "research",
    category: "research",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.gbos.gov.gm",
    phone: "+220 4375028",
    accreditation: "African Development Bank statistical capacity programme. UN Statistics Division",
    programmes: [
      "Official Statistics (Certificate)", "Survey Methods & Sampling",
      "Economic Statistics & National Accounts", "Demographic Analysis",
      "Geographic Information Systems (GIS)", "Data Management & Visualisation",
    ],
    admissionRequirements: "Civil servants and researchers with mathematics or statistics background. University students in statistics/economics eligible for attachment.",
    scholarshipInfo: "AfDB statistical capacity building grants. UN Statistics Division training support. World Bank data literacy programme.",
    description: "Training arm of the national statistics office. Builds statistical capacity across government ministries, NGOs, and the private sector. Produces Gambia's national accounts, census data, and official economic indicators.",
  },
];

export function getInstitutionsByType(type: EducationalInstitution["type"]): EducationalInstitution[] {
  return EDUCATIONAL_INSTITUTIONS.filter(i => i.type === type);
}

export function getInstitutionsByCategory(category: EducationalInstitution["category"]): EducationalInstitution[] {
  return EDUCATIONAL_INSTITUTIONS.filter(i => i.category === category);
}

export function searchInstitutions(query: string): EducationalInstitution[] {
  const q = query.toLowerCase();
  return EDUCATIONAL_INSTITUTIONS.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.acronym.toLowerCase().includes(q) ||
    i.area.toLowerCase().includes(q) ||
    i.programmes.some(p => p.toLowerCase().includes(q)) ||
    i.description.toLowerCase().includes(q)
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
