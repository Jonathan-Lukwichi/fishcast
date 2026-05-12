import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { LineChart, KPICard } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';

// Today = May 2026
const TODAY_FRAC = 2026.37;
const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

function monthLabel(offsetMonths) {
  const totalMonths = 5 + offsetMonths; // May = 4 (0-indexed), but start from +1 = June
  const m = totalMonths % 12;
  const y = 2026 + Math.floor(totalMonths / 12);
  return `${MONTHS_FR[m]} ${y}`;
}

const SOURCES = [
  { id: 'marine',     label: 'Atlantique (FAO 34)' },
  { id: 'tanganyika', label: 'Lac Tanganyika (RDC)' },
  { id: 'congo',      label: 'Fleuve Congo (RDC)' },
  { id: 'lualaba',    label: 'Rivière Lualaba (RDC)' },
];

const SPECIES_BY_SOURCE = {
  marine:     ['Sardina pilchardus','Scomber scombrus','Octopus vulgaris','Thunnus thynnus','Xiphias gladius'],
  tanganyika: ['Limnothrissa miodon (Kapenta)','Stolothrissa tanganicae','Lates stappersii','Oreochromis tanganicae'],
  congo:      ['Clarias gariepinus (Silure)','Hydrocynus vittatus','Synodontis sp.','Oreochromis niloticus'],
  lualaba:    ['Tilapia macrochir','Labeo mesops','Mormyrus longirostris','Schilbe mystus'],
};

const ZONES_BY_SOURCE = {
  marine:     ['34.1.1 · Atlantique Nord-Est','34.1.2 · Sahara','34.2.0 · Tropical','34.3.1 · Sud'],
  tanganyika: ['Nord Tanganyika','Centre Tanganyika','Sud Tanganyika','Zone Kalemie'],
  congo:      ['Pool Malebo','Bassin central','Bas-Congo','Kisangani amont'],
  lualaba:    ['Kongolo–Bukama','Kalemie aval','Zone Kamina','Amont Bukavu'],
};

// Historical data: 2020–2026 (current year up to today)
const BASE_HIST = {
  marine:     [[2020,38000],[2021,43000],[2022,47000],[2023,44000],[2024,51000],[2025,54200],[TODAY_FRAC,56800]],
  tanganyika: [[2020,13900],[2021,16200],[2022,17500],[2023,16800],[2024,18400],[2025,19100],[TODAY_FRAC,19800]],
  congo:      [[2020,27200],[2021,30100],[2022,31800],[2023,30900],[2024,32600],[2025,33800],[TODAY_FRAC,34500]],
  lualaba:    [[2020,6800], [2021,7900], [2022,8600], [2023,8800], [2024,9800], [2025,10400],[TODAY_FRAC,10800]],
};

// Growth rates per source (annual %)
const GROWTH = { marine: 0.052, tanganyika: 0.044, congo: 0.038, lualaba: 0.041 };

// Generate monthly forecast from today out to horizonMonths
function buildForecast(source, horizonMonths) {
  const last = BASE_HIST[source][BASE_HIST[source].length - 1];
  const baseVal = last[1];
  const monthlyGrowth = GROWTH[source] / 12;
  return Array.from({ length: horizonMonths }, (_, i) => {
    const x = parseFloat((TODAY_FRAC + (i + 1) / 12).toFixed(3));
    // Seasonal factor: slight boost in spring/autumn
    const seasonal = 1 + 0.045 * Math.sin((i + 2) * Math.PI / 6);
    const v = Math.round(baseVal * Math.pow(1 + monthlyGrowth, i + 1) * seasonal);
    return [x, v];
  });
}

// Confidence band: widens over time
function buildBand(fcData) {
  return fcData.map(([x, v], i) => {
    const spread = 0.06 + i * 0.003;
    return [x, Math.round(v * (1 - spread)), Math.round(v * (1 + spread))];
  });
}

// Periods shown in the detail table
const HORIZON_PERIODS = {
  6:  [1, 3, 6],
  12: [1, 6, 12],
  24: [1, 12, 24],
};

const STATUS_STYLE = {
  healthy: { bg: `${FC.eco500}12`, color: FC.eco700, border: FC.eco300, label: 'Durable'   },
  warning: { bg: `${FC.amber}12`,  color: FC.amber,  border: FC.amber,  label: 'Vigilance' },
  good:    { bg: `${FC.navy600}12`,color: FC.navy600, border: FC.navy500,label: 'Bon'       },
};

function fmt(n) { return Math.round(n).toLocaleString('fr-FR'); }

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: FC.ink50, fontWeight: 500, marginBottom: 6, fontFamily: FC.mono, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</label>
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
  const [src, setSrc] = useState('marine');
  const [species, setSpecies] = useState(SPECIES_BY_SOURCE.marine[0]);
  const [zone, setZone] = useState(ZONES_BY_SOURCE.marine[0]);
  const [horizon, setHorizon] = useState(12);
  const [ran, setRan] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSource = s => {
    setSrc(s);
    setSpecies(SPECIES_BY_SOURCE[s][0]);
    setZone(ZONES_BY_SOURCE[s][0]);
    setRan(false);
  };

  const run = () => {
    setRan(false);
    setLoading(true);
    setTimeout(() => { setLoading(false); setRan(true); }, 1600);
  };

  const hist      = BASE_HIST[src];
  const fcData    = buildForecast(src, horizon);
  const fcBand    = buildBand(fcData);
  const baseVal   = hist[hist.length - 1][1];

  // Next month (June 2026) forecast
  const nextMonthFc   = fcData[0]; // index 0 = +1 month
  const nextMonthVal  = nextMonthFc?.[1] ?? baseVal;
  const nextMonthDiff = nextMonthVal - baseVal;
  const nextMonthPct  = ((nextMonthDiff / baseVal) * 100).toFixed(1);

  // Last forecast value for KPI
  const finalFc  = fcData[fcData.length - 1]?.[1] ?? baseVal;
  const totalPct = (((finalFc - baseVal) / baseVal) * 100).toFixed(1);

  // Detail table rows
  const periods = HORIZON_PERIODS[horizon];
  const tableRows = periods.map(offset => {
    const pt = fcData[offset - 1];
    const v  = pt?.[1] ?? baseVal;
    const lo = Math.round(v * (1 - 0.06 - offset * 0.002));
    const hi = Math.round(v * (1 + 0.06 + offset * 0.002));
    const status = offset <= 3 ? 'healthy' : offset <= 12 ? 'good' : 'warning';
    return [monthLabel(offset), v, lo, hi, status];
  });

  const mapHighlights = src === 'marine'
    ? { MAR: { status: 'warning' }, MRT: { status: 'critical' }, SEN: { status: 'healthy' } }
    : { COD: { status: 'warning' }, AGO: { status: 'healthy' }, ZMB: { status: 'healthy' } };

  return (
    <Shell page={page} setPage={setPage} title="Prévision halieutique" sub="Modèle IA · Horizon 6–24 mois">
      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="fc-animate-in">

        {/* Source tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {SOURCES.map(s => (
            <button key={s.id} onClick={() => handleSource(s.id)} style={{
              padding: '8px 18px', border: `1px solid ${src === s.id ? FC.navy800 : FC.rule}`,
              borderRadius: 999, fontSize: 13, fontFamily: FC.sans, cursor: 'pointer',
              background: src === s.id ? FC.navy800 : '#fff',
              color: src === s.id ? '#fff' : FC.ink70,
              fontWeight: src === s.id ? 600 : 400, transition: 'all 0.15s',
            }}>{s.label}</button>
          ))}
        </div>

        {/* Config */}
        <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 16 }}>Paramètres de prévision</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <SelectField label="Espèce" value={species} onChange={setSpecies} options={SPECIES_BY_SOURCE[src]} />
            <SelectField label="Zone" value={zone} onChange={setZone} options={ZONES_BY_SOURCE[src]} />
            <div>
              <label style={{ display: 'block', fontSize: 11, color: FC.ink50, marginBottom: 6, fontFamily: FC.mono, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Horizon</label>
              <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: `1px solid ${FC.rule}` }}>
                {[[6,'6 mois'],[12,'12 mois'],[24,'24 mois']].map(([h, label]) => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    flex: 1, padding: '10px 0', border: 'none',
                    borderRight: h !== 24 ? `1px solid ${FC.rule}` : 'none',
                    background: horizon === h ? FC.navy800 : '#fff',
                    color: horizon === h ? '#fff' : FC.ink70,
                    fontFamily: FC.mono, fontSize: 12, cursor: 'pointer',
                    fontWeight: horizon === h ? 600 : 400, transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="fc-btn-eco" onClick={run} style={{ padding: '10px 24px', fontSize: 13 }}>
              {loading
                ? <><span className="fc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Calcul…</>
                : 'Lancer la prévision →'}
            </button>
            {ran && !loading && (
              <span style={{ fontSize: 12, color: FC.eco700, fontFamily: FC.mono, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: FC.eco500, display: 'inline-block' }} />
                Prévision calculée · MAPE 5.8% · {SOURCES.find(s => s.id === src)?.label}
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

            {/* Next-month recommendation banner */}
            <div style={{
              marginBottom: 24, padding: '18px 22px',
              background: `linear-gradient(135deg, ${FC.eco500}12 0%, ${FC.navy600}08 100%)`,
              border: `1px solid ${FC.eco300}`, borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${FC.eco500}, ${FC.eco700})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v10M10 2l-3 3M10 2l3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14h14v3H3z" fill="white" fillOpacity="0.3" rx="1"/>
                  <rect x="3" y="14" width="14" height="3" rx="1" stroke="#fff" strokeWidth="1.4"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 10, color: FC.eco700, fontFamily: FC.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                  Recommandation — Mois prochain
                </div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 700, color: FC.ink, letterSpacing: '-0.01em' }}>
                  {monthLabel(1)} · {species.split(' ')[0]} — Zone {zone.split('·')[0].trim()}
                </div>
                <div style={{ fontSize: 12, color: FC.ink70, marginTop: 3 }}>
                  Surplus prévu de <strong style={{ color: FC.eco700 }}>{fmt(nextMonthDiff)} t</strong> ({nextMonthPct > 0 ? '+' : ''}{nextMonthPct}%) · Ouvrir la pêche recommandé · Quota indicatif : <strong style={{ color: FC.navy700 }}>{fmt(nextMonthVal * 0.42)} t</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: FC.serif, fontSize: 26, fontWeight: 700, color: FC.eco700, letterSpacing: '-0.02em' }}>{fmt(nextMonthVal)}</div>
                <div style={{ fontSize: 11, color: FC.ink50, fontFamily: FC.mono }}>tonnes prévues</div>
              </div>
            </div>

            {/* KPIs */}
            <div className="fc-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
              <div style={{ padding: '18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 8 }}>Prévision {horizon >= 12 ? `${horizon/12} an${horizon > 12 ? 's' : ''}` : `${horizon} mois`}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>{fmt(finalFc)}</span>
                  <span style={{ fontSize: 12, color: FC.ink50 }}>t</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: FC.eco700 }}>▲ +{totalPct}%</div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 8 }}>Prochain mois</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>{fmt(nextMonthVal)}</span>
                  <span style={{ fontSize: 12, color: FC.ink50 }}>t</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: FC.eco700 }}>▲ +{nextMonthPct}%</div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 8 }}>Intervalle confiance</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>±{horizon <= 6 ? 7 : horizon <= 12 ? 9 : 12}%</span>
                  <span style={{ fontSize: 12, color: FC.ink50 }}>à 90%</span>
                </div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 8 }}>MAPE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>5.8</span>
                  <span style={{ fontSize: 12, color: FC.ink50 }}>%</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: FC.eco700 }}>▲ −1.2 pts</div>
              </div>
            </div>

            {/* Chart */}
            <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div className="fc-eyebrow" style={{ marginBottom: 4 }}>{species}</div>
                  <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>
                    Prévision {horizon} mois — {zone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    ['Historique', FC.navy700, false],
                    ['Prévision IA', FC.eco500, true],
                    ['Intervalle', FC.eco300, false],
                    ['Aujourd\'hui', FC.amber, false],
                  ].map(([l, c, d]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: FC.ink50, fontFamily: FC.mono }}>
                      <div style={{
                        width: 16, height: 2, background: c, borderRadius: 1,
                        opacity: l === 'Intervalle' ? 0.5 : 1,
                        backgroundImage: d ? `repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 8px)` : undefined,
                      }} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <LineChart
                  data={hist}
                  forecast={fcData}
                  confidenceBand={fcBand}
                  width={980}
                  height={280}
                  yLabel="Tonnes"
                  todayX={TODAY_FRAC}
                  nextMonthAnnotation={nextMonthFc ? { x: nextMonthFc[0], y: nextMonthFc[1], label: monthLabel(1) } : null}
                />
              </div>
            </div>

            {/* Table + Map */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="fc-card" style={{ padding: '22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Détail périodique</div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 700, color: FC.ink, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  Prévisions par période
                </div>
                <table className="fc-table">
                  <thead>
                    <tr>{['Période', 'Prévision (t)', 'Borne inf.', 'Borne sup.', 'Statut'].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {tableRows.map(([per, val, lo, hi, status]) => {
                      const s = STATUS_STYLE[status];
                      return (
                        <tr key={per}>
                          <td style={{ fontWeight: 600 }}>{per}</td>
                          <td style={{ fontFamily: FC.mono, fontWeight: 600 }}>{fmt(val)}</td>
                          <td style={{ fontFamily: FC.mono, color: FC.ink50 }}>{fmt(lo)}</td>
                          <td style={{ fontFamily: FC.mono, color: FC.ink50 }}>{fmt(hi)}</td>
                          <td><span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: FC.mono }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, padding: '12px 14px', background: FC.paper, borderRadius: 8, border: `1px solid ${FC.rule}` }}>
                  <div style={{ fontSize: 11, color: FC.ink50, fontFamily: FC.mono, marginBottom: 4 }}>POTENTIEL ÉCONOMIQUE</div>
                  <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 700, color: FC.eco700 }}>
                    +{fmt(finalFc - baseVal)} tonnes
                  </div>
                  <div style={{ fontSize: 12, color: FC.ink50, marginTop: 2 }}>
                    Surplus estimé sur {horizon} mois · valeur marchande indicative
                  </div>
                </div>
              </div>

              <div className="fc-card" style={{ padding: '22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Vue géographique</div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 700, color: FC.ink, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  Carte constellation
                </div>
                <WorldMap
                  highlights={mapHighlights}
                  mode="constellation" width={460} height={240} showLegend
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
