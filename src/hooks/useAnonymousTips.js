import { fetchAnonymousTips } from '../api/anonymousTips';
import { useJotformQuery } from './useJotformQuery';

export function useAnonymousTips() {
  return useJotformQuery(fetchAnonymousTips);
}
