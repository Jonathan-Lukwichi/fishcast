import { FC } from '../theme.js';

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

function fracYearToLabel(x) {
  const year = Math.floor(x);
  const month = Math.round((x - year) * 12);
  if (month === 0) return String(year);
  return `${MONTHS_FR[month % 12]} ${year + Math.floor(month / 12)}`;
}

function buildPath(points, w, h, padX = 52, padY = 30) {
  if (!points.length) return null;
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const maxY = Math.max(...ys) * 1.12;
  const sx = x => padX + (x - minX) / (maxX - minX || 1) * (w - padX - 20);
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
          <span style={{ color: FC.ink50, fontWeight: 400 }}> vs. 2020–24</span>
        </div>
      )}
    </div>
  );
}

export function LineChart({
  width = 720, height = 280,
  data = [], forecast = null, confidenceBand = null,
  yLabel = 'Tonnes',
  todayX = null,
  nextMonthAnnotation = null, // { x, y, label }
}) {
  const padX = 58, padY = 32;
  const allPts = [...data, ...(forecast || [])];
  const built = buildPath(allPts, width, height, padX, padY);
  if (!built) return null;
  const { sx, sy, minX, maxX, maxY } = built;

  const histD = data.length ? buildPath(data, width, height, padX, padY).d : '';
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

  // Integer year ticks only
  const xTicks = [];
  for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) xTicks.push(x);

  return (
    <svg width={width} height={height} style={{ display: 'block', maxWidth: '100%' }}
      viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">

      {/* Horizontal grid lines + y labels */}
      {yTicks.map((y, i) => (
        <g key={`hy-${i}`}>
          <line
            x1={padX} x2={width - 20}
            y1={sy(y)} y2={sy(y)}
            stroke={FC.ruleSoft} strokeDasharray="3 5" strokeWidth="0.7"
          />
          <text x={padX - 6} y={sy(y) + 4} textAnchor="end"
            fontSize="10" fill={FC.ink50} fontFamily={FC.mono}>
            {Math.round(y).toLocaleString('fr-FR')}
          </text>
        </g>
      ))}

      {/* Vertical grid lines + x labels */}
      {xTicks.map(x => (
        <g key={`vx-${x}`}>
          <line
            x1={sx(x)} x2={sx(x)}
            y1={padY} y2={height - padY}
            stroke={FC.ruleSoft} strokeDasharray="3 5" strokeWidth="0.7"
          />
          <text x={sx(x)} y={height - 10} textAnchor="middle"
            fontSize="10" fill={FC.ink50} fontFamily={FC.mono}>{x}</text>
        </g>
      ))}

      {/* Confidence band */}
      {bandD && <path d={bandD} fill={FC.eco500} opacity="0.12" />}

      {/* Historical line */}
      {histD && <path d={histD} stroke={FC.navy700} strokeWidth="2.2" fill="none" strokeLinejoin="round" />}

      {/* Forecast line */}
      {fcD && <path d={fcD} stroke={FC.eco500} strokeWidth="2.2" strokeDasharray="6 4" fill="none" strokeLinejoin="round" />}

      {/* Hist/forecast separator */}
      {data.length > 0 && forecast?.length > 0 && (
        <line
          x1={sx(data[data.length - 1][0])} x2={sx(data[data.length - 1][0])}
          y1={padY} y2={height - padY}
          stroke={FC.ink30} strokeDasharray="2 3" strokeWidth="1"
        />
      )}

      {/* Today line */}
      {todayX !== null && sx(todayX) > padX && sx(todayX) < width - 20 && (
        <g>
          <line
            x1={sx(todayX)} x2={sx(todayX)}
            y1={padY - 4} y2={height - padY}
            stroke={FC.amber} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85"
          />
          <rect x={sx(todayX) - 28} y={padY - 18} width={56} height={14} rx={3}
            fill={FC.amber} opacity="0.15" />
          <text x={sx(todayX)} y={padY - 7} textAnchor="middle"
            fontSize="9" fill={FC.amber} fontFamily={FC.mono} fontWeight="600">
            Aujourd'hui
          </text>
        </g>
      )}

      {/* Next month annotation */}
      {nextMonthAnnotation && sx(nextMonthAnnotation.x) > padX && (
        <g>
          <circle cx={sx(nextMonthAnnotation.x)} cy={sy(nextMonthAnnotation.y)} r="5.5"
            fill={FC.eco500} opacity="0.9" />
          <circle cx={sx(nextMonthAnnotation.x)} cy={sy(nextMonthAnnotation.y)} r="2.2"
            fill="#fff" />
          <rect
            x={sx(nextMonthAnnotation.x) - 34} y={sy(nextMonthAnnotation.y) - 28}
            width={68} height={17} rx={4}
            fill={FC.eco700} opacity="0.92"
          />
          <text
            x={sx(nextMonthAnnotation.x)} y={sy(nextMonthAnnotation.y) - 16}
            textAnchor="middle" fontSize="9" fill="#fff" fontFamily={FC.mono} fontWeight="600">
            {nextMonthAnnotation.label}
          </text>
        </g>
      )}

      {/* Y axis label */}
      <text x={12} y={height / 2} fontSize="10" fill={FC.ink50} fontFamily={FC.mono}
        transform={`rotate(-90 12 ${height / 2})`} textAnchor="middle">{yLabel}</text>
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
            <span className="fc-mono" style={{ color: FC.ink70 }}>{it.value.toLocaleString('fr-FR')} {unit}</span>
          </div>
          <div style={{ height: 6, background: FC.paperDeep, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(it.value / max) * 100}%`, height: '100%', background: it.color || FC.navy700 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
