import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import WorldMap from '../components/WorldMap.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';

const RECS = [
  {
    id: 'R01', priority: 'critical', category: 'Fermeture de zone',
    title: 'Fermeture saisonnière — Zone 34.1.2',
    species: 'Sardina pilchardus', zone: 'MAR', date: '12 mai 2026',
    desc: 'Le stock de sardines dans la zone Sahara présente un indice de surexploitation de 1.28. Fermeture recommandée pour Juin–Août 2026 afin de permettre la reconstitution du stock.',
    impact: 'Réduction de 40% de la pression de pêche. Recouvrement estimé à 18 mois. Économie nette projetée : +12 400 tonnes sur 2 ans.',
    actions: ['Interdire la pêche industrielle J+15', 'Maintenir la pêche artisanale < 2 t/j', 'Réévaluation dans 90 jours'],
    badges: ['Urgent', 'Zone FAO 34.1.2'],
  },
  {
    id: 'R02', priority: 'warning', category: 'Réduction de quota',
    title: 'Réduction quota maquereau — 25%',
    species: 'Scomber scombrus', zone: 'MRT', date: '10 mai 2026',
    desc: 'La tendance des débarquements de maquereau est en hausse de 18% au-dessus du quota annuel autorisé. Une réduction préventive éviterait une situation critique en Q3 2026.',
    impact: 'Maintien du stock dans les limites biologiques pour les 3 prochaines années.',
    actions: ['Abaisser le quota de 28 600 à 21 450 tonnes', 'Augmenter la fréquence des contrôles en mer'],
    badges: ['Recommandé', 'Zone FAO 34.1.1'],
  },
  {
    id: 'R03', priority: 'healthy', category: 'Opportunité',
    title: 'Extension de saison — Octopus vulgaris',
    species: 'Octopus vulgaris', zone: 'MOZ', date: '8 mai 2026',
    desc: 'Le stock de poulpe montre des signes de reconstitution exceptionnelle avec une biomasse en hausse de 22%. Extension de 30 jours biologiquement soutenable.',
    impact: '+8 200 tonnes potentielles de débarquements supplémentaires pour la filière.',
    actions: ['Prolonger la saison du 15 Juin au 15 Juillet', 'Limiter les prises nocturnes'],
    badges: ['Opportunité', 'Zone FAO 51.7'],
  },
  {
    id: 'R04', priority: 'warning', category: 'Surveillance',
    title: 'Mise en surveillance — Thon rouge',
    species: 'Thunnus thynnus', zone: 'ZAF', date: '5 mai 2026',
    desc: 'Migration atypique des populations de thon rouge vers des eaux plus profondes, potentiellement liée à la hausse thermique de 0.8°C enregistrée. Suivi renforcé requis.',
    impact: 'Risque de sous-quota Q2 et concentration des bateaux en Q3–Q4.',
    actions: ['Activer le suivi satellite mensuel', 'Partager les données avec ICCAT'],
    badges: ['Surveillance', 'Données satellite'],
  },
];

const PS = {
  critical: { bg: `${FC.coral}12`, border: `${FC.coral}40`, color: FC.coral, label: 'Critique',    dot: FC.coral },
  warning:  { bg: `${FC.amber}12`, border: `${FC.amber}40`, color: FC.amber,  label: 'Vigilance',   dot: FC.amber },
  healthy:  { bg: `${FC.eco500}10`,border: `${FC.eco300}60`,color: FC.eco700, label: 'Opportunité', dot: FC.eco500 },
};

function PriorityIcon({ priority, size = 20 }) {
  const colors = { critical: FC.coral, warning: FC.amber, healthy: FC.eco500 };
  const c = colors[priority];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${c}20`, border: `1.5px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: size * 0.35, height: size * 0.35, borderRadius: '50%', background: c }} />
    </div>
  );
}

function exportToPDF(rec) {
  const ps = PS[rec.priority];
  const priorityCSS = rec.priority === 'critical'
    ? 'background:#fee2e2;color:#dc2626;'
    : rec.priority === 'warning'
    ? 'background:#fef3c7;color:#d97706;'
    : 'background:#d1fae5;color:#065f46;';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>FishCast — ${rec.title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; max-width: 740px; margin: 48px auto; color: #1a2332; background: #fff; }
  .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .logo-text { font-size: 20px; font-weight: 700; color: #0d3d2b; letter-spacing: -0.02em; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #2a9d6f; }
  .header { border-bottom: 2px solid #1a4d2e; padding-bottom: 22px; margin-bottom: 28px; }
  h1 { font-size: 22px; font-weight: 700; line-height: 1.2; margin: 10px 0 6px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-family: monospace; font-weight: 600; ${priorityCSS} }
  .meta { font-size: 12px; color: #667; font-family: monospace; margin-top: 8px; }
  .section { margin: 22px 0; }
  .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 10px; font-family: monospace; }
  .desc { font-size: 13.5px; line-height: 1.8; color: #334; }
  .impact-box { background: #f0fdf4; border: 1px solid #86efac; padding: 14px 18px; border-radius: 8px; }
  .actions { margin-top: 4px; }
  .action-row { display: flex; gap: 12px; padding: 10px 14px; background: #f8f9fb; border-radius: 6px; margin: 6px 0; border: 1px solid #e9ecef; }
  .action-num { font-family: monospace; font-weight: 700; color: #1a4d2e; font-size: 12px; flex-shrink: 0; padding-top: 1px; }
  .action-text { font-size: 13px; color: #445; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .tag { padding: 3px 10px; border-radius: 999px; border: 1px solid #d0d5dd; font-size: 11px; font-family: monospace; color: #555; }
  .footer { margin-top: 48px; padding-top: 18px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #aaa; font-family: monospace; display: flex; justify-content: space-between; }
  @page { margin: 20mm; }
</style>
</head>
<body>
<div class="logo-row">
  <div class="logo-dot"></div>
  <div class="logo-text">FishCast</div>
  <span style="font-size:11px;color:#aaa;font-family:monospace;margin-left:8px;">Rapport de recommandation</span>
</div>
<div class="header">
  <span class="badge">${ps.label}</span>
  <h1>${rec.title}</h1>
  <div class="meta">${rec.category} &nbsp;·&nbsp; ${rec.species} &nbsp;·&nbsp; Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
</div>
<div class="section">
  <div class="section-title">Description de la situation</div>
  <div class="desc">${rec.desc}</div>
</div>
<div class="section">
  <div class="section-title">Impact attendu</div>
  <div class="impact-box desc">${rec.impact}</div>
</div>
<div class="section">
  <div class="section-title">Actions recommandées</div>
  <div class="actions">
    ${rec.actions.map((a, i) => `
    <div class="action-row">
      <span class="action-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="action-text">${a}</span>
    </div>`).join('')}
  </div>
</div>
<div class="section">
  <div class="section-title">Étiquettes</div>
  <div class="tags">${rec.badges.map(b => `<span class="tag">${b}</span>`).join('')}</div>
</div>
<div class="footer">
  <span>FishCast · Données FAO / COPEMED / INRH</span>
  <span>Réf : ${rec.id} · ${rec.date}</span>
</div>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=860,height=700');
  if (w) {
    w.document.write(html);
    w.document.close();
    // Small delay to let the page render before printing
    setTimeout(() => w.print(), 400);
  }
}

export default function Recommend({ page, setPage }) {
  const { isMobile } = useBreakpoint();
  const [selected, setSelected]   = useState('R01');
  const [filter, setFilter]       = useState('all');
  const [approved, setApproved]   = useState(new Set());
  const [approving, setApproving] = useState(null);

  const visible = filter === 'all' ? RECS : RECS.filter(r => r.priority === filter);
  const rec     = RECS.find(r => r.id === selected);

  const mapHL = {};
  RECS.forEach(r => { mapHL[r.zone] = { status: r.priority, intensity: r.priority === 'critical' ? 0.95 : 0.6 }; });

  const counts = {
    all:      RECS.length,
    critical: RECS.filter(r => r.priority === 'critical').length,
    warning:  RECS.filter(r => r.priority === 'warning').length,
    healthy:  RECS.filter(r => r.priority === 'healthy').length,
  };

  const handleApprove = (id) => {
    if (approved.has(id)) return;
    setApproving(id);
    setTimeout(() => {
      setApproved(prev => new Set([...prev, id]));
      setApproving(null);
    }, 900);
  };

  const isApproved  = rec && approved.has(rec.id);
  const isApproving = rec && approving === rec.id;

  return (
    <Shell page={page} setPage={setPage}
      title="Recommandations"
      sub={`${RECS.length} recommandations actives · Mise à jour quotidienne`}
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }} className="fc-animate-in">

        {/* Summary strip */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', marginBottom: 24 }}>
          {[
            { label: 'Actions critiques', val: counts.critical, color: FC.coral },
            { label: 'En vigilance',      val: counts.warning,  color: FC.amber },
            { label: 'Opportunités',      val: counts.healthy,  color: FC.eco500 },
          ].map(k => (
            <div key={k.label} style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: k.color }} />
              </div>
              <div>
                <div style={{ fontFamily: FC.serif, fontSize: 26, fontWeight: 700, color: FC.ink, letterSpacing: '-0.02em' }}>{k.val}</div>
                <div style={{ fontSize: 12, color: FC.ink50 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 24 }}>

          {/* Left: list */}
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['all','Toutes'],['critical','Critiques'],['warning','Vigilance'],['healthy','Opportunités']].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{
                  padding: '6px 14px', border: `1px solid ${filter === v ? FC.navy800 : FC.rule}`,
                  borderRadius: 999, fontSize: 12, fontFamily: FC.sans, cursor: 'pointer',
                  background: filter === v ? FC.navy800 : '#fff',
                  color: filter === v ? '#fff' : FC.ink70,
                  fontWeight: filter === v ? 600 : 400, transition: 'all 0.15s',
                }}>
                  {l} <span style={{ opacity: 0.6 }}>({counts[v]})</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visible.map(r => {
                const ps = PS[r.priority];
                const active = selected === r.id;
                const done   = approved.has(r.id);
                return (
                  <div key={r.id} onClick={() => setSelected(r.id)} className="fc-card"
                    style={{
                      padding: '16px 18px', cursor: 'pointer',
                      borderLeft: `3px solid ${active ? ps.color : done ? FC.eco500 : 'transparent'}`,
                      background: active ? ps.bg : done ? `${FC.eco500}08` : '#fff',
                      boxShadow: active ? '0 2px 12px rgba(8,23,46,0.08)' : undefined,
                    }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <PriorityIcon priority={r.priority} size={22} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, fontFamily: FC.mono, fontWeight: 600 }}>
                            {ps.label}
                          </span>
                          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: FC.paperDeep, color: FC.ink50, border: `1px solid ${FC.rule}`, fontFamily: FC.mono }}>
                            {r.category}
                          </span>
                          {done && (
                            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: `${FC.eco500}18`, color: FC.eco700, border: `1px solid ${FC.eco300}`, fontFamily: FC.mono, fontWeight: 600 }}>
                              ✓ Approuvé
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: FC.serif, fontSize: 15, fontWeight: 600, color: FC.ink, letterSpacing: '-0.01em', marginBottom: 2 }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: FC.ink50, fontStyle: 'italic' }}>{r.species}</div>
                      </div>
                      <div style={{ fontSize: 10, color: FC.ink30, fontFamily: FC.mono, flexShrink: 0 }}>{r.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fc-card" style={{ marginTop: 20, padding: '18px 20px' }}>
              <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Carte des recommandations</div>
              <WorldMap highlights={mapHL} mode="constellation" width={600} height={230} showLegend />
            </div>
          </div>

          {/* Right: detail panel */}
          {rec && (() => {
            const ps = PS[rec.priority];
            return (
              <div className="fc-slide-in">
                <div className="fc-grad-border" style={{ background: '#fff', borderRadius: 8, padding: '24px', position: 'sticky', top: 74 }}>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                    <PriorityIcon priority={rec.priority} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, fontFamily: FC.mono, fontWeight: 600 }}>
                          {ps.label}
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: FC.paperDeep, color: FC.ink50, border: `1px solid ${FC.rule}`, fontFamily: FC.mono }}>
                          {rec.category}
                        </span>
                      </div>
                      <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 700, color: FC.ink, lineHeight: 1.25 }}>{rec.title}</div>
                      <div style={{ fontSize: 12, color: FC.ink50, fontStyle: 'italic', marginTop: 3 }}>{rec.species}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: `1px solid ${FC.rule}`, margin: '0 0 16px' }} />

                  <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.75, marginBottom: 16 }}>{rec.desc}</div>

                  <div style={{ padding: '12px 14px', borderRadius: 8, background: ps.bg, border: `1px solid ${ps.border}`, marginBottom: 18 }}>
                    <div style={{ fontSize: 10, color: ps.color, fontFamily: FC.mono, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Impact attendu</div>
                    <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.6 }}>{rec.impact}</div>
                  </div>

                  <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Actions recommandées</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {rec.actions.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: FC.paper, borderRadius: 7, border: `1px solid ${FC.rule}` }}>
                        <span style={{ fontFamily: FC.mono, fontSize: 11, color: ps.color, fontWeight: 700, flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                        <span style={{ fontSize: 13, color: FC.ink70 }}>{a}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                    {rec.badges.map(b => (
                      <span key={b} style={{ padding: '3px 10px', borderRadius: 999, border: `1px solid ${FC.rule}`, fontSize: 11, color: FC.ink70, fontFamily: FC.mono, background: FC.paper }}>
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={() => handleApprove(rec.id)}
                      disabled={isApproved || isApproving}
                      style={{
                        width: '100%', padding: '12px', fontSize: 13,
                        border: 'none', borderRadius: 7, cursor: isApproved ? 'default' : 'pointer',
                        fontFamily: FC.sans, fontWeight: 600,
                        background: isApproved
                          ? `linear-gradient(135deg, ${FC.eco700}, ${FC.eco500})`
                          : `linear-gradient(135deg, ${FC.eco500}, ${FC.eco700})`,
                        color: '#fff',
                        opacity: isApproving ? 0.8 : 1,
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {isApproving ? (
                        <>
                          <span className="fc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                          Approbation en cours…
                        </>
                      ) : isApproved ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Recommandation approuvée
                        </>
                      ) : (
                        'Approuver la recommandation ✓'
                      )}
                    </button>

                    <button
                      onClick={() => exportToPDF(rec)}
                      style={{
                        width: '100%', padding: '12px', fontSize: 13,
                        border: `1px solid ${FC.rule}`, borderRadius: 7,
                        background: '#fff', cursor: 'pointer',
                        fontFamily: FC.sans, color: FC.ink70, fontWeight: 500,
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = FC.paper; e.currentTarget.style.borderColor = FC.navy600; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = FC.rule; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v8M7 9l-2.5-2.5M7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 11v1.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Exporter en PDF →
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </Shell>
  );
}
