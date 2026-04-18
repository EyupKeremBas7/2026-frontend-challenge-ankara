import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://api.jotform.com';

function parseDotEnv(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function safeCsvCell(value) {
  if (value === null || value === undefined) return '';
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  // Excel-friendly CSV escaping
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function toCsv(rows, columns) {
  const header = columns.map(safeCsvCell).join(',');
  const lines = rows.map((row) => columns.map((c) => safeCsvCell(row[c])).join(','));
  return [header, ...lines].join('\n') + '\n';
}

function normalizeSubmission(submission) {
  const row = {
    id: submission?.id ?? '',
    form_id: submission?.form_id ?? '',
    status: submission?.status ?? '',
    created_at: submission?.created_at ?? '',
    updated_at: submission?.updated_at ?? '',
    ip: submission?.ip ?? '',
    new: submission?.new ?? '',
  };

  const answers = submission?.answers && typeof submission.answers === 'object' ? submission.answers : {};
  for (const [qid, a] of Object.entries(answers)) {
    row[`q_${qid}_text`] = a?.text ?? '';
    row[`q_${qid}_answer`] = a?.answer ?? '';
  }

  return row;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJotformSubmissions({ formId, apiKeys, limit = 1000 }) {
  let currentKeyIndex = 0;
  let attempts = 0;
  let backoffMs = 750;

  while (attempts < apiKeys.length) {
    const currentKey = apiKeys[currentKeyIndex];
    if (!currentKey) break;

    const url = `${BASE_URL}/form/${formId}/submissions?apiKey=${currentKey}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      // Rate limiting / transient issues: wait, rotate key, retry.
      if (response.status === 429 || response.status === 503) {
        const retryAfterHeader = response.headers.get('retry-after');
        const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : NaN;
        const waitMs = Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? retryAfterMs : backoffMs;

        console.warn(
          `HTTP ${response.status} for form ${formId} (key ${currentKeyIndex + 1}/${apiKeys.length}). Waiting ${Math.round(waitMs)}ms then retrying...`
        );

        await sleep(waitMs);
        backoffMs = Math.min(backoffMs * 2, 20_000);

        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempts++;
        continue;
      }

      throw new Error(`Jotform API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.responseCode !== 200) {
      const msg = String(data.message || '');
      const isLimitish = msg.toLowerCase().includes('limit') || data.responseCode === 401;
      if (isLimitish) {
        console.warn(
          `Jotform limit/auth issue for form ${formId} (key ${currentKeyIndex + 1}/${apiKeys.length}). Switching key and retrying...`
        );
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempts++;
        continue;
      }
      throw new Error(`Jotform Error: ${msg || 'Unknown error'}`);
    }

    return Array.isArray(data.content) ? data.content : [];
  }

  throw new Error('Tüm API Anahtarlarının limiti dolmuş (veya geçersiz).');
}

async function main() {
  const repoRoot = process.cwd();
  const envPath = path.join(repoRoot, '.env');
  const exportsDir = path.join(repoRoot, 'exports');

  const envText = await readFile(envPath, 'utf8');
  const env = parseDotEnv(envText);

  const apiKeys = [env.VITE_API_KEY_1, env.VITE_API_KEY_2, env.VITE_API_KEY_3].filter(Boolean);
  if (apiKeys.length === 0) {
    throw new Error('`.env` içinde en az bir `VITE_API_KEY_*` bulunmalı.');
  }

  const forms = {
    checkins: env.VITE_FORM_CHECKINS,
    messages: env.VITE_FORM_MESSAGES,
    sightings: env.VITE_FORM_SIGHTINGS,
    personalNotes: env.VITE_FORM_PERSONAL_NOTES,
    anonymousTips: env.VITE_FORM_ANONYMOUS_TIPS,
  };

  const missing = Object.entries(forms).filter(([, id]) => !id).map(([k]) => k);
  if (missing.length) {
    throw new Error(`.env içinde eksik form id(leri): ${missing.join(', ')}`);
  }

  await mkdir(exportsDir, { recursive: true });

  for (const [name, formId] of Object.entries(forms)) {
    const raw = await fetchJotformSubmissions({ formId, apiKeys });
    const normalized = raw.map(normalizeSubmission);

    const jsonPath = path.join(exportsDir, `${name}.json`);
    await writeFile(jsonPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');

    const allColumns = new Set();
    for (const r of normalized) for (const k of Object.keys(r)) allColumns.add(k);
    const columns = Array.from(allColumns);
    const preferredOrder = [
      'id',
      'form_id',
      'status',
      'created_at',
      'updated_at',
      'ip',
      'new',
    ];
    columns.sort((a, b) => {
      const ai = preferredOrder.indexOf(a);
      const bi = preferredOrder.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b);
    });

    const csvPath = path.join(exportsDir, `${name}.csv`);
    await writeFile(csvPath, toCsv(normalized, columns), 'utf8');

    // Minimal progress for terminal visibility
    console.log(`${name}: ${raw.length} submissions → exports/${name}.{json,csv}`);
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});

