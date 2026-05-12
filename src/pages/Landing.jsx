import { FC } from '../theme.js';
import HeroLive from '../components/HeroLive.jsx';
import { KPICard } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';

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
    icon: '⌇',
    title: 'Prévision par espèce',
    desc: 'Modèles IA par espèce, zone FAO et saison. Horizon 30, 60 ou 90 jours avec intervalles de confiance.',
    color: FC.eco500,
  },
  {
    icon: '◎',
    title: 'Carte de surveillance',
    desc: 'Visualisez les alertes de surpêche, les zones critiques et l\'état des stocks sur une carte interactive.',
    color: FC.navy600,
  },
  {
    icon: '◆',
    title: 'Recommandations IA',
    desc: 'Quotas suggérés, saisons de fermeture, zones de repos biologique — générés automatiquement.',
    color: FC.coral,
  },
  {
    icon: '↑',
    title: 'Import de données',
    desc: 'Chargez vos données de débarquement CSV/Excel. Détection automatique des colonnes et normalisation.',
    color: FC.amber,
  },
];

export default function Landing({ setPage }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <HeroLive setPage={setPage} />

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, margin: '1px 0', background: FC.rule }}>
        <KPICard label="Stocks surveillés" value="38" unit="espèces" delta="+6 cette année" trend="up" />
        <KPICard label="Précision modèle" value="94.2" unit="%" delta="+2.1 pts" trend="up" />
        <KPICard label="Zones critiques" value="7" unit="zones FAO" delta="+2 zones" trend="down" />
        <KPICard label="Données FAO" value="20" unit="ans d'historique" />
      </div>

      {/* Map section */}
      <div className="fc-card" style={{ margin: '28px 0', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Surveillance en temps réel</div>
            <h2 style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 600, color: FC.ink, letterSpacing: '-0.01em' }}>
              État des stocks — Afrique
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="fc-tag"><span className="dot" style={{ background: FC.coral }} />Critique</span>
            <span className="fc-tag"><span className="dot" style={{ background: FC.amber }} />Vigilance</span>
            <span className="fc-tag"><span className="dot" />Sain</span>
          </div>
        </div>
        <WorldMap highlights={HIGHLIGHTS} showLegend={false} width={1040} height={340} />
      </div>

      {/* Features */}
      <div>
        <div className="fc-eyebrow" style={{ marginBottom: 10, textAlign: 'center' }}>Fonctionnalités</div>
        <WaveDeco style={{ display: 'block', margin: '0 auto 24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="fc-card" style={{ padding: '24px 26px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FC.mono, fontSize: 18, color: f.color, marginBottom: 14,
              }}>{f.icon}</div>
              <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div style={{
        margin: '32px 0 0', padding: '36px 40px',
        background: FC.navy900, borderRadius: 8, textAlign: 'center',
      }}>
        <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 10 }}>Commencer maintenant</div>
        <h2 style={{ fontFamily: FC.serif, fontSize: 26, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
          Vos données de pêche, transformées en prévisions
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Importez vos relevés de débarquement et obtenez vos premières prévisions en quelques minutes.
        </p>
        <button className="fc-btn-eco" onClick={() => setPage('upload')} style={{ margin: '0 auto', borderRadius: 4 }}>
          Importer mes données →
        </button>
      </div>
    </div>
  );
}
