import React from 'react';

export function PersonCard({ name, score, reasons, aliases, onLog }) {
  return (
    <div className="person-card">
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
        <button className="button-secondary" onClick={onLog}>
          Log person
        </button>
      </div>
    </div>
  );
}

