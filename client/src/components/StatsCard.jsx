/**
 * StatsCard Component
 * Reusable animated stat card with icon, value, label, and trend indicator.
 */
export default function StatsCard({ icon, label, value, trend, trendValue, color = '#6366f1' }) {
  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.top}>
        <div style={{ ...styles.iconWrap, background: `${color}15` }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        </div>
        {trend && (
          <span style={{
            ...styles.trend,
            color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f59e0b',
            background: trend === 'up' ? 'rgba(16,185,129,0.1)' : trend === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
          }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
}

const styles = {
  card: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trend: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '20px',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#f1f5f9',
    lineHeight: 1.1,
  },
  label: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: 500,
  },
};
