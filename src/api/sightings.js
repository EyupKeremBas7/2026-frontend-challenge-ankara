import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchSightings() {
  return await fetchJotformSubmissions(FORM_IDS.sightings);
}
