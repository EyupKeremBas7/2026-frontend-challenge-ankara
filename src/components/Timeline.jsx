import React, { useState } from 'react';

function TimelineItem({ event, isSelected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '110px 1fr', 
        gap: 12, 
        padding: '10px 0',
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        borderLeft: isSelected ? '3px solid #3b82f6' : 'none',
        paddingLeft: isSelected ? '9px' : '12px',
        cursor: 'pointer',
        borderRadius: 4,
        transition: 'all 0.2s',
      }}
      onClick={() => onSelect(event.id)}
    >
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
        {event.timestampRaw || 'Unknown time'}
      </div>

      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
          <div style={{ fontWeight: 700 }}>{event.location || 'Unknown location'}</div>
          {event.seenWith ? (
            <div style={{ color: 'rgba(226, 232, 240, 0.78)' }}>
              seen with <strong>{event.seenWith}</strong>
            </div>
          ) : null}
          {event.coordinates ? (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.72)' }}>
              {event.coordinates}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button className="button-secondary" onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide raw' : 'Show raw'}
          </button>
          <button onClick={() => console.log('[RAW DATA] Podo sighting', event.record)}>Log event</button>
        </div>

        {open ? (
          <div className="preview" style={{ marginTop: 10 }}>
            <div className="preview-title">
              <span>Sighting record</span>
            </div>
            <pre>{JSON.stringify(event.record, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Timeline({ loading, error, data, selectedEventId, onSelectEvent }) {
  if (loading) return <div className="state-box loading">Loading Podo timeline...</div>;
  if (error) return <div className="state-box error">Error (Podo timeline): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No timeline events for Podo</div>;

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Podo’s chain of events</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {data.length} events
        </div>
      </div>

      <div style={{ marginTop: 12, borderTop: '1px solid var(--panel-border)' }}>
        {data.map((e) => (
          <div key={e.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
            <TimelineItem event={e} isSelected={selectedEventId === e.id} onSelect={onSelectEvent || (() => {})} />
          </div>
        ))}
      </div>
    </div>
  );
}

