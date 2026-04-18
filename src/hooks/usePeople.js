import { useMemo } from 'react';
import { buildPersonIndex } from '../utils/personIndex';

export function usePeople(sources) {
  const { checkins, messages, sightings, personalNotes, anonymousTips } = sources;

  const loading =
    checkins.loading ||
    messages.loading ||
    sightings.loading ||
    personalNotes.loading ||
    anonymousTips.loading;

  const error =
    checkins.error ||
    messages.error ||
    sightings.error ||
    personalNotes.error ||
    anonymousTips.error ||
    null;

  const index = useMemo(() => {
    if (loading || error) return null;
    return buildPersonIndex({
      checkins: checkins.data,
      messages: messages.data,
      sightings: sightings.data,
      personalNotes: personalNotes.data,
      anonymousTips: anonymousTips.data,
    });
  }, [
    loading,
    error,
    checkins.data,
    messages.data,
    sightings.data,
    personalNotes.data,
    anonymousTips.data,
  ]);

  const people = index?.people ?? null;

  return {
    loading,
    error,
    data: people,
    index,
  };
}

