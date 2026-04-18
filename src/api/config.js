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
  let attempts = 0;
  
  while (attempts < API_KEYS.length) {
    const currentKey = API_KEYS[currentKeyIndex];
    if (!currentKey) break;

    const response = await fetch(`${BASE_URL}/form/${formId}/submissions?apiKey=${currentKey}&limit=1000`);
    
    if (!response.ok) {
      throw new Error(`Jotform API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for explicit API Limit errors, Jotform usually returns 401 or features "Limit" in the message
    if (data.responseCode !== 200) {
      if (data.message && (data.message.toLowerCase().includes('limit') || data.responseCode === 401)) {
        console.warn(`API Key ${currentKeyIndex + 1} limit exceeded. Switching to next key...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempts++;
        continue;
      }
      throw new Error(`Jotform Error: ${data.message}`);
    }
    
    return data.content || [];
  }
  
  throw new Error("Tüm API Anahtarlarının limiti dolmuş!");
}
