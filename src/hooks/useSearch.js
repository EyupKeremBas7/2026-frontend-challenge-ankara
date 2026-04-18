import { useMemo } from 'react';
import { getAnswerByName } from '../utils/jotform';
import { normalizeName } from '../utils/fuzzyMatch';

const SOURCE_FIELDS = {
  checkins: ['location', 'note'],
  messages: ['location', 'text'],
  sightings: ['location', 'note'],
  personalNotes: ['location', 'note', 'mentionedPeople'],
  anonymousTips: ['location', 'tip'],
};

function toSafeText(value) {
  return typeof value === 'string' ? value : '';
}

function personMatchesQuery(person, normalizedQuery) {
  if (!normalizedQuery) return true;

  const candidateNames = [person.canonicalName, ...(person.aliases || [])]
    .map((name) => normalizeName(name))
    .filter(Boolean);

  if (candidateNames.some((name) => name.includes(normalizedQuery))) {
    return true;
  }

  const records = person.records || {};

  for (const [sourceName, fields] of Object.entries(SOURCE_FIELDS)) {
    const sourceRecords = Array.isArray(records[sourceName]) ? records[sourceName] : [];
    for (const record of sourceRecords) {
      for (const fieldName of fields) {
        const raw = toSafeText(getAnswerByName(record, fieldName));
        if (normalizeName(raw).includes(normalizedQuery)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function useSearch({ people, query }) {
  const normalizedQuery = normalizeName(query);

  const filteredPeople = useMemo(() => {
    const rows = Array.isArray(people) ? people : [];
    return rows.filter((person) => personMatchesQuery(person, normalizedQuery));
  }, [people, normalizedQuery]);

  return {
    data: filteredPeople,
    query: normalizedQuery,
    active: normalizedQuery.length > 0,
  };
}
