/**
 * ParkingDetail Page
 * Shows detailed view of a parking lot with:
 * - Visual slot grid (adapted from SMART-PARKING-SYSTEM)
 * - Dynamic pricing card
 * - Booking modal
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SlotGrid from '../components/SlotGrid';
import PricingCard from '../components/PricingCard';
import BookingModal from '../components/BookingModal';

export default function ParkingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    loadLot();
  }, [id]);

  const loadLot = async () => {
    try {
      const res = await api.get(`/parking/lots/${id}`);
      setLot(res.data);
    } catch (err) {
      console.error('Failed to load lot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowBooking(true);
  };

  const handleBooked = (data) => {
    setShowBooking(false);
    setBookingSuccess(data);
    setSelectedSlot(null);
    loadLot(); // Refresh
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '200px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="page-container text-center">
        <h2>Parking lot not found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={styles.backBtn}
      >
        ← Back to Dashboard
      </button>

      {/* Lot Header */}
      <div className="glass-card animate-fade-up" style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.lotName}>{lot.name}</h1>
            <p style={styles.lotAddr}>📍 {lot.address}</p>
            <div style={styles.amenitiesRow}>
              {lot.amenities?.map((a, i) => (
                <span key={i} className="badge badge-primary">{a}</span>
              ))}
            </div>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.headerStat}>
              <span style={{ ...styles.headerStatVal, color: '#10b981' }}>{lot.availableSlots}</span>
              <span style={styles.headerStatLabel}>Available</span>
            </div>
            <div style={styles.headerStat}>
              <span style={styles.headerStatVal}>{lot.slots?.length || lot.totalSlots}</span>
              <span style={styles.headerStatLabel}>Total Slots</span>
            </div>
            <div style={styles.headerStat}>
              <span style={{ ...styles.headerStatVal, color: lot.occupancyRate > 80 ? '#ef4444' : '#f59e0b' }}>{lot.occupancyRate}%</span>
              <span style={styles.headerStatLabel}>Occupied</span>
            </div>
          </div>
        </div>
        {/* Occupancy bar */}
        <div style={styles.occBar}>
          <div style={{
            ...styles.occFill,
            width: `${lot.occupancyRate}%`,
            background: lot.occupancyRate > 80 ? '#ef4444' : lot.occupancyRate > 50 ? '#f59e0b' : '#10b981',
          }} />
        </div>
        <div style={styles.occText}>
          {lot.openTime} — {lot.closeTime} • Operating Hours
        </div>
      </div>

      {/* Pricing Card */}
      <div className="grid-2 mt-6" style={styles.mainGrid}>
        <PricingCard
          basePrice={lot.basePrice}
          currentPrice={lot.currentPrice}
          surgeLevel={lot.surgeLevel}
          multiplier={lot.pricingDetails?.totalMultiplier}
        />
        {/* Quick actions */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.75rem' }}>
            ⚡ Quick Actions
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Click on any <span style={{ color: '#10b981', fontWeight: 600 }}>green (available)</span> slot below to book it instantly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                const firstAvailable = lot.slots?.find(s => s.status === 'available');
                if (firstAvailable) handleSlotClick(firstAvailable);
              }}
              disabled={lot.availableSlots === 0}
            >
              🎯 Book Nearest Available Slot
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              🗺️ View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Slot Grid */}
      <div className="glass-card mt-6 animate-fade-up" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.5rem' }}>
          🅿️ Parking Slots — Floor View
        </h2>
        <SlotGrid
          slots={lot.slots || []}
          onSlotClick={handleSlotClick}
          selectedSlot={selectedSlot?._id}
        />
      </div>

      {/* Booking Success */}
      {bookingSuccess && (
        <div className="glass-card mt-6 animate-fade-up" style={styles.successCard}>
          <h3 style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 700 }}>✅ Booking Confirmed!</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
            {bookingSuccess.message}
          </p>
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginTop: '0.5rem' }}>
            Estimated Price: ₹{Math.round(bookingSuccess.booking?.totalPrice || 0)}
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          lot={lot}
          pricing={lot.pricingDetails}
          onClose={() => { setShowBooking(false); setSelectedSlot(null); }}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}

const styles = {
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#818cf8',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.5rem 0',
    marginBottom: '1rem',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  headerCard: { padding: '2rem' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' },
  lotName: { fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' },
  lotAddr: { fontSize: '0.95rem', color: '#94a3b8', marginBottom: '0.75rem' },
  amenitiesRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  headerStats: { display: 'flex', gap: '2rem' },
  headerStat: { textAlign: 'center' },
  headerStatVal: { display: 'block', fontSize: '2rem', fontWeight: 900, color: '#f1f5f9' },
  headerStatLabel: { display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' },
  occBar: { height: '8px', borderRadius: '4px', background: 'rgba(148,163,184,0.1)', marginTop: '1.5rem', overflow: 'hidden' },
  occFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  occText: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' },
  mainGrid: {},
  successCard: { padding: '1.5rem', borderLeft: '4px solid #10b981' },
};
