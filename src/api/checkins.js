import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchCheckins() {
  return await fetchJotformSubmissions(FORM_IDS.checkins);
}
