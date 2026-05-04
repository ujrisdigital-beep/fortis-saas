'use client';

import { useState } from 'react';

interface LocationMapProps {
  name: string;
  address: string;
  lat: number;
  lng: number;
  website?: string;
  facebook?: string;
  phone?: string;
  description?: string;
}

export default function LocationMap({ name, address, lat, lng, website, facebook, phone, description }: LocationMapProps) {
  const [view, setView] = useState<'map' | 'streetview'>('map');
  const [fromLocation, setFromLocation] = useState('');

  const apiKey = typeof window !== 'undefined' ? (window as unknown as { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string }).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : '';
  const mapsEmbedUrl = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=17&maptype=satellite`
    : `https://www.google.com/maps?q=${lat},${lng}&z=17&t=k&output=embed`;
  
  const streetViewUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=210&pitch=10&fov=90`
    : `https://www.google.com/maps?q=${lat},${lng}&layer=p&cbll=${lat},${lng}&cbp=11,0,0,0,0&output=svembed`;

  const googleEarthUrl = `https://earth.google.com/web/search/${lat},${lng}`;

  const handleWebsite = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (facebook) {
      window.open(facebook, '_blank');
    } else {
      alert('No website available');
    }
  };

  const handleDirections = () => {
    if (fromLocation) {
      window.open(`https://www.google.com/maps/dir/${encodeURIComponent(fromLocation)}/${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir//${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button 
          onClick={() => setView('map')} 
          className={`flex-1 px-4 py-3 text-center font-medium transition ${view === 'map' ? 'text-amber-700 border-b-2 border-amber-700 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🗺️ Satellite Map
        </button>
        <button 
          onClick={() => setView('streetview')} 
          className={`flex-1 px-4 py-3 text-center font-medium transition ${view === 'streetview' ? 'text-amber-700 border-b-2 border-amber-700 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏙️ 360° Street View
        </button>
      </div>

      <div className="relative h-80 md:h-96">
        {view === 'map' ? (
          <iframe 
            src={mapsEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            title={`${name} Map`} 
          />
        ) : (
          <iframe 
            src={streetViewUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            title={`${name} Street View`} 
          />
        )}
      </div>

      <div className="p-5 bg-gray-50">
        <h3 className="text-xl font-bold text-amber-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-3">📍 {address}</p>
        {phone && <p className="text-gray-600 mb-3">📞 {phone}</p>}
        {description && <p className="text-gray-600 text-sm mb-3">{description}</p>}

        <div className="flex flex-wrap gap-3 mt-4">
          <a 
            href={googleEarthUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 text-sm transition"
          >
            🌍 Open in Google Earth 3D
          </a>
          <button 
            onClick={handleWebsite} 
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 text-sm transition"
          >
            🌐 Visit Website ↗
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">🚗 Get Directions</label>
          <div className="flex flex-wrap gap-2">
            <input 
              type="text" 
              placeholder="Your starting location..." 
              value={fromLocation} 
              onChange={(e) => setFromLocation(e.target.value)} 
              className="flex-1 px-4 py-2 border rounded-lg text-sm min-w-[200px]"
            />
            <button 
              onClick={handleDirections} 
              className="bg-amber-700 text-white px-5 py-2 rounded-lg hover:bg-amber-800 text-sm transition"
            >
              Get Directions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}