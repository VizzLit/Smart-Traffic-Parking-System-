/**
 * Traffic Data Routes — NEW FEATURE
 * Provides traffic heatmap data and congestion predictions.
 *
 * GET  /api/traffic/heatmap         - Get all zones with current congestion
 * GET  /api/traffic/predict/:zone   - Predict congestion for a zone
 * POST /api/traffic/update          - Update traffic data (simulated sensor)
 * GET  /api/traffic/zones           - List all zone names
 */
const express = require('express');
const TrafficData = require('../models/TrafficData');
const { predictCongestion, getCongestionCategory } = require('../utils/congestion');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/traffic/heatmap
 * Get the latest congestion data for all zones — used for traffic heatmap overlay.
 */
router.get('/heatmap', async (req, res) => {
  try {
    // Get the latest data point for each zone
    const zones = await TrafficData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$zoneName',
          zoneName: { $first: '$zoneName' },
          location: { $first: '$location' },
          radius: { $first: '$radius' },
          congestionLevel: { $first: '$congestionLevel' },
          vehicleCount: { $first: '$vehicleCount' },
          averageSpeed: { $first: '$averageSpeed' },
          timestamp: { $first: '$timestamp' }
        }
      }
    ]);

    // Enrich with category info for UI coloring
    const enriched = zones.map(zone => ({
      ...zone,
      category: getCongestionCategory(zone.congestionLevel)
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/traffic/predict/:zone
 * Predict congestion for a zone at a given day/hour.
 * Query params: ?day=0-6&hour=0-23 (defaults to current)
 */
router.get('/predict/:zone', async (req, res) => {
  try {
    const { zone } = req.params;
    const now = new Date();
    const targetDay = parseInt(req.query.day) || now.getDay();
    const targetHour = parseInt(req.query.hour) || now.getHours();

    // Fetch historical data for this zone
    const history = await TrafficData.find({ zoneName: zone })
      .sort({ timestamp: -1 })
      .limit(500)
      .select('congestionLevel timestamp');

    const prediction = predictCongestion(history, targetDay, targetHour);
    const category = getCongestionCategory(prediction.predictedLevel);

    res.json({
      zone,
      targetDay,
      targetHour,
      ...prediction,
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/traffic/update
 * Update traffic data for a zone (simulates IoT sensor feed).
 * In production, this would be called by traffic sensors/cameras.
 */
router.post('/update', async (req, res) => {
  try {
    const { zoneName, location, congestionLevel, vehicleCount, averageSpeed, radius } = req.body;
    const now = new Date();

    const data = new TrafficData({
      zoneName,
      location,
      radius: radius || 500,
      congestionLevel,
      vehicleCount: vehicleCount || 0,
      averageSpeed: averageSpeed || 40,
      timestamp: now,
      dayOfWeek: now.getDay(),
      hour: now.getHours()
    });

    await data.save();
    res.status(201).json({ message: 'Traffic data recorded.', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/traffic/zones
 * List all unique zone names.
 */
router.get('/zones', async (req, res) => {
  try {
    const zones = await TrafficData.distinct('zoneName');
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
