import { FC } from '../theme.js';
import FCLogo from '../components/FCLogo.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';
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
  CIV: { status: 'warning',  intensity: 0.4 },
};

const STATS = [
  { val: '38',    label: 'espèces surveillées' },
  { val: '94.2%', label: 'précision IA' },
  { val: '20 ans',label: 'données FAO' },
  { val: '12+',   label: 'bassins versants' },
];

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 12l3-4 4 3 4-7 4 4" stroke={FC.eco500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7" stroke={FC.eco500} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Prévisions ultra-précises',
    desc: 'Des modèles IA entraînés sur des décennies de données pour prédire la biomasse par espèce, zone et saison avec un taux de précision supérieur à 94%.',
    color: FC.eco500,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={FC.aqua} strokeWidth="2"/>
        <path d="M2 12h3M19 12h3M12 2v3M12 19v3" stroke={FC.aqua} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2.5" fill={FC.aqua}/>
      </svg>
    ),
    title: 'Surveillance mondiale',
    desc: "De l'Atlantique au lac Tanganyika, couvrez simultanément les océans, fleuves et lacs avec une carte de surveillance en temps réel.",
    color: FC.aqua,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.91 5.27L12 14.27l-4.76 2.58.91-5.27L4.3 7.6l5.3-.8L12 2z" stroke={FC.amber} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Décisions intelligentes',
    desc: 'Quotas optimaux, fermetures saisonnières et zones de repos générés automatiquement. Protégez les stocks tout en maximisant les rendements.',
    color: FC.amber,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={FC.navy600} strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={FC.navy600} strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={FC.navy600} strokeWidth="1.8"/>
        <path d="M14 17.5h7M17.5 14v7" stroke={FC.navy600} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Import universel',
    desc: 'Compatible avec tous les formats de données : CSV, Excel, FAO FishStat, journaux de bord numériques. Normalisation automatique en secondes.',
    color: FC.navy600,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={FC.eco700} strokeWidth="1.8"/>
        <path d="M7 12l3 3 7-7" stroke={FC.eco500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Conformité & traçabilité',
    desc: 'Chaque décision est documentée, horodatée et exportable. Facilitez vos audits, rapports FAO et certifications de pêche durable.',
    color: FC.eco700,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={FC.coral} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Alertes en temps réel',
    desc: "Recevez instantanément les notifications de surexploitation, de migration atypique ou de dégradation des habitats avant qu'il ne soit trop tard.",
    color: FC.coral,
  },
];

const BENEFITS = [
  { icon:'📈', title:'+28% de rendement moyen', desc:'Les pêcheries utilisant FishCast optimisent leurs sorties en mer grâce aux prévisions saisonnières.' },
  { icon:'💰', title:'Réduction des coûts', desc:'Moins de sorties improductives, meilleure planification logistique, quota optimisé : les économies sont immédiates.' },
  { icon:'🌊', title:'Stocks préservés', desc:'En évitant la surpêche grâce aux recommandations IA, les bassins versants se reconstituent naturellement.' },
  { icon:'📋', title:'Conformité facilitée', desc:'Rapports FAO, audits MSC, certifications durables — tout est généré automatiquement depuis votre tableau de bord.' },
];

const STEPS = [
  { n:'01', title:'Importez',  desc:'Glissez vos fichiers CSV ou Excel. Détection automatique des colonnes en secondes.' },
  { n:'02', title:'Analysez',  desc:'Explorez les tendances historiques, la répartition par espèce et les alertes actives.' },
  { n:'03', title:'Prévoyez',  desc:"L'IA calcule les stocks futurs sur 30, 60 ou 90 jours avec intervalles de confiance." },
  { n:'04', title:'Agissez',   desc:'Recevez des recommandations de gestion concrètes et exportez vos rapports.' },
];

const WATER_BODIES = [
  { name:'Atlantique (FAO 34)', icon:'🌊', species:'12 espèces', status:'warning',  detail:'Zone Sahara sous surveillance' },
  { name:'Lac Tanganyika (RDC)', icon:'💧', species:'7 espèces',  status:'healthy',  detail:'Kapenta en bonne reconstitution' },
  { name:'Fleuve Congo (RDC)',   icon:'🏞', species:'15 espèces', status:'warning',  detail:'Pool Malebo zone critique' },
  { name:'Rivière Lualaba (RDC)',icon:'🌿', species:'9 espèces',  status:'healthy',  detail:'Nouveau réseau actif' },
];

const PS = {
  healthy:{ color:FC.eco500, bg:`${FC.eco500}12`, border:`${FC.eco300}50`, label:'Sain' },
  warning:{ color:FC.amber,  bg:`${FC.amber}12`,  border:`${FC.amber}40`,  label:'Vigilance' },
};

export default function Landing({ setPage }) {
  const { isMobile, isTablet, isDesktop, width } = useBreakpoint();
  const px = isMobile ? '16px' : isTablet ? '28px' : '48px';

  return (
    <div style={{ background: FC.paper, minHeight: '100vh' }}>

      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${px}`, height: isMobile ? 56 : 64,
        background: 'rgba(250,247,239,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${FC.rule}`,
      }}>
        <FCLogo color={FC.navy900} size={isMobile ? 18 : 22} />
        <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'center' }}>
          {!isMobile && (
            <button className="fc-btn-ghost" onClick={() => setPage('signin')}
              style={{ fontSize: 13, padding: '8px 18px' }}>
              Se connecter
            </button>
          )}
          <button className="fc-btn-eco" onClick={() => setPage('signin')}
            style={{ fontSize: 13, padding: isMobile ? '9px 16px' : '8px 18px' }}>
            {isMobile ? 'Commencer →' : 'Commencer ici →'}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(160deg, ${FC.navy900} 0%, #0D2845 50%, #051825 100%)`,
        padding: isMobile ? '52px 16px 48px' : isTablet ? '64px 28px 52px' : '88px 48px 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
          {[0,1,2,3].map(i => (
            <svg key={i} style={{ position: 'absolute', top: `${10+i*18}%`, left: 0, width: '130%' }}>
              <path d={`M${-100+i*40} 0 Q 300 ${-60+i*28} 700 0 T 1400 0`}
                stroke={i%2===0 ? FC.aqua : FC.eco300} strokeWidth="1.2" fill="none"
                style={{ animation: `fc-wave-drift ${5+i*1.3}s linear infinite`, animationDelay: `${-i*1.8}s` }}/>
            </svg>
          ))}
        </div>
        {!isMobile && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {Array.from({length:12},(_,i) => (
              <div key={i} style={{
                position: 'absolute', left: `${6+(i*8)%90}%`, bottom: '5%',
                width: 3+(i%4), height: 3+(i%4), borderRadius: '50%', background: FC.eco300, opacity: 0,
                animation: `fc-float-up ${4+i%3}s ease-in infinite`, animationDelay: `${(i*0.6)%4}s`,
              }}/>
            ))}
          </div>
        )}

        <div style={{
          position: 'relative', zIndex: 1, maxWidth: 1060, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 400px' : '1fr',
          gap: isDesktop ? 64 : 40,
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
              background: 'rgba(61,217,214,0.12)', border: '1px solid rgba(61,217,214,0.3)',
              borderRadius: 999, marginBottom: isMobile ? 16 : 24 }}>
              <span className="fc-live-dot"/>
              <span style={{ fontFamily: FC.mono, fontSize: 10, color: FC.aqua, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Prévision halieutique IA · Afrique & RDC
              </span>
            </div>
            <h1 style={{
              fontFamily: FC.serif,
              fontSize: isMobile ? '32px' : isTablet ? '40px' : 'clamp(36px, 4.5vw, 58px)',
              fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em',
              margin: '0 0 18px',
            }}>
              Anticipez les stocks,<br/>
              <span className="fc-shimmer-text">protégez les océans</span>
            </h1>
            <p style={{ fontSize: isMobile ? 15 : 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 500, marginBottom: 12 }}>
              La première plateforme d'IA dédiée à la gestion durable des ressources halieutiques
              en Afrique — des côtes atlantiques aux eaux intérieures de la RDC.
            </p>
            {!isMobile && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
                Prévisions de biomasse · Quotas · Alertes · Lac Tanganyika · Fleuve Congo · FAO 34
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: isMobile ? 20 : 0 }}>
              <button className="fc-btn-eco" onClick={() => setPage('signin')}
                style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 24px' : '14px 32px' }}>
                Commencer ici →
              </button>
              <button className="fc-btn-ghost" onClick={() => setPage('signin')}
                style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 20px' : '14px 28px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                Se connecter
              </button>
            </div>
          </div>

          {/* Preview card — hidden on small mobile */}
          {!isMobile && (
            <div className="fc-glow-aqua" style={{
              background: 'rgba(8,23,46,0.78)', borderRadius: 14,
              padding: isTablet ? '18px 20px' : '22px 24px', backdropFilter: 'blur(18px)',
            }}>
              <div style={{ fontFamily: FC.mono, fontSize: 9, color: FC.aqua, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
                Prévision en direct — 12 mois
              </div>
              <svg width="100%" height="90" viewBox="0 0 360 90" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lg-h" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={FC.navy500}/><stop offset="100%" stopColor={FC.eco300}/>
                  </linearGradient>
                </defs>
                {[0.25,0.5,0.75,1].map(t => (
                  <line key={t} x1="10" x2="350" y1={90-t*80} y2={90-t*80} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6"/>
                ))}
                <path d="M10 65 L65 55 L120 58 L175 48 L230 42" stroke="url(#lg-h)" strokeWidth="2.2" fill="none"
                  strokeDasharray="600" strokeDashoffset="600"
                  style={{ animation: 'fc-draw-line 1.6s ease 0.4s forwards' }}/>
                <path d="M230 42 L265 36 L300 30 L335 24 L350 20" stroke={FC.eco300} strokeWidth="2" strokeDasharray="5 4" fill="none"/>
                <path d="M230 42 L265 40 L300 35 L335 28 L350 24 L350 16 L335 20 L300 25 L265 32 L230 38Z"
                  fill={FC.eco300} opacity="0.12"/>
                <line x1="230" y1="12" x2="230" y2="82" stroke="rgba(61,217,214,0.3)" strokeDasharray="2 4" strokeWidth="0.8"/>
              </svg>
              <div style={{ marginTop: 12, display: 'flex', gap: 14 }}>
                {[['Historique',FC.navy500],['Prévision',FC.eco300]].map(([l,c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: FC.mono }}>
                    <div style={{ width: 14, height: 2, background: c, borderRadius: 1 }}/>{l}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[['2 847 t','Biomasse'],['94.2%','Précision'],['38','Espèces']].map(([v,l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: FC.serif, fontSize: 20, fontWeight: 700, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: FC.mono, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div style={{
          position: 'relative', zIndex: 1, maxWidth: 1060, margin: isMobile ? '36px auto 0' : '52px auto 0',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: isMobile ? 24 : 36,
          gap: isMobile ? '16px 0' : 0,
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              borderRight: (!isMobile && i < 3) ? '1px solid rgba(255,255,255,0.07)' : 'none',
              padding: isMobile ? '0 12px' : '0 28px',
            }}>
              <div style={{ fontFamily: FC.serif, fontSize: isMobile ? 24 : 30, fontWeight: 700, color: FC.eco300, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', fontFamily: FC.mono, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: isMobile ? '48px 16px' : isTablet ? '56px 28px' : '72px 48px' }}>

        {/* ── Water bodies ── */}
        <div style={{ marginBottom: isMobile ? 48 : 72 }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
            <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Couverture géographique</div>
            <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Océans, fleuves & lacs — tout est couvert
            </h2>
            {!isMobile && (
              <p style={{ fontSize: 14, color: FC.ink50, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
                FishCast surveille simultanément les eaux marines et les eaux intérieures africaines.
              </p>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12 }}>
            {WATER_BODIES.map(w => {
              const ps = PS[w.status];
              return (
                <div key={w.name} className="fc-card" style={{ padding: isMobile ? '16px 14px' : '22px 20px' }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 10 }}>{w.icon}</div>
                  <div style={{ fontFamily: FC.serif, fontSize: isMobile ? 13 : 15, fontWeight: 700, color: FC.ink, marginBottom: 4 }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: FC.ink50, marginBottom: 8, fontFamily: FC.mono, fontStyle: 'italic' }}>{w.species}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 999, background: ps.bg, border: `1px solid ${ps.border}` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: ps.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 10, color: ps.color, fontFamily: FC.mono }}>{ps.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── How it works ── */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 48 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 10 }}>
            De vos données aux décisions en 4 étapes
          </h2>
          <WaveDeco color={FC.eco300} width={180} style={{ display: 'block', margin: '0 auto' }}/>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 48 : 72,
          position: 'relative',
        }}>
          {!isMobile && <div style={{ position: 'absolute', top: 21, left: '12%', right: '12%', height: 1, background: FC.ruleSoft }}/>}
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center', padding: isMobile ? '0 8px' : '0 20px', position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', margin: '0 auto 14px',
                background: i===0 ? FC.navy900 : '#fff',
                border: `2px solid ${i===0 ? FC.navy900 : FC.rule}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FC.mono, fontSize: 11, fontWeight: 700,
                color: i===0 ? '#fff' : FC.ink30, position: 'relative', zIndex: 1,
              }}>{s.n}</div>
              <div style={{ fontFamily: FC.serif, fontSize: isMobile ? 14 : 16, fontWeight: 700, color: FC.ink, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: FC.ink50, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div style={{ marginBottom: isMobile ? 48 : 72 }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
            <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Fonctionnalités</div>
            <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>
              Tout ce dont vous avez besoin
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="fc-card" style={{ padding: isMobile ? '20px 18px' : '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}12`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <div style={{ fontFamily: FC.serif, fontSize: 15, fontWeight: 700, color: FC.ink, marginBottom: 7, letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Benefits ── */}
        <div style={{
          background: `linear-gradient(135deg, #F0F8F4 0%, ${FC.paper} 60%, #F0F4FA 100%)`,
          borderRadius: 12, padding: isMobile ? '32px 20px' : isTablet ? '40px 32px' : '52px 48px',
          marginBottom: isMobile ? 48 : 72,
          border: `1px solid ${FC.eco100}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
            <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Résultats mesurés</div>
            <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Un retour sur investissement immédiat
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 20 : 24 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? 28 : 36, marginBottom: 10 }}>{b.icon}</div>
                <div style={{ fontFamily: FC.serif, fontSize: isMobile ? 14 : 16, fontWeight: 700, color: FC.ink, marginBottom: 6 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: FC.ink70, lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(61,217,214,0.18)', marginBottom: isMobile ? 48 : 72, position: 'relative', boxShadow: '0 8px 40px rgba(8,23,46,0.12)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
            padding: isMobile ? '14px 16px' : '22px 28px',
            background: 'linear-gradient(180deg,rgba(4,12,31,0.85) 0%,transparent 100%)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: FC.mono, fontSize: 9, color: FC.aqua, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                Surveillance en temps réel
              </div>
              <div style={{ fontFamily: FC.serif, fontSize: isMobile ? 15 : 20, fontWeight: 700, color: '#fff' }}>
                État des stocks — Afrique & RDC
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['Critique',FC.coral],['Vigilance',FC.amber],['Sain',FC.eco500]].map(([l,c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  background: 'rgba(8,23,46,0.7)', border: `1px solid ${c}40`, borderRadius: 999,
                  fontSize: 10, color: c, fontFamily: FC.mono }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c }}/>{l}
                </span>
              ))}
            </div>
          </div>
          <WorldMap highlights={HIGHLIGHTS} mode="constellation" width={1060} height={isMobile ? 260 : 380} showLegend={false}/>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: `linear-gradient(135deg, ${FC.navy900} 0%, #0D2540 55%, #051825 100%)`,
          borderRadius: 12, padding: isMobile ? '40px 20px' : isTablet ? '48px 32px' : '64px 52px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none' }}>
            {[0,1].map(i => (
              <svg key={i} style={{ position: 'absolute', bottom: `${10+i*20}%`, left: 0, width: '100%' }}>
                <path d={`M0 ${30+i*15} Q 250 ${i*20} 500 ${30+i*15} T 1100 ${30+i*15}`}
                  stroke={i===0 ? FC.aqua : FC.eco300} strokeWidth="1" fill="none"/>
              </svg>
            ))}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 14 }}>Rejoignez FishCast</div>
            <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 24 : 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 14 }}>
              Prêt à révolutionner<br/>votre gestion halieutique ?
            </h2>
            {!isMobile && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 36px' }}>
                Des ministères de la pêche aux coopératives locales, FishCast s'adapte à votre échelle.
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: isMobile ? 24 : 0 }}>
              <button className="fc-btn-eco" onClick={() => setPage('signin')}
                style={{ fontSize: 14, padding: isMobile ? '13px 24px' : '15px 36px' }}>
                Commencer ici →
              </button>
              <button className="fc-btn-ghost" onClick={() => setPage('signin')}
                style={{ fontSize: 14, padding: isMobile ? '13px 20px' : '15px 28px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${FC.rule}`,
        padding: isMobile ? '20px 16px' : '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0,
      }}>
        <FCLogo color={FC.ink50} size={18}/>
        <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink30, textAlign: isMobile ? 'center' : 'right' }}>
          © 2026 FishCast · Données FAO / COPEMED / INRH · Tous droits réservés
        </div>
      </div>
    </div>
  );
}
