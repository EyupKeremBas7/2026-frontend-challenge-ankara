import React, { useMemo } from 'react';

function parseCoordinates(value) {
  if (typeof value !== 'string') return null;
  const [latRaw, lngRaw] = value.split(',');
  const lat = Number(String(latRaw || '').trim());
  const lng = Number(String(lngRaw || '').trim());

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function normalizePoints(points) {
  if (!points.length) return [];

  const minLat = Math.min(...points.map((p) => p.lat));
  const maxLat = Math.max(...points.map((p) => p.lat));
  const minLng = Math.min(...points.map((p) => p.lng));
  const maxLng = Math.max(...points.map((p) => p.lng));

  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return points.map((point) => ({
    ...point,
    x: ((point.lng - minLng) / lngSpan) * 100,
    y: (1 - (point.lat - minLat) / latSpan) * 100,
  }));
}

export function MapView({ loading, error, data }) {
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

    return normalizePoints(parsed);
  }, [data]);

  if (loading) return <div className="state-box loading">Loading map view...</div>;
  if (error) return <div className="state-box error">Error (map view): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No map data for Podo</div>;

  if (!points.length) {
    return <div className="state-box empty">No valid coordinates found for map view</div>;
  }

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Map view</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {points.length} coordinate points
        </div>
      </div>

      <div className="map-shell" style={{ marginTop: 12 }}>
        <div className="map-canvas">
          {points.map((point, index) => (
            <div
              key={point.id}
              className="map-point"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={`${point.location} · ${point.timestampRaw}`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="map-legend">
          {points.slice(0, 8).map((point, index) => (
            <span className="chip" key={`legend_${point.id}`}>
              {index + 1}. {point.location} · {point.timestampRaw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
