import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchPersonalNotes() {
  if (import.meta.env.DEV) {
    const res = await fetch('/mock/personalNotes.json');
    if (res.ok) return await res.json();
  }

  return await fetchJotformSubmissions(FORM_IDS.personalNotes);
}
