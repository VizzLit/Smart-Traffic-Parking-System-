/**
 * Landing Page
 * Hero section with animated gradient background, feature cards,
 * live stats counter, and CTA. Inspired by EzyPark's landing.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🅿️', title: 'Smart Slot Detection', desc: 'Real-time parking slot availability powered by intelligent detection systems.', source: 'Adapted from SMART-PARKING-SYSTEM' },
  { icon: '🗺️', title: 'Nearest Parking Finder', desc: 'Get instant suggestions for the closest available parking using shortest-path algorithms.', source: 'New — Haversine algorithm' },
  { icon: '🔥', title: 'Traffic Heatmap', desc: 'Live congestion visualization with red/yellow/green zones across the city.', source: 'New — Novel Feature' },
  { icon: '🧠', title: 'Congestion Prediction', desc: 'AI-powered prediction of traffic patterns using historical data analysis.', source: 'New — Weighted Moving Average' },
  { icon: '💰', title: 'Dynamic Pricing', desc: 'Smart pricing that adjusts based on demand, time, and occupancy.', source: 'Enhanced from EzyPark' },
  { icon: '📊', title: 'Admin Analytics', desc: 'Comprehensive dashboard with revenue tracking, traffic density, and usage analytics.', source: 'Inspired by EzyPark' },
];

const stats = [
  { value: '6+', label: 'Parking Lots' },
  { value: '135+', label: 'Smart Slots' },
  { value: '8', label: 'Traffic Zones' },
  { value: '99.9%', label: 'Uptime' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div className="animate-fade-up">
            <span style={styles.heroBadge}>🚀 AI-Powered Traffic & Parking Management</span>
          </div>
          <h1 style={styles.heroTitle} className="animate-fade-up delay-1">
            Smart Parking.<br />
            <span style={styles.heroGradient}>Zero Congestion.</span>
          </h1>
          <p style={styles.heroDesc} className="animate-fade-up delay-2">
            Find parking in seconds, avoid traffic jams, and save money with
            AI-driven dynamic pricing. The future of urban mobility is here.
          </p>
          <div style={styles.heroCTA} className="animate-fade-up delay-3">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                📍 Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating elements */}
        <div style={styles.floatingCar} className="animate-float">🚗</div>
        <div style={{ ...styles.floatingCar, ...styles.floatingCar2 }} className="animate-float">🅿️</div>
      </section>

      {/* Stats Bar */}
      <section style={styles.statsSection}>
        <div style={styles.statsBar}>
          {stats.map((stat, i) => (
            <div key={i} style={styles.statItem} className={`animate-fade-up delay-${i + 1}`}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionDesc}>Everything you need for smart urban traffic & parking management</p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((feat, i) => (
            <div key={i} className="glass-card animate-fade-up" style={{ ...styles.featureCard, animationDelay: `${i * 0.1}s` }}>
              <div style={styles.featureIcon}>{feat.icon}</div>
              <h3 style={styles.featureTitle}>{feat.title}</h3>
              <p style={styles.featureDesc}>{feat.desc}</p>
              <span style={styles.featureSource}>{feat.source}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionDesc}>Three simple steps to stress-free parking</p>
        </div>
        <div style={styles.stepsRow}>
          {[
            { num: '01', title: 'Find', desc: 'View real-time parking availability on the interactive map with traffic heatmap overlay.', icon: '🔍' },
            { num: '02', title: 'Book', desc: 'Select the nearest available lot, pick your slot, and lock in dynamic pricing.', icon: '🎫' },
            { num: '03', title: 'Park', desc: 'Follow navigation to your reserved spot. Checkout when done, pay only for time used.', icon: '🚗' },
          ].map((step, i) => (
            <div key={i} style={styles.stepCard} className={`animate-fade-up delay-${i + 1}`}>
              <div style={styles.stepNum}>{step.num}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div className="glass-card" style={styles.ctaCard}>
          <h2 style={styles.ctaTitle}>Ready to Experience Smart Parking?</h2>
          <p style={styles.ctaDesc}>Join thousands of drivers saving time and fuel every day.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Now — It's Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span>🚗 SmartPark AI</span>
          </div>
          <p style={styles.footerText}>
            AI-Based Smart Traffic & Parking Management System<br />
            Built with ❤️ • React • Node.js • MongoDB • Leaflet
          </p>
          <p style={styles.footerCredit}>
            Base: parking_management_system • SMART-PARKING-SYSTEM • EzyPark
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 30%, #1a1a2e 70%, #0f172a 100%)',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 30% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
  },
  heroContent: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: '800px',
    padding: '2rem',
    zIndex: 2,
  },
  heroBadge: {
    display: 'inline-block',
    padding: '8px 20px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#818cf8',
    marginBottom: '2rem',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#f1f5f9',
    marginBottom: '1.5rem',
    letterSpacing: '-1px',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    lineHeight: 1.7,
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  },
  heroCTA: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  floatingCar: {
    position: 'absolute',
    fontSize: '3rem',
    top: '20%',
    right: '10%',
    opacity: 0.15,
    zIndex: 1,
  },
  floatingCar2: { top: '60%', left: '8%', fontSize: '2.5rem' },
  statsSection: {
    background: 'rgba(22, 33, 62, 0.5)',
    borderTop: '1px solid rgba(148, 163, 184, 0.08)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
  },
  statsBar: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '2rem 1.5rem',
  },
  statItem: { textAlign: 'center', padding: '1.5rem' },
  statValue: { fontSize: '2rem', fontWeight: 900, color: '#6366f1' },
  statLabel: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' },
  featuresSection: { maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: '2.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.75rem' },
  sectionDesc: { fontSize: '1.1rem', color: '#94a3b8' },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: { padding: '2rem' },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    display: 'block',
    width: '60px',
    height: '60px',
    lineHeight: '60px',
    textAlign: 'center',
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: '16px',
  },
  featureTitle: { fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' },
  featureDesc: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '0.75rem' },
  featureSource: { fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' },
  howSection: { maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' },
  stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' },
  stepCard: { textAlign: 'center', padding: '2rem' },
  stepNum: { fontSize: '3rem', fontWeight: 900, color: 'rgba(99, 102, 241, 0.15)', lineHeight: 1 },
  stepIcon: { fontSize: '2.5rem', margin: '1rem 0' },
  stepTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' },
  stepDesc: { fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 },
  ctaSection: { maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 5rem' },
  ctaCard: { textAlign: 'center', padding: '3rem 2rem' },
  ctaTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' },
  ctaDesc: { fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem' },
  footer: {
    borderTop: '1px solid rgba(148, 163, 184, 0.08)',
    padding: '3rem 1.5rem',
  },
  footerContent: { maxWidth: '1280px', margin: '0 auto', textAlign: 'center' },
  footerLogo: { fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' },
  footerText: { fontSize: '0.85rem', color: '#64748b', lineHeight: 1.8 },
  footerCredit: { fontSize: '0.75rem', color: '#475569', marginTop: '1rem', fontStyle: 'italic' },
};
