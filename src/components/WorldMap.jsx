import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { FC } from '../theme.js';

const GEO_URL = '/world-110m.json';

// ISO numeric → alpha-3 (no leading zeros in TopoJSON IDs)
const NUM_TO_A3 = {
  '504': 'MAR', '478': 'MRT', '686': 'SEN', '384': 'CIV',
  '288': 'GHA', '566': 'NGA', '180': 'COD', '834': 'TZA',
  '508': 'MOZ', '450': 'MDG', '516': 'NAM', '710': 'ZAF',
  '24':  'AGO', '894': 'ZMB', '716': 'ZWE', '404': 'KEN',
  '231': 'ETH', '788': 'TUN', '12':  'DZA', '818': 'EGY',
  '72':  'BWA', '800': 'UGA', '646': 'RWA', '108': 'BDI',
  '548': 'VUT', '562': 'NER', '466': 'MLI', '854': 'BFA',
  '148': 'TCD', '140': 'CAF', '706': 'SOM',
  '266': 'GAB', '178': 'COG', '624': 'GNB', '324': 'GIN',
  '694': 'SLE', '430': 'LBR', '204': 'BEN', '768': 'TGO',
  '120': 'CMR', '426': 'LSO', '748': 'SWZ',
};

// [lon, lat] centroids per alpha-3
const CENTROIDS = {
  MAR: [-5.5, 32],   MRT: [-11, 20],   SEN: [-14, 14.5],
  CIV: [-5.5, 7.5],  GHA: [-1, 8],     NGA: [8, 10],
  COD: [24, -2],     TZA: [35, -6],    MOZ: [35, -18],
  MDG: [47, -20],    NAM: [18.5, -22], ZAF: [25, -29],
  AGO: [18, -12],    ZMB: [28, -14],   ZWE: [30, -20],
  KEN: [38, 0],      ETH: [40, 9],     TUN: [9, 34],
  DZA: [3, 28],      EGY: [30, 27],    BWA: [24, -22],
  UGA: [32, 1],      RWA: [30, -2],    BDI: [30, -3],
  CMR: [12, 5],      COG: [15, -1],    GAB: [12, -1],
  TCD: [18, 15],     CAF: [21, 7],     SOM: [46, 6],
};

const STATUS_COLOR = { critical: FC.coral, warning: FC.amber, healthy: FC.eco500 };

export default function WorldMap({
  width = 760, height = 380,
  highlights = {},
  mode = 'constellation',
  showLegend = true,
}) {
  const projConfig = { center: [20, 0], scale: 335 };

  if (mode === 'constellation') {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
        {/* grid overlay */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} width="100%" height="100%">
          <defs>
            <pattern id="cstl-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(94,168,211,0.07)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cstl-grid)" />
        </svg>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={projConfig}
          width={width}
          height={height}
          style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #02060F 0%, #07152A 60%, #0A1B3A 100%)' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const a3 = NUM_TO_A3[String(geo.id)];
                const h = a3 ? highlights[a3] : null;
                const accent = h ? STATUS_COLOR[h.status] ?? FC.eco500 : null;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={h ? `${accent}30` : 'rgba(15,42,80,0.7)'}
                    stroke={h ? accent : 'rgba(80,160,210,0.18)'}
                    strokeWidth={h ? 1.2 : 0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: h ? `${accent}50` : 'rgba(25,60,110,0.8)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {Object.entries(highlights).map(([a3, h]) => {
            const coords = CENTROIDS[a3];
            if (!coords) return null;
            const accent = STATUS_COLOR[h.status] ?? FC.eco500;
            return (
              <Marker key={a3} coordinates={coords}>
                {/* outer pulse */}
                <circle r={14} fill={accent} opacity={0.08}>
                  <animate attributeName="r"       values="8;20;8"        dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.28;0;0.28"   dur="2.6s" repeatCount="indefinite" />
                </circle>
                {/* mid ring */}
                <circle r={6} fill={accent} opacity={0.2} />
                {/* bright dot */}
                <circle r={3.5} fill={accent} opacity={0.85} />
                {/* white core */}
                <circle r={1.6} fill="#fff" opacity={0.95} />
              </Marker>
            );
          })}
        </ComposableMap>

        {showLegend && (
          <div style={{
            position: 'absolute', bottom: 12, left: 16, zIndex: 2,
            display: 'flex', gap: 8,
          }}>
            {[['Critique', FC.coral], ['Vigilance', FC.amber], ['Sain', FC.eco500]].map(([l, c]) => (
              <div key={l} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 999,
                background: `${c}14`, border: `1px solid ${c}40`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
                <span style={{ fontSize: 10, color: c, fontFamily: FC.mono }}>{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default editorial mode
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={projConfig}
      width={width}
      height={height}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => {
            const a3 = NUM_TO_A3[String(geo.id)];
            const h = a3 ? highlights[a3] : null;
            const accent = h ? STATUS_COLOR[h.status] ?? FC.eco500 : null;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={h ? `${accent}50` : FC.paperDeep}
                stroke={FC.rule}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover:   { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
      {Object.entries(highlights).map(([a3, h]) => {
        const coords = CENTROIDS[a3];
        if (!coords) return null;
        const accent = STATUS_COLOR[h.status] ?? FC.eco500;
        return (
          <Marker key={a3} coordinates={coords}>
            <circle r={6} fill={accent} opacity={0.9} />
            <circle r={2.5} fill="#fff" />
          </Marker>
        );
      })}
    </ComposableMap>
  );
}
