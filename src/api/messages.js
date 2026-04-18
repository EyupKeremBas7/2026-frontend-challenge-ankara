import { FORM_IDS, fetchJotformSubmissions } from './config';

export async function fetchMessages() {
  if (import.meta.env.DEV) {
    const res = await fetch('/mock/messages.json');
    if (res.ok) return await res.json();
  }

  return await fetchJotformSubmissions(FORM_IDS.messages);
}
