import { useState } from 'react';
import { FC } from '../theme.js';
import Shell from '../components/Shell.jsx';
import WorldMap from '../components/WorldMap.jsx';

const RECOMMENDATIONS = [
  {
    id: 'R01', priority: 'critical', category: 'Fermeture de zone',
    title: 'Fermeture saisonnière — Zone 34.1.2',
    species: 'Sardina pilchardus',
    desc: 'Le stock de sardines dans la zone Sahara présente un indice de surexploitation de 1.28 (seuil critique : 1.0). Recommandation de fermeture pour la période Mars–Mai 2025 afin de permettre la reconstitution du stock.',
    impact: 'Réduction de 40% de la pression de pêche. Recouvrement estimé à 18 mois.',
    actions: ['Interdire la pêche industrielle J+15', 'Maintenir la pêche artisanale < 2t/jour', 'Réévaluer dans 90 jours'],
    zone: 'MAR',
    badges: ['Urgent', 'Zone FAO 34.1.2'],
  },
  {
    id: 'R02', priority: 'warning', category: 'Réduction de quota',
    title: 'Réduction du quota maquereau de 25%',
    species: 'Scomber scombrus',
    desc: 'La tendance des débarquements de maquereau est en hausse de 18% au-dessus du quota annuel autorisé. Une réduction préventive du quota permettrait d\'éviter une situation critique en Q3 2025.',
    impact: 'Maintien du stock dans les limites biologiques de sécurité pour les 3 prochaines années.',
    actions: ['Abaisser le quota de 28 600 à 21 450 tonnes', 'Augmenter la fréquence des contrôles en mer'],
    zone: 'MRT',
    badges: ['Recommandé', 'Zone FAO 34.1.1'],
  },
  {
    id: 'R03', priority: 'healthy', category: 'Opportunité',
    title: 'Extension de la saison — Octopus vulgaris',
    species: 'Octopus vulgaris',
    desc: 'Le stock de poulpe sur les côtes du Mozambique montre des signes de reconstitution exceptionnelle avec une biomasse en hausse de 22%. Une extension de 30 jours de la saison de pêche est biologiquement soutenable.',
    impact: '+8 200 tonnes potentielles de débarquements supplémentaires pour la filière.',
    actions: ['Prolonger la saison du 15 Juin au 15 Juillet', 'Limiter les prises nocturnes'],
    zone: 'MOZ',
    badges: ['Opportunité', 'Zone FAO 51.7'],
  },
  {
    id: 'R04', priority: 'warning', category: 'Surveillance',
    title: 'Mise en surveillance — Thon rouge',
    species: 'Thunnus thynnus',
    desc: 'Les relevés satellite indiquent une migration atypique des populations de thon rouge vers des eaux plus profondes. Ce phénomène, potentiellement lié à la hausse thermique de 0.8°C enregistrée, doit être suivi de près.',
    impact: 'Risque de sous-quota en Q2 et concentration des bateaux en Q3–Q4.',
    actions: ['Activer le suivi satellite mensuel', 'Partager les données avec ICCAT'],
    zone: 'ZAF',
    badges: ['Surveillance', 'Données satellite'],
  },
];

const PRIORITY_STYLE = {
  critical: { bg: `${FC.coral}15`, border: FC.coral, color: FC.coral, label: 'Critique' },
  warning:  { bg: `${FC.amber}15`,  border: FC.amber,  color: FC.amber,  label: 'Vigilance' },
  healthy:  { bg: `${FC.eco500}12`, border: FC.eco500, color: FC.eco500, label: 'Opportunité' },
};

export default function Recommend({ page, setPage }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? RECOMMENDATIONS : RECOMMENDATIONS.filter(r => r.priority === filter);
  const rec = selected ? RECOMMENDATIONS.find(r => r.id === selected) : null;

  const mapHighlights = {};
  RECOMMENDATIONS.forEach(r => { mapHighlights[r.zone] = { status: r.priority, intensity: r.priority === 'critical' ? 0.95 : 0.6 }; });

  return (
    <Shell page={page} setPage={setPage}
      title="Recommandations"
      sub={`${RECOMMENDATIONS.length} recommandations actives · Mise à jour quotidienne`}
    >
      <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: rec ? '1fr 420px' : '1fr', gap: 24 }}>
        <div>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[['all', 'Toutes'], ['critical', 'Critiques'], ['warning', 'Vigilance'], ['healthy', 'Opportunités']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '6px 14px', border: `1px solid ${FC.rule}`,
                borderRadius: 999, fontSize: 12, fontFamily: FC.sans, cursor: 'pointer',
                background: filter === v ? FC.navy800 : '#fff',
                color: filter === v ? '#fff' : FC.ink70,
                fontWeight: filter === v ? 600 : 400,
              }}>{l}</button>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 12, color: FC.ink50, fontFamily: FC.mono, display: 'flex', alignItems: 'center' }}>
              {visible.length} résultat{visible.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Recommendation cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visible.map(r => {
              const ps = PRIORITY_STYLE[r.priority];
              const isOpen = selected === r.id;
              return (
                <div key={r.id} className="fc-card" onClick={() => setSelected(isOpen ? null : r.id)}
                  style={{
                    padding: '18px 20px', cursor: 'pointer',
                    borderLeft: `3px solid ${ps.border}`,
                    background: isOpen ? ps.bg : '#fff',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, fontFamily: FC.mono }}>
                          {ps.label}
                        </span>
                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, background: FC.paperDeep, color: FC.ink50, border: `1px solid ${FC.rule}`, fontFamily: FC.mono }}>
                          {r.category}
                        </span>
                      </div>
                      <div style={{ fontFamily: FC.serif, fontSize: 16, fontWeight: 600, color: FC.ink }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: FC.ink50, marginTop: 4, fontFamily: FC.mono, fontStyle: 'italic' }}>{r.species}</div>
                    </div>
                    <div style={{ fontSize: 10, color: FC.ink30, fontFamily: FC.mono, flexShrink: 0, marginLeft: 12 }}>{r.id}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map */}
          <div className="fc-card" style={{ marginTop: 24, padding: '18px 20px' }}>
            <div className="fc-eyebrow" style={{ marginBottom: 14 }}>Vue géographique des recommandations</div>
            <WorldMap highlights={mapHighlights} mode="constellation" width={rec ? 580 : 1000} height={260} showLegend />
          </div>
        </div>

        {rec && (() => {
          const ps = PRIORITY_STYLE[rec.priority];
          return (
            <div>
              <div className="fc-card fc-grad-border" style={{ padding: '24px 24px', position: 'sticky', top: 80 }}>
                <button onClick={() => setSelected(null)}
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: FC.ink50, fontSize: 18, lineHeight: 1 }}>
                  ×
                </button>
                <div style={{ padding: '2px 8px', display: 'inline-block', borderRadius: 999, fontSize: 10, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, fontFamily: FC.mono, marginBottom: 12 }}>
                  {ps.label}
                </div>
                <div style={{ fontFamily: FC.serif, fontSize: 18, fontWeight: 700, color: FC.ink, marginBottom: 4, lineHeight: 1.25 }}>{rec.title}</div>
                <div style={{ fontSize: 12, color: FC.ink50, fontFamily: FC.mono, fontStyle: 'italic', marginBottom: 18 }}>{rec.species}</div>

                <div style={{ fontSize: 13, color: FC.ink70, lineHeight: 1.7, marginBottom: 20 }}>{rec.desc}</div>

                <div style={{ background: ps.bg, border: `1px solid ${ps.border}`, borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: ps.color, fontFamily: FC.mono, fontWeight: 600, marginBottom: 6 }}>IMPACT ATTENDU</div>
                  <div style={{ fontSize: 13, color: FC.ink70 }}>{rec.impact}</div>
                </div>

                <div className="fc-eyebrow" style={{ marginBottom: 10 }}>Actions recommandées</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {rec.actions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: FC.ink70 }}>
                      <span style={{ color: ps.color, fontFamily: FC.mono, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                      {a}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {rec.badges.map(b => (
                    <span key={b} className="fc-tag" style={{ fontSize: 11 }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </Shell>
  );
}
