"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in Next.js (webpack doesn't resolve Leaflet's icon paths)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export type SpotWithCoords = {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
};

const BOSTON_CENTER: L.LatLngTuple = [42.36, -71.06];
const DEFAULT_ZOOM = 13;

function FitBounds({ spots }: { spots: SpotWithCoords[] }) {
  const map = useMap();
  const withCoords = spots.filter(
    (s) => s.latitude != null && s.longitude != null
  );
  useEffect(() => {
    if (withCoords.length === 0) return;
    if (withCoords.length === 1) {
      map.setView([withCoords[0].latitude!, withCoords[0].longitude!], DEFAULT_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(
      withCoords.map((s) => [s.latitude!, s.longitude!] as L.LatLngTuple)
    );
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, withCoords]);
  return null;
}

export function SpotsMap({ spots }: { spots: SpotWithCoords[] }) {
  const withCoords = useMemo(
    () =>
      spots.filter(
        (s) =>
          typeof s.latitude === "number" && typeof s.longitude === "number"
      ),
    [spots]
  );

  if (withCoords.length === 0) return null;

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-lg border border-[var(--border)]">
      <MapContainer
        center={BOSTON_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds spots={withCoords} />
        {withCoords.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude!, spot.longitude!]}
            icon={defaultIcon}
          >
            <Popup>
              <span className="font-medium">{spot.name}</span>
              <br />
              <span className="text-sm text-secondary">{spot.tagline}</span>
              {spot.neighborhood ? (
                <>
                  <br />
                  <span className="text-sm text-secondary">
                    {spot.neighborhood}
                  </span>
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
