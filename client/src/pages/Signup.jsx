/**
 * Signup Page
 * Registration form with password strength and vehicle info.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', vehicleNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = () => {
    const len = form.password.length;
    if (len === 0) return { label: '', color: 'transparent', width: '0%' };
    if (len < 6) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (len < 10) return { label: 'Good', color: '#f59e0b', width: '66%' };
    return { label: 'Strong', color: '#10b981', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div style={styles.page}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div className="glass-card animate-fade-up" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join SmartPark and start booking instantly</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="input-field" placeholder="Your Name" value={form.name} onChange={handleChange} required id="signup-name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={handleChange} required id="signup-email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required id="signup-password" />
            {form.password.length > 0 && (
              <div style={styles.strengthBar}>
                <div style={{ ...styles.strengthFill, width: strength.width, background: strength.color }} />
                <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input type="tel" name="phone" className="input-field" placeholder="9876543210" value={form.phone} onChange={handleChange} id="signup-phone" />
          </div>
          <div className="form-group">
            <label>Vehicle Number (optional)</label>
            <input type="text" name="vehicleNumber" className="input-field" placeholder="DL-01-AB-1234" value={form.vehicleNumber} onChange={handleChange} id="signup-vehicle" />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }} id="signup-submit">
            {loading ? '⏳ Creating...' : '🚀 Create Account'}
          </button>
        </form>

        <p style={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
    top: '-100px', left: '-100px',
  },
  bgOrb2: {
    position: 'absolute',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    bottom: '-80px', right: '-80px',
  },
  card: { width: '100%', maxWidth: '480px', padding: '2.5rem', position: 'relative', zIndex: 1 },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' },
  subtitle: { fontSize: '0.95rem', color: '#94a3b8' },
  error: {
    color: '#ef4444', fontSize: '0.85rem', textAlign: 'center',
    padding: '0.5rem', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', marginBottom: '0.5rem',
  },
  strengthBar: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' },
  strengthFill: { height: '4px', borderRadius: '2px', transition: 'all 0.3s ease', flex: 1 },
  strengthLabel: { fontSize: '0.7rem', fontWeight: 600, minWidth: '45px' },
  linkText: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' },
  link: { color: '#818cf8', fontWeight: 600 },
};
