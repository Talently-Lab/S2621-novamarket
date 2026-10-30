import mongoose from "mongoose";
import Product from "../models/Product.js";
import { sendError } from "../utils/apiError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePositiveInt = (value, fallback) => {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

const mapProduct = (product) => ({
  id: product._id,
  name: product.name,
  description: product.description,
  brand: product.brand,
  regularPrice: product.regularPrice,
  salePrice: product.salePrice,
  category: product.category
    ? {
        id: product.category._id,
        name: product.category.name,
      }
    : null,
  stock: product.stock,
  images: product.images,
  specifications: product.specifications,
  active: product.active,
  featured: product.featured,
});

export const listProducts = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const parsedLimit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);

    if (page === null || parsedLimit === null) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "page y limit deben ser números enteros mayores a 0",
      );
    }

    const limit = Math.min(parsedLimit, MAX_LIMIT);
    const { search, category, featured, offer } = req.query;
    const filter = { active: true };

    if (search) {
      const pattern = new RegExp(escapeRegex(String(search).trim()), "i");
      filter.$or = [
        { name: pattern },
        { description: pattern },
        { brand: pattern },
      ];
    }

    if (category) {
      const categoryId = String(category).trim();

      if (!mongoose.isValidObjectId(categoryId)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "category debe ser el ID de la categoría",
          { category: "Usar el id devuelto por GET /api/categories" },
        );
      }

      filter.category = categoryId;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (offer === "true") {
      filter.salePrice = { $ne: null };
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products: products.map(mapProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al listar productos:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};
