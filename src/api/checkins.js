import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchCheckins() {
  // Dev mode: prefer local JSON to avoid rate limits during development.
  if (import.meta.env.DEV) {
    const res = await fetch('/mock/checkins.json');
    if (res.ok) return await res.json();
  }

  return await fetchJotformSubmissions(FORM_IDS.checkins);
}
