/**
 * TrafficHeatmap Component 🔥
 * NOVEL FEATURE — Renders colored circle overlays on the map
 * representing traffic congestion zones (red/yellow/green).
 * Uses react-leaflet's CircleMarker for heatmap zones.
 */
import { CircleMarker, Popup, useMap } from 'react-leaflet';

function getColor(level) {
  if (level >= 80) return '#ef4444';   // Severe — red
  if (level >= 60) return '#f97316';   // Heavy — orange
  if (level >= 40) return '#eab308';   // Moderate — yellow
  if (level >= 20) return '#22c55e';   // Light — green
  return '#10b981';                     // Free flow — teal
}

function getLabel(level) {
  if (level >= 80) return 'Severe Congestion';
  if (level >= 60) return 'Heavy Traffic';
  if (level >= 40) return 'Moderate Traffic';
  if (level >= 20) return 'Light Traffic';
  return 'Free Flow';
}

export default function TrafficHeatmap({ zones }) {
  if (!zones || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone, idx) => {
        const color = getColor(zone.congestionLevel);
        return (
          <CircleMarker
            key={zone._id || idx}
            center={[zone.location.lat, zone.location.lng]}
            radius={Math.max(20, zone.congestionLevel * 0.5)}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.25,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#f1f5f9' }}>
                  {zone.zoneName}
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: `${color}20`,
                  color: color,
                  marginBottom: '8px',
                }}>
                  {getLabel(zone.congestionLevel)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Congestion</span>
                    <span style={{ fontWeight: 700, color }}>{zone.congestionLevel}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Vehicles</span>
                    <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{zone.vehicleCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Avg Speed</span>
                    <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{zone.averageSpeed} km/h</span>
                  </div>
                </div>
                {/* Congestion bar */}
                <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', background: 'rgba(148,163,184,0.15)' }}>
                  <div style={{ height: '100%', borderRadius: '3px', width: `${zone.congestionLevel}%`, background: color, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
