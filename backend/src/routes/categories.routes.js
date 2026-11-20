import express from "express";
import { listCategories } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", listCategories);

export default router;
