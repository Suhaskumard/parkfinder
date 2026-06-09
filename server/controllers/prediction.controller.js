import Booking from "../models/Booking.js";
import ParkingLog from "../models/ParkingLog.js";

/**
 * GET /api/predictions/:parkingId
 *
 * Analyzes historical booking and occupancy data for a specific parking location
 * and returns predicted availability for the next 8 hours with confidence indicators.
 *
 * Algorithm:
 *  1. Pull all completed/active bookings for this parking
 *  2. Group by hour-of-day + day-of-week bucket to find occupancy patterns
 *  3. For each upcoming hour, look up the matching historical bucket
 *  4. Confidence = HIGH if ≥10 data points, MEDIUM if ≥3, LOW otherwise
 */
export const getPredictions = async (req, res) => {
  try {
    const { parkingId } = req.params;

    // Fetch all non-cancelled bookings for this parking location
    const bookings = await Booking.find({
      parkingId,
      bookingStatus: { $in: ["active", "completed"] },
    }).lean();

    if (bookings.length === 0) {
      // No historical data — return neutral predictions with low confidence
      return res.json({
        success: true,
        data: buildNeutralPredictions(),
        meta: { totalDataPoints: 0, message: "Insufficient historical data" },
      });
    }

    // Build occupancy buckets: key = "dayOfWeek-hour" (e.g. "1-9" = Monday 9am)
    // Value = { occupied: number, total: number }
    const buckets = {};

    for (const booking of bookings) {
      const date = new Date(booking.bookingDate);
      const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
      const startHour = date.getHours();
      const durationHours = Math.max(1, Math.ceil(booking.duration || 1));

      // Mark every hour this booking occupied a slot
      for (let h = 0; h < durationHours; h++) {
        const hour = (startHour + h) % 24;
        const key = `${dayOfWeek}-${hour}`;
        if (!buckets[key]) buckets[key] = { occupied: 0, total: 0 };
        buckets[key].occupied++;
      }
    }

    // Count total bookings per hour slot regardless of day to get "total" baseline
    // We use all-day average as total so occupancy rate = occupied / allDayTotal
    const hourlyTotal = {};
    for (const booking of bookings) {
      const hour = new Date(booking.bookingDate).getHours();
      hourlyTotal[hour] = (hourlyTotal[hour] || 0) + 1;
    }

    // Build predictions for the next 8 hours from now
    const now = new Date();
    const predictions = [];

    for (let i = 0; i < 8; i++) {
      const targetDate = new Date(now.getTime() + i * 60 * 60 * 1000);
      const dayOfWeek = targetDate.getDay();
      const hour = targetDate.getHours();
      const key = `${dayOfWeek}-${hour}`;

      const bucket = buckets[key];
      const dataPoints = bucket ? bucket.occupied : 0;

      // Also check same-hour across all days for a broader sample
      let crossDayOccupied = 0;
      let crossDayTotal = 0;
      for (let d = 0; d < 7; d++) {
        const crossKey = `${d}-${hour}`;
        if (buckets[crossKey]) {
          crossDayOccupied += buckets[crossKey].occupied;
          crossDayTotal++;
        }
      }

      // Weighted occupancy: 70% same-day-of-week pattern, 30% cross-day pattern
      let occupancyRate = 0;
      const sameDayRate =
        dataPoints > 0
          ? Math.min(1, dataPoints / Math.max(1, hourlyTotal[hour] || dataPoints))
          : null;
      const crossDayRate =
        crossDayTotal > 0
          ? Math.min(1, crossDayOccupied / Math.max(1, crossDayTotal * 2))
          : null;

      if (sameDayRate !== null && crossDayRate !== null) {
        occupancyRate = sameDayRate * 0.7 + crossDayRate * 0.3;
      } else if (sameDayRate !== null) {
        occupancyRate = sameDayRate;
      } else if (crossDayRate !== null) {
        occupancyRate = crossDayRate;
      } else {
        occupancyRate = 0.3; // default assumption: 30% occupied when no data
      }

      // Availability = inverse of occupancy, clamped 0–100
      const availabilityPct = Math.round(
        Math.max(0, Math.min(100, (1 - occupancyRate) * 100))
      );

      // Confidence based on total data points for this hour
      const totalForHour = hourlyTotal[hour] || 0;
      let confidence;
      if (totalForHour >= 10) confidence = "high";
      else if (totalForHour >= 3) confidence = "medium";
      else confidence = "low";

      predictions.push({
        hour: targetDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        hourRaw: hour,
        availabilityPct,
        confidence,
        dataPoints: totalForHour,
        label: getAvailabilityLabel(availabilityPct),
      });
    }

    return res.json({
      success: true,
      data: predictions,
      meta: {
        totalDataPoints: bookings.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate predictions",
    });
  }
};

function getAvailabilityLabel(pct) {
  if (pct >= 70) return "High";
  if (pct >= 40) return "Moderate";
  if (pct > 0) return "Limited";
  return "Full";
}

function buildNeutralPredictions() {
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    return {
      hour: t.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      hourRaw: t.getHours(),
      availabilityPct: 50,
      confidence: "low",
      dataPoints: 0,
      label: "Moderate",
    };
  });
}
