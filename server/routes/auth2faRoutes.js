import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generate2FASecret, verify2FASetup, disable2FA } from "../controllers/auth2fa.controller.js";

const router = express.Router();

router.post("/setup", authMiddleware, generate2FASecret);
router.post("/verify-setup", authMiddleware, verify2FASetup);
router.post("/disable", authMiddleware, disable2FA);

export default router;
