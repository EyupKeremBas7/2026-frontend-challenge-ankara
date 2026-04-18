// Read from .env via Vite's import.meta.env (VITE_ prefix required)
const API_KEYS = [
  import.meta.env.VITE_API_KEY_1,
  import.meta.env.VITE_API_KEY_2,
  import.meta.env.VITE_API_KEY_3
].filter(Boolean);

let currentKeyIndex = 0;

export const FORM_IDS = {
  checkins: import.meta.env.VITE_FORM_CHECKINS,
  messages: import.meta.env.VITE_FORM_MESSAGES,
  sightings: import.meta.env.VITE_FORM_SIGHTINGS,
  personalNotes: import.meta.env.VITE_FORM_PERSONAL_NOTES,
  anonymousTips: import.meta.env.VITE_FORM_ANONYMOUS_TIPS,
};

export const BASE_URL = 'https://api.jotform.com';

export async function fetchJotformSubmissions(formId) {
  if (!API_KEYS.length) {
    throw new Error('Jotform API key bulunamadı. VITE_API_KEY_1 (veya 2/3) tanımla.');
  }

  let attempts = 0;
  
  while (attempts < API_KEYS.length) {
    const currentKey = API_KEYS[currentKeyIndex];
    if (!currentKey) break;

    const response = await fetch(`${BASE_URL}/form/${formId}/submissions?apiKey=${currentKey}&limit=1000`);

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const message = String(data?.message || response.statusText || '').toLowerCase();
    const isRateOrAuthLimit =
      response.status === 401 ||
      response.status === 429 ||
      message.includes('limit') ||
      message.includes('too many') ||
      message.includes('quota');

    if (!response.ok || data?.responseCode !== 200) {
      if (isRateOrAuthLimit) {
        console.warn(`API Key ${currentKeyIndex + 1} limit/auth sorunu. Sonraki key deneniyor...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempts++;
        continue;
      }

      const reason = data?.message || response.statusText || 'Unknown API error';
      throw new Error(`Jotform API Error: ${reason}`);
    }
    
    return data.content || [];
  }
  
  throw new Error('Tüm API anahtarları rate/auth limitine takıldı.');
}
