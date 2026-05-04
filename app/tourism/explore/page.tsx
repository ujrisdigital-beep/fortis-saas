"use client";

import { useState } from "react";
import GoogleEarthEmbed from "@/components/GoogleEarthEmbed";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

interface TourismSite {
  id: string;
  name: string;
  type: "unesco" | "national_park" | "nature_reserve" | "historic" | "beach" | "cultural" | "market";
  emoji: string;
  lat: number;
  lng: number;
  region: string;
  description: string;
  highlights: string[];
  bestTime?: string;
  admission?: string;
}

const SITES: TourismSite[] = [
  {
    id: "kunta-kinteh",
    name: "Kunta Kinteh Island",
    type: "unesco",
    emoji: "🏝️",
    lat: 13.3175,
    lng: -16.3617,
    region: "North Bank Region",
    description: "UNESCO World Heritage Site. Formerly known as James Island, this historic site was a key point in the transatlantic slave trade. Fort James ruins and a poignant museum tell the story of enslaved Africans shipped to the Americas.",
    highlights: ["UNESCO World Heritage", "Fort James ruins", "Slave trade history", "River cruise access", "Alex Haley connection"],
    bestTime: "Nov–Apr (dry season)",
    admission: "GMD 200 adult / GMD 100 child",
  },
  {
    id: "senegambian-stones",
    name: "Senegambian Stone Circles",
    type: "unesco",
    emoji: "🗿",
    lat: 13.691,
    lng: -15.522,
    region: "Central River Region",
    description: "UNESCO World Heritage Site shared with Senegal. Over 1,000 stone circles dating back to the 3rd century BC–16th century AD, believed to mark the burial sites of ancient kings and dignitaries.",
    highlights: ["UNESCO World Heritage", "1,000+ monuments", "Wassu & Kerr Batch sites", "Archaeological museum", "Iron Age archaeology"],
    bestTime: "Nov–Apr",
    admission: "GMD 150",
  },
  {
    id: "kiang-west",
    name: "Kiang West National Park",
    type: "national_park",
    emoji: "🦛",
    lat: 13.3333,
    lng: -15.9167,
    region: "Lower River Region",
    description: "The Gambia's largest national park covering 11,526 ha of savanna, forest, and mangroves along the south bank. Home to hippos, baboons, bushbucks, and over 300 bird species.",
    highlights: ["Hippo sightings", "300+ bird species", "Mangrove forests", "Bush walking safaris", "Baboon troops"],
    bestTime: "Nov–May",
    admission: "GMD 300 adult",
  },
  {
    id: "river-gambia-np",
    name: "River Gambia National Park",
    type: "national_park",
    emoji: "🦧",
    lat: 13.55,
    lng: -14.95,
    region: "Central River Region",
    description: "Home to the Chimpanzee Rehabilitation Project — one of Africa's oldest chimp sanctuaries. Five islands in the River Gambia protect habituated chimps rescued from the bush meat and pet trades.",
    highlights: ["Chimpanzee sanctuary", "Chimp island boat tours", "Manatees & hippos", "River Gambia scenery", "Conservation research"],
    bestTime: "Nov–Apr",
    admission: "Boat tours from GMD 800",
  },
  {
    id: "abuko",
    name: "Abuko Nature Reserve",
    type: "nature_reserve",
    emoji: "🐊",
    lat: 13.3958,
    lng: -16.6525,
    region: "West Coast Region",
    description: "The Gambia's oldest and smallest nature reserve — just 105 ha — but packed with wildlife including crocodiles, monitor lizards, patas monkeys, colobus monkeys, and 300+ bird species. A short drive from Banjul.",
    highlights: ["Crocodile pool", "300+ bird species", "Colobus monkeys", "Animal orphanage", "Nature trail"],
    bestTime: "Year-round",
    admission: "GMD 200",
  },
  {
    id: "bijilo",
    name: "Bijilo Forest Park",
    type: "nature_reserve",
    emoji: "🐒",
    lat: 13.4233,
    lng: -16.7217,
    region: "West Coast Region",
    description: "A coastal forest reserve bordering the tourist beach strip. Famous for habituated green vervet and red colobus monkeys that approach visitors. 5 km of nature trails through coastal woodland.",
    highlights: ["Habituated monkeys", "Coastal forest trails", "Bird watching", "Adjacent to beaches", "Easy day trip"],
    bestTime: "Year-round",
    admission: "GMD 150",
  },
  {
    id: "tanbi",
    name: "Tanbi Wetland Complex",
    type: "nature_reserve",
    emoji: "🦜",
    lat: 13.4667,
    lng: -16.5667,
    region: "West Coast Region",
    description: "A Ramsar-designated wetland of international importance surrounding the capital Banjul. Dense mangrove forests, mudflats, and tidal creeks support hundreds of bird species including migratory waders from Europe.",
    highlights: ["Ramsar wetland site", "Migratory birds", "Mangrove kayaking", "Mudflat wildlife", "Birdwatching tours"],
    bestTime: "Oct–Mar (bird migration)",
    admission: "Free (guided tours extra)",
  },
  {
    id: "james-island",
    name: "James Island & Fort Bullen",
    type: "historic",
    emoji: "🏰",
    lat: 13.488,
    lng: -16.545,
    region: "North Bank Region",
    description: "Fort Bullen on the north bank of the Gambia River faces James Island across the water — together they controlled the river mouth for centuries. Fort Bullen is a 19th-century British garrison still standing.",
    highlights: ["19th-century fort", "River mouth views", "Slave trade history", "Barra ferry access", "UNESCO linked site"],
    bestTime: "Nov–Apr",
    admission: "GMD 100",
  },
  {
    id: "albreda",
    name: "Albreda & Juffureh",
    type: "historic",
    emoji: "⚓",
    lat: 13.334,
    lng: -16.386,
    region: "North Bank Region",
    description: "Albreda was a French trading post; Juffureh is the ancestral village of Kunta Kinteh, made famous by Alex Haley's 'Roots'. Together they form the most visited heritage site in West Africa.",
    highlights: ["Roots heritage trail", "Juffureh village", "Kunta Kinteh Museum", "French trading history", "African diaspora tourism"],
    bestTime: "Nov–Apr",
    admission: "GMD 250 (combined ticket)",
  },
  {
    id: "georgetown",
    name: "Janjanbureh (Georgetown)",
    type: "historic",
    emoji: "🏛️",
    lat: 13.5333,
    lng: -14.7667,
    region: "Central River Region",
    description: "A historic island town on the Gambia River, Janjanbureh was the colonial capital of Bathurst's upcountry territory. The slave house, Methodist church, and colonial architecture are well preserved.",
    highlights: ["Slave house ruins", "Colonial architecture", "River island setting", "Methodist mission", "Chimp island nearby"],
    bestTime: "Nov–Apr",
    admission: "Free (donations welcomed)",
  },
  {
    id: "kololi-beach",
    name: "Kololi Beach",
    type: "beach",
    emoji: "🏖️",
    lat: 13.425,
    lng: -16.73,
    region: "West Coast Region",
    description: "The Gambia's most popular tourist beach — 3 km of golden sand along the Atlantic coast in the Senegambia tourist strip. Beach bars, water sports, and sunset views make it the social heart of coastal tourism.",
    highlights: ["Water sports", "Beach bars & restaurants", "Sunset views", "Tourist strip", "Safe swimming"],
    bestTime: "Nov–Apr",
    admission: "Free",
  },
  {
    id: "kotu-beach",
    name: "Kotu Beach",
    type: "beach",
    emoji: "🌊",
    lat: 13.423,
    lng: -16.725,
    region: "West Coast Region",
    description: "A quieter stretch of beach north of Kololi, popular with birdwatchers visiting Kotu Stream. The tidal creek at the back of the beach draws kingfishers, herons, and waders.",
    highlights: ["Birdwatching creek", "Quieter atmosphere", "Fishing village", "Sunbirds & kingfishers", "Kotu Stream nature walks"],
    bestTime: "Year-round",
    admission: "Free",
  },
  {
    id: "cape-point",
    name: "Cape Point Beach",
    type: "beach",
    emoji: "🌅",
    lat: 13.4,
    lng: -16.75,
    region: "West Coast Region",
    description: "The southernmost tourist beach, Cape Point is quieter and less developed than Kololi. The adjacent Cape Point Lighthouse is a landmark, and local fishing pirogues launch from the beach.",
    highlights: ["Lighthouse views", "Fishing pirogues", "Quiet atmosphere", "Local fish market", "Surfing potential"],
    bestTime: "Nov–Apr",
    admission: "Free",
  },
  {
    id: "national-museum",
    name: "National Museum of The Gambia",
    type: "cultural",
    emoji: "🏺",
    lat: 13.4545,
    lng: -16.5752,
    region: "Greater Banjul Area",
    description: "Located on Independence Drive in Banjul, the National Museum houses artefacts tracing Gambian history from the Stone Age through the pre-colonial kingdoms, colonial era, and independence. Kora instruments, costumes, and royal regalia on display.",
    highlights: ["Pre-colonial kingdoms", "Kora & musical instruments", "Royal regalia", "Colonial history", "Stone Age artefacts"],
    bestTime: "Year-round",
    admission: "GMD 50",
  },
  {
    id: "arch-22",
    name: "Arch 22",
    type: "cultural",
    emoji: "🏟️",
    lat: 13.455,
    lng: -16.577,
    region: "Greater Banjul Area",
    description: "A 35-metre triumphal arch marking the entrance to Banjul, built to commemorate the 1994 military coup. Climb to the viewing platform for panoramic views of the city and Gambia River estuary. A museum inside covers post-independence history.",
    highlights: ["Panoramic city views", "River estuary views", "Museum inside", "Iconic landmark", "Photography spot"],
    bestTime: "Year-round",
    admission: "GMD 50 (viewing platform)",
  },
  {
    id: "king-fahad-mosque",
    name: "King Fahad Mosque",
    type: "cultural",
    emoji: "🕌",
    lat: 13.454,
    lng: -16.678,
    region: "West Coast Region",
    description: "One of West Africa's largest mosques, built with Saudi Arabian funding and completed in 2009. The mosque complex can accommodate 10,000 worshippers and dominates the Banjul skyline with its twin minarets.",
    highlights: ["Twin minarets", "10,000 capacity", "Saudi-funded architecture", "Islamic art & calligraphy", "Guided tours available"],
    bestTime: "Year-round",
    admission: "Free (respectful dress required)",
  },
  {
    id: "banjul-cathedral",
    name: "Banjul Cathedral",
    type: "cultural",
    emoji: "⛪",
    lat: 13.4527,
    lng: -16.5716,
    region: "Greater Banjul Area",
    description: "The Cathedral of Our Lady of the Assumption, built in 1950, is the Catholic cathedral of Banjul. Its white colonial architecture and colourful stained glass are among the capital's most photographed buildings.",
    highlights: ["Colonial architecture", "Stained glass windows", "1950s heritage", "Banjul old town", "Catholic mission history"],
    bestTime: "Year-round",
    admission: "Free",
  },
  {
    id: "serrekunda-market",
    name: "Serrekunda Market",
    type: "market",
    emoji: "🛒",
    lat: 13.4385,
    lng: -16.6775,
    region: "West Coast Region",
    description: "The largest and most vibrant market in The Gambia — a sprawling open-air bazaar selling fresh produce, live chickens, fabrics, electronics, tailoring services, and street food. The commercial heart of Greater Banjul.",
    highlights: ["Fresh produce", "Fabric & tailoring", "Street food", "Busiest in The Gambia", "Cultural immersion"],
    bestTime: "Early morning (6–9am)",
    admission: "Free",
  },
  {
    id: "albert-market",
    name: "Albert Market",
    type: "market",
    emoji: "🏪",
    lat: 13.455,
    lng: -16.577,
    region: "Greater Banjul Area",
    description: "Banjul's historic central market, named after Prince Albert. A traditional covered market selling souvenirs, tie-dye fabrics, carvings, and fresh fish just steps from the ferry terminal — the first port of call for travellers arriving by ferry.",
    highlights: ["Souvenir shopping", "Tie-dye fabrics", "Wood carvings", "Banjul city centre", "Ferry terminal adjacent"],
    bestTime: "Mon–Sat, 8am–6pm",
    admission: "Free",
  },
  {
    id: "tanji-village",
    name: "Tanji Fishing Village",
    type: "cultural",
    emoji: "🐟",
    lat: 13.3617,
    lng: -16.7267,
    region: "West Coast Region",
    description: "West Africa's largest artisanal fishing beach, where hundreds of brightly painted pirogues land their catch each morning. The adjacent fish-smoking village and bird reserve make Tanji a full-day cultural and wildlife destination.",
    highlights: ["Artisanal fishing beach", "Pirogue landing spectacle", "Fish smoking village", "Bird reserve nearby", "Busiest at dawn"],
    bestTime: "Dawn (6–8am) for fish landing",
    admission: "Free",
  },
];

const TYPE_FILTERS = [
  { id: "all", label: "All Sites", emoji: "🗺️" },
  { id: "unesco", label: "UNESCO", emoji: "🏛️" },
  { id: "national_park", label: "National Parks", emoji: "🌿" },
  { id: "nature_reserve", label: "Nature Reserves", emoji: "🦜" },
  { id: "historic", label: "Historic Sites", emoji: "🏰" },
  { id: "beach", label: "Beaches", emoji: "🏖️" },
  { id: "cultural", label: "Cultural", emoji: "🎭" },
  { id: "market", label: "Markets", emoji: "🛒" },
];

const TYPE_COLORS: Record<string, string> = {
  unesco: "#7c3aed",
  national_park: "#14532d",
  nature_reserve: "#065f46",
  historic: "#92400e",
  beach: "#0369a1",
  cultural: "#1E3A5F",
  market: "#9a3412",
};

export default function TourismExplorePage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState<TourismSite | null>(SITES[0]);
  const [view, setView] = useState<"grid" | "earth">("grid");

  const filtered = SITES.filter(s => {
    const matchType = typeFilter === "all" || s.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.region.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const directionsUrl = selectedSite
    ? `https://www.google.com/maps/dir//${selectedSite.lat},${selectedSite.lng}`
    : "#";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 55%, #1a5c40 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🌍</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Explore The Gambia in 3D
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            20 iconic destinations — UNESCO World Heritage Sites, national parks, historic sites, beaches, and markets — viewable in Google Earth satellite and 3D.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["🏛️ 2 UNESCO Sites", "🌿 2 National Parks", "🦜 3 Nature Reserves", "🏰 4 Historic Sites", "🏖️ 3 Beaches", "🎭 4 Cultural", "🛒 2 Markets"].map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Controls */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search destinations, regions, or experiences…"
              style={{ width: "100%", padding: "10px 18px", borderRadius: 30, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TYPE_FILTERS.map(f => (
                <button key={f.id} onClick={() => { setTypeFilter(f.id); setSearch(""); }}
                  style={{ padding: "7px 16px", borderRadius: 30, border: typeFilter === f.id ? `2px solid ${G}` : "2px solid #E5E7EB", background: typeFilter === f.id ? G : "#fff", color: typeFilter === f.id ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setView("grid")}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: view === "grid" ? DARK : "#F3F4F6", color: view === "grid" ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ☰ Grid View
              </button>
              <button onClick={() => setView("earth")}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: view === "earth" ? DARK : "#F3F4F6", color: view === "earth" ? "#fff" : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🌍 3D Earth View
              </button>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>{filtered.length} destination{filtered.length !== 1 ? "s" : ""} found</p>

        {/* EARTH VIEW */}
        {view === "earth" && (
          <div style={{ marginBottom: 28 }}>
            {selectedSite && (
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.10)", marginBottom: 20 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 24 }}>{selectedSite.emoji}</span>
                      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: DARK }}>{selectedSite.name}</h2>
                      <span style={{ background: TYPE_COLORS[selectedSite.type] ?? "#666", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                        {TYPE_FILTERS.find(f => f.id === selectedSite.type)?.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>📍 {selectedSite.region} · {selectedSite.lat.toFixed(4)}°N, {Math.abs(selectedSite.lng).toFixed(4)}°W</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
                      style={{ background: DARK, color: "#fff", padding: "9px 16px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      🧭 Get Directions
                    </a>
                    {selectedSite.admission && (
                      <span style={{ background: "rgba(196,148,58,0.1)", color: DARK, padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
                        🎟️ {selectedSite.admission}
                      </span>
                    )}
                  </div>
                </div>
                <GoogleEarthEmbed lat={selectedSite.lat} lng={selectedSite.lng} name={selectedSite.name} height="500px" zoom={15} />
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px" }}>{selectedSite.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedSite.highlights.map((h, i) => (
                      <span key={i} style={{ background: "rgba(27,77,62,0.08)", color: G, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{h}</span>
                    ))}
                  </div>
                  {selectedSite.bestTime && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#6B7280" }}>🌤️ Best time to visit: <strong>{selectedSite.bestTime}</strong></div>
                  )}
                </div>
              </div>
            )}

            {/* Site selector pills */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Select a destination</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filtered.map(s => (
                  <button key={s.id} onClick={() => setSelectedSite(s)}
                    style={{
                      padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      border: selectedSite?.id === s.id ? `2px solid ${TYPE_COLORS[s.type] ?? G}` : "2px solid #E5E7EB",
                      background: selectedSite?.id === s.id ? TYPE_COLORS[s.type] ?? G : "#fff",
                      color: selectedSite?.id === s.id ? "#fff" : "#374151",
                    }}>
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18, marginBottom: 28 }}>
            {filtered.map(site => (
              <div key={site.id} style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${TYPE_COLORS[site.type] ?? G}`, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{site.emoji}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK, lineHeight: 1.3 }}>{site.name}</h3>
                    <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                      <span style={{ background: TYPE_COLORS[site.type] ?? "#666", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20 }}>
                        {TYPE_FILTERS.find(f => f.id === site.type)?.label}
                      </span>
                      <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20 }}>{site.region}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: "0 0 12px", flex: 1 }}>
                  {site.description.length > 160 ? site.description.slice(0, 160) + "…" : site.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                  {site.highlights.slice(0, 3).map((h, i) => (
                    <span key={i} style={{ background: "rgba(27,77,62,0.07)", color: G, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{h}</span>
                  ))}
                </div>
                {(site.bestTime || site.admission) && (
                  <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 11, color: "#6B7280" }}>
                    {site.bestTime && <span>🌤️ {site.bestTime}</span>}
                    {site.admission && <span>🎟️ {site.admission}</span>}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => { setSelectedSite(site); setView("earth"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    🌍 Google Earth 3D
                  </button>
                  <a href={`https://www.google.com/maps/dir//${site.lat},${site.lng}`} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#F3F4F6", color: "#374151", padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    🧭 Directions
                  </a>
                  <a href={`https://www.google.com/maps/place/${site.lat},${site.lng}/@${site.lat},${site.lng},17z/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#F3F4F6", color: "#374151", padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    🏙️ Street View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, border: "1.5px solid rgba(196,148,58,0.2)", borderRadius: 14, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: DARK, fontSize: 15, marginBottom: 8 }}>🗺️ Plan Your Gambia Journey</div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.6 }}>
            Explore UNESCO heritage sites, national parks, and beaches — or connect with local guides, hotels, and transport through FORTIS OS.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/tourism/discover" style={{ display: "inline-block", padding: "9px 20px", background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              🗺️ Discover Map →
            </a>
            <a href="/contact" style={{ display: "inline-block", padding: "9px 20px", background: "transparent", color: DARK, borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none", border: `1.5px solid ${GOLD}` }}>
              📧 Tourism Enquiry
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Destination data sourced from GToB, UNESCO, and NCAC. Admission prices are indicative and subject to change.<br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
