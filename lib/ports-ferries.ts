export interface MaritimeLocation {
  id: string;
  name: string;
  type: "international_port" | "vehicle_ferry" | "passenger_boat" | "fishing_port" | "marina";
  operator: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  website?: string;
  phone?: string;
  email?: string;
  description: string;
  services: string[];
  schedule?: string;
  capacity?: string;
  vesselCount?: number;
  crossingTime?: string;
  fare?: string;
}

export const MARITIME_LOCATIONS: MaritimeLocation[] = [
  // ── INTERNATIONAL PORT ───────────────────────────────────────────────────
  {
    id: "banjul-port",
    name: "Port of Banjul",
    type: "international_port",
    operator: "Gambia Ports Authority (GPA)",
    address: "Banjul Harbour, Banjul",
    region: "Banjul",
    lat: 13.4606,
    lng: -16.5817,
    website: "https://www.gambiaports.gm",
    phone: "+220 4227266",
    email: "info@gambiaports.gm",
    description: "The Gambia's only international seaport and a major hub for West African trade. Handles containers, bulk cargo, petroleum products, and Ro-Ro (roll-on/roll-off) vehicles. Serves as a transit port for Senegal, Guinea-Bissau, and landlocked countries. Annual throughput exceeds 600,000 tonnes.",
    services: [
      "Container handling", "Bulk cargo", "Ro-Ro vehicle terminal",
      "Petroleum/liquid bulk", "Passenger ferry terminal (Banjul–Barra)",
      "Pilotage & towage", "Customs clearance", "Freight forwarding",
      "Cold storage", "Bonded warehousing",
    ],
    capacity: "600,000+ tonnes annual capacity",
  },

  // ── VEHICLE FERRIES ──────────────────────────────────────────────────────
  {
    id: "banjul-barra-ferry",
    name: "Banjul–Barra Vehicle Ferry",
    type: "vehicle_ferry",
    operator: "Gambia Ports Authority (GPA)",
    address: "Banjul Ferry Terminal, Banjul Harbour",
    region: "Banjul / North Bank",
    lat: 13.4606,
    lng: -16.5830,
    website: "https://www.gambiaports.gm",
    phone: "+220 4227266",
    description: "The most important river crossing in The Gambia, linking the capital Banjul to the North Bank at Barra. Critical for commerce, transport, and tourism. The crossing takes approximately 35–45 minutes and operates from early morning to late evening.",
    services: ["Vehicle crossing (cars, trucks, lorries)", "Foot passengers", "Commercial freight", "Tourist vehicles"],
    schedule: "Continuous operation 06:00–22:00. Frequency every 1–2 hours depending on demand. Subject to weather and maintenance closures.",
    crossingTime: "35–45 minutes",
    fare: "Foot passenger: GMD 25. Car: GMD 350. Truck (varies by axle): GMD 800–3,500",
    vesselCount: 3,
  },
  {
    id: "farafenni-ferry",
    name: "Farafenni–Mansa Konko Ferry",
    type: "vehicle_ferry",
    operator: "Gambia Ferry Services",
    address: "Farafenni Ferry Landing, North Bank Region",
    region: "North Bank",
    lat: 13.5643,
    lng: -15.5972,
    description: "Vehicle ferry crossing the River Gambia at Farafenni, connecting the North Bank to the South Bank (Mansa Konko, Central River Region). Vital for Trans-Gambia Highway trade between Senegal's northern and southern territories.",
    services: ["Vehicle crossing", "Foot passengers", "Trans-Gambia cargo"],
    schedule: "Daily 07:00–19:00. Subject to river levels during dry season.",
    crossingTime: "45–60 minutes",
    fare: "Foot passenger: GMD 20. Car: GMD 300. Truck: GMD 700–2,500",
    vesselCount: 2,
  },
  {
    id: "janjanbureh-ferry",
    name: "Janjanbureh (Georgetown) Ferry",
    type: "vehicle_ferry",
    operator: "Gambia Ferry Services",
    address: "Georgetown Ferry Point, Central River Region",
    region: "Central River",
    lat: 13.5241,
    lng: -14.7680,
    description: "Vehicle and passenger ferry to Janjanbureh Island (McCarthy Island), linking the island town to both the North and South Banks. Important for river tourism and access to Janjanbureh's historic colonial heritage sites.",
    services: ["Vehicle crossing", "Foot passengers", "Tourist access to Janjanbureh Island"],
    schedule: "Daily 07:00–18:00. Short crossing — high frequency.",
    crossingTime: "10–15 minutes",
    fare: "Foot passenger: GMD 10. Car: GMD 150",
    vesselCount: 1,
  },
  {
    id: "yellitenda-ferry",
    name: "Yellitenda–Bambali Ferry",
    type: "vehicle_ferry",
    operator: "Gambia Ferry Services",
    address: "Yellitenda, West Kiang, LRR",
    region: "Lower River",
    lat: 13.3750,
    lng: -15.7850,
    description: "Vehicle and cargo ferry crossing at Yellitenda–Bambali on the Lower River. Connects Lower River Region communities to Central River Region. Key route for groundnut and agricultural produce transport.",
    services: ["Vehicle crossing", "Agricultural cargo", "Foot passengers"],
    schedule: "Daily 07:00–18:00",
    crossingTime: "30 minutes",
    fare: "Foot passenger: GMD 15. Car: GMD 250. Truck: GMD 600",
    vesselCount: 1,
  },
  {
    id: "kaur-ferry",
    name: "Kaur River Crossing",
    type: "vehicle_ferry",
    operator: "Community-operated / GPA oversight",
    address: "Kaur, North Bank Region",
    region: "North Bank",
    lat: 13.7041,
    lng: -15.5500,
    description: "River crossing at Kaur in the North Bank Region, providing access to farming communities on both banks. Serves groundnut farmers and local traders during the agricultural season.",
    services: ["Vehicle crossing (light vehicles)", "Foot passengers", "Agricultural produce"],
    schedule: "Seasonal operation. Peak: Oct–Apr groundnut season. Daily 07:00–17:00.",
    crossingTime: "20 minutes",
    fare: "Foot passenger: GMD 10. Car: GMD 200",
    vesselCount: 1,
  },

  // ── PASSENGER BOATS / PIROGUES ───────────────────────────────────────────
  {
    id: "banjul-barra-pirogue",
    name: "Banjul–Barra Passenger Pirogue",
    type: "passenger_boat",
    operator: "Private pirogue operators (licensed by GPA)",
    address: "Albert Market Jetty, Banjul",
    region: "Banjul",
    lat: 13.4562,
    lng: -16.5760,
    description: "Traditional wooden pirogues operating as a faster, cheaper alternative to the GPA vehicle ferry for foot passengers. Depart frequently from Albert Market Jetty and arrive at Barra. Informal but widely used by commuters and traders.",
    services: ["Foot passengers only", "Market trader cargo (limited)", "Tourist crossings"],
    schedule: "Irregular — depart when full. 05:30–20:00 approximately.",
    crossingTime: "20–25 minutes",
    fare: "GMD 50–80 per person",
    vesselCount: 15,
  },
  {
    id: "tendaba-boat",
    name: "Tendaba Camp River Boat Service",
    type: "passenger_boat",
    operator: "Tendaba Camp (Private)",
    address: "Tendaba, Kiang West, LRR",
    region: "Lower River",
    lat: 13.4075,
    lng: -15.8700,
    website: "https://www.tendaba.com",
    description: "Tourist river boat excursions from Tendaba Camp into Kiang West National Park. Excellent for birdwatching, hippo spotting, and experiencing the River Gambia's diverse wildlife. The camp is a key ecotourism destination.",
    services: ["Tourist river excursions", "Birdwatching trips", "Hippo watching", "Kiang West National Park access"],
    schedule: "By arrangement. Dawn and dusk trips recommended for wildlife.",
    crossingTime: "2–4 hours (excursion)",
    fare: "Approx GMD 500–1,200 per person for guided excursion",
    vesselCount: 3,
  },
  {
    id: "janjanbureh-boat-tour",
    name: "Janjanbureh River Boat Tours",
    type: "passenger_boat",
    operator: "Local tour operators (Janjanbureh)",
    address: "Georgetown Jetty, Janjanbureh Island",
    region: "Central River",
    lat: 13.5241,
    lng: -14.7680,
    description: "River boat tours from Janjanbureh Island exploring bird islands, chimpanzee sanctuary access at Baboon Islands, and the Upper River's remote communities. Central Gambia's prime river tourism experience.",
    services: ["Bird island tours", "Baboon Islands access", "Upper River excursions", "Cultural village visits"],
    schedule: "By arrangement with local tour operators.",
    crossingTime: "Half-day to full-day excursions",
    fare: "GMD 800–2,500 per person depending on tour",
    vesselCount: 4,
  },
  {
    id: "barra-creek-transport",
    name: "North Bank Creek Transport (Barra Region)",
    type: "passenger_boat",
    operator: "Community-operated",
    address: "Barra, North Bank Region",
    region: "North Bank",
    lat: 13.4718,
    lng: -16.5688,
    description: "Small boat services linking Barra to North Bank creek-side communities inaccessible by road. Essential for residents of fishing villages and mangrove-surrounded settlements during rainy season when roads flood.",
    services: ["Passenger transport", "Local cargo", "Fishing community access"],
    schedule: "Daily, morning and evening primarily. Market day (weekly) increased frequency.",
    crossingTime: "15–45 minutes depending on destination",
    fare: "GMD 15–50",
    vesselCount: 8,
  },
  {
    id: "albreda-james-island",
    name: "Albreda–James Island Historical Crossing",
    type: "passenger_boat",
    operator: "Local pirogue operators / National Museum",
    address: "Albreda Village Jetty, North Bank",
    region: "North Bank",
    lat: 13.3220,
    lng: -16.4850,
    description: "Boat crossing from Albreda to Kunta Kinteh Island (James Island), a UNESCO World Heritage Site. The island was a key site in the Atlantic slave trade, and the crossing is central to Gambia's heritage tourism. The village of Juffureh is nearby.",
    services: ["UNESCO heritage site access", "Historical tourism", "Juffureh village tours", "Roots homecoming pilgrimage"],
    schedule: "Daily during tourist season. Limited availability in off-season.",
    crossingTime: "10 minutes",
    fare: "GMD 200–400 including guide",
    vesselCount: 5,
  },

  // ── FISHING PORTS ────────────────────────────────────────────────────────
  {
    id: "tanji-fishing-port",
    name: "Tanji Fishing Port",
    type: "fishing_port",
    operator: "Department of Fisheries / GFWA",
    address: "Tanji Village, West Coast Region",
    region: "West Coast",
    lat: 13.3716,
    lng: -16.7483,
    description: "The largest artisanal fishing port in The Gambia. Home to hundreds of colourful pirogues and a major landing site for Atlantic fish species. Famous fish processing and smoking operations supply domestic and export markets. Popular with tourists for sunrise fish landings.",
    services: [
      "Artisanal fishing fleet base", "Fish landing & auction",
      "Fish smoking & drying", "Ice production", "Cold storage",
      "Fishing gear supply", "Boat repair & maintenance",
    ],
    capacity: "300+ pirogues. 5,000–8,000 kg daily landing capacity",
    vesselCount: 350,
  },
  {
    id: "banjul-fishing-port",
    name: "Banjul Fishing Harbour",
    type: "fishing_port",
    operator: "Gambia Ports Authority / Department of Fisheries",
    address: "Banjul Harbour (south side), Banjul",
    region: "Banjul",
    lat: 13.4538,
    lng: -16.5849,
    website: "https://www.gambiaports.gm",
    description: "Semi-industrial fishing harbour adjacent to the main Banjul port. Handles both artisanal and small-scale industrial fishing vessels. EU-funded upgrades in recent years improved cold chain facilities for export-quality fish processing.",
    services: [
      "Industrial fishing vessel berths", "Fish processing facility",
      "Cold chain & refrigeration", "Ice plant", "Export processing",
      "Fuel bunkering for fishing vessels",
    ],
    capacity: "50 commercial + 150 artisanal vessels",
    vesselCount: 200,
  },
  {
    id: "gunjur-fishing-port",
    name: "Gunjur Fishing Village & Port",
    type: "fishing_port",
    operator: "Community / GFWA",
    address: "Gunjur Village, West Coast Region",
    region: "West Coast",
    lat: 13.2043,
    lng: -16.7342,
    description: "Major fishing community with a significant pirogue fleet operating offshore. Gunjur has been at the centre of controversy over Chinese-owned fish meal factories impacting local fishing communities and the marine environment. Community fishing rights are actively protected.",
    services: ["Artisanal fishing fleet", "Fish landing", "Community fish market", "Boat building"],
    capacity: "200+ pirogues",
    vesselCount: 220,
  },

  // ── MARINAS ──────────────────────────────────────────────────────────────
  {
    id: "kombo-beach-marina",
    name: "Kololi Marina / Senegambia Boat Club",
    type: "marina",
    operator: "Private — Senegambia Beach Hotel area",
    address: "Kololi Beach, Kanifing Municipality",
    region: "Kanifing",
    lat: 13.4328,
    lng: -16.7259,
    description: "Small leisure marina and boat club on the Senegambia tourist coast. Offers sport fishing charters, leisure cruises, and private boat moorings. Popular with visiting yachtsmen and the expatriate community. Sunset dolphin-watching trips depart from here.",
    services: [
      "Private boat moorings", "Sport fishing charters",
      "Dolphin & sunset cruises", "Yacht fuel & provisions",
      "Water sports equipment hire", "Restaurant & bar",
    ],
    capacity: "30 berths",
  },
  {
    id: "denton-bridge-marina",
    name: "Denton Bridge Leisure Marina",
    type: "marina",
    operator: "Private operators",
    address: "Denton Bridge, Banjul–Serrekunda Road",
    region: "Kanifing",
    lat: 13.4507,
    lng: -16.6410,
    description: "Small marina under Denton Bridge on the Oyster Creek estuary. Offers boat hire, fishing trips into the creeks and mangroves, and kayaking. A gateway to the Tanbi Wetlands National Park. Renowned birdwatching destination accessible by boat.",
    services: [
      "Boat hire", "Creek & mangrove fishing", "Kayaking",
      "Tanbi Wetlands access", "Birdwatching trips",
      "Crab & prawn fishing excursions",
    ],
    capacity: "15–20 vessels",
    vesselCount: 12,
  },
];

export function getLocationsByType(type: MaritimeLocation["type"]): MaritimeLocation[] {
  return MARITIME_LOCATIONS.filter(l => l.type === type);
}

export function getLocationsByRegion(region: string): MaritimeLocation[] {
  return MARITIME_LOCATIONS.filter(l =>
    l.region.toLowerCase().includes(region.toLowerCase())
  );
}

export function searchLocations(query: string): MaritimeLocation[] {
  const q = query.toLowerCase();
  return MARITIME_LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.region.toLowerCase().includes(q) ||
    l.operator.toLowerCase().includes(q) ||
    l.description.toLowerCase().includes(q) ||
    l.services.some(s => s.toLowerCase().includes(q))
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
