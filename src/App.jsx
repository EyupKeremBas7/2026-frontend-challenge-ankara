import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCheckins } from './hooks/useCheckins';
import { useMessages } from './hooks/useMessages';
import { useSightings } from './hooks/useSightings';
import { usePersonalNotes } from './hooks/usePersonalNotes';
import { useAnonymousTips } from './hooks/useAnonymousTips';
import { usePodo } from './hooks/usePodo';
import { usePeople } from './hooks/usePeople';
import { useSearch } from './hooks/useSearch';
import { LandingPage } from './components/LandingPage';
import { InvestigationHeader } from './components/InvestigationHeader';
import { RootContent } from './components/RootContent';

const ROOT_SECTION_BY_PATH = {
  '/chain-root': 'chain-root',
  '/suspicious-root': 'suspicious-root',
  '/detail-root': 'detail-root',
};

function App() {
  const checkins = useCheckins();
  const messages = useMessages();
  const sightings = useSightings();
  const personalNotes = usePersonalNotes();
  const anonymousTips = useAnonymousTips();
  const podo = usePodo({ sightings });
  const people = usePeople({ checkins, messages, sightings, personalNotes, anonymousTips });

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  
  // Debounce search query — 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  
  const searchedPeople = useSearch({ people: people.data, query: debouncedQuery });

  const selectedPerson = useMemo(() => {
    const rows = Array.isArray(searchedPeople.data) ? searchedPeople.data : [];
    if (!rows.length) return null;
    if (!selectedPersonId) return rows[0];
    return rows.find((p) => p.id === selectedPersonId) || rows[0];
  }, [searchedPeople.data, selectedPersonId]);

  const selectedPersonLinkedTotal = useMemo(() => {
    if (!selectedPerson?.records) return 0;
    const records = selectedPerson.records;
    return (
      (records.checkins?.length || 0) +
      (records.messages?.length || 0) +
      (records.sightings?.length || 0) +
      (records.personalNotes?.length || 0) +
      (records.anonymousTips?.length || 0)
    );
  }, [selectedPerson]);

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

  const navigateToRoot = (path) => {
    const sectionId = ROOT_SECTION_BY_PATH[path];
    const isKnownPath = path === '/' || !!sectionId;
    if (!isKnownPath) return;

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }

    if (sectionId) {
      requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  useEffect(() => {
    const syncFromPath = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      const sectionId = ROOT_SECTION_BY_PATH[path];
      if (!sectionId) return;

      requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    syncFromPath();
    window.addEventListener('popstate', syncFromPath);
    return () => window.removeEventListener('popstate', syncFromPath);
  }, []);

  const dataReady =
    !checkins.loading &&
    !messages.loading &&
    !sightings.loading &&
    !personalNotes.loading &&
    !anonymousTips.loading;

  const hasAnyError =
    !!checkins.error ||
    !!messages.error ||
    !!sightings.error ||
    !!personalNotes.error ||
    !!anonymousTips.error;

  const isLandingPage = currentPath === '/';

  const rootCountText = useMemo(() => {
    if (currentPath === '/chain-root') {
      const count = Array.isArray(podo.data) ? podo.data.length : 0;
      return `Timeline kaydı: ${count}`;
    }

    if (currentPath === '/suspicious-root') {
      const matched = Array.isArray(searchedPeople.data) ? searchedPeople.data.length : 0;
      return `Şüpheli kişi: ${matched}`;
    }

    if (currentPath === '/detail-root') {
      return `Detay kaydı: ${selectedPersonLinkedTotal}`;
    }

    return `Toplanan kayıt: ${totalRecords}`;
  }, [currentPath, podo.data, searchedPeople.data, selectedPersonLinkedTotal, totalRecords]);

  return (
    <div className="app-container">
      <div className="desk-shell">
        {isLandingPage ? (
          <LandingPage
            totalRecords={totalRecords}
            hasAnyError={hasAnyError}
            dataReady={dataReady}
            navigateToRoot={navigateToRoot}
            sources={{ checkins, messages, sightings, personalNotes, anonymousTips }}
          />
        ) : (
          <>
            <InvestigationHeader
              rootCountText={rootCountText}
              navigateToRoot={navigateToRoot}
              currentPath={currentPath}
              query={query}
              setQuery={setQuery}
            />
            <RootContent
              currentPath={currentPath}
              podo={podo}
              people={people}
              searchedPeople={searchedPeople}
              selectedPerson={selectedPerson}
              setSelectedPersonId={setSelectedPersonId}
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
