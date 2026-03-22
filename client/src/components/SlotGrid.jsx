/**
 * SlotGrid Component
 * Visual grid of parking slots with color-coded statuses.
 * Adapted from SMART-PARKING-SYSTEM's visual detection display concept.
 * Green = available, Red = occupied, Blue = reserved, Gray = maintenance.
 */
export default function SlotGrid({ slots, onSlotClick, selectedSlot }) {
  const getSlotColor = (status) => {
    switch (status) {
      case 'available': return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#10b981' };
      case 'occupied': return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' };
      case 'reserved': return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6' };
      case 'maintenance': return { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748b', text: '#64748b' };
      default: return { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748b', text: '#64748b' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'compact': return '🚗';
      case 'standard': return '🚙';
      case 'large': return '🚐';
      case 'ev': return '⚡';
      default: return '🚙';
    }
  };

  return (
    <div>
      {/* Legend */}
      <div style={styles.legend}>
        {[
          { status: 'available', label: 'Available' },
          { status: 'occupied', label: 'Occupied' },
          { status: 'reserved', label: 'Reserved' },
          { status: 'maintenance', label: 'Maintenance' },
        ].map(({ status, label }) => {
          const colors = getSlotColor(status);
          return (
            <div key={status} style={styles.legendItem}>
              <div style={{ ...styles.legendDot, background: colors.border }} />
              <span style={styles.legendLabel}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {slots.map((slot) => {
          const colors = getSlotColor(slot.status);
          const isSelected = selectedSlot === slot._id;

          return (
            <button
              key={slot._id}
              onClick={() => slot.status === 'available' && onSlotClick?.(slot)}
              disabled={slot.status !== 'available'}
              style={{
                ...styles.slot,
                background: colors.bg,
                borderColor: isSelected ? '#f1f5f9' : colors.border,
                cursor: slot.status === 'available' ? 'pointer' : 'not-allowed',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 20px ${colors.border}40` : 'none',
              }}
            >
              <span style={styles.slotIcon}>{getTypeIcon(slot.type)}</span>
              <span style={{ ...styles.slotNumber, color: colors.text }}>#{slot.slotNumber}</span>
              <span style={{ ...styles.slotFloor, color: colors.text }}>Floor {slot.floor}</span>
              {slot.vehicleNumber && (
                <span style={styles.vehicle}>{slot.vehicleNumber}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  legend: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  legendDot: { width: '12px', height: '12px', borderRadius: '50%' },
  legendLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '0.75rem',
  },
  slot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 0.5rem',
    borderRadius: '12px',
    border: '1.5px solid',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  slotIcon: { fontSize: '1.25rem' },
  slotNumber: { fontSize: '0.85rem', fontWeight: 700 },
  slotFloor: { fontSize: '0.65rem', fontWeight: 500, opacity: 0.8 },
  vehicle: { fontSize: '0.6rem', color: '#94a3b8', marginTop: '2px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' },
};
