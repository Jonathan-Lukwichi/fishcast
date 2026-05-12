import { useState } from 'react';
import { FC } from '../theme.js';
import FCLogo from '../components/FCLogo.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';

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
          width: '100%', padding: '11px 14px',
          border: `1.5px solid ${focused ? FC.navy600 : FC.rule}`,
          borderRadius: 6, fontFamily: FC.sans, fontSize: 14, color: FC.ink,
          background: '#fff', outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? `0 0 0 3px rgba(43,108,166,0.1)` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  );
}

const STATS = [
  { val: '38', label: 'espèces surveillées' },
  { val: '94%', label: 'précision 90 jours' },
  { val: '20 ans', label: 'données FAO' },
];

export default function SignIn({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage('landing'); }, 1400);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left — brand panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: `linear-gradient(155deg, ${FC.navy900} 0%, #0D2540 55%, #06182E 100%)`,
        padding: '40px 52px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated waves */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
          {[0,1,2,3].map(i => (
            <svg key={i} style={{ position: 'absolute', top: `${15 + i * 17}%`, left: 0, width: '140%' }}>
              <path d={`M${-80 + i * 30} 0 Q 250 ${-50 + i * 25} 550 0 T 1000 0`}
                stroke={i % 2 === 0 ? FC.aqua : FC.eco300} strokeWidth="1.2" fill="none"
                style={{ animation: `fc-wave-drift ${5 + i * 1.2}s linear infinite`, animationDelay: `${-i * 1.8}s` }} />
            </svg>
          ))}
        </div>

        <FCLogo color={FC.paper} size={24} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 18 }}>
            Prévision halieutique · Intelligence Artificielle
          </div>
          <h1 style={{
            fontFamily: FC.serif, fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 700,
            color: '#fff', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 22,
          }}>
            Anticipez les stocks,<br />
            <span className="fc-shimmer-text">protégez les océans</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
            Des modèles IA entraînés sur 20 ans de données FAO pour fournir
            des prévisions de biomasse précises — par espèce, zone et saison.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 28 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: FC.serif, fontSize: 22, fontWeight: 700, color: FC.eco300 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: FC.mono, letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <WaveDeco color={FC.eco300} width={280} style={{ marginTop: 40, opacity: 0.45 }} />
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: FC.mono, position: 'relative', zIndex: 1 }}>
          © 2025 FishCast · Données FAO / COPEMED / INRH
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{
        width: 480, background: FC.paper,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '52px 48px', borderLeft: `1px solid ${FC.rule}`,
      }}>
        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: FC.serif, fontSize: 28, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Connexion
            </h2>
            <p style={{ fontSize: 14, color: FC.ink50, lineHeight: 1.5 }}>
              Accédez à votre espace FishCast
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <InputField label="Adresse e-mail" type="email" value={email} onChange={setEmail}
              placeholder="vous@organisation.ma" />
            <InputField label="Mot de passe" type="password" value={password} onChange={setPassword}
              placeholder="••••••••"
              hint={<a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: FC.navy600, textDecoration: 'none', fontWeight: 500 }}>Mot de passe oublié ?</a>}
            />

            <button type="submit" className="fc-btn-eco"
              style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 4, opacity: loading ? 0.75 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              {loading
                ? <><span className="fc-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Connexion…</>
                : 'Se connecter →'}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: FC.rule }} />
            <span style={{ fontSize: 12, color: FC.ink30, fontFamily: FC.mono }}>ou</span>
            <div style={{ flex: 1, height: 1, background: FC.rule }} />
          </div>

          <button className="fc-btn-ghost" onClick={() => setPage('landing')}
            style={{ width: '100%', padding: '12px', fontSize: 13, color: FC.ink70, borderColor: FC.rule }}>
            Continuer en mode démo →
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: FC.ink50 }}>
            Pas encore de compte ?{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: FC.navy700, fontWeight: 600, textDecoration: 'none' }}>
              Demander un accès
            </a>
          </p>

          <div style={{ marginTop: 36, padding: '14px 16px', background: FC.off, borderRadius: 8, border: `1px solid ${FC.rule}` }}>
            <div style={{ fontSize: 11, color: FC.ink50, fontFamily: FC.mono, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accès démo</div>
            <div style={{ fontSize: 12, color: FC.ink70 }}>Email: <span style={{ fontFamily: FC.mono }}>demo@fishcast.ma</span></div>
            <div style={{ fontSize: 12, color: FC.ink70, marginTop: 3 }}>Mot de passe: <span style={{ fontFamily: FC.mono }}>fishcast2025</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
