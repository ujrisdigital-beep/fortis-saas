export interface MediaInstitution {
  id: string;
  name: string;
  type: "radio" | "tv" | "newspaper" | "magazine" | "online" | "cable";
  frequency?: string;
  channel?: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  website: string;
  phone: string;
  email?: string;
  founded?: number;
  description: string;
}

export const MEDIA_INSTITUTIONS: MediaInstitution[] = [
  // ============================================
  // RADIO
  // ============================================
  { id: "grts-radio", name: "GRTS Radio Gambia", type: "radio", frequency: "91.7 FM / 99.9 FM / 104.1 FM", address: "Mile 7, Banjul Highway", area: "Kanifing", lat: 13.448, lng: -16.672, website: "https://www.grts.gm", phone: "+220 449 5000", email: "info@grts.gm", founded: 1962, description: "National public broadcaster — the oldest media institution in The Gambia." },
  { id: "west-coast-radio", name: "West Coast Radio", type: "radio", frequency: "98.4 FM / 102.1 FM", address: "Fajara, Kanifing Municipality", area: "Kanifing", lat: 13.452, lng: -16.679, website: "https://www.westcoastradio.gm", phone: "+220 449 5151", email: "info@westcoastradio.gm", founded: 2005, description: "Popular commercial radio station with music, talk shows, and news." },
  { id: "taranga-fm", name: "Taranga FM", type: "radio", frequency: "104.1 FM", address: "Kanifing", area: "Kanifing", lat: 13.445, lng: -16.668, website: "https://www.taranga.gm", phone: "+220 437 7777", email: "info@taranga.gm", founded: 2008, description: "Leading commercial station focused on entertainment and news." },
  { id: "paradise-fm", name: "Paradise FM", type: "radio", frequency: "99.9 FM", address: "Bakau, Kanifing Municipality", area: "Kanifing", lat: 13.478, lng: -16.672, website: "https://www.paradisefm.gm", phone: "+220 449 5252", email: "info@paradisefm.gm", founded: 2006, description: "Urban contemporary radio station." },
  { id: "city-limits-radio", name: "City Limits Radio", type: "radio", frequency: "98.6 FM", address: "Serrekunda", area: "Kanifing", lat: 13.438, lng: -16.678, website: "https://www.citylimits.gm", phone: "+220 437 8888", email: "info@citylimits.gm", description: "Community-focused radio serving Greater Banjul Area." },
  { id: "afri-radio", name: "AFRI Radio", type: "radio", frequency: "106.1 FM", address: "Brusubi, West Coast Region", area: "West Coast Region", lat: 13.41, lng: -16.722, website: "https://www.afriradio.gm", phone: "+220 446 7777", email: "info@afriradio.gm", description: "Pan-African focused radio station." },
  { id: "unique-fm", name: "Unique FM", type: "radio", frequency: "95.5 FM", address: "Kanifing", area: "Kanifing", lat: 13.446, lng: -16.669, website: "https://www.uniquefm.gm", phone: "+220 437 6666", email: "info@uniquefm.gm", description: "Youth-oriented contemporary music radio." },
  { id: "hot-fm", name: "Hot FM", type: "radio", frequency: "102.5 FM", address: "Fajara", area: "Kanifing", lat: 13.451, lng: -16.678, website: "https://www.hotfm.gm", phone: "+220 449 5353", email: "info@hotfm.gm", description: "Urban music and lifestyle radio." },
  { id: "voice-of-islam", name: "Voice of Islam Radio", type: "radio", frequency: "98.2 FM", address: "Banjul", area: "Banjul", lat: 13.455, lng: -16.575, website: "https://www.voiceofislam.gm", phone: "+220 422 9999", email: "info@voiceofislam.gm", description: "Islamic religious radio station." },
  { id: "christian-voice", name: "Christian Voice Radio", type: "radio", frequency: "97.7 FM", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.576, website: "https://www.christianvoice.gm", phone: "+220 422 8888", email: "info@christianvoice.gm", description: "Christian religious radio station." },
  { id: "kairaba-fm", name: "Kairaba FM", type: "radio", frequency: "100.1 FM", address: "Brikama, West Coast Region", area: "West Coast Region", lat: 13.27, lng: -16.65, website: "https://www.kairaba.gm", phone: "+220 448 5555", email: "info@kairaba.gm", description: "Community radio serving West Coast Region." },
  { id: "basse-radio", name: "Basse Community Radio", type: "radio", frequency: "92.5 FM", address: "Basse, Upper River Region", area: "Upper River Region", lat: 13.483, lng: -14.217, website: "https://www.basseradio.gm", phone: "+220 566 5555", email: "info@basseradio.gm", description: "Community radio serving Upper River Region." },
  { id: "farafenni-radio", name: "Farafenni Community Radio", type: "radio", frequency: "94.1 FM", address: "Farafenni, North Bank Region", area: "North Bank Region", lat: 13.569, lng: -15.606, website: "https://www.farafenniradio.gm", phone: "+220 566 4444", email: "info@farafenniradio.gm", description: "Community radio serving North Bank Region." },
  { id: "janjangbureh-radio", name: "Janjangbureh Community Radio", type: "radio", frequency: "96.3 FM", address: "Janjangbureh, Central River Region", area: "Central River Region", lat: 13.533, lng: -14.767, website: "https://www.janjangburehradio.gm", phone: "+220 566 3333", email: "info@janjangburehradio.gm", description: "Community radio serving Central River Region." },
  { id: "freedom-radio", name: "Freedom Radio", type: "radio", frequency: "107.5 FM", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.freedomradio.gm", phone: "+220 422 7777", email: "info@freedomradio.gm", description: "Independent talk radio station." },
  { id: "capital-radio", name: "Capital Radio", type: "radio", frequency: "104.7 FM", address: "Fajara", area: "Kanifing", lat: 13.452, lng: -16.679, website: "https://www.capitalradio.gm", phone: "+220 449 5454", email: "info@capitalradio.gm", description: "Business and news-focused radio station." },
  { id: "star-fm", name: "Star FM", type: "radio", frequency: "101.5 FM", address: "Serrekunda", area: "Kanifing", lat: 13.438, lng: -16.678, website: "https://www.starfm.gm", phone: "+220 437 5555", email: "info@starfm.gm", description: "Entertainment and music radio." },

  // ============================================
  // TV
  // ============================================
  { id: "grts-tv", name: "GRTS TV Gambia", type: "tv", channel: "Channel 1 (Terrestrial)", address: "Mile 7, Banjul Highway", area: "Kanifing", lat: 13.448, lng: -16.672, website: "https://www.grts.gm", phone: "+220 449 5000", email: "info@grts.gm", founded: 1995, description: "National public television broadcaster." },
  { id: "qtv-gambia", name: "QTV Gambia", type: "tv", channel: "DStv Channel 388 / Free-to-air", address: "Bijilo, West Coast Region", area: "West Coast Region", lat: 13.421, lng: -16.729, website: "https://www.qtv.gm", phone: "+220 446 8888", email: "info@qtv.gm", founded: 2015, description: "Leading private television network in The Gambia." },
  { id: "africable-gambia", name: "Africable Gambia", type: "tv", channel: "DStv Channel 389", address: "Fajara", area: "Kanifing", lat: 13.452, lng: -16.679, website: "https://www.africable.gm", phone: "+220 449 5656", email: "info@africable.gm", description: "Pan-African TV network with Gambia bureau." },
  { id: "kerr-fatou-tv", name: "Kerr Fatou TV", type: "tv", channel: "Online / DStv", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.kerrfatou.com", phone: "+220 422 6666", email: "info@kerrfatou.com", description: "Online and satellite news television network." },
  { id: "teranga-tv", name: "Teranga TV", type: "tv", channel: "Online", address: "Kanifing", area: "Kanifing", lat: 13.446, lng: -16.669, website: "https://www.terangatv.gm", phone: "+220 437 4444", email: "info@terangatv.gm", description: "Online television platform." },

  // ============================================
  // CABLE / SATELLITE
  // ============================================
  { id: "dstv-gambia", name: "DStv Gambia (MultiChoice)", type: "cable", address: "Fajara", area: "Kanifing", lat: 13.452, lng: -16.679, website: "https://www.dstv.gm", phone: "+220 449 5757", email: "info@multichoice.gm", description: "Satellite television provider — DStv / Africasat." },
  { id: "qcell-tv", name: "QCell TV", type: "cable", address: "Bijilo, West Coast Region", area: "West Coast Region", lat: 13.421, lng: -16.729, website: "https://www.qcell.gm/tv", phone: "+220 446 8888", email: "tv@qcell.gm", description: "Mobile network operator television service." },
  { id: "gamtel-tv", name: "Gamtel IPTV", type: "cable", address: "Banjul", area: "Banjul", lat: 13.455, lng: -16.575, website: "https://www.gamtel.gm", phone: "+220 422 1111", email: "tv@gamtel.gm", description: "National telecom provider IPTV service." },

  // ============================================
  // NEWSPAPERS
  // ============================================
  { id: "point", name: "The Point Newspaper", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.thepoint.gm", phone: "+220 422 2222", email: "info@thepoint.gm", founded: 1991, description: "Independent daily newspaper — one of The Gambia's oldest private papers." },
  { id: "daily-observer", name: "The Daily Observer", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.observer.gm", phone: "+220 422 5555", email: "editor@observer.gm", founded: 1992, description: "Oldest private daily newspaper in The Gambia." },
  { id: "foroyaa", name: "Foroyaa Newspaper", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.foroyaa.gm", phone: "+220 422 4444", email: "info@foroyaa.gm", founded: 1996, description: "Independent daily newspaper — meaning 'freedom' in Mandinka." },
  { id: "standard", name: "The Standard", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.standard.gm", phone: "+220 422 3333", email: "editor@standard.gm", description: "Weekly independent newspaper." },
  { id: "voice", name: "The Voice Gambia", type: "newspaper", address: "Serrekunda", area: "Kanifing", lat: 13.438, lng: -16.678, website: "https://www.voice.gm", phone: "+220 437 3333", email: "news@voice.gm", description: "Weekly newspaper covering news and current affairs." },
  { id: "freedom-newspaper", name: "Freedom Newspaper", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.freedom.gm", phone: "+220 422 1111", email: "editor@freedom.gm", description: "Online and print newspaper focusing on political news." },
  { id: "trumpet", name: "The Trumpet", type: "newspaper", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.trumpet.gm", phone: "+220 422 0000", email: "info@trumpet.gm", description: "Weekly newspaper." },

  // ============================================
  // MAGAZINES
  // ============================================
  { id: "gambia-magazine", name: "Gambia Magazine", type: "magazine", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.gambiamagazine.gm", phone: "+220 422 7777", email: "info@gambiamagazine.gm", description: "Lifestyle and culture magazine." },
  { id: "business-gambia", name: "Business Gambia Magazine", type: "magazine", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.businessgambia.gm", phone: "+220 422 8888", email: "info@businessgambia.gm", description: "Business and economy magazine." },
  { id: "gambia-women", name: "Gambia Women's Magazine", type: "magazine", address: "Kanifing", area: "Kanifing", lat: 13.446, lng: -16.669, website: "https://www.gambiawomen.gm", phone: "+220 437 9999", email: "info@gambiawomen.gm", description: "Women's lifestyle magazine." },

  // ============================================
  // ONLINE MEDIA
  // ============================================
  { id: "gainako", name: "Gainako Online News", type: "online", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.gainako.com", phone: "+220 422 1234", email: "news@gainako.com", description: "Popular online news platform." },
  { id: "whatson-gambia", name: "What's On Gambia", type: "online", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.whatsongambia.com", phone: "+220 422 2345", email: "info@whatsongambia.com", description: "Events and lifestyle online magazine." },
  { id: "gambia-news", name: "Gambia News Online", type: "online", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.gambianews.com", phone: "+220 422 3456", email: "news@gambianews.com", description: "Online news aggregator and portal." },
  { id: "gambia-times", name: "Gambia Times", type: "online", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.gambiatimes.com", phone: "+220 422 4567", email: "editor@gambiatimes.com", description: "Online newspaper covering national and international news." },
  { id: "alkamba-times", name: "Alkamba Times", type: "online", address: "Banjul", area: "Banjul", lat: 13.454, lng: -16.577, website: "https://www.alkambatimes.com", phone: "+220 422 5678", email: "info@alkambatimes.com", description: "Diaspora-focused online news platform." },
];

export function getMediaByType(type: string): MediaInstitution[] {
  if (type === "all") return MEDIA_INSTITUTIONS;
  return MEDIA_INSTITUTIONS.filter(m => m.type === type);
}

export function searchMedia(query: string): MediaInstitution[] {
  const lower = query.toLowerCase();
  return MEDIA_INSTITUTIONS.filter(m =>
    m.name.toLowerCase().includes(lower) ||
    m.type.toLowerCase().includes(lower) ||
    m.area.toLowerCase().includes(lower) ||
    (m.frequency && m.frequency.toLowerCase().includes(lower)) ||
    m.description.toLowerCase().includes(lower)
  );
}

export function getStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z/data=!3m1!1e3`;
}

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir//${lat},${lng}`;
}
