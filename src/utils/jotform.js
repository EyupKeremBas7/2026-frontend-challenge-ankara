export function getAnswerByName(submission, fieldName) {
  const answers = submission?.answers && typeof submission.answers === 'object' ? submission.answers : null;
  if (!answers) return null;

  for (const a of Object.values(answers)) {
    if (a?.name === fieldName) return a?.answer ?? null;
  }
  return null;
}

// Expected format from mock data: "18-04-2026 20:10"
export function parseDdMmYyyyHmTimestamp(value) {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!m) return null;

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  const hh = Number(m[4]);
  const min = Number(m[5]);

  // Local time (good enough for ordering in UI)
  const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

