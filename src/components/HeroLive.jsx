import { useEffect, useRef, useState } from 'react';
import { FC } from '../theme.js';
import { WaveDeco } from './FCLogo.jsx';

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function HeroWavesBG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={FC.aqua} />
          <stop offset="100%" stopColor={FC.neon} />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <path key={i}
          d={`M${-200 + i * 60} ${120 + i * 40} Q 200 ${60 + i * 30} 600 ${120 + i * 40} T 1200 ${120 + i * 40}`}
          stroke="url(#wg1)" strokeWidth={1.5 - i * 0.2} fill="none"
          style={{ animation: `fc-wave-drift ${3 + i * 0.8}s linear infinite`, animationDelay: `${i * -1.2}s` }}
        />
      ))}
    </svg>
  );
}

function BubbleParticles() {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    x: 8 + (i * 7.5) % 90,
    delay: (i * 0.7) % 4,
    size: 3 + (i % 4),
    dur: 4 + (i % 3),
  }));
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {bubbles.map((b, i) => (
        <circle key={i} cx={`${b.x}%`} cy="90%" r={b.size}
          fill={FC.eco300} opacity="0"
          style={{ animation: `fc-float-up ${b.dur}s ease-in infinite`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </svg>
  );
}

function LiveForecastSVG() {
  const data = [42, 48, 44, 51, 55, 52, 59, 63, 58, 66, 71, 68];
  const forecast = [68, 74, 78, 82, 77, 85];
  const w = 320, h = 100, padX = 10, padY = 12;
  const all = [...data, ...forecast];
  const maxY = Math.max(...all) * 1.08;
  const sx = (i, total) => padX + (i / (total - 1)) * (w - 2 * padX);
  const sy = v => h - padY - (v / maxY) * (h - 2 * padY);

  const histPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i, data.length)} ${sy(v)}`).join(' ');
  const fcStart = data.length - 1;
  const fcPath = [...data.slice(-1), ...forecast]
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(fcStart + i, data.length + forecast.length - 1)} ${sy(v)}`).join(' ');

  const bandTop = forecast.map((v, i) => [sx(fcStart + i + 0.9, data.length + forecast.length - 1), sy(v * 1.08)]);
  const bandBot = forecast.map((v, i) => [sx(fcStart + i + 0.9, data.length + forecast.length - 1), sy(v * 0.92)]);
  const bandD = bandTop.map(([x, y]) => `L ${x} ${y}`).join(' ')
    .replace('L', 'M') + ' ' + [...bandBot].reverse().map(([x, y]) => `L ${x} ${y}`).join(' ') + ' Z';

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="fcline" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={FC.navy500} />
          <stop offset="100%" stopColor={FC.eco300} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={padX} x2={w - padX} y1={sy(maxY * t)} y2={sy(maxY * t)}
          stroke="rgba(255,255,255,0.08)" strokeDasharray="3 5" />
      ))}
      <path d={bandD} fill={FC.eco300} opacity="0.18" />
      <path d={histPath} stroke="url(#fcline)" strokeWidth="2.2" fill="none"
        strokeDasharray="600" strokeDashoffset="600"
        style={{ animation: 'fc-draw-line 1.4s ease forwards' }}
      />
      <path d={fcPath} stroke={FC.eco300} strokeWidth="2" strokeDasharray="5 4" fill="none" opacity="0.9" />
      <line x1={sx(fcStart, data.length + forecast.length - 1)}
            x2={sx(fcStart, data.length + forecast.length - 1)}
            y1={padY} y2={h - padY}
            stroke="rgba(108,242,238,0.4)" strokeDasharray="2 3" />
    </svg>
  );
}

function LiveTicker({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3200);
    return () => clearInterval(t);
  }, [items.length]);
  const it = items[idx];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FC.mono, fontSize: 12 }}>
      <span className="fc-live-dot" />
      <span style={{ color: FC.neon, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 10 }}>EN DIRECT</span>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
      <span style={{ color: it.color || FC.aquaGlow, animation: 'fc-rise 0.4s ease', fontWeight: 500 }} key={idx}>
        {it.label}:
      </span>
      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{it.value}</span>
    </div>
  );
}

const TICKER_ITEMS = [
  { label: 'Sardine atlantique', value: '↑ 12.4%', color: FC.neon },
  { label: 'Maquereau', value: '↓ 3.1%', color: FC.coral },
  { label: 'Thon rouge', value: '→ Stable', color: FC.amber },
  { label: 'Poulpe', value: '↑ 8.7%', color: FC.neon },
  { label: 'Crevette royale', value: '↓ 5.4%', color: FC.coral },
];

export default function HeroLive({ setPage }) {
  const biomass = useCountUp(2847);
  const accuracy = useCountUp(94);
  const species = useCountUp(38);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: 0,
      background: `linear-gradient(135deg, ${FC.navy900} 0%, #0A2240 50%, #051428 100%)`,
      color: '#fff', minHeight: 480,
      display: 'flex', flexDirection: 'column',
    }}>
      <HeroWavesBG />
      <BubbleParticles />

      <div style={{ position: 'relative', zIndex: 2, padding: '48px 56px 36px', flex: 1 }}>
        <LiveTicker items={TICKER_ITEMS} />

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
          <div>
            <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 14 }}>
              Prévision halieutique IA · Afrique
            </div>
            <h1 style={{
              fontFamily: FC.serif, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700,
              lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0,
            }}>
              Anticipez les stocks,<br />
              <span className="fc-shimmer-text">protégez les océans</span>
            </h1>
            <p style={{
              marginTop: 20, maxWidth: 480, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.65)', fontSize: 15, fontFamily: FC.sans,
            }}>
              Modèles d'IA entraînés sur 20 ans de données FAO pour fournir des prévisions
              de biomasse par espèce, zone et saison — à 90 jours.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button className="fc-btn-eco" onClick={() => setPage('upload')}
                style={{ borderRadius: 4, fontSize: 13, padding: '10px 20px' }}>
                Importer mes données →
              </button>
              <button className="fc-btn-ghost" onClick={() => setPage('forecast')}
                style={{ borderRadius: 4, fontSize: 13, padding: '10px 20px', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                Voir une démo
              </button>
            </div>
          </div>

          <div style={{ minWidth: 340 }}>
            <div className="fc-glow-aqua" style={{
              background: 'rgba(8,23,46,0.7)', borderRadius: 10, padding: '20px 22px',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.aqua, letterSpacing: '0.16em', marginBottom: 14, textTransform: 'uppercase' }}>
                Prévision — 90 jours
              </div>
              <LiveForecastSVG />
              <div style={{ marginTop: 14, display: 'flex', gap: 16 }}>
                {[['Historique', FC.navy500], ['Prévision', FC.eco300]].map(([l, c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: FC.mono }}>
                    <div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { val: biomass.toLocaleString(), unit: 'tonnes', label: 'Biomasse estimée', icon: '◎' },
            { val: `${accuracy}%`, unit: '', label: 'Précision 90 jours', icon: '⌇' },
            { val: species, unit: 'espèces', label: 'Suivies en temps réel', icon: '◆' },
          ].map(k => (
            <div key={k.label}>
              <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink30, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                {k.icon} {k.label}
              </div>
              <div style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                {k.val} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: FC.sans, fontWeight: 400 }}>{k.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <WaveDeco color={FC.eco300} width={800} height={18} style={{ opacity: 0.3, width: '100%' }} />
      </div>
    </div>
  );
}
