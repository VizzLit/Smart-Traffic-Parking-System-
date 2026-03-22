/**
 * Database Seed Script
 * Populates the database with realistic demo data for all features.
 * Run with: npm run seed
 *
 * Creates:
 * - 2 users (1 regular + 1 admin)
 * - 6 parking lots across a city (Delhi NCR area)
 * - 120+ parking slots distributed across lots
 * - 8 traffic zones with historical congestion data
 * - Sample bookings
 */
const mongoose = require('mongoose');
const User = require('../models/User');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const TrafficData = require('../models/TrafficData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_traffic_parking';

// ── Parking Lot Data ──────────────────────────────────────────────
const parkingLots = [
  {
    name: 'CP Central Parking',
    address: 'Connaught Place, New Delhi',
    location: { lat: 28.6315, lng: 77.2167 },
    totalSlots: 30,
    basePrice: 40,
    amenities: ['CCTV', 'EV Charging', '24/7 Security', 'Covered'],
    image: ''
  },
  {
    name: 'Saket Mall Parking',
    address: 'Select Citywalk, Saket, New Delhi',
    location: { lat: 28.5285, lng: 77.2190 },
    totalSlots: 25,
    basePrice: 50,
    amenities: ['CCTV', 'Valet', 'Covered', 'Restrooms'],
    image: ''
  },
  {
    name: 'Nehru Place Tech Hub',
    address: 'Nehru Place, New Delhi',
    location: { lat: 28.5494, lng: 77.2530 },
    totalSlots: 20,
    basePrice: 30,
    amenities: ['CCTV', 'Open Air', '24/7 Security'],
    image: ''
  },
  {
    name: 'IGI Airport Parking',
    address: 'Terminal 3, IGI Airport, New Delhi',
    location: { lat: 28.5562, lng: 77.1000 },
    totalSlots: 25,
    basePrice: 80,
    amenities: ['CCTV', 'Covered', '24/7 Security', 'Shuttle Service', 'EV Charging'],
    image: ''
  },
  {
    name: 'Cyber Hub Parking',
    address: 'DLF Cyber Hub, Gurugram',
    location: { lat: 28.4945, lng: 77.0880 },
    totalSlots: 20,
    basePrice: 60,
    amenities: ['CCTV', 'Covered', 'Valet', 'EV Charging'],
    image: ''
  },
  {
    name: 'Noida Sector 18 Parking',
    address: 'Atta Market, Sector 18, Noida',
    location: { lat: 28.5705, lng: 77.3219 },
    totalSlots: 15,
    basePrice: 25,
    amenities: ['CCTV', 'Open Air', 'Security'],
    image: ''
  }
];

// ── Traffic Zone Data ─────────────────────────────────────────────
const trafficZones = [
  { zoneName: 'Connaught Place', location: { lat: 28.6315, lng: 77.2167 }, radius: 800 },
  { zoneName: 'India Gate', location: { lat: 28.6129, lng: 77.2295 }, radius: 600 },
  { zoneName: 'Karol Bagh', location: { lat: 28.6514, lng: 77.1907 }, radius: 700 },
  { zoneName: 'Saket', location: { lat: 28.5244, lng: 77.2066 }, radius: 600 },
  { zoneName: 'Nehru Place', location: { lat: 28.5494, lng: 77.2530 }, radius: 500 },
  { zoneName: 'Dwarka', location: { lat: 28.5921, lng: 77.0460 }, radius: 900 },
  { zoneName: 'Cyber City Gurugram', location: { lat: 28.4945, lng: 77.0880 }, radius: 700 },
  { zoneName: 'Noida Sector 18', location: { lat: 28.5705, lng: 77.3219 }, radius: 600 }
];

// ── Seed Functions ────────────────────────────────────────────────

async function seedUsers() {
  await User.deleteMany({});

  const users = await User.create([
    {
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'password123',
      phone: '9876543210',
      vehicleNumber: 'DL-01-AB-1234',
      role: 'user'
    },
    {
      name: 'Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      phone: '9876543211',
      vehicleNumber: '',
      role: 'admin'
    }
  ]);

  console.log(`  ✅ Created ${users.length} users`);
  return users;
}

async function seedParkingLots() {
  await ParkingLot.deleteMany({});
  await ParkingSlot.deleteMany({});

  const createdLots = [];
  const slotTypes = ['compact', 'standard', 'standard', 'standard', 'large', 'ev'];
  const floors = ['G', 'G', '1', '1', '2'];

  for (const lotData of parkingLots) {
    const lot = await ParkingLot.create(lotData);
    createdLots.push(lot);

    // Create slots for this lot
    const slots = [];
    for (let i = 1; i <= lotData.totalSlots; i++) {
      // Randomly occupy some slots for realistic demo
      const isOccupied = Math.random() < 0.45;
      slots.push({
        lot: lot._id,
        slotNumber: i,
        floor: floors[Math.floor(Math.random() * floors.length)],
        type: slotTypes[Math.floor(Math.random() * slotTypes.length)],
        status: isOccupied ? 'occupied' : 'available',
        vehicleNumber: isOccupied ? `DL-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : '',
        occupiedSince: isOccupied ? new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000) : null
      });
    }
    await ParkingSlot.insertMany(slots);
  }

  console.log(`  ✅ Created ${createdLots.length} parking lots with ${parkingLots.reduce((s, l) => s + l.totalSlots, 0)} slots`);
  return createdLots;
}

async function seedTrafficData() {
  await TrafficData.deleteMany({});

  const dataPoints = [];
  const now = new Date();

  // Generate 7 days of hourly data for each zone
  for (const zone of trafficZones) {
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - dayOffset);
        timestamp.setHours(hour, 0, 0, 0);

        // Simulate realistic congestion patterns
        let baseCongestion = 30;
        // Morning rush
        if (hour >= 8 && hour <= 10) baseCongestion = 70;
        // Evening rush
        if (hour >= 17 && hour <= 20) baseCongestion = 80;
        // Midday moderate
        if (hour >= 11 && hour <= 16) baseCongestion = 50;
        // Late night low
        if (hour >= 22 || hour <= 5) baseCongestion = 15;

        // Weekend lower traffic
        const dayOfWeek = timestamp.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) baseCongestion *= 0.7;

        // Zone-specific variation (some zones busier than others)
        const zoneMultiplier = 0.7 + Math.random() * 0.6;

        const congestionLevel = Math.min(100, Math.max(0,
          Math.round(baseCongestion * zoneMultiplier + (Math.random() - 0.5) * 20)
        ));

        dataPoints.push({
          zoneName: zone.zoneName,
          location: zone.location,
          radius: zone.radius,
          congestionLevel,
          vehicleCount: Math.round(congestionLevel * 5 + Math.random() * 50),
          averageSpeed: Math.max(5, Math.round(60 - congestionLevel * 0.5 + (Math.random() - 0.5) * 10)),
          timestamp,
          dayOfWeek,
          hour
        });
      }
    }
  }

  await TrafficData.insertMany(dataPoints);
  console.log(`  ✅ Created ${dataPoints.length} traffic data points for ${trafficZones.length} zones`);
}

async function seedBookings(users, lots) {
  await Booking.deleteMany({});

  const demoUser = users[0];
  const bookings = [];

  // Create some sample completed bookings for analytics
  for (let i = 0; i < 15; i++) {
    const lot = lots[Math.floor(Math.random() * lots.length)];
    const slots = await ParkingSlot.find({ lot: lot._id });
    const slot = slots[Math.floor(Math.random() * slots.length)];

    const daysAgo = Math.floor(Math.random() * 7);
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - daysAgo);
    startTime.setHours(Math.floor(Math.random() * 14) + 7);

    const duration = Math.floor(Math.random() * 4) + 1;
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    bookings.push({
      user: demoUser._id,
      lot: lot._id,
      slot: slot._id,
      vehicleNumber: 'DL-01-AB-1234',
      startTime,
      endTime,
      duration,
      basePrice: lot.basePrice,
      dynamicMultiplier: 1 + Math.random() * 0.8,
      totalPrice: Math.round(lot.basePrice * (1 + Math.random() * 0.8) * duration),
      status: 'completed'
    });
  }

  await Booking.insertMany(bookings);
  console.log(`  ✅ Created ${bookings.length} sample bookings`);
}

// ── Main Seed Runner ──────────────────────────────────────────────
async function seed() {
  try {
    console.log('\n🌱 Seeding database...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('  📦 Connected to MongoDB\n');

    const users = await seedUsers();
    const lots = await seedParkingLots();
    await seedTrafficData();
    await seedBookings(users, lots);

    console.log('\n✨ Seed complete!\n');
    console.log('  Demo accounts:');
    console.log('  👤 User:  user@demo.com  / password123');
    console.log('  🔑 Admin: admin@demo.com / admin123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
