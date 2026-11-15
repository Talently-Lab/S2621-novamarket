import express from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, listProducts);
router.get("/:id", getProductById);

// Crear producto: acceso exclusivo para ADMIN.
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createProduct
);

// Actualizar producto completo: acceso exclusivo para ADMIN.
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateProduct
);

// Dar de baja un producto: acceso exclusivo para ADMIN.
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default router;
