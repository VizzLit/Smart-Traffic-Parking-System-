/**
 * Booking Model
 * Records parking slot reservations and completed sessions.
 * Inspired by EzyPark's reservation and payment system.
 * Enhanced with dynamic pricing integration.
 */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
  vehicleNumber: { type: String, required: true },
  // Booking time range
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  // Duration in hours (calculated on checkout)
  duration: { type: Number, default: 0 },
  // Pricing details
  basePrice: { type: Number, required: true },
  dynamicMultiplier: { type: Number, default: 1.0 },
  totalPrice: { type: Number, default: 0 },
  // Booking lifecycle
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ lot: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
