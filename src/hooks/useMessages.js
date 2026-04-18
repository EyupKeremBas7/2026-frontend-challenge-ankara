import { fetchMessages } from '../api/messages';
import { useJotformQuery } from './useJotformQuery';

export function useMessages() {
  return useJotformQuery(fetchMessages);
}
