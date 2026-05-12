import { useState } from 'react';
import { FC } from '../theme.js';
import FCLogo from './FCLogo.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';

const NAV_MAIN = [
  {
    id: 'dashboard', label: 'Tableau de bord',
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
    id: 'upload', label: 'Données',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10.5V3.5M8 3.5L5.5 6M8 3.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.5 11.5V13a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'analysis', label: 'Analyse',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 11.5L5 7.5L8 10L11 5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'forecast', label: 'Prévision',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3.2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'recommend', label: 'Recommandations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.6 4.8L13.5 5.4L10.75 8.1L11.45 12L8 10.2L4.55 12L5.25 8.1L2.5 5.4L6.4 4.8L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const NAV_SECONDARY = [
  {
    id: 'landing', label: "Page d'accueil",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 7L8 2L14 7V14a.5.5 0 01-.5.5h-4V10H6.5v4.5h-4A.5.5 0 012 14V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'signin', label: 'Déconnexion', danger: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const bg    = active ? 'rgba(61,217,214,0.12)' : hovered ? 'rgba(255,255,255,0.05)' : 'transparent';
  const color = active ? FC.aquaGlow
    : item.danger ? (hovered ? '#FF6B6B' : 'rgba(255,100,100,0.5)')
    : hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)';

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', border: 'none', borderRadius: 7,
        background: bg, color,
        fontFamily: FC.sans, fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        borderLeft: `2px solid ${active ? FC.aqua : 'transparent'}`,
        transition: 'all 0.15s',
      }}>
      <span style={{ flexShrink: 0 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: FC.aqua, flexShrink: 0 }} />}
    </button>
  );
}

function SidebarContent({ page, setPage, onClose }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: 'linear-gradient(180deg, #07152A 0%, #091C35 50%, #071629 100%)',
      display: 'flex', flexDirection: 'column', height: '100%',
      borderRight: '1px solid rgba(61,217,214,0.08)',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <FCLogo color={FC.paper} size={21} />
          <div style={{ marginTop: 5, fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Gestion halieutique IA
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', padding: 4, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ padding: '10px 10px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 10px 6px' }}>
          Navigation
        </div>
        {NAV_MAIN.map(n => (
          <NavItem key={n.id} item={n} active={page === n.id} onClick={() => { setPage(n.id); onClose?.(); }} />
        ))}
      </nav>

      <div style={{ margin: '8px 16px', height: 1, background: 'rgba(255,255,255,0.06)' }} />

      <nav style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FC.mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 10px 6px' }}>
          Espace
        </div>
        {NAV_SECONDARY.map(n => (
          <NavItem key={n.id} item={n} active={page === n.id} onClick={() => { setPage(n.id); onClose?.(); }} />
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div style={{ padding: '12px 14px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="fc-live-dot" />
          <span style={{ fontFamily: FC.mono, fontSize: 10, color: FC.neon, letterSpacing: '0.1em' }}>
            Données en direct
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 11px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${FC.eco500}, ${FC.aqua})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FC.sans, fontSize: 11, fontWeight: 700, color: '#fff',
          }}>SL</div>
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

// Hamburger icon
function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function Topbar({ title, sub, actions, onMenuClick, showMenu }) {
  return (
    <header style={{
      height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px 0 24px', borderBottom: `1px solid ${FC.rule}`,
      background: 'rgba(250,247,239,0.96)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {showMenu && (
          <button onClick={onMenuClick} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: FC.ink70, padding: '4px 2px', display: 'flex', alignItems: 'center',
            borderRadius: 6,
          }}>
            <HamburgerIcon />
          </button>
        )}
        <div>
          <div style={{ fontFamily: FC.serif, fontSize: 17, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>
            {title}
          </div>
          {sub && (
            <div style={{ fontFamily: FC.mono, fontSize: 10, color: FC.ink50, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </header>
  );
}

export default function Shell({ page, setPage, title, sub, actions, children }) {
  const { isSmall } = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: FC.paper }}>

      {/* Desktop sidebar */}
      {!isSmall && (
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, width: 232 }}>
          <SidebarContent page={page} setPage={setPage} />
        </div>
      )}

      {/* Mobile drawer overlay */}
      {isSmall && drawerOpen && (
        <>
          <div
            className="fc-sidebar-overlay open"
            onClick={() => setDrawerOpen(false)}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, height: '100vh', width: 260,
            zIndex: 999, animation: 'fc-slide-drawer 0.25s ease',
          }}>
            <SidebarContent page={page} setPage={setPage} onClose={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{
        marginLeft: isSmall ? 0 : 232,
        flex: 1,
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
      }}>
        <Topbar
          title={title} sub={sub} actions={actions}
          showMenu={isSmall}
          onMenuClick={() => setDrawerOpen(true)}
        />
        <main style={{
          flex: 1,
          padding: isSmall ? '16px 14px' : '28px 32px',
          minHeight: 0,
          overflowX: 'hidden',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
