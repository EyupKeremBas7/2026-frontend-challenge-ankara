import React, { useMemo } from 'react';
import { computeSuspicionScore } from '../utils/suspicionScore';
import { PersonCard } from './PersonCard';

export function MostSuspicious({ people, podoTimeline, totalPeopleCount = 0, searchActive = false }) {
  const ranked = useMemo(() => {
    const rows = Array.isArray(people) ? people : [];
    const withScore = rows.map((p) => {
      const { score, reasons } = computeSuspicionScore({
        personName: p.canonicalName,
        personRecords: p.records,
        podoTimeline,
      });
      return { person: p, score, reasons };
    });

    withScore.sort((a, b) => b.score - a.score || a.person.canonicalName.localeCompare(b.person.canonicalName));
    return withScore;
  }, [people, podoTimeline]);

  if (!ranked.length) {
    if (searchActive && totalPeopleCount > 0) {
      return <div className="state-box empty">No people matched this search query</div>;
    }
    return null;
  }

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Most suspicious</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {searchActive ? `${ranked.length}/${totalPeopleCount} matches` : 'sorted by suspicion score'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
        {ranked.slice(0, 8).map(({ person, score, reasons }) => (
          <PersonCard
            key={person.id}
            name={person.canonicalName}
            score={score}
            reasons={reasons}
            aliases={person.aliases}
            onLog={() => console.log('[RAW DATA] Person', person)}
          />
        ))}
      </div>
    </div>
  );
}

