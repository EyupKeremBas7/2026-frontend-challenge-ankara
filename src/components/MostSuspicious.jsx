import React, { useMemo, useState } from 'react';
import { computeSuspicionScore } from '../utils/suspicionScore';
import { PersonCard } from './PersonCard';

export function MostSuspicious({
  people,
  podoTimeline,
  totalPeopleCount = 0,
  searchActive = false,
  selectedPersonId = null,
  onSelectPerson,
}) {
  const [quickFilter, setQuickFilter] = useState('all');

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

  const filteredRanked = useMemo(() => {
    if (quickFilter === 'high') {
      return ranked.filter((row) => row.score >= 8);
    }

    if (quickFilter === 'tips') {
      return ranked.filter((row) => {
        const tips = row.person?.records?.anonymousTips;
        return Array.isArray(tips) && tips.length > 0;
      });
    }

    return ranked;
  }, [quickFilter, ranked]);

  if (!ranked.length) {
    if (searchActive && totalPeopleCount > 0) {
      return <div className="state-box empty">No people matched this search query</div>;
    }
    return null;
  }

  if (!filteredRanked.length) {
    return (
      <div className="state-box empty" style={{ alignItems: 'stretch', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <h3 style={{ margin: 0 }}>Most suspicious</h3>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
            filter: {quickFilter}
          </div>
        </div>
        <div className="filter-chip-row" style={{ marginTop: 12 }}>
          <button type="button" className={`filter-chip ${quickFilter === 'all' ? 'active' : ''}`} onClick={() => setQuickFilter('all')}>Tümü</button>
          <button type="button" className={`filter-chip ${quickFilter === 'high' ? 'active' : ''}`} onClick={() => setQuickFilter('high')}>Yüksek Risk (≥8)</button>
          <button type="button" className={`filter-chip ${quickFilter === 'tips' ? 'active' : ''}`} onClick={() => setQuickFilter('tips')}>Tip Geçenler</button>
        </div>
        <div style={{ marginTop: 12 }}>Seçili filtrede sonuç yok. "Tümü" filtresine dönmeyi deneyin.</div>
      </div>
    );
  }

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Most suspicious</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {searchActive ? `${filteredRanked.length}/${totalPeopleCount} matches` : `${filteredRanked.length} kişi`} 
        </div>
      </div>

      <div className="filter-chip-row" style={{ marginTop: 12 }}>
        <button type="button" className={`filter-chip ${quickFilter === 'all' ? 'active' : ''}`} onClick={() => setQuickFilter('all')}>Tümü</button>
        <button type="button" className={`filter-chip ${quickFilter === 'high' ? 'active' : ''}`} onClick={() => setQuickFilter('high')}>Yüksek Risk (≥8)</button>
        <button type="button" className={`filter-chip ${quickFilter === 'tips' ? 'active' : ''}`} onClick={() => setQuickFilter('tips')}>Tip Geçenler</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
        {filteredRanked.slice(0, 8).map(({ person, score, reasons }) => (
          <PersonCard
            key={person.id}
            name={person.canonicalName}
            score={score}
            reasons={reasons}
            aliases={person.aliases}
            selected={selectedPersonId === person.id}
            onSelect={() => onSelectPerson?.(person)}
            onLog={() => console.log('[RAW DATA] Person', person)}
          />
        ))}
      </div>
    </div>
  );
}

