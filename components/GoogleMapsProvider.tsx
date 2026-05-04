'use client'
import { useJsApiLoader } from '@react-google-maps/api'
import type { Libraries } from '@react-google-maps/api'

const libraries: Libraries = ['places', 'geometry']

export default function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  if (loadError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Map unavailable</p>
        <p style={{ fontSize: 13 }}>Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment to enable Google Maps.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
