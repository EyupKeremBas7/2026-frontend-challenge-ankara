import { fetchPersonalNotes } from '../api/personalNotes';
import { useJotformQuery } from './useJotformQuery';

export function usePersonalNotes() {
  return useJotformQuery(fetchPersonalNotes);
}
