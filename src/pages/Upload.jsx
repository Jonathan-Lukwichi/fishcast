import { useState, useRef } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';

const SAMPLE_COLS = ['date', 'espece', 'zone_fao', 'poids_kg', 'bateaux', 'port'];

function ColBadge({ col }) {
  const isKey = ['date', 'espece', 'zone_fao', 'poids_kg'].includes(col);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999, fontSize: 11,
      background: isKey ? `${FC.eco500}18` : FC.paperDeep,
      color: isKey ? FC.eco700 : FC.ink50,
      border: `1px solid ${isKey ? FC.eco300 : FC.rule}`,
      fontFamily: FC.mono,
    }}>
      {isKey && <span style={{ color: FC.eco500 }}>✓</span>}
      {col}
    </span>
  );
}

function DropZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef();

  const handle = files => {
    if (files?.[0]) onFile(files[0]);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current.click()}
      style={{
        border: `2px dashed ${dragging ? FC.aqua : FC.rule}`,
        borderRadius: 10, padding: '52px 32px', textAlign: 'center',
        cursor: 'pointer', background: dragging ? `${FC.aqua}08` : FC.off,
        transition: 'all 0.2s',
      }}
    >
      <input ref={ref} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
        onChange={e => handle(e.target.files)} />
      <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.5 }}>↑</div>
      <div style={{ fontFamily: FC.serif, fontSize: 18, color: FC.ink, marginBottom: 6 }}>
        Glissez votre fichier ici
      </div>
      <div style={{ fontSize: 13, color: FC.ink50 }}>
        CSV, Excel (.xlsx) · Taille max 50 MB
      </div>
      <button className="fc-btn-ghost" style={{ marginTop: 18, fontSize: 13, padding: '8px 18px' }}>
        Parcourir
      </button>
    </div>
  );
}

export default function Upload({ page, setPage }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | preview | processing | done | error
  const [rows] = useState(5);

  const handleFile = f => {
    setFile(f);
    setStatus('preview');
  };

  const handleProcess = () => {
    setStatus('processing');
    setTimeout(() => setStatus('done'), 2200);
  };

  return (
    <Shell page={page} setPage={setPage} title="Import de données" sub="Débarquements · FAO">
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {status === 'idle' && (
          <>
            <DropZone onFile={handleFile} />

            <div style={{ marginTop: 28 }}>
              <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Format attendu</div>
              <div className="fc-card" style={{ padding: '18px 20px' }}>
                <div style={{ marginBottom: 12, fontSize: 13, color: FC.ink70 }}>
                  Colonnes détectées automatiquement. Colonnes <span style={{ color: FC.eco500 }}>recommandées</span> pour de meilleures prévisions :
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SAMPLE_COLS.map(c => <ColBadge key={c} col={c} />)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Sources de données supportées</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {['FAO FishStat', 'Données nationales', 'Journaux de bord'].map(src => (
                  <div key={src} className="fc-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: FC.eco500, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: FC.ink70 }}>{src}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {status === 'preview' && (
          <div>
            <div className="fc-card" style={{ padding: '18px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: FC.serif, fontSize: 15, fontWeight: 600, color: FC.ink }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: FC.ink50 }}>{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button className="fc-btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}
                  onClick={() => { setFile(null); setStatus('idle'); }}>
                  Changer
                </button>
              </div>

              <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Colonnes détectées</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {SAMPLE_COLS.map(c => <ColBadge key={c} col={c} />)}
              </div>

              <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Aperçu ({rows} premières lignes)</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: FC.mono }}>
                  <thead>
                    <tr style={{ background: FC.paperDeep }}>
                      {SAMPLE_COLS.map(c => (
                        <th key={c} style={{ padding: '8px 12px', textAlign: 'left', color: FC.ink70, fontWeight: 600 }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['2024-01-15', 'Sardina pilchardus', '34.1.1', '12 450', '8', 'Agadir'],
                      ['2024-01-15', 'Scomber scombrus',   '34.1.1', '3 820',  '3', 'Agadir'],
                      ['2024-01-16', 'Sardina pilchardus', '34.1.2', '8 100',  '5', 'Laâyoune'],
                      ['2024-01-17', 'Thunnus thynnus',    '34.2.0', '1 240',  '2', 'Dakhla'],
                      ['2024-01-18', 'Octopus vulgaris',   '34.1.3', '4 560',  '6', 'Tan-Tan'],
                    ].map((row, ri) => (
                      <tr key={ri} style={{ borderTop: `1px solid ${FC.rule}` }}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '8px 12px', color: FC.ink70 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="fc-btn-eco" onClick={handleProcess} style={{ width: '100%', justifyContent: 'center', borderRadius: 4 }}>
              Traiter et analyser →
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 48, height: 48, border: `3px solid ${FC.eco300}`, borderTopColor: FC.eco700,
              borderRadius: '50%', margin: '0 auto 24px',
              animation: 'fc-pulse-dot 1s linear infinite' }} />
            <div style={{ fontFamily: FC.serif, fontSize: 20, color: FC.ink, marginBottom: 8 }}>Traitement en cours…</div>
            <div style={{ fontSize: 13, color: FC.ink50 }}>Normalisation des données, détection des espèces</div>
          </div>
        )}

        {status === 'done' && (
          <div className="fc-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14, color: FC.eco500 }}>✓</div>
            <div style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 600, color: FC.ink, marginBottom: 8 }}>
              Données importées avec succès
            </div>
            <div style={{ fontSize: 14, color: FC.ink50, marginBottom: 28 }}>
              4 espèces · 312 enregistrements · Période : Jan–Mar 2024
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="fc-btn-eco" onClick={() => setPage('analysis')} style={{ borderRadius: 4 }}>
                Voir l'analyse →
              </button>
              <button className="fc-btn-ghost" onClick={() => { setFile(null); setStatus('idle'); }} style={{ borderRadius: 4 }}>
                Importer un autre fichier
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
