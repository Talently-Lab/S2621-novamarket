import { sendError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(
        res,
        401,
        "INVALID_TOKEN",
        "Se requiere autenticación",
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        "FORBIDDEN",
        "No tenés permisos para realizar esta operación",
      );
    }

    next();
  };
};