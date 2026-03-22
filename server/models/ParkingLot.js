/**
 * ParkingLot Model
 * Represents a physical parking facility with geo-coordinates.
 * Adapted from parking_management_system's create_parking_lot concept.
 * Enhanced with location data for map visualization and nearest-lot algorithms.
 */
const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  // Geo-coordinates for map display and distance calculations
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  totalSlots: { type: Number, required: true, min: 1, max: 1000 },
  // Base price per hour in currency units
  basePrice: { type: Number, required: true, default: 20 },
  // Amenities available at this lot
  amenities: [{ type: String }],
  // Operating hours
  openTime: { type: String, default: '06:00' },
  closeTime: { type: String, default: '23:00' },
  // Image URL for the lot
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
