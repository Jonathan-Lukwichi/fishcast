import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { LineChart, KPICard } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';

const SPECIES_LIST = [
  'Sardina pilchardus', 'Scomber scombrus', 'Octopus vulgaris',
  'Thunnus thynnus', 'Xiphias gladius', 'Sepia officinalis',
];
const ZONES = ['34.1.1 · Atlantique Nord-Est', '34.1.2 · Sahara', '34.2.0 · Tropical', '34.3.1 · Sud'];
const HORIZONS = [30, 60, 90];

const HIST = [[2020, 38000],[2021, 43000],[2022, 47000],[2023, 44000],[2024, 51000]];
const FC_DATA = {
  30: [[2025.0,51000],[2025.1,53400],[2025.2,55800]],
  60: [[2025.0,51000],[2025.1,53400],[2025.2,55800],[2025.3,54200],[2025.4,56900],[2025.5,59100]],
  90: [[2025.0,51000],[2025.1,53400],[2025.2,55800],[2025.3,54200],[2025.4,56900],[2025.5,59100],[2025.6,61800],[2025.7,60300],[2025.8,63400]],
};
const BANDS = {
  30: FC_DATA[30].map(([x,v]) => [x, v*0.92, v*1.08]),
  60: FC_DATA[60].map(([x,v]) => [x, v*0.91, v*1.09]),
  90: FC_DATA[90].map(([x,v]) => [x, v*0.90, v*1.10]),
};

const TABLE_ROWS = {
  30: [['J+10','52 100','47 900','56 300','healthy'],['J+20','53 800','49 500','58 100','healthy'],['J+30','55 800','51 300','60 300','healthy']],
  60: [['J+30','55 800','51 300','60 300','healthy'],['J+45','57 400','52 800','62 000','warning'],['J+60','59 100','53 800','64 400','warning']],
  90: [['J+30','55 800','51 300','60 300','healthy'],['J+60','59 100','53 800','64 400','warning'],['J+90','63 400','57 100','69 700','warning']],
};

const STATUS_STYLE = {
  healthy: { bg: `${FC.eco500}12`, color: FC.eco700, border: FC.eco300, label: 'Durable' },
  warning: { bg: `${FC.amber}12`,  color: FC.amber,  border: FC.amber,  label: 'Vigilance' },
};

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: FC.ink50, fontWeight: 500, marginBottom: 6, fontFamily: FC.mono, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '10px 14px',
        border: `1px solid ${FC.rule}`, borderRadius: 6,
        background: '#fff', fontFamily: FC.sans, fontSize: 13, color: FC.ink,
        cursor: 'pointer', outline: 'none', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B788C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 34,
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function Forecast({ page, setPage }) {
  const [species, setSpecies] = useState(SPECIES_LIST[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [horizon, setHorizon] = useState(90);
  const [ran, setRan] = useState(true);
  const [loading, setLoading] = useState(false);

  const run = () => { setRan(false); setLoading(true); setTimeout(() => { setLoading(false); setRan(true); }, 1600); };

  return (
    <Shell page={page} setPage={setPage}
      title="Prévision halieutique"
      sub="Modèle IA · Horizon 30–90 jours"
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }} className="fc-animate-in">

        {/* Config */}
        <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 16 }}>Paramètres de prévision</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <SelectField label="Espèce" value={species} onChange={setSpecies} options={SPECIES_LIST} />
            <SelectField label="Zone FAO" value={zone} onChange={setZone} options={ZONES} />
            <div>
              <label style={{ display: 'block', fontSize: 12, color: FC.ink50, fontWeight: 500, marginBottom: 6, fontFamily: FC.mono, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Horizon (jours)</label>
              <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: `1px solid ${FC.rule}` }}>
                {HORIZONS.map(h => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    flex: 1, padding: '10px 0', border: 'none',
                    borderRight: h !== 90 ? `1px solid ${FC.rule}` : 'none',
                    background: horizon === h ? FC.navy800 : '#fff',
                    color: horizon === h ? '#fff' : FC.ink70,
                    fontFamily: FC.mono, fontSize: 13, cursor: 'pointer',
                    fontWeight: horizon === h ? 600 : 400,
                    transition: 'all 0.15s',
                  }}>{h}j</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="fc-btn-eco" onClick={run} style={{ padding: '10px 24px', fontSize: 13 }}>
              {loading ? <><span className="fc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Calcul…</> : 'Lancer la prévision →'}
            </button>
            {ran && !loading && (
              <span style={{ fontSize: 12, color: FC.eco700, fontFamily: FC.mono, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: FC.eco500, display: 'inline-block' }} />
                Prévision calculée · MAPE 5.8%
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="fc-spinner" style={{ margin: '0 auto 20px' }} />
            <div style={{ fontFamily: FC.serif, fontSize: 18, color: FC.ink70 }}>Modèle IA en cours…</div>
            <div style={{ fontSize: 12, color: FC.ink50, fontFamily: FC.mono, marginTop: 6 }}>{species}</div>
          </div>
        )}

        {ran && !loading && (
          <div className="fc-animate-in">
            {/* KPIs */}
            <div className="fc-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
              <KPICard label={`Prévision J+${horizon}`} value={horizon === 30 ? '55 800' : horizon === 60 ? '59 100' : '63 400'} unit="t" delta={`+${horizon === 30 ? '9.4' : horizon === 60 ? '15.9' : '24.3'}%`} trend="up" />
              <KPICard label="Intervalle confiance" value={`±${horizon === 30 ? 8 : horizon === 60 ? 9 : 10}%`} unit="à 90%" />
              <KPICard label="Modèle sélectionné" value="Ensemble" unit="IA" />
              <KPICard label="MAPE" value="5.8" unit="%" delta="-1.2 pts" trend="up" />
            </div>

            {/* Chart */}
            <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div className="fc-eyebrow" style={{ marginBottom: 4 }}>{species}</div>
                  <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, letterSpacing: '-0.01em' }}>
                    Prévision {horizon} jours — {zone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[['Historique', FC.navy700, false], ['Prévision IA', FC.eco500, true], ['Intervalle', FC.eco300, false]].map(([l, c, dashed]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: FC.ink50, fontFamily: FC.mono }}>
                      <div style={{ width: 18, height: 2, background: c, borderRadius: 1, opacity: l === 'Intervalle' ? 0.4 : 1,
                        backgroundImage: dashed ? `repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 8px)` : undefined }} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <LineChart data={HIST} forecast={FC_DATA[horizon]} confidenceBand={BANDS[horizon]} width={980} height={270} yLabel="Tonnes" />
              </div>
            </div>

            {/* Table + Map */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="fc-card" style={{ padding: '22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Détail</div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 16, letterSpacing: '-0.01em' }}>
                  Prévisions par période
                </div>
                <table className="fc-table">
                  <thead>
                    <tr>
                      {['Période','Prévision (t)','Borne inf.','Borne sup.','Statut'].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS[horizon].map(([per, val, lo, hi, status]) => {
                      const s = STATUS_STYLE[status];
                      return (
                        <tr key={per}>
                          <td style={{ fontWeight: 600 }}>{per}</td>
                          <td style={{ fontFamily: FC.mono, fontWeight: 600 }}>{val}</td>
                          <td style={{ fontFamily: FC.mono, color: FC.ink50 }}>{lo}</td>
                          <td style={{ fontFamily: FC.mono, color: FC.ink50 }}>{hi}</td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: FC.mono }}>
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="fc-card" style={{ padding: '22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Vue géographique</div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 16, letterSpacing: '-0.01em' }}>
                  Carte constellation
                </div>
                <WorldMap
                  highlights={{ MAR: { status:'warning', intensity:0.7 }, SEN: { status:'healthy', intensity:0.6 }, MRT: { status:'critical', intensity:0.9 } }}
                  mode="constellation" width={460} height={220} showLegend
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
