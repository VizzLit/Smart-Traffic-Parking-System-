/**
 * Smart Traffic & Parking Management System — Express Server
 * Main entry point that configures middleware and mounts all routes.
 *
 * Base repos adapted:
 * - parking_management_system → /api/parking routes
 * - SMART-PARKING-SYSTEM → slot detection logic (simulated)
 * - EzyPark → feature set inspiration (dynamic pricing, traffic management)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route modules
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
const trafficRoutes = require('./routes/traffic');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logging (dev)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart Traffic & Parking API', timestamp: new Date() });
});

// ── Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ──────────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api\n`);
  });
}

start();
