/**
 * ParkingMap Component
 * Leaflet map showing parking lot markers with availability popups.
 * Markers are color-coded by occupancy rate.
 */
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Custom marker icons based on availability
function createIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3); border: 2px solid white;
    "><span style="transform: rotate(45deg); font-size: 14px;">🅿️</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const icons = {
  high: createIcon('#10b981'),    // > 50% available — green
  medium: createIcon('#f59e0b'),  // 20-50% available — yellow
  low: createIcon('#ef4444'),     // < 20% available — red
  full: createIcon('#64748b'),    // 0 available — gray
};

function getIcon(availableSlots, totalSlots) {
  if (availableSlots === 0) return icons.full;
  const ratio = availableSlots / totalSlots;
  if (ratio > 0.5) return icons.high;
  if (ratio > 0.2) return icons.medium;
  return icons.low;
}

export default function ParkingMap({ lots, center = [28.6139, 77.2090], zoom = 11 }) {
  const navigate = useNavigate();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '16px', minHeight: '400px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {lots?.map((lot) => (
        <Marker
          key={lot._id}
          position={[lot.location.lat, lot.location.lng]}
          icon={getIcon(lot.availableSlots, lot.totalSlots)}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#f1f5f9' }}>{lot.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#94a3b8' }}>📍 {lot.address}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', padding: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{lot.availableSlots}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Available</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{lot.totalSlots}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1' }}>₹{lot.currentPrice}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Per hr</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/parking/${lot._id}`)}
                style={{
                  width: '100%', padding: '8px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.85rem',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                View & Book →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
