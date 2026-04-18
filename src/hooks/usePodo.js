import { useMemo } from 'react';
import { isSamePerson } from '../utils/fuzzyMatch';
import { getAnswerByName, parseDdMmYyyyHmTimestamp } from '../utils/jotform';

export function usePodo({ sightings }) {
  const loading = sightings.loading;
  const error = sightings.error;

  const chain = useMemo(() => {
    if (loading || error) return null;
    const rows = Array.isArray(sightings.data) ? sightings.data : [];

    const events = rows
      .map((r) => {
        const who = getAnswerByName(r, 'personName');
        if (!isSamePerson(who, 'Podo')) return null;

        const timestampRaw = getAnswerByName(r, 'timestamp');
        const at = parseDdMmYyyyHmTimestamp(timestampRaw);

        return {
          id: r?.id ?? `${timestampRaw || 'unknown'}`,
          at,
          timestampRaw: timestampRaw ?? '',
          location: getAnswerByName(r, 'location') ?? '',
          coordinates: getAnswerByName(r, 'coordinates') ?? '',
          seenWith: getAnswerByName(r, 'seenWith') ?? '',
          record: r,
        };
      })
      .filter(Boolean);

    events.sort((a, b) => {
      const atA = a.at ? a.at.getTime() : Infinity;
      const atB = b.at ? b.at.getTime() : Infinity;
      return atA - atB;
    });

    return events;
  }, [loading, error, sightings.data]);

  return {
    loading,
    error,
    data: chain,
  };
}

