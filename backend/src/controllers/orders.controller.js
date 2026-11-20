import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { sendError } from "../utils/apiError.js";

const mapOrder = (order) => ({
  id: order._id.toString(),
  items: order.items.map((item) => ({
    productId: item.productId.toString(),
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  })),
  total: order.total,
  status: order.status,
  createdAt: order.createdAt,
});

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body ?? {};

    // 1. Validar que exista al menos un producto.
    if (!Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "La orden debe contener al menos un producto",
      );
    }

    // 2. Validar los identificadores y las cantidades.
    const productIds = new Set();

    for (const item of items) {
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item) ||
        !mongoose.isValidObjectId(item.productId)
      ) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "Uno de los productos tiene un ID inválido",
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "Las cantidades deben ser enteros mayores a cero",
        );
      }

      const productId = item.productId.toString();

      if (productIds.has(productId)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "No se permiten productos duplicados en una orden",
        );
      }

      productIds.add(productId);
    }

    // 3. Consultar los productos desde MongoDB.
    const products = await Product.find({
      _id: { $in: [...productIds] },
    });

    const productsById = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const orderItems = [];
    let total = 0;

    // 4. Validar disponibilidad y calcular los importes.
    for (const item of items) {
      const product = productsById.get(item.productId.toString());

      if (!product || !product.active) {
        return sendError(
          res,
          404,
          "PRODUCT_NOT_FOUND",
          "Producto no encontrado",
        );
      }

      if (product.stock < item.quantity) {
        return sendError(
          res,
          409,
          "INSUFFICIENT_STOCK",
          `Stock insuficiente para ${product.name}`,
        );
      }

      const unitPrice = product.salePrice ?? product.regularPrice;
      const subtotal = unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });

      total += subtotal;
    }

    // 5. Crear la orden asociada al usuario autenticado.
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      total,
      status: "CREATED",
    });

    // 6. Devolver la orden creada.
    return res.status(201).json({
      order: mapOrder(order),
    });
  } catch (error) {
    console.error("Error al crear orden:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};
  
// GET /api/orders
// CLIENT: consulta sus propios pedidos.
// ADMIN: consulta todos los pedidos.

export const getOrders = async (req, res) => {
  try {
    const { id, role } = req.user;

    const filter = role === "ADMIN"
      ? {}
      : { userId: id };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders: orders.map(mapOrder)
    });

  } catch (error) {
    console.error("Error al obtener órdenes:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor"
    );
  }
};
// GET /api/orders/:id
// CLIENT: consulta únicamente sus pedidos.
// ADMIN: puede consultar cualquier pedido.

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar el formato del identificador.
    if (!mongoose.isValidObjectId(id)) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "El ID de la orden no es válido"
      );
    }

    // 2. Buscar la orden en MongoDB.
    const order = await Order.findById(id);

    if (!order) {
      return sendError(
        res,
        404,
        "ORDER_NOT_FOUND",
        "Orden no encontrada"
      );
    }

    // 3. Verificar permisos de acceso.
    const isAdmin = req.user.role === "ADMIN";
    const isOwner = order.userId.toString() === req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return sendError(
        res,
        403,
        "FORBIDDEN",
        "No tienes permisos para consultar esta orden"
      );
    }

    // 4. Devolver la orden.
    return res.status(200).json({
      order: mapOrder(order)
    });

  } catch (error) {
    console.error("Error al consultar orden:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor"
    );
  }
};
