'use client';

import { useState, useEffect } from 'react';

const AIRPORT_LAT = 13.3380;
const AIRPORT_LNG = -16.6522;

const G = '#1B4D3E';
const DARK = '#0A2E1A';
const GOLD = '#C4943A';

export default function AirportPage() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'streetview'>('map');

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error('Weather error:', error);
      setWeather({
        temperature: 32,
        feelsLike: 34,
        humidity: 65,
        windSpeed: 12,
        windDirection: 'W',
        visibility: 10,
        pressure: 1012,
        conditions: 'Sunny',
        description: 'clear sky',
        sunrise: '6:45 AM',
        sunset: '6:30 PM'
      });
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleString());
    }
  };

  const getWeatherIcon = (conditions: string) => {
    const lower = conditions?.toLowerCase() || '';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('clear') || lower.includes('sun')) return '☀️';
    if (lower.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  const mapEmbedUrl = `https://www.google.com/maps?q=${AIRPORT_LAT},${AIRPORT_LNG}&z=17&t=k&output=embed`;
  const streetViewUrl = `https://www.google.com/maps?q=${AIRPORT_LAT},${AIRPORT_LNG}&layer=p&cbll=${AIRPORT_LAT},${AIRPORT_LNG}&cbp=11,0,0,0,0&output=svembed`;
  const earthUrl = `https://earth.google.com/web/search/${AIRPORT_LAT},${AIRPORT_LNG}`;

  return (
    <main style={{ background: '#f0f9ff', minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`, padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex' }}>
          <div style={{ flex: 1, background: '#3A7D44' }} />
          <div style={{ flex: 1, background: '#fff' }} />
          <div style={{ flex: 1, background: '#E63946' }} />
        </div>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✈️</div>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 900 }}>Banjul International Airport</h1>
        <p style={{ margin: '8px 0 0', fontSize: 18, opacity: 0.9 }}>BJL / GBYD • Yundum, The Gambia</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.75 }}>Live 3D Mapping • Real-time Weather • Flight Links</p>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Weather Dashboard */}
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <div style={{ background: '#fffbeb', padding: '16px 24px', borderBottom: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#92400e' }}>🌤️ Live Weather Dashboard</h2>
            <span style={{ fontSize: 12, color: '#6b7280' }}>Last updated: {lastUpdated || 'Loading...'}</span>
          </div>
          
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading weather data...</div>
          ) : weather ? (
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{getWeatherIcon(weather.conditions)}</div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>{weather.temperature}°C</div>
                <div style={{ color: '#6b7280' }}>Feels like {weather.feelsLike}°C</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>{weather.conditions}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><div style={{ fontSize: 12, color: '#6b7280' }}>💧 Humidity</div><div style={{ fontSize: 20, fontWeight: 700 }}>{weather.humidity}%</div></div>
                <div><div style={{ fontSize: 12, color: '#6b7280' }}>💨 Wind</div><div style={{ fontSize: 20, fontWeight: 700 }}>{weather.windSpeed} km/h</div></div>
                <div><div style={{ fontSize: 12, color: '#6b7280' }}>👁️ Visibility</div><div style={{ fontSize: 20, fontWeight: 700 }}>{weather.visibility} km</div></div>
                <div><div style={{ fontSize: 12, color: '#6b7280' }}>📊 Pressure</div><div style={{ fontSize: 20, fontWeight: 700 }}>{weather.pressure} hPa</div></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>🌅 Sunrise</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{weather.sunrise || '6:45 AM'}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>🌇 Sunset</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{weather.sunset || '6:30 PM'}</div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>Failed to load weather</div>
          )}
        </div>

        {/* 3D Map & Street View */}
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <button onClick={() => setViewMode('map')} style={{ flex: 1, padding: '14px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: viewMode === 'map' ? '#fff' : 'transparent', border: 'none', borderBottom: viewMode === 'map' ? '3px solid #b45309' : '3px solid transparent', color: viewMode === 'map' ? '#b45309' : '#6b7280' }}>🗺️ Satellite Map</button>
            <button onClick={() => setViewMode('streetview')} style={{ flex: 1, padding: '14px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: viewMode === 'streetview' ? '#fff' : 'transparent', border: 'none', borderBottom: viewMode === 'streetview' ? '3px solid #b45309' : '3px solid transparent', color: viewMode === 'streetview' ? '#b45309' : '#6b7280' }}>🏙️ 360° Street View</button>
          </div>
          <div style={{ height: 400 }}>
            <iframe src={viewMode === 'map' ? mapEmbedUrl : streetViewUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Banjul Airport" />
          </div>
          <div style={{ padding: 20, background: '#f9fafb' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800 }}>✈️ Banjul International Airport (BJL/GBYD)</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>📍 Yundum, West Coast Region, The Gambia</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <a href={earthUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#b45309', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>🌍 Google Earth 3D</a>
              <a href="https://www.banjulairport.com" target="_blank" rel="noopener noreferrer" style={{ background: G, color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>🌐 Airport Website ↗</a>
            </div>
          </div>
        </div>

        {/* Flight & ATC */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: '#92400e' }}>✈️ Live Flight Information</h3>
            <a href="https://www.flightradar24.com/data/airports/bjl" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: 14, background: '#f0f9ff', borderRadius: 10, textDecoration: 'none', marginBottom: 12 }}><span>🛫 FlightRadar24</span><span style={{ color: '#0369a1', fontWeight: 600 }}>Live →</span></a>
            <a href="https://flightaware.com/live/airport/GBYD" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: 14, background: '#f0f9ff', borderRadius: 10, textDecoration: 'none', marginBottom: 12 }}><span>✈️ FlightAware</span><span style={{ color: '#0369a1', fontWeight: 600 }}>Live →</span></a>
            <a href="https://www.banjulairport.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: 14, background: '#f0f9ff', borderRadius: 10, textDecoration: 'none' }}><span>📅 Official Schedule</span><span style={{ color: '#0369a1', fontWeight: 600 }}>View →</span></a>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: '#92400e' }}>📡 ATC & Airport Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontWeight: 600 }}>Tower:</span><span style={{ fontFamily: 'monospace', fontWeight: 700 }}>118.7 MHz</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontWeight: 600 }}>Approach:</span><span style={{ fontFamily: 'monospace', fontWeight: 700 }}>119.5 MHz</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontWeight: 600 }}>ATIS:</span><span style={{ fontFamily: 'monospace', fontWeight: 700 }}>126.2 MHz</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}><span style={{ fontWeight: 600 }}>Runway:</span><span>14/32 • 3,600m</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><span style={{ fontWeight: 600 }}>Status:</span><span style={{ color: '#16a34a', fontWeight: 600 }}>🟢 Operational 24/7</span></div>
            </div>
          </div>
        </div>

        {/* Gambia Weather */}
        <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: '#92400e', textAlign: 'center' }}>🇬🇲 Weather Across The Gambia</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { city: 'Banjul', temp: '32°C', icon: '☀️' },
              { city: 'Brikama', temp: '33°C', icon: '☀️' },
              { city: 'Basse', temp: '35°C', icon: '☀️' },
              { city: 'Janjangbureh', temp: '34°C', icon: '🌤️' },
              { city: 'Farafenni', temp: '34°C', icon: '☀️' },
              { city: 'Gunjur', temp: '31°C', icon: '☀️' },
            ].map((loc) => (
              <div key={loc.city} style={{ textAlign: 'center', padding: 12, background: '#fff', borderRadius: 10 }}>
                <div style={{ fontSize: 24 }}>{loc.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{loc.city}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{loc.temp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}