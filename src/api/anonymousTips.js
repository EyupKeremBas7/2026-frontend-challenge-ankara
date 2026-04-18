import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchAnonymousTips() {
  if (import.meta.env.DEV) {
    const res = await fetch('/mock/anonymousTips.json');
    if (res.ok) return await res.json();
  }

  return await fetchJotformSubmissions(FORM_IDS.anonymousTips);
}
