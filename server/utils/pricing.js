/**
 * Dynamic Pricing Engine
 * Calculates parking price based on occupancy rate, time of day, and demand.
 * Inspired by EzyPark's dynamic pricing concept — enhanced with
 * time-based surge multipliers and occupancy-driven pricing.
 *
 * Formula: finalPrice = basePrice × occupancyMultiplier × timeMultiplier
 */

/**
 * Get time-of-day multiplier.
 * Peak hours (8-10 AM, 5-8 PM) get higher pricing.
 * @param {number} hour - Hour of the day (0-23)
 * @returns {number} multiplier (1.0 - 1.8)
 */
function getTimeMultiplier(hour) {
  if (hour >= 8 && hour <= 10) return 1.5;   // Morning rush
  if (hour >= 17 && hour <= 20) return 1.8;  // Evening rush
  if (hour >= 11 && hour <= 16) return 1.2;  // Midday moderate
  if (hour >= 21 || hour <= 5) return 0.8;   // Night discount
  return 1.0;                                 // Default
}

/**
 * Get occupancy-based multiplier.
 * Higher occupancy = higher price (supply/demand).
 * @param {number} occupancyRate - Occupancy percentage (0-100)
 * @returns {number} multiplier (0.8 - 2.5)
 */
function getOccupancyMultiplier(occupancyRate) {
  if (occupancyRate >= 95) return 2.5;   // Almost full — surge pricing
  if (occupancyRate >= 85) return 2.0;   // Very high demand
  if (occupancyRate >= 70) return 1.5;   // High demand
  if (occupancyRate >= 50) return 1.2;   // Moderate demand
  if (occupancyRate >= 30) return 1.0;   // Normal
  return 0.8;                             // Low demand — discount
}

/**
 * Calculate dynamic price for a parking slot.
 * @param {number} basePrice - Base hourly price
 * @param {number} occupancyRate - Current lot occupancy (0-100)
 * @param {Date} [currentTime] - Current time (defaults to now)
 * @returns {Object} { finalPrice, timeMultiplier, occupancyMultiplier, surgeLevel }
 */
function calculateDynamicPrice(basePrice, occupancyRate, currentTime = new Date()) {
  const hour = currentTime.getHours();
  const timeMultiplier = getTimeMultiplier(hour);
  const occupancyMultiplier = getOccupancyMultiplier(occupancyRate);

  const finalPrice = Math.round(basePrice * timeMultiplier * occupancyMultiplier);

  // Determine surge level for UI display
  const totalMultiplier = timeMultiplier * occupancyMultiplier;
  let surgeLevel = 'normal';
  if (totalMultiplier >= 3.0) surgeLevel = 'extreme';
  else if (totalMultiplier >= 2.0) surgeLevel = 'high';
  else if (totalMultiplier >= 1.5) surgeLevel = 'moderate';

  return {
    finalPrice,
    timeMultiplier: +timeMultiplier.toFixed(2),
    occupancyMultiplier: +occupancyMultiplier.toFixed(2),
    totalMultiplier: +totalMultiplier.toFixed(2),
    surgeLevel
  };
}

module.exports = { calculateDynamicPrice, getTimeMultiplier, getOccupancyMultiplier };
