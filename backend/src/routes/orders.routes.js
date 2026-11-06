import express from "express";
import { createOrder,getOrders,getOrderById } from "../controllers/orders.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = express.Router();

// POST /api/orders - Crear una orden
// Acceso exclusivo para usuarios autenticados con rol CLIENT
router.post(
  "/",
  authenticateToken,
  authorizeRoles("CLIENT"),
  createOrder
);
// Consultar pedidos.
// CLIENT: únicamente sus pedidos.
// ADMIN: todos los pedidos.
router.get(
  "/",
  authenticateToken,
  authorizeRoles("CLIENT", "ADMIN"),
  getOrders
);
// Consultar una orden específica.
// CLIENT: únicamente sus propias órdenes.
// ADMIN: cualquier orden.
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("CLIENT", "ADMIN"),
  getOrderById
);
export default router;