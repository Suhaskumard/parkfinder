import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import User from "./models/User.js";
import Parking from "./models/Parking.js";
import Booking from "./models/Booking.js";
import ParkingLog from "./models/ParkingLog.js";

dotenv.config();

const rawData = [
  {
    name: "City Center Parking",
    location: "Sector 18, No_ida",
    pricePerHour: 40,
    status: "available",
    distance: "1km",
    capacity: 120,
    availableSlots: 45,
    isCovered: true,
    securityLevel: "high",
    rating: 4.5,
    openingTime: "08:00 AM",
    closingTime: "11:00 PM",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
    ],
  },
  {
    name: "Metro Parking Space",
    location: "Rajiv Chowk, Delhi",
    pricePerHour: 30,
    status: "closed",
    distance: "3km",
    capacity: 200,
    availableSlots: 0,
    isCovered: false,
    securityLevel: "medium",
    rating: 4.0,
    openingTime: "06:00 AM",
    closingTime: "10:00 PM",
    images: [
      "https://images.unsplash.com/photo-1611288875785-5c4fe859e1a3?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
  },
  {
    name: "Mall Basement Parking",
    location: "Phoenix Mall, Mumbai",
    pricePerHour: 50,
    status: "available",
    distance: "5km",
    capacity: 350,
    availableSlots: 120,
    isCovered: true,
    securityLevel: "high",
    rating: 4.8,
    openingTime: "24 Hours",
    closingTime: "24 Hours",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800"
    ],
  },
  {
    name: "Central Park Parking",
    location: "Park Street, Kolkata",
    pricePerHour: 20,
    status: "available",
    distance: "10km",
    capacity: 90,
    availableSlots: 21,
    isCovered: false,
    securityLevel: "low",
    rating: 3.9,
    openingTime: "07:00 AM",
    closingTime: "09:00 PM",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
    ],
  },
  {
    name: "Airport Multi-Level Parking",
    location: "IGI Airport, Delhi",
    pricePerHour: 80,
    status: "available",
    distance: "5km",
    capacity: 500,
    availableSlots: 210,
    isCovered: true,
    securityLevel: "high",
    rating: 4.7,
    openingTime: "24 Hours",
    closingTime: "24 Hours",
    images: [
      "https://images.unsplash.com/photo-1559329255-4b5b3e5f1e63?w=800",
      "https://images.unsplash.com/photo-1611288875785-5c4fe859e1a3?w=800",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"
    ],
  },
  {
    name: "Power Favoriter",
    email: "power.favorites@demo.com",
    password: "Demo@1234",
    role: "user",
    favorites: [],
  },
  {
    name: "Zero Faves",
    email: "zero.faves@demo.com",
    password: "Demo@1234",
    role: "user",
    favorites: [],
  },
  {
    name: "New User Empty",
    email: "newbie@demo.com",
    password: "Demo@1234",
    role: "user",
    favorites: [],
  },
];

// Define specific static parking lots
const staticParkingLots = [
  {
    name: "Fully Occupied Lot",
    location: "Connaught Place, Delhi",
    pricePerHour: 45,
    status: "occupied",
    distance: "2km",
    capacity: 100,
    availableSlots: 0,
    isCovered: true,
    securityLevel: "medium",
    rating: 4.2,
    openingTime: "09:00 AM",
    closingTime: "08:00 PM",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
  },
  {
    name: "Under Repair Garage",
    location: "Bandra, Mumbai",
    pricePerHour: 0,
    status: "maintenance",
    distance: "4km",
    capacity: 200,
    availableSlots: 0,
    isCovered: true,
    securityLevel: "medium",
    rating: 4.1,
    openingTime: "24 Hours",
    closingTime: "24 Hours",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800"
    ],
  },
  {
    name: "Super Ultra Premium Covered Multi-Level Automated Smart Parking Facility — Phase III Extension Wing North Block",
    location: "Whitefield IT Corridor, Outer Ring Road, Bangalore, Karnataka 560066, India",
    pricePerHour: 75,
    status: "available",
    distance: "8km",
    capacity: 600,
    availableSlots: 300,
    isCovered: true,
    securityLevel: "high",
    rating: 4.4,
    openingTime: "06:00 AM",
    closingTime: "12:00 AM",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      "https://images.unsplash.com/photo-1559329255-4b5b3e5f1e63?w=800",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800"
    ],
  },
  {
    name: "Zero Slots But Open",
    location: "Sarojini Nagar, Delhi",
    pricePerHour: 20,
    status: "available",
    distance: "2km",
    capacity: 50,
    availableSlots: 0,
    isCovered: false,
    securityLevel: "low",
    rating: 3.2,
    openingTime: "08:00 AM",
    closingTime: "09:00 PM",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
  },
  {
    name: "Büro & Café Parking (Ñoida) — 'Premium' [Zone A]",
    location: "Straße 12, München – Süd; Near <Mall>",
    pricePerHour: 55,
    status: "available",
    distance: "3km",
    capacity: 80,
    availableSlots: 40,
    isCovered: true,
    securityLevel: "medium",
    rating: 4.3,
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      "https://images.unsplash.com/photo-1611288875785-5c4fe859e1a3?w=800"
    ],
  },
  {
    name: "🚗 Smart Park 🅿️ — EV Charging ⚡ Zone",
    location: "Koramangala 4th Block 🏙️, Bangalore",
    pricePerHour: 60,
    status: "available",
    distance: "2km",
    capacity: 120,
    availableSlots: 60,
    isCovered: true,
    securityLevel: "high",
    rating: 4.6,
    openingTime: "07:00 AM",
    closingTime: "10:00 PM",
    images: [
      "https://images.unsplash.com/photo-1559329255-4b5b3e5f1e63?w=800",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"
    ],
  },
  {
    name: "Stadium Parking Zone",
    location: "Chinnaswamy Stadium, Bangalore",
    pricePerHour: 50,
    status: "available",
    distance: "1km",
    capacity: 400,
    availableSlots: 178,
    isCovered: false,
    securityLevel: "medium",
    rating: 4.5,
    openingTime: "06:00 AM",
    closingTime: "11:00 PM",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
  },
  {
    name: "City Mall Roof Parking",
    location: "Sector 62, No_ida",
    pricePerHour: 35,
    status: "available",
    distance: "6km",
    capacity: 70,
    availableSlots: 35,
    isCovered: false,
    securityLevel: "low",
    rating: 3.7,
    openingTime: "09:00 AM",
    closingTime: "11:00 PM",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      "https://images.unsplash.com/photo-1559329255-4b5b3e5f1e63?w=800"
    ],
  },
  {
    name: "Full Contact Parking Hub",
    location: "Nariman Point, Mumbai",
    pricePerHour: 70,
    status: "available",
    distance: "1km",
    capacity: 160,
    availableSlots: 80,
    isCovered: true,
    securityLevel: "high",
    rating: 4.7,
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    images: [
      "https://images.unsplash.com/photo-1611288875785-5c4fe859e1a3?w=800",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800"
    ],
  },
  {
    name: "Local Market Parking",
    location: "Lajpat Nagar, Delhi",
    pricePerHour: 20,
    status: "closed",
    distance: "1km",
    capacity: 110,
    availableSlots: 0,
    isCovered: false,
    securityLevel: "low",
    rating: 3.8,
    openingTime: "09:00 AM",
    closingTime: "09:00 PM",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
  },
];

const MONGO_URI = process.env.MONGO_URI;
const parkingData = rawData.map((slot) => ({
  ...slot,
  _id: new mongoose.Types.ObjectId(),
}));

async function seedDB() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
    await Parking.deleteMany();
    await Parking.insertMany(parkingData);
    console.log("Parking data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("Database seeding failed:", err);
    process.exit(1);
  }
}

seedDB();
