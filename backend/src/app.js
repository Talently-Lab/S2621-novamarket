import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "NovaMarket API funcionando",
    smokeTestVersion: '2',
  });
});

app.get('/api/ready', async (req, res) => {
  res.set('Cache-Control', 'no-store');

  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return res.status(503).json({ status: 'error', database: 'unavailable' });
    }

    await mongoose.connection.db.admin().ping({ timeoutMS: 3000 });
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    return res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

export default app;
