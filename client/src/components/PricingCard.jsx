/**
 * PricingCard Component
 * Displays current dynamic price with surge level indicator.
 */
export default function PricingCard({ basePrice, currentPrice, surgeLevel, multiplier }) {
  const surgeConfig = {
    normal: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Normal Rate', icon: '✅' },
    moderate: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Moderate Surge', icon: '📈' },
    high: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'High Demand', icon: '🔥' },
    extreme: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Peak Pricing', icon: '⚡' },
  };

  const config = surgeConfig[surgeLevel] || surgeConfig.normal;

  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>💰 Dynamic Pricing</span>
        <span style={{ ...styles.badge, background: config.bg, color: config.color }}>
          {config.icon} {config.label}
        </span>
      </div>

      <div style={styles.priceRow}>
        <div>
          <div style={styles.currentPrice}>₹{currentPrice}</div>
          <div style={styles.perHour}>per hour</div>
        </div>
        {surgeLevel !== 'normal' && (
          <div style={styles.comparison}>
            <span style={styles.basePrice}>₹{basePrice}</span>
            <span style={styles.multiplierText}>{multiplier}x</span>
          </div>
        )}
      </div>

      <div style={styles.factors}>
        <div style={styles.factor}>
          <span style={styles.factorIcon}>🕐</span>
          <span style={styles.factorText}>Time-based adjustment</span>
        </div>
        <div style={styles.factor}>
          <span style={styles.factorIcon}>📊</span>
          <span style={styles.factorText}>Occupancy demand</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  title: { fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' },
  badge: { fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' },
  currentPrice: { fontSize: '2.5rem', fontWeight: 900, color: '#6366f1', lineHeight: 1 },
  perHour: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' },
  comparison: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  basePrice: { fontSize: '1rem', color: '#64748b', textDecoration: 'line-through' },
  multiplierText: { fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' },
  factors: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  factor: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  factorIcon: { fontSize: '0.9rem' },
  factorText: { fontSize: '0.8rem', color: '#94a3b8' },
};
