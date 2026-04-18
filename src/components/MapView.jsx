import React, { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon — simple colored circle
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #ef4444;
    border: 3px solid #fca5a5;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const selectedIcon = L.divIcon({
  className: 'custom-marker-selected',
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #3b82f6;
    border: 3px solid #bfdbfe;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.28);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

function parseCoordinates(value) {
  if (typeof value !== 'string') return null;
  const [latRaw, lngRaw] = value.split(',');
  const lat = Number(String(latRaw || '').trim());
  const lng = Number(String(lngRaw || '').trim());

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }

    const bounds = points.map((point) => [point.lat, point.lng]);
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
  }, [map, points]);

  return null;
}

export function MapView({ loading, error, data, selectedEventId, onSelectEvent }) {
  const points = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const parsed = rows
      .map((event, index) => {
        const coords = parseCoordinates(event?.coordinates);
        if (!coords) return null;

        return {
          id: event.id ?? `point_${index}`,
          lat: coords.lat,
          lng: coords.lng,
          location: event.location || 'Unknown location',
          timestampRaw: event.timestampRaw || 'Unknown time',
        };
      })
      .filter(Boolean);

    return parsed;
  }, [data]);

  if (loading) return <div className="state-box loading">Loading map view...</div>;
  if (error) return <div className="state-box error">Error (map view): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No map data for Podo</div>;

  if (!points.length) {
    return <div className="state-box empty">No valid coordinates found for map view</div>;
  }

  const initialCenter = [points[0].lat, points[0].lng];

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Map view</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {points.length} coordinate points
        </div>
      </div>

      <div className="map-shell" style={{ marginTop: 12 }}>
        <MapContainer className="map-canvas" center={initialCenter} zoom={12} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={points} />

          {points.map((point, index) => {
            return (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={selectedEventId === point.id ? selectedIcon : customIcon}
                eventHandlers={{ click: () => onSelectEvent?.(point.id) }}
              >
                <Popup>
                  <strong>{index + 1}. {point.location}</strong>
                  <br />
                  {point.timestampRaw}
                  <br />
                  {point.lat}, {point.lng}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="map-legend">
          {points.slice(0, 8).map((point, index) => (
            <span
              className="chip"
              key={`legend_${point.id}`}
              style={selectedEventId === point.id ? { borderColor: 'rgba(156, 192, 255, 0.7)', background: 'rgba(59, 130, 246, 0.12)' } : undefined}
            >
              {index + 1}. {point.location} · {point.timestampRaw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
