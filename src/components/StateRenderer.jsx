import React, { useState } from 'react';

export function StateRenderer({ loading, error, data, name }) {
  const [showPreview, setShowPreview] = useState(false);

  if (loading) return <div className="state-box loading">Loading {name}...</div>;
  if (error) return <div className="state-box error">Error ({name}): {error.message}</div>;
  if (!data?.length) return <div className="state-box empty">No data for {name}</div>;

  return (
    <div className="state-box success">
      <h3>{name} loaded ({data.length} records)</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => console.log(`[RAW DATA] ${name}`, data)}>Log raw evidence</button>
        <button className="button-secondary" onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      {showPreview && (
        <div className="preview">
          <div className="preview-title">
            <span>Preview (first 2 records)</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <pre>{JSON.stringify(data.slice(0, 2), null, 2)}</pre>
        </div>
      )}

      <div className="hint" style={{ marginTop: 10 }}>
        “Log raw evidence” veriyi tarayıcı konsoluna yazar (DevTools Console).
      </div>
    </div>
  );
}
