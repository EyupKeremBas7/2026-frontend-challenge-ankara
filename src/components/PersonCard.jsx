import React from 'react';

export function PersonCard({ name, score, reasons, aliases, onLog, onSelect, selected = false }) {
  return (
    <div
      className="person-card"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
          e.preventDefault();
          onSelect();
        }
      }}
      style={
        selected
          ? {
              borderColor: 'rgba(156, 192, 255, 0.65)',
              boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.14)',
            }
          : undefined
      }
    >
      <div className="person-card-top">
        <div>
          <div className="person-name">{name}</div>
          {aliases?.length > 1 ? (
            <div className="person-aliases">
              aliases: <span>{aliases.filter((a) => a !== name).slice(0, 3).join(', ')}</span>
            </div>
          ) : null}
        </div>

        <div className="person-score" title={reasons?.join(' · ') || ''}>
          {score}
        </div>
      </div>

      <div className="person-reasons">
        {reasons?.length ? reasons.slice(0, 3).map((r, idx) => <span key={idx} className="chip">{r}</span>) : (
          <span className="chip muted">no signals yet</span>
        )}
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button
          className="button-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onLog();
          }}
        >
          Log person
        </button>
      </div>
    </div>
  );
}

