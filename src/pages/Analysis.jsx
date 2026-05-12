import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import { KPICard, BarList, LineChart } from '../components/Charts.jsx';
import WorldMap from '../components/WorldMap.jsx';

const HIGHLIGHTS = {
  MAR: { status: 'warning',  intensity: 0.7 },
  SEN: { status: 'healthy',  intensity: 0.5 },
  MRT: { status: 'critical', intensity: 0.9 },
  GHA: { status: 'healthy',  intensity: 0.6 },
  CIV: { status: 'warning',  intensity: 0.4 },
  MOZ: { status: 'healthy',  intensity: 0.7 },
  ZAF: { status: 'warning',  intensity: 0.5 },
};

const SPECIES_DATA = [
  { label: 'Sardina pilchardus',  value: 42800, color: FC.navy700 },
  { label: 'Scomber scombrus',    value: 28600, color: FC.navy500 },
  { label: 'Octopus vulgaris',    value: 21400, color: FC.eco500 },
  { label: 'Thunnus thynnus',     value: 14200, color: FC.amber  },
  { label: 'Xiphias gladius',     value: 8900,  color: FC.coral  },
];

const HIST_DATA = [
  [2018, 38000], [2019, 41000], [2020, 36000], [2021, 43000],
  [2022, 47000], [2023, 44000], [2024, 51200],
];

const MONTHLY_DATA = [
  [1, 38000],[2, 36000],[3, 42000],[4, 45000],[5, 43000],[6, 48000],
  [7, 52000],[8, 50000],[9, 55000],[10, 58000],[11, 54000],[12, 61000],
];

const ALERT_ZONES = [
  { zone: '34.1.2 · Sahara', species: 'Sardina pilchardus', level: 'critical', index: '1.28', trend: '+0.14' },
  { zone: '34.1.1 · Atlantique', species: 'Scomber scombrus', level: 'warning', index: '0.91', trend: '+0.07' },
  { zone: '34.3.1 · Sud', species: 'Xiphias gladius', level: 'warning', index: '0.85', trend: '+0.03' },
];

export default function Analysis({ page, setPage }) {
  return (
    <Shell page={page} setPage={setPage}
      title="Analyse des stocks"
      sub="Zone FAO 34 · Données 2024"
      actions={
        <button className="fc-btn-eco" style={{ fontSize: 13, padding: '8px 18px' }}
          onClick={() => setPage('forecast')}>
          Lancer une prévision →
        </button>
      }
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }} className="fc-animate-in">

        {/* KPI strip */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 28 }}>
          <KPICard label="Débarquements 2024" value="51 200" unit="tonnes" delta="+15.9%" trend="up" />
          <KPICard label="Espèces actives" value="12" unit="espèces" delta="+2 vs 2023" trend="up" />
          <KPICard label="Indice de pression" value="0.74" unit="/ 1.0" delta="+0.08" trend="down" />
          <KPICard label="Zones sous tension" value="3" unit="zones FAO" delta="+1 vs 2023" trend="down" />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Tendance historique</div>
            <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, marginBottom: 18, letterSpacing: '-0.01em' }}>
              Débarquements totaux — 2018 à 2024
            </div>
            <LineChart data={HIST_DATA} width={560} height={220} yLabel="Tonnes" />
          </div>

          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Répartition</div>
            <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, marginBottom: 18, letterSpacing: '-0.01em' }}>
              Top 5 espèces · 2024
            </div>
            <BarList items={SPECIES_DATA} unit="t" />
          </div>
        </div>

        {/* Monthly + Alerts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Saisonnalité</div>
            <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, marginBottom: 18, letterSpacing: '-0.01em' }}>
              Débarquements mensuels — 2024
            </div>
            <LineChart data={MONTHLY_DATA} width={560} height={200} yLabel="Tonnes" />
          </div>

          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Alertes actives</div>
            <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, marginBottom: 16, letterSpacing: '-0.01em' }}>
              Zones sous pression
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ALERT_ZONES.map(a => (
                <div key={a.zone} style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: a.level === 'critical' ? `${FC.coral}08` : `${FC.amber}08`,
                  border: `1px solid ${a.level === 'critical' ? `${FC.coral}30` : `${FC.amber}30`}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: FC.ink }}>{a.zone}</span>
                    <span style={{ fontFamily: FC.mono, fontSize: 11, fontWeight: 700, color: a.level === 'critical' ? FC.coral : FC.amber }}>
                      {a.index}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: FC.ink50, fontStyle: 'italic' }}>{a.species}</span>
                    <span style={{ fontSize: 11, color: FC.coral, fontFamily: FC.mono }}>▲ {a.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="fc-btn-ghost" style={{ width: '100%', marginTop: 14, fontSize: 12, padding: '9px' }}
              onClick={() => setPage('recommend')}>
              Voir les recommandations →
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="fc-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div className="fc-eyebrow" style={{ marginBottom: 4 }}>Carte de surveillance</div>
              <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, letterSpacing: '-0.01em' }}>
                État des stocks par zone géographique
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="fc-tag"><span className="dot" style={{ background: FC.coral }} />Critique</span>
              <span className="fc-tag"><span className="dot" style={{ background: FC.amber }} />Vigilance</span>
              <span className="fc-tag"><span className="dot" />Sain</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <WorldMap highlights={HIGHLIGHTS} width={1000} height={320} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
