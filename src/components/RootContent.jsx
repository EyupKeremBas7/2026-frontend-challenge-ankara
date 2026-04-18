import React from 'react';
import { Timeline } from './Timeline';
import { MapView } from './MapView';
import { LastSeenWith } from './LastSeenWith';
import { MostSuspicious } from './MostSuspicious';
import { DetailPanel } from './DetailPanel';

export function RootContent({ currentPath, podo, people, searchedPeople, selectedPerson, setSelectedPersonId, selectedEventId, setSelectedEventId }) {
  return (
    <main className="dashboard" style={{ position: 'relative' }}>
      {currentPath === '/chain-root' ? (
        <>
          <section id="chain-root" style={{ marginTop: 16 }}>
            <Timeline {...podo} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
          </section>

          <section style={{ marginTop: 16 }}>
            <MapView {...podo} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
          </section>

          <section style={{ marginTop: 16 }}>
            {podo.loading ? (
              <div className="state-box loading">Loading last seen with...</div>
            ) : podo.error ? (
              <div className="state-box error">Error (last seen with): {podo.error.message}</div>
            ) : !podo.data?.length ? (
              <div className="state-box empty">No sightings for Podo</div>
            ) : (
              <LastSeenWith podoTimeline={podo.data} />
            )}
          </section>
        </>
      ) : null}

      {currentPath === '/suspicious-root' ? (
        <section id="suspicious-root" style={{ marginTop: 16 }}>
          {people.loading ? (
            <div className="state-box loading">Loading people...</div>
          ) : people.error ? (
            <div className="state-box error">Error (people): {people.error.message}</div>
          ) : !people.data?.length ? (
            <div className="state-box empty">No people indexed yet</div>
          ) : (
            <MostSuspicious
              people={searchedPeople.data}
              totalPeopleCount={people.data.length}
              searchActive={searchedPeople.active}
              selectedPersonId={selectedPerson?.id ?? null}
              onSelectPerson={(person) => setSelectedPersonId(person?.id ?? null)}
              podoTimeline={podo.data}
            />
          )}
        </section>
      ) : null}

      {currentPath === '/detail-root' ? (
        <section id="detail-root" style={{ marginTop: 16 }}>
          {people.loading ? (
            <div className="state-box loading">Loading detail panel...</div>
          ) : people.error ? (
            <div className="state-box error">Error (detail panel): {people.error.message}</div>
          ) : !people.data?.length ? (
            <div className="state-box empty">No person details available</div>
          ) : (
            <DetailPanel selectedPerson={selectedPerson} />
          )}
        </section>
      ) : null}
    </main>
  );
}
