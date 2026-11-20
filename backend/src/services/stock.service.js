import Product from "../models/Product.js";
import mongoose from "mongoose";

export const decrementStock = async (productId, quantity, session = null) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
  return {
    success: false,
    code: "INVALID_PRODUCT_ID",
    message: "El ID del producto no es válido",
  };
}
   
if (!Number.isInteger(quantity) || quantity <= 0) {
    return {
      success: false,
      code: "INVALID_QUANTITY",
      message: "La cantidad debe ser un entero mayor a cero",
    };
  }

const options = {
  returnDocument: "after",
};

  if (session) {
    options.session = session;
  }

const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      active: true,
      stock: { $gte: quantity },
    },
    {
      $inc: { stock: -quantity },
    },
    options,
  );

  if (product) {
    return {
      success: true,
      product,
    };
  }

const query = Product.findById(productId);

  if (session) {
    query.session(session);
  }

const existingProduct = await query;

  if (!existingProduct) {
    return {
      success: false,
      code: "PRODUCT_NOT_FOUND",
      message: "El producto no existe",
    };
  }

  if (!existingProduct.active) {
    return {
      success: false,
      code: "PRODUCT_INACTIVE",
      message: "El producto no está disponible",
    };
  }

  return {
    success: false,
    code: "INSUFFICIENT_STOCK",
    message: "No hay stock suficiente",
  };
};