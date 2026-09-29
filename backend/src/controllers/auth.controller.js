import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Todos los campos son obligatorios",
        },
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "El email ya se encuentra registrado",
        },
      });
    }

    // Pendiente: generar passwordHash antes de crear el usuario.
    // Dependencia con BACK-002-S2.

  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor",
      },
    });
  }
};