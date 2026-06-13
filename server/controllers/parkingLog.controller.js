import ParkingLog from "../models/ParkingLog.js";
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";

export const enterVehicle =  async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.bookingStatus !== "active")
    return res.status(400).json({ success: false, message: "Invalid booking" });

  // Check if already entered
  const existingLog = await ParkingLog.findOne({ bookingId, status: "active" });
  if (existingLog) return res.status(400).json({ success: false, message: "Already entered" });

  const log = await ParkingLog.create({ bookingId, entryTime: new Date() });

  res.json({ success: true, message: "Vehicle entered", log });
}

export const exitVehicle = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Find the active parking log
    const log = await ParkingLog.findOne({ bookingId, status: "active" });
    if (!log) {
      return res.status(400).json({ success: false, message: "No active entry found" });
    }

    // 2. Find the associated booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // 3. Update the parking log
    log.exitTime = new Date();
    log.status = "completed";
    await log.save();

    // 4. Update booking status to completed
    booking.bookingStatus = "completed";
    await booking.save();

    // 5. Increment available slots in the Parking collection
    const updatedParking = await Parking.findOneAndUpdate(
      { _id: booking.parkingId },
      { $inc: { availableSlots: 1 } },
      { new: true }
    );

    if (!updatedParking) {
      console.error(`⚠️ Failed to increment slots for parkingId: ${booking.parkingId}`);
    } else {
      console.log(`✅ Parking slot restored for ${updatedParking.name}. Available: ${updatedParking.availableSlots}`);
    }

    const duration = (log.exitTime - log.entryTime) / 1000 / 60; // duration in minutes

    res.json({ 
      success: true, 
      message: "Vehicle exited and slot recovered successfully", 
      log, 
      duration,
      availableSlots: updatedParking ? updatedParking.availableSlots : null
    });
  } catch (err) {
    console.error("❌ Exit vehicle error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}