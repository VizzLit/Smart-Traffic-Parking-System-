/**
 * TrafficData Model
 * Stores traffic congestion data for different city zones.
 * NEW feature — enables traffic heatmap and congestion prediction.
 * Data represents simulated sensor/camera readings of vehicle density.
 */
const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
  // Zone identification
  zoneName: { type: String, required: true },
  // Zone boundary for heatmap rendering (center point + radius)
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  radius: { type: Number, default: 500 }, // meters
  // Congestion metrics
  congestionLevel: { type: Number, required: true, min: 0, max: 100 },
  vehicleCount: { type: Number, default: 0 },
  averageSpeed: { type: Number, default: 40 }, // km/h
  // Time-series data point
  timestamp: { type: Date, default: Date.now },
  // Day-of-week and hour for prediction patterns
  dayOfWeek: { type: Number, min: 0, max: 6 },
  hour: { type: Number, min: 0, max: 23 }
});

trafficDataSchema.index({ zoneName: 1, timestamp: -1 });
trafficDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('TrafficData', trafficDataSchema);
