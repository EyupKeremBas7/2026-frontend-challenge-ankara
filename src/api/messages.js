import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchMessages() {
  return await fetchJotformSubmissions(FORM_IDS.messages);
}
