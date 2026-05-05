# 🚗 Smart Traffic & Parking Management System

A full-stack web application combining smart parking management with real-time traffic congestion monitoring. Features include dynamic pricing, traffic heatmaps, congestion prediction, and nearest parking suggestion using shortest-path algorithms.

## 🌟 Key Features

| Feature | Source | Description |
|---------|--------|-------------|
| 🅿️ Smart Slot Detection | Adapted from [SMART-PARKING-SYSTEM](https://github.com/abhishekapk/SMART-PARKING-SYSTEM) | Real-time slot status tracking with visual grid |
| 🎫 Parking Booking | Adapted from [parking_management_system](https://github.com/risabhmishra/parking_management_system) | Nearest-to-entrance slot allocation, booking lifecycle |
| 💰 Dynamic Pricing | Enhanced from [EzyPark](https://github.com/priyanshu102002/EzyPark) | Time-of-day + occupancy-based surge pricing |
| 🔥 Traffic Heatmap | **New (Novel)** | Red/yellow/green zones on interactive map |
| 🧠 Congestion Prediction | **New (Novel)** | Weighted moving average algorithm on historical data |
| 🗺️ Nearest Parking Finder | **New (Novel)** | Haversine distance + shortest path to available lot |
| 📊 Admin Analytics | Inspired by EzyPark | Revenue charts, traffic density, parking usage |
| 🔐 Authentication | **New** | JWT-based login/signup with role-based access |

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Leaflet Maps + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Maps**: Leaflet with CARTO dark tiles
- **Charts**: Recharts (Area, Bar, Pie)

## 📁 Project Structure

```
Traffic_Management/
├── server/                    # Backend API
│   ├── server.js              # Express entry point
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── ParkingLot.js
│   │   ├── ParkingSlot.js
│   │   ├── Booking.js
│   │   └── TrafficData.js
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication
│   │   ├── parking.js         # Parking CRUD & booking
│   │   ├── traffic.js         # Traffic heatmap & prediction
│   │   └── admin.js           # Admin analytics
│   ├── utils/                 # Business logic
│   │   ├── pricing.js         # Dynamic pricing engine
│   │   ├── pathfinding.js     # Haversine nearest parking
│   │   └── congestion.js      # Congestion prediction
│   └── seed/seed.js           # Demo data seeder
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page views
│   │   ├── context/           # Auth state management
│   │   ├── api/               # Axios API client
│   │   └── index.css          # Design system
│   └── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Seed the Database

```bash
cd server
npm run seed
```

This creates demo data:
- 👤 **User**: `user@demo.com` / `password123`
- 🔑 **Admin**: `admin@demo.com` / `admin123`
- 6 parking lots (Delhi NCR area)
- 135+ parking slots
- 8 traffic zones with 7 days of historical data
- 15 sample bookings

### 3. Start the Servers

```bash
# Terminal 1 — Backend
cd server
npm start

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Parking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parking/lots` | All lots with availability |
| GET | `/api/parking/lots/:id` | Lot detail with slots |
| POST | `/api/parking/book` | Book a slot |
| POST | `/api/parking/release` | Checkout / release |
| GET | `/api/parking/nearest?lat=&lng=` | Nearest available |
| GET | `/api/parking/my-bookings` | User's bookings |

### Traffic
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic/heatmap` | All zones congestion |
| GET | `/api/traffic/predict/:zone` | Congestion prediction |
| POST | `/api/traffic/update` | Update sensor data |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/revenue` | Revenue breakdown |
| GET | `/api/admin/usage` | Parking usage per lot |
| GET | `/api/admin/traffic` | Traffic density summary |

## 🧠 Novel Algorithms

### Dynamic Pricing Engine
```
finalPrice = basePrice × timeMultiplier × occupancyMultiplier
```
- **Time multipliers**: Morning rush (1.5x), Evening rush (1.8x), Night discount (0.8x)
- **Occupancy multipliers**: >95% (2.5x surge), >85% (2.0x), <30% (0.8x discount)

### Congestion Prediction
Uses exponential weighted moving average on historical data:
- Filters by matching day-of-week and hour (±1 hour window)
- Applies 0.85 decay factor (recent data weighted more)
- Returns confidence level and trend direction

### Nearest Parking (Haversine)
Calculates great-circle distance between user's location and all lots, filters by availability, sorts by distance, estimates travel time at 30 km/h city speed.

## 📱 Screenshots

- **Landing Page**: Gradient hero with feature cards
- **Dashboard**: Interactive map with traffic heatmap overlay
- **Slot Grid**: Color-coded floor view for slot booking
- **Admin**: Revenue charts, occupancy pie, traffic bar graph

---

**Built with ❤️ using React, Node.js, MongoDB & Leaflet**
