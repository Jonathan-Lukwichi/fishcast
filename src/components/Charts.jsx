import { FC } from '../theme.js';

function buildPath(points, w, h, padX = 50, padY = 30) {
  if (!points.length) return null;
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const maxY = Math.max(...ys) * 1.1;
  const sx = x => padX + (x - minX) / (maxX - minX || 1) * (w - 2 * padX);
  const sy = y => h - padY - (y / (maxY || 1)) * (h - 2 * padY);
  let d = `M ${sx(points[0][0])} ${sy(points[0][1])}`;
  for (let i = 1; i < points.length; i++) d += ` L ${sx(points[i][0])} ${sy(points[i][1])}`;
  return { d, sx, sy, minX, maxX, maxY };
}

export function KPICard({ label, value, unit, delta, trend }) {
  return (
    <div className="fc-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="fc-eyebrow">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div className="fc-serif" style={{ fontSize: 30, fontWeight: 600, color: FC.ink, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ fontSize: 13, color: FC.ink50 }}>{unit}</div>
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 12, color: trend === 'up' ? FC.eco500 : trend === 'down' ? FC.coral : FC.ink50, fontWeight: 500 }}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {delta}
          <span style={{ color: FC.ink50, fontWeight: 400 }}> vs. 2018–22</span>
        </div>
      )}
    </div>
  );
}

export function LineChart({ width = 720, height = 280, data = [], forecast = null, confidenceBand = null, yLabel = 'Tonnes (×1000)' }) {
  const allPts = [...data, ...(forecast || [])];
  const built = buildPath(allPts, width, height);
  if (!built) return null;
  const { sx, sy, minX, maxX, maxY } = built;

  const histD = data.length ? buildPath(data, width, height).d : '';
  let fcD = '';
  if (forecast?.length) {
    const start = data.length ? data[data.length - 1] : forecast[0];
    fcD = `M ${sx(start[0])} ${sy(start[1])}`;
    forecast.forEach(p => { fcD += ` L ${sx(p[0])} ${sy(p[1])}`; });
  }

  let bandD = '';
  if (confidenceBand?.length) {
    const upper = confidenceBand.map(p => [p[0], p[2]]);
    const lower = confidenceBand.map(p => [p[0], p[1]]);
    bandD = `M ${sx(upper[0][0])} ${sy(upper[0][1])}`;
    upper.forEach(p => { bandD += ` L ${sx(p[0])} ${sy(p[1])}`; });
    [...lower].reverse().forEach(p => { bandD += ` L ${sx(p[0])} ${sy(p[1])}`; });
    bandD += ' Z';
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => maxY * t);
  const xTicks = [];
  for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
    if ((x - Math.ceil(minX)) % Math.max(1, Math.round((maxX - minX) / 8)) === 0) xTicks.push(x);
  }

  return (
    <svg width={width} height={height} style={{ display: 'block', maxWidth: '100%' }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {yTicks.map((y, i) => (
        <g key={i}>
          <line x1={50} x2={width - 20} y1={sy(y)} y2={sy(y)} stroke={FC.ruleSoft} strokeDasharray="2 4" />
          <text x={44} y={sy(y) + 4} textAnchor="end" fontSize="10" fill={FC.ink50} fontFamily={FC.mono}>{Math.round(y).toLocaleString()}</text>
        </g>
      ))}
      {xTicks.map(x => (
        <text key={x} x={sx(x)} y={height - 8} textAnchor="middle" fontSize="10" fill={FC.ink50} fontFamily={FC.mono}>{x}</text>
      ))}
      {bandD && <path d={bandD} fill={FC.eco500} opacity="0.13" />}
      {histD && <path d={histD} stroke={FC.navy700} strokeWidth="2" fill="none" />}
      {fcD && <path d={fcD} stroke={FC.eco500} strokeWidth="2.2" strokeDasharray="5 4" fill="none" />}
      {data.length && forecast?.length && (
        <line x1={sx(data[data.length-1][0])} x2={sx(data[data.length-1][0])} y1={30} y2={height-30} stroke={FC.ink30} strokeDasharray="2 3" />
      )}
      <text x={14} y={height / 2} fontSize="10" fill={FC.ink50} fontFamily={FC.mono} transform={`rotate(-90 14 ${height / 2})`} textAnchor="middle">{yLabel}</text>
    </svg>
  );
}

export function BarList({ items = [], unit = '' }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: FC.ink }}>{it.label}</span>
            <span className="fc-mono" style={{ color: FC.ink70 }}>{it.value.toLocaleString()} {unit}</span>
          </div>
          <div style={{ height: 6, background: FC.paperDeep, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(it.value / max) * 100}%`, height: '100%', background: it.color || FC.navy700 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
