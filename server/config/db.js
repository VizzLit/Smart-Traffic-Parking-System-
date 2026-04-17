/**
 * MongoDB Connection Configuration
 * Connects to MongoDB using Mongoose with configurable URI.
 * Falls back to local MongoDB instance if no env var is set.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   const uri = "mongodb+srv://vedant:admin123@multirole.8tivzub.mongodb.net/traffic_db?retryWrites=true&w=majority";
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
