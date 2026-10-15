import User from "../models/User.js";
import { hashPassword, validatePassword } from "../utils/password.js";
import { sendError } from "../utils/apiError.js";

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Todos los campos son obligatorios",
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "La contraseña no cumple los requisitos",
        {
          password: passwordError,
        },
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return sendError(
        res,
        409,
        "EMAIL_ALREADY_EXISTS",
        "El email ya se encuentra registrado",
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      lastName,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    if (error.code === 11000) {
      return sendError(
        res,
        409,
        "EMAIL_ALREADY_EXISTS",
        "El email ya se encuentra registrado",
      );
    }

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};
