import { FC } from '../theme.js';
import FCLogo from './FCLogo.jsx';

const NAV = [
  { id: 'landing',    icon: '◈', label: 'Accueil' },
  { id: 'upload',     icon: '↑', label: 'Données' },
  { id: 'analysis',   icon: '◎', label: 'Analyse' },
  { id: 'forecast',   icon: '⌇', label: 'Prévision' },
  { id: 'recommend',  icon: '◆', label: 'Recommandations' },
];

export function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0, background: FC.navy900,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
    }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
        <FCLogo color={FC.paper} size={24} />
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', border: 'none', borderRadius: 6,
              background: active ? 'rgba(108,242,238,0.1)' : 'transparent',
              color: active ? FC.aquaGlow : 'rgba(255,255,255,0.55)',
              fontFamily: FC.sans, fontSize: 13, fontWeight: active ? 600 : 400,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              borderLeft: active ? `2px solid ${FC.aqua}` : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontFamily: FC.mono, fontSize: 14, opacity: active ? 1 : 0.7 }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="fc-live-dot" />
          <span style={{ fontFamily: FC.mono, fontSize: 10, color: FC.neon, letterSpacing: '0.12em' }}>DONNÉES EN DIRECT</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: FC.mono }}>
          Mis à jour: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, sub, actions }) {
  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', borderBottom: `1px solid ${FC.rule}`,
      background: FC.paper, position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 600, color: FC.ink, letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink50, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </header>
  );
}

export default function Shell({ page, setPage, title, sub, actions, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: FC.paper }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} sub={sub} actions={actions} />
        <main style={{ flex: 1, padding: 28 }}>{children}</main>
      </div>
    </div>
  );
}
