import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchPersonalNotes() {
  return await fetchJotformSubmissions(FORM_IDS.personalNotes);
}
