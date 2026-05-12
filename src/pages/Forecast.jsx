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

const HIST = [[2020, 38000], [2021, 43000], [2022, 47000], [2023, 44000], [2024, 51000]];
const FC_30  = [[2025.0, 51000], [2025.1, 53400], [2025.2, 55800]];
const FC_60  = [[2025.0, 51000], [2025.1, 53400], [2025.2, 55800], [2025.3, 54200], [2025.4, 56900], [2025.5, 59100]];
const FC_90  = [[2025.0, 51000], [2025.1, 53400], [2025.2, 55800], [2025.3, 54200], [2025.4, 56900], [2025.5, 59100],
                [2025.6, 61800], [2025.7, 60300], [2025.8, 63400]];

const BANDS = {
  30: FC_30.map(([x, v]) => [x, v * 0.92, v * 1.08]),
  60: FC_60.map(([x, v]) => [x, v * 0.91, v * 1.09]),
  90: FC_90.map(([x, v]) => [x, v * 0.90, v * 1.10]),
};

const FC_DATA = { 30: FC_30, 60: FC_60, 90: FC_90 };

export default function Forecast({ page, setPage }) {
  const [species, setSpecies] = useState(SPECIES_LIST[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [horizon, setHorizon] = useState(90);
  const [ran, setRan] = useState(true);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setRan(true); }, 1600);
  };

  const selectStyle = {
    padding: '9px 14px', border: `1px solid ${FC.rule}`,
    background: '#fff', fontFamily: FC.sans, fontSize: 13,
    color: FC.ink, borderRadius: 4, appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B788C' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32,
  };

  return (
    <Shell page={page} setPage={setPage}
      title="Prévision halieutique"
      sub="Modèle IA · Horizon 30–90 jours"
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>

        {/* Config panel */}
        <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Paramètres de prévision</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: FC.ink50, marginBottom: 6 }}>Espèce</label>
              <select value={species} onChange={e => setSpecies(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                {SPECIES_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: FC.ink50, marginBottom: 6 }}>Zone FAO</label>
              <select value={zone} onChange={e => setZone(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: FC.ink50, marginBottom: 6 }}>Horizon (jours)</label>
              <div style={{ display: 'flex', gap: 0 }}>
                {HORIZONS.map((h, i) => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    flex: 1, padding: '9px 0', border: `1px solid ${FC.rule}`,
                    borderLeft: i === 0 ? undefined : 'none',
                    borderRadius: i === 0 ? '4px 0 0 4px' : i === 2 ? '0 4px 4px 0' : 0,
                    background: horizon === h ? FC.navy800 : '#fff',
                    color: horizon === h ? '#fff' : FC.ink70,
                    fontFamily: FC.mono, fontSize: 12, cursor: 'pointer',
                    fontWeight: horizon === h ? 600 : 400,
                  }}>{h}</button>
                ))}
              </div>
            </div>
            <button className="fc-btn-eco" onClick={run} style={{ borderRadius: 4, padding: '9px 20px', whiteSpace: 'nowrap' }}>
              {loading ? '…' : 'Lancer →'}
            </button>
          </div>
        </div>

        {ran && !loading && (
          <>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: FC.rule, border: `1px solid ${FC.rule}`, marginBottom: 24 }}>
              <KPICard label="Prévision J+90" value="63 400" unit="t" delta="+24.3%" trend="up" />
              <KPICard label="Intervalle conf." value="±10%" unit="à 90%" />
              <KPICard label="Modèle utilisé" value="IA" unit="ensemble" />
              <KPICard label="MAPE" value="5.8" unit="%" delta="-1.2 pts" trend="up" />
            </div>

            {/* Main chart */}
            <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div className="fc-eyebrow" style={{ marginBottom: 6 }}>{species}</div>
                  <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink }}>
                    Prévision {horizon} jours — {zone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  {[['Historique', FC.navy700, false], ['Prévision IA', FC.eco500, true]].map(([l, c, dashed]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: FC.ink70, fontFamily: FC.mono }}>
                      <div style={{ width: 20, height: 2, background: c, borderRadius: 1,
                        backgroundImage: dashed ? `repeating-linear-gradient(90deg, ${c} 0, ${c} 5px, transparent 5px, transparent 9px)` : undefined }} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <LineChart
                data={HIST}
                forecast={FC_DATA[horizon]}
                confidenceBand={BANDS[horizon]}
                width={980} height={280}
                yLabel="Tonnes"
              />
            </div>

            {/* Table */}
            <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
              <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Détail des prévisions</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FC.mono }}>
                <thead>
                  <tr style={{ background: FC.paperDeep }}>
                    {['Période', 'Prévision (t)', 'Borne inf.', 'Borne sup.', 'Statut'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: FC.ink70, fontWeight: 600, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['J+30', '53 400', '49 100', '57 700', 'healthy'],
                    ['J+60', '59 100', '53 800', '64 400', 'warning'],
                    ['J+90', '63 400', '57 100', '69 700', 'warning'],
                  ].map(([per, val, lo, hi, status]) => (
                    <tr key={per} style={{ borderTop: `1px solid ${FC.rule}` }}>
                      <td style={{ padding: '10px 14px', color: FC.ink }}>{per}</td>
                      <td style={{ padding: '10px 14px', color: FC.ink, fontWeight: 600 }}>{val}</td>
                      <td style={{ padding: '10px 14px', color: FC.ink50 }}>{lo}</td>
                      <td style={{ padding: '10px 14px', color: FC.ink50 }}>{hi}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 999, fontSize: 11,
                          background: status === 'healthy' ? `${FC.eco500}18` : `${FC.amber}20`,
                          color: status === 'healthy' ? FC.eco700 : FC.amber,
                          border: `1px solid ${status === 'healthy' ? FC.eco300 : FC.amber}`,
                        }}>
                          {status === 'healthy' ? 'Durable' : 'Vigilance'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Map */}
            <div className="fc-card" style={{ padding: '22px 24px' }}>
              <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Vue géographique</div>
              <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 18 }}>
                Prévision par zone — mode constellation
              </div>
              <WorldMap
                highlights={{ MAR: { status: 'warning', intensity: 0.7 }, SEN: { status: 'healthy', intensity: 0.6 }, MRT: { status: 'critical', intensity: 0.9 } }}
                mode="constellation"
                width={1000} height={300}
                showLegend
              />
            </div>
          </>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontFamily: FC.serif, fontSize: 18, color: FC.ink70, marginBottom: 8 }}>Calcul en cours…</div>
            <div style={{ fontSize: 13, color: FC.ink50, fontFamily: FC.mono }}>Modèle IA · {species}</div>
          </div>
        )}
      </div>
    </Shell>
  );
}
