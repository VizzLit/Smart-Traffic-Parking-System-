/**
 * Login Page
 * Glassmorphism login form with validation and animated background.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div className="glass-card animate-fade-up" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your SmartPark account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="login-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
            id="login-submit"
          >
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>
        </form>

        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>Demo Credentials</p>
          <div style={styles.demoRow}>
            <span>👤 User:</span>
            <code style={styles.code}>user@demo.com / password123</code>
          </div>
          <div style={styles.demoRow}>
            <span>🔑 Admin:</span>
            <code style={styles.code}>admin@demo.com / admin123</code>
          </div>
        </div>

        <p style={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
  },
  bgOrb2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
    bottom: '-50px',
    left: '-50px',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '2.5rem',
    position: 'relative',
    zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' },
  subtitle: { fontSize: '0.95rem', color: '#94a3b8' },
  error: {
    color: '#ef4444',
    fontSize: '0.85rem',
    textAlign: 'center',
    padding: '0.5rem',
    background: 'rgba(239,68,68,0.08)',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  demoBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(99,102,241,0.06)',
    borderRadius: '12px',
    border: '1px solid rgba(99,102,241,0.15)',
  },
  demoTitle: { fontSize: '0.8rem', fontWeight: 600, color: '#818cf8', marginBottom: '0.75rem' },
  demoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' },
  code: { fontFamily: 'monospace', fontSize: '0.75rem', color: '#f1f5f9', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' },
  linkText: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' },
  link: { color: '#818cf8', fontWeight: 600 },
};
