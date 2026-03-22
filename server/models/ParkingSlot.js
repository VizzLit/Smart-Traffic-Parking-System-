/**
 * ParkingSlot Model
 * Represents individual parking slots within a lot.
 * Adapted from SMART-PARKING-SYSTEM's slot detection concept —
 * instead of camera-based detection, status is managed via API.
 * Also incorporates parking_management_system's nearest-slot allocation logic.
 */
const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
  // Slot number (1-based, ordered by distance from entrance)
  slotNumber: { type: Number, required: true },
  // Floor/level for multi-story lots
  floor: { type: String, default: 'G' },
  // Slot type for different vehicle sizes
  type: { type: String, enum: ['compact', 'standard', 'large', 'ev'], default: 'standard' },
  // Current status — simulates what camera detection would provide
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  // Current vehicle info (populated when occupied/reserved)
  vehicleNumber: { type: String, default: '' },
  occupiedSince: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
parkingSlotSchema.index({ lot: 1, slotNumber: 1 }, { unique: true });
parkingSlotSchema.index({ lot: 1, status: 1 });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
