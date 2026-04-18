import { fetchSightings } from '../api/sightings';
import { useJotformQuery } from './useJotformQuery';

export function useSightings() {
  return useJotformQuery(fetchSightings);
}
