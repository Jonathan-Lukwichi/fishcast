import { useState, useEffect } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { LineChart } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';
import { useForecast } from '../context/ForecastContext.jsx';

const DEFAULT_HIGHLIGHTS = {
  MAR: { status: 'warning',  intensity: 0.7 },
  MRT: { status: 'critical', intensity: 0.95 },
  SEN: { status: 'healthy',  intensity: 0.6 },
  GHA: { status: 'healthy',  intensity: 0.5 },
  MOZ: { status: 'healthy',  intensity: 0.7 },
  ZAF: { status: 'warning',  intensity: 0.5 },
  CIV: { status: 'warning',  intensity: 0.4 },
};

const ALERTS = [
  { id:'A1', priority:'critical', title:'Fermeture requise — Zone 34.1.2', species:'Sardina pilchardus', age:'Il y a 2h' },
  { id:'A2', priority:'warning',  title:'Quota dépassé de 18% — Maquereau', species:'Scomber scombrus', age:'Il y a 5h' },
  { id:'A3', priority:'warning',  title:'Migration atypique détectée', species:'Thunnus thynnus', age:'Il y a 1j' },
  { id:'A4', priority:'healthy',  title:'Extension de saison disponible', species:'Octopus vulgaris', age:'Il y a 2j' },
];

const FORECAST_HIST = [[2020,38000],[2021,43000],[2022,47000],[2023,44000],[2024,51000]];
const FORECAST_FC   = [[2025.0,51000],[2025.2,55000],[2025.4,58500],[2025.6,61200],[2025.8,63400]];
const FORECAST_BAND = FORECAST_FC.map(([x,v])=>[x,v*0.9,v*1.1]);

const SPECIES_TREND = [
  { label:'Sardina pilchardus', pct: 84, color: FC.navy700 },
  { label:'Scomber scombrus',   pct: 56, color: FC.eco500  },
  { label:'Octopus vulgaris',   pct: 42, color: FC.amber   },
  { label:'Thunnus thynnus',    pct: 28, color: FC.coral   },
];

const PS = {
  critical:{ color: FC.coral,  bg:`${FC.coral}12`,  border:`${FC.coral}35`,  label:'Critique'    },
  warning: { color: FC.amber,  bg:`${FC.amber}12`,  border:`${FC.amber}35`,  label:'Vigilance'   },
  healthy: { color: FC.eco500, bg:`${FC.eco500}10`, border:`${FC.eco300}50`, label:'Opportunité' },
};

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setNow(new Date()), 60000); return ()=>clearInterval(t); }, []);
  return now;
}

function StatPill({ val, label, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:999,
      background:`${color}15`, border:`1px solid ${color}35` }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0 }} />
      <span style={{ fontFamily:FC.mono, fontSize:11, fontWeight:700, color }}>{val}</span>
      <span style={{ fontFamily:FC.mono, fontSize:11, color:'rgba(255,255,255,0.45)' }}>{label}</span>
    </div>
  );
}

function fmtNum(n) {
  if (n == null) return '—';
  return Math.round(n).toLocaleString('fr-FR');
}

export default function Dashboard({ page, setPage }) {
  const { isMobile, isSmall } = useBreakpoint();
  const now = useNow();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const { lastForecast: fc } = useForecast() ?? {};

  const mapHighlights = fc?.mapHighlights ?? DEFAULT_HIGHLIGHTS;

  const kpis = fc ? [
    { label:'Prévision prochaine période', value: fmtNum(fc.nextMonthVal), unit:'tonnes',
      delta: `${fc.nextMonthPct} vs actuel`, trend: parseFloat(fc.nextMonthPct) >= 0 ? 'up' : 'down' },
    { label:'Précision modèle',   value:'94.2',  unit:'%',       delta:'+2.1 pts',    trend:'up'   },
    { label:'Espèce analysée',    value:'1',     unit:'espèce',  delta: fc.species,   trend:'none' },
    { label:'Prévisions actives', value:'1',     unit:'prévision', delta: fc.sourceLabel, trend:'none' },
  ] : [
    { label:'Biomasse estimée',    value:'2 847', unit:'tonnes',  delta:'+12.4%',      trend:'up'   },
    { label:'Précision modèle',    value:'94.2',  unit:'%',       delta:'+2.1 pts',    trend:'up'   },
    { label:'Espèces surveillées', value:'38',    unit:'espèces', delta:'+6 actives',  trend:'up'   },
    { label:'Alertes actives',     value:'4',     unit:'alertes', delta:'+1 critique', trend:'down' },
  ];

  return (
    <Shell page={page} setPage={setPage} title="Tableau de bord" sub={`${dateStr} · Zone FAO 34`}>
      <div style={{ maxWidth:1100, margin:'0 auto' }} className="fc-animate-in">

        {/* ── Welcome banner ── */}
        <div style={{
          background:`linear-gradient(135deg, ${FC.navy900} 0%, #0D2540 55%, #051A2E 100%)`,
          borderRadius:12, padding:'24px 32px', marginBottom:24, position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, opacity:0.08, pointerEvents:'none' }}>
            {[0,1,2].map(i=>(
              <svg key={i} style={{ position:'absolute', top:`${20+i*25}%`, left:0, width:'120%' }}>
                <path d={`M${-60+i*30} 0 Q 300 ${-30+i*20} 700 0 T 1300 0`}
                  stroke={FC.aqua} strokeWidth="1" fill="none"
                  style={{ animation:`fc-wave-drift ${5+i*1.5}s linear infinite`, animationDelay:`${-i*2}s` }}/>
              </svg>
            ))}
          </div>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontFamily:FC.mono, fontSize:10, color:FC.aqua, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:6 }}>
                Bienvenue
              </div>
              <div style={{ fontFamily:FC.serif, fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>
                Shekinah Lukwichi
              </div>
              <div style={{ fontFamily:FC.sans, fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:4 }}>
                {dateStr}
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <StatPill val="1" label="critique" color={FC.coral} />
              <StatPill val="2" label="vigilances" color={FC.amber} />
              <StatPill val="1" label="opportunité" color={FC.eco500} />
            </div>
          </div>
        </div>

        {/* ── Last forecast banner (only when a forecast was run) ── */}
        {fc && (
          <div style={{
            background:`linear-gradient(135deg, ${FC.eco500}18 0%, ${FC.aqua}12 100%)`,
            border:`1px solid ${FC.eco500}35`, borderRadius:10, padding:'16px 20px',
            marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:12,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:`${FC.eco500}20`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>◷</div>
              <div>
                <div style={{ fontFamily:FC.mono, fontSize:10, color:FC.eco600, letterSpacing:'0.14em',
                  textTransform:'uppercase', marginBottom:2 }}>Dernière prévision IA</div>
                <div style={{ fontSize:13, fontWeight:600, color:FC.ink }}>
                  {fc.species} · {fc.zone} · {fc.sourceLabel}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:FC.mono, fontSize:18, fontWeight:700,
                  color: parseFloat(fc.nextMonthPct) >= 0 ? FC.eco600 : FC.coral }}>
                  {parseFloat(fc.nextMonthPct) >= 0 ? '▲' : '▼'} {fc.nextMonthPct}
                </div>
                <div style={{ fontSize:10, color:FC.ink50, fontFamily:FC.mono }}>{fc.nextMonthLabel}</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:FC.mono, fontSize:18, fontWeight:700, color:FC.ink }}>
                  {fmtNum(fc.nextMonthVal)} t
                </div>
                <div style={{ fontSize:10, color:FC.ink50, fontFamily:FC.mono }}>Quantité prévue</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:FC.mono, fontSize:18, fontWeight:700,
                  color: parseFloat(fc.totalPct) >= 0 ? FC.eco600 : FC.coral }}>
                  {parseFloat(fc.totalPct) >= 0 ? '▲' : '▼'} {fc.totalPct}
                </div>
                <div style={{ fontSize:10, color:FC.ink50, fontFamily:FC.mono }}>Horizon {fc.horizon} mois</div>
              </div>
            </div>
            <button onClick={()=>setPage('forecast')} className="fc-btn-eco"
              style={{ fontSize:11, padding:'7px 14px', flexShrink:0 }}>
              Relancer →
            </button>
          </div>
        )}

        {/* ── KPI strip ── */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', marginBottom:24 }}>
          {kpis.map(k=>(
            <div key={k.label} style={{ padding:'18px 20px' }}>
              <div className="fc-eyebrow" style={{ marginBottom:8 }}>{k.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:FC.serif, fontSize:28, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>{k.value}</span>
                <span style={{ fontSize:12, color:FC.ink50 }}>{k.unit}</span>
              </div>
              <div style={{ fontSize:11, marginTop:6, fontWeight:500,
                color: k.trend==='up' ? FC.eco700 : k.trend==='down' ? FC.coral : FC.ink50 }}>
                {k.trend==='up'?'▲':k.trend==='down'?'▼':'—'} {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* ── Main 2-col ── */}
        <div style={{ display:'grid', gridTemplateColumns: isSmall ? '1fr' : '2fr 1fr', gap:20, marginBottom:24 }}>

          {/* Forecast chart */}
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <div>
                <div className="fc-eyebrow" style={{ marginBottom:4 }}>Prévision globale</div>
                <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>
                  {fc ? `${fc.species} — ${fc.zone}` : 'Biomasse totale — 90 jours'}
                </div>
              </div>
              <button onClick={()=>setPage('forecast')} className="fc-btn-eco"
                style={{ fontSize:11, padding:'6px 14px' }}>
                Détail →
              </button>
            </div>
            <div style={{ marginBottom:12, display:'flex', gap:14 }}>
              {[['Historique',FC.navy700,false],['Prévision IA',FC.eco500,true]].map(([l,c,d])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:FC.ink50, fontFamily:FC.mono }}>
                  <div style={{ width:16, height:2, background:c, borderRadius:1,
                    backgroundImage:d?`repeating-linear-gradient(90deg,${c} 0,${c} 4px,transparent 4px,transparent 8px)`:undefined }}/>
                  {l}
                </div>
              ))}
            </div>
            <LineChart data={FORECAST_HIST} forecast={FORECAST_FC} confidenceBand={FORECAST_BAND} width={620} height={220} yLabel="Tonnes" />
          </div>

          {/* Alerts */}
          <div className="fc-card" style={{ padding:'22px 24px', display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <div className="fc-eyebrow" style={{ marginBottom:4 }}>Alertes récentes</div>
                <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, letterSpacing:'-0.02em' }}>
                  À traiter
                </div>
              </div>
              <span style={{ fontFamily:FC.mono, fontSize:11, padding:'3px 8px', borderRadius:999,
                background:`${FC.coral}15`, color:FC.coral, border:`1px solid ${FC.coral}35` }}>
                1 critique
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1 }}>
              {ALERTS.map(a=>{
                const ps=PS[a.priority];
                return (
                  <div key={a.id} style={{ padding:'10px 12px', borderRadius:8,
                    background:ps.bg, border:`1px solid ${ps.border}`,
                    borderLeft:`3px solid ${ps.color}`, cursor:'pointer' }}
                    onClick={()=>setPage('recommend')}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:FC.ink }}>{a.title}</span>
                      <span style={{ fontSize:10, color:FC.ink30, fontFamily:FC.mono, flexShrink:0, marginLeft:8 }}>{a.age}</span>
                    </div>
                    <div style={{ fontSize:11, color:FC.ink50, fontStyle:'italic' }}>{a.species}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>setPage('recommend')} className="fc-btn-primary"
              style={{ marginTop:14, width:'100%', padding:'10px', fontSize:12 }}>
              Toutes les recommandations →
            </button>
          </div>
        </div>

        {/* ── Species progress ── */}
        <div style={{ display:'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap:20, marginBottom:24 }}>
          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Stock par espèce</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:18, letterSpacing:'-0.02em' }}>
              Indice d'abondance 2024
            </div>
            {SPECIES_TREND.map(s=>(
              <div key={s.label} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ color:FC.ink, fontStyle:'italic' }}>{s.label}</span>
                  <span style={{ fontFamily:FC.mono, color:FC.ink70, fontWeight:600 }}>{s.pct}%</span>
                </div>
                <div style={{ height:5, background:FC.paperDeep, borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${s.pct}%`, background:s.color, borderRadius:3,
                    transition:'width 1s ease', backgroundImage:`linear-gradient(90deg, ${s.color}, ${s.color}cc)` }}/>
                </div>
              </div>
            ))}
          </div>

          <div className="fc-card" style={{ padding:'22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom:4 }}>Données récentes</div>
            <div style={{ fontFamily:FC.serif, fontSize:17, fontWeight:700, color:FC.ink, marginBottom:16, letterSpacing:'-0.02em' }}>
              Derniers débarquements
            </div>
            <table className="fc-table">
              <thead>
                <tr><th>Espèce</th><th>Zone</th><th>Tonnes</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {[
                  ['S. pilchardus','34.1.2','12 450','warning'],
                  ['S. scombrus',  '34.1.1','3 820', 'healthy'],
                  ['O. vulgaris',  '34.1.3','4 560', 'healthy'],
                  ['T. thynnus',   '34.2.0','1 240', 'warning'],
                ].map(([sp,z,t,st])=>{
                  const ps=PS[st];
                  return (
                    <tr key={sp}>
                      <td style={{ fontStyle:'italic', fontSize:12 }}>{sp}</td>
                      <td style={{ fontFamily:FC.mono, fontSize:11, color:FC.ink50 }}>{z}</td>
                      <td style={{ fontFamily:FC.mono, fontWeight:600 }}>{t}</td>
                      <td><span style={{ padding:'2px 7px', borderRadius:999, fontSize:10,
                        background:ps.bg, color:ps.color, border:`1px solid ${ps.border}`, fontFamily:FC.mono }}>
                        {ps.label}
                      </span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button onClick={()=>setPage('analysis')} className="fc-btn-ghost"
              style={{ marginTop:14, width:'100%', padding:'9px', fontSize:12 }}>
              Voir l'analyse complète →
            </button>
          </div>
        </div>

        {/* ── Constellation map ── */}
        <div style={{
          borderRadius:12, overflow:'hidden', position:'relative',
          border:`1px solid rgba(61,217,214,0.2)`,
          boxShadow:`0 0 40px rgba(61,217,214,0.06)`,
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:2,
            padding:'18px 24px', background:'linear-gradient(180deg,rgba(4,12,31,0.85) 0%,transparent 100%)',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:FC.mono, fontSize:10, color:FC.aqua, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:4 }}>
                Surveillance en temps réel
              </div>
              <div style={{ fontFamily:FC.serif, fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.01em' }}>
                État des stocks — Vue mondiale
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {[['Critique',FC.coral],['Vigilance',FC.amber],['Sain',FC.eco500]].map(([l,c])=>(
                <span key={l} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px',
                  background:'rgba(8,23,46,0.6)', border:`1px solid ${c}40`, borderRadius:999,
                  fontSize:11, color:c, fontFamily:FC.mono, backdropFilter:'blur(8px)' }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:c, flexShrink:0 }}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          {fc && (
            <div style={{ position:'absolute', bottom:12, left:0, right:0, zIndex:2,
              display:'flex', justifyContent:'center', pointerEvents:'none' }}>
              <div style={{ background:'rgba(4,12,31,0.75)', backdropFilter:'blur(8px)',
                border:`1px solid ${FC.aqua}30`, borderRadius:999,
                padding:'5px 18px', fontFamily:FC.mono, fontSize:11, color:FC.aqua }}>
                Zone prévue : {fc.zone} · {fc.sourceLabel}
              </div>
            </div>
          )}
          <WorldMap highlights={mapHighlights} mode="constellation" width={1100} height={380} showLegend={false} />
        </div>

        {/* ── Quick actions ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:16, marginTop:24 }}>
          {[
            { id:'upload',    icon:'↑', title:'Importer',       desc:'Charger vos données CSV / Excel',    color:FC.navy600, bg:`${FC.navy600}12` },
            { id:'analysis',  icon:'~', title:'Analyser',       desc:'Explorer stocks et tendances',       color:FC.eco500,  bg:`${FC.eco500}10` },
            { id:'forecast',  icon:'◷', title:'Prévoir',        desc:'Prévisions IA sur 30–90 jours',      color:FC.aqua,    bg:`${FC.aqua}10`   },
            { id:'recommend', icon:'★', title:'Recommander',    desc: fc ? '3 recommandations IA générées' : '4 recommandations actives', color:FC.amber, bg:`${FC.amber}10` },
          ].map(q=>(
            <button key={q.id} onClick={()=>setPage(q.id)} style={{
              background:'#fff', border:`1px solid ${FC.rule}`, borderRadius:10, padding:'20px',
              cursor:'pointer', textAlign:'left', transition:'all 0.2s',
              display:'flex', flexDirection:'column', gap:10,
            }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=q.color; e.currentTarget.style.boxShadow=`0 4px 20px ${q.color}20`; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=FC.rule; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div style={{ width:40, height:40, borderRadius:10, background:q.bg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, color:q.color, fontFamily:FC.mono }}>
                {q.icon}
              </div>
              <div>
                <div style={{ fontFamily:FC.serif, fontSize:15, fontWeight:700, color:FC.ink, marginBottom:3 }}>{q.title}</div>
                <div style={{ fontSize:12, color:FC.ink50, lineHeight:1.5 }}>{q.desc}</div>
              </div>
              <div style={{ fontSize:12, color:q.color, fontWeight:600, fontFamily:FC.mono }}>Accéder →</div>
            </button>
          ))}
        </div>

      </div>
    </Shell>
  );
}
