import express from "express";
import { getPredictions } from "../controllers/prediction.controller.js";

const router = express.Router();

// GET /api/predictions/:parkingId
// Returns predicted availability for the next 8 hours based on historical data
router.get("/:parkingId", getPredictions);

export default router;
