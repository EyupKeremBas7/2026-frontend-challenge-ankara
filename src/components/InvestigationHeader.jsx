import React from 'react';

export function InvestigationHeader({ rootCountText, navigateToRoot, currentPath, query, setQuery }) {
  return (
    <header className="app-header desk-top">
      <div className="investigation-header-main">
        <div className="case-meta">
          <div className="investigation-title-row">
            <button className="button-secondary" onClick={() => navigateToRoot('/')}>
              ← Ana menüye dön
            </button>
            <h1>Kayıp Podo Soruşturma Masası</h1>
            <span aria-hidden="true" className="title-sentinel" />
          </div>
          <p>Soruşturma görünümü</p>
          <div className="case-badges">
            <span className="badge ok">{rootCountText}</span>
          </div>
        </div>
      </div>

      {currentPath === '/suspicious-root' ? (
        <div className="search-panel investigation-search-center">
          <label className="search-label">Hızlı kişi arama</label>
          <div className="search-row">
            <input
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İsim, konum veya anahtar kelime..."
            />
            <button className="button-secondary" onClick={() => setQuery('')} disabled={!query.trim()}>
              Temizle
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
