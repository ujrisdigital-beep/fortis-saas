"use client";
import { useEffect, useRef } from "react";

interface MapRegion {
  name: string;
  accessRate: number;
  lat: number;
  lng: number;
  waterAccess: number;
  demandMW: number;
  capacityMW: number;
  [key: string]: unknown;
}

interface GambiaMapProps {
  regions: MapRegion[];
  onRegionClick: (region: MapRegion) => void;
  selectedRegion: MapRegion | null;
}

export default function GambiaMap({ regions, onRegionClick, selectedRegion }: GambiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const getColor = (rate: number) => {
    if (rate >= 90) return "#1B4D3E";
    if (rate >= 70) return "#D4AF37";
    return "#E63946";
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      // Fix Leaflet default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { center: [13.45, -15.5], zoom: 7, scrollWheelZoom: false });
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        maxZoom: 14,
      }).addTo(map);

      regions.forEach((region) => {
        const circle = L.circleMarker([region.lat, region.lng], {
          radius: 18,
          fillColor: getColor(region.accessRate),
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        circle.bindTooltip(
          `<strong>${region.name}</strong><br/>⚡ ${region.accessRate}% electricity<br/>💧 ${region.waterAccess}% water`,
          { permanent: false, direction: "top" }
        );

        circle.on("click", () => onRegionClick(region));
        markersRef.current.push({ circle, region });
      });
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    import("leaflet").then(() => {
      markersRef.current.forEach(({ circle, region }) => {
        const isSelected = selectedRegion?.name === region.name;
        circle.setStyle({
          radius: isSelected ? 24 : 18,
          weight: isSelected ? 4 : 2,
          color: isSelected ? "#D4AF37" : "#fff",
        });
      });
    });
  }, [selectedRegion]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "100%", width: "100%", borderRadius: 12 }} />
    </>
  );
}
