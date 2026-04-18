import React from 'react';
import { StateRenderer } from './StateRenderer';

export function LandingPage({ totalRecords, hasAnyError, dataReady, navigateToRoot, sources }) {
  const { checkins, messages, sightings, personalNotes, anonymousTips } = sources;

  return (
    <>
      <header className="app-header landing-top">
        <img className="detective-hero detective-hero-large" src="/dedektif_podo.png" alt="Dedektif Podo" />

        <div className="case-meta landing-meta">
          <h1>Kayıp Podo Soruşturma Masası</h1>
          <p>Tüm soruşturma adımlarına tek giriş ekranından ulaş.</p>
          <div className="case-badges">
            <span className="badge accent">Dosya: ANK-PO-26</span>
            <span className="badge ok">Toplanan kayıt: {totalRecords}</span>
            <span className="badge warn">Durum: {hasAnyError ? 'Sorun var' : dataReady ? 'Hazır' : 'Yükleniyor'}</span>
          </div>
        </div>
      </header>

      <main className="dashboard" style={{ position: 'relative' }}>
        <section className="root-menu-panel" style={{ maxWidth: '100%', marginTop: 6 }}>
          <div className="root-menu-title">Ana Menü</div>
          <div className="root-menu-grid root-menu-grid-landing">
            <a
              className="root-menu-card"
              href="/chain-root"
              onClick={(e) => {
                e.preventDefault();
                navigateToRoot('/chain-root');
              }}
            >
              <strong>Podo’s chain of events</strong>
              <span>Zaman akışını aç</span>
            </a>
            <a
              className="root-menu-card"
              href="/suspicious-root"
              onClick={(e) => {
                e.preventDefault();
                navigateToRoot('/suspicious-root');
              }}
            >
              <strong>Most suspicious</strong>
              <span>Şüpheli listesini aç</span>
            </a>
            <a
              className="root-menu-card"
              href="/detail-root"
              onClick={(e) => {
                e.preventDefault();
                navigateToRoot('/detail-root');
              }}
            >
              <strong>Detail panel</strong>
              <span>Seçili kişi kayıtlarını aç</span>
            </a>
          </div>
        </section>

        <section style={{ marginTop: 16 }}>
          <div className="data-sources-grid">
            <StateRenderer name="Checkins" {...checkins} />
            <StateRenderer name="Messages" {...messages} />
            <StateRenderer name="Sightings" {...sightings} />
            <StateRenderer name="Personal Notes" {...personalNotes} />
            <StateRenderer name="Anonymous Tips" {...anonymousTips} />
          </div>
        </section>
      </main>
    </>
  );
}
