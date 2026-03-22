/**
 * Admin Dashboard Page
 * Comprehensive analytics with charts, traffic density, and revenue data.
 * Inspired by EzyPark's admin features — enhanced with traffic analytics.
 */
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [usage, setUsage] = useState([]);
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsRes, revenueRes, usageRes, trafficRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/revenue'),
        api.get('/admin/usage'),
        api.get('/admin/traffic'),
      ]);
      setStats(statsRes.data);
      setRevenue(revenueRes.data);
      setUsage(usageRes.data);
      setTraffic(trafficRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header"><h1>Loading Admin Dashboard...</h1></div>
        <div className="grid-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
        </div>
      </div>
    );
  }

  // Pie chart data for occupancy
  const pieData = usage.map(u => ({ name: u.name, value: u.occupancyRate }));

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>📊 Admin Dashboard</h1>
        <p>System analytics, revenue tracking, and traffic management</p>
      </div>

      {/* Top Stats */}
      <div className="grid-4 mb-6">
        <StatsCard
          icon="👥"
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="#6366f1"
        />
        <StatsCard
          icon="🎫"
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          trend="up"
          trendValue={`${stats?.todayBookings || 0} today`}
          color="#06b6d4"
        />
        <StatsCard
          icon="💰"
          label="Total Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          trend="up"
          trendValue={`₹${stats?.todayRevenue || 0} today`}
          color="#10b981"
        />
        <StatsCard
          icon="🅿️"
          label="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          color={stats?.occupancyRate > 70 ? '#ef4444' : '#f59e0b'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-6">
        {/* Revenue Chart */}
        <div className="glass-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>💰 Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '10px', color: '#f1f5f9' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Parking Usage Pie */}
        <div className="glass-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🅿️ Parking Lot Occupancy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name.split(' ')[0]}: ${value}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '10px', color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lot Usage Table */}
      <div className="glass-card mb-6" style={styles.tableCard}>
        <h3 style={styles.chartTitle}>📋 Parking Lot Usage Details</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Lot Name</th>
                <th style={styles.th}>Total Slots</th>
                <th style={styles.th}>Occupied</th>
                <th style={styles.th}>Occupancy</th>
                <th style={styles.th}>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((u, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}><strong>{u.name}</strong></td>
                  <td style={styles.td}>{u.totalSlots}</td>
                  <td style={styles.td}>{u.occupiedSlots}</td>
                  <td style={styles.td}>
                    <div style={styles.miniBarBg}>
                      <div style={{
                        ...styles.miniBarFill,
                        width: `${u.occupancyRate}%`,
                        background: u.occupancyRate > 70 ? '#ef4444' : u.occupancyRate > 40 ? '#f59e0b' : '#10b981',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>{u.occupancyRate}%</span>
                  </td>
                  <td style={styles.td}>{u.totalBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Density Section */}
      <div className="glass-card mb-6" style={styles.chartCard}>
        <div style={styles.trafficHeader}>
          <h3 style={styles.chartTitle}>🔥 Traffic Density Monitor</h3>
          <span className={`badge ${
            traffic?.avgCongestion > 60 ? 'badge-danger' :
            traffic?.avgCongestion > 40 ? 'badge-warning' : 'badge-success'
          }`}>
            Avg: {traffic?.avgCongestion || 0}%
          </span>
        </div>

        {/* Traffic Bars */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={traffic?.zones || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="zoneName" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#16213e', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '10px', color: '#f1f5f9' }}
            />
            <Bar dataKey="congestionLevel" name="Congestion %" radius={[6, 6, 0, 0]}>
              {(traffic?.zones || []).map((z, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={z.congestionLevel >= 70 ? '#ef4444' : z.congestionLevel >= 40 ? '#f59e0b' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Zone Cards */}
        <div style={styles.zoneGrid}>
          {traffic?.zones?.map((zone, i) => (
            <div key={i} style={styles.zoneCard}>
              <div style={styles.zoneName}>{zone.zoneName}</div>
              <div style={styles.zoneMetrics}>
                <span style={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: zone.congestionLevel >= 70 ? '#ef4444' : zone.congestionLevel >= 40 ? '#f59e0b' : '#10b981',
                }}>
                  {zone.congestionLevel}%
                </span>
                <span style={styles.zoneSpeed}>{zone.averageSpeed} km/h</span>
              </div>
              <div style={styles.zoneCongBar}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  width: `${zone.congestionLevel}%`,
                  background: zone.congestionLevel >= 70 ? '#ef4444' : zone.congestionLevel >= 40 ? '#f59e0b' : '#10b981',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid-3 mb-6">
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🅿️</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9', marginTop: '0.5rem' }}>{stats?.totalSlots}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Parking Slots</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{stats?.availableSlots} free</span>
            {' / '}
            <span style={{ color: '#ef4444', fontWeight: 700 }}>{stats?.occupiedSlots} occupied</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🎫</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9', marginTop: '0.5rem' }}>{stats?.activeBookings}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Active Bookings</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#06b6d4' }}>Currently checked in</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🔥</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9', marginTop: '0.5rem' }}>{traffic?.totalZones}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Traffic Zones Monitored</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#f59e0b' }}>Real-time tracking</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chartCard: { padding: '1.5rem' },
  chartTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.5rem' },
  tableCard: { padding: '1.5rem', overflow: 'hidden' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', borderBottom: '1px solid rgba(148,163,184,0.1)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr: { borderBottom: '1px solid rgba(148,163,184,0.06)' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#f1f5f9' },
  miniBarBg: { display: 'inline-block', width: '60px', height: '6px', borderRadius: '3px', background: 'rgba(148,163,184,0.1)', verticalAlign: 'middle' },
  miniBarFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s ease' },
  trafficHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  zoneGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' },
  zoneCard: { background: 'rgba(15,15,35,0.5)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(148,163,184,0.06)' },
  zoneName: { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' },
  zoneMetrics: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  zoneSpeed: { fontSize: '0.75rem', color: '#64748b' },
  zoneCongBar: { height: '4px', borderRadius: '2px', background: 'rgba(148,163,184,0.1)' },
};
