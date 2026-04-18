import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchAnonymousTips() {
  return await fetchJotformSubmissions(FORM_IDS.anonymousTips);
}
