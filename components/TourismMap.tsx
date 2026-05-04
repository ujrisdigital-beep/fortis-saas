'use client'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useCallback } from 'react'

const mapContainerStyle = { width: '100%', height: '500px', borderRadius: 12 }
const defaultCenter = { lat: 13.45, lng: -16.58 }

const MARKER_ICONS: Record<string, string> = {
  heritage: 'http://maps.google.com/mapfiles/ms/icons/brown-dot.png',
  nature: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  beach: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  cultural: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  business: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  government: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
}

export interface TourismSite {
  id: number
  name: string
  lat: number
  lng: number
  category: string
  description: string
  accessibility: string
  entryFee?: string
  openingHours?: string
  contact?: string
}

interface Props {
  sites: TourismSite[]
  onSiteSelect?: (site: TourismSite) => void
  userLocation?: { lat: number; lng: number } | null
}

export default function TourismMap({ sites, onSiteSelect, userLocation }: Props) {
  const [selectedSite, setSelectedSite] = useState<TourismSite | null>(null)

  const onLoad = useCallback((_map: google.maps.Map) => {}, [])

  const handleMarkerClick = (site: TourismSite) => {
    setSelectedSite(site)
    onSiteSelect?.(site)
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={9}
      center={defaultCenter}
      onLoad={onLoad}
      options={{ mapTypeControl: true, streetViewControl: false, fullscreenControl: true }}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png', scaledSize: new google.maps.Size(32, 32) }}
          title="Your Location"
        />
      )}

      {sites.map(site => (
        <Marker
          key={site.id}
          position={{ lat: site.lat, lng: site.lng }}
          icon={MARKER_ICONS[site.category] ?? MARKER_ICONS.heritage}
          onClick={() => handleMarkerClick(site)}
          title={site.name}
        />
      ))}

      {selectedSite && (
        <InfoWindow
          position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
          onCloseClick={() => setSelectedSite(null)}
        >
          <div style={{ maxWidth: 220, padding: 4, fontFamily: 'system-ui' }}>
            <h3 style={{ fontWeight: 700, color: '#1B4D3E', margin: '0 0 4px' }}>{selectedSite.name}</h3>
            <p style={{ fontSize: 12, color: '#555', margin: '0 0 6px' }}>{selectedSite.description.slice(0, 100)}...</p>
            {selectedSite.entryFee && <p style={{ fontSize: 11, color: '#777', margin: '2px 0' }}>Entry: {selectedSite.entryFee}</p>}
            {selectedSite.openingHours && <p style={{ fontSize: 11, color: '#777', margin: '2px 0' }}>Hours: {selectedSite.openingHours}</p>}
            <button
              onClick={() => onSiteSelect?.(selectedSite)}
              style={{ marginTop: 6, color: '#C4943A', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View Details →
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
