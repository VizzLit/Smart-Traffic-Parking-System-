/**
 * Traffic Congestion Prediction Engine
 * Uses weighted moving average on historical data to predict
 * congestion levels for a given zone, day, and hour.
 * NEW feature — enables predictive traffic management.
 *
 * Algorithm:
 * 1. Collect historical data for the same zone, day-of-week, and hour.
 * 2. Apply exponential weighting (recent data weighted more heavily).
 * 3. Return predicted congestion level (0-100).
 */

/**
 * Predict congestion level for a zone at a specific day/hour.
 * @param {Array} historicalData - Array of { congestionLevel, timestamp } objects
 * @param {number} targetDay - Day of week (0=Sunday, 6=Saturday)
 * @param {number} targetHour - Hour of day (0-23)
 * @returns {Object} { predictedLevel, confidence, trend, dataPoints }
 */
function predictCongestion(historicalData, targetDay, targetHour) {
  // Filter data for matching day and hour (±1 hour window for more data)
  const relevant = historicalData.filter(d => {
    const date = new Date(d.timestamp);
    const dayMatch = date.getDay() === targetDay;
    const hourDiff = Math.abs(date.getHours() - targetHour);
    return dayMatch && hourDiff <= 1;
  });

  if (relevant.length === 0) {
    return { predictedLevel: 50, confidence: 'low', trend: 'stable', dataPoints: 0 };
  }

  // Sort by timestamp (most recent first)
  relevant.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Apply exponential weighting — recent data gets higher weight
  const decay = 0.85;
  let weightedSum = 0;
  let weightSum = 0;

  relevant.forEach((d, i) => {
    const weight = Math.pow(decay, i);
    weightedSum += d.congestionLevel * weight;
    weightSum += weight;
  });

  const predictedLevel = Math.round(weightedSum / weightSum);

  // Calculate trend by comparing recent vs older average
  const midpoint = Math.floor(relevant.length / 2);
  const recentAvg = relevant.slice(0, Math.max(midpoint, 1))
    .reduce((sum, d) => sum + d.congestionLevel, 0) / Math.max(midpoint, 1);
  const olderAvg = relevant.slice(midpoint)
    .reduce((sum, d) => sum + d.congestionLevel, 0) / Math.max(relevant.length - midpoint, 1);

  let trend = 'stable';
  if (recentAvg - olderAvg > 10) trend = 'increasing';
  else if (olderAvg - recentAvg > 10) trend = 'decreasing';

  // Confidence based on data volume
  let confidence = 'low';
  if (relevant.length >= 20) confidence = 'high';
  else if (relevant.length >= 10) confidence = 'medium';

  return { predictedLevel, confidence, trend, dataPoints: relevant.length };
}

/**
 * Get congestion category label and color for UI rendering.
 * @param {number} level - Congestion level (0-100)
 * @returns {Object} { label, color, emoji }
 */
function getCongestionCategory(level) {
  if (level >= 80) return { label: 'Severe', color: '#ef4444', emoji: '🔴' };
  if (level >= 60) return { label: 'Heavy', color: '#f97316', emoji: '🟠' };
  if (level >= 40) return { label: 'Moderate', color: '#eab308', emoji: '🟡' };
  if (level >= 20) return { label: 'Light', color: '#22c55e', emoji: '🟢' };
  return { label: 'Free Flow', color: '#10b981', emoji: '🟢' };
}

module.exports = { predictCongestion, getCongestionCategory };
