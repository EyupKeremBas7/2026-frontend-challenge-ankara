import { isSamePerson, normalizeName } from './fuzzyMatch';

function getAnswerByName(submission, fieldName) {
  const answers = submission?.answers && typeof submission.answers === 'object' ? submission.answers : null;
  if (!answers) return null;

  for (const a of Object.values(answers)) {
    if (a?.name === fieldName) return a?.answer ?? null;
  }
  return null;
}

function pushName(out, name) {
  const s = typeof name === 'string' ? name.trim() : '';
  if (!s) return;
  out.push(s);
}

function extractNamesFromRecord(record, sourceName) {
  const names = [];

  if (sourceName === 'checkins') {
    pushName(names, getAnswerByName(record, 'personName'));
  } else if (sourceName === 'sightings') {
    pushName(names, getAnswerByName(record, 'personName'));
    pushName(names, getAnswerByName(record, 'seenWith'));
  } else if (sourceName === 'messages') {
    pushName(names, getAnswerByName(record, 'senderName'));
    pushName(names, getAnswerByName(record, 'recipientName'));
  } else if (sourceName === 'personalNotes') {
    pushName(names, getAnswerByName(record, 'authorName'));
  } else if (sourceName === 'anonymousTips') {
    pushName(names, getAnswerByName(record, 'suspectName'));
  }

  return names;
}

function findMatchingPersonId(peopleById, candidateName) {
  for (const person of Object.values(peopleById)) {
    if (isSamePerson(person.canonicalName, candidateName)) return person.id;
    for (const alias of person.aliases) {
      if (isSamePerson(alias, candidateName)) return person.id;
    }
  }
  return null;
}

export function buildPersonIndex({ checkins, messages, sightings, personalNotes, anonymousTips }) {
  const sources = {
    checkins: Array.isArray(checkins) ? checkins : [],
    messages: Array.isArray(messages) ? messages : [],
    sightings: Array.isArray(sightings) ? sightings : [],
    personalNotes: Array.isArray(personalNotes) ? personalNotes : [],
    anonymousTips: Array.isArray(anonymousTips) ? anonymousTips : [],
  };

  const peopleById = {};
  const peopleOrder = [];

  const ensurePerson = (name) => {
    const matchId = findMatchingPersonId(peopleById, name);
    if (matchId) {
      peopleById[matchId].aliases.add(name);
      return matchId;
    }

    const id = normalizeName(name) || `person_${peopleOrder.length + 1}`;
    peopleById[id] = {
      id,
      canonicalName: name,
      normalizedName: normalizeName(name),
      aliases: new Set([name]),
      records: {
        checkins: [],
        messages: [],
        sightings: [],
        personalNotes: [],
        anonymousTips: [],
      },
    };
    peopleOrder.push(id);
    return id;
  };

  for (const [sourceName, records] of Object.entries(sources)) {
    for (const record of records) {
      const names = extractNamesFromRecord(record, sourceName);
      for (const name of names) {
        const pid = ensurePerson(name);
        peopleById[pid].records[sourceName].push(record);
      }
    }
  }

  const people = peopleOrder.map((id) => {
    const p = peopleById[id];
    return {
      ...p,
      aliases: Array.from(p.aliases).sort((a, b) => a.localeCompare(b)),
    };
  });

  return { peopleById, people };
}

