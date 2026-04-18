// Read from .env via Vite's import.meta.env (VITE_ prefix required)
export const ACTIVE_API_KEY = import.meta.env.VITE_API_KEY_1;

export const FORM_IDS = {
  checkins: import.meta.env.VITE_FORM_CHECKINS,
  messages: import.meta.env.VITE_FORM_MESSAGES,
  sightings: import.meta.env.VITE_FORM_SIGHTINGS,
  personalNotes: import.meta.env.VITE_FORM_PERSONAL_NOTES,
  anonymousTips: import.meta.env.VITE_FORM_ANONYMOUS_TIPS,
};

export const BASE_URL = 'https://api.jotform.com';

export async function fetchJotformSubmissions(formId) {
  const response = await fetch(`${BASE_URL}/form/${formId}/submissions?apiKey=${ACTIVE_API_KEY}&limit=1000`);
  if (!response.ok) {
    throw new Error(`Jotform API Error: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.responseCode !== 200) {
    throw new Error(`Jotform Error: ${data.message}`);
  }
  return data.content || [];
}
