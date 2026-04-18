import React, { useEffect } from 'react';
import { useCheckins } from './hooks/useCheckins';
import { useMessages } from './hooks/useMessages';
import { useSightings } from './hooks/useSightings';
import { usePersonalNotes } from './hooks/usePersonalNotes';
import { useAnonymousTips } from './hooks/useAnonymousTips';
import './index.css';

// Reusable state renderer according to CLAUDE.md Rules
function StateRenderer({ loading, error, data, name }) {
  if (loading) return <div className="state-box loading">Loading {name}...</div>;
  if (error) return <div className="state-box error">Error ({name}): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No data for {name}</div>;

  return (
    <div className="state-box success">
      <h3>{name} loaded ({data.length} records)</h3>
      <button onClick={() => console.log(`[RAW DATA] ${name}`, data)}>Log {name} to Console</button>
    </div>
  );
}

function App() {
  const checkins = useCheckins();
  const messages = useMessages();
  const sightings = useSightings();
  const personalNotes = usePersonalNotes();
  const anonymousTips = useAnonymousTips();

  // Log all exactly once when they arrive (optional, for Phase 1 goal)
  useEffect(() => {
    if (!checkins.loading && !messages.loading && !sightings.loading && !personalNotes.loading && !anonymousTips.loading) {
      console.log('--- ALL RAW DATA LOADED ---');
    }
  }, [checkins.loading, messages.loading, sightings.loading, personalNotes.loading, anonymousTips.loading]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Missing Podo: The Ankara Case</h1>
        <p>Investigation Dashboard - Phase 1</p>
      </header>

      <main className="dashboard">
        <section className="data-sources-grid">
          <StateRenderer name="Checkins" {...checkins} />
          <StateRenderer name="Messages" {...messages} />
          <StateRenderer name="Sightings" {...sightings} />
          <StateRenderer name="Personal Notes" {...personalNotes} />
          <StateRenderer name="Anonymous Tips" {...anonymousTips} />
        </section>
      </main>
    </div>
  );
}

export default App;
