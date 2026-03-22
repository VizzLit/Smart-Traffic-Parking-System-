/**
 * BookingModal Component
 * Modal overlay for booking a selected parking slot.
 * Shows slot details, dynamic pricing, and booking form.
 */
import { useState } from 'react';
import api from '../api/axios';

export default function BookingModal({ slot, lot, pricing, onClose, onBooked }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = pricing ? pricing.finalPrice * duration : lot?.basePrice * duration;

  const handleBook = async () => {
    if (!vehicleNumber.trim()) {
      setError('Please enter your vehicle number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/parking/book', {
        lotId: lot._id,
        slotId: slot._id,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        duration,
      });
      onBooked?.(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎫 Book Parking Slot</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Slot Info */}
        <div style={styles.info}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Parking Lot</span>
            <span style={styles.infoValue}>{lot?.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Slot Number</span>
            <span style={styles.infoValue}>#{slot?.slotNumber} (Floor {slot?.floor})</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Slot Type</span>
            <span style={styles.infoValue} className="badge badge-info">{slot?.type}</span>
          </div>
        </div>

        {/* Price Display */}
        <div style={styles.priceCard}>
          <div style={styles.priceTop}>
            <span style={styles.priceLabel}>Price per hour</span>
            <span style={styles.priceValue}>₹{pricing?.finalPrice || lot?.basePrice}</span>
          </div>
          {pricing?.surgeLevel !== 'normal' && (
            <span style={{
              ...styles.surgeTag,
              background: pricing.surgeLevel === 'extreme' ? 'rgba(239,68,68,0.15)' :
                pricing.surgeLevel === 'high' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
              color: pricing.surgeLevel === 'extreme' ? '#ef4444' :
                pricing.surgeLevel === 'high' ? '#f59e0b' : '#3b82f6',
            }}>
              ⚡ {pricing.surgeLevel} surge ({pricing.totalMultiplier}x)
            </span>
          )}
        </div>

        {/* Form */}
        <div className="form-group">
          <label>Vehicle Number</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., DL-01-AB-1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duration (hours)</label>
          <select
            className="input-field"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((h) => (
              <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Estimate</span>
          <span style={styles.totalValue}>₹{Math.round(totalPrice)}</span>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          className="btn btn-primary btn-lg w-full"
          onClick={handleBook}
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  info: {
    background: 'rgba(15, 15, 35, 0.5)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: '0.85rem', color: '#94a3b8' },
  infoValue: { fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' },
  priceCard: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  priceTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: '0.9rem', color: '#94a3b8' },
  priceValue: { fontSize: '1.75rem', fontWeight: 800, color: '#6366f1' },
  surgeTag: {
    display: 'inline-block',
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '20px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  totalLabel: { fontSize: '1rem', fontWeight: 600, color: '#94a3b8' },
  totalValue: { fontSize: '1.5rem', fontWeight: 800, color: '#10b981' },
  error: { color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' },
};
