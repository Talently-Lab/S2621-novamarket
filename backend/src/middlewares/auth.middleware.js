import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiError.js";

export const authenticateToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return sendError(
      res,
      401,
      "INVALID_TOKEN",
      "Se requiere un token de autenticación",
    );
  }

  const token = authorization.slice(7);

  if (!process.env.JWT_SECRET) {
    console.error("Falta configurar JWT_SECRET");
    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(
        res,
        401,
        "TOKEN_EXPIRED",
        "El token de autenticación ha expirado",
      );
    }

    return sendError(
      res,
      401,
      "INVALID_TOKEN",
      "El token de autenticación no es válido",
    );
  }
};