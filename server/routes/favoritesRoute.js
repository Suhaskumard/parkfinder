import express from "express";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/favorites.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getFavorites);
router.post("/:locationId", toggleFavorite);

export default router;
