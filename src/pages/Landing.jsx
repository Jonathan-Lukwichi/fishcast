import { FC } from '../theme.js';
import HeroLive from '../components/HeroLive.jsx';
import { KPICard } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';
import FCLogo from '../components/FCLogo.jsx';

const HIGHLIGHTS = {
  MAR: { status: 'warning',  intensity: 0.7 },
  SEN: { status: 'healthy',  intensity: 0.5 },
  MRT: { status: 'critical', intensity: 0.9 },
  GHA: { status: 'healthy',  intensity: 0.6 },
  CIV: { status: 'warning',  intensity: 0.4 },
  MOZ: { status: 'healthy',  intensity: 0.7 },
  ZAF: { status: 'warning',  intensity: 0.5 },
};

const FEATURES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12l3-4 4 3 4-7 4 3" stroke="#2E8F62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7" stroke="#2E8F62" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Prévision par espèce',
    desc: 'Modèles IA entraînés par espèce, zone FAO et saison. Horizon 30 à 90 jours avec intervalles de confiance.',
    color: FC.eco500, bg: `${FC.eco500}10`,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#15355F" strokeWidth="2"/><path d="M2 12h3M19 12h3M12 2v3M12 19v3" stroke="#15355F" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Carte de surveillance',
    desc: 'Visualisez les alertes de surpêche, zones critiques et état des stocks sur une carte mondiale interactive.',
    color: FC.navy600, bg: `${FC.navy600}10`,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 4.8 5.3.8-3.9 3.8.9 5.3L12 14.3l-4.7 2.4.9-5.3L4.3 7.6l5.3-.8L12 2z" stroke="#D9942C" strokeWidth="2" strokeLinejoin="round"/></svg>,
    title: 'Recommandations IA',
    desc: 'Quotas suggérés, saisons de fermeture, zones de repos biologique — générés et priorisés automatiquement.',
    color: FC.amber, bg: `${FC.amber}10`,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 15V4M12 4L8.5 7.5M12 4l3.5 3.5" stroke="#1E4D80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="#1E4D80" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Import de données',
    desc: 'Chargez vos données de débarquement CSV/Excel. Détection automatique des colonnes et validation.',
    color: FC.navy600, bg: `${FC.navy500}10`,
  },
];

const STEPS = [
  { n: '01', title: 'Importez', desc: 'Glissez vos fichiers CSV ou Excel de débarquement.' },
  { n: '02', title: 'Analysez', desc: 'Explorez les tendances, espèces et zones géographiques.' },
  { n: '03', title: 'Prévoyez', desc: "L'IA calcule les stocks sur 30, 60 ou 90 jours." },
  { n: '04', title: 'Agissez', desc: 'Recevez des recommandations de gestion concrètes.' },
];

export default function Landing({ setPage }) {
  return (
    <div style={{ background: FC.paper }}>

      {/* Top nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 60, background: 'rgba(250,247,239,0.95)',
        borderBottom: `1px solid ${FC.rule}`, position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <FCLogo color={FC.navy900} size={22} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="fc-btn-ghost" onClick={() => setPage('upload')}
            style={{ fontSize: 13, padding: '8px 18px' }}>
            Importer des données
          </button>
          <button className="fc-btn-eco" onClick={() => setPage('forecast')}
            style={{ fontSize: 13, padding: '8px 18px' }}>
            Voir la prévision →
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Hero */}
        <div style={{ margin: '24px 0 2px', borderRadius: 12, overflow: 'hidden' }}>
          <HeroLive setPage={setPage} />
        </div>

        {/* KPI strip */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 40 }}>
          <KPICard label="Stocks surveillés" value="38" unit="espèces" delta="+6 cette année" trend="up" />
          <KPICard label="Précision modèle" value="94.2" unit="%" delta="+2.1 pts" trend="up" />
          <KPICard label="Zones critiques" value="7" unit="zones FAO" delta="+2 zones" trend="down" />
          <KPICard label="Historique FAO" value="20" unit="ans de données" />
        </div>

        {/* How it works */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 8 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: FC.serif, fontSize: 26, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 6 }}>
            De vos données aux décisions
          </h2>
          <WaveDeco style={{ display: 'block', margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 56, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, left: '12.5%', right: '12.5%', height: 1, background: FC.ruleSoft, zIndex: 0 }} />
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: i === 0 ? FC.navy800 : '#fff',
                border: `2px solid ${i === 0 ? FC.navy800 : FC.rule}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FC.mono, fontSize: 12, fontWeight: 700,
                color: i === 0 ? '#fff' : FC.ink50,
                margin: '0 auto 16px',
              }}>{s.n}</div>
              <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: FC.ink50, lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="fc-card" style={{ padding: '24px 26px', display: 'flex', gap: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 700, color: FC.ink, marginBottom: 6, letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Map section */}
        <div className="fc-card" style={{ padding: '28px 28px', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Surveillance en temps réel</div>
              <h2 style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>
                État des stocks — Afrique
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="fc-tag"><span className="dot" style={{ background: FC.coral }} />Critique</span>
              <span className="fc-tag"><span className="dot" style={{ background: FC.amber }} />Vigilance</span>
              <span className="fc-tag"><span className="dot" />Sain</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <WorldMap highlights={HIGHLIGHTS} width={1100} height={340} />
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${FC.navy900} 0%, #0D2540 60%, #051A30 100%)`,
          borderRadius: 12, padding: '52px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
            <WaveDeco color={FC.aqua} width={1200} height={60} style={{ position: 'absolute', top: '30%' }} />
          </div>
          <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 12 }}>Commencer maintenant</div>
          <h2 style={{ fontFamily: FC.serif, fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Vos données de pêche,<br />transformées en prévisions
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Importez vos relevés de débarquement et obtenez vos premières prévisions en quelques minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="fc-btn-eco" onClick={() => setPage('upload')} style={{ fontSize: 14, padding: '13px 28px' }}>
              Importer mes données →
            </button>
            <button className="fc-btn-ghost" onClick={() => setPage('forecast')}
              style={{ fontSize: 14, padding: '13px 24px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              Voir une démo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
