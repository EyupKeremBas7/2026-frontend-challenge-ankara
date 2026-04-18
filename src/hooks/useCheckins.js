import { fetchCheckins } from '../api/checkins';
import { useJotformQuery } from './useJotformQuery';

export function useCheckins() {
  return useJotformQuery(fetchCheckins);
}
