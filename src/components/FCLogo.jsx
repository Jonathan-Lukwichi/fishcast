import { FC } from '../theme.js';

export default function FCLogo({ color = FC.navy900, size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M2 16 C 6 8, 12 6, 18 10 L 30 4 L 26 16 L 30 28 L 18 22 C 12 26, 6 24, 2 16 Z" fill={color} />
        <circle cx="22" cy="14" r="1.6" fill={color === FC.white ? FC.navy900 : FC.paper} />
        <path d="M8 16 Q 12 12, 16 16 T 24 16" stroke={FC.eco300} strokeWidth="1.4" fill="none" opacity="0.9" />
      </svg>
      <div style={{ fontFamily: FC.serif, fontSize: 19, fontWeight: 600, color, letterSpacing: '-0.01em' }}>FishCast</div>
    </div>
  );
}

export function WaveDeco({ color = FC.eco300, width = 200, height = 14, style }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
      <path d={`M0 ${height/2} Q ${width/8} 0 ${width/4} ${height/2} T ${width/2} ${height/2} T ${3*width/4} ${height/2} T ${width} ${height/2}`}
            stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
