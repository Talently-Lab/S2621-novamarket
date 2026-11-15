import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

const app = express();

// Encabezados HTTP de seguridad
app.use(helmet());

// Origen permitido mediante variable de entorno
const allowedOrigin =
  process.env.CORS_ORIGIN || "http://localhost:5173";

// Configuración de CORS
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "NovaMarket API funcionando",
  });
});

export default app;