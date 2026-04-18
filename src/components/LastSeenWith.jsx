import React, { useMemo } from 'react';
import { isSamePerson } from '../utils/fuzzyMatch';

export function LastSeenWith({ podoTimeline }) {
  const summary = useMemo(() => {
    const rows = Array.isArray(podoTimeline) ? podoTimeline : [];
    const lastWith = [...rows]
      .filter((e) => e?.seenWith && !isSamePerson(e.seenWith, 'Podo'))
      .sort((a, b) => (b.at?.getTime?.() ?? -Infinity) - (a.at?.getTime?.() ?? -Infinity))[0];

    if (!lastWith) return null;
    return {
      seenWith: lastWith.seenWith,
      location: lastWith.location,
      timestampRaw: lastWith.timestampRaw,
      coordinates: lastWith.coordinates,
      record: lastWith.record,
    };
  }, [podoTimeline]);

  if (!summary) return null;

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Last seen with</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          from sightings
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="person-card">
        <div className="person-card-top">
          <div>
            <div className="person-name">{summary.seenWith}</div>
            <div className="person-aliases">
              {summary.timestampRaw} · {summary.location}
            </div>
          </div>
          <div className="person-score" title="weight: +5">
            +5
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => console.log('[RAW DATA] Last seen with record', summary.record)}>Log record</button>
          <button
            className="button-secondary"
            onClick={() => {
              const txt = `${summary.seenWith} — ${summary.timestampRaw} @ ${summary.location}`;
              navigator.clipboard?.writeText?.(txt);
            }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

