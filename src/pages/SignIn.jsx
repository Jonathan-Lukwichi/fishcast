import { useState } from 'react';
import { FC } from '../theme.js';
import FCLogo from '../components/FCLogo.jsx';
import { WaveDeco } from '../components/FCLogo.jsx';

export default function SignIn({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage('landing'); }, 1200);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: `1px solid ${FC.rule}`, borderRadius: 4,
    fontFamily: FC.sans, fontSize: 14, color: FC.ink,
    background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: `linear-gradient(135deg, ${FC.navy900} 0%, #0A2240 60%, #051428 100%)`,
    }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          {[0, 1, 2, 3].map(i => (
            <svg key={i} style={{ position: 'absolute', top: `${20 + i * 18}%`, left: 0, width: '100%' }}>
              <path d={`M${-100 + i * 40} 0 Q 200 ${-40 + i * 20} 500 0 T 900 0`}
                stroke={FC.aqua} strokeWidth="1" fill="none"
                style={{ animation: `fc-wave-drift ${4 + i}s linear infinite`, animationDelay: `${-i * 1.5}s` }} />
            </svg>
          ))}
        </div>
        <FCLogo color={FC.paper} size={26} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="fc-eyebrow" style={{ color: FC.aqua, marginBottom: 16 }}>Prévision halieutique · IA</div>
          <h1 style={{
            fontFamily: FC.serif, fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700,
            color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            Anticipez les stocks,<br />
            <span style={{ color: FC.eco300 }}>protégez les océans</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
            20 ans de données FAO. Modèles IA par espèce et zone.
            Recommandations de gestion durable automatiques.
          </p>
          <WaveDeco color={FC.eco300} width={260} style={{ marginTop: 32, opacity: 0.6 }} />
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: FC.mono }}>
          © 2025 FishCast · Données FAO / COPEMED
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 460, background: FC.paper,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '56px 48px',
      }}>
        <div style={{ fontFamily: FC.serif, fontSize: 26, fontWeight: 700, color: FC.ink, marginBottom: 4 }}>
          Connexion
        </div>
        <div style={{ fontSize: 13, color: FC.ink50, marginBottom: 32 }}>
          Accédez à votre tableau de bord FishCast
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, color: FC.ink70, fontWeight: 500, marginBottom: 6, fontFamily: FC.mono }}>
              Adresse e-mail
            </label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@organisation.ma" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: FC.ink70, fontWeight: 500, fontFamily: FC.mono }}>Mot de passe</label>
              <a href="#" style={{ fontSize: 12, color: FC.navy700, textDecoration: 'none' }}>Oublié ?</a>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" style={inputStyle} />
          </div>

          <button type="submit" className="fc-btn-eco"
            style={{ width: '100%', justifyContent: 'center', borderRadius: 4, padding: '13px', fontSize: 14, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: FC.ink50 }}>
          Pas encore de compte ?{' '}
          <a href="#" style={{ color: FC.navy700, fontWeight: 500, textDecoration: 'none' }}>
            Demander un accès
          </a>
        </div>

        <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${FC.rule}` }}>
          <div style={{ fontSize: 11, color: FC.ink30, fontFamily: FC.mono, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Connexion démo rapide
          </div>
          <button className="fc-btn-ghost" onClick={() => setPage('landing')}
            style={{ width: '100%', justifyContent: 'center', borderRadius: 4, fontSize: 13, padding: '10px' }}>
            Continuer sans compte →
          </button>
        </div>
      </div>
    </div>
  );
}
