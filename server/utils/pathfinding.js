/**
 * Pathfinding Utility — Nearest Parking Suggestion
 * Uses Haversine formula to calculate distance between two geo-points.
 * Sorts available parking lots by distance and returns the nearest ones.
 * NEW feature — enables "smart rerouting" to nearest available parking.
 */

/**
 * Calculate the Haversine distance between two lat/lng points.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearest parking lots with available slots from a given position.
 * @param {Array} lots - Array of parking lot objects with location and availability
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {number} [limit=5] - Maximum number of results
 * @returns {Array} Sorted array of lots with distance info
 */
function findNearestParking(lots, userLat, userLng, limit = 5) {
  const results = lots
    .filter(lot => lot.availableSlots > 0)
    .map(lot => ({
      ...lot,
      distance: haversineDistance(userLat, userLng, lot.location.lat, lot.location.lng),
      estimatedTime: null // Will be calculated below
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  // Estimate travel time (assuming avg 30 km/h in city traffic)
  results.forEach(lot => {
    lot.estimatedTime = Math.round((lot.distance / 30) * 60); // minutes
  });

  return results;
}

module.exports = { haversineDistance, findNearestParking };
