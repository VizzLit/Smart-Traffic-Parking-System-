/**
 * Admin Dashboard Routes
 * Analytics and management endpoints for admin users.
 * Inspired by EzyPark's admin features — enhanced with traffic analytics.
 *
 * GET /api/admin/stats     - Overall system statistics
 * GET /api/admin/revenue   - Revenue breakdown
 * GET /api/admin/usage     - Parking usage over time
 * GET /api/admin/traffic   - Traffic density summary
 */
const express = require('express');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const TrafficData = require('../models/TrafficData');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware, adminMiddleware);

/**
 * GET /api/admin/stats
 * Get overall system dashboard statistics.
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLots = await ParkingLot.countDocuments({ isActive: true });
    const totalSlots = await ParkingSlot.countDocuments();
    const availableSlots = await ParkingSlot.countDocuments({ status: 'available' });
    const occupiedSlots = await ParkingSlot.countDocuments({ status: 'occupied' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });

    // Revenue calculation
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today } });
    const todayRevenueResult = await Booking.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    res.json({
      totalUsers,
      totalLots,
      totalSlots,
      availableSlots,
      occupiedSlots,
      occupancyRate: totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0,
      totalBookings,
      activeBookings,
      totalRevenue: Math.round(totalRevenue),
      todayBookings,
      todayRevenue: Math.round(todayRevenue)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/revenue
 * Revenue breakdown by day for the last 7 days.
 */
router.get('/revenue', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenue = await Booking.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/usage
 * Parking usage statistics per lot.
 */
router.get('/usage', async (req, res) => {
  try {
    const lots = await ParkingLot.find({ isActive: true });

    const usage = await Promise.all(
      lots.map(async (lot) => {
        const total = await ParkingSlot.countDocuments({ lot: lot._id });
        const occupied = await ParkingSlot.countDocuments({ lot: lot._id, status: 'occupied' });
        const bookings = await Booking.countDocuments({ lot: lot._id });

        return {
          lotId: lot._id,
          name: lot.name,
          totalSlots: total,
          occupiedSlots: occupied,
          occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
          totalBookings: bookings
        };
      })
    );

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/traffic
 * Traffic density summary across all zones.
 */
router.get('/traffic', async (req, res) => {
  try {
    const zones = await TrafficData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$zoneName',
          zoneName: { $first: '$zoneName' },
          congestionLevel: { $first: '$congestionLevel' },
          vehicleCount: { $first: '$vehicleCount' },
          averageSpeed: { $first: '$averageSpeed' },
          lastUpdated: { $first: '$timestamp' }
        }
      },
      { $sort: { congestionLevel: -1 } }
    ]);

    const avgCongestion = zones.length > 0
      ? Math.round(zones.reduce((sum, z) => sum + z.congestionLevel, 0) / zones.length)
      : 0;

    res.json({
      avgCongestion,
      totalZones: zones.length,
      zones
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
