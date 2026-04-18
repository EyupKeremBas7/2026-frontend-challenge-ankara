import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchSightings() {
  if (import.meta.env.DEV) {
    const res = await fetch('/mock/sightings.json');
    if (res.ok) return await res.json();
  }

  return await fetchJotformSubmissions(FORM_IDS.sightings);
}
