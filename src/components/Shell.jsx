import { FC } from '../theme.js';
import FCLogo from './FCLogo.jsx';

const NAV = [
  { id: 'landing',   label: 'Tableau de bord', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/></svg> },
  { id: 'upload',    label: 'Données',          icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10V3M8 3L5 6M8 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'analysis',  label: 'Analyse',          icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l3.5-4 3 3L12 6l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'forecast',  label: 'Prévision',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'recommend', label: 'Recommandations',  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1L2 5.4l4.2-.8L8 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
];

export function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 228, flexShrink: 0,
      background: `linear-gradient(180deg, #08172E 0%, #0A1E35 100%)`,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FCLogo color={FC.paper} size={22} />
        <div style={{ marginTop: 6, fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Gestion halieutique IA
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 10px 6px' }}>
          Navigation
        </div>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 12px', border: 'none', borderRadius: 7,
              background: active ? 'rgba(61,217,214,0.12)' : 'transparent',
              color: active ? FC.aquaGlow : 'rgba(255,255,255,0.48)',
              fontFamily: FC.sans, fontSize: 13, fontWeight: active ? 600 : 400,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              borderLeft: `2px solid ${active ? FC.aqua : 'transparent'}`,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: FC.aqua, flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 18px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="fc-live-dot" />
          <span style={{ fontFamily: FC.mono, fontSize: 10, color: FC.neon, letterSpacing: '0.1em' }}>Données en direct</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${FC.eco500}, ${FC.aqua})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FC.sans, fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            JL
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Jonathan L.</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: FC.mono }}>Administrateur</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, sub, actions }) {
  return (
    <header style={{
      height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', borderBottom: `1px solid ${FC.rule}`,
      background: 'rgba(250,247,239,0.92)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>{title}</div>
        {sub && <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink50, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </header>
  );
}

export default function Shell({ page, setPage, title, sub, actions, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: FC.paper }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ marginLeft: 228, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} sub={sub} actions={actions} />
        <main style={{ flex: 1, padding: '28px 32px' }}>{children}</main>
      </div>
    </div>
  );
}
