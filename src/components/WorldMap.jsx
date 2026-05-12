import { FC } from '../theme.js';

const COUNTRIES = [
  { id: 'MAR', name: 'Maroc',           path: 'M250 130 L295 128 L298 148 L275 165 L255 155 Z' },
  { id: 'MRT', name: 'Mauritanie',      path: 'M242 168 L290 168 L295 195 L260 200 L240 188 Z' },
  { id: 'SEN', name: 'Sénégal',         path: 'M232 198 L262 198 L260 215 L235 215 Z' },
  { id: 'CIV', name: "Côte d'Ivoire",   path: 'M268 215 L292 215 L292 235 L268 235 Z' },
  { id: 'GHA', name: 'Ghana',           path: 'M293 215 L312 215 L312 235 L293 235 Z' },
  { id: 'COD', name: 'RD Congo',        path: 'M370 248 L425 245 L432 285 L385 290 L370 275 Z' },
  { id: 'NAM', name: 'Namibie',         path: 'M370 322 L405 322 L408 348 L378 350 L370 340 Z' },
  { id: 'ZAF', name: 'Afrique du Sud',  path: 'M378 350 L425 348 L425 372 L390 378 L378 365 Z' },
  { id: 'MOZ', name: 'Mozambique',      path: 'M432 285 L445 285 L450 340 L438 342 L432 320 Z' },
  { id: 'MDG', name: 'Madagascar',      path: 'M462 295 L478 298 L482 340 L468 342 L462 322 Z' },
  { id: 'FJI', name: 'Fidji',           path: 'M695 268 L712 270 L712 282 L698 282 Z' },
];

const CONTINENTS = [
  'M60 90 L160 85 L185 130 L160 180 L130 195 L95 175 L70 145 Z',
  'M165 220 L210 215 L228 270 L215 330 L185 340 L165 310 L162 260 Z',
  'M260 90 L355 88 L370 122 L300 128 L270 115 Z',
  'M250 130 L370 132 L432 200 L450 280 L430 350 L395 378 L370 360 L340 360 L290 310 L250 240 L235 180 Z',
  'M398 132 L478 130 L505 180 L460 220 L420 200 L398 165 Z',
  'M510 165 L580 165 L605 215 L560 240 L520 220 Z',
  'M580 130 L685 128 L710 175 L660 210 L600 200 L580 170 Z',
  'M620 215 L710 220 L720 250 L660 260 L620 245 Z',
  'M650 295 L735 290 L755 335 L700 350 L650 335 Z',
];

function centroid(path) {
  const pts = (path.match(/(\d+)\s+(\d+)/g) || []).map(s => s.split(/\s+/).map(Number));
  if (!pts.length) return [0, 0];
  return [
    pts.reduce((a, p) => a + p[0], 0) / pts.length,
    pts.reduce((a, p) => a + p[1], 0) / pts.length,
  ];
}

export default function WorldMap({ width = 760, height = 380, highlights = {}, mode = 'default', showLegend = false }) {
  if (mode === 'constellation') {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        <defs>
          <radialGradient id="cstl-ocean" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0A1B3A" />
            <stop offset="100%" stopColor="#02060F" />
          </radialGradient>
          <pattern id="cstl-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(94,168,211,0.08)" strokeWidth="0.5" />
          </pattern>
          <filter id="cstl-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={width} height={height} fill="url(#cstl-ocean)" />
        <rect width={width} height={height} fill="url(#cstl-grid)" />
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="rgba(108,242,238,0.18)" strokeDasharray="2 8" strokeWidth="0.6" />
        {CONTINENTS.map((d, i) => (
          <path key={i} d={d} fill="rgba(21,53,95,0.45)" stroke="rgba(108,242,238,0.28)" strokeWidth="0.8" />
        ))}
        {COUNTRIES.map(c => {
          const h = highlights[c.id];
          if (!h) return null;
          const accent = h.status === 'critical' ? FC.coral : h.status === 'warning' ? FC.amber : FC.eco500;
          const [cx, cy] = centroid(c.path);
          return (
            <g key={c.id}>
              <path d={c.path} fill={`${accent}30`} stroke={accent} strokeWidth="1" />
              <circle cx={cx} cy={cy} r={8 + h.intensity * 6} fill={accent} opacity="0.12">
                <animate attributeName="r" values={`${6 + h.intensity*4};${14 + h.intensity*8};${6 + h.intensity*4}`} dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="4" fill={accent} filter="url(#cstl-glow)" />
              <circle cx={cx} cy={cy} r="1.8" fill="#fff" />
            </g>
          );
        })}
        {showLegend && (
          <g transform={`translate(20, ${height - 40})`}>
            {[['Critique', FC.coral], ['Vigilance', FC.amber], ['Sain', FC.eco500]].map(([l, c], i) => (
              <g key={l} transform={`translate(${i * 110}, 0)`}>
                <rect width="10" height="10" fill={c} />
                <text x="14" y="9" fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily={FC.mono}>{l}</text>
              </g>
            ))}
          </g>
        )}
      </svg>
    );
  }

  // Default editorial mode
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <rect width={width} height={height} fill={FC.off} />
      {CONTINENTS.map((d, i) => (
        <path key={i} d={d} fill={FC.paperDeep} stroke={FC.rule} strokeWidth="0.8" />
      ))}
      {COUNTRIES.map(c => {
        const h = highlights[c.id];
        const fill = h
          ? h.status === 'critical' ? `${FC.coral}60`
          : h.status === 'warning' ? `${FC.amber}60`
          : `${FC.eco500}60`
          : FC.paperWarm;
        const stroke = h
          ? h.status === 'critical' ? FC.coral
          : h.status === 'warning' ? FC.amber
          : FC.eco500
          : FC.rule;
        const [cx, cy] = centroid(c.path);
        return (
          <g key={c.id}>
            <path d={c.path} fill={fill} stroke={stroke} strokeWidth={h ? 1.5 : 0.8} />
            {h && (
              <>
                <circle cx={cx} cy={cy} r="5" fill={stroke} opacity="0.9" />
                <circle cx={cx} cy={cy} r="2" fill="#fff" />
              </>
            )}
          </g>
        );
      })}
      {showLegend && (
        <g transform={`translate(20, ${height - 30})`}>
          {[['Critique', FC.coral], ['Vigilance', FC.amber], ['Sain', FC.eco500]].map(([l, c], i) => (
            <g key={l} transform={`translate(${i * 100}, 0)`}>
              <rect width="10" height="10" fill={c} />
              <text x="14" y="9" fontSize="10" fill={FC.ink70} fontFamily={FC.mono}>{l}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
