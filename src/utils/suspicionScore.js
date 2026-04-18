import { isSamePerson } from './fuzzyMatch';
import { getAnswerByName, parseDdMmYyyyHmTimestamp } from './jotform';

function confidenceMultiplier(confidence) {
  const c = String(confidence || '').toLowerCase().trim();
  if (c === 'high') return 1.5;
  if (c === 'low') return 0.5;
  return 1;
}

function addReason(reasons, reason) {
  reasons.push(reason);
}

export function computeSuspicionScore({ personName, personRecords, podoTimeline }) {
  let score = 0;
  const reasons = [];

  // Anonymous tip mentioning person → +2 per tip (confidence matters)
  const tips = Array.isArray(personRecords.anonymousTips) ? personRecords.anonymousTips : [];
  if (tips.length) {
    for (const t of tips) {
      const conf = getAnswerByName(t, 'confidence');
      const mult = confidenceMultiplier(conf);
      const delta = 2 * mult;
      score += delta;
      addReason(reasons, `+${delta} tip (${conf || 'medium'})`);
    }
  }

  // Sighting with Podo → +3
  const sightings = Array.isArray(personRecords.sightings) ? personRecords.sightings : [];
  if (sightings.length) {
    for (const s of sightings) {
      const seenWith = getAnswerByName(s, 'seenWith');
      const who = getAnswerByName(s, 'personName');
      const involvesPodo =
        (isSamePerson(who, 'Podo') && isSamePerson(seenWith, personName)) ||
        (isSamePerson(seenWith, 'Podo') && isSamePerson(who, personName));

      if (involvesPodo) {
        score += 3;
        addReason(reasons, '+3 seen with Podo');
      }
    }
  }

  // Last person seen with Podo → +5
  if (Array.isArray(podoTimeline) && podoTimeline.length) {
    const last = [...podoTimeline]
      .filter((e) => e?.seenWith)
      .sort((a, b) => (b.at?.getTime?.() ?? -Infinity) - (a.at?.getTime?.() ?? -Infinity))[0];

    if (last?.seenWith && isSamePerson(last.seenWith, personName)) {
      score += 5;
      addReason(reasons, '+5 last seen with Podo');
    }
  }

  // Message sent close to disappearance time → +2
  // We approximate disappearance time as the last known Podo sighting timestamp.
  const messages = Array.isArray(personRecords.messages) ? personRecords.messages : [];
  if (Array.isArray(podoTimeline) && podoTimeline.length && messages.length) {
    const lastKnown = [...podoTimeline]
      .filter((e) => e?.at)
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .at(-1);
    const t0 = lastKnown?.at?.getTime?.();

    if (t0) {
      for (const m of messages) {
        const ts = parseDdMmYyyyHmTimestamp(getAnswerByName(m, 'timestamp'));
        if (!ts) continue;
        const dtMin = Math.abs(ts.getTime() - t0) / (60 * 1000);
        if (dtMin <= 30) {
          score += 2;
          addReason(reasons, '+2 message near disappearance');
        }
      }
    }
  }

  return { score, reasons };
}

