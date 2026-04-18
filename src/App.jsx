import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCheckins } from './hooks/useCheckins';
import { useMessages } from './hooks/useMessages';
import { useSightings } from './hooks/useSightings';
import { usePersonalNotes } from './hooks/usePersonalNotes';
import { useAnonymousTips } from './hooks/useAnonymousTips';
import { usePodo } from './hooks/usePodo';
import { Timeline } from './components/Timeline';
import { usePeople } from './hooks/usePeople';
import { MostSuspicious } from './components/MostSuspicious';
import { LastSeenWith } from './components/LastSeenWith';
import { useSearch } from './hooks/useSearch';
import { DetailPanel } from './components/DetailPanel';
import './index.css';

// Reusable state renderer according to CLAUDE.md Rules
function StateRenderer({ loading, error, data, name }) {
  const [showPreview, setShowPreview] = useState(false);

  if (loading) return <div className="state-box loading">Loading {name}...</div>;
  if (error) return <div className="state-box error">Error ({name}): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No data for {name}</div>;

  return (
    <div className="state-box success">
      <h3>{name} loaded ({data.length} records)</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => console.log(`[RAW DATA] ${name}`, data)}>Log raw evidence</button>
        <button className="button-secondary" onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      {showPreview && (
        <div className="preview">
          <div className="preview-title">
            <span>Preview (first 2 records)</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <pre>{JSON.stringify(data.slice(0, 2), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function App() {
  const checkins = useCheckins();
  const messages = useMessages();
  const sightings = useSightings();
  const personalNotes = usePersonalNotes();
  const anonymousTips = useAnonymousTips();
  const podo = usePodo({ sightings });
  const people = usePeople({ checkins, messages, sightings, personalNotes, anonymousTips });

  const [query, setQuery] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const searchedPeople = useSearch({ people: people.data, query });

  const selectedPerson = useMemo(() => {
    const rows = Array.isArray(searchedPeople.data) ? searchedPeople.data : [];
    if (!rows.length) return null;
    if (!selectedPersonId) return rows[0];
    return rows.find((p) => p.id === selectedPersonId) || rows[0];
  }, [searchedPeople.data, selectedPersonId]);

  const loggedRef = useRef({
    checkins: false,
    messages: false,
    sightings: false,
    personalNotes: false,
    anonymousTips: false,
    all: false,
  });

  // Phase 1: log raw data once when each source is ready.
  useEffect(() => {
    if (!checkins.loading && !checkins.error && checkins.data?.length && !loggedRef.current.checkins) {
      console.log('[RAW DATA] Checkins', checkins.data);
      loggedRef.current.checkins = true;
    }
    if (!messages.loading && !messages.error && messages.data?.length && !loggedRef.current.messages) {
      console.log('[RAW DATA] Messages', messages.data);
      loggedRef.current.messages = true;
    }
    if (!sightings.loading && !sightings.error && sightings.data?.length && !loggedRef.current.sightings) {
      console.log('[RAW DATA] Sightings', sightings.data);
      loggedRef.current.sightings = true;
    }
    if (!personalNotes.loading && !personalNotes.error && personalNotes.data?.length && !loggedRef.current.personalNotes) {
      console.log('[RAW DATA] Personal Notes', personalNotes.data);
      loggedRef.current.personalNotes = true;
    }
    if (!anonymousTips.loading && !anonymousTips.error && anonymousTips.data?.length && !loggedRef.current.anonymousTips) {
      console.log('[RAW DATA] Anonymous Tips', anonymousTips.data);
      loggedRef.current.anonymousTips = true;
    }

    if (
      !loggedRef.current.all &&
      !checkins.loading &&
      !messages.loading &&
      !sightings.loading &&
      !personalNotes.loading &&
      !anonymousTips.loading
    ) {
      console.log('--- ALL RAW DATA LOADED ---');
      loggedRef.current.all = true;
    }
  }, [
    checkins.loading,
    checkins.error,
    checkins.data,
    messages.loading,
    messages.error,
    messages.data,
    sightings.loading,
    sightings.error,
    sightings.data,
    personalNotes.loading,
    personalNotes.error,
    personalNotes.data,
    anonymousTips.loading,
    anonymousTips.error,
    anonymousTips.data,
  ]);

  const totals = useMemo(() => {
    const ok = (x) => (!x.loading && !x.error && Array.isArray(x.data) ? x.data.length : 0);
    return {
      checkins: ok(checkins),
      messages: ok(messages),
      sightings: ok(sightings),
      personalNotes: ok(personalNotes),
      anonymousTips: ok(anonymousTips),
    };
  }, [checkins, messages, sightings, personalNotes, anonymousTips]);

  const totalRecords =
    totals.checkins +
    totals.messages +
    totals.sightings +
    totals.personalNotes +
    totals.anonymousTips;

  return (
    <div className="app-container">
      <div className="desk-shell">
        <header className="app-header desk-top">
          <div className="case-meta">
            <h1>Missing Podo: The Ankara Case</h1>
            <p>Investigation Desk — Phase 1 (Evidence Intake)</p>
            <div className="case-badges">
              <span className="badge accent">CASE: ANK-PO-26</span>
              <span className="badge ok">EVIDENCE: {totalRecords}</span>
              <span className="badge warn">MODE: DEV (local-first)</span>
            </div>
          </div>

          <div className="search-panel">
            <label className="search-label">Search (Phase 2)</label>
            <div className="search-row">
              <input
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, location, or keyword..."
              />
              <button className="button-secondary" onClick={() => setQuery('')} disabled={!query.trim()}>
                Clear
              </button>
            </div>
            <div className="hint">
              Tip: Open <strong>browser DevTools → Console</strong> to see raw evidence logs.
            </div>
          </div>
        </header>

        <main className="dashboard" style={{ position: 'relative' }}>
          <section className="data-sources-grid">
            <StateRenderer name="Checkins" {...checkins} />
            <StateRenderer name="Messages" {...messages} />
            <StateRenderer name="Sightings" {...sightings} />
            <StateRenderer name="Personal Notes" {...personalNotes} />
            <StateRenderer name="Anonymous Tips" {...anonymousTips} />
          </section>

          <section style={{ marginTop: 16 }}>
            <Timeline {...podo} />
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

          <section style={{ marginTop: 16 }}>
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

          <section style={{ marginTop: 16 }}>
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
        </main>
      </div>
    </div>
  );
}

export default App;
