/**
 * Dashboard Page
 * User dashboard with interactive map, traffic heatmap toggle,
 * parking lot cards, and nearest parking suggestion.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import api from '../api/axios';
import ParkingMap from '../components/ParkingMap';
import TrafficHeatmap from '../components/TrafficHeatmap';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const [lots, setLots] = useState([]);
  const [trafficZones, setTrafficZones] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [nearestLots, setNearestLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lotsRes, trafficRes] = await Promise.all([
        api.get('/parking/lots'),
        api.get('/traffic/heatmap'),
      ]);
      setLots(lotsRes.data);
      setTrafficZones(trafficRes.data);

      // Find nearest parking from central Delhi
      const nearRes = await api.get('/parking/nearest?lat=28.6139&lng=77.2090&limit=3');
      setNearestLots(nearRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute summary stats
  const totalSlots = lots.reduce((s, l) => s + (l.totalSlots || 0), 0);
  const availableSlots = lots.reduce((s, l) => s + (l.availableSlots || 0), 0);
  const avgOccupancy = lots.length > 0
    ? Math.round(lots.reduce((s, l) => s + (l.occupancyRate || 0), 0) / lots.length)
    : 0;

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header"><h1>Loading Dashboard...</h1></div>
        <div className="grid-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>🗺️ Parking Dashboard</h1>
        <p>Real-time parking availability and traffic conditions</p>
      </div>

      {/* Stats Row */}
      <div className="grid-4 mb-6">
        <StatsCard icon="🅿️" label="Total Lots" value={lots.length} color="#6366f1" />
        <StatsCard icon="✅" label="Available Slots" value={availableSlots} trend="up" trendValue={`${100 - avgOccupancy}%`} color="#10b981" />
        <StatsCard icon="📊" label="Avg Occupancy" value={`${avgOccupancy}%`} color="#f59e0b" />
        <StatsCard icon="🔥" label="Traffic Zones" value={trafficZones.length} color="#ef4444" />
      </div>

      {/* Map Section */}
      <div style={styles.mapSection}>
        <div style={styles.mapHeader}>
          <h2 style={styles.mapTitle}>Live Map View</h2>
          <button
            className={`btn ${showHeatmap ? 'btn-danger' : 'btn-outline'} btn-sm`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            🔥 {showHeatmap ? 'Hide' : 'Show'} Traffic Heatmap
          </button>
        </div>
        <div className="glass-card" style={styles.mapContainer}>
          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={11}
            style={{ height: '500px', width: '100%', borderRadius: '16px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            {/* Parking markers */}
            {lots.map((lot) => {
              // Inline markers using react-leaflet
              return null; // ParkingMap handles this
            })}
            {showHeatmap && <TrafficHeatmap zones={trafficZones} />}
          </MapContainer>
          {/* Overlay ParkingMap separately since it needs its own MapContainer */}
        </div>
        {/* Standalone ParkingMap below */}
        <div className="glass-card mt-4" style={styles.mapContainer}>
          <h3 style={{ padding: '1rem 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>🅿️ Parking Locations</h3>
          <div style={{ padding: '0.5rem' }}>
            <ParkingMap lots={lots} />
          </div>
        </div>
      </div>

      {/* Nearest Parking */}
      {nearestLots.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📍 Nearest Available Parking</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Based on Haversine shortest-path algorithm from central Delhi
          </p>
          <div className="grid-3">
            {nearestLots.map((lot, i) => (
              <div
                key={lot._id}
                className="glass-card animate-fade-up"
                style={{ ...styles.nearestCard, animationDelay: `${i * 0.1}s`, cursor: 'pointer' }}
                onClick={() => navigate(`/parking/${lot._id}`)}
              >
                <div style={styles.nearestRank}>#{i + 1}</div>
                <h3 style={styles.nearestName}>{lot.name}</h3>
                <p style={styles.nearestAddr}>📍 {lot.address}</p>
                <div style={styles.nearestStats}>
                  <div>
                    <span style={styles.nearestValue}>{lot.distance} km</span>
                    <span style={styles.nearestLabel}>Distance</span>
                  </div>
                  <div>
                    <span style={styles.nearestValue}>{lot.estimatedTime} min</span>
                    <span style={styles.nearestLabel}>ETA</span>
                  </div>
                  <div>
                    <span style={{ ...styles.nearestValue, color: '#10b981' }}>{lot.availableSlots}</span>
                    <span style={styles.nearestLabel}>Slots Free</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parking Lots List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🅿️ All Parking Lots</h2>
        <div className="grid-3">
          {lots.map((lot, i) => (
            <div
              key={lot._id}
              className="glass-card animate-fade-up"
              style={{ ...styles.lotCard, animationDelay: `${i * 0.05}s`, cursor: 'pointer' }}
              onClick={() => navigate(`/parking/${lot._id}`)}
            >
              <div style={styles.lotHeader}>
                <h3 style={styles.lotName}>{lot.name}</h3>
                <span className={`badge ${lot.surgeLevel === 'normal' ? 'badge-success' : lot.surgeLevel === 'high' ? 'badge-warning' : 'badge-danger'}`}>
                  {lot.surgeLevel}
                </span>
              </div>
              <p style={styles.lotAddr}>📍 {lot.address}</p>
              {/* Occupancy bar */}
              <div style={styles.occBar}>
                <div style={{ ...styles.occFill, width: `${lot.occupancyRate}%`, background: lot.occupancyRate > 80 ? '#ef4444' : lot.occupancyRate > 50 ? '#f59e0b' : '#10b981' }} />
              </div>
              <div style={styles.lotStats}>
                <div style={styles.lotStatCol}>
                  <span style={{ ...styles.lotStatVal, color: '#10b981' }}>{lot.availableSlots}</span>
                  <span style={styles.lotStatLabel}>Free</span>
                </div>
                <div style={styles.lotStatCol}>
                  <span style={styles.lotStatVal}>{lot.totalSlots}</span>
                  <span style={styles.lotStatLabel}>Total</span>
                </div>
                <div style={styles.lotStatCol}>
                  <span style={{ ...styles.lotStatVal, color: '#6366f1' }}>₹{lot.currentPrice}</span>
                  <span style={styles.lotStatLabel}>Per hr</span>
                </div>
              </div>
              <div style={styles.amenities}>
                {lot.amenities?.slice(0, 3).map((a, j) => (
                  <span key={j} style={styles.amenityTag}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  mapSection: { marginBottom: '3rem' },
  mapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  mapTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' },
  mapContainer: { overflow: 'hidden', padding: 0 },
  section: { marginBottom: '3rem' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' },
  nearestCard: { padding: '1.5rem', position: 'relative' },
  nearestRank: { position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem', fontWeight: 900, color: 'rgba(99,102,241,0.2)' },
  nearestName: { fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' },
  nearestAddr: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' },
  nearestStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' },
  nearestValue: { display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' },
  nearestLabel: { display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' },
  lotCard: { padding: '1.5rem' },
  lotHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  lotName: { fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' },
  lotAddr: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' },
  occBar: { height: '6px', borderRadius: '3px', background: 'rgba(148,163,184,0.1)', marginBottom: '1rem', overflow: 'hidden' },
  occFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s ease' },
  lotStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' },
  lotStatCol: {},
  lotStatVal: { display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9' },
  lotStatLabel: { display: 'block', fontSize: '0.7rem', color: '#94a3b8' },
  amenities: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  amenityTag: { fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.08)', color: '#818cf8' },
};
