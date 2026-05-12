import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { LineChart, KPICard } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';

const SOURCES = [
  { id:'marine',     label:'Atlantique (FAO 34)' },
  { id:'tanganyika', label:'Lac Tanganyika (RDC)' },
  { id:'congo',      label:'Fleuve Congo (RDC)'  },
  { id:'lualaba',    label:'Rivière Lualaba (RDC)'},
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

const BASE_HIST = {
  marine:     [[2020,38000],[2021,43000],[2022,47000],[2023,44000],[2024,51000]],
  tanganyika: [[2020,13900],[2021,16200],[2022,17500],[2023,16800],[2024,18400]],
  congo:      [[2020,27200],[2021,30100],[2022,31800],[2023,30900],[2024,32600]],
  lualaba:    [[2020,6800], [2021,7900], [2022,8600], [2023,8800], [2024,9800] ],
};

const MULTIPLIERS = { 30:[1.05,1.09,1.11], 60:[1.07,1.12,1.16], 90:[1.09,1.16,1.24] };

function buildForecast(source, horizon) {
  const last = BASE_HIST[source][BASE_HIST[source].length - 1];
  const mults = MULTIPLIERS[horizon];
  const steps = horizon / 30;
  return Array.from({ length: steps }, (_, i) => {
    const x = last[0] + (i + 1) * (1 / (12 / (horizon / steps)));
    const v = Math.round(last[1] * mults[i]);
    return [parseFloat((last[0] + (i+1)*0.15).toFixed(2)), v];
  });
}

const RESULT_TABLE = {
  30: (base) => [
    [`J+10`, Math.round(base*1.02), Math.round(base*0.94), Math.round(base*1.06), 'healthy'],
    [`J+20`, Math.round(base*1.04), Math.round(base*0.96), Math.round(base*1.08), 'healthy'],
    [`J+30`, Math.round(base*1.05), Math.round(base*0.97), Math.round(base*1.09), 'healthy'],
  ],
  60: (base) => [
    [`J+30`, Math.round(base*1.05), Math.round(base*0.97), Math.round(base*1.09), 'healthy'],
    [`J+45`, Math.round(base*1.08), Math.round(base*0.99), Math.round(base*1.12), 'warning'],
    [`J+60`, Math.round(base*1.12), Math.round(base*1.03), Math.round(base*1.16), 'warning'],
  ],
  90: (base) => [
    [`J+30`, Math.round(base*1.05), Math.round(base*0.97), Math.round(base*1.09), 'healthy'],
    [`J+60`, Math.round(base*1.12), Math.round(base*1.03), Math.round(base*1.16), 'warning'],
    [`J+90`, Math.round(base*1.24), Math.round(base*1.12), Math.round(base*1.31), 'warning'],
  ],
};

const STATUS_STYLE = {
  healthy:{ bg:`${FC.eco500}12`, color:FC.eco700, border:FC.eco300, label:'Durable'  },
  warning:{ bg:`${FC.amber}12`,  color:FC.amber,  border:FC.amber,  label:'Vigilance'},
};

function fmt(n) { return n.toLocaleString('fr-FR'); }

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, color:FC.ink50, fontWeight:500, marginBottom:6, fontFamily:FC.mono, letterSpacing:'0.07em', textTransform:'uppercase' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width:'100%', padding:'10px 14px',
        border:`1px solid ${FC.rule}`, borderRadius:6,
        background:'#fff', fontFamily:FC.sans, fontSize:13, color:FC.ink,
        cursor:'pointer', outline:'none', appearance:'none',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B788C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:34,
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
  const [horizon, setHorizon] = useState(90);
  const [ran, setRan] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSource = s => {
    setSrc(s);
    setSpecies(SPECIES_BY_SOURCE[s][0]);
    setZone(ZONES_BY_SOURCE[s][0]);
    setRan(false);
  };

  const run = () => { setRan(false); setLoading(true); setTimeout(() => { setLoading(false); setRan(true); }, 1600); };

  const hist = BASE_HIST[src];
  const fcData = buildForecast(src, horizon);
  const fcBand = fcData.map(([x,v]) => [x, Math.round(v*0.9), Math.round(v*1.1)]);
  const baseVal = hist[hist.length-1][1];
  const tableRows = RESULT_TABLE[horizon](baseVal);
  const finalFc = tableRows[tableRows.length-1][1];
  const pct = (((finalFc - baseVal) / baseVal) * 100).toFixed(1);

  return (
    <Shell page={page} setPage={setPage}
      title="Prévision halieutique"
      sub="Modèle IA · Horizon 30–90 jours"
    >
      <div style={{ maxWidth:1100, margin:'0 auto' }} className="fc-animate-in">

        {/* Source tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {SOURCES.map(s => (
            <button key={s.id} onClick={() => handleSource(s.id)} style={{
              padding:'8px 18px', border:`1px solid ${src===s.id?FC.navy800:FC.rule}`,
              borderRadius:999, fontSize:13, fontFamily:FC.sans, cursor:'pointer',
              background:src===s.id?FC.navy800:'#fff',
              color:src===s.id?'#fff':FC.ink70,
              fontWeight:src===s.id?600:400, transition:'all 0.15s',
            }}>{s.label}</button>
          ))}
        </div>

        {/* Config */}
        <div className="fc-card" style={{ padding:'22px 24px', marginBottom:24 }}>
          <div className="fc-eyebrow" style={{ marginBottom:16 }}>Paramètres de prévision</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:16, alignItems:'end' }}>
            <SelectField label="Espèce" value={species} onChange={setSpecies} options={SPECIES_BY_SOURCE[src]} />
            <SelectField label="Zone" value={zone} onChange={setZone} options={ZONES_BY_SOURCE[src]} />
            <div>
              <label style={{ display:'block', fontSize:11, color:FC.ink50, marginBottom:6, fontFamily:FC.mono, letterSpacing:'0.07em', textTransform:'uppercase' }}>Horizon (jours)</label>
              <div style={{ display:'flex', borderRadius:6, overflow:'hidden', border:`1px solid ${FC.rule}` }}>
                {[30,60,90].map(h => (
                  <button key={h} onClick={() => setHorizon(h)} style={{
                    flex:1, padding:'10px 0', border:'none',
                    borderRight:h!==90?`1px solid ${FC.rule}`:'none',
                    background:horizon===h?FC.navy800:'#fff',
                    color:horizon===h?'#fff':FC.ink70,
                    fontFamily:FC.mono, fontSize:13, cursor:'pointer',
                    fontWeight:horizon===h?600:400, transition:'all 0.15s',
                  }}>{h}j</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop:18, display:'flex', gap:10, alignItems:'center' }}>
            <button className="fc-btn-eco" onClick={run} style={{ padding:'10px 24px', fontSize:13 }}>
              {loading
                ? <><span className="fc-spinner" style={{ width:14, height:14, borderWidth:2, borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }}/> Calcul…</>
                : 'Lancer la prévision →'}
            </button>
            {ran && !loading && (
              <span style={{ fontSize:12, color:FC.eco700, fontFamily:FC.mono, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:FC.eco500, display:'inline-block' }}/>
                Prévision calculée · MAPE 5.8% · {src === 'marine' ? 'Zone FAO 34' : SOURCES.find(s=>s.id===src)?.label}
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div className="fc-spinner" style={{ margin:'0 auto 20px' }}/>
            <div style={{ fontFamily:FC.serif, fontSize:18, color:FC.ink70 }}>Modèle IA en cours…</div>
            <div style={{ fontSize:12, color:FC.ink50, fontFamily:FC.mono, marginTop:6 }}>{species}</div>
          </div>
        )}

        {ran && !loading && (
          <div className="fc-animate-in">
            {/* KPIs */}
            <div className="fc-kpi-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
              <div style={{ padding:'18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:8 }}>Prévision J+{horizon}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>{fmt(finalFc)}</span>
                  <span style={{ fontSize:12, color:FC.ink50 }}>t</span>
                </div>
                <div style={{ fontSize:11, marginTop:6, fontWeight:500, color:FC.eco700 }}>▲ +{pct}%</div>
              </div>
              <div style={{ padding:'18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:8 }}>Intervalle confiance</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>±{horizon===30?8:horizon===60?9:10}%</span>
                  <span style={{ fontSize:12, color:FC.ink50 }}>à 90%</span>
                </div>
              </div>
              <div style={{ padding:'18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:8 }}>Modèle sélectionné</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>Ensemble</span>
                  <span style={{ fontSize:12, color:FC.ink50 }}>IA</span>
                </div>
              </div>
              <div style={{ padding:'18px 20px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:8 }}>MAPE</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>5.8</span>
                  <span style={{ fontSize:12, color:FC.ink50 }}>%</span>
                </div>
                <div style={{ fontSize:11, marginTop:6, fontWeight:500, color:FC.eco700 }}>▲ -1.2 pts</div>
              </div>
            </div>

            {/* Chart */}
            <div className="fc-card" style={{ padding:'22px 24px', marginBottom:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                <div>
                  <div className="fc-eyebrow" style={{ marginBottom:4 }}>{species}</div>
                  <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>
                    Prévision {horizon} jours — {zone}
                  </div>
                </div>
                <div style={{ display:'flex', gap:16 }}>
                  {[['Historique',FC.navy700,false],['Prévision IA',FC.eco500,true],['Intervalle',FC.eco300,false]].map(([l,c,d]) => (
                    <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:FC.ink50, fontFamily:FC.mono }}>
                      <div style={{ width:16, height:2, background:c, borderRadius:1, opacity:l==='Intervalle'?0.5:1,
                        backgroundImage:d?`repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 8px)`:undefined }}/>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflowX:'auto' }}>
                <LineChart data={hist} forecast={fcData} confidenceBand={fcBand} width={980} height={260} yLabel="Tonnes" />
              </div>
            </div>

            {/* Table + Map */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              <div className="fc-card" style={{ padding:'22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:4 }}>Détail</div>
                <div style={{ fontFamily:FC.serif, fontSize:16, fontWeight:700, color:FC.ink, marginBottom:16, letterSpacing:'-0.02em' }}>
                  Prévisions par période
                </div>
                <table className="fc-table">
                  <thead>
                    <tr>{['Période','Prévision (t)','Borne inf.','Borne sup.','Statut'].map(h=><th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {tableRows.map(([per,val,lo,hi,status]) => {
                      const s = STATUS_STYLE[status];
                      return (
                        <tr key={per}>
                          <td style={{ fontWeight:600 }}>{per}</td>
                          <td style={{ fontFamily:FC.mono, fontWeight:600 }}>{fmt(val)}</td>
                          <td style={{ fontFamily:FC.mono, color:FC.ink50 }}>{fmt(lo)}</td>
                          <td style={{ fontFamily:FC.mono, color:FC.ink50 }}>{fmt(hi)}</td>
                          <td><span style={{ padding:'2px 8px', borderRadius:999, fontSize:11, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontFamily:FC.mono }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ marginTop:16, padding:'12px 14px', background:FC.paper, borderRadius:8, border:`1px solid ${FC.rule}` }}>
                  <div style={{ fontSize:11, color:FC.ink50, fontFamily:FC.mono, marginBottom:4 }}>POTENTIEL ÉCONOMIQUE</div>
                  <div style={{ fontFamily:FC.serif, fontSize:18, fontWeight:700, color:FC.eco700 }}>
                    +{fmt(finalFc - baseVal)} tonnes
                  </div>
                  <div style={{ fontSize:12, color:FC.ink50, marginTop:2 }}>
                    Surplus estimé sur {horizon} jours · valeur marchande indicative
                  </div>
                </div>
              </div>

              <div className="fc-card" style={{ padding:'22px 24px' }}>
                <div className="fc-eyebrow" style={{ marginBottom:4 }}>Vue géographique</div>
                <div style={{ fontFamily:FC.serif, fontSize:16, fontWeight:700, color:FC.ink, marginBottom:16, letterSpacing:'-0.02em' }}>
                  Carte constellation
                </div>
                <WorldMap
                  highlights={{ MAR:{status:'warning',intensity:0.7}, MRT:{status:'critical',intensity:0.9}, SEN:{status:'healthy',intensity:0.6}, COD:{status:'warning',intensity:0.6} }}
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
