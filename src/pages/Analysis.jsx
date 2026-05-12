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
  [2018, 38], [2019, 41], [2020, 36], [2021, 43], [2022, 47], [2023, 44], [2024, 51],
].map(([y, v]) => [y, v * 1000]);

const TREND_DATA = [
  [1, 38], [2, 36], [3, 42], [4, 45], [5, 43], [6, 48], [7, 52], [8, 50], [9, 55], [10, 58], [11, 54], [12, 61],
].map(([m, v]) => [m, v * 1000]);

export default function Analysis({ page, setPage }) {
  return (
    <Shell page={page} setPage={setPage}
      title="Analyse des stocks"
      sub="Données débarquement 2024 · Zone FAO 34"
      actions={
        <button className="fc-btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}
          onClick={() => setPage('forecast')}>
          Lancer une prévision →
        </button>
      }
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: FC.rule, border: `1px solid ${FC.rule}`, marginBottom: 24 }}>
          <KPICard label="Débarquements 2024" value="51 200" unit="tonnes" delta="+15.9%" trend="up" />
          <KPICard label="Espèces actives" value="12" unit="espèces" delta="+2" trend="up" />
          <KPICard label="Indice de pression" value="0.74" unit="/ 1.0" delta="+0.08" trend="down" />
          <KPICard label="Zones sous tension" value="3" unit="zones FAO" delta="+1" trend="down" />
        </div>

        {/* Chart + BarList */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Débarquements annuels</div>
            <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 18 }}>
              Tendance 2018–2024
            </div>
            <LineChart data={HIST_DATA} width={580} height={220} yLabel="Tonnes" />
          </div>

          <div className="fc-card" style={{ padding: '22px 24px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Par espèce</div>
            <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 18 }}>
              Top 5 · 2024
            </div>
            <BarList items={SPECIES_DATA} unit="t" />
          </div>
        </div>

        {/* Monthly trend */}
        <div className="fc-card" style={{ padding: '22px 24px', marginBottom: 24 }}>
          <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Saisonnalité</div>
          <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink, marginBottom: 18 }}>
            Débarquements mensuels — 2024
          </div>
          <LineChart data={TREND_DATA} width={980} height={200} yLabel="Tonnes" />
        </div>

        {/* Map */}
        <div className="fc-card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div className="fc-eyebrow" style={{ marginBottom: 6 }}>Distribution géographique</div>
              <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink }}>
                État des stocks par pays
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="fc-tag"><span className="dot" style={{ background: FC.coral }} />Critique</span>
              <span className="fc-tag"><span className="dot" style={{ background: FC.amber }} />Vigilance</span>
              <span className="fc-tag"><span className="dot" />Sain</span>
            </div>
          </div>
          <WorldMap highlights={HIGHLIGHTS} width={1000} height={320} />
        </div>
      </div>
    </Shell>
  );
}
