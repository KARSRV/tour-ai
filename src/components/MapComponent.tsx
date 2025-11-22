"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Prevent flyTo on invalid coords
function MapController({ coords }: { coords: { lat: number; lon: number } }) {
  const map = useMap();

  useEffect(() => {
    if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lon)) {
      map.flyTo([coords.lat, coords.lon], 13, { duration: 1.2 });
    }
  }, [coords, map]);

  return null;
}

export default function MapComponent({
  coords,
  places,
}: {
  coords: { lat: number; lon: number } | null;
  places: { name: string; lat: number; lon: number }[];
}) {
  // If coords invalid, show friendly msg
  if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)) {
    return (
      <div className="text-slate-300 text-sm p-4">
        Map unavailable for this location.
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[coords.lat, coords.lon]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Auto-center when coords change */}
        <MapController coords={coords} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        <Marker position={[coords.lat, coords.lon]} icon={markerIcon}>
          <Popup>
            {`Location: ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`}
          </Popup>
        </Marker>

        {/* Tourist markers only if valid */}
        {places
          .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
          .map((p, i) => (
            <Marker key={i} position={[p.lat, p.lon]} icon={markerIcon}>
              <Popup>{p.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
