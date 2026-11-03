import express from "express";
import {
  listProducts,
  getProductById,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProductById);

export default router;
