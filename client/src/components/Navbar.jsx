/**
 * Navbar Component
 * Responsive navigation with auth-aware links and mobile hamburger menu.
 * Design inspired by EzyPark's clean header — enhanced with glassmorphism.
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>SmartPark</span>
          <span style={styles.logoBadge}>AI</span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.desktopLinks}>
          {user ? (
            <>
              <Link to="/dashboard" style={{...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {})}}>
                🗺️ Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" style={{...styles.link, ...(isActive('/admin') ? styles.linkActive : {})}}>
                  📊 Admin
                </Link>
              )}
              <div style={styles.userInfo}>
                <span style={styles.userName}>👋 {user.name}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>🗺️ Dashboard</Link>
              {isAdmin && <Link to="/admin" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>📊 Admin</Link>}
              <div style={styles.mobileDivider} />
              <span style={styles.mobileUser}>👋 {user.name}</span>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15, 15, 35, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#f1f5f9',
  },
  logoIcon: { fontSize: '1.5rem' },
  logoText: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' },
  logoBadge: {
    fontSize: '0.65rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '6px',
    marginLeft: '-2px',
    marginTop: '-8px',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  linkActive: {
    color: '#f1f5f9',
    background: 'rgba(99, 102, 241, 0.1)',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { color: '#94a3b8', fontSize: '0.9rem' },
  logoutBtn: {
    background: 'transparent',
    border: '1.5px solid rgba(239, 68, 68, 0.5)',
    color: '#ef4444',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1.5rem 1.5rem',
    background: 'rgba(15, 15, 35, 0.95)',
    borderTop: '1px solid rgba(148, 163, 184, 0.08)',
    gap: '0.5rem',
  },
  mobileLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  mobileDivider: {
    height: '1px',
    background: 'rgba(148, 163, 184, 0.1)',
    margin: '0.5rem 0',
  },
  mobileUser: { color: '#94a3b8', padding: '0.5rem 0.75rem', fontSize: '0.9rem' },
  mobileLogout: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    color: '#ef4444',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

// Add responsive styles via media query
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav button[aria-label="Toggle menu"] { display: block !important; }
      nav > div > div:last-of-type:not([style*="flex-direction"]) { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}
