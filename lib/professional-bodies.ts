export interface ProfessionalBody {
  id: string;
  name: string;
  acronym: string;
  type: "chamber_of_commerce" | "bar_association" | "medical_council" | "engineering_council" | "accounting_body" | "teachers_union" | "trade_union" | "press_union" | "agriculture_body" | "finance_body" | "health_council" | "cooperative" | "ict_association";
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
  services: string[];
  membershipRequirements: string;
  internationalAffiliations: string[];
}

export const PROFESSIONAL_BODIES: ProfessionalBody[] = [
  {
    id: "gcci",
    name: "Gambia Chamber of Commerce and Industry",
    acronym: "GCCI",
    type: "chamber_of_commerce",
    address: "Serrekunda, Kanifing Municipality",
    area: "Serrekunda",
    lat: 13.4388,
    lng: -16.6716,
    website: "https://www.gcci.gm",
    phone: "+220 4378082",
    email: "info@gcci.gm",
    yearEstablished: 1967,
    memberCount: "500+ businesses",
    description: "The Gambia's apex private sector organisation representing the interests of businesses across all sectors. Advocates for a business-friendly environment, facilitates B2B networking, and promotes Gambian exports. Key interlocutor with government on trade and investment policy.",
    services: [
      "Business registration support", "Trade certificates & attestations",
      "Business networking events", "Investment facilitation",
      "Export promotion", "Trade dispute mediation",
      "Business information & research", "SME development",
    ],
    membershipRequirements: "Any registered Gambian business. Annual membership fee (varies by company size). Certificate of business registration required.",
    internationalAffiliations: ["ICC (International Chamber of Commerce)", "ECOWAS Business Council", "AUC Business & Investment"],
  },
  {
    id: "gba",
    name: "Gambia Bar Association",
    acronym: "GBA",
    type: "bar_association",
    address: "Law Courts Complex, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    phone: "+220 4201188",
    email: "gambiabassociation@gmail.com",
    yearEstablished: 1970,
    memberCount: "400+ practising lawyers",
    description: "The professional association for all practising lawyers and legal professionals in The Gambia. Regulates the legal profession, sets ethical standards, and provides continuing legal education. Plays a vital role in rule of law advocacy and access to justice initiatives.",
    services: [
      "Lawyer regulation & discipline", "Annual Practising Certificates",
      "Legal Aid referrals", "Continuing Legal Education (CLE)",
      "Law library access", "Pro bono coordination",
      "Legal reform advocacy",
    ],
    membershipRequirements: "LLB or equivalent degree. Call to the Bar. Annual practising certificate from the Supreme Court. Good character. Continuing education obligations.",
    internationalAffiliations: ["African Bar Association", "Commonwealth Lawyers Association", "IBA (International Bar Association)"],
  },
  {
    id: "gmc",
    name: "Gambia Medical & Dental Council",
    acronym: "GMDC",
    type: "medical_council",
    address: "Ministry of Health, Banjul",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    phone: "+220 4228228",
    yearEstablished: 1974,
    memberCount: "800+ registered practitioners",
    description: "Statutory regulatory body for medical doctors, dentists, and allied health professionals. Maintains the medical register, licenses practitioners, and investigates complaints. Works to ensure safe and ethical medical practice across The Gambia.",
    services: [
      "Practitioner registration & licensing", "Annual practising certificates",
      "Foreign qualification recognition", "Continuing Medical Education (CME)",
      "Complaint investigation", "Medical standards enforcement",
    ],
    membershipRequirements: "MBBS or MBChB (or equivalent) from recognised institution. Provisional registration (internship year). Full registration after successful intern year. Annual renewal.",
    internationalAffiliations: ["West African Health Organisation (WAHO)", "African Medical Association", "Commonwealth Medical Association"],
  },
  {
    id: "gnmc",
    name: "Gambia Nurses and Midwives Council",
    acronym: "GNMC",
    type: "health_council",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5806,
    phone: "+220 4228125",
    yearEstablished: 1972,
    memberCount: "2,500+ registered nurses & midwives",
    description: "Statutory body regulating nursing and midwifery practice in The Gambia. Maintains the nursing register, accredits nursing schools, sets practice standards, and investigates professional misconduct. Critical to maternal and child health outcomes.",
    services: [
      "Nurse & midwife registration", "Annual practising certificates",
      "Nursing school accreditation", "Scope of practice guidance",
      "Professional standards", "Overseas recognition letters",
    ],
    membershipRequirements: "SRN, SEN, or SCM qualification from GNMC-accredited school. Pass GNMC licensing examination. Annual fee payment.",
    internationalAffiliations: ["International Council of Nurses (ICN)", "ECOWAS Nursing Council", "Commonwealth Nurses Federation"],
  },
  {
    id: "gea",
    name: "Gambia Engineers Association",
    acronym: "GEA",
    type: "engineering_council",
    address: "Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    yearEstablished: 1982,
    memberCount: "600+ registered engineers",
    description: "Professional body for practising engineers across all disciplines in The Gambia. Promotes engineering excellence, advocates for standards compliance in infrastructure projects, and provides a network for Gambian engineers in the public and private sectors.",
    services: [
      "Engineer registration & certification", "Continuing Professional Development (CPD)",
      "Technical standards guidance", "Project peer review",
      "Engineering awards programme", "Young engineers mentorship",
    ],
    membershipRequirements: "BSc/BEng or equivalent in engineering. Minimum 2 years professional experience for full membership. Graduate membership for recent graduates. Professional competency assessment.",
    internationalAffiliations: ["ECOWAS Engineering Council", "African Federation of Engineering Organisations (AFEO)", "Commonwealth Engineers Council"],
  },
  {
    id: "icag",
    name: "Institute of Chartered Accountants of The Gambia",
    acronym: "ICAG",
    type: "accounting_body",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    yearEstablished: 1991,
    memberCount: "300+ members",
    description: "The professional accounting body for Chartered Accountants in The Gambia. Works with ACCA and ICAEW to set professional standards. Regulates public accountants, promotes financial reporting standards, and provides professional development.",
    services: [
      "Chartered Accountant certification", "CPD training", "Audit standards guidance",
      "IFRS/IPSAS technical support", "Student training support",
      "Ethics investigation",
    ],
    membershipRequirements: "ACCA, ICAEW, or CIMA qualification (or equivalent). Practical experience requirement. Annual membership subscription. CPD compliance.",
    internationalAffiliations: ["ACCA (Associate member body)", "ICAEW (Partner)", "IFAC (International Federation of Accountants)", "PAFA (Pan-African Federation of Accountants)"],
  },
  {
    id: "gta",
    name: "Gambia Teachers Union",
    acronym: "GTU",
    type: "teachers_union",
    address: "Serrekunda, Kanifing Municipality",
    area: "Serrekunda",
    lat: 13.4388,
    lng: -16.6716,
    phone: "+220 4395118",
    yearEstablished: 1958,
    memberCount: "15,000+ teachers",
    description: "The largest and oldest trade union in The Gambia, representing teachers at all levels of the education system. Advocates for teachers' rights, salaries, and working conditions. A major social force in Gambian civil society and key partner in education reform.",
    services: [
      "Collective bargaining", "Teacher welfare & legal support",
      "Professional development training", "Benevolent fund",
      "Education policy advocacy", "Strike action (last resort)",
    ],
    membershipRequirements: "Practising teacher in Gambian school system (public or private). Monthly subscription deducted from salary.",
    internationalAffiliations: ["Education International (EI)", "Africa Union of Teachers (AUT)", "Commonwealth Teachers Group"],
  },
  {
    id: "gtuc",
    name: "Gambia Trades Union Congress",
    acronym: "GTUC",
    type: "trade_union",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5820,
    phone: "+220 4201177",
    yearEstablished: 1958,
    memberCount: "30,000+ workers",
    description: "The apex trade union federation coordinating all registered trade unions in The Gambia. Represents workers' interests in national wage negotiations, labour law reform, and social protection. Coordinates industrial action and mediates labour disputes.",
    services: [
      "Labour law advocacy", "Wage negotiation support",
      "Dispute resolution", "Worker legal aid",
      "Occupational health & safety", "Union capacity building",
    ],
    membershipRequirements: "Individual workers join sector-specific unions affiliated to GTUC.",
    internationalAffiliations: ["International Trade Union Confederation (ITUC)", "Organisation of African Trade Union Unity (OATUU)", "ECOWAS Social Partners"],
  },
  {
    id: "guj",
    name: "Gambia Press Union",
    acronym: "GPU",
    type: "press_union",
    address: "Kanifing, Kanifing Municipality",
    area: "Kanifing",
    lat: 13.4533,
    lng: -16.6723,
    website: "https://www.gambipressunion.org",
    phone: "+220 4374567",
    email: "info@gambipressunion.org",
    yearEstablished: 1978,
    memberCount: "500+ journalists",
    description: "Professional organisation for journalists and media practitioners in The Gambia. Defends press freedom, provides professional training, and advocates for media law reform. Particularly active post-2017 democratic transition in rebuilding independent media.",
    services: [
      "Press freedom advocacy", "Journalist accreditation",
      "Media law training", "Safety training for journalists",
      "Journalism ethics standards", "Legal support for journalists",
    ],
    membershipRequirements: "Practising journalist or media professional. Portfolio or employment evidence required. Annual subscription.",
    internationalAffiliations: ["International Federation of Journalists (IFJ)", "African Union of Journalists", "West Africa Journalists Association (WAJA)"],
  },
  {
    id: "gfwa",
    name: "Gambia Fishermen & Water Transport Workers Union",
    acronym: "GFWTWU",
    type: "trade_union",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4538,
    lng: -16.5849,
    phone: "+220 4228500",
    yearEstablished: 1965,
    memberCount: "8,000+ members",
    description: "Trade union representing artisanal fishermen, pirogue operators, fish processors, and river transport workers across The Gambia. Advocates for fishing rights, safety at sea, and fair prices for fish products. Plays important role in protecting coastal communities from large-scale industrial overfishing.",
    services: [
      "Collective bargaining", "Fishing rights advocacy",
      "Safety at sea training", "Emergency assistance fund",
      "Fish price negotiation", "Boat insurance facilitation",
    ],
    membershipRequirements: "Active fisherman or water transport worker. Monthly subscription.",
    internationalAffiliations: ["International Transport Workers Federation (ITF)", "African Fishworkers Forum", "ECOWAS Fisheries Committee"],
  },
  {
    id: "gampharm",
    name: "Gambia Pharmaceutical Society",
    acronym: "GPS-PHARM",
    type: "health_council",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    yearEstablished: 1988,
    memberCount: "200+ pharmacists",
    description: "Professional body for pharmacists and pharmaceutical scientists in The Gambia. Regulates pharmacy practice, advocates for rational medicines use, and provides continuing education. Partners with the Medicines Control Agency on drug quality and regulation.",
    services: [
      "Pharmacist registration", "Annual practising certificates",
      "Pharmacy premises inspection", "CPD training",
      "Rational medicines use advocacy", "Drug information service",
    ],
    membershipRequirements: "B.Pharm or equivalent. Internship year. GAMPHARM registration examination. Annual renewal.",
    internationalAffiliations: ["International Pharmaceutical Federation (FIP)", "African Pharmaceutical Federation", "Commonwealth Pharmacists Association"],
  },
  {
    id: "gra-professionals",
    name: "Gambia Revenue Authority — Tax Practitioners Association",
    acronym: "GRA-TPA",
    type: "finance_body",
    address: "Banjul, Capital City",
    area: "Banjul",
    lat: 13.4527,
    lng: -16.5774,
    website: "https://www.gra.gov.gm",
    phone: "+220 4229501",
    yearEstablished: 2005,
    memberCount: "250+ tax practitioners",
    description: "Professional association for tax consultants, accountants, and practitioners who represent clients before the Gambia Revenue Authority. Promotes high standards in tax practice and serves as the interface between the tax profession and the tax authority.",
    services: [
      "Tax practitioner registration", "GRA liaison",
      "Tax law updates & training", "Client representation support",
      "Tax dispute mediation", "Annual tax conference",
    ],
    membershipRequirements: "Accounting or legal qualification. Minimum 2 years tax experience. GRA-TPA competency assessment.",
    internationalAffiliations: ["African Tax Administration Forum (ATAF)", "ECOWAS Tax Practitioners Network"],
  },
  {
    id: "itag",
    name: "Information Technology Association of The Gambia",
    acronym: "ITAG",
    type: "ict_association",
    address: "Senegambia, Kololi, Kanifing Municipality, The Gambia",
    area: "Kololi",
    lat: 13.4540,
    lng: -16.7140,
    website: "https://itag.gm/",
    phone: "+220 2184824",
    email: "info@itag.gm",
    yearEstablished: 2004,
    memberCount: "200+ companies",
    description: "The official professional body for the ICT sector in The Gambia, recognised by the Ministry of Information and Communication Infrastructure (MoICI). ITAG promotes ICT growth, advocates for IT professionals, organises the annual ICT Expo, and facilitates collaboration between government, telcos, ISPs, universities, and international partners.",
    services: [
      "ICT sector advocacy", "Annual ITAG ICT Expo (October)",
      "ICT policy consultation", "Industry networking & B2B matching",
      "Digital skills promotion", "Tech startup support",
      "Government liaison on ICT regulation", "International partnership facilitation",
    ],
    membershipRequirements: "Any Gambian ICT company or professional. Corporate and individual membership tiers. Annual subscription.",
    internationalAffiliations: ["ECOWAS ICT Network", "African ICT Alliance", "ITU Sector Member"],
  },
];

export function getBodiesByType(type: ProfessionalBody["type"]): ProfessionalBody[] {
  return PROFESSIONAL_BODIES.filter(b => b.type === type);
}

export function searchBodies(query: string): ProfessionalBody[] {
  const q = query.toLowerCase();
  return PROFESSIONAL_BODIES.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.acronym.toLowerCase().includes(q) ||
    b.description.toLowerCase().includes(q) ||
    b.services.some(s => s.toLowerCase().includes(q)) ||
    b.internationalAffiliations.some(a => a.toLowerCase().includes(q))
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
