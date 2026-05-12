import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { KPICard, BarList, LineChart } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';

const HIGHLIGHTS = {
  MAR: { status: 'warning',  intensity: 0.7 },
  MRT: { status: 'critical', intensity: 0.9 },
  SEN: { status: 'healthy',  intensity: 0.6 },
  GHA: { status: 'healthy',  intensity: 0.5 },
  COD: { status: 'warning',  intensity: 0.6 },
  MOZ: { status: 'healthy',  intensity: 0.7 },
  ZAF: { status: 'warning',  intensity: 0.5 },
};

const SOURCES = [
  { id: 'marine',     label: 'Atlantique (FAO 34)' },
  { id: 'tanganyika', label: 'Lac Tanganyika (RDC)' },
  { id: 'congo',      label: 'Fleuve Congo (RDC)' },
  { id: 'lualaba',    label: 'Rivière Lualaba (RDC)' },
];

const DATA_BY_SOURCE = {
  marine: {
    kpis: [
      { label:'Débarquements 2024',  value:'51 200', unit:'tonnes', delta:'+15.9%', trend:'up'   },
      { label:'Espèces actives',     value:'12',     unit:'espèces',delta:'+2',     trend:'up'   },
      { label:'Indice de pression',  value:'0.74',   unit:'/ 1.0', delta:'+0.08',  trend:'down' },
      { label:'Zones sous tension',  value:'3',      unit:'zones',  delta:'+1',     trend:'down' },
    ],
    species: [
      { label:'Sardina pilchardus', value:42800, color:FC.navy700 },
      { label:'Scomber scombrus',   value:28600, color:FC.navy500 },
      { label:'Octopus vulgaris',   value:21400, color:FC.eco500  },
      { label:'Thunnus thynnus',    value:14200, color:FC.amber   },
      { label:'Xiphias gladius',    value:8900,  color:FC.coral   },
    ],
    hist: [[2018,38000],[2019,41000],[2020,36000],[2021,43000],[2022,47000],[2023,44000],[2024,51200]],
    monthly: [[1,38],[2,36],[3,42],[4,45],[5,43],[6,48],[7,52],[8,50],[9,55],[10,58],[11,54],[12,61]].map(([m,v])=>[m,v*1000]),
    alerts: [
      { zone:'34.1.2 · Sahara',     species:'Sardina pilchardus', level:'critical', index:'1.28', trend:'+0.14' },
      { zone:'34.1.1 · Atlantique', species:'Scomber scombrus',   level:'warning',  index:'0.91', trend:'+0.07' },
      { zone:'34.3.1 · Sud',        species:'Xiphias gladius',    level:'warning',  index:'0.85', trend:'+0.03' },
    ],
  },
  tanganyika: {
    kpis: [
      { label:'Captures 2024',       value:'18 400', unit:'tonnes', delta:'+8.3%',  trend:'up'   },
      { label:'Espèces lacustres',   value:'7',      unit:'espèces',delta:'+1',     trend:'up'   },
      { label:'Niveau du lac',       value:'773m',   unit:'altitude',delta:'-0.4m', trend:'down' },
      { label:'Zones surexploitées', value:'2',      unit:'zones',  delta:'stable', trend:'up'   },
    ],
    species: [
      { label:'Limnothrissa miodon (Kapenta)', value:8200, color:FC.navy700 },
      { label:'Stolothrissa tanganicae',        value:5100, color:FC.navy500 },
      { label:'Lates stappersii',               value:3400, color:FC.eco500  },
      { label:'Boulengerochromis microlepis',   value:1800, color:FC.amber   },
      { label:'Oreochromis tanganicae',         value:900,  color:FC.coral   },
    ],
    hist: [[2018,14200],[2019,15800],[2020,13900],[2021,16200],[2022,17500],[2023,16800],[2024,18400]],
    monthly: [[1,1200],[2,1100],[3,1400],[4,1600],[5,1500],[6,1700],[7,1900],[8,1800],[9,2000],[10,2100],[11,1900],[12,2200]].map(([m,v])=>[m,v]),
    alerts: [
      { zone:'Nord Tanganyika',  species:'L. miodon (Kapenta)',  level:'warning',  index:'0.88', trend:'+0.06' },
      { zone:'Zone centrale',    species:'Lates stappersii',    level:'healthy',  index:'0.62', trend:'-0.02' },
    ],
  },
  congo: {
    kpis: [
      { label:'Captures 2024',       value:'32 600', unit:'tonnes', delta:'+5.7%',  trend:'up'   },
      { label:'Espèces fluviales',   value:'15',     unit:'espèces',delta:'+3',     trend:'up'   },
      { label:'Débit moyen',         value:'41 000', unit:'m³/s',   delta:'+2.1%',  trend:'up'   },
      { label:'Zones critiques',     value:'4',      unit:'zones',  delta:'+2',     trend:'down' },
    ],
    species: [
      { label:'Clarias gariepinus (Silure)', value:12400, color:FC.navy700 },
      { label:'Hydrocynus vittatus',         value:8700,  color:FC.navy500 },
      { label:'Synodontis sp.',              value:6200,  color:FC.eco500  },
      { label:'Oreochromis niloticus',       value:4800,  color:FC.amber   },
      { label:'Distichodus sexfasciatus',    value:2500,  color:FC.coral   },
    ],
    hist: [[2018,28000],[2019,29500],[2020,27200],[2021,30100],[2022,31800],[2023,30900],[2024,32600]],
    monthly: [[1,2400],[2,2200],[3,2800],[4,3100],[5,2900],[6,3400],[7,3200],[8,3000],[9,3600],[10,3800],[11,3400],[12,3800]].map(([m,v])=>[m,v]),
    alerts: [
      { zone:'Pool Malebo',       species:'C. gariepinus',       level:'critical', index:'1.12', trend:'+0.18' },
      { zone:'Bassin central',    species:'H. vittatus',         level:'warning',  index:'0.79', trend:'+0.05' },
      { zone:'Bas-Congo',         species:'Synodontis sp.',      level:'healthy',  index:'0.55', trend:'-0.01' },
      { zone:'Kisangani upstream',species:'D. sexfasciatus',     level:'warning',  index:'0.84', trend:'+0.09' },
    ],
  },
  lualaba: {
    kpis: [
      { label:'Captures 2024',       value:'9 800',  unit:'tonnes', delta:'+11.2%', trend:'up'   },
      { label:'Espèces suivies',     value:'9',      unit:'espèces',delta:'+2',     trend:'up'   },
      { label:'Longueur surveillée', value:'1 800',  unit:'km',     delta:'nouveau',trend:'up'   },
      { label:'Stations actives',    value:'6',      unit:'stations',delta:'+3',    trend:'up'   },
    ],
    species: [
      { label:'Tilapia macrochir',        value:3600, color:FC.navy700 },
      { label:'Labeo mesops',             value:2400, color:FC.navy500 },
      { label:'Mormyrus longirostris',    value:1800, color:FC.eco500  },
      { label:'Brycinus imberi',          value:1200, color:FC.amber   },
      { label:'Schilbe mystus',           value:800,  color:FC.coral   },
    ],
    hist: [[2018,6200],[2019,7100],[2020,6800],[2021,7900],[2022,8600],[2023,8800],[2024,9800]],
    monthly: [[1,680],[2,620],[3,790],[4,860],[5,820],[6,940],[7,1020],[8,960],[9,1100],[10,1200],[11,980],[12,1030]].map(([m,v])=>[m,v]),
    alerts: [
      { zone:'Kongolo–Bukama', species:'Tilapia macrochir', level:'warning',  index:'0.87', trend:'+0.11' },
      { zone:'Kalemie aval',   species:'Labeo mesops',      level:'healthy',  index:'0.61', trend:'-0.03' },
    ],
  },
};

export default function Analysis({ page, setPage }) {
  const { isMobile, isSmall } = useBreakpoint();
  const [source, setSource] = useState('marine');
  const d = DATA_BY_SOURCE[source];

  return (
    <Shell page={page} setPage={setPage}
      title="Analyse des stocks"
      sub={`${SOURCES.find(s=>s.id===source)?.label} · Données 2024`}
      actions={
        <button className="fc-btn-eco" style={{ fontSize:13, padding:'8px 18px' }}
          onClick={() => setPage('forecast')}>
          Lancer une prévision →
        </button>
      }
    >
      <div style={{ maxWidth:1100, margin:'0 auto' }} className="fc-animate-in">

        {/* Source selector */}
        <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {SOURCES.map(s => (
            <button key={s.id} onClick={() => setSource(s.id)} style={{
              padding:'8px 18px', border:`1px solid ${source===s.id ? FC.navy800 : FC.rule}`,
              borderRadius:999, fontSize:13, fontFamily:FC.sans, cursor:'pointer',
              background: source===s.id ? FC.navy800 : '#fff',
              color: source===s.id ? '#fff' : FC.ink70,
              fontWeight: source===s.id ? 600 : 400, transition:'all 0.15s',
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', marginBottom:24 }}>
          {d.kpis.map(k => (
            <div key={k.label} style={{ padding:'18px 20px' }}>
              <div className="fc-eyebrow" style={{ marginBottom:8 }}>{k.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>{k.value}</span>
                <span style={{ fontSize:12, color:FC.ink50 }}>{k.unit}</span>
              </div>
              <div style={{ fontSize:11, marginTop:6, fontWeight:500,
                color:k.trend==='up'?FC.eco700:k.trend==='down'?FC.coral:FC.ink50 }}>
                {k.trend==='up'?'▲':k.trend==='down'?'▼':'—'} {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display:'grid', gridTemplateColumns: isSmall ? '1fr' : '2fr 1fr', gap:20, marginBottom:24 }}>
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Tendance historique</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:18, letterSpacing:'-0.02em' }}>
              Captures totales — 2018 à 2024
            </div>
            <LineChart data={d.hist} width={540} height={220} yLabel="Tonnes" />
          </div>
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Répartition</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:18, letterSpacing:'-0.02em' }}>
              Top 5 espèces · 2024
            </div>
            <BarList items={d.species} unit="t" />
          </div>
        </div>

        {/* Monthly + Alerts */}
        <div style={{ display:'grid', gridTemplateColumns: isSmall ? '1fr' : '2fr 1fr', gap:20, marginBottom:24 }}>
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Saisonnalité</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:18, letterSpacing:'-0.02em' }}>
              Captures mensuelles — 2024
            </div>
            <LineChart data={d.monthly} width={540} height={200} yLabel="Tonnes" />
          </div>
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Alertes actives</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:16, letterSpacing:'-0.02em' }}>
              Zones sous pression
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {d.alerts.map(a=>(
                <div key={a.zone} style={{
                  padding:'12px 14px', borderRadius:8,
                  background: a.level==='critical'?`${FC.coral}08`:a.level==='warning'?`${FC.amber}08`:`${FC.eco500}08`,
                  border:`1px solid ${a.level==='critical'?`${FC.coral}30`:a.level==='warning'?`${FC.amber}30`:`${FC.eco500}30`}`,
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:FC.ink }}>{a.zone}</span>
                    <span style={{ fontFamily:FC.mono, fontSize:11, fontWeight:700,
                      color:a.level==='critical'?FC.coral:a.level==='warning'?FC.amber:FC.eco500 }}>
                      {a.index}
                    </span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:FC.ink50, fontStyle:'italic' }}>{a.species}</span>
                    <span style={{ fontSize:11, color:a.level==='critical'?FC.coral:FC.amber, fontFamily:FC.mono }}>
                      {a.level==='healthy'?'▼':' ▲'} {a.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="fc-btn-ghost" style={{ width:'100%', marginTop:14, fontSize:12, padding:'9px' }}
              onClick={() => setPage('recommend')}>
              Voir les recommandations →
            </button>
          </div>
        </div>

        {/* Map */}
        {source === 'marine' && (
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div>
                <div className="fc-eyebrow" style={{ marginBottom:4 }}>Carte de surveillance</div>
                <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>
                  État des stocks par zone
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span className="fc-tag"><span className="dot" style={{ background:FC.coral }}/> Critique</span>
                <span className="fc-tag"><span className="dot" style={{ background:FC.amber }}/> Vigilance</span>
                <span className="fc-tag"><span className="dot"/> Sain</span>
              </div>
            </div>
            <WorldMap highlights={HIGHLIGHTS} width={1020} height={300} />
          </div>
        )}

        {source !== 'marine' && (
          <div className="fc-card" style={{ padding:'28px', textAlign:'center', background:`linear-gradient(135deg,${FC.navy900},#0D2540)` }}>
            <div style={{ fontFamily:FC.mono, fontSize:10, color:FC.aqua, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:10 }}>
              Bassin versant RDC — {SOURCES.find(s=>s.id===source)?.label}
            </div>
            <div style={{ fontFamily:FC.serif, fontSize:18, fontWeight:700, color:'#fff', marginBottom:8 }}>
              Surveillance active · {d.kpis[0].value} tonnes capturées en 2024
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', maxWidth:480, margin:'0 auto 20px', lineHeight:1.7 }}>
              Les données des voies navigables intérieures de la RDC sont collectées via un réseau de {d.kpis[3]?.value ?? '6'} stations de mesure réparties sur {d.kpis[2]?.value ?? '—'} {d.kpis[2]?.unit ?? ''}.
            </div>
            <button className="fc-btn-eco" onClick={() => setPage('forecast')} style={{ fontSize:13 }}>
              Lancer une prévision pour ce bassin →
            </button>
          </div>
        )}

      </div>
    </Shell>
  );
}
