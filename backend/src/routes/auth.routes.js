import express from "express";
import {
  register,
  login,
  me,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import authLimiter from "../middlewares/authRateLimit.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authenticateToken, me);

export default router;
