/**
 * Parking Management Routes
 * Core parking functionality adapted from parking_management_system:
 * - Slot allocation (nearest-to-entrance)
 * - Booking and release
 * Enhanced with EzyPark-style availability + SMART-PARKING-SYSTEM slot detection concepts.
 *
 * GET  /api/parking/lots          - List all lots with availability
 * GET  /api/parking/lots/:id      - Get lot detail with all slots
 * POST /api/parking/book          - Book a parking slot
 * POST /api/parking/release       - Release/checkout a booking
 * GET  /api/parking/nearest       - Find nearest available parking
 * GET  /api/parking/my-bookings   - Get user's bookings
 */
const express = require('express');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const { authMiddleware } = require('../middleware/auth');
const { calculateDynamicPrice } = require('../utils/pricing');
const { findNearestParking } = require('../utils/pathfinding');

const router = express.Router();

/**
 * GET /api/parking/lots
 * List all parking lots with real-time availability counts.
 */
router.get('/lots', async (req, res) => {
  try {
    const lots = await ParkingLot.find({ isActive: true });

    // Compute availability for each lot
    const lotsWithAvailability = await Promise.all(
      lots.map(async (lot) => {
        const totalSlots = await ParkingSlot.countDocuments({ lot: lot._id });
        const availableSlots = await ParkingSlot.countDocuments({ lot: lot._id, status: 'available' });
        const occupiedSlots = await ParkingSlot.countDocuments({ lot: lot._id, status: 'occupied' });
        const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

        // Calculate current dynamic price
        const pricing = calculateDynamicPrice(lot.basePrice, occupancyRate);

        return {
          ...lot.toObject(),
          totalSlots,
          availableSlots,
          occupiedSlots,
          occupancyRate,
          currentPrice: pricing.finalPrice,
          surgeLevel: pricing.surgeLevel,
          pricingDetails: pricing
        };
      })
    );

    res.json(lotsWithAvailability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parking/lots/:id
 * Get detailed info for a specific lot including all slot statuses.
 */
router.get('/lots/:id', async (req, res) => {
  try {
    const lot = await ParkingLot.findById(req.params.id);
    if (!lot) return res.status(404).json({ error: 'Parking lot not found.' });

    const slots = await ParkingSlot.find({ lot: lot._id }).sort({ slotNumber: 1 });
    const availableSlots = slots.filter(s => s.status === 'available').length;
    const occupancyRate = slots.length > 0
      ? Math.round(((slots.length - availableSlots) / slots.length) * 100)
      : 0;

    const pricing = calculateDynamicPrice(lot.basePrice, occupancyRate);

    res.json({
      ...lot.toObject(),
      slots,
      availableSlots,
      occupancyRate,
      currentPrice: pricing.finalPrice,
      surgeLevel: pricing.surgeLevel,
      pricingDetails: pricing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/parking/book
 * Book a parking slot.
 * Adapted from parking_management_system's allocate_parking_slot —
 * automatically assigns nearest available slot if no specific slot chosen.
 */
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { lotId, slotId, vehicleNumber, duration } = req.body;

    // Find target slot — if slotId provided use it, otherwise find nearest available
    let slot;
    if (slotId) {
      slot = await ParkingSlot.findById(slotId);
    } else {
      // Nearest-to-entrance: lowest slot number that's available
      slot = await ParkingSlot.findOne({ lot: lotId, status: 'available' })
        .sort({ slotNumber: 1 });
    }

    if (!slot || slot.status !== 'available') {
      return res.status(400).json({ error: 'No available slot found.' });
    }

    const lot = await ParkingLot.findById(slot.lot);
    if (!lot) return res.status(404).json({ error: 'Parking lot not found.' });

    // Calculate pricing
    const totalSlots = await ParkingSlot.countDocuments({ lot: lot._id });
    const occupiedSlots = await ParkingSlot.countDocuments({ lot: lot._id, status: 'occupied' });
    const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
    const pricing = calculateDynamicPrice(lot.basePrice, occupancyRate);

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      lot: lot._id,
      slot: slot._id,
      vehicleNumber: vehicleNumber || 'N/A',
      startTime: new Date(),
      basePrice: lot.basePrice,
      dynamicMultiplier: pricing.totalMultiplier,
      totalPrice: pricing.finalPrice * (duration || 1),
      duration: duration || 1
    });
    await booking.save();

    // Update slot status
    slot.status = 'occupied';
    slot.vehicleNumber = vehicleNumber || 'N/A';
    slot.occupiedSince = new Date();
    await slot.save();

    res.status(201).json({
      message: `Slot #${slot.slotNumber} booked successfully!`,
      booking: await booking.populate(['lot', 'slot']),
      pricing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/parking/release
 * Release a booked slot (checkout).
 * Adapted from parking_management_system's deallocate_parking_slot.
 */
router.post('/release', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'active') {
      return res.status(400).json({ error: 'Active booking not found.' });
    }

    // Calculate actual duration and total price
    const endTime = new Date();
    const durationHours = Math.max(1, Math.ceil((endTime - booking.startTime) / (1000 * 60 * 60)));
    booking.endTime = endTime;
    booking.duration = durationHours;
    booking.totalPrice = booking.basePrice * booking.dynamicMultiplier * durationHours;
    booking.status = 'completed';
    await booking.save();

    // Free the slot
    const slot = await ParkingSlot.findById(booking.slot);
    if (slot) {
      slot.status = 'available';
      slot.vehicleNumber = '';
      slot.occupiedSince = null;
      await slot.save();
    }

    res.json({
      message: 'Checkout complete!',
      booking,
      totalCharge: Math.round(booking.totalPrice)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parking/nearest
 * Find nearest available parking lots from user's location.
 * NEW feature — uses Haversine shortest path algorithm.
 */
router.get('/nearest', async (req, res) => {
  try {
    const { lat, lng, limit } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query params required.' });
    }

    const lots = await ParkingLot.find({ isActive: true });

    // Build lots with availability data
    const lotsWithAvailability = await Promise.all(
      lots.map(async (lot) => {
        const availableSlots = await ParkingSlot.countDocuments({ lot: lot._id, status: 'available' });
        return {
          ...lot.toObject(),
          availableSlots
        };
      })
    );

    const nearest = findNearestParking(
      lotsWithAvailability,
      parseFloat(lat),
      parseFloat(lng),
      parseInt(limit) || 5
    );

    res.json(nearest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parking/my-bookings
 * Get all bookings for the authenticated user.
 */
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('lot')
      .populate('slot')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
