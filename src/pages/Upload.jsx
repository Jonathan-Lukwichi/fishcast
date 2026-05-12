import { useState, useRef } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';

const STEPS = ['Sélection', 'Aperçu', 'Traitement', 'Terminé'];

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? FC.eco500 : active ? FC.navy800 : FC.paperDeep,
                color: done || active ? '#fff' : FC.ink50,
                fontSize: 12, fontWeight: 600, fontFamily: FC.mono,
                border: `2px solid ${done ? FC.eco500 : active ? FC.navy800 : FC.rule}`,
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? FC.ink : done ? FC.eco700 : FC.ink50 }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 12px', background: done ? FC.eco300 : FC.ruleSoft, borderRadius: 1, transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_COLS = [
  { name: 'date', key: true, desc: 'Date de débarquement' },
  { name: 'espece', key: true, desc: 'Nom scientifique ou commun' },
  { name: 'zone_fao', key: true, desc: 'Code zone FAO' },
  { name: 'poids_kg', key: true, desc: 'Poids total (kg)' },
  { name: 'bateaux', key: false, desc: 'Nombre de bateaux' },
  { name: 'port', key: false, desc: 'Port de débarquement' },
];

const PREVIEW_ROWS = [
  ['2024-01-15', 'Sardina pilchardus', '34.1.1', '12 450', '8', 'Agadir'],
  ['2024-01-15', 'Scomber scombrus',   '34.1.1', '3 820',  '3', 'Agadir'],
  ['2024-01-16', 'Sardina pilchardus', '34.1.2', '8 100',  '5', 'Laâyoune'],
  ['2024-01-17', 'Thunnus thynnus',    '34.2.0', '1 240',  '2', 'Dakhla'],
  ['2024-01-18', 'Octopus vulgaris',   '34.1.3', '4 560',  '6', 'Tan-Tan'],
];

function DropZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef();
  const handle = files => { if (files?.[0]) onFile(files[0]); };
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current.click()}
      style={{
        border: `2px dashed ${dragging ? FC.aqua : FC.rule}`,
        borderRadius: 12, padding: '56px 32px', textAlign: 'center',
        cursor: 'pointer', background: dragging ? `${FC.aqua}08` : FC.off,
        transition: 'all 0.2s',
      }}
    >
      <input ref={ref} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
        onChange={e => handle(e.target.files)} />

      {/* Upload icon */}
      <div style={{ width: 56, height: 56, borderRadius: 16, background: FC.paperDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15V4M12 4L8 8M12 4l4 4" stroke={FC.ink70} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16v3a2 2 0 002 2h14a2 2 0 002-2v-3" stroke={FC.ink50} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 600, color: FC.ink, marginBottom: 8 }}>
        {dragging ? 'Déposez ici' : 'Glissez votre fichier ici'}
      </div>
      <div style={{ fontSize: 13, color: FC.ink50, marginBottom: 20 }}>
        CSV, Excel (.xlsx / .xls) · Taille max 50 Mo
      </div>
      <button className="fc-btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}
        onClick={e => { e.stopPropagation(); ref.current.click(); }}>
        Parcourir les fichiers
      </button>
    </div>
  );
}

export default function Upload({ page, setPage }) {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(0);

  const handleFile = f => { setFile(f); setStep(1); };
  const handleProcess = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2400);
  };

  return (
    <Shell page={page} setPage={setPage}
      title="Import de données"
      sub="Débarquements · FAO · CSV / Excel"
    >
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <StepBar current={step} />

        {/* Step 0: Drop zone */}
        {step === 0 && (
          <div className="fc-animate-in">
            <DropZone onFile={handleFile} />

            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="fc-card-flat" style={{ padding: '20px 22px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 12 }}>Colonnes requises</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SAMPLE_COLS.filter(c => c.key).map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: FC.mono, fontSize: 12, padding: '2px 8px', background: `${FC.eco500}15`, color: FC.eco700, border: `1px solid ${FC.eco300}`, borderRadius: 4 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: FC.ink50 }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fc-card-flat" style={{ padding: '20px 22px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 12 }}>Colonnes optionnelles</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SAMPLE_COLS.filter(c => !c.key).map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: FC.mono, fontSize: 12, padding: '2px 8px', background: FC.paperDeep, color: FC.ink50, border: `1px solid ${FC.rule}`, borderRadius: 4 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: FC.ink50 }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${FC.rule}` }}>
                  <div className="fc-eyebrow" style={{ marginBottom: 8 }}>Sources supportées</div>
                  {['FAO FishStat', 'Données nationales', 'Journaux de bord'].map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: FC.ink70, marginBottom: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: FC.eco500 }} />{s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Preview */}
        {step === 1 && (
          <div className="fc-animate-in">
            <div className="fc-card-flat" style={{ padding: '22px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${FC.eco500}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" stroke={FC.eco700} strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6" stroke={FC.eco700} strokeWidth="1.8" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: FC.sans, fontSize: 14, fontWeight: 600, color: FC.ink }}>{file?.name}</div>
                    <div style={{ fontSize: 12, color: FC.ink50, fontFamily: FC.mono }}>{(file?.size / 1024).toFixed(1)} Ko · 312 lignes détectées</div>
                  </div>
                </div>
                <button className="fc-btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={() => { setFile(null); setStep(0); }}>
                  Changer
                </button>
              </div>

              <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Colonnes détectées</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {SAMPLE_COLS.map(c => (
                  <span key={c.name} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontFamily: FC.mono,
                    background: c.key ? `${FC.eco500}15` : FC.paperDeep,
                    color: c.key ? FC.eco700 : FC.ink50,
                    border: `1px solid ${c.key ? FC.eco300 : FC.rule}`,
                  }}>
                    {c.key && <span style={{ color: FC.eco500 }}>✓</span>}
                    {c.name}
                  </span>
                ))}
              </div>

              <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Aperçu — 5 premières lignes</div>
              <div style={{ overflowX: 'auto', borderRadius: 6, border: `1px solid ${FC.rule}` }}>
                <table className="fc-table">
                  <thead>
                    <tr>{SAMPLE_COLS.map(c => <th key={c.name}>{c.name}</th>)}</tr>
                  </thead>
                  <tbody>
                    {PREVIEW_ROWS.map((row, ri) => (
                      <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ fontFamily: FC.mono, fontSize: 12 }}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="fc-btn-eco" onClick={handleProcess} style={{ flex: 1, padding: '13px' }}>
                Traiter et analyser →
              </button>
              <button className="fc-btn-ghost" onClick={() => { setFile(null); setStep(0); }} style={{ padding: '13px 20px' }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="fc-animate-in" style={{ textAlign: 'center', padding: '72px 0' }}>
            <div className="fc-spinner" style={{ margin: '0 auto 28px' }} />
            <div style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 600, color: FC.ink, marginBottom: 10 }}>
              Traitement en cours…
            </div>
            <div style={{ fontSize: 13, color: FC.ink50, fontFamily: FC.mono, maxWidth: 320, margin: '0 auto' }}>
              Normalisation · Détection des espèces · Indexation des zones FAO
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {['Lecture du fichier ✓', 'Normalisation ✓', 'Indexation…'].map((t, i) => (
                <span key={t} style={{
                  fontSize: 11, fontFamily: FC.mono, padding: '4px 10px', borderRadius: 999,
                  background: i < 2 ? `${FC.eco500}15` : FC.paperDeep,
                  color: i < 2 ? FC.eco700 : FC.ink50,
                  border: `1px solid ${i < 2 ? FC.eco300 : FC.rule}`,
                }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="fc-animate-in">
            <div className="fc-card-flat" style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${FC.eco500}18`, border: `2px solid ${FC.eco300}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-12" stroke={FC.eco500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="40" strokeDashoffset="40"
                    style={{ animation: 'fc-check 0.5s ease 0.1s forwards' }} />
                </svg>
              </div>
              <div style={{ fontFamily: FC.serif, fontSize: 24, fontWeight: 700, color: FC.ink, marginBottom: 8 }}>
                Import réussi
              </div>
              <div style={{ fontSize: 14, color: FC.ink50, marginBottom: 28 }}>
                <span style={{ fontFamily: FC.mono, color: FC.eco700, fontWeight: 600 }}>4 espèces</span> · <span style={{ fontFamily: FC.mono }}>312 lignes</span> · <span style={{ fontFamily: FC.mono }}>Période : Jan–Mar 2024</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                {[['312', 'enregistrements'], ['4', 'espèces'], ['3', 'mois']].map(([v, l]) => (
                  <div key={l} style={{ padding: '14px', background: FC.paper, borderRadius: 8, border: `1px solid ${FC.rule}` }}>
                    <div style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 700, color: FC.ink }}>{v}</div>
                    <div style={{ fontSize: 11, color: FC.ink50, fontFamily: FC.mono }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="fc-btn-eco" onClick={() => setPage('analysis')} style={{ padding: '12px 24px' }}>
                  Voir l'analyse →
                </button>
                <button className="fc-btn-ghost" onClick={() => { setFile(null); setStep(0); }} style={{ padding: '12px 20px' }}>
                  Importer un autre
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
