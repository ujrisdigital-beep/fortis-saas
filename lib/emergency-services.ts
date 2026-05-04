export interface EmergencyService {
  id: string;
  name: string;
  type: "hospital" | "police" | "fire";
  region: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  emergencyPhone?: string;
  hours: string;
  services?: string[];
}

export const EMERGENCY_SERVICES: EmergencyService[] = [
  // ============================================
  // HOSPITALS
  // ============================================
  { id: "efsth", name: "Edward Francis Small Teaching Hospital", type: "hospital", region: "Banjul", address: "Banjul", lat: 13.456, lng: -16.573, phone: "+220 422 7222", emergencyPhone: "+220 422 7222", hours: "24/7", services: ["Emergency", "Surgery", "Maternity", "Pediatrics", "ICU"] },
  { id: "bundung", name: "Bundung Hospital", type: "hospital", region: "Kanifing", address: "Bundung, Kanifing Municipality", lat: 13.442, lng: -16.668, phone: "+220 437 5000", hours: "24/7", services: ["General Medicine", "Maternity", "Outpatient"] },
  { id: "serrekunda-hc", name: "Serrekunda Health Centre", type: "hospital", region: "Kanifing", address: "Serrekunda", lat: 13.438, lng: -16.678, phone: "+220 437 6000", hours: "24/7", services: ["Outpatient", "Maternity", "Pharmacy"] },
  { id: "bakau-hc", name: "Bakau Health Centre", type: "hospital", region: "Kanifing", address: "Bakau New Town", lat: 13.478, lng: -16.672, phone: "+220 449 6100", hours: "8am–10pm", services: ["Outpatient", "Pharmacy", "ANC"] },
  { id: "brikama-dh", name: "Brikama District Hospital", type: "hospital", region: "West Coast", address: "Brikama", lat: 13.27, lng: -16.65, phone: "+220 448 4000", hours: "24/7", services: ["Emergency", "General Medicine", "Maternity", "Surgery"] },
  { id: "sibanor-hc", name: "Sibanor Health Centre", type: "hospital", region: "West Coast", address: "Sibanor", lat: 13.25, lng: -16.22, phone: "+220 448 5200", hours: "8am–6pm", services: ["Outpatient", "Maternity"] },
  { id: "farafenni-dh", name: "Farafenni District Hospital", type: "hospital", region: "North Bank", address: "Farafenni", lat: 13.57, lng: -15.61, phone: "+220 566 5000", hours: "24/7", services: ["Emergency", "General Medicine", "Maternity", "Surgery"] },
  { id: "kerewan-hc", name: "Kerewan Health Centre", type: "hospital", region: "North Bank", address: "Kerewan", lat: 13.48, lng: -16.08, phone: "+220 566 4200", hours: "8am–8pm", services: ["Outpatient", "Maternity", "ANC"] },
  { id: "soma-hc", name: "Soma Health Centre", type: "hospital", region: "Lower River", address: "Soma, Lower River Region", lat: 13.45, lng: -15.54, phone: "+220 566 3100", hours: "24/7", services: ["Emergency", "General Medicine", "Maternity"] },
  { id: "mansa-konko", name: "Mansa Konko Health Centre", type: "hospital", region: "Lower River", address: "Mansa Konko", lat: 13.47, lng: -15.55, phone: "+220 566 3200", hours: "8am–8pm", services: ["Outpatient", "Maternity"] },
  { id: "janjangbureh-dh", name: "Janjangbureh District Hospital", type: "hospital", region: "Central River", address: "Janjangbureh", lat: 13.533, lng: -14.767, phone: "+220 566 6000", hours: "24/7", services: ["Emergency", "General Medicine", "Maternity"] },
  { id: "kuntaur-hc", name: "Kuntaur Health Centre", type: "hospital", region: "Central River", address: "Kuntaur", lat: 13.66, lng: -14.89, phone: "+220 566 7000", hours: "8am–8pm", services: ["Outpatient", "Maternity"] },
  { id: "basse-dh", name: "Basse District Hospital", type: "hospital", region: "Upper River", address: "Basse", lat: 13.48, lng: -14.22, phone: "+220 566 4000", emergencyPhone: "+220 566 4000", hours: "24/7", services: ["Emergency", "General Medicine", "Surgery", "Maternity"] },
  { id: "bansang", name: "Bansang Hospital", type: "hospital", region: "Upper River", address: "Bansang, Upper River Region", lat: 13.46, lng: -14.65, phone: "+220 566 8000", hours: "24/7", services: ["Emergency", "Surgery", "General Medicine", "TB/HIV"] },

  // ============================================
  // POLICE STATIONS
  // ============================================
  { id: "police-hq", name: "Gambia Police Force Headquarters", type: "police", region: "Banjul", address: "Dobson Street, Banjul", lat: 13.455, lng: -16.574, phone: "+220 422 8888", emergencyPhone: "117", hours: "24/7" },
  { id: "police-kanifing", name: "Kanifing Police Station", type: "police", region: "Kanifing", address: "Kanifing", lat: 13.446, lng: -16.669, phone: "+220 437 1111", emergencyPhone: "117", hours: "24/7" },
  { id: "police-serrekunda", name: "Serrekunda Police Station", type: "police", region: "Kanifing", address: "Serrekunda", lat: 13.438, lng: -16.678, phone: "+220 437 2222", emergencyPhone: "117", hours: "24/7" },
  { id: "police-bakau", name: "Bakau Police Station", type: "police", region: "Kanifing", address: "Bakau New Town", lat: 13.479, lng: -16.673, phone: "+220 449 6200", emergencyPhone: "117", hours: "24/7" },
  { id: "police-brikama", name: "Brikama Police Station", type: "police", region: "West Coast", address: "Brikama Town", lat: 13.272, lng: -16.651, phone: "+220 448 3333", emergencyPhone: "117", hours: "24/7" },
  { id: "police-gunjur", name: "Gunjur Police Station", type: "police", region: "West Coast", address: "Gunjur Village", lat: 13.2, lng: -16.73, phone: "+220 448 4444", emergencyPhone: "117", hours: "24/7" },
  { id: "police-farafenni", name: "Farafenni Police Station", type: "police", region: "North Bank", address: "Farafenni Town", lat: 13.571, lng: -15.607, phone: "+220 566 9999", emergencyPhone: "117", hours: "24/7" },
  { id: "police-kerewan", name: "Kerewan Police Station", type: "police", region: "North Bank", address: "Kerewan", lat: 13.48, lng: -16.08, phone: "+220 566 8888", emergencyPhone: "117", hours: "24/7" },
  { id: "police-soma", name: "Soma Police Station", type: "police", region: "Lower River", address: "Soma", lat: 13.45, lng: -15.54, phone: "+220 566 7777", emergencyPhone: "117", hours: "24/7" },
  { id: "police-janjangbureh", name: "Janjangbureh Police Station", type: "police", region: "Central River", address: "Janjangbureh", lat: 13.532, lng: -14.768, phone: "+220 566 6666", emergencyPhone: "117", hours: "24/7" },
  { id: "police-basse", name: "Basse Police Station", type: "police", region: "Upper River", address: "Basse", lat: 13.482, lng: -14.218, phone: "+220 566 5555", emergencyPhone: "117", hours: "24/7" },

  // ============================================
  // FIRE STATIONS
  // ============================================
  { id: "fire-hq", name: "Gambia Fire & Rescue Service HQ", type: "fire", region: "Banjul", address: "Banjul City Centre", lat: 13.454, lng: -16.576, phone: "+220 422 9999", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-kanifing", name: "Kanifing Fire Station", type: "fire", region: "Kanifing", address: "Kanifing Municipality", lat: 13.445, lng: -16.668, phone: "+220 437 8888", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-brikama", name: "Brikama Fire Station", type: "fire", region: "West Coast", address: "Brikama", lat: 13.269, lng: -16.649, phone: "+220 448 7777", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-farafenni", name: "Farafenni Fire Station", type: "fire", region: "North Bank", address: "Farafenni", lat: 13.572, lng: -15.608, phone: "+220 566 6666", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-soma", name: "Soma Fire Station", type: "fire", region: "Lower River", address: "Soma", lat: 13.449, lng: -15.539, phone: "+220 566 5555", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-janjangbureh", name: "Janjangbureh Fire Station", type: "fire", region: "Central River", address: "Janjangbureh", lat: 13.531, lng: -14.766, phone: "+220 566 4444", emergencyPhone: "118", hours: "24/7" },
  { id: "fire-basse", name: "Basse Fire Station", type: "fire", region: "Upper River", address: "Basse", lat: 13.481, lng: -14.219, phone: "+220 566 7777", emergencyPhone: "118", hours: "24/7" },
];

export function getEmergencyByType(type: string): EmergencyService[] {
  if (type === "all") return EMERGENCY_SERVICES;
  return EMERGENCY_SERVICES.filter(s => s.type === type);
}

export function getEmergencyByRegion(region: string): EmergencyService[] {
  if (region === "all") return EMERGENCY_SERVICES;
  return EMERGENCY_SERVICES.filter(s => s.region === region);
}

export function searchEmergency(query: string): EmergencyService[] {
  const q = query.toLowerCase();
  return EMERGENCY_SERVICES.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.region.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q)
  );
}

export function getStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z/data=!3m1!1e3`;
}

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir//${lat},${lng}`;
}
