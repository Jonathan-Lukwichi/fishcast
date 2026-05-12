import { useState } from 'react';
import { FC } from '../theme.js';
import FCLogo from './FCLogo.jsx';

const NAV_MAIN = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="9" y="1" width="6" height="3" rx="1.5" fill="currentColor" opacity=".6"/>
        <rect x="9" y="6" width="6" height="3" rx="1.5" fill="currentColor" opacity=".4"/>
        <rect x="1" y="9" width="14" height="6" rx="1.5" fill="currentColor" opacity=".3"/>
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Données',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10.5V3.5M8 3.5L5.5 6M8 3.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.5 11.5V13a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'analysis',
    label: 'Analyse',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 11.5L5 7.5L8 10L11 5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'forecast',
    label: 'Prévision',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3.2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'recommend',
    label: 'Recommandations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.6 4.8L13.5 5.4L10.75 8.1L11.45 12L8 10.2L4.55 12L5.25 8.1L2.5 5.4L6.4 4.8L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const NAV_SECONDARY = [
  {
    id: 'landing',
    label: 'Page d\'accueil',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 7L8 2L14 7V14a.5.5 0 01-.5.5h-4V10H6.5v4.5h-4A.5.5 0 012 14V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'signin',
    label: 'Déconnexion',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    danger: true,
  },
];

function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active;

  const bg = isActive
    ? 'rgba(61,217,214,0.12)'
    : hovered
    ? 'rgba(255,255,255,0.05)'
    : 'transparent';

  const color = isActive
    ? FC.aquaGlow
    : item.danger
    ? hovered ? '#FF6B6B' : 'rgba(255,100,100,0.5)'
    : hovered
    ? 'rgba(255,255,255,0.8)'
    : 'rgba(255,255,255,0.45)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', border: 'none', borderRadius: 7,
        background: bg,
        color,
        fontFamily: FC.sans, fontSize: 13, fontWeight: isActive ? 600 : 400,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        borderLeft: `2px solid ${isActive ? FC.aqua : 'transparent'}`,
        transition: 'all 0.15s',
      }}
    >
      <span style={{ flexShrink: 0 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {isActive && (
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: FC.aqua, flexShrink: 0 }} />
      )}
    </button>
  );
}


export function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: 'linear-gradient(180deg, #07152A 0%, #091C35 50%, #071629 100%)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(61,217,214,0.08)',
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <FCLogo color={FC.paper} size={22} />
        <div style={{
          marginTop: 6, fontFamily: FC.mono, fontSize: 9,
          color: 'rgba(255,255,255,0.18)', letterSpacing: '0.22em', textTransform: 'uppercase',
        }}>
          Gestion halieutique IA
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ padding: '12px 10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>
          Navigation
        </div>
        {NAV_MAIN.map(n => (
          <NavItem key={n.id} item={n} active={page === n.id} onClick={() => setPage(n.id)} />
        ))}
      </nav>

      {/* Divider */}
      <div style={{ margin: '8px 18px', height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Secondary nav */}
      <nav style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>
          Espace
        </div>
        {NAV_SECONDARY.map(n => (
          <NavItem key={n.id} item={n} active={page === n.id} onClick={() => setPage(n.id)} />
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="fc-live-dot" />
          <span style={{ fontFamily: FC.mono, fontSize: 10, color: FC.neon, letterSpacing: '0.1em' }}>
            Données en direct
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 11px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${FC.eco500}, ${FC.aqua})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FC.sans, fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            SL
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Shekinah Lukwichi
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: FC.mono }}>
              Administrateur
            </div>
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
      padding: '0 32px', borderBottom: `1px solid ${FC.rule}`,
      background: 'rgba(250,247,239,0.96)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink50, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
            {sub}
          </div>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </header>
  );
}

export default function Shell({ page, setPage, title, sub, actions, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: FC.paper }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ marginLeft: 232, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} sub={sub} actions={actions} />
        <main style={{ flex: 1, padding: '28px 32px', minHeight: 0 }}>{children}</main>
      </div>
    </div>
  );
}
