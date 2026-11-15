import rateLimit from "express-rate-limit";
import { sendError } from "../utils/apiError.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(
      res,
      429,
      "TOO_MANY_REQUESTS",
      "Demasiados intentos. Probá de nuevo en unos minutos",
    ),
});

export default authLimiter;
