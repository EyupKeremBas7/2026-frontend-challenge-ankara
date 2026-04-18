import React from 'react';
import { getAnswerByName } from '../utils/jotform';

function recordSummary(record, sourceName) {
  const timestamp = getAnswerByName(record, 'timestamp') || 'Unknown time';
  const location = getAnswerByName(record, 'location') || 'Unknown location';

  if (sourceName === 'messages') {
    const sender = getAnswerByName(record, 'senderName') || 'Unknown sender';
    const recipient = getAnswerByName(record, 'recipientName') || 'Unknown recipient';
    const text = getAnswerByName(record, 'text') || '';
    return `${timestamp} · ${location} · ${sender} → ${recipient}${text ? ` · ${text}` : ''}`;
  }

  if (sourceName === 'sightings') {
    const person = getAnswerByName(record, 'personName') || 'Unknown person';
    const seenWith = getAnswerByName(record, 'seenWith') || 'Unknown person';
    const note = getAnswerByName(record, 'note') || '';
    return `${timestamp} · ${location} · ${person} with ${seenWith}${note ? ` · ${note}` : ''}`;
  }

  if (sourceName === 'anonymousTips') {
    const suspect = getAnswerByName(record, 'suspectName') || 'Unknown suspect';
    const tip = getAnswerByName(record, 'tip') || '';
    const confidence = getAnswerByName(record, 'confidence') || 'medium';
    return `${timestamp} · ${location} · suspect: ${suspect} · ${confidence}${tip ? ` · ${tip}` : ''}`;
  }

  if (sourceName === 'personalNotes') {
    const author = getAnswerByName(record, 'authorName') || 'Unknown author';
    const note = getAnswerByName(record, 'note') || '';
    return `${timestamp} · ${location} · ${author}${note ? ` · ${note}` : ''}`;
  }

  const person = getAnswerByName(record, 'personName') || 'Unknown person';
  const note = getAnswerByName(record, 'note') || '';
  return `${timestamp} · ${location} · ${person}${note ? ` · ${note}` : ''}`;
}

function SourceBlock({ title, sourceName, records }) {
  if (!records?.length) return null;

  return (
    <div className="person-card" style={{ marginTop: 10 }}>
      <div className="person-card-top">
        <div className="person-name">{title}</div>
        <div className="person-score">{records.length}</div>
      </div>
      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
        {records.slice(0, 6).map((record, index) => (
          <div key={`${record?.id || sourceName}_${index}`} className="chip" style={{ borderRadius: 10 }}>
            {recordSummary(record, sourceName)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPanel({ selectedPerson }) {
  if (!selectedPerson) {
    return <div className="state-box empty">Select a person from Most suspicious to view linked records</div>;
  }

  const records = selectedPerson.records || {};
  const totalLinked =
    (records.checkins?.length || 0) +
    (records.messages?.length || 0) +
    (records.sightings?.length || 0) +
    (records.personalNotes?.length || 0) +
    (records.anonymousTips?.length || 0);

  return (
    <div className="state-box success" style={{ alignItems: 'stretch', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Detail panel</h3>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(226, 232, 240, 0.78)' }}>
          {totalLinked} linked records
        </div>
      </div>

      <div className="person-card" style={{ marginTop: 12 }}>
        <div className="person-card-top">
          <div>
            <div className="person-name">{selectedPerson.canonicalName}</div>
            {selectedPerson.aliases?.length > 1 ? (
              <div className="person-aliases">
                aliases: {selectedPerson.aliases.filter((a) => a !== selectedPerson.canonicalName).join(', ')}
              </div>
            ) : null}
          </div>
          <button className="button-secondary" onClick={() => console.log('[RAW DATA] Selected person', selectedPerson)}>
            Log selected
          </button>
        </div>
      </div>

      <SourceBlock title="Checkins" sourceName="checkins" records={records.checkins} />
      <SourceBlock title="Messages" sourceName="messages" records={records.messages} />
      <SourceBlock title="Sightings" sourceName="sightings" records={records.sightings} />
      <SourceBlock title="Personal Notes" sourceName="personalNotes" records={records.personalNotes} />
      <SourceBlock title="Anonymous Tips" sourceName="anonymousTips" records={records.anonymousTips} />
    </div>
  );
}
