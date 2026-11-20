import Category from "../models/Category.js";
import { sendError } from "../utils/apiError.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true })
      .select("name")
      .sort({ name: 1 });

    return res.status(200).json({
      categories: categories.map((category) => ({
        id: category._id,
        name: category.name,
      })),
    });
  } catch (error) {
    console.error("Error al listar categorías:", error);

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
    );
  }
};
