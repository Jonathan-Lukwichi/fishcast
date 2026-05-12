import { useState, useMemo } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import WorldMap from '../components/WorldMap.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';
import { useForecast } from '../context/ForecastContext.jsx';

// ── Static fallback recommendations (used when no forecast has been run) ──
const STATIC_RECS = [
  {
    id: 'R01', priority: 'critical', category: 'Fermeture de zone',
    title: 'Fermeture saisonnière — Zone 34.1.2',
    species: 'Sardina pilchardus', zone: 'MAR', date: '12 mai 2026',
    desc: 'Le stock de sardines dans la zone Sahara présente un indice de surexploitation de 1.28. Fermeture recommandée pour Juin–Août 2026.',
    impact: 'Réduction de 40% de la pression de pêche. Recouvrement estimé à 18 mois. Économie nette projetée : +12 400 tonnes sur 2 ans.',
    actions: ['Interdire la pêche industrielle J+15', 'Maintenir la pêche artisanale < 2 t/j', 'Réévaluation dans 90 jours'],
    badges: ['Urgent', 'Zone FAO 34.1.2'],
    source: 'marine',
  },
  {
    id: 'R02', priority: 'warning', category: 'Réduction de quota',
    title: 'Réduction quota maquereau — 25%',
    species: 'Scomber scombrus', zone: 'MRT', date: '10 mai 2026',
    desc: 'La tendance des débarquements de maquereau est en hausse de 18% au-dessus du quota annuel autorisé.',
    impact: 'Maintien du stock dans les limites biologiques pour les 3 prochaines années.',
    actions: ['Abaisser le quota de 28 600 à 21 450 tonnes', 'Augmenter la fréquence des contrôles en mer'],
    badges: ['Recommandé', 'Zone FAO 34.1.1'],
    source: 'marine',
  },
  {
    id: 'R03', priority: 'healthy', category: 'Opportunité',
    title: 'Extension de saison — Octopus vulgaris',
    species: 'Octopus vulgaris', zone: 'MOZ', date: '8 mai 2026',
    desc: 'Le stock de poulpe montre des signes de reconstitution exceptionnelle avec une biomasse en hausse de 22%.',
    impact: '+8 200 tonnes potentielles de débarquements supplémentaires.',
    actions: ['Prolonger la saison du 15 Juin au 15 Juillet', 'Limiter les prises nocturnes'],
    badges: ['Opportunité', 'Zone FAO 51.7'],
    source: 'marine',
  },
  {
    id: 'R04', priority: 'warning', category: 'Surveillance',
    title: 'Mise en surveillance — Thon rouge',
    species: 'Thunnus thynnus', zone: 'ZAF', date: '5 mai 2026',
    desc: 'Migration atypique vers des eaux plus profondes, liée à la hausse thermique de 0.8°C. Suivi renforcé requis.',
    impact: 'Risque de sous-quota Q2 et concentration des bateaux en Q3–Q4.',
    actions: ['Activer le suivi satellite mensuel', 'Partager les données avec ICCAT'],
    badges: ['Surveillance', 'Données satellite'],
    source: 'marine',
  },
];

// ── Generate recommendations from a live forecast result ──
function generateFromForecast(fc) {
  if (!fc) return null;
  const { source, sourceLabel, species, zone, nextMonthPct, nextMonthDiff,
          nextMonthLabel, finalFc, totalPct, tableRows, baseVal } = fc;
  const pct = parseFloat(nextMonthPct);
  const fmt = n => Math.round(n).toLocaleString('fr-FR');

  const recs = [];

  // R1: next-month action based on trend
  if (pct > 3) {
    recs.push({
      id: 'GEN-01', priority: 'healthy', category: 'Opportunité de pêche',
      title: `Ouverture de pêche recommandée — ${nextMonthLabel}`,
      species, zone: sourceLabel, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
      desc: `La prévision IA indique une hausse de +${pct}% de la biomasse de ${species.split(' ')[0]} en ${nextMonthLabel} sur la zone ${zone}. Conditions favorables pour une ouverture de pêche.`,
      impact: `Surplus prévu : +${fmt(nextMonthDiff)} tonnes. Quota recommandé : ${fmt(nextMonthDiff * 0.42)} t (40% du surplus pour préserver les stocks).`,
      actions: [
        `Ouvrir la pêche dès le 1er ${nextMonthLabel}`,
        `Quota indicatif : ${fmt(nextMonthDiff * 0.42)} tonnes`,
        'Surveillance hebdomadaire des débarquements',
        'Réévaluation au bout de 30 jours',
      ],
      badges: ['Opportunité', zone, nextMonthLabel],
      source,
    });
  } else if (pct < -2) {
    recs.push({
      id: 'GEN-01', priority: 'critical', category: 'Alerte — Baisse prévue',
      title: `Réduction de pêche urgente — ${nextMonthLabel}`,
      species, zone: sourceLabel, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
      desc: `La prévision IA détecte une baisse de ${Math.abs(pct)}% de la biomasse de ${species.split(' ')[0]} en ${nextMonthLabel}. Action préventive requise.`,
      impact: `Perte estimée : ${fmt(Math.abs(nextMonthDiff))} tonnes. Réduire la pression de pêche immédiatement pour éviter la surexploitation.`,
      actions: [
        `Réduire les quotas de ${Math.min(35, Math.round(Math.abs(pct) * 3))}% en ${nextMonthLabel}`,
        'Interdire la pêche industrielle nocturne',
        'Activer le suivi satellite hebdomadaire',
        'Réévaluation dans 45 jours',
      ],
      badges: ['Urgent', zone, nextMonthLabel],
      source,
    });
  } else {
    recs.push({
      id: 'GEN-01', priority: 'warning', category: 'Quota stable',
      title: `Maintien des quotas — ${nextMonthLabel}`,
      species, zone: sourceLabel, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
      desc: `La prévision IA indique une variation modérée de +${pct}% pour ${species.split(' ')[0]} en ${nextMonthLabel}. Maintien des quotas actuels recommandé.`,
      impact: `Variation estimée : ${pct >= 0 ? '+' : ''}${fmt(nextMonthDiff)} tonnes. Stabilité du stock confirmée à court terme.`,
      actions: [
        'Maintenir les quotas actuels',
        'Renforcer les contrôles en mer',
        `Surveiller la biomasse hebdomadairement en ${nextMonthLabel}`,
      ],
      badges: ['Vigilance', zone, nextMonthLabel],
      source,
    });
  }

  // R2: horizon recommendation based on tableRows
  if (tableRows?.length >= 2) {
    const lastRow = tableRows[tableRows.length - 1];
    const longTermPct = parseFloat(totalPct);
    if (longTermPct > 8) {
      recs.push({
        id: 'GEN-02', priority: 'healthy', category: 'Stratégie saisonnière',
        title: `Planification saisonnière — ${sourceLabel}`,
        species, zone: sourceLabel, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
        desc: `Sur l'horizon de prévision (${fc.horizon} mois), le modèle IA projette une croissance totale de +${longTermPct}% atteignant ${fmt(finalFc)} tonnes à ${lastRow[0]}. La tendance soutient une stratégie de pêche progressive.`,
        impact: `Potentiel cumulé : +${fmt(finalFc - baseVal)} tonnes sur la période. Revenus additionnels estimés à partir des données de marché régionales.`,
        actions: [
          `Allouer les permis saisonniers jusqu'en ${lastRow[0]}`,
          `Fixer le quota annuel à ${fmt(finalFc * 0.38)} tonnes (38% de la biomasse estimée)`,
          'Réviser les accès de pêche à chaque trimestre',
          'Partager les prévisions avec les coopératives locales',
        ],
        badges: ['Stratégique', sourceLabel, `Horizon ${fc.horizon}m`],
        source,
      });
    }
  }

  // R3: zone-specific conservation
  const isStressed = pct < 5 || source === 'marine';
  recs.push({
    id: 'GEN-03', priority: isStressed ? 'warning' : 'healthy',
    category: isStressed ? 'Mesure de conservation' : 'Bonne pratique',
    title: `${isStressed ? 'Surveillance renforcée' : 'Bonne santé confirmée'} — ${species.split(' ')[0]}`,
    species, zone: sourceLabel, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
    desc: isStressed
      ? `Le modèle IA recommande une surveillance renforcée de ${species.split(' ')[0]} dans la zone ${zone}. Les indicateurs de pression sont à surveiller de près sur les prochaines semaines.`
      : `L'état du stock de ${species.split(' ')[0]} dans la zone ${zone} est confirmé sain par le modèle IA. Maintien des bonnes pratiques actuelles recommandé.`,
    impact: isStressed
      ? 'Risque modéré de surexploitation si la tendance se poursuit sans intervention.'
      : 'Reconstitution naturelle en cours. Conditions idéales pour une gestion durable à long terme.',
    actions: isStressed
      ? ['Déployer observateurs en mer', 'Limiter les sorties nocturnes', `Rapport mensuel pour la zone ${zone}`]
      : ['Maintenir les restrictions actuelles', 'Documenter les bonnes pratiques', 'Partager le rapport avec la FAO'],
    badges: [isStressed ? 'Vigilance' : 'Durable', zone],
    source,
  });

  return recs;
}

// ── Styles ──
const PS = {
  critical: { bg: `${FC.coral}12`, border: `${FC.coral}40`, color: FC.coral,  label: 'Critique',    dot: FC.coral },
  warning:  { bg: `${FC.amber}12`, border: `${FC.amber}40`, color: FC.amber,   label: 'Vigilance',   dot: FC.amber },
  healthy:  { bg: `${FC.eco500}10`,border: `${FC.eco300}60`,color: FC.eco700,  label: 'Opportunité', dot: FC.eco500 },
};

function PriorityIcon({ priority, size = 20 }) {
  const c = { critical: FC.coral, warning: FC.amber, healthy: FC.eco500 }[priority];
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
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>FishCast — ${rec.title}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,serif;max-width:740px;margin:48px auto;color:#1a2332;background:#fff}.logo-row{display:flex;align-items:center;gap:10px;margin-bottom:28px}.logo-text{font-size:20px;font-weight:700;color:#0d3d2b}.header{border-bottom:2px solid #1a4d2e;padding-bottom:22px;margin-bottom:28px}h1{font-size:22px;font-weight:700;line-height:1.2;margin:10px 0 6px}.badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-family:monospace;font-weight:600;${priorityCSS}}.meta{font-size:12px;color:#667;font-family:monospace;margin-top:8px}.section{margin:22px 0}.section-title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px;font-family:monospace}.desc{font-size:13.5px;line-height:1.8;color:#334}.impact-box{background:#f0fdf4;border:1px solid #86efac;padding:14px 18px;border-radius:8px}.action-row{display:flex;gap:12px;padding:10px 14px;background:#f8f9fb;border-radius:6px;margin:6px 0;border:1px solid #e9ecef}.action-num{font-family:monospace;font-weight:700;color:#1a4d2e;font-size:12px;flex-shrink:0;padding-top:1px}.tag{padding:3px 10px;border-radius:999px;border:1px solid #d0d5dd;font-size:11px;font-family:monospace;color:#555;margin-right:6px}.footer{margin-top:48px;padding-top:18px;border-top:1px solid #e0e0e0;font-size:10px;color:#aaa;font-family:monospace;display:flex;justify-content:space-between}@page{margin:20mm}</style></head><body>
<div class="logo-row"><div style="width:8px;height:8px;border-radius:50%;background:#2a9d6f"></div><div class="logo-text">FishCast</div><span style="font-size:11px;color:#aaa;font-family:monospace;margin-left:8px">Rapport de recommandation</span></div>
<div class="header"><span class="badge">${ps.label}</span><h1>${rec.title}</h1><div class="meta">${rec.category} · ${rec.species} · Généré le ${new Date().toLocaleDateString('fr-FR')}</div></div>
<div class="section"><div class="section-title">Description</div><div class="desc">${rec.desc}</div></div>
<div class="section"><div class="section-title">Impact attendu</div><div class="impact-box desc">${rec.impact}</div></div>
<div class="section"><div class="section-title">Actions recommandées</div>${rec.actions.map((a,i)=>`<div class="action-row"><span class="action-num">${String(i+1).padStart(2,'0')}</span><span class="desc">${a}</span></div>`).join('')}</div>
<div class="section"><div class="section-title">Étiquettes</div>${rec.badges.map(b=>`<span class="tag">${b}</span>`).join('')}</div>
<div class="footer"><span>FishCast · FAO / COPEMED / INRH</span><span>Réf : ${rec.id} · ${rec.date}</span></div>
</body></html>`;
  const w = window.open('', '_blank', 'width=860,height=700');
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
}

export default function Recommend({ page, setPage }) {
  const { isMobile } = useBreakpoint();
  const { lastForecast } = useForecast() ?? {};

  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('all');
  const [approved, setApproved]   = useState(new Set());
  const [approving, setApproving] = useState(null);

  // Build recommendations: from forecast if available, else static
  const recs = useMemo(() => {
    const generated = generateFromForecast(lastForecast);
    if (generated && generated.length > 0) return generated;
    return STATIC_RECS;
  }, [lastForecast]);

  // Auto-select first rec when list changes
  const firstId = recs[0]?.id;
  const selId   = selected && recs.find(r => r.id === selected) ? selected : firstId;
  const rec     = recs.find(r => r.id === selId);

  const visible = filter === 'all' ? recs : recs.filter(r => r.priority === filter);

  const mapHL = lastForecast?.mapHighlights ?? {};
  STATIC_RECS.forEach(r => { if (!mapHL[r.zone]) mapHL[r.zone] = { status: r.priority }; });

  const counts = {
    all:      recs.length,
    critical: recs.filter(r => r.priority === 'critical').length,
    warning:  recs.filter(r => r.priority === 'warning').length,
    healthy:  recs.filter(r => r.priority === 'healthy').length,
  };

  const handleApprove = (id) => {
    if (approved.has(id)) return;
    setApproving(id);
    setTimeout(() => { setApproved(prev => new Set([...prev, id])); setApproving(null); }, 900);
  };

  const isApproved  = rec && approved.has(rec.id);
  const isApproving = rec && approving === rec.id;

  const isFromForecast = lastForecast && recs[0]?.id?.startsWith('GEN-');

  return (
    <Shell page={page} setPage={setPage}
      title="Recommandations"
      sub={`${recs.length} recommandations · ${isFromForecast ? `Basées sur la prévision: ${lastForecast.species?.split(' ')[0]} · ${lastForecast.zone}` : 'Données générales'}`}
    >
      <div style={{ maxWidth: 1060, margin: '0 auto' }} className="fc-animate-in">

        {/* Forecast context banner */}
        {isFromForecast && (
          <div style={{
            marginBottom: 20, padding: '12px 18px',
            background: `linear-gradient(135deg, ${FC.navy800}18, ${FC.navy900}10)`,
            border: `1px solid ${FC.navy600}40`, borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: FC.aqua, flexShrink: 0 }}
              className="fc-live-dot" />
            <div style={{ flex: 1, minWidth: 200 }}>
              <span style={{ fontSize: 11, color: FC.aqua, fontFamily: FC.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Recommandations générées par IA
              </span>
              <span style={{ fontSize: 12, color: FC.ink70, marginLeft: 12 }}>
                Source : {lastForecast.sourceLabel} · {lastForecast.species?.split(' ')[0]} · Zone {lastForecast.zone} · Horizon {lastForecast.horizon} mois
              </span>
            </div>
            <button onClick={() => setPage('forecast')} style={{
              padding: '6px 14px', border: `1px solid ${FC.navy600}`, borderRadius: 999,
              background: 'none', cursor: 'pointer', fontSize: 12, color: FC.navy700,
              fontFamily: FC.sans, fontWeight: 500,
            }}>
              Voir la prévision →
            </button>
          </div>
        )}

        {!isFromForecast && (
          <div style={{
            marginBottom: 20, padding: '12px 18px',
            background: `${FC.amber}08`, border: `1px solid ${FC.amber}30`, borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, color: FC.amber }}>
              💡 Lancez une prévision pour obtenir des recommandations personnalisées par espèce et zone.
            </span>
            <button onClick={() => setPage('forecast')} style={{
              padding: '6px 14px', border: `1px solid ${FC.amber}40`, borderRadius: 999,
              background: `${FC.amber}10`, cursor: 'pointer', fontSize: 12, color: FC.amber,
              fontFamily: FC.sans, fontWeight: 600,
            }}>
              Aller à la prévision →
            </button>
          </div>
        )}

        {/* Summary strip */}
        <div className="fc-kpi-grid" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', marginBottom: 24 }}>
          {[
            { label: 'Actions critiques', val: counts.critical, color: FC.coral },
            { label: 'En vigilance',      val: counts.warning,  color: FC.amber },
            { label: 'Opportunités',      val: counts.healthy,  color: FC.eco500 },
          ].map(k => (
            <div key={k.label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                const active = selId === r.id;
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
              <div className="fc-eyebrow" style={{ marginBottom: 14 }}>
                {isFromForecast ? `Carte — ${lastForecast.sourceLabel}` : 'Carte des recommandations'}
              </div>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => handleApprove(rec.id)} disabled={isApproved || isApproving}
                      style={{
                        width: '100%', padding: '12px', fontSize: 13, border: 'none', borderRadius: 7,
                        cursor: isApproved ? 'default' : 'pointer', fontFamily: FC.sans, fontWeight: 600,
                        background: isApproved ? `linear-gradient(135deg, ${FC.eco700}, ${FC.eco500})` : `linear-gradient(135deg, ${FC.eco500}, ${FC.eco700})`,
                        color: '#fff', opacity: isApproving ? 0.8 : 1, transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                      {isApproving ? (
                        <><span className="fc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Approbation…</>
                      ) : isApproved ? (
                        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Recommandation approuvée</>
                      ) : 'Approuver la recommandation ✓'}
                    </button>
                    <button onClick={() => exportToPDF(rec)}
                      onMouseEnter={e => { e.currentTarget.style.background = FC.paper; e.currentTarget.style.borderColor = FC.navy600; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = FC.rule; }}
                      style={{
                        width: '100%', padding: '12px', fontSize: 13, border: `1px solid ${FC.rule}`, borderRadius: 7,
                        background: '#fff', cursor: 'pointer', fontFamily: FC.sans, color: FC.ink70, fontWeight: 500,
                        transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
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
