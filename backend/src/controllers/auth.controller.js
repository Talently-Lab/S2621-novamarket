import User from "../models/User.js";
import {
   hashPassword,
   validatePassword,
   comparePassword,
} from "../utils/password.js";
import { sendError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

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


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Email y contraseña deben ser textos no vacíos",
      );
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return sendError(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Email o contraseña incorrectos",
      );
    }

    const passwordIsValid = await comparePassword(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      return sendError(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Email o contraseña incorrectos",
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET");
      return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        "Error interno del servidor",
      );
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      },
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash",
    );

    if (!user) {
      return sendError(
        res,
        401,
        "INVALID_TOKEN",
        "El usuario del token ya no existe",
      );
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al obtener el usuario autenticado:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};