import { useState } from 'react';
import { FC } from '../theme.js';
import FCLogo from '../components/FCLogo.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';

function InputField({ label, type, value, onChange, placeholder, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <label style={{ fontSize: 13, color: FC.ink70, fontWeight: 500 }}>{label}</label>
        {hint}
      </div>
      <input
        type={type} required value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 14px',
          border: `1.5px solid ${focused ? FC.navy600 : FC.rule}`,
          borderRadius: 7, fontFamily: FC.sans, fontSize: 15, color: FC.ink,
          background: '#fff', outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? `0 0 0 3px rgba(43,108,166,0.1)` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  );
}

const STATS = [
  { val: '38',     label: 'espèces suivies' },
  { val: '94%',    label: 'précision IA' },
  { val: '20 ans', label: 'données FAO' },
];

export default function SignIn({ setPage }) {
  const { isMobile, isTablet } = useBreakpoint();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage('dashboard'); }, 1400);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage('dashboard'); }, 900);
  };

  const showBrandPanel = !isMobile;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* Mobile-only top bar */}
      {isMobile && (
        <div style={{
          padding: '16px 20px', background: FC.navy900,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <FCLogo color={FC.paper} size={20} />
          <button onClick={() => setPage('landing')} style={{
            background: 'none', border: `1px solid rgba(255,255,255,0.2)`, cursor: 'pointer',
            fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: FC.mono,
            padding: '5px 12px', borderRadius: 999,
          }}>← Accueil</button>
        </div>
      )}

      {/* Left — brand panel (tablet+desktop) */}
      {showBrandPanel && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: `linear-gradient(155deg, ${FC.navy900} 0%, #0D2540 55%, #051825 100%)`,
          padding: isTablet ? '32px 36px' : '40px 52px',
          position: 'relative', overflow: 'hidden',
          minWidth: isTablet ? 260 : undefined,
          maxWidth: isTablet ? 320 : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
            {[0,1,2,3].map(i => (
              <svg key={i} style={{ position: 'absolute', top: `${12 + i * 18}%`, left: 0, width: '140%' }}>
                <path d={`M${-80 + i*30} 0 Q 260 ${-50 + i*26} 580 0 T 1100 0`}
                  stroke={i % 2 === 0 ? FC.aqua : FC.eco300} strokeWidth="1" fill="none"
                  style={{ animation: `fc-wave-drift ${5 + i * 1.3}s linear infinite`, animationDelay: `${-i * 1.9}s` }}/>
              </svg>
            ))}
          </div>

          <FCLogo color={FC.paper} size={22} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, maxWidth: 440 }}>
            <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 16 }}>
              Prévision halieutique · IA
            </div>
            <h1 style={{
              fontFamily: FC.serif, fontSize: isTablet ? '22px' : 'clamp(26px, 3vw, 42px)',
              fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 18,
            }}>
              Anticipez les stocks,<br />
              <span className="fc-shimmer-text">protégez les océans</span>
            </h1>
            {!isTablet && (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
                Des modèles IA entraînés sur 20 ans de données FAO pour des prévisions de biomasse précises.
              </p>
            )}
            <div style={{ display: 'flex', gap: isTablet ? 18 : 28 }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: FC.serif, fontSize: isTablet ? 18 : 22, fontWeight: 700, color: FC.eco300 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: FC.mono, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {!isTablet && <WaveDeco color={FC.eco300} width={240} style={{ marginTop: 36, opacity: 0.4 }} />}
          </div>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: FC.mono, position: 'relative', zIndex: 1 }}>
            © 2026 FishCast · FAO / COPEMED / INRH
          </div>
        </div>
      )}

      {/* Right — form */}
      <div style={{
        width: isMobile ? '100%' : isTablet ? 380 : 480,
        background: FC.paper,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: isMobile ? '28px 20px 40px' : isTablet ? '40px 32px' : '52px 48px',
        borderLeft: isMobile ? 'none' : `1px solid ${FC.rule}`,
        flex: isMobile ? 1 : undefined,
      }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>

          {!isMobile && (
            <button onClick={() => setPage('landing')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: FC.ink50, fontFamily: FC.mono, padding: 0,
            }}>
              ← Retour à l'accueil
            </button>
          )}

          {isMobile && (
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${FC.rule}` }}>
              <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 8 }}>FishCast · Prévision IA</div>
              <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 700, color: FC.ink }}>
                Anticipez les stocks, protégez les océans
              </div>
            </div>
          )}

          <h2 style={{ fontFamily: FC.serif, fontSize: isMobile ? 24 : 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Connexion
          </h2>
          <p style={{ fontSize: 14, color: FC.ink50, marginBottom: 24, lineHeight: 1.5 }}>
            Accédez à votre espace FishCast
          </p>

          {error && (
            <div style={{ padding: '10px 14px', background: `${FC.coral}10`, border: `1px solid ${FC.coral}30`, borderRadius: 7, fontSize: 13, color: FC.coral, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField label="Adresse e-mail" type="email" value={email} onChange={setEmail}
              placeholder="vous@organisation.ma" />
            <InputField label="Mot de passe" type="password" value={password} onChange={setPassword}
              placeholder="••••••••"
              hint={<a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: FC.navy600, textDecoration: 'none', fontWeight: 500 }}>Oublié ?</a>}
            />
            <button type="submit" className="fc-btn-eco"
              style={{ width: '100%', padding: '14px', fontSize: 14, marginTop: 4, opacity: loading ? 0.75 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              {loading
                ? <><span className="fc-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Connexion…</>
                : 'Se connecter →'}
            </button>
          </form>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: FC.rule }} />
            <span style={{ fontSize: 12, color: FC.ink30, fontFamily: FC.mono }}>ou</span>
            <div style={{ flex: 1, height: 1, background: FC.rule }} />
          </div>

          <button className="fc-btn-ghost" onClick={handleDemo}
            style={{ width: '100%', padding: '13px', fontSize: 13, color: FC.ink70 }}>
            Continuer en mode démo →
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: FC.ink50 }}>
            Pas encore de compte ?{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: FC.navy700, fontWeight: 600, textDecoration: 'none' }}>
              Demander un accès
            </a>
          </p>

          <div style={{ marginTop: 28, padding: '14px 16px', background: FC.off, borderRadius: 8, border: `1px solid ${FC.rule}` }}>
            <div style={{ fontSize: 10, color: FC.ink30, fontFamily: FC.mono, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Accès démo
            </div>
            <div style={{ fontSize: 12, color: FC.ink70 }}>Email : <span style={{ fontFamily: FC.mono, color: FC.ink }}>demo@fishcast.ma</span></div>
            <div style={{ fontSize: 12, color: FC.ink70, marginTop: 4 }}>Mot de passe : <span style={{ fontFamily: FC.mono, color: FC.ink }}>fishcast2025</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
